---
layout: default
title: Dandori Overview
nav_order: 3
description: "What Dandori is, who it serves, and the 13 features that implement the 5 outer harness pillars."
---

# Dandori Overview

Dandori turns the [Outer Harness]({{ site.baseurl }}{% link outer-harness.md %}) concept into a product: **one platform where engineers coordinate agent work and leadership governs it.**

---

## What Dandori is

Dandori is the **organizational outer harness** for AI coding agents. It implements the [5 pillars]({{ site.baseurl }}{% link outer-harness.md %}#the-5-pillars) as 13 features — shared, versioned, auditable — on top of the agents your teams already use.

**Dandori does not write code.** It does not replace Claude Code, Codex, or Cursor. Those are the inner harness — they run agents. Dandori wraps them with the organizational layer they're missing.

```
┌──────────────────────────────────────────────────────────┐
│                   ENGINEERING LEADERSHIP                 │
│   (needs: visibility · control · audit · attribution)    │
└───────────────────────────┬──────────────────────────────┘
                            │ governs via
                            ▼
┌──────────────────────────────────────────────────────────┐
│                        DANDORI                           │
│              (organizational outer harness)               │
│                                                          │
│   Cost Attribution · Knowledge Flow · Task Tracking      │
│   Quality Gates · Audit & Analytics                      │
│                                                          │
│   ─── 13 features, same database, two lenses ───         │
│   Engineers: workspace    Leadership: control plane       │
└───────────────────────────┬──────────────────────────────┘
                            │ drives
                            ▼
┌──────────────────────────────────────────────────────────┐
│                      AI AGENTS                           │
│        Claude Code · Codex · Cursor · custom             │
└──────────────────────────────────────────────────────────┘
```

---

## Two audiences, one platform

Dandori is not a leadership dashboard. It's not an engineer-only tool. It's **both** — same database, two lenses.

| | Engineers (workspace) | Leadership (control plane) |
|---|---|---|
| **Cost Attribution** | See per-run cost | Per-team / project breakdown, budget ceilings |
| **Knowledge Flow** | Author & consume context, publish skills, fork agent templates | Version, audit, enforce org-wide policies, publish templates |
| **Task Tracking** | Build DAGs, run agents, review outputs | Approval audit trail, incident traceability |
| **Quality Gates** | Per-run feedback before human review | Per-team quality trends over time |
| **Audit & Analytics** | Debug runs, trace sub-agents | Compliance export, cross-agent comparison |

**The principle:** engineers get productivity from the same data that gives leadership governance. No two tools, no reconciliation, no shadow spreadsheets.

---

## The 13 features

13 features organized under the 5 pillars plus a foundation layer. Each tagged by audience: 👷 Engineers · 🧭 Leadership · 🤝 Both.

### Pillar 1 — Cost Attribution

**1. Cost attribution & budget control** 🧭
Log every run: agent, task, project, model, input/output tokens, cost. Breakdown by any dimension. Budget ceilings per agent with hard stop. Spike detection when an agent burns far above baseline.

### Pillar 2 — Multi-layer Knowledge Flow

Three knowledge asset types share the same 5-layer hierarchy (Company → Project → Team → Agent → Task). All distributable top-down and contributable bottom-up — versioned, audited, inheritable.

**2. Five-layer context governance** 🤝
Context hierarchy with per-layer ownership. Update once at the top → every agent inherits. Version-controlled with diff, rollback, and PII tags. Every run records which context versions it used.

**3. Shared skill library** 👷
Reusable prompt knowledge as versioned markdown. Attach many-to-many to agents. **Progressive disclosure**: only skill name + description in system prompt; full content lazy-loaded via `fetch_skill` MCP tool when needed. Dramatic token savings across the fleet.

**4. Agent templates** 🤝
Pre-configured agent definitions — role, skill references, default context, sensor chain, MCP tool allow-list. Platform publishes, teams clone and customize, successful variants get promoted back.

### Pillar 3 — Task Tracking

**5. Task dependencies & phase workflow** 👷
Tasks with phase tags (research → design → implement → test → deploy). DAG dependencies with cycle prevention. Auto-wakeup: dependent tasks start when parents complete. Portfolio views by phase across projects.

**6. Approval workflows** 🤝
Tasks flagged `needs_approval` stop at In Review until a human approves. Every approval/rejection: who, when, rationale. Slack interactive approvals for in-channel review. Exportable for compliance.

**7. Lifecycle hooks** 👷
Pluggable sandboxed scripts at `before_context_assembly`, `before_run`, `after_run`, `on_error`, `on_budget_exceeded`. Versioned, auditable, org-wide or per-project. Platform can mandate hooks (e.g., "all payment runs must log PII check").

### Pillar 4 — Quality Gates

**8. Automated quality gates** 🤝
Post-run pipeline independent of the agent: typecheck, lint, security scan, coverage. Quality score per run. Trend analytics per agent, team, phase, and time window.

*Why Outer needs this even though Inner has TDD:* **Separation of Duties.** The writer of code should not be the only judge. The agent can comment-out a test to pass faster — Outer gates catch that.

**9. Inline sensors** 👷
Mid-run sensors exposed as MCP tools. Agent calls `run_typecheck` or `run_lint` during execution and self-corrects before finishing. Computational sensors (typecheck, lint — milliseconds) and inferential sensors (LLM-powered security review — slower, deeper).

### Pillar 5 — Audit & Analytics

**10. Immutable audit log** 🧭
Every mutation logged: actor, timestamp, entity, before/after. Append-only at DB level. Optional hash chain for tamper-evidence. Exportable JSON/CSV. Compliance-ready: SOC 2, ISO 27001, NIST AI RMF.

**11. Cross-agent analytics** 🧭
Per-agent KPIs: success rate, quality score, cost per run, duration. Trend detection (improving vs degrading). Phase breakdown. Model comparison on matched tasks.

**12. Sub-agent trace** 🤝
Observe (not spawn) sub-agents inside runtime runs. Cost rolls up: sub-agent → parent run → task → project. Expandable tree view. Policies: max depth, tool restrictions per sub-agent.

**13. MCP tool governance** 🤝
Org-wide MCP server registry. Per-agent and per-team allow-lists. Description versioning + linting. Usage analytics: which tools burn the most context fleet-wide. Security team veto for restricted tools.

### Foundation — Integration Surface

**Unified integration surface** 👷
Web UI, REST API (OpenAPI 3.0), CLI, built-in MCP server. Same operations on every interface. CI/CD via webhooks. Claude Code talks to Dandori via MCP from inside the IDE.

---

## Who uses Dandori

**Engineers — daily workspace**

| Role | What they do |
|---|---|
| Senior / staff engineer | Publish skills, tune context, review outputs |
| Team engineer | Pick up tasks, run agents, track progress |
| Tech lead | Break features into DAGs, assign agents by skill |

**Leadership — control plane**

| Role | What they govern |
|---|---|
| CTO / VP Eng | Cost trends, quality trends, vendor decisions |
| Platform team | Org-wide standards, shared skill library, budgets |
| CISO | PII handling, audit exports, incident replay |
| Compliance | SOC 2 / ISO 27001 evidence, retention policies |

---

## Differentiators

**vs. raw Claude Code / Cursor usage**
Dandori adds cost tracking, shared context, approval gates, audit log, analytics. Your teams keep their favorite agent.

**vs. observability tools (LangSmith, LangFuse)**
Dandori is the full outer harness — context, skills, approval, orchestration *and* observability. Not just tracing.

**vs. internal platform teams building their own**
Dandori works day one. Internal builds take 2-3 quarters and one engineer maintaining.

**vs. agent frameworks (AutoGen, CrewAI, LangGraph)**
Those build agents. Dandori manages the agents your teams already use. Above framework choice.

---

## Where the value shows up

Dandori's ROI is **structural**, not a spreadsheet trick. Five levers compound over time:

| Lever | What changes |
|---|---|
| **Cost visibility** | Runaway prompts flagged before they reach the invoice. Teams pick the right model for the right task. |
| **Context reuse** | Engineers stop re-typing policies into every prompt. New engineers onboard in days, not weeks. |
| **Quality gates** | Agent-caused incidents caught at gate-time, not in production. Trend data shows who is improving. |
| **Knowledge library** | Best prompts, skills, and agent templates become org assets. When senior engineers leave, their judgment stays. |
| **Audit + compliance** | SOC 2 / ISO 27001 evidence = one-click export, not a quarterly tooling project. |

These are **qualitative shifts every partner can verify against their own numbers** — pilot with a real team, measure the change, then decide on a full rollout.

---

## The historical bet

| Era | Solo practice | Org platform |
|---|---|---|
| 2000s | Ad-hoc shell scripts | CI/CD (Jenkins, CircleCI) |
| 2010s | Logs on servers | Observability (Datadog, Grafana) |
| 2015s | `if env.DEBUG` flags | Feature flags (LaunchDarkly) |
| 2020s | Markdown runbooks | Incident platforms (PagerDuty) |
| 2026+ | CLAUDE.md on laptops | **Organizational outer harness** |

Every org with 100+ engineers will need an AI agent control plane soon. Dandori is that platform.

---

## Read next

[Workflows →]({{ site.baseurl }}{% link workflows.md %}) How the 13 features actually get used — leadership and engineer scenarios with component interaction diagrams
{: .fs-5 }
