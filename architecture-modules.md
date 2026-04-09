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

Modules are grouped by **harness component** (per Fowler / HumanLayer / LangChain framing).

---

## 1. Guides — context, prompts, instructions

| Module | What it does |
|---|---|
| [Context Hub]({% link architecture-modules-context-hub.md %}) | 5-layer context inheritance (Company → Project → Team → Agent → Task), versioned, diff + rollback |
| [Skill Library]({% link architecture-modules-skill-library.md %}) | Reusable prompt knowledge with progressive disclosure (lazy load via `fetch_skill` MCP tool) |

## 2. Sensors — back-pressure feedback

| Module | What it does |
|---|---|
| [Quality Gates]({% link architecture-modules-quality-gates.md %}) | Post-run computational sensors: typecheck, lint, tests → quality score + per-team trend |
| [Inline Sensors]({% link architecture-modules-inline-sensors.md %}) | Mid-run sensors agents call as MCP tools to self-correct before finishing |

## 3. Orchestration — DAGs, lifecycles, handoffs

| Module | What it does |
|---|---|
| [Task Board]({% link architecture-modules-task-board.md %}) | Tasks with phases, dependencies (DAG), auto-wakeup, skill matching |
| [Approval Workflow]({% link architecture-modules-approval-workflow.md %}) | Human review gates with audit trail and Slack interactive approvals |
| [Lifecycle Hooks]({% link architecture-modules-lifecycle-hooks.md %}) | Pluggable scripts at `before_context_assembly`, `before_run`, `after_run`, `on_error`, etc. |
| [Sub-agent Trace]({% link architecture-modules-sub-agent-trace.md %}) | Observe (not spawn) sub-agents inside runtime runs for audit + cost roll-up |

## 4. Tool governance

| Module | What it does |
|---|---|
| [MCP Tool Governance]({% link architecture-modules-mcp-tool-governance.md %}) | Org-wide allow-list, description versioning, fleet usage analytics for MCP tools |

## 5. Observability — measurement and audit

| Module | What it does |
|---|---|
| [Cost Attribution]({% link architecture-modules-cost-attribution.md %}) | Per-project / team / agent / task / model / phase / sub-agent cost breakdown |
| [Audit Log]({% link architecture-modules-audit-log.md %}) | Immutable record of every mutation, with optional hash chain for tamper-evidence |
| [Cross-agent Analytics]({% link architecture-modules-cross-agent-analytics.md %}) | Compare agents across teams, detect drift, support evaluations |

## 6. Integration surface

| Module | What it does |
|---|---|
| [Integration Surface]({% link architecture-modules-integration-surface.md %}) | Web UI, CLI, REST API, MCP server, webhook ingress — same operations, multiple interfaces |

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

## See also

- [Architecture Overview]({% link architecture.md %}) — System architecture, tech stack, deployment topologies
- [Use Case Flows]({% link architecture-use-cases.md %}) — End-to-end processing flows that span multiple modules
