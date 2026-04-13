---
layout: default
title: Dandori Overview
nav_order: 3
description: "What Dandori is, who it serves, and the 13 features that implement the 5 outer harness pillars."
---

# Dandori Overview

Dandori turns the [Outer Harness]({{ site.baseurl }}{% link outer-harness.md %}) concept into a product: **one platform where engineers coordinate agent work and leadership governs it — same database, two lenses.**

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

Engineers and leadership look at the same database through different lenses. Each role below shows **what they do** in Dandori and **the value they get** from it.

### Engineers — daily workspace

| Role | What they do | What they get |
|---|---|---|
| **Senior / staff engineer** | Publish skills, tune context, review outputs | Their proven prompts scale across the team; their judgment lasts beyond their tenure |
| **Team engineer** | Pick up tasks, run agents, track progress | Full context inherited automatically; no more "which doc version was I supposed to use?" |
| **Tech lead** | Break features into DAGs, assign agents by skill | Multi-phase features run without Slack dispatching; quality gates catch regressions before merge |

### Leadership — control plane

| Role | What they govern | What they get |
|---|---|---|
| **CTO / VP Eng** | Cost trends, quality trends, vendor decisions | Every spend and quality question has an answer in minutes, not meetings |
| **Platform team** | Org-wide standards, shared skill library, budgets | One place to roll out standards that every team's agents automatically inherit |
| **CISO** | PII handling, audit exports, incident replay | Every agent-touched context is traceable; compliance queries return results, not shrugs |
| **Compliance** | SOC 2 / ISO 27001 evidence, retention policies | One-click evidence pack instead of a quarterly tooling project |

---

## Differentiators

**vs. raw Claude Code / Cursor usage**
Dandori adds cost tracking, shared context, approval gates, audit log, analytics. Your teams keep their favorite agent — Dandori orchestrates, doesn't replace.

**vs. observability tools (LangSmith, LangFuse)**
Dandori is the full outer harness — context, skills, approval, orchestration *and* observability. Not just tracing.

---

## Read next

[Workflows →]({{ site.baseurl }}{% link workflows.md %}) How the 13 features actually get used — leadership and engineer scenarios with component interaction diagrams
{: .fs-5 }
