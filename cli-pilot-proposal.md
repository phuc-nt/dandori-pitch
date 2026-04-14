---
layout: default
title: CLI Pilot Proposal
nav_exclude: true
search_exclude: true
description: "Distributed CLI pilot — knowledge flow, run tracking, audit, analytics. Zero central orchestration."
---

# CLI Pilot Proposal
{: .fs-9 }

A distributed pilot of the outer-harness idea: every engineer runs a local CLI + skill bundle, a shared knowledge marketplace lives on the internal GitHub Enterprise, and a central monitoring server aggregates events into a leadership dashboard.
{: .fs-6 .fw-300 }

*This page is unlisted. Share the direct URL only with stakeholders who should see it.*

---

## Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## 1. Executive summary

**Proposal.** Deploy a lightweight CLI + skill bundle on each engineer's workstation. Store shared knowledge (context, skills, agent templates) as a versioned repository on the internal GitHub Enterprise. Stand up a small central server that receives synced events and renders a leadership dashboard.

**Pilot focus** — three of the five outer-harness pillars:

1. **Knowledge Flow** — shared context, skills, and agent templates moving top-down and bottom-up across the team.
2. **Tracking & Audit** — every agent run recorded, attributable, append-only.
3. **Analytics** — leadership dashboard showing activity, cost, and trends across the pilot group.

Cost attribution comes for free as a by-product of tracking (tokens × price table). **Quality gates** and **evaluation suites** are intentionally out of scope for the pilot.

**Why this shape?**

- No central orchestrator → no deploy pain, no shared-DB headaches, minimal onboarding friction.
- GitHub Enterprise is already the source of truth for code; reusing it for knowledge means **zero new security review**.
- CLI + skills + log tailing works across **Claude Code, Codex CLI, and GitHub Copilot CLI** without patching the runtimes.
- If the pilot succeeds, the same architecture extends upward (task board, quality gates, approval workflow) without rewriting anything.

**Target runtimes:** Claude Code, Codex CLI, GitHub Copilot CLI.

---

## 2. Scope

### In scope

| Area | Delivered |
|---|---|
| **Knowledge marketplace** | GitHub Enterprise repo with 5-layer structure; top-down & bottom-up flows via PR |
| **Local knowledge cache** | `dandori fetch` pulls relevant layers into engineer's local cache; agent consumes from cache |
| **Run tracking (wrapper)** | Every agent invocation produces start/end events — guaranteed, runtime-agnostic |
| **Run enrichment (tailer)** | Background daemon parses runtime session logs → tokens, model, tool calls |
| **Skill-driven semantics** | Agents emit rich events (decisions, files touched, task links) via CLI |
| **Cost tracking** | Token → cost via price table; 4-token model (input / output / cache-write / cache-read) |
| **Audit log** | Append-only event store on each workstation; synced to central server |
| **Central monitoring server** | Ingest API + aggregate DB + dashboard UI |
| **Role-based knowledge edit** | Single CLI binary; commands gated by GitHub team membership |
| **Multi-runtime support** | Claude Code, Codex CLI, GitHub Copilot CLI |

### Out of scope (for the pilot)

| Area | Why not now |
|---|---|
| Shared task board / DAG orchestration | Requires central state; add-on in phase 2 |
| Approval workflow (Slack, etc.) | Not in pilot focus; cross-team coordination overhead |
| Quality gates enforcement | Needs CI integration; can plug into the same event stream later |
| Evaluation suite (regression detection) | Needs golden datasets; separate workstream |
| Tool governance / MCP registry | Depends on MCP adoption |
| Fleet Ops live dashboard | Requires realtime ingest; batch is enough for pilot |
| Runtime modifications | Agent runtimes remain unchanged; we wrap and observe, never patch |

---

## 3. Architecture overview

```
╔══════════════════════════════════════════════════════════════════╗
║                    ENGINEER WORKSTATION                          ║
║                                                                  ║
║    ┌──────────────────────────────────────────────────────┐     ║
║    │                  dandori CLI                          │     ║
║    │                                                        │     ║
║    │   dandori run -- <agent>      wrapper (guarantee)     │     ║
║    │   dandori watch               tailer daemon           │     ║
║    │   dandori event               semantic event          │     ║
║    │   dandori fetch / push        knowledge sync          │     ║
║    │   dandori sync                event upload            │     ║
║    │   dandori doctor              self-check              │     ║
║    └──────────────────────────────────────────────────────┘     ║
║           │                    │                   │            ║
║           ▼                    ▼                   ▼            ║
║  ┌──────────────┐   ┌──────────────────┐  ┌──────────────┐      ║
║  │ ~/.dandori/  │   │  Agent runtime   │  │  Git CLI     │      ║
║  │  local.db    │   │  Claude Code     │  │  (GH Ent)    │      ║
║  │  cache/      │◀──│  Codex CLI       │  └──────┬───────┘      ║
║  │  skills/     │   │  gh copilot      │         │              ║
║  │  run-logs/   │   │  (unchanged)     │         │              ║
║  └──────┬───────┘   └──────────────────┘         │              ║
║         │                                         │              ║
╚═════════╪═════════════════════════════════════════╪══════════════╝
          │ event batch                             │ pull / push
          │ (every 5 min)                           │
          ▼                                         ▼
 ┌─────────────────────────┐          ┌──────────────────────────┐
 │   MONITORING SERVER     │          │  KNOWLEDGE MARKETPLACE   │
 │                         │          │  (GitHub Enterprise)     │
 │  - ingest API (HTTPS)   │          │                          │
 │  - aggregate DB         │          │  layers/                 │
 │  - dashboard UI         │          │    1-company/            │
 │  - role-aware views     │          │    2-project/            │
 │                         │          │    3-team/               │
 │                         │          │    4-agent/              │
 │                         │          │    5-task/ (per engineer)│
 │                         │          │  skills/                 │
 │                         │          │  templates/              │
 │                         │          │  tools/                  │
 │                         │          │  dandori.yaml (manifest) │
 └─────────────────────────┘          └──────────────────────────┘
```

**Four moving parts:**

1. **Dandori CLI** — single Go binary on each workstation.
2. **Local state** (`~/.dandori/`) — SQLite DB, knowledge cache, skill files.
3. **Knowledge marketplace** — a GitHub Enterprise repo, RBAC via GitHub teams.
4. **Monitoring server** — read-heavy aggregate + dashboard, receives batched events.

---

## 4. Components

### 4.1 Dandori CLI

A single Go binary. Zero runtime dependencies. Installed via brew tap or installer script. All commands live in one binary — role-gating is done at command-execution time by checking the caller's GitHub team membership.

**Core commands:**

| Command | Purpose |
|---|---|
| `dandori init` | First-time setup: creates `~/.dandori/`, registers shell alias, starts watch daemon |
| `dandori run -- <cmd>` | **Wrapper.** Fork/exec the agent command; emit run_started / run_ended events |
| `dandori watch` | **Background tailer daemon.** Watches runtime session logs, parses usage, enriches events |
| `dandori event <type> <json>` | Semantic event emission (called from skill instructions) |
| `dandori fetch [layer]` | Pull knowledge layers from marketplace into local cache |
| `dandori push <path>` | Propose a change to the marketplace (opens PR) |
| `dandori layer edit <path>` | Edit a knowledge layer file (role-gated) |
| `dandori skill list / install / enable` | Manage the local skill bundle |
| `dandori sync` | Push batched events to monitoring server |
| `dandori doctor` | Self-check: coverage, sync lag, auth, runtime detection |
| `dandori dashboard [--open]` | Open dashboard URL in browser |

### 4.2 Skill bundle

Ships as part of the CLI install, lives in `~/.dandori/skills/`, is version-controlled via the marketplace repo. The bundle is a set of Markdown instructions that agents consume at runtime.

**What skills instruct the agent to do:**

- Read relevant layer files from `~/.dandori/cache/` before starting
- Call `dandori event task_started <task_id>` when picking up a task
- Call `dandori event decision <rationale>` at key branch points
- Call `dandori event files_touched <paths>` before writing
- Call `dandori event task_completed <summary>` at the end

Skills are **instructions**, not enforcement. The wrapper + tailer handle the guaranteed-capture part (see §6).

### 4.3 Knowledge marketplace

A single GitHub Enterprise repo. Structure:

```
marketplace/
├── dandori.yaml                  # Manifest: layer definitions, inheritance
├── layers/
│   ├── 1-company/
│   │   ├── security-policy.md
│   │   ├── coding-standards.md
│   │   └── compliance.md
│   ├── 2-project/
│   │   └── <project-slug>/
│   │       ├── architecture.md
│   │       └── domain-model.md
│   ├── 3-team/
│   │   └── <team-slug>/
│   │       ├── team-playbook.md
│   │       └── on-call.md
│   ├── 4-agent/
│   │   └── <agent-role>.md       # Agent role + instructions
│   └── 5-task/                   # Task-scoped context (per engineer, PR-based)
├── skills/
│   ├── code-review.md
│   ├── migration-playbook.md
│   └── incident-runbook.md
├── templates/                    # Agent templates (role + skill refs + tool allow-list)
│   ├── code-reviewer.yaml
│   ├── migration-expert.yaml
│   └── feature-dev.yaml
└── tools/
    └── allow-list.yaml           # Tool governance (optional for pilot)
```

**Access:**

- Admins merge PRs to `layers/1-company/`, `layers/4-agent/`, `templates/`, `skills/`, `tools/`
- Project leads merge PRs to `layers/2-project/<their-project>/`
- Team leads merge PRs to `layers/3-team/<their-team>/`
- Engineers open PRs freely; merges controlled by CODEOWNERS

**Why GitHub Enterprise and not a custom store?**

- Version control, diff, rollback, PR review — all free.
- RBAC via existing GitHub teams — no new identity system.
- Code review flow becomes the **quality gate for knowledge**.
- Familiar tooling — engineers already know `git fetch`, `git log`, PR comments.
- Security already enterprise-approved — no separate review.

### 4.4 Monitoring server

Purpose-built, deliberately minimal. Stateless ingest + aggregate + read-only dashboard.

```
┌────────────────────────────────────────────────┐
│              MONITORING SERVER                 │
│                                                │
│   ┌──────────────────────────────────────┐    │
│   │  Ingest API   (POST /events)         │    │
│   │   - Accepts batched JSON events      │    │
│   │   - Validates schema + hash chain    │    │
│   │   - Idempotent on event_id           │    │
│   └──────────────────┬───────────────────┘    │
│                      ▼                          │
│   ┌──────────────────────────────────────┐    │
│   │  Aggregate DB  (Postgres)            │    │
│   │   - events (append-only)              │    │
│   │   - runs (materialized view)          │    │
│   │   - daily_cost (materialized view)    │    │
│   │   - engineer_activity (mview)         │    │
│   └──────────────────┬───────────────────┘    │
│                      ▼                          │
│   ┌──────────────────────────────────────┐    │
│   │  Dashboard UI                         │    │
│   │   - Overview (cost, runs, engineers)  │    │
│   │   - Drill down by team / project      │    │
│   │   - Run inspector (view events)       │    │
│   │   - Knowledge contribution leaderboard│    │
│   └──────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
```

**Recommended stack:** Node.js + TypeScript + Fastify + Postgres + a simple React SPA. Alternatively, plug events into Grafana/Metabase and skip the custom UI.

**Deploy target:** one Docker container + one Postgres. Can run on a single VM or in Kubernetes.

---

## 5. Data flow — end-to-end

```
  ┌──────────────┐
  │   Engineer   │
  └──────┬───────┘
         │ $ claude "implement feature X"
         ▼
  ┌────────────────────────────────────────────────────┐
  │ 1. dandori run  (wrapper)                          │
  │    - generate run_id                               │
  │    - snapshot session-log dir (before)             │
  │    - emit run_started → local.db                   │
  │    - fork/exec: claude "implement feature X"       │
  └────────────────────┬───────────────────────────────┘
                       │
                       ▼
  ┌────────────────────────────────────────────────────┐
  │ 2. Agent runtime (Claude Code)                     │
  │    - reads ~/.dandori/cache/layers/*.md           │
  │    - reads ~/.dandori/skills/*.md                  │
  │    - calls LLM (API)                               │
  │    - writes session log ~/.claude/.../session.jsonl│
  │    - calls `dandori event decision ...`           │
  │    - writes code                                    │
  │    - calls `dandori event task_completed ...`     │
  │    - exits                                         │
  └────────────────────┬───────────────────────────────┘
                       │
                       ▼
  ┌────────────────────────────────────────────────────┐
  │ 3. dandori run  (wrapper, post-exec)               │
  │    - snapshot session-log dir (after)              │
  │    - diff → find new session_id                    │
  │    - emit run_ended (exit_code, duration) → local.db│
  │    - store (run_id ↔ session_id) mapping           │
  └────────────────────────────────────────────────────┘

  (asynchronously, in the background)

  ┌────────────────────────────────────────────────────┐
  │ 4. dandori watch  (tailer daemon)                  │
  │    - polls ~/.claude/.../*.jsonl every 60s         │
  │    - parses new lines: usage, tool calls, model    │
  │    - looks up (session_id → run_id) mapping        │
  │    - emits enrichment events → local.db            │
  │    - computes cost from tokens × model_price table │
  └────────────────────┬───────────────────────────────┘
                       │
                       ▼
  ┌────────────────────────────────────────────────────┐
  │ 5. dandori sync  (every 5 min via cron / service)  │
  │    - POST /events with batch of local events       │
  │    - marks synced in local.db                       │
  │    - retries with exponential backoff on failure   │
  └────────────────────┬───────────────────────────────┘
                       │
                       ▼
  ┌────────────────────────────────────────────────────┐
  │ 6. Monitoring server                                │
  │    - validates batch                                │
  │    - inserts into events table                      │
  │    - refreshes materialized views (on schedule)    │
  │    - dashboard now shows this run (≤ 10 min delay) │
  └────────────────────────────────────────────────────┘
```

---

## 6. Instrumentation — three-layer defense

Data collection uses **three independent mechanisms** layered for redundancy. Each layer has a different guarantee level and a different kind of data.

```
                    ┌───────────────────────────────────┐
                    │  LAYER 3  —  SKILL                │
                    │                                   │
                    │  Semantic events:                 │
                    │    - decision rationale           │
                    │    - task link                    │
                    │    - self-explanation             │
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
                    │    - tool call count              │
                    │    - derived cost (USD)           │
                    │                                   │
                    │  Guarantee: runtime-log dependent │
                    │  Source: session-log tailing      │
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
                    │  Guarantee: 100%  (process fork)  │
                    │  Source: fork/exec lifecycle      │
                    │  Value: accounting, audit, count  │
                    └───────────────────────────────────┘
```

**Why three layers?**

| If you have only… | You get… | You miss… |
|---|---|---|
| Skill only | Rich semantics | Any run where agent forgot to call CLI, crashed mid-run, or had skill compacted out of context |
| Wrapper only | Reliable run count | Token usage, cost, tool calls, decision rationale |
| Wrapper + Tailer | Run count + cost + usage | Decision rationale, task linkage |
| All three | Full picture | (accept any one failing independently) |

**The wrapper is non-negotiable.** Without it, the dashboard's data quality depends on agent voluntary reporting — a best-effort path that degrades silently as pilot scales.

### 6.1 Wrapper transparency

The wrapper is invisible to the engineer after setup. Engineers install once:

```bash
dandori init
# appends to ~/.zshrc:
#   alias claude='dandori run -- claude'
#   alias codex='dandori run -- codex'
#   alias copilot='dandori run -- gh copilot'
```

From then on, `claude "fix bug"` goes through the wrapper transparently. Ctrl-C still works, stdin/stdout still work, exit codes still propagate. Engineers can opt out per-invocation with `\claude` (shell escape).

### 6.2 Tailer — per-runtime parsers

| Runtime | Session log path | Format | Tokens available |
|---|---|---|---|
| **Claude Code** | `~/.claude/projects/<cwd>/*.jsonl` | JSONL, one event per line | ✅ 4-token model in `message.usage` |
| **Codex CLI** | `~/.codex/sessions/*.jsonl` | JSONL | ✅ input/output |
| **gh copilot** | `~/.config/gh/copilot-cli/history/*` | TBD — needs spike | ⚠️ to confirm |

The tailer loads a parser per runtime. If a runtime's log format changes, only the parser plugin is updated — the rest of the CLI stays stable.

### 6.3 Correlating wrapper runs ↔ session logs

The wrapper snapshots the runtime's session-log directory **before** and **after** `exec`. The new file that appears is this run's session — its filename (typically a UUID) becomes the `session_id`. The wrapper stores `(run_id → session_id)` in `local.db`. When the tailer parses that session, it looks up the mapping and attaches its events to the correct `run_id`.

Edge case: two runs in the same `cwd` starting at nearly the same time → mtime tie-breaking. Rare in practice.

---

## 7. Knowledge flow — the marketplace pattern

The marketplace repo is the source of truth for shared knowledge. Two directions, both mediated by Git:

```
      TOP-DOWN (distribution)               BOTTOM-UP (contribution)
      ──────────────────────              ────────────────────────

   CTO / Platform lead                    Engineer hits a good prompt
          │                                       │
          ▼                                       ▼
   edits layers/1-company/                 wraps as skill/template
   opens PR                                opens PR to marketplace
          │                                       │
          ▼                                       ▼
   Admin team reviews, merges             Team lead or Admin reviews
          │                                       │
          ▼                                       ▼
   main branch updated                    main branch updated
          │                                       │
          ▼                                       ▼
   engineers run:                          engineers run:
       $ dandori fetch                         $ dandori fetch
          │                                       │
          ▼                                       ▼
   ~/.dandori/cache/ updated              ~/.dandori/cache/ updated
          │                                       │
          ▼                                       ▼
   next agent run uses new              other engineers discover via
   policy automatically                  `dandori skill search <term>`
```

**Key properties:**

- All changes are **PR-reviewed** → quality gate via existing code-review culture.
- All changes are **versioned** → rollback is `git revert`.
- All changes are **diffable** → "what changed this week" is `git log`.
- **CODEOWNERS** enforces who can merge which paths, replacing any custom RBAC layer.
- **Inheritance hierarchy** lives in `dandori.yaml` (manifest), not in CLI code → updating the hierarchy doesn't require a CLI release.

### 7.1 5-layer context resolution

When an agent starts a run inside a given project/team, `dandori fetch` resolves which layers apply:

```
  Layer 1  company-wide   →  always applied
  Layer 2  project        →  resolved from current cwd → project mapping
  Layer 3  team           →  resolved from git remote → team mapping
  Layer 4  agent role     →  resolved from the skill/template in use
  Layer 5  task           →  opt-in, engineer supplies task_id
```

Resolution rules are declared in `dandori.yaml`. The CLI reads that file from the local cache and assembles the final context set on `dandori fetch`. The agent then consumes files from `~/.dandori/cache/` as normal Markdown — no extra tooling required inside the agent runtime.

### 7.2 Discovery

GitHub Enterprise UI is weak at discovery. We ship a local index:

- `dandori skill search <keyword>` — grep-style search across cached skill files
- `dandori template list --tag <tag>` — list templates filtered by tag (from `dandori.yaml`)
- `dandori layer show <path>` — print resolved layer content

The index is rebuilt on every `dandori fetch`.

---

## 8. Cost tracking

Cost is derived from tokens, not billed. Formula per run:

```
cost_usd  =  ( input_tokens         × input_price
             + output_tokens        × output_price
             + cache_write_tokens   × cache_write_price
             + cache_read_tokens    × cache_read_price
            ) / 1,000,000
```

All four token buckets are tracked separately. Prompt caching discounts (cache read ≈ 10% of input price, cache write ≈ 125%) can shift real cost by 30–50% on long Claude Code sessions — ignoring them produces meaningfully wrong numbers.

**Price table** lives in the monitoring server's DB (`model_prices` with `valid_from` / `valid_to`), updated by admins. Per-org rate overrides are supported.

**Gaps to disclose honestly:**

- If `gh copilot` CLI does not emit token counts in its log, cost tracking for Copilot runs will be **run-count only** — explicit gap in the dashboard.
- Cursor, Aider, and similar runtimes are **not** in pilot scope.

---

## 9. Roles and permissions

**One CLI binary** — the same install on every workstation. Role-gating is done at command-execution time by consulting GitHub team membership via the `gh api` surface. No separate admin CLI.

```
   GitHub team               →  CLI capability
   ─────────────                ──────────────────────────────

   dandori-admins            →  edit layers/1-company/**
                                edit layers/4-agent/**
                                edit templates/**
                                edit skills/**
                                edit tools/**
                                view all dashboard pages

   dandori-project-leads     →  edit layers/2-project/<their project>/
                                edit layers/3-team/<their teams>/
                                view project/team dashboard pages

   dandori-team-leads        →  edit layers/3-team/<their team>/
                                view team dashboard pages

   dandori-engineers         →  edit layers/5-task/<self>/
                                propose PRs to any path (no merge)
                                run, watch, sync, fetch, event
                                view own + team dashboard pages
```

**Implementation note:** CODEOWNERS in the marketplace repo enforces merge-time rules. The CLI's role check is a UX convenience that prevents the obvious mistakes (editing a file you can't merge). The real gate is the PR review and CODEOWNERS.

---

## 10. Deployment

### 10.1 Engineer workstation (5-minute setup)

```
  1.  Install CLI                     brew install dandori
                                      # or:   curl -sSL install.sh | bash

  2.  Initialize                      dandori init
                                      - detects GitHub Enterprise token
                                      - creates ~/.dandori/
                                      - appends shell aliases
                                      - registers launchd/systemd service
                                        for `dandori watch`

  3.  First fetch                     dandori fetch
                                      - pulls marketplace repo
                                      - resolves layers for current cwd

  4.  Verify                          dandori doctor
                                      - checks runtime detection
                                      - checks sync health
                                      - checks auth
                                      - reports coverage baseline

  5.  Ready                           claude "implement X"
                                      # goes through wrapper transparently
```

### 10.2 Admin / platform team

```
  1.  Deploy monitoring server        docker-compose up -d
                                      # brings up: api, postgres, dashboard

  2.  Seed marketplace repo           dandori-admin bootstrap <repo-url>
                                      - creates layer scaffold
                                      - creates dandori.yaml
                                      - seeds CODEOWNERS
                                      - seeds example skills / templates

  3.  Create GitHub teams             dandori-admins
                                      dandori-project-leads
                                      dandori-team-leads
                                      dandori-engineers

  4.  Set CLI defaults                distribute ~/.dandori/config.yaml
                                      with server URL, marketplace repo,
                                      sync cadence

  5.  Seed company layer              edit layers/1-company/security-policy.md
                                      PR → merge
                                      engineers `dandori fetch`
```

### 10.3 What the pilot needs from IT

- A GitHub Enterprise repo for the marketplace, with appropriate team permissions.
- One VM or container host for the monitoring server (1 vCPU, 2 GB RAM, 20 GB disk is sufficient for a ≤ 50-engineer pilot).
- DNS + TLS cert for the monitoring server (internal only).
- A shared GitHub Enterprise PAT distribution mechanism (or OAuth app).
- Permission for engineers to install Homebrew / a signed binary on their workstations.

---

## 11. Security and data governance

### 11.1 What we collect

| Category | Where stored | Sensitivity | Notes |
|---|---|---|---|
| Run metadata (run_id, user, cwd, git commit, timing) | local DB + server | Low | No content |
| Token counts + derived cost | local DB + server | Low | Numeric only |
| Tool call metadata (tool name, arg hash) | local DB + server | Low | **Arguments not stored** |
| Semantic events (decision text, task links) | local DB + server | Medium | Free text; PII possible if agent paraphrases user input |
| Session log raw content | local only | Medium | Never synced; kept on workstation for forensics |
| Knowledge files (layers, skills, templates) | GitHub Enterprise repo | Variable | Inherits sensitivity of what engineer writes |

### 11.2 What we deliberately do NOT collect

- Full prompts (only token counts from session log)
- Full LLM responses
- Tool call arguments or results
- File contents the agent writes
- API keys, credentials, secrets

The tailer **parses** session logs for usage numbers and discards the rest. Raw session logs stay on the engineer's machine.

### 11.3 Controls

- **Append-only DB tables** — events table uses `INSERT`-only; no `UPDATE` / `DELETE` from app code; constraint at DB level.
- **Optional hash chain** — each event includes a hash of the previous event's hash; server verifies on ingest; tamper-evident with 10 LOC overhead.
- **TLS everywhere** — sync uses HTTPS; marketplace over HTTPS / SSH.
- **Secret scrubber** in the tailer — regex pass on free-text fields before insert; known secret patterns (API keys, private keys) are redacted.
- **Retention** — default 90 days on local DB, 365 days on server, configurable.
- **Right to erasure** — events keyed by `user_id` can be purged on request from both local and server stores.
- **Residency** — server is self-hosted inside your infrastructure; no third-party data flow.

### 11.4 Access to the dashboard

Dashboard auth uses the same GitHub Enterprise OAuth. Data visibility is scoped by team: engineers see their own + team data; leads see their team/project; admins see all. The dashboard never exposes free-text semantic event content except to the owning engineer and their direct lead.

---

## 12. Phased delivery

**M0 — Skeleton (≈ 1 sprint)**

- CLI binary with `init`, `run`, `event`, `doctor`
- Local SQLite schema + append-only events
- Claude Code wrapper + session-log snapshot correlation
- Engineer can run agents and inspect local events

**M1 — Tailers + cost (≈ 1 sprint)**

- `dandori watch` background daemon
- Claude Code session-log parser
- Codex CLI session-log parser
- gh copilot parser (spike first; confirm feasibility)
- Price table + cost derivation

**M2 — Marketplace (≈ 1 sprint, parallelizable with M1)**

- `dandori.yaml` manifest schema
- `dandori fetch` / `push` commands
- Layer resolution logic (5-layer)
- Example marketplace repo seeded
- CODEOWNERS scaffolding

**M3 — Sync + server + dashboard (≈ 1–2 sprints)**

- Ingest API
- Postgres schema + materialized views
- Dashboard: overview, drill-down, run inspector
- Hash chain on events
- OAuth for dashboard

**M4 — Role gating + polish (≈ ½ sprint)**

- GitHub team membership check on CLI commands
- Discovery commands (`skill search`, `template list`)
- `dandori doctor` polish
- Admin bootstrap script

**End of M4 → full pilot ready.**

---

## 13. Success metrics

The pilot is judged against these metrics at 8 weeks post-launch:

| Metric | Target | How measured |
|---|---|---|
| **Run capture rate** | ≥ 95% of runs have wrapper event | `dandori doctor` + server reconciliation against engineer self-report |
| **Cost variance** | ≤ 5% vs actual provider billing (where available) | Cross-check tokens-derived cost with billing export |
| **Knowledge contributions** | ≥ 1 PR per engineer per month after week 2 | GitHub Enterprise PR count on marketplace repo |
| **Dashboard engagement** | Leadership views ≥ 1× per week | Server access logs |
| **Setup time** | ≤ 10 minutes from install to first recorded run | Timed onboarding |
| **Engineer NPS** | ≥ +20 | Survey at week 4 and week 8 |
| **Runtime coverage** | Claude Code + Codex fully; Copilot at least metadata | Parser coverage |
| **Sync lag (P95)** | ≤ 10 minutes | Measured server-side |

**Leading indicators to watch weekly:**

- % of runs with enrichment (tailer) events — signals tailer health per runtime
- % of runs with semantic (skill) events — signals skill adoption
- # of knowledge search queries per engineer — signals discovery friction
- # of failed sync batches — signals network / auth issues

---

## 14. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Skill adoption is inconsistent → weak semantic data | High | Medium | Wrapper + tailer already guarantee base data; skill is a bonus |
| Runtime session-log format changes on upgrade | Medium | Medium | Per-runtime parsers versioned; unknown events saved in `unparsed` bucket for replay |
| Engineers tamper with local DB before sync | Low | Medium | Hash chain on events makes tampering detectable |
| `gh copilot` lacks token data in logs | Medium | Low | Disclose up front; run count only for Copilot until upstream adds it |
| Marketplace discovery is poor → contributions dry up | Medium | High | Ship local search indexer from day one; promote "Skill of the Week" to create pull |
| Central server outage | Low | Low | Events queue locally; sync resumes when server returns |
| Dashboard becomes "just another log viewer" | Medium | High | First dashboards are opinionated: cost by team, top contributors, week-over-week trend — not a raw event list |
| Sync batch too large (long offline period) | Low | Low | Chunked upload with resumption; size cap per batch |
| CLI upgrade friction | Medium | Medium | `dandori self-update` command + auto-check; versioned event schema |

---

## 15. What we ask from the pilot partner

1. A pilot group of **5–15 engineers** already using Claude Code, Codex CLI, or Copilot CLI.
2. **A GitHub Enterprise repo** dedicated to the marketplace, plus GitHub teams for role mapping.
3. **One sponsor** in engineering leadership who will review the dashboard weekly.
4. **Infrastructure slot** for the monitoring server (1 VM or container).
5. **Weekly 30-minute sync** during the pilot for fast feedback loops.
6. **Honest feedback** — "this doesn't help me" is the most valuable data point we can collect.

---

## 16. Open questions

These need clarification before we lock the pilot plan:

1. **Pilot size.** How many engineers in the first cohort? 5, 15, 50? Affects sync scaling, parser priority, and dashboard density.
2. **Runtime mix.** Is the split roughly equal across Claude Code, Codex, Copilot, or does one dominate? Drives which parser we build first.
3. **Billing source for cost reconciliation.** Is there a provider billing export (Anthropic Console, OpenAI dashboard, etc.) we can cross-check against, or is tokens-derived the only source?
4. **Dashboard hosting.** Are we free to deploy our own dashboard UI, or must the metrics feed into an existing Grafana / Metabase / Datadog stack?
5. **GitHub Enterprise server version.** Affects whether we can rely on modern REST/GraphQL features (CODEOWNERS, required reviewers, branch rules).
6. **Auth model for the monitoring server.** GitHub Enterprise OAuth app, or an existing SSO (Okta, Azure AD)?
7. **Sync cadence.** Is every 5 minutes acceptable, or is there a network/egress reason to prefer a longer interval?
8. **Retention policy.** How long should events live on the server — 90 days, 365 days, indefinitely?
9. **Offline expectations.** Will engineers spend significant time offline (VPN constraints, travel)? Affects sync queue sizing.
10. **Data residency.** Any requirement for the server to live in a specific region?
11. **Skill / template licensing.** If engineers import external templates, is there an IP / licensing review required?
12. **Right to observe.** Any workers'-council / privacy-council review needed for the per-engineer activity tracking? (Depends on jurisdiction.)
13. **Existing MCP adoption.** Is the team already using MCP servers? Affects whether tool governance should move into pilot scope.
14. **gh copilot CLI log format.** Needs a one-day spike to confirm — open question whether it exposes tokens at all.
15. **Workstation OS mix.** macOS only, or Linux / Windows too? Affects CLI packaging (launchd / systemd / Windows service).

---

## 17. Non-goals (explicit)

To keep the pilot focused, these are explicitly NOT in scope:

- A task board or DAG orchestration layer
- Approval workflows (Slack, email gates)
- CI/CD integration for quality gates
- Evaluation suite / golden-set regression runs
- Real-time agent supervision or termination
- A replacement for the internal IDE, chat UI, or ticketing system
- A model provider gateway — runtimes continue to hit providers directly
- A sandbox or execution environment — the agent runtime owns that
- Any modification to the agent runtimes themselves

If the pilot succeeds, these become candidates for phase 2 — not before.

---

## 18. Glossary

| Term | Meaning |
|---|---|
| **Outer harness** | The organizational layer around the agent: process, knowledge, cost, approval, audit. Distinct from the inner harness (sandbox, tools, context window) owned by the runtime. |
| **Run** | One invocation of an agent runtime. Has a unique `run_id` created by the wrapper. |
| **Session** | The runtime's own notion of a conversation. Has a `session_id` created by the runtime. One run = one session. |
| **Wrapper** | `dandori run -- <cmd>`. Parent process that guarantees run_started / run_ended events. |
| **Tailer** | `dandori watch`. Background daemon that parses runtime session logs and enriches events with token / cost data. |
| **Skill** | A reusable prompt or instruction bundle an agent can follow. Lives in the marketplace, gets cached locally. |
| **Template** | A complete agent recipe (role + skill refs + tool allow-list). Engineers clone and customize. |
| **Layer** | One level of the 5-layer context hierarchy (company → project → team → agent → task). |
| **Marketplace** | The GitHub Enterprise repo that holds all shared knowledge. |
| **Event** | One record in the append-only store (run_started, run_ended, token_usage, decision, etc). |
| **Manifest** | `dandori.yaml` in the marketplace repo. Defines layer hierarchy, inheritance rules, tags. |

---

*End of proposal. For questions, contact the proposal author directly — this page is not linked from the public site.*
