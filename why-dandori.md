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

**Dandori is an organizational outer harness.**

In 2026 vocabulary: `Agent = Model + Harness`. Everything that isn't the model — system prompts, context, skills, hooks, orchestration, feedback loops — is called the **harness**. Harness engineering is the discipline of designing it.

The harness has two tiers:

- **Inner harness** — built into the coding agent runtime (Claude Code, Codex, Cursor). Sub-agent context firewall, sandbox, tool execution loop, context compaction. These runtimes do it well.
- **Outer harness** — everything users configure around the runtime. Context files, skills, sensors, approval gates, orchestration, observability. Today this lives on individual laptops.

Today, outer harness engineering is a solo practice: every engineer builds their own CLAUDE.md, their own MCP tools, their own hooks — on their own laptop. When they leave, it walks out the door.

**Dandori is the outer harness at organizational scale.** Shared, versioned, auditable. Same primitives (context, skills, hooks, sensors, orchestration) — but lifted from the laptop to the organization.

**Dandori does not replace the inner harness.** Claude Code, Codex, and Cursor still own the runtime. Dandori talks to them through adapters and lets them do what they do best.

See the full framing in **[Harness Engineering]({% link harness-engineering.md %})**.

In practical terms: **Dandori is the coordination and governance layer between engineering leadership, engineers, and the AI agents your teams already use.** In harness engineering vocabulary, that is the **organizational outer harness**.

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

- The organizational outer harness between engineers, leadership, and agent execution — versioned, audited, shared
- Vendor-agnostic (any agent: Claude, Codex, local models, custom)
- Designed for orgs that need cost control, audit, and governance at scale

---

## Who gets what value

Dandori is not a leadership-only dashboard. **It's a daily workspace for engineers *and* a control plane for leadership.** The same database powers both — so engineers coordinate in the tool that management measures through.

### For engineers (they use it every day)

| Module | Engineer value |
|---|---|
| **Context Hub** (5-layer) | Stop copy-pasting policies into prompts. Inherit company + project + team + agent context automatically. Update once, every teammate's agent sees it next run. |
| **Task Board** (DAGs, phases) | Break a feature into phased tasks (research → design → implement → test), chain dependencies, auto-wake the next agent when the previous finishes. |
| **Skill Library** (progressive disclosure) | Reuse proven prompts from staff engineers. Lazy-loaded via `fetch_skill` tool — skill manifest in system prompt, content fetched only when agent needs it. Dramatic token savings. |
| **Quality Gates** | Get TypeScript / lint / test feedback on agent output *before* it hits human review. Fast loop, fewer "wait, this doesn't compile" moments. |
| **Inline Sensors** | Agents call typecheck / lint / tests / security review mid-run as MCP tools. Self-correct before finishing. Computational + inferential. |
| **Lifecycle Hooks** | Register custom scripts at `before_context_assembly`, `before_run`, `after_run`, `on_error`, `on_budget_exceeded`. Sandboxed, versioned, org-wide shareable. |
| **Approval Review** | Clear "In Review" queue with diff, prompt, context version. Review with full context instead of Slack screenshots. |
| **Sub-agent trace view** | See the sub-agent tree inside a run. Debug what each sub-agent did, which tools it called, how long it took. |
| **Self-explanation** | Every agent run ends with "What I did / Why / Risks". Easier handoff between engineers, easier review. |

### For leadership (they see through it every week)

| Module | Leadership value |
|---|---|
| **Cost Attribution** | Break the vendor bill down by project, team, agent, model, phase, sub-agent. Spot runaway prompts before they're on the invoice. |
| **Cross-agent Analytics** | Compare agents on cost, quality, success rate. See which ones improve, which degrade. |
| **Quality Gates (trend view)** | Track quality score per team over time. Catch drift before it ships. |
| **Audit Log** | Every mutation + every context version + every approval + every hook execution + every sub-agent trace recorded. SOC 2 / ISO 27001 evidence on demand. |
| **Approval Workflow** | Who approved what, when, with what rationale. No more "Slack said approve." |
| **MCP Tool Governance** | Per-agent allow-lists, description linting, tool usage analytics. Security team vetoes. |
| **Compliance Export** | One-click JSON / CSV / PDF pack for auditors. Retention policies per project. |
| **Budget Ceilings** | Hard stops per agent / team. Spike alerts when something burns 3× its average. |

### Shared modules (both audiences, different lens)

- **Context Hub** — engineers *author and consume*, leadership *versions and audits*.
- **Skill Library** — engineers *write and reuse*, leadership *owns org knowledge asset*.
- **Approval Workflow** — engineers *act as reviewers*, leadership *gets the audit trail*.
- **Quality Gates** — engineers *get per-run feedback*, leadership *gets per-team trends*.

**The principle:** engineers get productivity from the same data that gives leadership governance. No two tools, no reconciliation, no shadow spreadsheets.

---

## Differentiators

### vs. raw Cursor / Claude Code usage
- **Dandori adds:** central cost tracking, shared context, approval gates, audit log, analytics
- **Your teams keep:** their favorite agent CLI/IDE — Dandori orchestrates, doesn't replace

### vs. observability tools (LangSmith, LangFuse)
- **Dandori is not just observability** — it's the outer harness: context, skills, approval, orchestration *and* observability
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

- [Harness Engineering →]({% link harness-engineering.md %}) The industry concept Dandori implements at org scale
- [Core Features →]({% link core-features.md %}) The 13 outer-harness capabilities, with diagrams
- [Use Cases →]({% link use-cases.md %}) Management scenarios for CTO, CISO, Platform, Compliance
- [Architecture →]({% link architecture.md %}) Technical integration surface
- [AIPF Integration →]({% link aipf-integration.md %}) How Dandori fits into enterprise AI platforms
