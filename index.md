---
layout: default
title: Home
nav_order: 1
description: "Dandori — The organizational outer harness for AI coding agents."
permalink: /
---

# Dandori
{: .fs-9 }

The organizational outer harness for AI coding agents.
{: .fs-6 .fw-300 }

[Why Dandori]({% link why-dandori.md %}){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[Core Features]({% link core-features.md %}){: .btn .fs-5 .mb-4 .mb-md-0 }

---

> **Agent sprawl is the new shadow IT.** A 10,000-engineer org runs tens of thousands of coding-agent sessions per day — with no cost breakdown, no audit log, no shared context, no approval trail. Every CLAUDE.md, skill, and MCP tool lives on a different laptop.

Your engineers already have great agents — Claude Code, Codex, Cursor, Cline. **What's missing is the layer around them** that lets engineers share context and coordinate work, and lets leadership govern, measure, and scale agent usage across thousands of engineers.

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

**Dandori does not write code.** Engineers coordinate and share context through it. Leadership measures, governs, and audits the agents that do the writing.

---

### The five questions Dandori answers

Every CTO asks them. Today the answers are *"we'd have to ask around."*

| # | Question | Dandori's answer |
|---|---|---|
| 1 | Where is the AI spend going? | Per-agent, per-team, per-project breakdown in real time |
| 2 | What context did the agent see? | 5-layer hierarchy, versioned, logged per run |
| 3 | Who approved this change? | Built-in approval workflow with audit trail |
| 4 | How good is the output? | Automated quality gates + per-agent trend lines |
| 5 | What if the engineer leaves? | Skills stay in org library, not individual laptops |

**[See how Dandori answers each →]({% link why-dandori.md %}#the-five-unanswered-questions)**

---

### Explore

- **[Why Dandori]({% link why-dandori.md %})** — The full case: problem, dual-audience value, ROI, differentiators
- **[Harness Engineering]({% link harness-engineering.md %})** — The industry concept behind Dandori
- **[Core Features]({% link core-features.md %})** — 13 capabilities with technical design links
- **[Use Cases]({% link use-cases.md %})** — 9 leadership + 3 engineer scenarios
- **[Architecture]({% link architecture.md %})** — Tech stack, modules, ecosystem integrations, use case flows
- **[Proposed Roadmap]({% link proposed-roadmap.md %})** — Milestone-by-milestone path from team pilot to full vision
- **[Data Inventory]({% link data-inventory.md %})** — Complete catalog of data Dandori collects, stores, and processes (for security and compliance review)

---

{: .text-center }
### Bring governance to your agents.

{: .text-center }
We're onboarding design-partner organizations running **1,000+ engineers**.

{: .text-center }
[hello@dandori.io](mailto:hello@dandori.io)
