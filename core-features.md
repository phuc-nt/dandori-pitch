---
layout: default
title: Core Features
nav_order: 4
description: "13 modules organized under the 5 outer harness pillars."
---

# Core Features

13 modules that implement the [5 pillars]({{ site.baseurl }}{% link outer-harness.md %}#the-5-pillars). Each tagged by audience: 👷 Engineers · 🧭 Leadership · 🤝 Both.

---

## Pillar 1 — Cost Attribution

### 1. Cost attribution & budget control 🧭

Log every run: agent, task, project, model, input/output tokens, cost. Breakdown by any dimension. Budget ceilings per agent with hard stop. Spike detection alerts when an agent burns 3x its baseline.

---

## Pillar 2 — Multi-layer Knowledge Flow

### 2. Five-layer context governance 🤝

Context hierarchy: Company → Project → Team → Agent → Task. Each layer has an owner. Update once at the top → every agent inherits. Version-controlled with diff, rollback, and PII tags. Every run records which context versions it used.

### 3. Shared skill library 👷

Reusable prompt knowledge as versioned markdown. Attach any skill to any agent (many-to-many). **Progressive disclosure**: only skill name + description in system prompt; full content lazy-loaded via `fetch_skill` MCP tool when the agent actually needs it. Dramatic token savings across the fleet.

---

## Pillar 3 — Task Tracking

### 4. Task dependencies & phase workflow 👷

Tasks with phase tags (research → design → implement → test → deploy). DAG dependencies with cycle prevention. Auto-wakeup: dependent tasks start when parents complete. Portfolio views by phase across projects.

### 5. Approval workflows 🤝

Tasks flagged `needs_approval` stop at In Review until a human approves. Every approval/rejection: who, when, rationale. Exportable for compliance. Slack interactive approvals for in-channel review.

### 6. Lifecycle hooks 👷

Pluggable scripts at `before_context_assembly`, `before_run`, `after_run`, `on_error`, `on_budget_exceeded`. Sandboxed with timeout. Versioned, auditable, org-wide or per-project. Platform team can mandate hooks (e.g., "all payment runs must log PII check").

---

## Pillar 4 — Quality Gates

### 7. Automated quality gates 🤝

Post-run pipeline independent of agent: typecheck, lint, security scan, coverage check. Quality score (0-100) per run. Trend analytics per agent, per team, over time. Cross-agent comparison: which agents improve, which degrade.

**Why Outer needs this even though Inner has TDD:** Separation of Duties. The writer of code should not be the only judge. The agent can comment-out a test to pass faster — Outer gates catch that.

### 8. Inline sensors 👷

Mid-run sensors exposed as MCP tools. Agent calls `run_typecheck` or `run_lint` during execution and self-corrects before finishing. Computational sensors (typecheck, lint — ms) and inferential sensors (AI-powered security review — slower but deeper). Org-wide sensor definitions.

---

## Pillar 5 — Audit & Analytics

### 9. Immutable audit log 🧭

Every mutation logged: actor, timestamp, entity, before/after. Append-only at DB level. Optional hash chain for tamper-evidence. Exportable as JSON/CSV. Compliance-ready: SOC 2, ISO 27001, NIST AI RMF.

### 10. Cross-agent analytics 🧭

Per-agent KPIs: success rate, quality score, cost/run, duration. Trend detection (improving vs degrading). Phase breakdown (which phase burns most). Model comparison on matched tasks.

### 11. Sub-agent trace 🤝

Observe (not spawn) sub-agents inside runtime runs. Cost rolls up: sub-agent → parent run → task → project. Expandable tree view in UI. Policies: max depth, tool restrictions per sub-agent.

### 12. MCP tool governance 🤝

Org-wide MCP server registry. Per-agent and per-team allow-lists. Description versioning + linting (flag bloated descriptions). Usage analytics: which tools burn the most context fleet-wide. Security team veto for restricted tools.

---

## Foundation

### 13. Unified integration surface 👷

Web UI, REST API (OpenAPI 3.0), CLI, built-in MCP server. Same operations on every interface. CI/CD via webhooks. Claude Code talks to Dandori via MCP from inside the IDE.

---

## Module map

| Pillar | Modules | Audience |
|---|---|---|
| Cost Attribution | Cost attribution & budget control | 🧭 |
| Knowledge Flow | Context Hub, Skill Library | 🤝 |
| Task Tracking | Task Board, Approval Workflow, Lifecycle Hooks | 👷 🤝 |
| Quality Gates | Quality Gates, Inline Sensors | 🤝 👷 |
| Audit & Analytics | Audit Log, Cross-agent Analytics, Sub-agent Trace, MCP Tool Governance | 🧭 🤝 |
| Foundation | Integration Surface | 👷 |

---

[Use Cases →]({{ site.baseurl }}{% link use-cases.md %}) See these features in action
{: .fs-5 }

[Architecture →]({{ site.baseurl }}{% link architecture.md %}) How they connect technically
{: .fs-5 }
