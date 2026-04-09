---
layout: default
title: Core Features
nav_order: 3
description: "9 management capabilities that Dandori adds on top of your AI agents."
---

# Core Features

Your engineers already have great agents. **Dandori is the coordination + management layer around them.**

This page catalogs the capabilities Dandori adds — capabilities that AI agents themselves do not provide. Each feature is tagged with its **primary audience**:

- 👷 **Engineers** — modules engineers use daily as a workspace
- 🧭 **Leadership** — modules leadership consumes for governance and analytics
- 🤝 **Both** — same module, two lenses (engineers act, leadership audits)

---

## Where Dandori sits

```
         ┌─────────────────────────────────────────┐
         │         ENGINEERING LEADERSHIP          │
         │  CTO · Platform · Security · Compliance │
         └─────────────────────────────────────────┘
                            │
                            │  needs: visibility,
                            │  control, audit
                            ▼
         ┌─────────────────────────────────────────┐
         │               DANDORI                   │   ◀── management layer
         │         (governance + analytics)        │
         └─────────────────────────────────────────┘
                            │
                            │  delegates to:
                            ▼
         ┌─────────────────────────────────────────┐
         │              AI AGENTS                  │   ◀── execution layer
         │   Claude Code · Codex · Cursor · ...    │       (your engineers'
         └─────────────────────────────────────────┘        existing tools)
                            │
                            ▼
         ┌─────────────────────────────────────────┐
         │             AI PROVIDERS                │
         │     Anthropic · OpenAI · local models   │
         └─────────────────────────────────────────┘
```

**Dandori does not write code.** Engineers use it to coordinate and share context. Leadership uses it to measure, govern, and audit.

---

## Feature-to-audience map

| # | Feature | Primary audience |
|---|---|---|
| 1 | Cost attribution & budget control | 🧭 Leadership |
| 2 | Five-layer context governance | 🤝 Both |
| 3 | Approval workflows | 🤝 Both |
| 4 | Automated quality gates | 🤝 Both |
| 5 | Cross-agent analytics | 🧭 Leadership |
| 6 | Shared skill library | 👷 Engineers |
| 7 | Task dependencies & phase workflow | 👷 Engineers |
| 8 | Immutable audit log | 🧭 Leadership |
| 9 | Unified integration surface | 👷 Engineers |

*Scan below for the full walkthrough of each feature with its audience tag.*

---

## 1. Cost attribution & budget control

**Audience:** 🧭 Leadership (primary) · CFO, VP Eng, Platform lead

**Problem it solves:** The vendor bill is a black box. You can't break it down.

**What Dandori provides:**

```
┌─────────────────────────────────────────────────────────┐
│  COST BREAKDOWN — April 2026                            │
│                                                         │
│  By project:                                            │
│    payments-service       $12,480   ████████████        │
│    auth-platform           $8,220   ████████            │
│    data-pipeline           $5,910   ██████              │
│    internal-tools          $3,100   ███                 │
│                                                         │
│  By agent:                                              │
│    ReviewerBot             $9,402   ████████████        │
│    TestGenerator           $7,830   ██████████          │
│    DocsSynthesizer         $4,121   █████               │
│                                                         │
│  By model:                                              │
│    claude-opus             $18,210  ████████████████    │
│    claude-sonnet            $9,120  ████████            │
│    gpt-4-turbo              $2,380  ██                  │
└─────────────────────────────────────────────────────────┘
```

- Per-run token + cost logging (input, output, cache)
- Breakdown by project, team, agent, model, phase, day
- Budget ceilings per agent (hard stop when exceeded)
- Spike detection (alert when agent X burns 3x its average)

---

## 2. Five-layer context governance

**Audience:** 🤝 Both · engineers *author + consume* daily; leadership *versions + audits*

**Problem it solves:** Engineers copy-paste prompts. Policies live in Confluence that agents never see.

**What Dandori provides:**

```
┌──────────────────────────────────────────────────────────┐
│                    5-LAYER CONTEXT                       │
│                                                          │
│   Layer 1  COMPANY    [owned by: CTO, Security]          │
│   ├─ Coding standards                                    │
│   ├─ Security/compliance policies                        │
│   └─ Approved dependencies                               │
│                                                          │
│   Layer 2  PROJECT    [owned by: Project lead]           │
│   ├─ Tech stack, architecture                            │
│   ├─ Service boundaries                                  │
│   └─ Non-functional requirements                         │
│                                                          │
│   Layer 3  TEAM       [owned by: Team lead]              │
│   ├─ Review protocol                                     │
│   ├─ Naming conventions                                  │
│   └─ On-call / escalation                                │
│                                                          │
│   Layer 4  AGENT      [owned by: Agent maintainer]       │
│   ├─ Role + personality                                  │
│   └─ Skill references                                    │
│                                                          │
│   Layer 5  TASK       [owned by: Task author]            │
│   ├─ Specific work                                       │
│   └─ Linked files                                        │
│                                                          │
│   ═══════════════════════════════════════════════════    │
│            ▼ assembled into every prompt ▼               │
└──────────────────────────────────────────────────────────┘
```

- Update company policy once → every agent sees it next run
- Version-controlled: full history, diff view, one-click rollback
- PII/data classification tags per layer
- Audit: every run records which context version it used

**Value split:**
- *Engineers:* stop copy-pasting policies; inherit team + project context automatically on every run.
- *Leadership:* one place to set org-wide standards that every agent provably sees.

---

## 3. Approval workflows

**Audience:** 🤝 Both · engineers *act as reviewers*; leadership *gets the audit trail*

**Problem it solves:** Agent shipped a migration that broke prod. Who approved it? Slack thread died.

**What Dandori provides:**

```
  Task flagged: needs_approval=true
     │
     ▼
┌─────────┐    agent runs    ┌────────────┐   human reviews   ┌───────┐
│  TODO   │─────────────────▶│ IN REVIEW  │──────────────────▶│ DONE  │
└─────────┘                  └─────┬──────┘                   └───────┘
                                   │
                                   │  reject + note
                                   ▼
                             ┌────────────┐
                             │   TODO     │  (with rejection reason
                             └────────────┘   in comment thread)
```

- Configurable per task (on/off)
- Approval records: who, when, rationale
- Rejection keeps audit trail of why + re-queues for fix
- Exportable for compliance review

---

## 4. Automated quality gates

**Audience:** 🤝 Both · engineers *get per-run feedback*; leadership *gets per-team trends*

**Problem it solves:** Agents ship whatever. Humans catch issues in review 2 days later.

**What Dandori provides:**

```
     Agent run completes
            │
            ▼
    ┌───────────────┐
    │ Type-check    │──▶ errors? flag + -10 score
    └───────────────┘
    ┌───────────────┐
    │ Lint          │──▶ warnings? flag + -5 score
    └───────────────┘
    ┌───────────────┐
    │ Test scanner  │──▶ no tests? flag + -15 score
    └───────────────┘
    ┌───────────────┐
    │ Diff size     │──▶ > 500 LOC? warn
    └───────────────┘
            │
            ▼
    Quality Score (0-100)
    logged per run, tracked over time
```

- Runs before task moves to Review/Done
- Configurable per project
- Quality score per run + per agent trend
- Cross-agent comparison: which agents improve, which degrade

---

## 5. Cross-agent analytics

**Audience:** 🧭 Leadership (primary) · VP Eng, Platform lead, Director

**Problem it solves:** Vendor dashboards show aggregate tokens. You can't ask "which agent is most cost-effective?"

**What Dandori provides:**

```
┌─────────────────────────────────────────────────────────┐
│  AGENT COMPARISON — Q1 2026                             │
│                                                         │
│  Agent           Runs   Success  Quality  Cost/Run      │
│  ───────────────────────────────────────────────────    │
│  ReviewerBot      342    94%      87      $0.42         │
│  TestGenerator    186    88%      91      $0.68         │
│  DocsSynthesizer   94    97%      79      $0.31         │
│  Refactorer        71    76%      64      $1.12  ⚠      │
│                                                         │
│  ⚠ Refactorer: declining quality (-8 vs. last quarter)  │
└─────────────────────────────────────────────────────────┘
```

- Per-agent KPIs: success rate, quality, cost, duration
- Trend detection: improving vs degrading agents
- Phase breakdown: which phase (research, implement, test) burns most
- Top-cost tasks: where is spend going

---

## 6. Shared skill library

**Audience:** 👷 Engineers (primary) · Staff eng, tech leads — leadership owns as knowledge asset

**Problem it solves:** Senior engineer's best prompts walk out the door when they leave.

**What Dandori provides:**

```
      COMPANY SKILL LIBRARY (centrally maintained)
      ┌──────────────────────────────────────────┐
      │  security-review  ← Security Team        │
      │  perf-analysis    ← Platform Team        │
      │  api-design       ← Staff Engineers      │
      │  incident-triage  ← SRE Team             │
      └──────────────────┬───────────────────────┘
                         │
                         │  attach to any agent
                         ▼
         Agent-Alice      Agent-Bob      Agent-Carol
              ▲               ▲                ▲
              │               │                │
         updates propagate automatically
         to all agents using the skill
```

- Skills = markdown files with structured instructions
- Attach any skill to any agent (many-to-many)
- Version history per skill
- Team ownership + update permissions
- Skill tags on tasks → auto-suggest best-matching agent

---

## 7. Task dependencies & phase workflow

**Audience:** 👷 Engineers (primary) · Tech leads, team engineers — daily workspace

**Problem it solves:** Multi-agent features need orchestration. Engineers hand-schedule wakeups in Slack.

**What Dandori provides:**

```
  Phase:  research → concept → design → implement → test → deploy
          ────────────────────────────────────────────────────────▶

  Task DAG:
  ┌──────────────┐       ┌──────────────┐
  │ research API │──┬───▶│ design impl. │
  └──────────────┘  │    └──────┬───────┘
                    │           │
                    │           ▼
                    │    ┌──────────────┐     ┌────────────┐
                    └───▶│  build API   │────▶│ write tests│
                         └──────┬───────┘     └────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  build UI    │  (starts automatically
                         └──────────────┘    when API done)
```

- Dependencies enforce DAG (no circular refs)
- Auto-start: dependent tasks wake up when parents complete
- Phase tags: research → concept → requirement → design → implement → test → deploy → maintain
- Portfolio views by phase across all projects

---

## 8. Immutable audit log

**Audience:** 🧭 Leadership (primary) · CISO, Compliance, GRC

**Problem it solves:** Auditor asks "show me every AI-generated change in Q3." Engineers shrug.

**What Dandori provides:**

```
┌──────────────────────────────────────────────────────────┐
│  AUDIT EVENT STREAM                                      │
│                                                          │
│  2026-04-04 14:22  user.alice  task.create     #T-4812   │
│  2026-04-04 14:23  agent.reviewer  run.start   #R-9201   │
│  2026-04-04 14:24  system  context.inject      versions  │
│                    company=v12, project=v3, team=v7      │
│  2026-04-04 14:26  agent.reviewer  run.complete #R-9201  │
│                    tokens=8421, cost=$0.42, quality=91   │
│  2026-04-04 14:28  user.bob   task.approve     #T-4812   │
│  2026-04-04 14:28  system  task.status         done      │
└──────────────────────────────────────────────────────────┘
```

- Every mutation logged with actor, timestamp, entity
- Includes system events: context injections, approvals, gate results
- Exportable as JSON/CSV
- Retention configurable per project
- Compliance-ready for SOC 2, ISO 27001, NIST AI RMF

---

## 9. Unified integration surface

**Audience:** 👷 Engineers (primary) · daily interface choice — leadership benefits from consistency

**Problem it solves:** Every team wires up agents differently. No shared automation primitives.

**What Dandori provides:**

```
   ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
   │  Web UI    │   │  REST API  │   │    CLI     │   │ MCP server │
   │            │   │ (OpenAPI)  │   │            │   │            │
   └──────┬─────┘   └──────┬─────┘   └──────┬─────┘   └──────┬─────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                   │
                                   ▼
                       Same data · same logic
                       Everyone sees the truth
```

- Same operations via UI, API, CLI, MCP — pick what fits the user
- CI/CD integrates via REST + webhooks (roadmap)
- Terminal workflows via CLI
- Claude Code integrates via MCP (your engineers talk to Dandori from their IDE)
- OpenAPI 3.0 spec: autogenerated clients for any language

---

## See it in context

- [Use Cases →]({% link use-cases.md %}) Management workflows built on these features
- [Architecture →]({% link architecture.md %}) How the pieces connect technically
- [AIPF Integration →]({% link aipf-integration.md %}) How Dandori fits into enterprise AI platforms
