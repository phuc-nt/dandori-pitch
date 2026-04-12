---
layout: default
title: Modules
parent: Architecture
nav_order: 1
has_children: true
description: "Index of all 13 Dandori modules. Each module has its own page with diagrams, data model, processing flow, ecosystem integration, and tech specifics."
---

# Modules

Each of the 13 Dandori modules has its own detail page. This page is the index — pick a module to read.

Modules are grouped by the **[5 pillars of Outer Harness]({{ site.baseurl }}{% link harness-engineering.md %}#the-5-pillars-of-outer-harness)**.

---

## Pillar 1 — Cost Attribution

| Module | What it does |
|---|---|
| [Cost Attribution]({{ site.baseurl }}{% link architecture-modules-cost-attribution.md %}) | Per-project / team / agent / task / model / phase / sub-agent cost breakdown + budget ceilings |

## Pillar 2 — Multi-layer Knowledge Flow

| Module | What it does |
|---|---|
| [Context Hub]({{ site.baseurl }}{% link architecture-modules-context-hub.md %}) | 5-layer context inheritance (Company → Project → Team → Agent → Task), versioned, diff + rollback |
| [Skill Library]({{ site.baseurl }}{% link architecture-modules-skill-library.md %}) | Reusable prompt knowledge with progressive disclosure (lazy load via `fetch_skill` MCP tool) |

## Pillar 3 — Task Tracking

| Module | What it does |
|---|---|
| [Task Board]({{ site.baseurl }}{% link architecture-modules-task-board.md %}) | Tasks with phases, dependencies (DAG), auto-wakeup, skill matching |
| [Approval Workflow]({{ site.baseurl }}{% link architecture-modules-approval-workflow.md %}) | Human review gates with audit trail and Slack interactive approvals |
| [Lifecycle Hooks]({{ site.baseurl }}{% link architecture-modules-lifecycle-hooks.md %}) | Pluggable scripts at `before_context_assembly`, `before_run`, `after_run`, `on_error`, etc. |

## Pillar 4 — Quality Gates

| Module | What it does |
|---|---|
| [Quality Gates]({{ site.baseurl }}{% link architecture-modules-quality-gates.md %}) | Post-run computational sensors: typecheck, lint, tests → quality score + per-team trend |
| [Inline Sensors]({{ site.baseurl }}{% link architecture-modules-inline-sensors.md %}) | Mid-run sensors agents call as MCP tools to self-correct before finishing |

## Pillar 5 — Audit & Analytics

| Module | What it does |
|---|---|
| [Audit Log]({{ site.baseurl }}{% link architecture-modules-audit-log.md %}) | Immutable record of every mutation, with optional hash chain for tamper-evidence |
| [Cross-agent Analytics]({{ site.baseurl }}{% link architecture-modules-cross-agent-analytics.md %}) | Compare agents across teams, detect drift, support evaluations |
| [Sub-agent Trace]({{ site.baseurl }}{% link architecture-modules-sub-agent-trace.md %}) | Observe (not spawn) sub-agents inside runtime runs for audit + cost roll-up |
| [MCP Tool Governance]({{ site.baseurl }}{% link architecture-modules-mcp-tool-governance.md %}) | Org-wide allow-list, description versioning, fleet usage analytics for MCP tools |

## Foundation — Integration Surface

| Module | What it does |
|---|---|
| [Integration Surface]({{ site.baseurl }}{% link architecture-modules-integration-surface.md %}) | Web UI, CLI, REST API, MCP server, webhook ingress — same operations, multiple interfaces |

---

## Reading guide

Each module page is structured the same way:

1. **Purpose** — one paragraph
2. **Architecture diagram** (Mermaid)
3. **Data model** — SQL where relevant
4. **Processing flow** (Mermaid sequence diagram)
5. **Ecosystem integration** — which of the 8 ecosystem tools touch this module, with per-tool mini diagram
6. **Tech specifics** — implementation notes

---

## Build sequence & parallelization

For engineers planning implementation, here is the dependency graph and earliest-buildable milestone per module. See [Proposed Roadmap]({{ site.baseurl }}{% link proposed-roadmap.md %}) for the full milestone plan.

| Module | Hard dependencies | Earliest milestone | Can parallelize with |
|---|---|---|---|
| **Integration Surface** (service + REST + UI + auth) | — | F1 | — (foundation) |
| **Audit Log** | Integration Surface | F2 | — (foundation) |
| **Task Board** (basic CRUD) | Integration Surface, Audit Log | F3 | — (foundation) |
| **Adapter layer** (Claude Code spawn) | Task Board | F4 | — (foundation) |
| **Context Hub** (5-layer) | Adapter | M2 | Skill Library |
| **Skill Library** (basic) | Adapter | M2 | Context Hub |
| **Cost Attribution** | Adapter, run record | M3 | Quality Gates, Approval |
| **Quality Gates** (post-run) | Adapter, run record | M3 | Cost, Approval |
| **Approval Workflow** | Task Board, Audit Log | M3 | Cost, Quality |
| **Cross-agent Analytics** | Cost Attribution, Quality Gates | M3 | — (consumes M3) |
| **Task Board DAG + phases** | Task Board basic | M4 | Sub-agent Trace |
| **Sub-agent Trace** | Adapter (protocol extension) | M4 | DAG |
| **Lifecycle Hooks** | Adapter, Audit Log | M5 | Inline Sensors, MCP Gov, Skill PD |
| **MCP server** (built-in) | Adapter | M5 (pre-req) | — |
| **Inline Sensors** | MCP server | M5 | Hooks, MCP Gov, Skill PD |
| **MCP Tool Governance** | MCP server | M5 | Hooks, Sensors, Skill PD |
| **Skill Library** (progressive disclosure) | MCP server, basic Skill Library | M5 | Hooks, Sensors, MCP Gov |

**Key insights for build planning:**

- **F1-F4 must be sequential** — each depends on the previous. 1 dev × ~4 sprints.
- **M2 and M3 each have 2-3 parallel tracks** — ideal for 2-3 devs working in parallel.
- **M5 is gated by the built-in MCP server** — once that's live, 4 modules unblock simultaneously.
- **Stop at any milestone** — M3 (end of dual-audience MVP) is a natural full-stop for a team pilot.
- **Scope-creep guard:** see [Non-goals]({{ site.baseurl }}{% link proposed-roadmap.md %}#scope-boundaries--what-dandori-will-not-build) before expanding any module.

---

## See also

- [Architecture Overview]({{ site.baseurl }}{% link architecture.md %}) — System architecture, tech stack, deployment topologies
- [Use Case Flows]({{ site.baseurl }}{% link architecture-use-cases.md %}) — End-to-end processing flows that span multiple modules
