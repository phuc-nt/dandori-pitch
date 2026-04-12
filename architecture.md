---
layout: default
title: Architecture
nav_order: 6
description: "Technical architecture: system overview, tech stack, adapter layer, ecosystem integrations, deployment topologies."
---

# Architecture

How Dandori works technically — designed so **any team can pilot it** using tools they already have.

---

## System overview

```
┌────────────────────────────────────────────────────────────────┐
│                          USERS                                 │
│   Engineers (workspace)  ·  Tech leads  ·  Leadership          │
└──────────────────────────────┬─────────────────────────────────┘
                               │
              Web UI · CLI · REST API · MCP server
                               │
┌──────────────────────────────▼─────────────────────────────────┐
│                          DANDORI                                │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐│
│  │Context Hub │ │ Task Board │ │Skill Lib   │ │ Quality Gates││
│  │ (5 layers) │ │(DAGs+phase)│ │(progressive)│ │ + Sensors    ││
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘│
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐│
│  │ Approval   │ │  Hooks     │ │ MCP Tool   │ │  Sub-agent   ││
│  │ Workflow   │ │(lifecycle) │ │ Governance │ │    Trace     ││
│  └────────────┘ └────────────┘ └────────────┘ └──────────────┘│
│  ┌────────────┐ ┌────────────┐ ┌──────────────────────────────┐│
│  │    Cost    │ │   Audit    │ │  Cross-agent Analytics      ││
│  │Attribution │ │    Log     │ │                              ││
│  └────────────┘ └────────────┘ └──────────────────────────────┘│
│                                                                 │
│            ┌─────────────────────────────────┐                  │
│            │  Adapter layer (outer ↔ inner)  │                  │
│            └─────────────────────────────────┘                  │
└───────┬──────────┬──────────┬──────────┬───────────────────────┘
        ▼          ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
   │ Claude │ │ Codex  │ │Copilot │ │  Custom  │
   │  Code  │ │  CLI   │ │ (IDE)  │ │  models  │
   └────────┘ └────────┘ └────────┘ └──────────┘
        │          │          │          │
        └──────────┴──────────┴──────────┘
                       │
              ┌────────▼─────────┐
              │   AI providers   │
              │ Anthropic · OAI  │
              │ Google · local   │
              └──────────────────┘

    ┌──── Ecosystem integrations (sources / sinks) ────┐
    │  Jira · Confluence · GitHub · Google Drive · Slack │
    └───────────────────────────────────────────────────┘
```

---

## Tech stack

Single Node.js process, no Kubernetes required.

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js 24 LTS | Single language, large ecosystem |
| Language | TypeScript (strict) | Type safety on fast-moving codebase |
| Web framework | Express | Boring, stable |
| Database | SQLite (pilot) → Postgres (production) | Single binary for pilots; Postgres for scale |
| Frontend | Server-rendered HTML + minimal JS | No SPA build step |
| Adapters | Out-of-process subprocesses | Isolated failure domain |
| MCP server | Built-in | Lets Claude Code / Codex talk to Dandori from IDE |
| Auth | API keys → SSO/OIDC | Simple start, enterprise-ready later |

---

## Adapter layer

The boundary between outer and inner harness. Dandori assembles the outer harness (context, skills, sensors, approval) and hands the final prompt to the runtime. The runtime handles the inner harness.

```
  Dandori assembles:                 Runtime handles:
  ┌──────────────────┐              ┌──────────────────┐
  │ Context (5 layers)│              │ Tool execution    │
  │ Skills (resolved) │──▶ prompt ──▶│ Sub-agent spawn  │
  │ Sensor config     │              │ Sandbox / bash    │
  │ Budget limits     │              │ Context compaction│
  └──────────────────┘              └──────────────────┘
         OUTER                              INNER
```

Each adapter (Claude Code, Codex, Copilot, custom) implements one interface: accept assembled prompt, return run record with tokens/cost/output/exit code.

---

## Ecosystem integrations

| Tool | Direction | Purpose |
|---|---|---|
| Claude Code | Adapter out + MCP in | Spawn with prompt; MCP lets Claude Code query Dandori |
| Codex CLI | Adapter out | Same pattern |
| GitHub Copilot | MCP in | Consumes Dandori context via MCP |
| Jira | Webhook in + REST out | Issues become tasks; status syncs back |
| Confluence | REST in | Pages imported as context source |
| GitHub Enterprise | GitHub App in/out | PR creation, status checks, audit linkage |
| Google Drive | OAuth2 + REST in | Docs imported as context |
| Slack | Webhook + Bot in/out | Approval requests, notifications, in-Slack approvals |

All integrations use public APIs — no custom platform required.

---

## Data model (top level)

```
Project ──┬── Team ────┬── Agent ────┬── Run
          │            │             │     ├── tokens, cost, quality_score
          │            │             │     ├── context_versions (json)
          │            │             │     ├── sub_agent_traces[]
          │            │             │     └── audit_events[]
          │            │             │
          │            │             └── Skill (many-to-many)
          │            │
          │            └── Hook (lifecycle, versioned)
          │
          ├── Context layers (versioned, per level)
          │
          └── Task ──┬── dependencies (DAG)
                    ├── phase tag
                    ├── needs_approval
                    └── sensor_chain
```

Every mutation → immutable audit log. Every run → full prompt + context versions + cost + quality score. Every configurable entity → versioned with diff + rollback.

---

## Deployment

**Team pilot** (1 VM, 5-15 engineers):

```
  small VM (1 vCPU, 2GB)
  └── dandori (port 3200)
        ├── data.sqlite
        ├── audit.sqlite
        └── workspace/
```

**Production** (multi-team):

```
  Load balancer
  ├── dandori worker 1 ┐
  ├── dandori worker 2 ┤──▶ Postgres (HA) + S3 (large outputs)
  └── dandori worker N ┘
```

---

## Security posture

| Control | Pilot | Production |
|---|---|---|
| Auth | API keys (scoped) | SSO via OIDC/SAML |
| Authorization | Role-based (admin/lead/engineer/viewer) | + project-level RBAC |
| Data isolation | Row-level project scoping | + multi-tenant schemas |
| Audit | Append-only SQLite | Append-only Postgres + S3 archive |
| Secrets | Host env vars | KMS / Vault |
| Hooks | Sandboxed subprocess + timeout | + container isolation |

Dandori never holds AI provider credentials — runtimes do.

---

[Roadmap →]({{ site.baseurl }}{% link roadmap.md %}) Implementation milestones
{: .fs-5 }

[Data Inventory →]({{ site.baseurl }}{% link data-inventory.md %}) What data Dandori touches
{: .fs-5 }
