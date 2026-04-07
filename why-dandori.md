---
layout: default
title: Why Dandori
nav_order: 2
description: "The AI agent sprawl problem and how Dandori solves it."
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

The vendor bill comes in at $180K for the month. That's it. Break it down by team? By feature? By project? By which prompt is burning the most? **You can't.**

Dandori logs every run — agent, task, project, model, input tokens, output tokens, cost — and gives you cross-cutting analytics from day one.

### 2. What context did the agent actually see?

An agent just wrote code that violates your security policy. When you ask why, the engineer says *"I forgot to paste the compliance doc into the prompt"*. **Context discipline cannot live in copy-paste culture.**

Dandori's 5-layer context hierarchy (Company → Project → Team → Agent → Task) means every agent automatically inherits the right context. Update the company policy once — every agent sees it next run. Version controlled, rollback-able, audited.

### 3. Who approved this?

The agent shipped a migration that broke prod. Who reviewed it? When? Based on what criteria? **"Slack thread, let me find it..."**

Dandori has a built-in approval workflow: tasks flagged `needs_approval` stop at **In Review** until a human approves. Every approval (and rejection) is logged with who, when, and why.

### 4. How good is the output?

Your agents are producing code. Is it good? Is it improving or degrading over time? Does Team A's agent produce better code than Team B's? **No one knows.**

Dandori runs quality gates on every run (TypeScript, ESLint, test scanners), computes a quality score, and tracks it over time. Cross-agent comparison table shows you which agents are improving.

### 5. What happens when the engineer leaves?

Engineer X built the best prompts on the team. They leave. **Six months of tribal knowledge walks out the door.**

Dandori stores agent instructions, skills, and templates centrally. New engineers inherit the team's proven prompts instantly. Skills are shareable across projects.

---

## What Dandori is

**Dandori is the management layer between engineering leadership and the AI agents your teams already use.**

```
   LEADERSHIP                    DANDORI                       AGENTS
   (governs)                  (manages)                     (execute)

   CTO ─────────┐                                            ┌──── Claude Code
                ├──▶  set policy  ──▶  inject context  ──▶  ─┤
   Security ────┤     approve      ◀── quality gates    ◀── ─├──── Codex
                │     audit        ◀── cost logs        ◀── │
   Compliance ──┤                                            ├──── Cursor
                │                                            │
   Platform ────┘                                            └──── custom
                                      │
                                      ▼
                                 AI Providers
                          (Anthropic, OpenAI, local)
```

**The model:** Leadership sets policy through Dandori. Dandori enforces it on every agent run. Agents execute. Dandori records. Leadership learns from data and adjusts policy. Loop.

**Dandori is NOT:**

- A coding agent (it manages Claude/Codex/Cursor — doesn't replace them)
- A CI/CD replacement (it integrates with yours)
- Observability-only (it's task + policy + approval + analytics)
- A vendor lock-in (standard APIs, self-hosted, export anytime)

**Dandori IS:**

- The missing management layer between leadership and agent execution
- Vendor-agnostic (any agent: Claude, Codex, local models, custom)
- Designed for orgs that need cost control, audit, and governance at scale

---

## Differentiators

### vs. raw Cursor / Claude Code usage
- **Dandori adds:** central cost tracking, shared context, approval gates, audit log, analytics
- **Your teams keep:** their favorite agent CLI/IDE — Dandori orchestrates, doesn't replace

### vs. observability tools (LangSmith, LangFuse)
- **Dandori is not just observability** — it's a task/agent management layer
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
| **Context reuse** | 30 min/week saved per engineer on prompt management | 125 eng-hours/month × $100 = $12.5K |
| **Quality gates** | 20% fewer production incidents from agent-generated code | — (your incident cost) |
| **Template library** | 2 hours/onboarded engineer saved (100 new hires/year) | $1.7K/month amortized |
| **Audit + compliance** | Passes SOC2 AI-usage controls without custom tooling | — (your auditor cost) |

**Estimated monthly value: $30K+ at 1,000 engineers, scaling linearly.**

---

## The bet we're making

**Every org with more than 100 engineers will need an AI agent control plane by end of 2026.**

The patterns we saw with:

- **DevOps tools** (2010s): every team built their own, then consolidated to Terraform/K8s
- **Observability** (2015s): logs scattered everywhere, then consolidated to Datadog/Grafana
- **Feature flags** (2020s): ad-hoc env vars, then consolidated to LaunchDarkly/Unleash

...will repeat with AI agents. **Dandori is that consolidation layer.**

---

## Next steps

- [Core Features →]({% link core-features.md %}) The 9 management capabilities, with diagrams
- [Use Cases →]({% link use-cases.md %}) Management scenarios for CTO, CISO, Platform, Compliance
- [Architecture →]({% link architecture.md %}) Technical integration surface
- [AIPF Integration →]({% link aipf-integration.md %}) How Dandori fits into enterprise AI platforms
