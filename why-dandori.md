---
layout: default
title: Why Dandori
nav_order: 2
description: "The AI agent sprawl problem and how Dandori solves it — for engineers and leadership."
---

# Why Dandori

## The AI agent sprawl problem

In 2023, every engineer got ChatGPT.
In 2024, every engineer got Copilot.
In 2025, every engineer got an *autonomous agent* — Claude Code, Cursor, Codex, Cline, Windsurf.

Now it's 2026. A 10,000-engineer org is running **tens of thousands of agent sessions per day**. Each session:

- Burns tokens ($)
- Writes code that ships to production
- References org-specific context (or doesn't)
- Is configured by whichever engineer happened to set it up

**There is no control plane.** No central dashboard. No cost attribution. No shared context. No audit log. No quality gate.

Every engineering leader is learning the same lesson: *agent sprawl is the new shadow IT*.

---

## The five unanswered questions

Walk into any CTO's office today and ask:

### 1. Where is the AI spend going?

The vendor bill comes in at $180K for the month. That's it. Break it down by team? By feature? By project? **You can't.**

Dandori logs every run — agent, task, project, model, input tokens, output tokens, cost — and gives you cross-cutting analytics from day one.

**Pillar:** [Cost Attribution]({% link harness-engineering.md %}#1-cost-attribution)

### 2. What context did the agent actually see?

An agent wrote code that violates your security policy. The engineer says *"I forgot to paste the compliance doc into the prompt."* **Context discipline cannot live in copy-paste culture.**

Dandori's 5-layer context hierarchy (Company → Project → Team → Agent → Task) means every agent automatically inherits the right context. Update the company policy once — every agent sees it next run. Version controlled, rollback-able, audited.

**Pillar:** [Multi-layer Knowledge Flow]({% link harness-engineering.md %}#2-multi-layer-knowledge-flow)

### 3. Who approved this?

The agent shipped a migration that broke prod. Who reviewed it? When? Based on what criteria? **"Slack thread, let me find it..."**

Dandori has a built-in approval workflow: tasks flagged `needs_approval` stop at **In Review** until a human approves. Every approval (and rejection) is logged with who, when, and why.

**Pillar:** [Task Tracking]({% link harness-engineering.md %}#3-task-tracking)

### 4. How good is the output?

Your agents are producing code. Is it good? Is it improving or degrading over time? Does Team A's agent produce better code than Team B's? **No one knows.**

Dandori runs quality gates on every run (TypeScript, ESLint, test scanners), computes a quality score, and tracks it over time. Cross-agent comparison shows which agents are improving.

**Pillar:** [Quality Gates]({% link harness-engineering.md %}#4-quality-gates)

### 5. What happens when the engineer leaves?

Engineer X built the best prompts on the team. They leave. **Six months of tribal knowledge walks out the door.**

Dandori stores agent instructions, skills, and templates centrally. New engineers inherit the team's proven prompts instantly. Skills are shareable across projects.

**Pillar:** [Multi-layer Knowledge Flow]({% link harness-engineering.md %}#2-multi-layer-knowledge-flow)

---

## Before vs. with Dandori

Three concrete shifts every team feels in the first week:

```
  BEFORE:                              WITH DANDORI:

  ┌─────────────┐                      ┌──────────────────────┐
  │ $240K bill  │                      │ $240K bill           │
  │     │       │                      │  ├ payments   $52K   │
  │     ▼       │                      │  ├ auth       $38K   │
  │    ???      │                      │  ├ data       $29K   │
  │             │                      │  └ ... (drill down)  │
  └─────────────┘                      └──────────────────────┘

  ┌─────────────┐                      ┌──────────────────────┐
  │ Copy-paste  │                      │ Company context → v12│
  │ prompts in  │                      │ Project context → v3 │
  │ 100 places  │                      │ Team context    → v7 │
  └─────────────┘                      │ (auto-inherited)     │
                                       └──────────────────────┘

  ┌─────────────┐                      ┌──────────────────────┐
  │ "Slack said │                      │ Approval logged:     │
  │  approve"   │                      │ user=alice at 14:22  │
  │             │                      │ rationale="reviewed  │
  └─────────────┘                      │ diff, tests pass"    │
                                       └──────────────────────┘
```

---

## Two audiences, one platform

Dandori is not a leadership-only dashboard. **It's a daily workspace for engineers *and* a control plane for leadership.** Same database, two lenses.

```
   ENGINEERS                     DANDORI                       LEADERSHIP
   (workspace)                (shared data)                  (control plane)

   Author context  ───▶                          ◀─── View cost trends
   Publish skills  ───▶    ┌──────────────────┐  ◀─── Audit approvals
   Run agents      ───▶    │  Same database   │  ◀─── Quality analytics
   Review outputs  ───▶    │  Same audit log  │  ◀─── Compliance export
   Build task DAGs ───▶    │  Same truth      │  ◀─── Budget ceilings
                           └──────────────────┘
```

**For engineers — daily workspace:**

| Role | What they do in Dandori |
|---|---|
| **Senior / staff engineer** | Publish skills, tune context, review outputs |
| **Team engineer** | Pick up tasks, run agents, track progress |
| **Tech lead** | Break features into task DAGs, assign agents by skill |

**For leadership — control plane:**

| Role | What they govern |
|---|---|
| **CTO / VP Eng** | Cost trends, quality trends, vendor decisions |
| **Platform team** | Standards across teams, shared skill library, budget ceilings |
| **CISO** | PII handling, audit exports, incident replay |
| **Compliance** | SOC 2 / ISO 27001 evidence, retention policies |

**The principle:** engineers get productivity from the same data that gives leadership governance. No two tools, no reconciliation, no shadow spreadsheets.

For full module-level detail, see **[Core Features]({% link core-features.md %})**.

---

## Differentiators

### vs. raw Cursor / Claude Code usage
- **Dandori adds:** central cost tracking, shared context, approval gates, audit log, analytics
- **Your teams keep:** their favorite agent CLI/IDE — Dandori orchestrates, doesn't replace

### vs. observability tools (LangSmith, LangFuse)
- **Dandori is not just observability** — it's the full outer harness: context, skills, approval, orchestration *and* observability
- Task board, approval workflows, context hierarchy, skill library: none of that exists in pure observability tools

### vs. internal platform teams building their own
- **Time to value:** Dandori works day one. Internal builds take 2-3 quarters
- **Maintained:** active product development vs. one-engineer internal tool that bitrots

### vs. AI agent frameworks (AutoGen, CrewAI, LangGraph)
- **Those are for building agents.** Dandori is for *managing* the agents your teams already use
- Dandori sits above framework choice — use any of them with Dandori orchestrating

---

## ROI for a 1,000-engineer org

*Conservative assumptions. Adjust to your numbers.*

| Lever | Assumption | Monthly savings |
|---|---|---|
| **Cost visibility** | 10% reduction in wasted tokens by identifying bad prompts | $18K (on $180K spend) |
| **Context reuse** | 30 min/week saved per engineer on prompt management | 125 eng-hours/month x $100 = $12.5K |
| **Quality gates** | 20% fewer production incidents from agent-generated code | -- (your incident cost) |
| **Template library** | 2 hours/onboarded engineer saved (100 new hires/year) | $1.7K/month amortized |
| **Audit + compliance** | Passes SOC2 AI-usage controls without custom tooling | -- (your auditor cost) |

**Estimated monthly value: $30K+ at 1,000 engineers, scaling linearly.**

---

## The bet we're making

**Every org with more than 100 engineers will need an AI agent control plane by end of 2026.**

The patterns we saw with:

| Era | Solo practice | Org platform |
|---|---|---|
| 2000s | Ad-hoc shell scripts | **CI/CD platforms** (Jenkins, CircleCI) |
| 2010s | Logs scattered on servers | **Observability** (Datadog, Grafana) |
| 2015s | `if env.DEBUG` flags | **Feature flag platforms** (LaunchDarkly) |
| 2020s | Markdown runbooks | **Incident platforms** (PagerDuty, incident.io) |
| 2026+ | CLAUDE.md on laptops | **Dandori** — organizational outer harness |

---

## Next steps

- [Outer Harness →]({% link harness-engineering.md %}) The 5 pillars and two principles behind Dandori
- [Core Features →]({% link core-features.md %}) 13 modules organized under the 5 pillars
- [Use Cases →]({% link use-cases.md %}) 9 leadership + 3 engineer scenarios
- [Architecture →]({% link architecture.md %}) Technical integration surface
- [Proposed Roadmap →]({% link proposed-roadmap.md %}) Milestone-by-milestone implementation path
