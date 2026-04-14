---
layout: default
title: CLI Pilot Proposal
nav_exclude: true
search_exclude: true
description: "Distributed CLI pilot — knowledge flow, run tracking, audit, analytics. Zero central orchestration."
---

# CLI Pilot Proposal
{: .fs-9 }

A distributed pilot of the outer-harness idea: every engineer runs a local CLI + skill bundle, shared knowledge lives on the internal GitHub Enterprise as a marketplace, and a central server aggregates events into a leadership dashboard.
{: .fs-6 .fw-300 }

*Unlisted page — share the direct URL only with stakeholders.*

---

## Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. The idea

A **lightweight CLI + skill bundle** on each engineer's workstation. A **knowledge marketplace** on the internal GitHub Enterprise. A **small central server** that aggregates events and renders a leadership dashboard.

Pilot focuses on three of the five outer-harness pillars:

1. **Knowledge Flow** — shared context, skills, and agent templates moving top-down and bottom-up.
2. **Tracking & Audit** — every agent run recorded, attributable, append-only.
3. **Analytics** — leadership dashboard showing activity, cost, and trends.

**Cost tracking** comes free as a by-product (tokens × price table). **Quality gates** and **evaluation suites** are deliberately out of scope.

**Target runtimes:** Claude Code, Codex CLI, GitHub Copilot CLI.

**Why this shape?**

- No central orchestrator → no deploy pain, no shared-DB headaches, minimal onboarding friction.
- GitHub Enterprise already holds code — reusing it for knowledge means **zero new security review**.
- Works across all three runtimes without patching them — we wrap and observe, never modify.
- If the pilot succeeds, the same foundation extends upward (task board, quality gates, approval workflow) without rewriting anything.

---

## 2. Architecture overview

```
╔══════════════════════════════════════════════════════════════╗
║                  ENGINEER WORKSTATION                         ║
║                                                              ║
║    ┌────────────────────────────────────────────────────┐   ║
║    │                 dandori CLI                         │   ║
║    │                                                      │   ║
║    │   dandori run -- <agent>     wrapper (guarantee)   │   ║
║    │   dandori watch              tailer daemon         │   ║
║    │   dandori event              semantic event        │   ║
║    │   dandori fetch / push       knowledge sync        │   ║
║    │   dandori sync               event upload          │   ║
║    └────────────────────────────────────────────────────┘   ║
║         │                │                │                 ║
║         ▼                ▼                ▼                 ║
║  ┌───────────┐  ┌────────────────┐  ┌───────────┐          ║
║  │~/.dandori/│  │ Agent runtime  │  │ Git CLI   │          ║
║  │ local.db  │  │  Claude Code   │  │ (GH Ent)  │          ║
║  │ cache/    │◀─│  Codex CLI     │  └─────┬─────┘          ║
║  │ skills/   │  │  gh copilot    │        │                ║
║  └─────┬─────┘  │  (unchanged)   │        │                ║
║        │        └────────────────┘        │                ║
╚════════╪══════════════════════════════════╪════════════════╝
         │ event batch (every 5 min)         │ pull / push
         ▼                                   ▼
 ┌───────────────────┐          ┌─────────────────────────┐
 │ MONITORING SERVER │          │ KNOWLEDGE MARKETPLACE   │
 │                   │          │ (GitHub Enterprise)     │
 │ - ingest API      │          │                         │
 │ - aggregate DB    │          │  layers/                │
 │ - dashboard UI    │          │    1-company/           │
 │                   │          │    2-project/           │
 │                   │          │    3-team/              │
 │                   │          │    4-agent/             │
 │                   │          │    5-task/              │
 │                   │          │  skills/                │
 │                   │          │  templates/             │
 │                   │          │  dandori.yaml           │
 └───────────────────┘          └─────────────────────────┘
```

**Four moving parts:**

1. **Dandori CLI** — single Go binary on each workstation, zero runtime dependencies.
2. **Local state** (`~/.dandori/`) — SQLite DB, knowledge cache, skill files.
3. **Knowledge marketplace** — a GitHub Enterprise repo, RBAC via GitHub teams + CODEOWNERS.
4. **Monitoring server** — read-heavy aggregate + dashboard, receives batched events.

---

## 3. Instrumentation — three-layer defense

**The core insight.** Data capture uses three independent mechanisms layered for redundancy. Each layer has a different guarantee level and a different kind of data.

```
              ┌───────────────────────────────────┐
              │  LAYER 3  —  SKILL                │
              │                                   │
              │  Semantic events:                 │
              │    - decision rationale           │
              │    - task link                    │
              │    - files touched                │
              │    - skill/template used          │
              │                                   │
              │  Guarantee: best-effort           │
              │  Source: agent calls CLI          │
              │  Value: forensics, analytics      │
              └───────────────────────────────────┘
              ┌───────────────────────────────────┐
              │  LAYER 2  —  TAILER               │
              │                                   │
              │  Enrichment events:               │
              │    - input / output tokens        │
              │    - cache write / cache read     │
              │    - model used                   │
              │    - derived cost (USD)           │
              │                                   │
              │  Guarantee: runtime-log dependent │
              │  Source: session-log parsing      │
              │  Value: cost + usage analytics    │
              └───────────────────────────────────┘
              ┌───────────────────────────────────┐
              │  LAYER 1  —  WRAPPER  (base)      │
              │                                   │
              │  Skeleton events:                 │
              │    - run_id                       │
              │    - user, cwd, command, git HEAD │
              │    - start / end timestamps       │
              │    - exit code, duration          │
              │                                   │
              │  Guarantee: 100% (process fork)   │
              │  Source: fork/exec lifecycle      │
              │  Value: accounting, audit, count  │
              └───────────────────────────────────┘
```

### Why three layers?

| If you have only… | You get… | You miss… |
|---|---|---|
| Skill only | Rich semantics | Any run where agent forgot to call CLI, crashed mid-run, or had skill compacted out of context |
| Wrapper only | Reliable run count | Token usage, cost, tool calls, decision rationale |
| Wrapper + Tailer | Run count + cost + usage | Decision rationale, task linkage |
| All three | Full picture | (accept any single layer failing independently) |

**The wrapper is non-negotiable.** Without it, the dashboard's data quality depends on voluntary reporting — a best-effort path that degrades silently as the pilot scales.

### Wrapper is transparent

```bash
# Engineer installs once:
dandori init
# appends to shell rc:
#   alias claude='dandori run -- claude'
#   alias codex='dandori run -- codex'
#   alias copilot='dandori run -- gh copilot'
```

From then on, `claude "fix bug"` goes through the wrapper transparently. Ctrl-C, stdin, exit codes all work as normal. Opt-out per-invocation with `\claude`.

### Tailer reads what runtimes already write

Each runtime writes a session log. The tailer polls those files, parses new lines, extracts usage. Zero invasion, no TLS MITM, no SDK hooks.

| Runtime | Session log | Tokens available |
|---|---|---|
| Claude Code | `~/.claude/projects/<cwd>/*.jsonl` | ✅ 4-token model |
| Codex CLI | `~/.codex/sessions/*.jsonl` | ✅ input/output |
| gh copilot | TBD — needs one-day spike | ⚠️ to confirm |

**Correlation** between wrapper runs and runtime sessions: wrapper snapshots the session-log directory before and after `exec`; the new file that appears is this run's session. Mapping stored in `local.db`.

---

## 4. Knowledge flow — marketplace pattern

```
    TOP-DOWN (distribution)              BOTTOM-UP (contribution)
    ──────────────────────              ────────────────────────

  CTO / Platform lead                   Engineer hits a good prompt
         │                                       │
         ▼                                       ▼
  edits layers/1-company/               wraps as skill/template
  opens PR                              opens PR to marketplace
         │                                       │
         ▼                                       ▼
  Admin team reviews, merges            Team lead reviews, merges
         │                                       │
         ▼                                       ▼
  engineers run `dandori fetch`         engineers run `dandori fetch`
         │                                       │
         ▼                                       ▼
  ~/.dandori/cache/ updated             ~/.dandori/cache/ updated
         │                                       │
         ▼                                       ▼
  next agent run picks up the           other engineers discover via
  new policy automatically              `dandori skill search <term>`
```

**Key properties:**

- All changes go through **PR review** → quality gate via existing code-review culture.
- All changes are **versioned** → rollback is `git revert`.
- **CODEOWNERS** enforces who can merge which paths — no custom RBAC layer.
- **Inheritance hierarchy** lives in `dandori.yaml` (manifest), not CLI code → updating it doesn't require a CLI release.

### Three asset types, same mechanism

All flowing through the same marketplace repo:

- **Context** — policies, standards, architecture docs, task specs (`layers/`)
- **Skills** — reusable prompt templates (code review checklist, migration recipe, incident runbook)
- **Agent templates** — complete agent recipes (role + skill references + tool allow-list) that engineers can clone and customize

Senior leaves the company? Context, skills, and templates are still in the repo. New engineer inherits them on day one.

### 5-layer context resolution

When the agent runs inside a given project/team, `dandori fetch` resolves which layers apply:

```
  Layer 1  company-wide  →  always applied
  Layer 2  project       →  resolved from cwd → project mapping
  Layer 3  team          →  resolved from git remote → team mapping
  Layer 4  agent role    →  resolved from skill/template in use
  Layer 5  task          →  opt-in, engineer supplies task_id
```

Resolution rules declared in `dandori.yaml`. The agent consumes files from `~/.dandori/cache/` as plain Markdown — no extra tooling inside the runtime.

---

## 5. Data flow — end-to-end

```
   Engineer: $ claude "implement feature X"
        │
        ▼
   1. dandori run (wrapper)
      - emit run_started → local.db
      - snapshot session-log dir
      - fork/exec agent
        │
        ▼
   2. Agent runtime (unchanged)
      - reads ~/.dandori/cache/layers/*
      - reads ~/.dandori/skills/*
      - writes session log
      - calls `dandori event ...` (skill)
      - exits
        │
        ▼
   3. dandori run (post-exec)
      - emit run_ended → local.db
      - map run_id ↔ session_id
        │
        ▼
   4. dandori watch (background, every 60s)
      - parses session-log new lines
      - extracts tokens, model, tool calls
      - computes cost → local.db
        │
        ▼
   5. dandori sync (every 5 min)
      - POST /events batch → monitoring server
        │
        ▼
   6. Dashboard
      - run visible within 5-10 min
```

**Batch, not realtime.** For the pilot, 5-minute latency is indistinguishable from 5-second latency to leadership viewers. Realtime intercept is avoided because it would require TLS MITM or SDK hooks — neither is friendly to enterprise security review.

---

## 6. Cost tracking

Cost is **derived from tokens**, not from billing API. Formula:

```
cost_usd = ( input_tokens       × input_price
           + output_tokens      × output_price
           + cache_write_tokens × cache_write_price
           + cache_read_tokens  × cache_read_price
           ) / 1,000,000
```

All four token buckets tracked separately. Prompt caching discounts (cache read ≈ 10% of input, cache write ≈ 125%) shift real cost by **30–50%** on long Claude Code sessions — ignoring them produces meaningfully wrong numbers.

**Gaps to disclose up front:**

- If `gh copilot` CLI doesn't emit token counts in its log, cost tracking for Copilot is **run-count only** until upstream adds it.
- Cursor, Aider, and similar runtimes are **not** in pilot scope.

---

## 7. Role model

**One CLI binary.** Role-gating at command-execution time by consulting GitHub team membership.

```
   GitHub team             →  CLI capability
   ───────────                ────────────────────────────

   admins                  →  edit layers/1-company/**
                              edit layers/4-agent/**
                              edit templates/**, skills/**
                              full dashboard access

   project-leads           →  edit layers/2-project/<project>/
                              edit layers/3-team/<teams>/
                              project/team dashboard

   team-leads              →  edit layers/3-team/<team>/
                              team dashboard

   engineers               →  edit layers/5-task/<self>/
                              propose PRs anywhere (no merge)
                              run, watch, sync, fetch, event
                              own + team dashboard
```

**The real gate is CODEOWNERS in the marketplace repo.** The CLI's role check is a UX convenience that prevents obvious mistakes.

---

## 8. Data governance — what we collect and what we don't

| ✅ Collected | ❌ NOT collected |
|---|---|
| Run metadata (run_id, user, cwd, git commit, timing) | Full prompts |
| Token counts + derived cost | Full LLM responses |
| Tool call metadata (tool name only) | Tool call arguments or results |
| Semantic events from skill (decisions, task links) | File contents the agent writes |
| Knowledge files in marketplace | API keys, credentials, secrets |

**Controls:**

- Append-only event table at DB level (UPDATE/DELETE blocked).
- Optional **hash chain** on events — tamper-evident with ~10 LOC overhead.
- Secret scrubber regex pass before insert — redacts known secret patterns.
- TLS everywhere; self-hosted; **no third-party data flow**.
- Raw session logs stay on engineer's workstation — never synced.

---

## 9. Non-goals (explicit)

To keep the pilot focused, these are explicitly NOT in scope:

- Task board, DAG orchestration, shared central state
- Approval workflows (Slack, email gates)
- CI/CD integration for quality gates
- Evaluation suite / golden-set regression runs
- Real-time agent supervision or termination
- Model provider gateway (runtimes hit providers directly)
- Sandbox or execution environment (agent runtime owns that)
- Any modification to the agent runtimes themselves

If the pilot succeeds, these become candidates for phase 2 — not before.

---

## 10. Open questions

These need clarification before we lock the pilot plan:

1. **Pilot size.** How many engineers in the first cohort? 5, 15, 50? Affects sync scaling and parser priority.
2. **Runtime mix.** Split across Claude Code, Codex, Copilot — roughly equal, or does one dominate?
3. **Billing source for cost reconciliation.** Is there a provider billing export we can cross-check tokens-derived cost against?
4. **Dashboard hosting.** Deploy our own dashboard UI, or feed metrics into an existing Grafana / Metabase / Datadog?
5. **GitHub Enterprise version.** Affects what CODEOWNERS and branch-rule features we can rely on.
6. **Auth model for monitoring server.** GitHub Enterprise OAuth, or existing SSO (Okta, Azure AD)?
7. **Retention policy.** How long do events live on the server — 90 days, 365 days, indefinitely?
8. **Data residency.** Any requirement for the server to live in a specific region?
9. **Privacy review.** Any workers'-council / privacy-council review needed for per-engineer activity tracking? (Jurisdiction-dependent.)
10. **Existing MCP adoption.** Is the team already using MCP servers? If yes, tool governance may move into pilot scope.
11. **gh copilot CLI log format.** Needs a one-day spike to confirm whether it exposes tokens at all.
12. **Workstation OS mix.** macOS only, or Linux / Windows too? Affects CLI packaging (launchd / systemd / Windows service).

---

*End of proposal. This page is not linked from the public site — contact the proposal author directly for questions.*
