---
layout: default
title: Use Case Flows
parent: Architecture
nav_order: 3
description: "End-to-end processing flows for the 6 most common Dandori scenarios in a team-pilot ecosystem."
---

# Use Case Flows

End-to-end processing flows for the most common scenarios when a team pilots Dandori with their existing tools (Claude Code, Codex, Copilot, Jira, Confluence, GitHub Enterprise, Google Drive, Slack).

Each flow shows: trigger → modules touched → ecosystem integrations involved → outputs.

---

## Flow 1: Jira issue → agent run → PR with audit

**Scenario:** PM creates a Jira issue. Dandori picks it up automatically, an agent implements it, opens a PR, posts a self-explanation comment, and waits for human approval.

```
┌──────┐                                                       ┌─────────────────┐
│ JIRA │                                                       │ GITHUB ENTERPRISE│
└──┬───┘                                                       └────────┬────────┘
   │                                                                    │
   │ PM creates issue                                                   │
   │ "Add Stripe webhook handler"                                       │
   │ labels: backend, payments, skill:webhook                           │
   │                                                                    │
   │ webhook                                                            │
   ▼                                                                    │
┌──────────────────┐                                                    │
│ Dandori webhook  │                                                    │
│ ingress          │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Task service     │                                                    │
│ - create task    │                                                    │
│ - phase=design   │                                                    │
│   (from issue    │                                                    │
│    type)         │                                                    │
│ - skill_tags     │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Skill matcher    │                                                    │
│ - finds best     │                                                    │
│   agent by skill │                                                    │
│   overlap        │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Wakeup scheduler │                                                    │
│ assigns          │                                                    │
│ PaymentImpl agent│                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Context Hub      │                                                    │
│ assemble:        │                                                    │
│  company v12     │                                                    │
│  project v3      │                                                    │
│  team v7         │                                                    │
│  agent v4        │                                                    │
│  task spec       │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ before_run hook  │                                                    │
│ check: SQL       │                                                    │
│ patterns,        │                                                    │
│ secret detection │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Claude Code      │  spawn subprocess in clean workdir                 │
│ adapter          │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         ▼                                                              │
   ╔═══════════════════════════════════════╗                            │
   ║       CLAUDE CODE (runtime)           ║                            │
   ║                                       ║                            │
   ║  · reads assembled prompt             ║                            │
   ║  · mid-run calls Dandori MCP:         ║                            │
   ║      fetch_skill("webhook-impl")      ║                            │
   ║      run_typecheck(...)               ║                            │
   ║      run_tests(...)                   ║                            │
   ║  · writes code, tests                 ║                            │
   ║  · git commit, push branch            ║                            │
   ╚═══════════════════════════════════════╝                            │
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ after_run hook   │                                                    │
│ - capture output │                                                    │
│ - quality gates  │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         │ git push                                                     │
         ├─────────────────────────────────────────────────────────────▶│
         │                                                              │
         │ open PR via GitHub App                                       │
         ├─────────────────────────────────────────────────────────────▶│
         │                                                              │
         │ POST PR comment with self-explanation                        │
         │ + cost + quality + sub-agent trace                           │
         ├─────────────────────────────────────────────────────────────▶│
         │                                                              │
         │ POST status check: pending (awaiting approval)               │
         ├─────────────────────────────────────────────────────────────▶│
         │                                                              │
         ▼                                                              │
┌──────────────────┐                                                    │
│ Approval         │                                                    │
│ workflow         │                                                    │
│ task → REVIEW    │                                                    │
└────────┬─────────┘                                                    │
         │                                                              │
         │ Slack notification ───────┐                                  │
         ▼                           ▼                                  │
┌──────────────────┐       ┌──────────────┐                             │
│ Audit log        │       │   SLACK      │                             │
│ - context vers   │       │  #payments   │                             │
│ - hook results   │       │  channel     │                             │
│ - quality score  │       │              │                             │
│ - cost ($0.42)   │       │  [Approve]   │                             │
│ - sub-agents     │       │  [Reject]    │                             │
└──────────────────┘       └──────┬───────┘                             │
                                  │                                     │
                                  │ user clicks Approve                 │
                                  ▼                                     │
                          ┌──────────────┐                              │
                          │ Approval     │                              │
                          │ service      │                              │
                          │ task → DONE  │                              │
                          └──────┬───────┘                              │
                                 │                                      │
                                 │ status check → success               │
                                 ├─────────────────────────────────────▶│
                                 │                                      │
                                 │ Jira issue → Done                    │
                                 ├──────────────────▶ JIRA              │
                                 │                                      │
                                 ▼                                      │
                          ┌──────────────┐                              │
                          │ Audit log    │                              │
                          │ approval     │                              │
                          │ recorded     │                              │
                          └──────────────┘                              │
```

**Modules touched:** Task Board, Skill Library (matching), Context Hub, Hooks, Claude Code adapter, Inline Sensors, Quality Gates, Approval Workflow, Audit Log, Cost Attribution

**Integrations:** Jira (in), GitHub Enterprise (out), Slack (out + in)

**Outcome:** Issue → PR → human approval → merge — all traceable, costed, audited.

---

## Flow 2: Multi-phase feature DAG

**Scenario:** Tech lead breaks a feature into a 5-task DAG covering research → design → implement → test → deploy. Each phase auto-wakes when its dependency completes.

```
  Tech lead in Dandori UI builds DAG:

  T-1 research-stripe-spec    [research]
        │
        ▼
  T-2 design-db-schema        [design]
        │
        ▼
  T-3 implement-handler       [implement]    needs_approval=true
        │
        ▼
  T-4 write-integration-tests [test]
        │
        ▼
  T-5 deploy-to-staging       [deploy]       needs_approval=true

  ┌──────────────────────────────────────────────────────────┐
  │ Time T0: T-1 starts                                       │
  │   Context: company + project + team + research-agent     │
  │   Confluence: pulls "Stripe API standards" page          │
  │   Runtime: Claude Code, sub-agents allowed               │
  │   Output: research summary doc                           │
  │   Cost: $0.31, Quality: 92                               │
  └──────────────────────────────────────────────────────────┘
         │
         │ T-1 complete → wakeup scheduler
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Time T1: T-2 auto-starts                                 │
  │   Context inherits T-1 output (via task dependency)      │
  │   Runtime: Claude Code                                   │
  │   Output: schema migration file                          │
  │   Cost: $0.18, Quality: 88                               │
  └──────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Time T2: T-3 auto-starts                                 │
  │   Context inherits T-1 + T-2 outputs                     │
  │   Inline sensors: typecheck, lint, security scan         │
  │   Sub-agents traced: SchemaImpl, TestWriter, ApiBinder   │
  │   Output: code + tests on branch                         │
  │   Cost: $0.84, Quality: 87                               │
  │   Status → REVIEW (needs_approval)                       │
  └─────────┬────────────────────────────────────────────────┘
            │
            │ Slack: notify #payments
            │ Reviewer approves
            │
            ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Time T3: T-4 auto-starts                                 │
  │   Context: + T-1, T-2, T-3 outputs                       │
  │   Runtime: Codex CLI                                     │
  │   Output: integration test suite                         │
  │   Cost: $0.41, Quality: 91                               │
  └──────────────────────────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Time T4: T-5 auto-starts                                 │
  │   Context: full DAG outputs                              │
  │   Sensor chain: pre-deploy security check                │
  │   Status → REVIEW (deploy gate)                          │
  │   Slack DM to ops engineer                               │
  │   On approval: GitHub Action triggered via webhook       │
  └──────────────────────────────────────────────────────────┘

  Total cost rolled up: $1.74
  Total time: ~4 hours wall clock
  Audit log: 5 runs, 11 sub-agents, 2 approvals, 0 rejections
```

**Modules touched:** Task Board (DAG), Context Hub (inheritance + task chain), Skill Library, Inline Sensors (sensor chain), Approval Workflow, Sub-agent Trace, Cost Attribution (roll-up), Audit Log

**Integrations:** Confluence (in), Claude Code, Codex CLI, Slack (notify + approve), GitHub Enterprise (deploy webhook)

**Outcome:** Feature shipped end-to-end with no manual handoffs between phases. Audit log explains every decision.

---

## Flow 3: Engineer publishes a team skill

**Scenario:** Senior engineer turns a proven prompt pattern into a versioned skill that all team agents inherit.

```
  Senior engineer in Dandori UI:

  ┌─────────────────────────────────────┐
  │ Skill Editor                        │
  │ ─────────────────────────────────── │
  │ Name: go-microservice-review        │
  │ Owner team: payments                │
  │ Triggers: ["go", "microservice",    │
  │            "code-review"]           │
  │ Description: "How we review Go      │
  │   microservices for payments team"  │
  │ Content (markdown):                 │
  │   # Review checklist                │
  │   1. Context cancellation on I/O   │
  │   2. Error wrapping                 │
  │   3. Metrics + trace spans         │
  │   ...                               │
  │ ─────────────────────────────────── │
  │ [Save as v1] [Attach to agents]    │
  └─────────────────┬───────────────────┘
                    │
                    ▼
            Save flow:
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ skills table                        │
  │ INSERT row: id, name, manifest,     │
  │ full_content, version=1, owner_team │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Audit log                           │
  │ entity=skill, action=create         │
  │ actor=alice, before=null, after=v1  │
  └─────────────────┬───────────────────┘
                    │
                    ▼
            Attach flow:
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Skill picker UI                     │
  │ Select agents:                      │
  │  ✓ ReviewerBot-payments             │
  │  ✓ ReviewerBot-auth                 │
  │  ✓ ReviewerBot-data                 │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ agent_skills table                  │
  │ 3 rows inserted                     │
  │ pinned_version=null (always latest) │
  └─────────────────┬───────────────────┘
                    │
                    ▼
            Slack notification:
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ #payments-eng                       │
  │ ─────────────────────────────────── │
  │ Alice published "go-microservice-   │
  │  review" v1 → attached to 3 agents  │
  │  [View skill] [See affected runs]   │
  └─────────────────────────────────────┘

  Next time any of those 3 agents runs:
  ┌─────────────────────────────────────┐
  │ System prompt now includes:         │
  │ skill manifest:                     │
  │  - go-microservice-review (v1)     │
  │     "How we review Go microservices"│
  │                                     │
  │ Agent calls fetch_skill(name=       │
  │   "go-microservice-review")         │
  │ when it sees a Go file in diff      │
  │                                     │
  │ Full content lazily loaded          │
  │ skill_usage row inserted            │
  └─────────────────────────────────────┘
```

**Modules touched:** Skill Library, Audit Log

**Integrations:** Slack (notify)

**Outcome:** Knowledge becomes org asset, not personal notes. Every attached agent picks up updates automatically. Usage analytics show which skills actually get fetched.

---

## Flow 4: Engineer asks Copilot a context-aware question

**Scenario:** Engineer in VS Code asks Copilot a question. Copilot calls Dandori MCP server to ground its answer in team standards.

```
  Engineer in VS Code (file: payments/webhook.ts)
                │
                │ Copilot Chat: "How should I handle PII
                │   in this webhook handler?"
                ▼
  ┌─────────────────────────────────────┐
  │ Copilot reasons:                    │
  │ "I need org context. I have a       │
  │  Dandori MCP tool: get_context"     │
  └─────────────────┬───────────────────┘
                    │
                    │ MCP tool call:
                    │ get_context(file="webhook.ts",
                    │             project="payments")
                    ▼
  ┌─────────────────────────────────────┐
  │ Dandori MCP server                  │
  │ - resolve project from file path    │
  │ - assemble layers:                  │
  │     company (security policy v12)   │
  │     project (payments stack v3)     │
  │     team (payments team v7)         │
  │ - filter for PII relevance          │
  │ - return structured context         │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Returned to Copilot:                │
  │ {                                   │
  │   "company.security": "...",        │
  │   "project.pii_handling": "...",    │
  │   "team.review_protocol": "..."     │
  │ }                                   │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Copilot answers in chat:            │
  │ "Per company security policy v12,   │
  │  PII in webhooks must be:           │
  │  1. Masked in logs                  │
  │  2. Tagged with PII headers         │
  │  3. Routed only to auth-data svc    │
  │                                     │
  │  Project payments uses PiiVault v2  │
  │  for all webhook payloads. Use      │
  │  PiiVault.scrub() before logging."  │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Dandori logs:                       │
  │ skill_usage / context_query         │
  │ actor=copilot,                      │
  │ user=engineer-bob,                  │
  │ context_versions={...}              │
  └─────────────────────────────────────┘
```

**Modules touched:** Context Hub, MCP Server, Audit Log

**Integrations:** GitHub Copilot (in via MCP)

**Outcome:** Engineer gets a grounded answer. Dandori logs which engineer queried which context, when, for which file. Compliance team can answer "did engineers see the security policy when they wrote this code?"

---

## Flow 5: Leadership monthly cost review

**Scenario:** CFO opens Dandori dashboard at month-end. Sees full breakdown, drills into anomalies, exports report.

```
  CFO opens Dandori → Dashboard → Cost
                │
                ▼
  ┌─────────────────────────────────────┐
  │ Cost dashboard query                │
  │ SELECT FROM v_agent_runs            │
  │ WHERE month=2026-04                 │
  │ GROUP BY project, team, agent       │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Roll-up engine                      │
  │ - sum by project                    │
  │ - sum by team                       │
  │ - sum by agent                      │
  │ - sub-agent costs roll up to parent │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Dashboard renders:                  │
  │   Total: $4,210                     │
  │   Top: payments-service ($1,820)    │
  │     RefactorBot $640 (low quality⚠) │
  └─────────────────┬───────────────────┘
                    │
                    │ CFO clicks "RefactorBot"
                    ▼
  ┌─────────────────────────────────────┐
  │ Drill-down                          │
  │ - run history                       │
  │ - quality trend (declining)         │
  │ - cost per run                      │
  │ - top failed runs                   │
  └─────────────────┬───────────────────┘
                    │
                    │ CFO clicks "Export"
                    ▼
  ┌─────────────────────────────────────┐
  │ Export service                      │
  │ - cost CSV                          │
  │ - audit log filtered to RefactorBot │
  │ - quality breakdown JSON            │
  │ - bundled into ZIP                  │
  └─────────────────┬───────────────────┘
                    │
                    ▼
            Downloaded report
            sent to finance team
            via Slack DM
```

**Modules touched:** Cost Attribution, Cross-agent Analytics, Audit Log

**Integrations:** Slack (deliver report)

**Outcome:** Leadership has actionable cost data without engineering involvement. Drill-down works because every run has full metadata.

---

## Flow 6: Compliance audit "show me PII-touching runs in Q1"

**Scenario:** CISO needs to produce evidence for a SOC 2 audit. Filters audit log + context versions + Sentinel events + approval records.

```
  CISO opens Dandori → Compliance → Build Pack
                │
                ▼
  ┌─────────────────────────────────────┐
  │ Compliance query builder            │
  │ ─────────────────────────────────── │
  │ Date: 2026-01-01 → 2026-03-31       │
  │ Filter: context tag includes 'pii'  │
  │ Include:                            │
  │   ✓ run records                     │
  │   ✓ context versions used           │
  │   ✓ approval records                │
  │   ✓ sub-agent traces                │
  │   ✓ hook executions                 │
  │   ✓ Sentinel events (if connected)  │
  │ Format: SOC 2 evidence pack         │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Query engine                        │
  │ - SELECT runs WHERE context_tags    │
  │   contains 'pii'                    │
  │   AND ts BETWEEN ...                │
  │ - JOIN context_layers ON version    │
  │ - JOIN approvals                    │
  │ - JOIN audit_events                 │
  │ - LEFT JOIN sentinel_events         │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Evidence pack assembler             │
  │ ─────────────────────────────────── │
  │ pack/                               │
  │   ├── runs.csv                      │
  │   ├── context-snapshots/            │
  │   │   └── *.md (per version used)   │
  │   ├── approvals.json                │
  │   ├── hooks-fired.json              │
  │   ├── audit-trail.json              │
  │   ├── sentinel-events.json          │
  │   └── soc2-evidence.pdf            │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Hash chain verification             │
  │ - replay audit hash chain           │
  │ - report tamper status              │
  └─────────────────┬───────────────────┘
                    │
                    ▼
  ┌─────────────────────────────────────┐
  │ Output: signed pack ready for       │
  │ auditor delivery                    │
  └─────────────────────────────────────┘
```

**Modules touched:** Audit Log, Context Hub (version archive), Approval Workflow, Sub-agent Trace, Hooks (execution log), Compliance Export

**Integrations:** None — entirely internal

**Outcome:** Auditor receives signed, tamper-evident evidence pack in minutes instead of weeks. Engineering is not involved.

---

## Flow summary table

| # | Scenario | Trigger | Key modules | Ecosystem | Outcome |
|---|---|---|---|---|---|
| 1 | Jira → PR → approval | Jira webhook | Task, Context, Hooks, Adapter, Sensors, Approval, Audit | Jira, GH, Slack | Auto PR with audit |
| 2 | Multi-phase DAG | Tech lead builds DAG | Task DAG, Context inheritance, Sensors chain, Sub-agent trace, Approval | Confluence, Claude Code, Codex, Slack, GH | Feature shipped without handoffs |
| 3 | Publish team skill | Senior engineer | Skill Library, Audit | Slack | Knowledge becomes org asset |
| 4 | Copilot context query | Engineer in IDE | Context Hub, MCP, Audit | Copilot | Grounded IDE answer |
| 5 | Cost review | CFO opens dashboard | Cost, Analytics, Audit | Slack | Actionable cost data |
| 6 | Compliance pack | CISO triggers | Audit, Context archive, Approval, Hooks, Compliance Export | None | Audit evidence in minutes |

---

## See also

- [Architecture Overview]({% link architecture.md %}) — System architecture, tech stack, deployment topologies
- [Modules]({% link architecture-modules.md %}) — Per-module diagrams and data model
- [Ecosystem Integrations]({% link architecture-integrations.md %}) — How Dandori talks to each external tool
- [Use Cases]({% link use-cases.md %}) — Higher-level business scenarios that drive these flows
