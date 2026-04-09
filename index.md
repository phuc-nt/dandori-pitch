---
layout: default
title: Home
nav_order: 1
description: "Dandori — The management layer for AI coding agents in the enterprise."
permalink: /
---

# Dandori
{: .fs-9 }

The management layer for AI coding agents in the enterprise.
{: .fs-6 .fw-300 }

[Why Dandori]({% link why-dandori.md %}){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[Core Features]({% link core-features.md %}){: .btn .fs-5 .mb-4 .mb-md-0 }

---

**Your engineers already have great agents.** Claude Code, Codex, Cursor, Cline — they write code just fine.

**What's missing** is the layer around them: the one that lets engineers **share context and coordinate work**, and lets leadership **govern, measure, and scale** agent usage across thousands of engineers.

That's Dandori. **One platform, two audiences** — engineers use it every day, leadership sees through it every week.

> In industry vocabulary, Dandori is an **organizational outer harness**.
> `Agent = Model + Harness`. The harness has two tiers — inner (runtime sub-agents, sandbox, context compaction) and outer (context, skills, sensors, approval, orchestration). **Dandori is the outer harness at organizational scale. It does not replace the inner harness** — Claude Code, Codex, and Cursor still do what they do best.
> See **[Harness Engineering]({% link harness-engineering.md %})** for the full framing.

---

### Where Dandori sits

```
┌──────────────────────────────────────────────────────────┐
│                   ENGINEERING LEADERSHIP                 │
│          CTO · Platform · Security · Compliance          │
│   (needs: visibility · control · audit · attribution)    │
└───────────────────────────┬──────────────────────────────┘
                            │  governs via
                            ▼
┌──────────────────────────────────────────────────────────┐
│                        DANDORI                           │
│                                                          │
│   ─── analytics + control plane (leadership) ───         │
│   Cost attribution · Cross-agent analytics ·             │
│   Audit log · Compliance export · Budget ceilings        │
│                                                          │
│   ─── daily workspace (engineers) ───                    │
│   Context Hub · Task Board (DAGs, phases) ·              │
│   Skill Library · Approval review · Quality gates        │
└───────────────────────────┬──────────────────────────────┘
                            │  drives
                            ▼
┌──────────────────────────────────────────────────────────┐
│                      AI AGENTS                           │
│        Claude Code · Codex · Cursor · custom             │
│          (your engineers' existing tools)                │
└──────────────────────────────────────────────────────────┘
```

**Dandori does not write code.** Engineers use it to coordinate and share context. Leadership uses it to measure, govern, and audit the agents that do the writing.

---

### The five questions Dandori answers

Ask any CTO today — the answers are *"we'd have to ask around."*

| # | Question | Dandori's answer |
|---|---|---|
| 1 | Where is the AI spend going? | Per-agent, per-team, per-project breakdown in real time |
| 2 | What context did the agent see? | 5-layer hierarchy, versioned, logged per run |
| 3 | Who approved this change? | Built-in approval workflow with audit trail |
| 4 | How good is the output? | Automated quality gates + per-agent trend lines |
| 5 | What if the engineer leaves? | Skills stay in org library, not individual laptops |

---

### Before vs. with Dandori

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

### Who uses Dandori

Dandori is a **dual-audience platform**. Each module is designed primarily for one group, but both sides see the same truth.

**For engineers — daily workspace**

| Role | What they do in Dandori | Modules they live in |
|---|---|---|
| **Senior / staff engineer** | Publish skills, tune context, review outputs | Skill Library, Context Hub, Approval Review |
| **Team engineer** | Pick up tasks, run agents, track progress | Task Board (DAGs, phases), Context Hub, Quality Gates |
| **Tech lead** | Break features into task DAGs, assign agents by skill | Task Board, Skill matching, Dependencies |

**For leadership — control plane**

| Role | What they govern | Modules they consume |
|---|---|---|
| **CTO / VP Eng** | Cost trends, quality trends, vendor decisions | Cost Attribution, Cross-agent Analytics |
| **Platform team** | Standards across teams, shared skill library | Company context, Skill Library ownership, Budget ceilings |
| **CISO** | PII handling, audit exports, incident replay | Audit Log, Context versioning, PII tags |
| **Compliance** | SOC 2 / ISO 27001 evidence, retention policies | Audit export, Approval records |
| **Engineering managers** | Team throughput, fair attribution, bottlenecks | Per-team analytics, Approval tracking |

---

### Explore

- **[Why Dandori]({% link why-dandori.md %})** — The full case: problem, dual-audience value split, ROI, differentiators
- **[Harness Engineering]({% link harness-engineering.md %})** — The industry concept behind Dandori, and how Dandori fits into it
- **[Core Features]({% link core-features.md %})** — 13 capabilities tagged by audience (engineer / leadership / both)
- **[Use Cases]({% link use-cases.md %})** — 9 leadership scenarios + 3 engineer scenarios
- **[Architecture]({% link architecture.md %})** — Technical integration surface for your stack

---

{: .text-center }
### Bring governance to your agents.

{: .text-center }
We're onboarding design-partner organizations running **1,000+ engineers**.

{: .text-center }
[hello@dandori.io](mailto:hello@dandori.io)
