---
layout: default
title: Roadmap
nav_order: 6
description: "Milestone-by-milestone path from team pilot to full organizational outer harness."
---

# Roadmap

A proposal for enterprise partners — adaptable per team's needs.

---

## Current implementation status

As of 2026-04-16, Dandori is functional. M0 through M3 are complete; M4 and M5 are partially done.

| Milestone | Status | Notes |
|---|---|---|
| **M0 — Skeleton** | ✅ Done | Web UI, REST API, OpenAPI docs, API key auth, rate limiting |
| **M1 — Single-task MVP** | ✅ Done | Task board, Claude Code + Codex adapters, run record, cost logging, SSE streaming |
| **M2 — Knowledge Flow** | ✅ Done | 5-layer Context Hub, versioning + rollback, Skill Library, 9 Agent Templates |
| **M3 — Dual-audience value** | ✅ Done | Quality gates, cross-agent analytics, approval workflow, cost attribution + budget ceilings (daily/weekly/monthly) + spike detection, Fleet Ops Dashboard |
| **M4 — Advanced orchestration** | 🔶 Partial | Task DAG ✅, Codex adapter ✅, phase tags ✅ · Evaluation Suite ⏳ |
| **M5 — MCP + platform primitives** | 🔶 Partial | Built-in MCP server (15 tools) ✅, CLI tool ✅ · Inline Sensors ⏳, Tool Governance ⏳ |
| **M6 — Ecosystem integrations** | 🔶 Partial | Google Drive ✅ · Jira ⏳, GitHub Enterprise ⏳, Confluence ⏳ |

**903 tests, 0 TypeScript errors. Local deployment, single-user.** Phase 3 (auth + multi-user) is next.

---

## Non-goals

Dandori is the outer harness. It does **not** build:

| Non-goal | Owned by |
|---|---|
| Sandbox / filesystem / bash | Coding agent runtime |
| Sub-agent spawning | Coding agent runtime |
| Context window compaction | Coding agent runtime |
| Chat UI / IDE | Claude Code / Codex / Copilot |
| Model provider gateway | AI Gateway or provider direct |
| MCP server hosting | MCP Hub — Dandori governs, doesn't host |

---

## Foundation (F1-F4) — must come first

| # | Module | ~Effort | Why first |
|---|---|---|---|
| F1 | Service layer + REST API + Web UI + auth | 1 sprint | Everything surfaces through it |
| F2 | Audit Log + middleware | ½ sprint | Retrofitting compliance later is painful |
| F3 | Task Board CRUD (no DAG yet) | 1 sprint | Root entity for runs, cost, approval |
| F4 | Adapter layer + lifecycle event emission (Claude Code + run record) | 1 sprint | Without runs, nothing has data; lifecycle hooks later plug into these events |

**End state:** create task → spawn Claude Code → see output + cost in Web UI. Audit log records every mutation.

---

## Milestones

**M0 — Skeleton** (1 sprint): F1 + F2. Web UI, audit log, API keys.

**M1 — Single-task MVP** (2 sprints): F3 + F4. Create task → agent runs → run record stored. Foundation complete.

**M2 — Knowledge Flow** (2 sprints, parallelizable):
- Track A: Context Hub (5-layer assembly + versioning)
- Track B: Skill Library (basic, no progressive disclosure)
- Track C: Agent Templates (clone / customize / promote)

**M3 — Dual-audience value** (2-3 sprints, parallelizable):
- Track A: Quality Gates + Cross-agent Analytics (+ sub-agent rollup)
- Track B: Approval Workflow + Slack approvals
- Track C: Cost Attribution dashboard
- Track D: Fleet Operations Dashboard

*End of MVP. Both engineers and leadership get real value.*

**M4 — Advanced orchestration + evaluation** (2-3 sprints): Task DAG + auto-wakeup + phases. Codex adapter. Evaluation Suite (golden task sets + regression detection).

**M5 — MCP + platform primitives** (3-4 sprints, parallelizable): Built-in MCP server (pre-req), then: Inline Sensors, Tool Governance, Skill progressive disclosure, user-configurable Lifecycle Hooks (promote F4's infrastructure emission into org-wide, versioned hooks).

*Full outer harness. 13 user-facing features.*

**M6 — Ecosystem integrations** (2-3 sprints): Jira, Confluence, GitHub Enterprise, Copilot MCP registration. (Google Drive + Slack already in M3.)

---

## Three paths

| Path | Scope | Timeline (1 dev / 2-3 devs) |
|---|---|---|
| Minimal pilot | M0 → M1 → M2-A → M3-B → M6 (Jira+Slack) | ~3 mo / ~2 mo |
| Full vision | M0 → M1 → M2 → M3 → M4 → M5 → M6 | ~11 mo / ~6 mo |
| Enterprise | Full vision + AI platform integration | ~14 mo / ~8 mo |

Stop at any milestone — each delivers standalone value.

---

## Per milestone we deliver

1. Working code merged to main
2. Demo session (engineers + leadership invited)
3. Audit log evidence of usage during milestone
4. Retrospective report

---

## What we ask from partners

1. Pilot team of 5-15 engineers (already using Claude Code or Codex)
2. Read-only access to existing tools (Jira, Confluence, GitHub, Drive, Slack)
3. A sponsor in engineering leadership
4. Weekly 30-min sync for fast feedback
5. Honest feedback — "this doesn't help me" is most valuable

---

## Customization

This roadmap is a **proposal**, not a contract:

- Skip modules the partner doesn't need
- Promote urgent modules (e.g., Cost Attribution before Skill Library)
- Add integrations not in M6 (e.g., Linear instead of Jira)
- Pause between milestones for adoption
- Combine milestones with multiple devs

First conversation: "what does your team need first?" — roadmap re-orders around the answer.

---

## Read next

[Data Inventory →]({{ site.baseurl }}{% link data-inventory.md %}) What data Dandori touches — for security review
{: .fs-5 }
