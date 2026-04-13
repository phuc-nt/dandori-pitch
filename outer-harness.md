---
layout: default
title: Outer Harness
nav_order: 2
description: "Why process and data matter more than the agent you're using — the 5 pillars of an organizational outer harness."
---

# Outer Harness

Why process and data matter more than the agent you're using.

---

## The problem

2026. Your team has 50 engineers, each running 5-10 agent sessions a day with Claude Code, Cursor, or Codex. Each session burns tokens, generates code, and pushes straight to the repo.

Try answering these:

- How much did the team spend on APIs this month, by project?
- An agent just committed code violating your security policy — who's responsible?
- The migration that broke staging this morning — who approved it?
- Does Team A's agent write better code than Team B's?
- A senior engineer just left — where are their 6 months of prompt engineering experience?

If you can't answer most of these, you're not alone. This isn't the AI's fault or the team's fault. It's an architecture gap: **a missing infrastructure layer that nobody has clearly named yet.**

---

## Agent = Model + Harness

LangChain distilled it: `Agent = Model + Harness`. Everything that isn't the model — system prompts, context files, skills, sensors, hooks, orchestration — is the **harness**.

You've been touching harness every day:

- **Context files** — the `CLAUDE.md` and security policies you stuff into prompts
- **Skills** — prompt templates you copy every time you need a code review
- **Sensors** — "run lint and fix before returning results"
- **Hooks** — scripts that run before/after each agent run
- **Sandbox** — isolated environments where agents execute code

But the sandbox was built by Anthropic; the `CLAUDE.md` was written by you at 11 PM last Tuesday. Completely different origins, owners, lifecycles. Yet we lump them together as "agent configuration."

---

## Inner vs. Outer

In automotive engineering, the wiring harness splits into **inner** (welded inside the engine block — don't touch) and **outer** (customizable wiring to dashboard and accessories — changes per model). AI agents have the same boundary:

```
┌─────────────────────────────────────────────────┐
│  INNER HARNESS (Provider builds)                │
│  ├─ Tool execution loop                         │
│  ├─ Sub-agent isolation & firewall              │
│  └─ Sandbox (code execution environment)        │
│                                                 │
│  OUTER HARNESS (Your org builds)                │
│  ├─ Cost Attribution                            │
│  ├─ Multi-layer Knowledge Flow                  │
│  ├─ Task Tracking                               │
│  ├─ Quality Gates                               │
│  └─ Audit & Analytics                           │
└─────────────────────────────────────────────────┘
```

**Inner** is what Anthropic, OpenAI, and Cursor have spent tens of millions optimizing. You don't need to rebuild it.

**Outer** carries your organization's DNA: enterprise context, approval processes, quality standards, knowledge sharing across teams. Providers will never build this — they don't know how your company operates.

The paradox: most organizations spend hundreds of thousands on Inner (token fees) while Outer — the thing that determines output quality — is scattered across individual laptops. At scale, it breaks.

---

## The 5 pillars

### 1. Cost Attribution

**Problem:** $180K API bill. CFO asks "where did the money go?" All you can say is "Anthropic."

**Solution:** Log every run with metadata: agent, task, project, model, tokens, cost. Auto-detect anomalies. Budget ceilings with hard stops.

```
  ┌───────────────────────────────────────────┐
  │ By project:                               │
  │   payments-service    $12,480  ██████████ │
  │   auth-platform        $8,220  ███████   │
  │   data-pipeline        $5,910  █████     │
  │                                           │
  │ ⚠ ALERT: RefactorBot exceeded 3× baseline│
  └───────────────────────────────────────────┘
```

### 2. Multi-layer Knowledge Flow

**Problem:** Agent violates security policy — engineer forgot to paste the compliance doc. Senior dev leaves — 6 months of prompt knowledge gone.

**Solution:** A 5-layer hierarchy with ownership at each level, carrying **three types of knowledge assets** — all distributable top-down and contributable bottom-up:

- **Context** — policies, standards, architecture docs, task specs
- **Skills** — reusable prompt patterns (code review, migration, incident triage)
- **Agent templates** — pre-configured agent definitions (role, skills, sensor chain, tool allow-list)

```
  ┌─────────────────────────────────────────────┐
  │  Layer 1: COMPANY     (CTO, Security)       │
  │  Layer 2: PROJECT     (Project lead)        │
  │  Layer 3: TEAM        (Team lead)           │
  │  Layer 4: AGENT       (Maintainer)          │
  │  Layer 5: TASK        (Author)              │
  │  ═══════════════════════════════════════    │
  │  ▼ Auto-assembled into every prompt ▼       │
  └─────────────────────────────────────────────┘

            TOP-DOWN DISTRIBUTION
            ────────────────────▶
  Layer 1 ─── Layer 2 ─── Layer 3 ─── Layer 4 ─── Layer 5
            ◀────────────────────
            BOTTOM-UP CONTRIBUTION
```

**Top-down:** CTO updates security policy at Layer 1 → every agent inherits automatically. Platform publishes a `code-reviewer` agent template → any team instantiates it with their own context. Nobody needs to "remember" to copy-paste. Nobody can bypass.

**Bottom-up:** Engineer crafts a great migration prompt at Layer 5 → packages as a Skill, promotes to Layer 3, the whole team uses it immediately. Team forks and improves a company template → shares the variant back. Individual knowledge becomes shared asset.

Senior leaves? Skills, templates, and context stay right here. New engineer inherits them on day one.

### 3. Task Tracking

**Problem:** Agent ran a migration, staging broke. Who approved? "Let me find that Slack thread..."

**Solution:** Task lifecycle with approval gates and full audit trail. Every approval tied to person, timestamp, reason. Incident → trace entire chain backwards.

```
  ┌────────┐  agent runs  ┌───────────┐  human reviews  ┌──────┐
  │  TODO  │────────────▶│ IN REVIEW │───────────────▶│ DONE │
  └────────┘              └─────┬─────┘                 └──────┘
                                │ reject
                                ▼
                          ┌────────┐
                          │  TODO  │ (with rejection reason)
                          └────────┘
```

### 4. Quality Gates

**Problem:** "The agent already knows TDD. Why quality gates at Outer?"

Because of **Separation of Duties**. The agent can comment-out a test to pass faster. It doesn't know your org requires SonarQube or 80% coverage. The writer of code should not be the only judge of that code.

```
  Agent output (passed Inner TDD) → Outer quality pipeline
  ┌──────────────────────────────────────┐
  │  TypeCheck · Lint · Security · Cover │
  └──────────────────────────────────────┘
       ▼  Score: 72/100
  < 70 → reject  │  ≥ 70 → forward to review
```

### 5. Audit & Analytics

The other 4 pillars generate data. This pillar is where that data converges.

**Audit Log**: append-only, hash chain, tamper-evident. Every state change recorded.

**Analytics**: which agent is most cost-effective? Which skill saves the most time? Which team is improving? When an incident happens — exactly who, when, what context, how approved?

```
  Cost events ──┐
  Context edits ─┤
  Approvals ─────┤──▶ Audit Log ──▶ Analytics + Compliance Export
  Gate results ──┤
  Task events ───┘
```

---

## Two principles

**Process-centric.** Human and Agent are both nodes on the same pipeline. Process determines which context gets injected, which output gets approved, which gates must pass. Not human intuition, not agent autonomy. Process decides.

**Data-driven.** Every operation produces structured data. No data → no visibility → forever guessing.

---

## Sources

Synthesized from:

- [Martin Fowler](https://martinfowler.com/articles/harness-engineering.html) — harness engineering framework
- [HumanLayer](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — CLAUDE.md patterns
- [LangChain](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) — agent harness anatomy
- [OpenAI](https://openai.com/index/harness-engineering/) — Codex harness engineering
- [Phil Schmid](https://www.philschmid.de/agent-harness-2026) — agent harness as OS

The inner/outer distinction and 5-pillar framework are the author's original framing.

---

## Read next

[Dandori Overview →]({{ site.baseurl }}{% link dandori-overview.md %}) How Dandori turns this concept into a product — 13 features across the 5 pillars
{: .fs-5 }
