---
layout: default
title: Core Features
nav_order: 4
description: "13 organizational outer harness modules organized under the 5 pillars — Cost Attribution, Knowledge Flow, Task Tracking, Quality Gates, Audit & Analytics."
---

# Core Features

Your engineers already have great agents. **Dandori is the organizational outer harness around them** — 13 modules built on two principles: **process-centric** (human and agent follow the same pipeline) and **data-driven** (every operation produces structured data).

The modules are organized under **[the 5 pillars of Outer Harness]({{ site.baseurl }}{% link harness-engineering.md %}#the-5-pillars-of-outer-harness)**, plus a foundation layer.

Each feature is tagged with its **primary audience**:

- 👷 **Engineers** — modules engineers use daily as a workspace
- 🧭 **Leadership** — modules leadership consumes for governance and analytics
- 🤝 **Both** — same module, two lenses (engineers act, leadership audits)

---

## Module map

| Pillar | Modules | Audience |
|---|---|---|
| **1. Cost Attribution** | Cost attribution & budget control | 🧭 Leadership |
| **2. Knowledge Flow** | Context Hub (5-layer), Skill Library | 🤝 Both |
| **3. Task Tracking** | Task Board (DAGs + phases), Approval Workflow, Lifecycle Hooks | 👷 Engineers (with leadership audit) |
| **4. Quality Gates** | Quality Gates (post-run), Inline Sensors (mid-run) | 🤝 Both |
| **5. Audit & Analytics** | Audit Log, Cross-agent Analytics, Sub-agent Trace, MCP Tool Governance | 🧭 Leadership (with engineer debugging) |
| **Foundation** | Integration Surface (Web UI, CLI, REST API, MCP server) | 👷 Engineers |

Each section below links to a **technical design page** under [Architecture → Modules]({{ site.baseurl }}{% link architecture-modules.md %}) with data model, processing flow, and ecosystem integration.

---

## Pillar 1 — Cost Attribution

### 1. Cost attribution & budget control

**Audience:** 🧭 Leadership — CFO, VP Eng, Platform lead

**Problem:** The vendor bill is a black box. You can't break it down.

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

**Technical design →** [Cost attribution & budget control]({{ site.baseurl }}{% link architecture-modules-cost-attribution.md %})

---

## Pillar 2 — Multi-layer Knowledge Flow

### 2. Five-layer context governance

**Audience:** 🤝 Both — engineers *author + consume* daily; leadership *versions + audits*

**Problem:** Engineers copy-paste prompts. Policies live in Confluence that agents never see.

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

**Technical design →** [Five-layer context governance]({{ site.baseurl }}{% link architecture-modules-context-hub.md %})

---

### 3. Shared skill library

**Audience:** 👷 Engineers (primary) — staff eng, tech leads; leadership owns as knowledge asset

**Problem:** Senior engineer's best prompts walk out the door when they leave.

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
- Version history per skill; team ownership + update permissions
- Skill tags on tasks → auto-suggest best-matching agent
- **Progressive disclosure**: only skill manifest in system prompt; full content lazy-loaded via `fetch_skill` tool when agent needs it — dramatic token savings

**Technical design →** [Shared skill library]({{ site.baseurl }}{% link architecture-modules-skill-library.md %})

---

## Pillar 3 — Task Tracking

### 4. Task dependencies & phase workflow

**Audience:** 👷 Engineers (primary) — tech leads, team engineers — daily workspace

**Problem:** Multi-agent features need orchestration. Engineers hand-schedule wakeups in Slack.

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

**Technical design →** [Task dependencies & phase workflow]({{ site.baseurl }}{% link architecture-modules-task-board.md %})

---

### 5. Approval workflows

**Audience:** 🤝 Both — engineers *act as reviewers*; leadership *gets the audit trail*

**Problem:** Agent shipped a migration that broke prod. Who approved it? Slack thread died.

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

**Technical design →** [Approval workflows]({{ site.baseurl }}{% link architecture-modules-approval-workflow.md %})

---

### 6. Generic lifecycle hooks

**Audience:** 👷 Engineers (primary) — tech leads, platform team; leadership consumes audit trail

**Problem:** Engineers want to customize what happens before/after agent runs — but there's no governed system for it.

```
     Agent run lifecycle

     ┌──────────────────┐
     │ before_context_  │  ← enrich/filter context before injection
     │    assembly      │
     └────────┬─────────┘
              ▼
     ┌──────────────────┐
     │  before_run      │  ← veto or mutate prompt, enforce policies
     └────────┬─────────┘
              ▼
     ┌──────────────────┐
     │  agent executes  │  (inner harness — runtime)
     └────────┬─────────┘
              ▼
     ┌──────────────────┐
     │  after_run       │  ← run sensors, notify, export
     └────────┬─────────┘
              │
     ┌────────┴──────────┐
     ▼                   ▼
  on_error         on_approval_request
  on_budget_exceeded
```

- Hooks are versioned, auditable, org-wide or per-project
- Sandboxed execution with timeout
- Platform team can mandate org-wide hooks
- Full audit trail: which hook fired when, return value, error

**Technical design →** [Generic lifecycle hooks]({{ site.baseurl }}{% link architecture-modules-lifecycle-hooks.md %})

---

## Pillar 4 — Quality Gates

### 7. Automated quality gates

**Audience:** 🤝 Both — engineers *get per-run feedback*; leadership *gets per-team trends*

**Problem:** Agents ship whatever. Humans catch issues in review 2 days later. Inner Harness self-correction (TDD loop) is necessary but not sufficient — **Separation of Duties** requires an independent check.

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

**Technical design →** [Automated quality gates]({{ site.baseurl }}{% link architecture-modules-quality-gates.md %})

---

### 8. Inline sensors (back-pressure integration)

**Audience:** 👷 Engineers (primary) — daily self-correction loop

**Problem:** Quality gates run *after* the agent finishes. True back-pressure feeds sensor output to the agent mid-run so it can self-correct.

```
    Agent mid-run
         │
         ▼
    ┌──────────────────┐
    │ calls tool:      │
    │ run_typecheck    │  ← Dandori-exposed MCP sensor
    └────────┬─────────┘
             │
       ┌─────┴──────┐
       │            │
   ✓ silent       ✗ 3 errors
   (success)      ┌──────────────────────────┐
                  │ error: auth.ts:42        │
                  │   Expected string,       │
                  │   got number             │
                  └──────────┬───────────────┘
                             │
                             ▼
                   Agent reads feedback,
                   fixes, re-runs sensor
                   BEFORE human review
```

- **Computational sensors**: typecheck, lint, tests — milliseconds
- **Inferential sensors**: AI-powered review (security review via secondary model) — deeper but slower
- Sensor chains per task type
- LLM-optimized output format (silent on success, verbose on error)
- Org-wide sensor definitions

**Technical design →** [Inline sensors]({{ site.baseurl }}{% link architecture-modules-inline-sensors.md %})

---

## Pillar 5 — Audit & Analytics

### 9. Immutable audit log

**Audience:** 🧭 Leadership (primary) — CISO, Compliance, GRC

**Problem:** Auditor asks "show me every AI-generated change in Q3." Engineers shrug.

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
- Optional hash chain for tamper-evidence
- Exportable as JSON/CSV; compliance-ready for SOC 2, ISO 27001, NIST AI RMF

**Technical design →** [Immutable audit log]({{ site.baseurl }}{% link architecture-modules-audit-log.md %})

---

### 10. Cross-agent analytics

**Audience:** 🧭 Leadership (primary) — VP Eng, Platform lead, Director

**Problem:** Vendor dashboards show aggregate tokens. You can't ask "which agent is most cost-effective?"

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
- Phase breakdown: which phase burns most
- Top-cost tasks: where is spend going

**Technical design →** [Cross-agent analytics]({{ site.baseurl }}{% link architecture-modules-cross-agent-analytics.md %})

---

### 11. Sub-agent trace observability

**Audience:** 🤝 Both — engineers *debug*, leadership *audits*

**Problem:** Modern runtimes do intra-run multi-agent work. Dandori today only sees the top-level run. For audit and debugging, this isn't enough.

```
  Run R-9201 (task: implement-payment-webhook)
  ├── parent agent: PaymentImplementor
  │     ├── sub-agent: SchemaResearcher (142 tokens, 0.8s)
  │     │     └── tool calls: grep, read
  │     ├── sub-agent: TypeWriter (380 tokens, 1.2s)
  │     │     └── tool calls: write, run_typecheck
  │     └── sub-agent: TestWriter (512 tokens, 2.1s)
  │           └── tool calls: write, run_tests
  │
  └── total: 1,034 tokens, 4.1s, quality 87
  └── cost attributed: $0.08 (roll-up to project)
```

- **Dandori does NOT spawn sub-agents** — runtimes do (inner harness)
- Dandori **observes** sub-agent traces via adapter protocol extension
- Cost rolls up to parent run → task → project
- Policies: "sub-agents cannot exceed depth N"
- UI: expandable run view showing sub-agent tree

**Technical design →** [Sub-agent trace observability]({{ site.baseurl }}{% link architecture-modules-sub-agent-trace.md %})

---

### 12. MCP tool governance

**Audience:** 🤝 Both — engineers *see and use tools*; leadership *approves and caps*

**Problem:** Every engineer registers MCP servers locally. No org-wide allow-list. Bad tool descriptions burn context budget fleet-wide.

```
┌──────────────────────────────────────────────────────────┐
│  MCP REGISTRY (org-wide, versioned)                      │
│                                                          │
│  Server          Scope       Owner          Status       │
│  ───────────────────────────────────────────────────     │
│  stripe-mcp      finance     Payments       ✓ approved   │
│  github-mcp      org-wide    Platform       ✓ approved   │
│  scratch-mcp     sandbox     Individual     ⚠ review     │
│  aws-write-mcp   restricted  Security       ⚠ restricted │
│                                                          │
│  Per-agent allow-list controls who sees what.            │
│  Description lints flag bloated/duplicate tools.         │
└──────────────────────────────────────────────────────────┘
```

- Dandori **governs** MCP tool availability — the MCP Hub still **hosts** them
- Tool description versioning, diff, rollback
- Per-agent and per-team allow-lists
- Usage analytics: which tools burn the most context fleet-wide
- Security team veto: restricted tools require explicit approval

**Technical design →** [MCP tool governance]({{ site.baseurl }}{% link architecture-modules-mcp-tool-governance.md %})

---

## Foundation — Integration Surface

### 13. Unified integration surface

**Audience:** 👷 Engineers (primary) — daily interface choice

**Problem:** Every team wires up agents differently. No shared automation primitives.

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

- Same operations via UI, API, CLI, MCP — pick what fits
- CI/CD integrates via REST + webhooks
- Claude Code integrates via MCP (talk to Dandori from the IDE)
- OpenAPI 3.0 spec: autogenerated clients for any language

**Technical design →** [Unified integration surface]({{ site.baseurl }}{% link architecture-modules-integration-surface.md %})

---

## See it in context

- [Outer Harness →]({{ site.baseurl }}{% link harness-engineering.md %}) The 5 pillars and two principles
- [Use Cases →]({{ site.baseurl }}{% link use-cases.md %}) Scenarios built on these features
- [Architecture →]({{ site.baseurl }}{% link architecture.md %}) How the pieces connect technically
