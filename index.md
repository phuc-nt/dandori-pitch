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

Your engineers already have great agents — Claude Code, Codex, Cursor, Cline. **What's missing is the outer harness** that lets engineers share context and coordinate work, and lets leadership govern, measure, and scale agent usage across thousands of engineers.

That's Dandori. **One platform, two audiences** — engineers use it every day, leadership sees through it every week. Built on two principles: **process-centric** (human and agent follow the same pipeline) and **data-driven** (every operation produces structured data).

> See **[Outer Harness]({% link harness-engineering.md %})** for the full conceptual framing — what inner vs. outer harness means, why it matters, and the 5 pillars every organization needs.

---

### The 5 pillars

```
┌──────────────────────────────────────────────────────────┐
│                        DANDORI                           │
│              (organizational outer harness)               │
│                                                          │
│   1. Cost Attribution                                    │
│      Per-project, per-team, per-agent cost breakdown     │
│      Budget ceilings · Spike detection · Hard stops      │
│                                                          │
│   2. Multi-layer Knowledge Flow                          │
│      5-layer context hierarchy · Skill library           │
│      Top-down governance · Bottom-up contribution        │
│                                                          │
│   3. Task Tracking                                       │
│      DAGs · Phase workflow · Approval gates              │
│      Full incident traceability                          │
│                                                          │
│   4. Quality Gates                                       │
│      Independent of agent · Separation of duties         │
│      TypeCheck · Lint · Security · Coverage              │
│                                                          │
│   5. Audit & Analytics                                   │
│      Append-only log · Hash chain · Compliance export    │
│      Cross-agent comparison · Trend detection            │
│                                                          │
│   ──────────────────────────────────────────────────     │
│   Foundation: Integration Surface                        │
│   Web UI · CLI · REST API · MCP server                   │
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

| # | Question | Pillar | Dandori's answer |
|---|---|---|---|
| 1 | Where is the AI spend going? | Cost Attribution | Per-agent, per-team, per-project breakdown in real time |
| 2 | What context did the agent see? | Knowledge Flow | 5-layer hierarchy, versioned, logged per run |
| 3 | Who approved this change? | Task Tracking | Approval workflow with full audit trail |
| 4 | How good is the output? | Quality Gates | Automated gates + per-agent trend lines |
| 5 | What if the engineer leaves? | Knowledge Flow | Skills stay in org library, not individual laptops |

**[See how Dandori answers each →]({{ site.baseurl }}{% link why-dandori.md %}#the-five-unanswered-questions)**

---

### Explore

- **[Why Dandori]({% link why-dandori.md %})** — The full case: problem, dual-audience value, ROI, differentiators
- **[Outer Harness]({% link harness-engineering.md %})** — Inner vs. outer harness, the 5 pillars, two principles
- **[Core Features]({% link core-features.md %})** — 13 modules organized under the 5 pillars
- **[Use Cases]({% link use-cases.md %})** — 9 leadership + 3 engineer scenarios
- **[Architecture]({% link architecture.md %})** — Tech stack, modules, ecosystem integrations
- **[Proposed Roadmap]({% link proposed-roadmap.md %})** — Milestone-by-milestone path from team pilot to full vision
- **[Data Inventory]({% link data-inventory.md %})** — Complete catalog of data for security and compliance review

---

{: .text-center }
### Bring governance to your agents.

{: .text-center }
We're onboarding design-partner organizations running **1,000+ engineers**.

{: .text-center }
[hello@dandori.io](mailto:hello@dandori.io)
