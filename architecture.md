---
layout: default
title: Architecture
nav_order: 6
has_children: true
description: "Technical architecture for teams piloting Dandori with their existing tools (Claude Code, Codex, Copilot, Jira, Confluence, GitHub Enterprise, Google Drive, Slack)."
---

# Architecture

How Dandori works, technically — designed so that **any company can pilot it at the team level** using the tools they already have, before scaling to an enterprise AI platform like AIPF.

This page is for technical decision-makers and platform engineers evaluating fit with existing systems. It links to detail pages for modules, ecosystem integrations, and end-to-end use case flows.

---

## The team-pilot premise

Most companies do not have an enterprise AI platform yet. They have:

- **Coding agents** — Claude Code, Codex, GitHub Copilot
- **Issue tracker** — Jira (or GitHub Issues)
- **Knowledge base** — Confluence (or Notion, Google Drive)
- **Source control** — GitHub Enterprise
- **Docs / drives** — Google Workspace (Drive, Docs)
- **Communication** — Slack

Dandori is designed to **slot into this exact stack** at team scale, with no platform team required. A 10-engineer team can stand it up in a day, prove the harness engineering value over 2-4 weeks, and only later (once it works) escalate to an enterprise rollout that may or may not include AIPF.

**Design principle:** every integration in this architecture is implementable with public APIs of the listed tools, no custom platform required.

---

## System overview — the ecosystem

```
┌────────────────────────────────────────────────────────────────────┐
│                          USERS                                     │
│   Engineers (workspace)    ·    Tech leads / PMs    ·    Leadership│
└──────────────────────────────────┬─────────────────────────────────┘
                                   │
                  Web UI · CLI · REST API · MCP server
                                   │
┌──────────────────────────────────▼─────────────────────────────────┐
│                            DANDORI                                 │
│                  (organizational outer harness)                    │
│                                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │ Context Hub  │ │  Task Board  │ │Skill Library │ │  Sensors   ││
│  │  (5 layers)  │ │ (DAGs+phase) │ │ (progressive)│ │ (inline)   ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │  Approval    │ │   Hooks      │ │ MCP Tool     │ │ Sub-agent  ││
│  │  Workflow    │ │ (lifecycle)  │ │ Governance   │ │   Trace    ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐│
│  │     Cost     │ │    Audit     │ │ Cross-agent  │ │  Quality   ││
│  │ Attribution  │ │     Log      │ │  Analytics   │ │   Gates    ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘│
│                                                                    │
│           ┌───────────────────────────────────────────┐            │
│           │  Adapter layer (outer ↔ inner harness)    │            │
│           └───────────────────────────────────────────┘            │
└─────┬──────────────┬──────────────┬──────────────┬─────────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐   ┌──────────────┐
│  Claude  │  │  Codex   │  │ GitHub   │   │ Custom local │
│   Code   │  │   CLI    │  │ Copilot  │   │   models     │
│ (runtime)│  │ (runtime)│  │  (IDE)   │   │ (Ollama, …)  │
└──────────┘  └──────────┘  └──────────┘   └──────────────┘
      │              │              │              │
      └──────────────┴──────────────┴──────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   AI providers   │
                  │ Anthropic, OAI,  │
                  │  Google, local   │
                  └──────────────────┘

      ┌──────── Ecosystem integrations (sources/sinks) ────────┐
      │                                                        │
   ┌──┴───┐  ┌─────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐ │
   │ Jira │  │Confluence│  │  GitHub  │  │Google│  │  Slack  │ │
   │ (task│  │ (context │  │Enterprise│  │ Drive│  │(notify+ │ │
   │ source)│ │  source) │  │(code+PR) │  │(docs)│  │ approve)│ │
   └──────┘  └─────────┘  └──────────┘  └──────┘  └─────────┘ │
      │                                                        │
      └────────────────────────────────────────────────────────┘
```

**Reading the diagram:**
- **Top half** — Users interact with Dandori through Web UI, CLI, REST API, or MCP. Dandori's 13 modules (organized by harness component) sit inside.
- **Middle (adapter layer)** — Dandori delegates execution to coding agent runtimes via adapters. Inner harness (sub-agents, sandbox, context compaction) belongs to the runtime.
- **Bottom (ecosystem integrations)** — Dandori reads and writes the existing tools every team already uses.

---

## Tech stack

Single Node.js process, no Kubernetes required, runs on a laptop for evaluation and on a small VM for team production.

| Layer | Choice | Why |
|---|---|---|
| **Runtime** | Node.js 24 LTS | Single language, large ecosystem, fast iteration |
| **Language** | TypeScript (strict) | Type safety on a fast-moving codebase |
| **Web framework** | Express | Boring, stable, plays well with everything |
| **Database** | SQLite (better-sqlite3) by default; Postgres for production scale | Single binary for team pilots; Postgres for enterprise |
| **Migrations** | Hand-written SQL (Phase 1) → Drizzle planned | Simple now, structured later |
| **Frontend** | Server-rendered HTML + minimal JS | No SPA build step, no React reconciler complexity |
| **Adapters** | Out-of-process subprocesses | Isolated failure domain; can run any CLI |
| **MCP server** | Built-in (exposes Dandori operations as MCP tools) | Lets Claude Code / Codex talk to Dandori from inside the IDE |
| **Auth** | API keys (Phase 1) → SSO/OIDC (Phase 3) | Simple to start, enterprise-ready when needed |
| **Observability** | Audit log table + structured JSON logs | No external dependency for team-scale pilot |
| **Optional integrations** | OAuth2 for Google Drive, GitHub App for GitHub Enterprise, webhooks for Jira/Slack | Standard auth flows |

**Single binary deployment for team pilot:**

```
team-laptop / team-vm
  └── dandori (Node.js process, port 3200)
        ├── data.sqlite          (state)
        ├── audit.sqlite         (immutable log)
        └── workspace/           (per-task scratch)
```

**Production / multi-team:**

```
behind a reverse proxy (Caddy/nginx)
  └── dandori (multiple Node.js workers, sticky sessions)
        ├── Postgres              (state)
        ├── object storage        (large run outputs)
        └── workspace volume      (shared)
```

---

## How Dandori touches each ecosystem tool (one-line summary)

| Tool | Direction | Purpose |
|---|---|---|
| **Claude Code** | Adapter (out) + MCP (in) | Adapter spawns Claude Code with assembled prompt; MCP server lets Claude Code query Dandori from inside the IDE |
| **Codex CLI** | Adapter (out) | Same pattern as Claude Code; adapter assembles + spawns |
| **GitHub Copilot** | MCP (in) | Copilot consumes Dandori context via MCP server (can also be triggered by webhook) |
| **Jira** | Webhook (in) + REST (out) | Jira issues become Dandori tasks on creation; status syncs back on completion |
| **Confluence** | REST (in) | Pages imported as Context Hub source content; tagged + versioned in Dandori |
| **GitHub Enterprise** | GitHub App (in/out) | PR creation, status checks, code retrieval, audit linkage |
| **Google Drive (GWS)** | OAuth2 + REST (in) | Docs imported as context source (already shipped in current Dandori) |
| **Slack** | Webhook + Bot (in/out) | Approval requests, run notifications, in-Slack approvals via interactive buttons |

**Detail per integration:** see [Ecosystem Integrations]({% link architecture-integrations.md %}).

---

## Module map → harness component → audience

The 13 modules grouped by which outer harness component they implement.

| Harness component | Dandori modules | Primary audience |
|---|---|---|
| **Guides** (feedforward — context, instructions) | Context Hub, Skill Library | 🤝 Both |
| **Sensors** (feedback — back-pressure) | Quality Gates, Inline Sensors | 👷 Engineers (with leadership trends) |
| **Orchestration** (DAGs, handoffs, lifecycle) | Task Board, Approval Workflow, Hooks, Sub-agent Trace | 👷 Engineers (with leadership audit) |
| **Tool governance** | MCP Tool Governance | 🤝 Both |
| **Observability** | Cost Attribution, Audit Log, Cross-agent Analytics | 🧭 Leadership |
| **Integration surface** | Web UI · CLI · REST API · MCP | 👷 Engineers (interface choice) |

**Detail per module:** see [Modules]({% link architecture-modules.md %}).

---

## Data model (top level)

The complete schema is in the modules page. Top-level entities:

```
Project ──┬── Team ────┬── Agent ────┬── Run
          │            │             │     ├── tokens, cost, quality_score
          │            │             │     ├── context_versions (json)
          │            │             │     ├── sub_agent_traces[]
          │            │             │     └── audit_events[]
          │            │             │
          │            │             └── Skill (many-to-many via agent_skills)
          │            │
          │            └── Hook (lifecycle scripts, versioned)
          │
          ├── Context layer (Project, Team, Agent, Task — versioned)
          │
          └── Task ──┬── dependencies (DAG)
                    ├── phase tag
                    ├── needs_approval
                    └── sensor_chain
```

**Every mutation** (create / update / delete / approve / hook execution / sensor result) is recorded in an **immutable audit log** with actor, timestamp, before/after values.

**Every run** records: prompt text sent to runtime, context versions used, cost attribution, quality score, sub-agent traces, sensor results, output, exit code.

**Every entity that engineers configure** (context layer, skill, hook, sensor chain, MCP tool description) is **versioned** with full diff + rollback. This is what makes the harness *organizational* rather than personal.

---

## Deployment topologies

### Topology 1: Team pilot (1-2 weeks to stand up)

```
  ┌──────────────────────────────┐
  │   small Linux VM or laptop   │
  │   1 vCPU, 2GB RAM, 20GB disk │
  │                              │
  │   ┌────────────────────┐     │
  │   │  Dandori           │     │
  │   │  + SQLite          │     │
  │   │  + workspace dir   │     │
  │   └────────────────────┘     │
  │                              │
  └──────────────┬───────────────┘
                 │
                 ▼ Caddy reverse proxy
        https://dandori.team.internal
```

- Single team (5-15 engineers)
- All ecosystem integrations work via OAuth / API tokens / webhooks
- Daily backup of `data.sqlite`
- No HA, no redundancy — acceptable for pilot

### Topology 2: Multi-team production

```
  ┌────────────────────────────────────┐
  │            Load balancer           │
  └──────────────┬─────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
  ┌──────────┐      ┌──────────┐
  │ Dandori  │      │ Dandori  │   ← stateless app workers
  │ worker 1 │      │ worker 2 │
  └────┬─────┘      └────┬─────┘
       │                 │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │   PostgreSQL    │   ← single source of truth
       │   (HA replica)  │
       └─────────────────┘
                │
                ▼
       ┌─────────────────┐
       │  Object storage │   ← large run outputs, attachments
       │  (S3-compat)    │
       └─────────────────┘
```

- 2+ workers behind LB
- Postgres with read replica for analytics queries
- Object storage for large run outputs
- Workspace volume shared via NFS or per-worker scratch + S3 sync

### Topology 3: Enterprise (AIPF integration)

This is where Dandori sits **on top** of an existing AIPF stack. See [AIPF Integration](/dandori-pitch/aipf-integration.html) for the full description (link-only — not in the public nav).

---

## Security posture

| Control | Team pilot | Production |
|---|---|---|
| **Authentication** | API keys with scoped access | SSO via OIDC/SAML, per-user + per-bot keys |
| **Authorization** | Role-based: admin / lead / engineer / read-only | Same + project-level RBAC |
| **Data isolation** | Row-level user/project scoping on every query | Same + multi-tenant DB schemas if needed |
| **Audit log** | Immutable SQLite append-only table | Append-only Postgres table + S3 archive |
| **Secret handling** | Host env vars + sealed secrets directory | KMS / Vault integration |
| **PII policy** | Per-project tag on context layers; block-listed for non-approved agents | Same + automatic scanning + Sentinel/SAST integration |
| **Network** | Behind reverse proxy with TLS | mTLS between workers; private VPC |
| **Hook execution** | Sandboxed subprocess with timeout | Same + container-level isolation |
| **MCP tool descriptions** | Dandori-versioned, editable only by admins | Same + signature verification |

---

## Why this architecture works for a team pilot

1. **No platform team needed.** Single binary, SQLite, runs on a small VM. One engineer can operate it.
2. **No new accounts.** Uses your existing Anthropic / OpenAI API keys via the runtimes (Claude Code, Codex). Dandori never holds your AI provider creds — it just spawns the runtimes you already have.
3. **No new auth system.** Phase 1 uses API keys; you can SSO later.
4. **Talks to tools you already have.** Jira, Confluence, GitHub, Google Drive, Slack — standard public APIs.
5. **Reversible.** All state in SQLite. If you decide to abandon, you have a single file to inspect or export. No vendor lock-in.
6. **Migrates upward.** When you outgrow team scale, swap SQLite for Postgres without changing schema. When you adopt AIPF, the adapter layer points at AIPF Runtime instead of local CLIs.

---

## Read next

- [Modules →]({% link architecture-modules.md %}) — All 13 modules with per-module diagrams, data model, processing flow, tech specifics
- [Ecosystem Integrations →]({% link architecture-integrations.md %}) — How Dandori talks to Claude Code, Codex, Copilot, Jira, Confluence, GitHub Enterprise, Google Drive, Slack
- [Use Case Flows →]({% link architecture-use-cases.md %}) — End-to-end processing flows for the 6 most common scenarios

---

## Related

- [Core Features →]({% link core-features.md %}) The 13 capabilities expressed as product features
- [Harness Engineering →]({% link harness-engineering.md %}) Why Dandori is structured this way
- [Use Cases →]({% link use-cases.md %}) Scenarios that drive these architectural choices
