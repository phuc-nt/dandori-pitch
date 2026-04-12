---
layout: default
title: Proposed Roadmap
nav_order: 7
description: "Implementation milestones from team pilot to full vision — a proposal for enterprise partners."
---

# Proposed Roadmap

A milestone-by-milestone path for enterprise partners who want to pilot Dandori at the team level and grow it into a full organizational outer harness.

This is a **proposal**, not a fixed plan. We adapt sequence and scope based on what each partner team needs first.

---

## Reading guide

- **Foundation (F1-F4)** — must-have core, ~3-4 sprints. Below this, nothing else makes sense.
- **Milestones M0-M6** — composable. Stop at any one and the previous still delivers value.
- **3 paths** — minimal viable pilot (3 months), full vision (~11 months), enterprise-ready (with AIPF integration).

Each milestone produces a **demo-able state** that can be shown to leadership and put in front of real engineers.

---

## Scope boundaries — what Dandori will NOT build

**Read this before every milestone.** These are explicit non-goals to prevent scope creep during implementation.

Dandori is the **outer harness**. It does not replace the inner harness (the coding agent runtime). Specifically, Dandori will NOT build:

| Non-goal | Owned by |
|---|---|
| Sandbox / filesystem / bash runtime | Coding agent runtime (Claude Code, Codex) |
| Sub-agent spawning engine | Coding agent runtime |
| Context window compaction | Coding agent runtime |
| Chat UI or IDE for writing code | Claude Code / Codex / Copilot / Cursor |
| Model provider gateway | AIPF Gateway, OpenRouter, or provider direct |
| Vector store for semantic code search | Runtime or dedicated service |
| MCP server *host* | MCP Hub — Dandori *governs*, doesn't host |

**Rule of thumb:** if a feature duplicates something Claude Code, Codex, or Cursor already do well, Dandori does not build it. See [Outer Harness]({% link harness-engineering.md %}#inner-vs-outer-harness) for the full inner-vs-outer framing.

---

## Foundation — must come first

| # | Module | Effort | Why first |
|---|---|---|---|
| F1 | Service layer + REST API + Web UI skeleton + auth | ~1 sprint | Every other module surfaces through it |
| F2 | Audit Log + middleware | ~½ sprint | Retrofitting compliance later is painful |
| F3 | Task Board CRUD (no DAG yet) | ~1 sprint | Root entity for runs, cost, approval |
| F4 | Adapter layer (Claude Code spawn + run record) | ~1 sprint | Without runs, nothing else has data |

**Foundation total: 3-4 sprints. End state:** create task → spawn Claude Code → see output in Web UI. Audit log records every mutation.

---

## Milestones

### M0 — Skeleton

**Effort:** 1 sprint
**Includes:** F1 + F2

**Demo:** "We have a web UI, an audit log, and API key authentication."

---

### M1 — Single-task MVP

**Effort:** 2 sprints
**Includes:** F3 + F4

**Demo:** "Create a task → Claude Code runs → run record stored with cost + tokens. View on web UI."

> Foundation complete. Stop here for a working PoC.

---

### M2 — Context + Skills (parallelizable)

**Effort:** 2 sprints (1 sprint with 2 devs)

| Track | Module |
|---|---|
| A | **Context Hub** (5-layer assembly + versioning + Web UI) |
| B | **Skill Library** (basic, no progressive disclosure yet) |

**Demo:** "Context inheritance works. A senior engineer publishes a skill. Every team agent picks it up automatically."

---

### M3 — Dual-audience value (parallelizable)

**Effort:** 2 sprints (1 sprint with 3 devs)

| Track | Module |
|---|---|
| A | **Quality Gates** (post-run) + **Cross-agent Analytics** |
| B | **Approval Workflow** + Slack interactive approvals |
| C | **Cost Attribution** dashboard |

**Demo:** "Engineers see quality and tasks. Leadership sees cost and analytics. Same database, two lenses."

> **End of MVP for the full vision.** Both engineers and leadership get real value.

---

### M4 — Advanced orchestration

**Effort:** 2 sprints

- Task **DAG** + auto-wakeup + phase tags + dependencies UI
- **Sub-agent Trace** (extend adapter protocol)
- **Codex CLI adapter** (in addition to Claude Code)

**Demo:** "Multi-phase feature DAG runs end-to-end. Research → design → implement → test → deploy with no manual handoffs."

---

### M5 — MCP server + 4 advanced modules (parallelizable)

**Effort:** 3-4 sprints (2 sprints with 4 devs)

**Pre-requisite:** Built-in MCP server (gating dependency for all 4 tracks below)

| Track | Module |
|---|---|
| A | **Inline Sensors** (computational + inferential) |
| B | **MCP Tool Governance** |
| C | **Skill Library** progressive disclosure (`fetch_skill` MCP tool) |
| D | **Lifecycle Hooks** (generic) |

**Demo:** "Full outer harness. 13 modules. Pitch literally true."

---

### M6 — Ecosystem integrations

**Effort:** 2-3 sprints

| Integration | Direction | Status |
|---|---|---|
| Google Drive (Workspace) | Inbound | Already shipped |
| Jira | Bidirectional | M6 |
| Confluence | Read-only | M6 |
| GitHub Enterprise | GitHub App, bidirectional | M6 |
| Slack | Notifier + slash + interactive (built in M3) | Mostly M3 |
| GitHub Copilot | MCP server registration | M6 (depends on M5) |

**Demo:** "Pilot-ready for any team using Jira, Confluence, GitHub Enterprise, Google Drive, and Slack."

---

## Three implementation paths

### Path 1: Minimal viable pilot — 3 months

Goal: prove the value to one real team, fastest possible.

```
M0 → M1 → M2-A (Context Hub only) → M3-B (Approval) → M6 (Jira + Slack)
```

≈ 6 sprints.

**Skips:** Skill Library, Quality Gates, Cost Attribution, Analytics, DAG, Sensors, Hooks, MCP Governance, Sub-agent Trace.

**Trade-off:** Engineer-only value (no leadership dashboards), single-task workflow only. Enough to prove "context inheritance + approval workflow + Jira sync" beats CLAUDE.md scattered on laptops.

### Path 2: Full vision — ~11 months

Goal: deliver the full pitch — 13 modules, ~91% outer harness coverage, dual-audience.

```
M0 → M1 → M2 → M3 → M4 → M5 → M6
```

≈ 14-16 sprints.

### Path 3: Enterprise-ready — 13-16 months

Goal: full vision plus AIPF integration layer (subscriber for GenAI Gateway billing, Sentinel correlation, agent lifecycle management, compliance report generator).

Path 2 + AIPF integration sprints.

See [AIPF Integration]({% link aipf-integration.md %}) for the AIPF-specific work (link-only — not in nav).

---

## Effort by team size

| Path | 1 dev | 2-3 devs (parallel tracks) |
|---|---|---|
| Minimal viable pilot | ~3 months | ~2 months |
| Full vision | ~11 months | ~6 months |
| Enterprise-ready | ~14 months | ~8 months |

---

## What we deliver each milestone

Every milestone produces:

1. **Working code** merged to main branch
2. **A demo session** with the partner — engineers and leadership both invited
3. **Updated pitch docs** reflecting any new capability
4. **Audit log evidence** of partner usage during the milestone (cost, quality, runs)
5. **Retrospective report** — what worked, what to adjust before the next milestone

---

## What we ask from partners

To make a pilot succeed, we ask each partner team for:

1. **A pilot team** of 5-15 engineers, ideally already using Claude Code or Codex
2. **Existing tools** access (read-only): Jira project, Confluence space, GitHub repo, Google Drive folder, Slack channel
3. **A sponsor** in engineering leadership who reviews monthly cost / quality reports
4. **A weekly 30-min sync** during the active milestone for fast feedback
5. **Honest feedback** on gaps — "this doesn't help me" is more valuable than "this is great"

---

## Skip / accelerate / customize

This roadmap is a **proposal**, not a contract. Concrete adjustments we make per partner:

- **Skip a module** the partner doesn't need (e.g., skip MCP Governance if no MCP tools)
- **Promote a module** the partner needs urgently (e.g., do Cost Attribution before Skill Library)
- **Add an integration** that's not in M6 (e.g., Linear instead of Jira)
- **Combine milestones** if the partner has multiple devs working in parallel
- **Pause** between milestones for the partner to absorb and adopt

The first conversation with every partner is "what does your team need first?" — and the roadmap gets re-ordered around that answer.

---

## Risk register (transparent)

What can slow each milestone, and how we handle it:

| Risk | Likelihood | Mitigation |
|---|---|---|
| Adapter protocol changes (Claude Code or Codex) | Medium | Adapter layer is a clean boundary; rewrites are localized |
| Partner team has unique auth requirements | High | API key works for pilot; SSO/OIDC added in M5+ window |
| Existing tool API rate limits (Jira, Confluence) | Low | Caching layer + scheduled sync rather than realtime |
| Hooks sandbox breaks on partner OS | Low | Subprocess pattern is portable; container fallback ready |
| MCP spec evolves mid-implementation | Medium | We track MCP weekly; minor schema changes are non-breaking |
| Partner adoption stalls after Phase 1 | Medium | Phase 1 delivers standalone value; no lock-in to continue |

---

## Next steps for prospective partners

1. **Intro call** (30 min) — share your current AI agent stack and pain points
2. **Architecture review** (1 hour) — walk through [Architecture]({% link architecture.md %}) and identify integration points
3. **Pilot scoping** (1 hour) — pick the path (1, 2, or 3) and the first 2 milestones
4. **Pilot kickoff** — first sprint begins; weekly sync set up
5. **Demo at end of each milestone** — review with engineering leadership

Get in touch: [hello@dandori.io](mailto:hello@dandori.io)

---

## Related

- [Why Dandori]({% link why-dandori.md %}) — The case
- [Outer Harness]({% link harness-engineering.md %}) — The 5 pillars and two principles
- [Core Features]({% link core-features.md %}) — 13 modules organized under the 5 pillars
- [Architecture]({% link architecture.md %}) — Technical target this roadmap builds toward
- [Use Cases]({% link use-cases.md %}) — Scenarios that drive milestone priority
