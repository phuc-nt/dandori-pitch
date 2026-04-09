---
layout: default
title: Modules
parent: Architecture
nav_order: 1
description: "Per-module architecture: diagrams, data model, processing flow, tech specifics for all 13 Dandori modules."
---

# Modules

Each of the 13 Dandori modules with its own architecture diagram, data model, processing flow, and tech specifics.

Modules are grouped by harness component:

1. **Guides (feedforward)** — Context Hub, Skill Library
2. **Sensors (feedback)** — Quality Gates, Inline Sensors
3. **Orchestration** — Task Board, Approval Workflow, Hooks, Sub-agent Trace
4. **Tool governance** — MCP Tool Governance
5. **Observability** — Cost Attribution, Audit Log, Cross-agent Analytics
6. **Integration surface** — Web UI / CLI / REST API / MCP Server

---

## 1. Context Hub (5-layer)

**Purpose:** Inject the right context into every agent run. Lifted from per-laptop CLAUDE.md to organizational shared, versioned, inheritable.

**Architecture:**

```
                      ┌─────────────────┐
                      │   Context API   │
                      └────────┬────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Authoring   │       │   Assembly   │       │   Versioning │
│  (Web UI +   │       │  (per-run    │       │  (history,   │
│   import)    │       │  inheritance)│       │  diff,       │
└──────┬───────┘       └──────┬───────┘       │  rollback)   │
       │                      │               └──────┬───────┘
       │                      │                      │
       ▼                      ▼                      ▼
       └──────────────────────┼──────────────────────┘
                              │
                              ▼
       ┌─────────────────────────────────────────────┐
       │           context_layers table              │
       │  id, scope (company/project/team/agent/task)│
       │  content, version, parent_version,          │
       │  pii_tags, owner_id, created_at             │
       └─────────────────────────────────────────────┘
                              │
                              ▼
            Inheritance resolver (5 layers → 1 prompt block)
                              │
                              ▼
                        run.prompt_text
```

**Data model:**

```sql
CREATE TABLE context_layers (
  id              TEXT PRIMARY KEY,
  scope           TEXT NOT NULL,  -- 'company'|'project'|'team'|'agent'|'task'
  scope_id        TEXT NOT NULL,
  content         TEXT NOT NULL,
  version         INTEGER NOT NULL,
  parent_version  INTEGER,
  pii_tags        TEXT,           -- JSON array
  owner_id        TEXT NOT NULL,
  created_at      DATETIME NOT NULL
);
CREATE INDEX idx_context_scope ON context_layers(scope, scope_id, version);
```

**Processing flow (assembly at run time):**

```
1. Agent triggered with task_id, agent_id, project_id, team_id
2. Resolver fetches latest version of each layer:
     company → project → team → agent → task
3. Apply inheritance: child layers extend / override parent
4. Apply PII policy: strip layers tagged PII if agent lacks permission
5. Concatenate into final context block
6. Record context_versions = {company: 12, project: 3, team: 7, agent: 4, task: spec_id}
7. Return block to prompt assembler
```

**Ecosystem touch points:**
- **Confluence**: pages imported as context content (REST API + page tag → context layer)
- **Google Drive**: docs exported as markdown, injected as context source
- **GitHub**: README + ARCHITECTURE.md auto-import per repo (configurable)

**Tech:** TypeScript service + SQLite tables. Diff via simple line-based comparison (no Git dependency).

---

## 2. Skill Library (with progressive disclosure)

**Purpose:** Reusable prompt knowledge as a versioned, shareable, lazy-loaded library.

**Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│                   SKILL LIBRARY                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Authoring  │  │  Manifest    │  │   Versioning │  │
│  │  (Web/MD)    │  │  builder     │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                           │                              │
│                           ▼                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │             skills table                           │ │
│  │  id, name, manifest, full_content, version,        │ │
│  │  owner_team, created_at                            │ │
│  └────────────────────────────────────────────────────┘ │
│                           │                              │
│                           │                              │
│  ┌────────────────────────┴────────────────────────┐    │
│  │           agent_skills (many-to-many)            │    │
│  │  agent_id, skill_id, skill_version_pinned        │    │
│  └──────────────────────────────────────────────────┘    │
│                           │                              │
│                           ▼                              │
│         Manifest injected into system prompt             │
│         Full content fetched on-demand via               │
│         `fetch_skill` MCP tool                           │
└──────────────────────────────────────────────────────────┘
```

**Progressive disclosure flow:**

```
RUN START
  ▼
Inject in system prompt: { name, description, trigger_keywords }
  ▼
Agent decides "I need skill X"
  ▼
Agent calls Dandori MCP tool: fetch_skill(name="security-review")
  ▼
Dandori returns full content + logs usage
  ▼
Agent applies skill, continues run
  ▼
RUN END
  ▼
Usage analytics: which skills fetched, by which agent, in which task
```

**Data model:**

```sql
CREATE TABLE skills (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  manifest        TEXT NOT NULL,  -- short JSON: name, description, triggers
  full_content    TEXT NOT NULL,  -- the actual prompt knowledge
  version         INTEGER NOT NULL,
  owner_team_id   TEXT,
  created_at      DATETIME NOT NULL
);
CREATE TABLE agent_skills (
  agent_id        TEXT NOT NULL,
  skill_id        TEXT NOT NULL,
  pinned_version  INTEGER,        -- NULL = always latest
  attached_at     DATETIME NOT NULL,
  PRIMARY KEY (agent_id, skill_id)
);
CREATE TABLE skill_usage (
  run_id          TEXT NOT NULL,
  skill_id        TEXT NOT NULL,
  fetched_at      DATETIME NOT NULL
);
```

**Tech:** Manifest is ~200 tokens; full content can be 2-10k tokens. Token savings at fleet scale are significant — a team of 10 engineers running 50 runs/day across 5 attached skills can save ~500k tokens/day.

---

## 3. Quality Gates

**Purpose:** Run computational sensors after each agent run. Compute quality score. Track per-team trend over time.

**Architecture:**

```
              Run completes
                    │
                    ▼
        ┌───────────────────────┐
        │  Quality Gate Engine  │
        └───────────┬───────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    ┌──────┐    ┌──────┐    ┌──────┐
    │ TS / │    │ Lint │    │ Test │
    │ type │    │      │    │ scan │
    └──┬───┘    └──┬───┘    └──┬───┘
       │           │           │
       └───────────┼───────────┘
                   ▼
       ┌──────────────────────┐
       │   Score computation  │
       │  base 100             │
       │  - 10 per ts error    │
       │  - 5 per lint warn    │
       │  - 15 if no test      │
       │  - 5 if diff > 500    │
       └──────────┬───────────┘
                  ▼
        run.quality_score = N
        run.quality_breakdown = {...}
                  │
                  ▼
        Cross-run trend analytics
```

**Tech:** Each sensor is a subprocess invocation: `npx tsc --noEmit`, `eslint`, `vitest --run`. Outputs parsed into structured findings. Pluggable: project-level config selects which sensors run.

---

## 4. Inline Sensors (back-pressure during run)

**Purpose:** Expose sensors as MCP tools so agents call them mid-run and self-correct *before* finishing.

**Architecture:**

```
   Agent (mid-run, in Claude Code / Codex)
                    │
                    │ MCP tool call
                    ▼
   ┌──────────────────────────────────────┐
   │   Dandori MCP Server                  │
   │   exposes:                            │
   │     run_typecheck(file_paths[])       │
   │     run_lint(file_paths[])            │
   │     run_tests(scope)                  │
   │     check_security(diff)              │  ← inferential
   │     check_arch_fitness(file_paths[])  │  ← inferential
   └────────────┬─────────────────────────┘
                │
   ┌────────────┴───────────┐
   ▼                        ▼
Computational           Inferential
(local subprocess)      (secondary LLM call)
   │                        │
   ▼                        ▼
Structured findings    AI-generated review
   │                        │
   └────────────┬───────────┘
                ▼
   Returned to agent
   silent on success
   verbose on error
```

**Sensor chain definition:**

```yaml
# project: payments-service
sensor_chains:
  default:
    - run_typecheck
    - run_lint
    - run_tests
  migrations:
    - run_typecheck
    - run_tests
    - check_schema_match    # inferential, custom
    - check_security        # inferential, default
```

**Tech:** Computational sensors run in &lt;500ms. Inferential sensors call a smaller/faster model (e.g., Haiku) to keep latency &lt;5s. Output formatter follows HumanLayer pattern: `silent on success, verbose on error with file:line markers`.

---

## 5. Task Board (DAGs + phases + auto-wakeup)

**Purpose:** Coordinate multi-step agent work. Eliminate manual handoffs. Phase-aware orchestration.

**Architecture:**

```
              ┌──────────────────────┐
              │   Task Board UI      │
              │  (kanban + DAG view) │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Task service        │
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐      ┌──────────┐     ┌──────────┐
   │  CRUD   │      │ Resolver │     │ Wakeup   │
   │         │      │ (DAG +   │     │ scheduler│
   │         │      │  phases) │     │          │
   └─────────┘      └──────────┘     └──────────┘
                         │
                         ▼
   ┌──────────────────────────────────────┐
   │  tasks                                │
   │  id, project_id, phase, status,       │
   │  needs_approval, agent_id,            │
   │  parent_task_ids[], skill_tags[],     │
   │  deadline                             │
   └───────────┬──────────────────────────┘
               │
               ▼
   ┌──────────────────────────────────────┐
   │  task_dependencies                    │
   │  task_id, depends_on_task_id          │
   │  (cycle prevention enforced)          │
   └──────────────────────────────────────┘
```

**Auto-wakeup flow:**

```
Task T-3 (parent) completes successfully
         │
         ▼
Wakeup scheduler scans tasks_dependencies
         │
         ▼
Finds T-4, T-5 with depends_on = T-3
         │
         ▼
Each child: check if ALL parents complete
         │
         ▼
T-4: yes → wake up agent (spawn run)
T-5: no  → still waiting on T-3 + T-3.5
```

**Phase tags:** `research → concept → requirement → design → implement → test → deploy → maintain`

**Ecosystem:** Jira issue → task; phase → Jira workflow status mapping; deadline → Jira due date.

---

## 6. Approval Workflow

**Purpose:** Insert human review gates into agent execution. Audit-trail every approval.

**Architecture:**

```
   Task with needs_approval=true
                │
                ▼
   ┌────────────────────────┐
   │   Run completes        │
   │   → status = REVIEW    │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Notification fan-out  │
   │  - Slack interactive   │
   │  - Email               │
   │  - In-app inbox        │
   └──────────┬─────────────┘
              │
              ▼
   ┌────────────────────────┐
   │  Reviewer opens task   │
   │  Sees: prompt, context │
   │  versions, diff,       │
   │  quality results,      │
   │  self-explanation      │
   └──────────┬─────────────┘
              │
              ├─ approve ──▶ task.status = DONE, audit log
              │
              └─ reject  ──▶ task.status = TODO, rejection_reason logged
```

**Slack interactive:**

```
Slack message
  ┌───────────────────────────────────┐
  │ 🤖 Task T-4812 needs review       │
  │ payments-service / Add stripe...  │
  │                                   │
  │ [ View ] [ Approve ] [ Reject ]   │
  └───────────────────────────────────┘
        │            │           │
        ▼            ▼           ▼
     Open in     POST /approve  POST /reject
     Dandori UI  with reasoner  with reason
```

---

## 7. Lifecycle Hooks

**Purpose:** Engineer-pluggable scripts at lifecycle events. Versioned, sandboxed, org-shareable.

**Architecture:**

```
                    Run lifecycle
                          │
   ┌──────────────────────┼──────────────────────┐
   │                      │                      │
   ▼                      ▼                      ▼
before_context        before_run              after_run
_assembly                                     on_error
                                               on_approval_request
                                               on_budget_exceeded

   each event ──▶ hook registry lookup
                  ▼
        ┌──────────────────┐
        │  hooks table     │
        │  id, project_id, │
        │  event, script,  │
        │  enabled, owner, │
        │  version         │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Sandboxed exec   │
        │ - subprocess     │
        │ - 30s timeout    │
        │ - env: HOOK_*    │
        │ - stdin: JSON    │
        │ - stdout: JSON   │
        └────────┬─────────┘
                 │
                 ▼
        Return value handling
        (mutate prompt / veto / log)
```

**Example hook:**

```bash
#!/usr/bin/env bash
# hook: before_run
# fires before runtime is invoked
# input via stdin: {run_id, agent_id, prompt, context_versions}
# output via stdout: {action: "allow"|"veto", reason?: string}

PROMPT=$(jq -r '.prompt' <&0)

if echo "$PROMPT" | grep -q "DROP TABLE"; then
  echo '{"action":"veto","reason":"forbidden SQL pattern"}'
  exit 0
fi

echo '{"action":"allow"}'
```

**Tech:** Hooks run in subprocess isolation. Future: containerized execution for stronger sandbox.

---

## 8. Sub-agent Trace Observability

**Purpose:** Observe (not spawn) sub-agent activity inside a runtime's run. For audit, debug, cost roll-up.

**Architecture:**

```
   Adapter spawns runtime
              │
              │ runtime emits structured events
              │ (via stdout JSON or websocket)
              ▼
   ┌──────────────────────────────────┐
   │  Adapter event consumer          │
   │  parses sub-agent_start /         │
   │         sub-agent_end events      │
   └────────────┬─────────────────────┘
                │
                ▼
   ┌──────────────────────────────────┐
   │  sub_agent_traces                │
   │  id, parent_run_id, name,        │
   │  start, end, tokens, cost,       │
   │  output_summary, tool_calls[]    │
   └────────────┬─────────────────────┘
                │
                ▼
   Cost roll-up: sub_agent.cost
       → run.cost
       → task.cost
       → project.cost
```

**Tech:** Adapter protocol extension defines JSON event schema. Currently supported by Claude Code's `--json-output` mode; Codex CLI integration is in roadmap.

---

## 9. MCP Tool Governance

**Purpose:** Org-wide control over which MCP tools each agent sees, with description versioning + analytics.

**Architecture:**

```
   ┌───────────────────────────────────────┐
   │           MCP Registry                │
   │                                       │
   │  mcp_servers (id, url, owner, status) │
   │  mcp_tools   (server_id, name,        │
   │               description, version,   │
   │               token_estimate)         │
   │  agent_mcp_allowlist (agent_id,       │
   │                        server_id)     │
   └────────────┬──────────────────────────┘
                │
                ▼
   ┌───────────────────────────────────────┐
   │   Description linter                  │
   │   - flag bloated > 500 tokens         │
   │   - flag duplicates                   │
   │   - flag ambiguous names              │
   └────────────┬──────────────────────────┘
                │
                ▼
   ┌───────────────────────────────────────┐
   │   Adapter injection                   │
   │   on run start: filter tool list to   │
   │   per-agent allow-list                │
   └───────────────────────────────────────┘
```

**Tech:** Dandori does NOT host MCP servers. It governs which ones each agent can see. The actual MCP execution loop stays inside the runtime (inner harness).

---

## 10. Cost Attribution

**Purpose:** Break agent spend down to project / team / agent / task / model / phase / sub-agent.

**Architecture:**

```
   Run completes
        │
        ▼
   ┌──────────────────────────┐
   │  Adapter records:        │
   │  input_tokens,           │
   │  output_tokens,          │
   │  model_name              │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │  model_prices table      │
   │  (per million tokens)    │
   │  + cache pricing         │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │  v_agent_runs view       │
   │  computes cost_usd       │
   │  joining run + price     │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │  Roll-up engine          │
   │   run → task → project   │
   │   run → agent → team     │
   │   per-phase, per-day     │
   └──────────────────────────┘
```

**Tech:** `model_prices` is a configurable table with per-million-token rates. Easy to update when providers change pricing. View `v_agent_runs` returns enriched run records with computed cost.

---

## 11. Audit Log

**Purpose:** Immutable record of every mutation for compliance + incident replay.

**Architecture:**

```
   Any service mutates state
              │
              ▼
   ┌──────────────────────────┐
   │  Audit middleware         │
   │  intercepts CRUD ops      │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │  audit_events             │
   │  id, actor, entity,       │
   │  action, before, after,   │
   │  timestamp                │
   │  (append-only)            │
   └────────────┬─────────────┘
                │
                ▼
   Query API: time range, actor,
              entity, action filter
                │
                ▼
   Export: JSON / CSV / SOC2 PDF
```

**Tech:** Append-only table; no DELETE/UPDATE allowed (enforced by trigger). Optional: hash chain (current.hash = sha256(prev.hash + current.payload)) for tamper-evidence in production.

---

## 12. Cross-agent Analytics

**Purpose:** Compare agents across teams. Detect drift. Drive evaluations.

**Architecture:**

```
   Run records (runs table)
              │
              ▼
   ┌──────────────────────────┐
   │  Aggregation queries     │
   │  - per agent, per week:  │
   │     runs, success rate,  │
   │     avg quality, cost    │
   │  - trend deltas          │
   │  - cohort comparison     │
   └────────────┬─────────────┘
                │
                ▼
   ┌──────────────────────────┐
   │  Dashboard               │
   │  cross-agent table       │
   │  trend lines             │
   │  drill-down per agent    │
   └──────────────────────────┘
```

**Tech:** SQL views computed on demand. For team scale, &lt;1s query time. For enterprise scale (millions of runs), materialized views or read replica.

---

## 13. Integration surface (Web UI / CLI / REST API / MCP server)

**Purpose:** Same operations available via every interface. Engineers pick what fits their workflow.

**Architecture:**

```
                 ┌────────────────┐
                 │  Service layer │
                 │  (TypeScript)  │
                 └───────┬────────┘
                         │
       ┌─────────┬───────┼───────┬─────────┐
       ▼         ▼       ▼       ▼         ▼
   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐
   │ Web  │ │ REST │ │ CLI  │ │ MCP  │ │  Webhook │
   │ UI   │ │ API  │ │ tool │ │ srv  │ │  ingress │
   └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘
```

**Tech:**

- **Web UI**: server-rendered HTML + minimal JS, dark/light theme
- **REST API**: OpenAPI 3.0 spec, autogen clients
- **CLI**: single binary `dandori` shell wrapper around the REST API
- **MCP server**: Dandori operations exposed as MCP tools (`create_task`, `update_status`, `fetch_skill`, `run_typecheck`, etc.)
- **Webhook ingress**: Jira / GitHub / Slack callback endpoints

---

## See also

- [Architecture Overview]({% link architecture.md %}) — System overview, tech stack, deployment topologies
- [Ecosystem Integrations]({% link architecture-integrations.md %}) — How Dandori talks to Claude Code, Codex, Copilot, Jira, Confluence, GitHub, Google Drive, Slack
- [Use Case Flows]({% link architecture-use-cases.md %}) — End-to-end processing flows
