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
| **Knowledge Flow** | Author & consume context, publish skills | Version, audit, enforce org-wide policies |
| **Task Tracking** | Build DAGs, run agents, review outputs | Approval audit trail, incident traceability |
| **Quality Gates** | Per-run feedback before human review | Per-team quality trends over time |
| **Audit & Analytics** | Debug runs, trace sub-agents | Compliance export, cross-agent comparison |

**The principle:** engineers get productivity from the same data that gives leadership governance. No two tools, no reconciliation, no shadow spreadsheets.

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

## ROI at 1,000 engineers

| Lever | Monthly savings |
|---|---|
| Cost visibility (10% waste reduction on $180K spend) | $18K |
| Context reuse (30 min/week/engineer saved) | $12.5K |
| Quality gates (20% fewer agent-caused incidents) | (your incident cost) |
| Skill library (2 hrs saved per new hire onboarding) | $1.7K amortized |
| Audit + compliance (no custom SOC2 tooling) | (your auditor cost) |

**Estimated: $30K+/month, scaling linearly.**

---

## The historical bet

| Era | Solo practice | Org platform |
|---|---|---|
| 2000s | Ad-hoc shell scripts | CI/CD (Jenkins, CircleCI) |
| 2010s | Logs on servers | Observability (Datadog, Grafana) |
| 2015s | `if env.DEBUG` flags | Feature flags (LaunchDarkly) |
| 2020s | Markdown runbooks | Incident platforms (PagerDuty) |
| 2026+ | CLAUDE.md on laptops | **Organizational outer harness** |

Every org with 100+ engineers will need an AI agent control plane by end of 2026. Dandori is that platform.

---

[Core Features →]({{ site.baseurl }}{% link core-features.md %}) 13 modules under the 5 pillars
{: .fs-5 }

[Architecture →]({{ site.baseurl }}{% link architecture.md %}) How it works technically
{: .fs-5 }
