---
layout: default
title: AIPF Integration
nav_exclude: true
search_exclude: true
description: "How Dandori fits into an organization already running an AI Platform (AIPF). Hidden from nav — share this link directly with AIPF stakeholders."
---

# AIPF Integration

How Dandori fits into an organization that already runs an AI Platform (AIPF). This page addresses the most common question: **"We already have an AI platform — why do we need Dandori?"**

**Short answer:** AIPF handles *execution*. Dandori adds the **two layers AIPF doesn't have**: a daily workspace for engineers (context, tasks, skills) and a control plane for leadership (cost, audit, compliance).

**In harness engineering terms:** AIPF's MultiAgent Runtime is an *inner harness* (it runs agents). **Dandori is the *outer harness at organizational scale*** — context, skills, sensors, approval, orchestration — which AIPF does not ship. Dandori does not replace the runtime; it wraps it with the organizational layer it's missing. See [Harness Engineering]({% link harness-engineering.md %}) for the full framing.

---

## The gap in every AI platform

Your AIPF stack handles the **execution layer** well:

- Model gateway (routing, rate limiting, billing)
- Agent runtime (MultiAgent Builder, bot execution)
- Security scanning (Sentinel)
- Developer tools (AI Developer, MCP Hub)

**What's missing is the layer around it** — both the engineer-facing workspace *and* the leadership-facing control plane.

```
  ┌──────────────────────┐      ┌──────────────────────────┐
  │     ENGINEERS        │      │  ENGINEERING LEADERSHIP  │
  │  (staff, tech leads, │      │  CTO · CISO · Platform   │
  │   team engineers)    │      │                          │
  │                      │      │  "Which agent costs      │
  │  "Where do I share   │      │   most?"                 │
  │   context?"          │      │  "Who approved this?"    │
  │  "How do I chain     │      │  "What context did it    │
  │   agents?"           │      │   see?"                  │
  │  "Where are the      │      │                          │
  │   team skills?"      │      │                          │
  └──────────┬───────────┘      └──────────┬───────────────┘
             │                             │
       ??? no workspace layer       ??? no governance layer
             │                             │
             └──────────────┬──────────────┘
                            ▼
                ┌───────────────────────────┐
                │       AIPF STACK          │
                │                           │
                │  GenAI Gateway │ Runtime  │
                │  Sentinel      │ MCP Hub  │
                │  AI Developer  │ Data Hub │
                └───────────────────────────┘
```

Dandori fills **both** `???` layers.

---

## Dandori = Workspace + Management Layer

Dandori does not replace any AIPF product. It sits **around** them and adds two missing layers: a daily workspace for engineers, and a control plane for leadership.

```
  ┌──────────────────────┐        ┌──────────────────────┐
  │      ENGINEERS       │        │     LEADERSHIP       │
  │  (daily workspace)   │        │  (control plane)     │
  └──────────┬───────────┘        └──────────┬───────────┘
             │                               │
             ▼                               ▼
  ┌─────────────────────────────────────────────────────┐
  │                      DANDORI                        │
  │                                                     │
  │  👷 Engineer workspace                              │
  │    · Context Hub (5-layer)                          │
  │    · Task Board (DAGs, phases, dependencies)        │
  │    · Skill Library                                  │
  │    · Approval review queue                          │
  │    · Self-explanation on every run                  │
  │                                                     │
  │  🧭 Leadership control plane                        │
  │    · Cost Attribution (per-agent/task/project)      │
  │    · Cross-agent Analytics                          │
  │    · Quality Gates (trend view)                     │
  │    · Audit Log + Compliance Export                  │
  │    · Budget ceilings + spike alerts                 │
  └───────────────────────┬─────────────────────────────┘
                          │
  ┌───────────────────────▼─────────────────────────────┐
  │                  AIPF STACK                          │
  │                                                      │
  │  GenAI Gateway    │   MultiAgent Runtime             │
  │  Sentinel         │   MCP Hub                        │
  │  AI Developer     │   AgentMemory                    │
  │  Data Hub         │   App Catalog                    │
  └──────────────────────────────────────────────────────┘
```

---

## Gaps Dandori fills (by audience)

### 👷 Engineer gaps (daily workspace)

| Gap (Engineers ask) | AIPF today | Dandori module |
|---|---|---|
| "Where do I share context with my team's agents without copy-pasting docs?" | No org-wide context governance | **5-Layer Context** (Company → Project → Team → Agent → Task) |
| "How do I chain multi-phase agent work without playing Slack dispatcher?" | Bot runtime — no task visibility | **Task Board** with DAGs, phase tags, dependencies |
| "Where do I publish a proven prompt pattern so the team actually reuses it?" | App Catalog (partial) | **Skill Library** — org-wide, versioned, shareable |
| "How do I pick up an in-review task with full context?" | No review queue | **Approval Review** + self-explanation blocks |

### 🧭 Leadership gaps (control plane)

| Gap (Leadership asks) | AIPF today | Dandori module |
|---|---|---|
| "Where is the cost going — by team, project, agent?" | GenAI Gateway billing — no per-agent/per-task breakdown | **Cost Attribution** with budget ceilings |
| "Who approved this output? When? Based on what?" | No approval mechanism | **Approval Workflow** with audit trail |
| "Is the output any good? Trending up or down per team?" | No quality measurement | **Quality Gates** + per-agent trend analytics |
| "Show me every AI-generated change in Q3 for the auditor." | Scattered logs | **Audit Log** + Compliance Export |

---

## Integration map (no overlap)

Dandori **consumes data from** AIPF products. It does not duplicate them.

| Dandori module | Integrates with | Relationship |
|---|---|---|
| Cost Attribution | GenAI Gateway Billing | **Subscribes** to billing events, enriches with agent/task/project metadata |
| Agent Lifecycle | MultiAgent Runtime | **Complements**: Runtime executes, Dandori manages lifecycle (active/paused/retired) |
| Task Board | — | **New layer**: AIPF has no task/project management |
| Context Hub | AgentMemory | **Different scope**: Context Hub = org-wide top-down governance; AgentMemory = per-agent learned memory |
| Quality Gates | Sentinel, CI/CD | **Aggregates**: collects signals from Sentinel + CI/CD, computes quality score |
| Skill Library | App Catalog | **Extends**: App Catalog lists tools; Skill Library stores reusable prompt knowledge |
| Approval Workflow | — | **New layer**: no approval mechanism in AIPF |
| Audit Log | — | **New layer**: cross-cutting agent activity trail |

### Context Hub vs. AgentMemory — not the same thing

| | Dandori Context Hub | AIPF AgentMemory |
|---|---|---|
| **Direction** | Top-down (admin → agents) | Bottom-up (agent learns) |
| **Scope** | Organizational: company, project, team | Individual: per-agent, per-session |
| **Content** | Policies, standards, architecture docs | Conversation history, learned preferences |
| **Owner** | CTO, team leads, platform team | The agent itself |
| **Versioned** | Yes, with diff + rollback | No |

They complement each other. Context Hub governs what the agent *should* know. AgentMemory tracks what the agent *has* learned.

---

## What Dandori does NOT build

These are already solved by AIPF. Dandori delegates instead of duplicating.

| Capability | AIPF product | Dandori approach |
|---|---|---|
| Agent execution / runtime | MultiAgent Runtime | Delegate — call AIPF Runtime API, don't build adapters |
| Model routing / gateway | GenAI Gateway | Consume — subscribe to billing data |
| Security scanning | Sentinel | Integrate — correlate security events with agent activity |
| MCP tool hosting | MCP Hub | Register — publish Dandori tools to MCP Hub, don't run separate hub |
| Code-level CI/CD | AI Developer | Complement — Dandori checks policy compliance, not syntax |

---

## New capabilities for AIPF orgs

Three features specifically designed for organizations running AIPF:

### 1. Agent Lifecycle Management

AIPF MultiAgent Builder creates agents. **Dandori manages them after creation.**

- Register agents from MultiAgent Builder into Dandori's management layer
- Set per-agent budgets, skill assignments, lifecycle states (active/paused/retired)
- Track performance over time across the full agent fleet

### 2. Sentinel Event Correlation

Connect agent activity to security events for full auditability.

- Subscribe to Sentinel event stream
- Correlate: agent run → security flag → project → team
- Display on unified dashboard: "Agent X triggered security event Y during task Z"
- Compliance teams get one view: business action + security impact

### 3. Compliance Report Generator

Auto-generate audit reports from Dandori + AIPF data.

- SOC 2 Type II, ISO 27001 templates
- Monthly/quarterly auto-generation
- Export: PDF, CSV
- Data sources: audit log, cost attribution, quality scores, approval records, Sentinel events

---

## Deployment within AIPF

Dandori runs as a lightweight service alongside your AIPF stack.

| Dimension | Answer |
|---|---|
| **Footprint** | Single Node.js process + SQLite/Postgres |
| **Network** | Consumes AIPF APIs (Gateway, Runtime, Sentinel) |
| **Data** | All data stays in your infrastructure |
| **Auth** | API keys today, SSO/OIDC planned |
| **HA** | Stateless server, replicated database |

No additional AI provider accounts needed — Dandori uses AIPF's existing provider connections.

---

## Adoption path

### Phase 1 — Pilot (4 weeks)

- Deploy Dandori alongside AIPF
- Connect to GenAI Gateway billing API
- Migrate 2-3 teams' agents into Dandori management
- Demonstrate: cost breakdown, approval workflow, quality scores

### Phase 2 — Expand (6 weeks)

- Roll out company-wide context governance
- Integrate Sentinel event correlation
- Agent Lifecycle Management for MultiAgent Builder agents
- Cross-team analytics dashboard for leadership

### Phase 3 — Production (4 weeks)

- Full compliance report generation
- MCP Hub registration for Dandori tools
- Knowledge federation across all teams via Skill Library

---

## ROI within AIPF ecosystem

*Conservative estimates for a 1,000-engineer organization already running AIPF.*

| Lever | Monthly savings |
|---|---|
| **Cost visibility** — identify 10% wasted tokens via per-agent breakdown | $30,000 |
| **Context reuse** — 30 min/week saved per engineer on prompt management | $12,500 |
| **Quality gates** — 20% fewer regressions from agent-generated code | (your incident cost) |
| **Compliance** — passes SOC 2 AI-usage controls without custom tooling | (your auditor cost) |

**Typical payback: 2-3 months.** Infrastructure cost is trivial — one small service alongside your existing AIPF deployment.

---

## Next steps

1. **Alignment meeting** — confirm integration points with AIPF Gateway and Runtime teams
2. **Technical deep-dive** — API contracts, data flow, authentication
3. **MVP demo** — Cost Attribution + Task Board + Context Hub + Audit Log on real AIPF data
4. **Pilot metrics** — define success criteria for 4-week pilot

---

- [Core Features →]({% link core-features.md %}) The 13 outer-harness capabilities in detail
- [Use Cases →]({% link use-cases.md %}) Management scenarios for CTO, CISO, Platform, Compliance
- [Architecture →]({% link architecture.md %}) Technical integration surface
