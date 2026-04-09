---
layout: default
title: Ecosystem Integrations
parent: Architecture
nav_order: 2
description: "How Dandori integrates with Claude Code, Codex, GitHub Copilot, Jira, Confluence, GitHub Enterprise, Google Drive, and Slack."
---

# Ecosystem Integrations

How Dandori talks to the tools your team already has. Every integration listed here uses **public APIs** and **standard auth flows** — no custom platform team required.

The 8 integrations are split into two groups:

- **Coding agent runtimes** (inner harness Dandori delegates to): Claude Code, Codex CLI, GitHub Copilot
- **Workspace tools** (sources, sinks, notifications): Jira, Confluence, GitHub Enterprise, Google Drive, Slack

---

## Coding agent runtimes

### Claude Code

**Direction:** Dandori → Claude Code (adapter) **AND** Claude Code → Dandori (MCP server)

```
  ┌─────────────────────────────────────────┐
  │              DANDORI                    │
  │                                         │
  │  ┌────────────────────────────┐         │
  │  │  Claude Code adapter       │         │
  │  │  - assembles 5-layer ctx   │         │
  │  │  - injects skill manifests │         │
  │  │  - applies hooks           │         │
  │  │  - spawns subprocess       │         │
  │  └─────────────┬──────────────┘         │
  │                │                        │
  │  ┌─────────────│──────────────┐         │
  │  │ MCP server  │              │         │
  │  │ exposes:    │              │         │
  │  │  fetch_skill│              │         │
  │  │  run_*      │              │         │
  │  │  create_task│              │         │
  │  │  ...        │              │         │
  │  └─────────────┴──────────────┘         │
  └─────────┬───────────────────────────────┘
            │
            │ subprocess invocation +
            │ MCP over stdio/http
            ▼
  ┌─────────────────────────────────────────┐
  │         CLAUDE CODE (runtime)           │
  │                                         │
  │  - receives prompt via CLI args         │
  │  - reads CLAUDE.md from project         │
  │  - registers Dandori as MCP server      │
  │  - calls Dandori MCP tools mid-run      │
  │  - emits JSON events to stdout          │
  │    (sub-agent traces, tool calls)       │
  └─────────────────────────────────────────┘
```

**Outbound: Dandori spawns Claude Code**

```
1. Task picked up
2. Adapter assembles prompt:
     - Context Hub block (5 layers)
     - Skill manifests (not full content)
     - Task spec
     - Self-explanation directive
3. Apply before_run hooks
4. Spawn:
     claude-code --project=<workdir> \
                 --print "<prompt>" \
                 --json-output \
                 --mcp-config=dandori-mcp.json
5. Stream JSON events to event consumer
6. Capture exit code, output, trace
7. Apply after_run hooks
8. Run quality gates
```

**Inbound: Claude Code calls Dandori**

```
Claude Code (mid-run) → Dandori MCP server
  fetch_skill(name="security-review")     ◀── progressive disclosure
  run_typecheck(file_paths=["auth.ts"])   ◀── inline sensor
  run_lint(file_paths=["auth.ts"])        ◀── inline sensor
  run_tests(scope="auth")                 ◀── inline sensor
  create_subtask(spec="...")              ◀── DAG growth
```

**Auth:** Dandori spawns Claude Code as a subprocess of the Dandori service user. Claude Code uses its own ANTHROPIC_API_KEY (env var). Dandori never holds the API key.

---

### Codex CLI

**Direction:** Dandori → Codex (adapter only — Codex CLI does not yet support inbound MCP server registration in v1)

```
  ┌─────────────────────────────────────────┐
  │              DANDORI                    │
  │                                         │
  │  ┌────────────────────────────┐         │
  │  │  Codex adapter             │         │
  │  │  - same prompt assembly    │         │
  │  │  - assembles AGENTS.md     │         │
  │  │    file in workdir         │         │
  │  │  - spawns subprocess       │         │
  │  └─────────────┬──────────────┘         │
  └────────────────┼────────────────────────┘
                   │
                   ▼
            codex run --workdir=<...>
                   │
                   ▼
  ┌─────────────────────────────────────────┐
  │           CODEX CLI (runtime)           │
  │                                         │
  │  - reads AGENTS.md                      │
  │  - executes task                        │
  │  - writes output                        │
  └─────────────────────────────────────────┘
```

**Tech:** Codex adapter writes the assembled context as `AGENTS.md` in a temporary workdir, then runs `codex run`. Output is captured via stdout. Quality gates run after.

**Auth:** Codex CLI uses its own OPENAI_API_KEY. Dandori spawns it as a subprocess.

---

### GitHub Copilot

**Direction:** Copilot → Dandori (via MCP) — Copilot does not run from CLI; Dandori provides context **to** Copilot inside the IDE.

```
  Engineer in VS Code with Copilot
                │
                │ Copilot Chat sends MCP request
                ▼
  ┌─────────────────────────────────────────┐
  │       Dandori MCP Server                │
  │  exposes Dandori tools to Copilot       │
  │                                         │
  │  Tools:                                 │
  │   - get_context(task_id)                │
  │   - fetch_skill(name)                   │
  │   - get_team_standards()                │
  │   - lookup_audit(query)                 │
  └────────────┬────────────────────────────┘
               │
               ▼
       Returns to Copilot, which threads
       the response into the chat UX
```

**Tech:** Dandori MCP server runs as a local HTTP server on the engineer's laptop OR as a remote server with API key auth. Copilot is configured via VS Code MCP extension.

**Use case:** engineer asks Copilot "how do we handle PII in payments?" → Copilot calls `get_context(task_id=current)` → Dandori returns Company Layer 1 (security policy) + Project Layer 2 (payments stack) → Copilot answers with grounded context.

---

## Workspace tools

### Jira

**Direction:** Bidirectional. Webhook in for issue events; REST out for status sync.

```
  ┌──────────────┐                    ┌──────────────┐
  │     JIRA     │                    │   DANDORI    │
  │              │                    │              │
  │  Issue       │   webhook          │  Webhook     │
  │  created  ───┼──────────────────▶│  ingress     │
  │              │                    │     │        │
  │              │                    │     ▼        │
  │              │                    │  Task        │
  │              │                    │  service     │
  │              │                    │     │        │
  │              │                    │     │        │
  │  Issue       │   REST PUT         │     │        │
  │  status   ◀──┼────────────────────┼─────┘        │
  │  updated     │                    │              │
  └──────────────┘                    └──────────────┘
```

**Mapping:**

| Jira | Dandori |
|---|---|
| Issue | Task |
| Issue type | Task phase tag (Story → implement, Spike → research, etc.) |
| Sprint | Project sub-grouping |
| Assignee | Owner (user) |
| Labels | Skill tags |
| Status | Task status (TODO / In Progress / In Review / Done) |
| Due date | Task deadline |

**Tech:** Jira webhook → POST `/api/integrations/jira/webhook` → task created or updated. Dandori maintains `external_id` mapping for bidirectional sync. Status changes in Dandori push back via `PUT /rest/api/3/issue/{key}`.

**Auth:** Jira API token + user email, stored as env vars. Webhook signed with shared secret.

---

### Confluence

**Direction:** Inbound (read-only). Pages imported as Context Hub source content.

```
  ┌──────────────┐                    ┌──────────────┐
  │  CONFLUENCE  │                    │   DANDORI    │
  │              │                    │              │
  │  Space:      │                    │  Context     │
  │  payments    │                    │  importer    │
  │              │  REST GET          │     │        │
  │  Page:       │  /content/{id}     │     ▼        │
  │  "API spec"  │ ◀──────────────────┤  Convert     │
  │              │                    │  to markdown │
  │  Page:       │                    │     │        │
  │  "Security   │                    │     ▼        │
  │   review"    │                    │  Context Hub │
  │              │                    │  layer       │
  └──────────────┘                    │  (project)   │
                                      └──────────────┘
```

**Mapping:**

| Confluence | Dandori |
|---|---|
| Space | Project |
| Labels | PII tags + classification |
| Page | Context layer source content |
| Version history | Context Hub version history |

**Tech:** Periodic sync (cron) or webhook on page update. Pages converted from Confluence storage format → markdown via Atlassian's REST API + a converter library. Synced pages tagged with `source: confluence:page-id` so they can be re-pulled.

**Auth:** Confluence Cloud API token; on-prem uses Personal Access Token.

---

### GitHub Enterprise

**Direction:** Bidirectional. Reads code + PR state; writes PR status checks + comments.

```
  ┌──────────────┐                    ┌──────────────┐
  │    GITHUB    │                    │   DANDORI    │
  │  ENTERPRISE  │                    │              │
  │              │                    │              │
  │  Repo: app   │  GitHub App        │  GH App      │
  │              │  events            │  webhook     │
  │  Pull        │ ──────────────────▶│  ingress     │
  │  request     │                    │     │        │
  │  opened      │                    │     ▼        │
  │              │                    │  Task        │
  │              │                    │  resolver    │
  │              │                    │     │        │
  │              │  REST POST         │     │        │
  │  Status      │ ◀──────────────────┤  Apply       │
  │  check       │  /check-runs       │  status:     │
  │  pending →   │                    │  pending →   │
  │  success     │                    │  success     │
  │              │                    │              │
  │  Comment on  │  REST POST         │  Post        │
  │  PR with     │ ◀──────────────────┤  self-       │
  │  Dandori     │                    │  explanation │
  │  summary     │                    │              │
  └──────────────┘                    └──────────────┘
```

**Use cases:**
1. **Agent-generated PR** — Claude Code via Dandori opens PR; Dandori posts summary (cost, quality, sub-agent trace) as PR comment
2. **PR triggers a task** — `dandori review` label on a PR creates a Dandori task for ReviewerBot
3. **Status check gate** — task in In Review blocks PR merge via failing status check; on approval, status flips to success

**Tech:** GitHub App with permissions: `contents:read`, `pull_requests:write`, `checks:write`. Webhook signed with HMAC.

**Auth:** GitHub App installation token (auto-rotated).

---

### Google Drive (Google Workspace)

**Direction:** Inbound (read-only). Already shipped in current Dandori (Phase 5.1).

```
  ┌──────────────┐                    ┌──────────────┐
  │ GOOGLE DRIVE │                    │   DANDORI    │
  │              │                    │              │
  │  Doc:        │                    │  OAuth2      │
  │  "team       │   OAuth2 flow      │  client      │
  │   playbook"  │ ◀──────────────────┤              │
  │              │                    │     │        │
  │              │   REST export      │     ▼        │
  │              │ ──────────────────▶│  Drive       │
  │              │  text/markdown     │  importer    │
  │              │                    │     │        │
  │              │                    │     ▼        │
  │              │                    │  Context     │
  │              │                    │  layer       │
  │              │                    │  (team or    │
  │              │                    │   project)   │
  └──────────────┘                    └──────────────┘
```

**Tech:** Drive API v3 + Docs API. Documents exported via `files.export` with `mimeType=text/markdown`. Mapping configurable: which folder ID → which Dandori project / team / agent. Re-sync on demand or on a schedule.

**Auth:** OAuth2 with refresh tokens. Per-user consent for read-only Drive access. Tokens encrypted at rest.

---

### Slack

**Direction:** Bidirectional. Outbound notifications + interactive approvals; inbound slash commands.

```
  ┌──────────────┐                    ┌──────────────┐
  │    SLACK     │                    │   DANDORI    │
  │              │                    │              │
  │              │   Webhook POST     │  Notifier    │
  │  #payments   │ ◀──────────────────┤  service     │
  │  channel     │   message          │              │
  │              │                    │              │
  │              │                    │              │
  │  User clicks │   Interaction      │  Slack       │
  │  [Approve]   │   payload          │  webhook     │
  │              │ ──────────────────▶│  ingress     │
  │              │                    │     │        │
  │              │                    │     ▼        │
  │              │                    │  Approval    │
  │              │                    │  service     │
  │              │                    │              │
  │              │   /dandori task    │              │
  │              │   create ...       │              │
  │  User runs   │ ──────────────────▶│  Slash       │
  │  slash cmd   │                    │  command     │
  │              │                    │  handler     │
  └──────────────┘                    └──────────────┘
```

**Notification types:**
- Run completed (with cost + quality)
- Task needs approval (with interactive Approve/Reject buttons)
- Budget threshold reached
- Quality gate failed
- Hook fired

**Slash commands:**
- `/dandori task create <title>` — quick task creation
- `/dandori status <task-id>` — check status
- `/dandori cost today` — quick cost view
- `/dandori review` — list tasks waiting on me

**Tech:** Slack Bot user + signing secret for inbound verification. Block Kit for interactive messages. Slash commands map to existing REST API endpoints.

**Auth:** Bot token + signing secret stored as env vars.

---

## Optional integrations (roadmap)

| Tool | Direction | Phase |
|---|---|---|
| Notion | Inbound (context import) | Roadmap |
| Linear | Bidirectional (task sync) | Roadmap |
| Microsoft Teams | Bidirectional notifications | Roadmap |
| GitLab | Bidirectional (alternative to GitHub) | Roadmap |
| Datadog / Grafana | Outbound (metric export) | Roadmap |

---

## Integration security model

| Integration | Auth | Secrets storage | Rotation |
|---|---|---|---|
| Claude Code | Subprocess; uses host ANTHROPIC_API_KEY env | Host env vars | Manual (Anthropic console) |
| Codex CLI | Subprocess; uses host OPENAI_API_KEY env | Host env vars | Manual (OpenAI console) |
| GitHub Copilot (MCP) | API key per Copilot instance | Sealed in dandori secrets dir | On-demand |
| Jira | API token + user email | Sealed | On-demand |
| Confluence | API token | Sealed | On-demand |
| GitHub Enterprise | GitHub App installation token | Auto-rotated by GitHub | Auto |
| Google Drive | OAuth2 + refresh token | Encrypted in DB | Auto refresh |
| Slack | Bot token + signing secret | Sealed | On-demand |

**Principle:** Dandori never holds AI provider credentials directly. Coding agent runtimes hold them. Dandori holds workspace tool credentials (Jira, GitHub, etc.) because no other layer can.

---

## See also

- [Architecture Overview]({% link architecture.md %}) — System architecture, tech stack, deployment topologies
- [Modules]({% link architecture-modules.md %}) — Per-module diagrams and data model
- [Use Case Flows]({% link architecture-use-cases.md %}) — End-to-end processing flows that use these integrations
