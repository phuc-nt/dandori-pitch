---
layout: default
title: Harness Engineering
nav_order: 3
description: "What harness engineering is, and where Dandori sits within it."
---

# Harness Engineering

The conceptual frame for understanding what Dandori is and what it isn't.

---

## The term

By early 2026, a phrase went mainstream across AI engineering blogs: **harness engineering**.

Martin Fowler wrote the definitive essay. HumanLayer popularized the CLAUDE.md pattern. LangChain published *The Anatomy of an Agent Harness*. OpenAI used it to describe how Codex wins in practice. Phil Schmid called it "the operating system for agents."

They all agree on one formula:

```
                 Agent = Model + Harness
```

> "If you're not the model, you're the harness."
> — LangChain, *The Anatomy of an Agent Harness*

**Harness is everything in an AI agent except the model itself.** System prompts, tools, skills, hooks, sub-agents, orchestration, sandbox, observability, feedback loops.

---

## The definition

**Harness engineering** is the discipline of designing the systems, constraints, and feedback loops that wrap around an AI model to make it reliable in production.

Mitchell Hashimoto framed it operationally:

> "Anytime you find an agent makes a mistake, you take the time to engineer a solution such that the agent never makes that mistake again."

The shift is profound. A software team's primary job is no longer just to write code — it is to **design the environment, specify the intent, and build the feedback loops** that let agents do reliable work.

Evidence from the field: *changing the harness while keeping the model the same can move an agent from average to top-tier.*

---

## The components (industry consensus)

Synthesizing Fowler, HumanLayer, LangChain, and Phil Schmid, a harness has these components:

```
┌──────────────────────────────────────────────────────────────┐
│                        HARNESS                               │
│                                                              │
│  GUIDES (feedforward — steer before acting)                  │
│    · System prompts (CLAUDE.md / AGENTS.md)                  │
│    · Context injection (project, team, task)                 │
│    · Skills (progressive disclosure)                         │
│    · Tool descriptions                                       │
│                                                              │
│  SENSORS (feedback — observe and self-correct)               │
│    · Back-pressure: typecheck, lint, tests                   │
│    · Quality gates                                           │
│    · Verification hooks                                      │
│    · Human approval gates                                    │
│                                                              │
│  ORCHESTRATION                                               │
│    · Sub-agents (context firewall)                           │
│    · Task DAGs, phase transitions                            │
│    · Model routing, handoffs                                 │
│                                                              │
│  STATE & INFRASTRUCTURE                                      │
│    · Filesystem, git, sandbox                                │
│    · Memory, storage                                         │
│    · Context management (compaction, offloading)             │
│                                                              │
│  OBSERVABILITY                                               │
│    · Logging, tracing, run records                           │
│    · Feedback data for iteration                             │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │    MODEL     │
                    │  (Claude,    │
                    │   Codex,     │
                    │   Gemini…)   │
                    └──────────────┘
```

Martin Fowler divides harness mechanisms into two fundamental controls:

- **Guides (feedforward)** — anticipate behavior, steer the agent *before* it acts.
- **Sensors (feedback)** — observe *after* the agent acts and help it self-correct.

A good harness uses both.

---

## The gap no one is filling

Today's harness engineering discourse is almost entirely **individual and local**:

```
  The 2025–2026 solo harness pattern:

    my-laptop/
      my-repo/
        ├─ CLAUDE.md          ← my system prompt
        ├─ .mcp.json          ← my tools
        ├─ .claude/
        │   ├─ hooks/         ← my verification scripts
        │   ├─ skills/        ← my progressive-disclosure skills
        │   └─ agents/        ← my sub-agents
        └─ src/...
```

Every developer reinvents their own harness on their own laptop. When they leave the company, the harness leaves with them. When a teammate joins, they start from zero.

**This is harness engineering as a solo discipline.**

The unanswered questions:

- Where does *team* harness live?
- How does a company roll out company-wide guides (security policies, coding standards) to every harness?
- How do you version and audit a harness when it's scattered across 10,000 laptops?
- How does leadership measure whether the harness is actually working?
- Where do skills — the most reusable asset — get shared across teams?

---

## Dandori = Organizational harness engineering

**Dandori takes harness engineering from a solo discipline and makes it a team sport.**

```
  The Dandori pattern:

    organization/
      ┌──────────────────────────────────────────────┐
      │   DANDORI — organizational harness layer     │
      │                                              │
      │   Guides (shared, versioned, inherited)      │
      │     · Company context (Layer 1)              │
      │     · Project context (Layer 2)              │
      │     · Team context   (Layer 3)               │
      │     · Agent context  (Layer 4)               │
      │     · Task context   (Layer 5)               │
      │     · Skill library (many-to-many)           │
      │                                              │
      │   Sensors (centralized, tracked over time)   │
      │     · Quality gates (TS, lint, test)         │
      │     · Approval workflow                      │
      │     · Self-explanation on every run          │
      │                                              │
      │   Orchestration                              │
      │     · Task DAGs with phase tags              │
      │     · Auto-wakeup on dependency complete     │
      │     · Adapter abstraction (Claude, Codex…)   │
      │                                              │
      │   Observability (new: org-scale)             │
      │     · Every run logged: cost, tokens,        │
      │       context versions, quality score        │
      │     · Cross-agent analytics                  │
      │     · Immutable audit log                    │
      └──────────────────────────────────────────────┘
              │
              ▼
      Engineers across all teams get the same
      harness — automatically, with governance.
```

Every component of Dandori maps to a standard harness component — but **elevated from laptop-local to org-shared**:

| Harness component (industry standard) | Solo pattern (2025) | Dandori pattern (org-scale) |
|---|---|---|
| System prompt / CLAUDE.md | File in repo root | **5-layer Context Hub**, versioned, diff + rollback, inheritance |
| Skills | Markdown folder on laptop | **Skill Library**, shareable, versioned, many-to-many attach |
| Hooks (human gates) | Bash script per developer | **Approval workflow** with audit trail |
| Back-pressure / sensors | Local typecheck exit code | **Quality gates** + org-wide trend analytics |
| Sub-agents / orchestration | Claude Code sub-agents | **Task Board + DAGs + phase tags + auto-wakeup** |
| Tool adapters | MCP servers per user | **Adapter architecture** (Claude, Codex, custom) |
| Observability | Dev reads local logs | **Run records + cost attribution + audit log** |

**11 out of 12 core Dandori modules map directly to the harness components listed by Fowler, HumanLayer, LangChain, and Phil Schmid.** The remaining module — compliance export — is a control plane built on top of the harness's observability layer.

---

## Why this positioning matters

Harness engineering is the correct vocabulary for what Dandori does. Using it gives three advantages:

### 1. Precision over "AI management"

"AI management platform" is vague. "Organizational harness engineering platform" is specific — it tells technical leaders *exactly* what the product is: the layer between their agents and their model.

### 2. Aligns with where the industry is going

By mid-2026, harness engineering is accepted as a distinct discipline. Codex, Claude Code, Cursor all ship with harness primitives (CLAUDE.md, hooks, sub-agents, skills). **But none of them scale those primitives across an organization.** Dandori is the first product to claim that space.

### 3. Explains why Dandori has two audiences

Solo harness engineering is an engineer's problem (my laptop, my prompts). **Organizational harness engineering is automatically dual-audience:**

- **Engineers** own and author the harness (context, skills, tasks, approvals).
- **Leadership** governs and measures the harness (cost, audit, compliance).

The same data powers both. Engineers get productivity from the same database that gives leadership governance. **Once you move harness from laptop to org, the control plane is a free byproduct of the observability layer.**

---

## The bet

> In 2025, harness engineering was what a few senior engineers did on their own laptops.
> In 2026, it becomes a discipline.
> In 2027, it becomes a shared organizational asset — versioned, audited, inherited.
>
> **Dandori is the platform for that shift.**

The parallels:

| Era | Solo practice | Org platform |
|---|---|---|
| 2000s | Ad-hoc shell scripts | **CI/CD platforms** (Jenkins, CircleCI) |
| 2010s | Logs scattered on servers | **Observability** (Datadog, Grafana) |
| 2015s | `if env.DEBUG` flags | **Feature flag platforms** (LaunchDarkly) |
| 2020s | Markdown runbooks | **Incident platforms** (PagerDuty, incident.io) |
| 2026+ | CLAUDE.md on laptops | **Dandori** — organizational harness |

---

## Sources & further reading

The harness engineering concept, as used here, is synthesized from:

- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) — Martin Fowler (definitive framework, guides vs sensors)
- [Skill Issue: Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents) — HumanLayer (practical CLAUDE.md patterns)
- [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) — LangChain (component breakdown)
- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) — OpenAI (production examples)
- [The importance of Agent Harness in 2026](https://www.philschmid.de/agent-harness-2026) — Phil Schmid (OS analogy)

---

## Next steps

- [Core Features →]({% link core-features.md %}) The 9 capabilities, each tagged by its harness component
- [Use Cases →]({% link use-cases.md %}) Scenarios for engineers and leadership using the harness
- [Architecture →]({% link architecture.md %}) How the harness is assembled technically
- [AIPF Integration →]({% link aipf-integration.md %}) Fitting an organizational harness into enterprise AI platforms
