---
layout: default
title: Use Cases
nav_order: 5
description: "How leadership governs and engineers work inside Dandori — concrete scenarios, not feature lists."
---

# Use Cases

Previous pages explain *what* Dandori is and *what it provides*. This page shows **how people actually use it** — the workflows, not the features.

---

## Leadership scenarios

### CFO: "Where did $240K go?"

Opens Cost Attribution dashboard. Drills: payments-service $52K (+42% vs last month) → RefactorBot $8.4K at quality 64. Action: investigate RefactorBot, shift low-complexity tasks to cheaper model. **Time: 5 minutes.** Before Dandori: "We'll ask the teams" → spreadsheet next week.

### Platform lead: 8 teams, one standard

Sets Company context (Layer 1): security rules, approved libraries, style guide. All 8 teams inherit automatically. Publishes shared skills: `security-review`, `perf-analysis`, `api-design`. Views cross-team analytics to spot best practices and flag outliers. **Each team still owns its own project + team context and agents.**

### CISO: "Show me PII-touching runs in Q1"

Queries audit log: runs where context contained PII-tagged layers, date range Q1 2026. Result: 8,421 runs, 12 flagged for review, 0 violations. Full context versions logged per run. One-click export: JSON / CSV / SOC 2 format.

### Engineering Director: quality trending

Company average quality: 82 → 87 over 6 months. Data team dropped 81 → 76 — drill down: agent "Refactorer" quality 64 → 48, root cause: outdated skill version. Action: Platform team updates the skill. **Data-driven, not gut feel.**

### Compliance: SOC 2 audit prep

One-click evidence pack: access control (API keys, scoped), change management (approval gates, logged), audit trail (immutable, 365 days), data classification (context PII tags), policy enforcement (company context, versioned). **Before: 3-month custom tooling project.**

---

## Engineer scenarios

### Tech lead: multi-phase feature with 4 agents

Builds a DAG in Task Board:

```
T-1 research-stripe-spec [research]
      ▼
T-2 design-db-schema [design]
      ▼
T-3 implement-handler [implement]
      ▼
T-4 write-tests [test]
      ▼
T-5 deploy-staging [deploy]
```

Each task auto-wakes when parent completes. Each agent inherits company + project + team context + upstream outputs. Quality gates block downstream tasks if a gate fails. **No Slack dispatching, no copy-paste handoffs.**

### Senior engineer: publishing a team skill

Creates skill `go-microservice-review` v1 with review checklist. Attaches to 3 agents across 2 teams. When skill updates to v2 → all attached agents pick it up automatically. New teammate's agent inherits it day 1. **Knowledge stays with the org, not the individual.**

### Mid-level engineer: picking up an in-review task

Opens Task Board → task T-4812 in "In Review". Sees: full prompt sent to agent, assembled context versions (company v12, project v3, team v7), agent output with self-explanation ("What I did / Why / Risks"), quality gate results (typecheck pass, lint warning, tests pass). **Full reproducible state — reviews without pinging anyone.**

### Agent during a run: self-correcting via sensors

Mid-run, agent calls `run_typecheck` (Dandori MCP sensor). Gets 3 errors back. Fixes them. Calls `run_typecheck` again — clean. Calls `run_lint` — 1 warning, fixes. Finishes run. Quality gate confirms: score 91. **Self-correction before human review, not after.**

---

## The pattern

```
  Engineers work INSIDE Dandori     Leaders see THROUGH Dandori
         │                                   │
         ▼                                   ▼
  ┌──────────────────────────────────────────────────┐
  │              Same database, same truth            │
  │                                                    │
  │  Policies propagate automatically                  │
  │  Every decision backed by data                     │
  │  Incidents become learnings                        │
  │  Knowledge stays with the org                      │
  └──────────────────────────────────────────────────┘
```
