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

**What's missing** is the layer above them: the one that lets your org **govern, measure, and scale** agent usage across thousands of engineers.

That's Dandori.

---

### Where Dandori sits

```
┌──────────────────────────────────────────────────────────┐
│                   ENGINEERING LEADERSHIP                 │
│          CTO · Platform · Security · Compliance          │
│   (needs: visibility · control · audit · attribution)    │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                        DANDORI                           │
│             ═════ management layer ═════                 │
│                                                          │
│   Cost       Context      Approval     Quality           │
│   tracking   governance   workflows    gates             │
│                                                          │
│   Audit      Skill        Task         Cross-agent       │
│   log        library      DAGs         analytics         │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│                      AI AGENTS                           │
│        Claude Code · Codex · Cursor · custom             │
│          (your engineers' existing tools)                │
└──────────────────────────────────────────────────────────┘
```

**Dandori does not write code.** It orchestrates, measures, and governs the agents that do.

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

| Role | What they govern |
|---|---|
| **CTO / VP Eng** | Cost trends, quality trends, vendor decisions |
| **Platform team** | Standards across teams, shared skill library |
| **CISO** | PII handling, audit exports, incident replay |
| **Compliance** | SOC 2 / ISO 27001 evidence, retention policies |
| **Engineering managers** | Team throughput, fair attribution, bottlenecks |

---

### Explore

- **[Why Dandori]({% link why-dandori.md %})** — The full case: problem, ROI, differentiators
- **[Core Features]({% link core-features.md %})** — 9 management capabilities with ASCII walkthroughs
- **[Use Cases]({% link use-cases.md %})** — 9 management scenarios for CTO, CISO, Platform, Compliance
- **[Architecture]({% link architecture.md %})** — Technical integration surface for your stack
- **[AIPF Integration]({% link aipf-integration.md %})** — How Dandori fits into enterprise AI platforms

---

{: .text-center }
### Bring governance to your agents.

{: .text-center }
We're onboarding design-partner organizations running **1,000+ engineers**.

{: .text-center }
[hello@dandori.io](mailto:hello@dandori.io)
