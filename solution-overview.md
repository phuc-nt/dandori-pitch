---
layout: default
title: Solution Overview
nav_order: 3
description: "What Dandori is, who it's for, and how it turns the outer harness concept into a product."
---

# Solution Overview

Dandori turns the [Outer Harness]({{ site.baseurl }}{% link outer-harness.md %}) concept into a product: **one platform where engineers coordinate agent work and leadership governs it**.

---

## What Dandori is

Dandori is the **organizational outer harness** for AI coding agents. It implements the [5 pillars]({{ site.baseurl }}{% link outer-harness.md %}#the-5-pillars) as 13 modules — shared, versioned, auditable — on top of the agents your teams already use.

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
│   ─── 13 modules, same database, two lenses ───         │
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
| **Cost Attribution** | See per-run cost | Per-team/project breakdown, budget ceilings |
| **Knowledge Flow** | Author & consume context, publish skills, fork agent templates | Version, audit, enforce org-wide policies, publish templates |
| **Task Tracking** | Build DAGs, run agents, review outputs | Approval audit trail, incident traceability |
| **Quality Gates** | Per-run feedback before human review | Per-team quality trends over time |
| **Audit & Analytics** | Debug runs, trace sub-agents | Compliance export, cross-agent comparison |

**The principle:** engineers get productivity from the same data that gives leadership governance. No two tools, no reconciliation, no shadow spreadsheets.

---

## Knowledge as infrastructure — three assets, one flow

Dandori treats knowledge as first-class infrastructure, not scattered docs. Three asset types share the same 5-layer hierarchy, the same versioning, the same distribution and contribution patterns:

| Asset | Example | Distributes top-down | Contributes bottom-up |
|---|---|---|---|
| **Context** | Security policy, coding standards, project architecture | CTO sets Layer 1 → all agents inherit | Engineer learnings from tasks promote up |
| **Skills** | Code review checklist, migration recipe, incident runbook | Platform publishes to Layer 3 → teams use | Engineer crafts prompt → promotes to team |
| **Agent templates** | "code-reviewer", "migration-runner", "incident-responder" | Platform publishes → teams fork | Team improves variant → shares back |

All three are **versioned, audited, inheritable, and shareable across layers.** Senior engineer leaves? Everything stays. New engineer joins? Inherits everything on day one.

---

## Before vs. with Dandori

```
  BEFORE                                 WITH DANDORI

  $240K bill → ???                       $240K bill → payments $52K,
                                         auth $38K, data $29K ...

  Copy-paste prompts                     Company context v12 →
  across 100 places                      auto-inherited by every agent

  "Slack said approve"                   Approval logged: alice at 14:22,
                                         rationale: "reviewed diff, tests pass"

  Senior leaves →                        Senior leaves →
  6 months knowledge gone                skills stay in org library

  "Is agent output good?" → shrug        Quality score 87, trending +5
                                         over 6 months

  "Show auditor AI changes" → panic      One-click compliance export
```

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
| **Cost visibility** | Runaway prompts get flagged before they're on the invoice. Teams pick the right model for the right task instead of always reaching for the most expensive one. |
| **Context reuse** | Engineers stop re-typing the same policies and architecture docs into every prompt. Onboarding new engineers takes days, not weeks, because shared context travels automatically. |
| **Quality gates** | Agent-caused incidents get caught at gate-time instead of in production. Trend data lets you tell which agents and teams are actually improving. |
| **Knowledge library** | The best prompts, skills, and agent templates become org assets. When senior engineers move on, their judgment is still in the system. |
| **Audit + compliance** | SOC 2 / ISO 27001 evidence is a one-click export instead of a quarterly tooling project. |

These are **qualitative shifts every partner can verify against their own numbers** — pilot with a real team, measure what changes in your context, then decide on a full rollout.

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

[Features & Workflows →]({{ site.baseurl }}{% link core-features.md %}) 13 modules under the 5 pillars, plus real scenarios
{: .fs-5 }
