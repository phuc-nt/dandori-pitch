---
hide:
  - navigation
  - toc
---

# Dandori

## The management layer for AI coding agents in the enterprise.

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

<div class="grid cards" markdown>

-   :material-help-circle:{ .lg .middle } **Why Dandori**

    ---

    The full case: problem, ROI, differentiators.

    [:octicons-arrow-right-24: Why Dandori](why-dandori.md)

-   :material-toolbox:{ .lg .middle } **Core Features**

    ---

    9 management capabilities with ASCII walkthroughs.

    [:octicons-arrow-right-24: Core Features](core-features.md)

-   :material-lightbulb-on:{ .lg .middle } **Use Cases**

    ---

    9 management scenarios for CTO, CISO, Platform, Compliance.

    [:octicons-arrow-right-24: Use Cases](use-cases.md)

-   :material-sitemap:{ .lg .middle } **Architecture**

    ---

    Technical integration surface for your stack.

    [:octicons-arrow-right-24: Architecture](architecture.md)

-   :material-office-building:{ .lg .middle } **Enterprise**

    ---

    Self-hosting, security, compliance, rollout path.

    [:octicons-arrow-right-24: Enterprise](enterprise.md)

</div>

---

<div style="text-align: center; padding: 2rem 0; margin-top: 2rem;">
<h3>Bring governance to your agents.</h3>
<p>We're onboarding design-partner organizations running <strong>1,000+ engineers</strong>.</p>
<p><a href="mailto:hello@dandori.io"><strong>hello@dandori.io</strong></a></p>
</div>
