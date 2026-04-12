---
layout: default
title: Outer Harness
nav_order: 3
description: "Why process and data matter more than the agent you're using — and the 5 pillars of an organizational outer harness."
---

# Outer Harness

Why process and data matter more than the agent you're using.

---

## The problem

2026. Your team has 50 engineers, each running 5-10 agent sessions a day with Claude Code, Cursor, or Codex. Each session burns tokens, generates code, and pushes straight to the repo.

Now try answering these:

- How much did the team spend on APIs this month, broken down by project?
- An agent just committed code that violates your security policy — who's responsible?
- The migration that broke staging this morning — who approved it?
- Does Team A's agent write better or worse code than Team B's?
- A senior engineer just left — where are their 6 months of prompt engineering experience?

If you're shaking your head at most of these, you're not alone. This isn't the AI's fault, and it isn't the team's fault. It's an architecture gap: we're missing an infrastructure layer that nobody has clearly named yet.

---

## Harness Engineering: Agent = Model + Harness

LangChain distilled it neatly: `Agent = Model + Harness`. Everything that isn't the model — system prompts, context files, skills, sensors, hooks, orchestration — is the **harness**.

Sounds abstract, but you've been touching harness every day:

- **Context files**: the `CLAUDE.md`, coding standards, security policies you stuff into the front of every prompt
- **Skills**: prompt templates you keep copying every time you need a code review or migration
- **Sensors**: when you tell the agent "run lint and fix before returning results" — that's a sensor
- **Hooks**: scripts that run before/after each agent run
- **Sandbox**: isolated environments where agents execute code safely

But here's what few people stop to think about: the sandbox was built by Anthropic; the `CLAUDE.md` file was written by you at 11 PM last Tuesday. These two things have completely different origins, different owners, different lifecycles. Yet we lump them together in one basket called "agent configuration."

---

## Inner vs. Outer Harness

In automotive engineering, the "wiring harness" splits into an inner harness (cables welded permanently inside the engine block — don't touch) and an outer harness (customizable wiring to the dashboard, sensors, accessories — changes per vehicle model). AI agents have a similar boundary:

```
┌─────────────────────────────────────────────────┐
│  INNER HARNESS (Provider builds this)           │
│  ├─ Tool execution loop                         │
│  ├─ Sub-agent isolation & firewall              │
│  └─ Sandbox (code execution environment)        │
│                                                 │
│  OUTER HARNESS (Your org builds this)           │
│  ├─ Cost Attribution                            │
│  ├─ Multi-layer Knowledge Flow                  │
│  ├─ Task Tracking                               │
│  ├─ Quality Gates                               │
│  └─ Audit & Analytics                           │
└─────────────────────────────────────────────────┘
```

**Inner** is what Anthropic, OpenAI, and Cursor have spent tens of millions of dollars optimizing. You don't need to and shouldn't rebuild it. Let them handle it.

Want to see what best-in-class Inner Harness looks like? A few weeks ago, Claude Code's source code leaked. The community dissected it and largely agreed: it's the most pioneering example of Inner Harness design — and many have since reverse-engineered their own versions from it.

But notice: everything being praised is Inner Harness. Nothing in there addresses how your organization distributes context across layers, controls API budgets, or traces incidents when production goes down. That's Outer — and Anthropic can't, and has no reason to, build that for you.

**Outer** is the part that carries your organization's DNA: enterprise context, approval processes, quality standards, how knowledge gets shared across teams. Providers will never build this for you, because they don't know how your company operates.

And here's the paradox: most organizations are spending hundreds of thousands on Inner (token fees), while Outer — the thing that actually determines output quality — is scattered across individual laptops. When you scale to 50, 200, 1,000 engineers, it breaks.

When building Outer Harness, two mindsets matter more than any technical decision:

- **Process-centric:** Don't build systems around people ("remember to paste the policy") or around agents ("it's smart, let it figure it out"). Process is the backbone. Human and Agent are both nodes on the same pipeline — whoever plugs in must follow the same flow.
- **Data-driven:** Every operation must produce structured data. No data means no visibility. No visibility means no improvement. It's that simple.

---

## The 5 pillars of Outer Harness

### 1. Cost Attribution

**Problem:** End-of-month API bill: $180K. CFO asks "where did the money go?" — all you can say is "Anthropic." Break it down by team? By feature? By which agent burned the most? Impossible.

**Solution:** Log every agent run with full metadata: which agent, which task, which project, which model, how many input/output tokens, what cost.

```
  COST ATTRIBUTION
  ┌───────────────────────────────────────────┐
  │ By project:                               │
  │   payments-service    $12,480  ██████████ │
  │   auth-platform        $8,220  ███████   │
  │   data-pipeline        $5,910  █████     │
  │                                           │
  │ By agent role:                            │
  │   ReviewerBot          $9,402  ████████  │
  │   TestGenerator        $7,830  ███████   │
  │                                           │
  │ By model:                                 │
  │   claude-opus         $18,210  ██████████│
  │   claude-sonnet        $9,120  █████     │
  │                                           │
  │ ⚠ ALERT: RefactorBot exceeded 3× baseline│
  └───────────────────────────────────────────┘
```

When data is granular enough, interesting things happen: the system auto-detects agent X burning 3x its usual rate → alert immediately. Exceed budget ceiling → hard stop, no human intervention needed. **Data-driven cost control**, instead of opening the bill at month-end and sighing.

---

### 2. Multi-layer Knowledge Flow

**Problem:** An agent violates your security policy because the engineer forgot to paste the compliance doc into the prompt. Sound familiar? Next week, a senior dev leaves. 6 months of prompt engineering experience walks out the door.

Two problems that seem different but share the same root: context and skills live on personal machines instead of in a system.

**Solution:** A 5-layer context hierarchy with clear ownership at each level:

```
  5-LAYER CONTEXT & SKILL GOVERNANCE
  ┌─────────────────────────────────────────────┐
  │  Layer 1: COMPANY     (CTO, Security own)   │
  │  ├─ Security policies                       │
  │  ├─ Coding standards                        │
  │  └─ Approved dependencies                   │
  │                                             │
  │  Layer 2: PROJECT     (Project lead owns)   │
  │  ├─ Architecture, tech stack                │
  │  └─ Service boundaries                      │
  │                                             │
  │  Layer 3: TEAM        (Team lead owns)      │
  │  ├─ Review protocol, naming conventions     │
  │  └─ Shared skills (code review, migration)  │
  │                                             │
  │  Layer 4: AGENT       (Maintainer owns)     │
  │  ├─ Role definition                         │
  │  └─ Skill references (lazy-loaded)          │
  │                                             │
  │  Layer 5: TASK        (Author owns)         │
  │  └─ Task-specific instructions              │
  │                                             │
  │  ════════════════════════════════════════   │
  │  ▼ Auto-assembled into every prompt ▼       │
  └─────────────────────────────────────────────┘
```

Two directions:

- **Top-down:** CTO updates the security policy at Layer 1 once → every agent inherits automatically. Nobody needs to "remember" to copy-paste. Nobody can bypass.
- **Bottom-up:** You just crafted an amazing migration prompt at Layer 5? Package it as a Skill, promote to Layer 3, and the whole team uses it immediately via `fetch_skill`. Individual knowledge becomes shared asset.

Senior dev leaves? Skills stay. New engineer inherits them on day one.

This is **process-centric governance**: process distributes knowledge top-down while opening a highway for contributions bottom-up. It doesn't depend on anyone's diligence or memory.

---

### 3. Task Tracking

**Problem:** An agent ran a migration, staging went down. Who approved it? When? Based on what criteria? The answer is usually: "Let me find that Slack thread..." — and everyone knows that thread will never be found.

**Solution:** Task lifecycle tracking + approval gates with full audit trail:

```
  TASK LIFECYCLE & APPROVAL
  ┌────────┐  agent runs  ┌───────────┐  human reviews  ┌──────┐
  │  TODO  │─────────────▶│ IN REVIEW │────────────────▶│ DONE │
  └────────┘              └─────┬─────┘                 └──────┘
                                │ reject
                                ▼
                          ┌────────┐
                          │  TODO  │  (Alice rejected at 14:22:
                          └────────┘   "Schema change violates
                                        naming convention")

  When an incident occurs, trace backwards:
  ┌──────────────────────────────────────────────┐
  │ Incident #882                                │
  │ ← Task #412                                  │
  │ ← Agent: ReviewerBot (ID: 77c)               │
  │ ← Approved by: Alice at 14:22                │
  │ ← Context version: v2                        │
  │ ← Skills used: db_migrate_v4                 │
  │ ← Duration: 1m20s, Cost: $0.84               │
  └──────────────────────────────────────────────┘
```

Each task has a clear status. Each approval is tied to a person, a timestamp, a reason. When an incident happens, you trace the entire chain: which agent ran, who approved, which context version, what cost. **Data-driven incident response**, instead of opening Slack and scrolling until your eyes bleed.

---

### 4. Quality Gates

**Problem:** "The agent already knows TDD — it runs tests and fixes its own code. Why do we need quality gates at Outer?"

Fair question. But the answer is: yes, because of **Separation of Duties**.

Inner Harness gives the agent the ability to *self-correct* (TDD loop), and it does this reasonably well. But think carefully: the agent can just as easily comment-out a difficult test case to pass faster. Or it simply doesn't know that your org requires a SonarQube scan, or that minimum coverage must be ≥ 80%.

Basic principle: the one who writes the code should not be the only one judging their own code. Quality Gates at the Outer Harness serve as an independent immune system, completely separate from the agent:

```
  QUALITY GATES (Outer Harness, independent of agent)

  Agent output (already passed Inner TDD loop)
       │
       ▼
  ┌──────────────────────────────────────┐
  │  Gate 1: TypeCheck         Pass/Fail │
  │  Gate 2: Lint (ESLint)     Pass/Fail │
  │  Gate 3: Security (Snyk)   Pass/Fail │
  │  Gate 4: Coverage ≥ 80%    Pass/Fail │
  └──────────────────────────────────────┘
       │
       ▼  Score: 72/100
  ┌────────────────────────────────┐
  │  < 70? → reject, agent retries│
  │  ≥ 70? → forward to review    │
  └────────────────────────────────┘
```

**Process:** Agent output must go through an org-defined quality pipeline. No bypass possible.

**Data:** Every gate run produces logged results. Accumulate long enough and you start answering interesting questions: "Does Claude or GPT write fewer bugs for our codebase? Is the Frontend team improving or degrading over time?"

---

### 5. Audit & Analytics

The 4 pillars above, running correctly, generate a massive amount of data. The 5th pillar is where that data converges and truly delivers value.

**Audit Log** records every state change (task status, context edit, approval decision, gate result, cost event) in append-only format. No edits, no deletes. With hash chain (each record = hash of previous record + current payload), you get tamper-evidence — system-level proof against forgery.

```
  AUDIT & ANALYTICS PIPELINE

  Cost events ──┐
  Context edits ─┤
  Approvals ─────┤──▶ Audit Log (append-only, hash chain)
  Gate results ──┤         │
  Task events ───┘         ├──▶ Cross-Agent Analytics
                           │     ├─ Agent A vs B: quality trend
                           │     ├─ Team X vs Y: cost efficiency
                           │     ├─ Skill reuse: ROI by skill
                           │     └─ Model comparison: bug rate
                           │
                           └──▶ Compliance Export
                                 ├─ SOC 2 evidence pack
                                 ├─ ISO 27001 audit trail
                                 └─ Incident forensics
```

When the other 4 pillars run correctly, this pillar answers questions nobody could answer before:

- Which agent has the highest quality score at the lowest cost?
- Which skill gets reused the most and actually saves time?
- Which team is improving, which is declining?
- When an incident happens: exactly who, when, what context, how was it approved?

This is where **data-driven** converges: data isn't just for compliance. It becomes the basis for every strategic decision about AI in the organization.

---

## Two principles

Model generates output. Inner Harness keeps execution safe. But **Outer Harness** determines whether that output actually serves the organization:

| Question | Pillar |
|---|---|
| Does the output have the right context? | **Multi-layer Knowledge Flow** |
| How much does it cost and who pays? | **Cost Attribution** |
| Who approved it and can it be traced? | **Task Tracking** |
| Does quality meet org standards? | **Quality Gates** |
| Is data recorded so we can learn from it? | **Audit & Analytics** |

**Process-centric.** Human and Agent are both nodes on the same pipeline. Process determines which context gets injected, which output gets approved, which gates must pass. Not human intuition, not agent autonomy. Process decides.

**Data-driven.** Every operation produces structured data. Cost Attribution gives data about money. Quality Gates give data about quality. Audit Log keeps everything immutable. No data means no visibility. No visibility means forever guessing.

---

## Where Dandori fits

You're already building Outer Harness, whether you realize it or not. Every `CLAUDE.md` file, every shared prompt on Notion, every Slack message saying "remember to run lint before submitting" — all of it is Outer Harness in its most primitive form.

The question is: will you leave it as tribal knowledge living on individual laptops, or is it time to turn it into infrastructure?

**Dandori is an organizational outer harness** — the platform that lifts these 5 pillars from solo practice to team-wide, versioned, audited, governed infrastructure. It does not replace the inner harness. Claude Code, Codex, and Cursor still do what they do best.

[Why Dandori →]({{ site.baseurl }}{% link why-dandori.md %}) The full business case
{: .fs-5 }

[Core Features →]({{ site.baseurl }}{% link core-features.md %}) 13 modules organized under the 5 pillars
{: .fs-5 }

[Architecture →]({{ site.baseurl }}{% link architecture.md %}) Technical implementation
{: .fs-5 }

---

## Sources

The harness engineering concept is synthesized from:

- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) — Martin Fowler
- [Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — HumanLayer
- [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) — LangChain
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) — OpenAI
- [The importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026) — Phil Schmid

The inner/outer harness distinction and the 5-pillar framework are the author's original framing, drawing on the automotive wiring harness analogy.
