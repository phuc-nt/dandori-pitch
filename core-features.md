---
layout: default
title: Core Features
nav_order: 4
description: "13 organizational outer harness capabilities that Dandori adds on top of your AI agents."
---

# Core Features

Your engineers already have great agents. **Dandori is the organizational outer harness around them.**

This page catalogs the 13 capabilities Dandori adds — every outer-harness primitive identified by the harness engineering discourse (Fowler, HumanLayer, LangChain, Phil Schmid), lifted from individual laptops to organizational scale. See [Harness Engineering]({% link harness-engineering.md %}) for the full framing.

Each feature is tagged with its **primary audience**:

- 👷 **Engineers** — modules engineers use daily as a workspace
- 🧭 **Leadership** — modules leadership consumes for governance and analytics
- 🤝 **Both** — same module, two lenses (engineers act, leadership audits)

---

**Dandori does not write code.** Engineers use it to coordinate and share context. Leadership uses it to measure, govern, and audit.

For the full system diagram, see [Home]({% link index.md %}#where-dandori-sits) or [Architecture]({% link architecture.md %}#system-overview--the-ecosystem).

---

## Feature-to-audience map

Each feature below has a corresponding **technical design page** under [Architecture → Modules]({% link architecture-modules.md %}) with data model, processing flow (Mermaid), and ecosystem integration details.

| # | Feature | Primary audience | Technical design |
|---|---|---|---|
| 1 | Cost attribution & budget control | 🧭 Leadership | [→]({% link architecture-modules-cost-attribution.md %}) |
| 2 | Five-layer context governance | 🤝 Both | [→]({% link architecture-modules-context-hub.md %}) |
| 3 | Approval workflows | 🤝 Both | [→]({% link architecture-modules-approval-workflow.md %}) |
| 4 | Automated quality gates | 🤝 Both | [→]({% link architecture-modules-quality-gates.md %}) |
| 5 | Cross-agent analytics | 🧭 Leadership | [→]({% link architecture-modules-cross-agent-analytics.md %}) |
| 6 | Shared skill library (progressive disclosure) | 👷 Engineers | [→]({% link architecture-modules-skill-library.md %}) |
| 7 | Task dependencies & phase workflow | 👷 Engineers | [→]({% link architecture-modules-task-board.md %}) |
| 8 | Immutable audit log | 🧭 Leadership | [→]({% link architecture-modules-audit-log.md %}) |
| 9 | Unified integration surface | 👷 Engineers | [→]({% link architecture-modules-integration-surface.md %}) |
| 10 | Generic lifecycle hooks | 👷 Engineers | [→]({% link architecture-modules-lifecycle-hooks.md %}) |
| 11 | MCP tool governance | 🤝 Both | [→]({% link architecture-modules-mcp-tool-governance.md %}) |
| 12 | Inline sensors (computational + inferential) | 👷 Engineers | [→]({% link architecture-modules-inline-sensors.md %}) |
| 13 | Sub-agent trace observability | 🤝 Both | [→]({% link architecture-modules-sub-agent-trace.md %}) |

*Each feature section below also has a "Technical design" link at the end for deep dives.*

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

**Technical design →** [Cost attribution & budget control]({% link architecture-modules-cost-attribution.md %})

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

**Technical design →** [Five-layer context governance]({% link architecture-modules-context-hub.md %})

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

**Technical design →** [Approval workflows]({% link architecture-modules-approval-workflow.md %})

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

**Technical design →** [Automated quality gates]({% link architecture-modules-quality-gates.md %})

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

**Technical design →** [Cross-agent analytics]({% link architecture-modules-cross-agent-analytics.md %})

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
- **Progressive disclosure**: only skill manifest (name, description, trigger) in system prompt; full content lazy-loaded via `fetch_skill` tool when agent actually needs it — dramatic token savings across fleet

**Technical design →** [Shared skill library]({% link architecture-modules-skill-library.md %})

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

**Technical design →** [Task dependencies & phase workflow]({% link architecture-modules-task-board.md %})

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

**Technical design →** [Immutable audit log]({% link architecture-modules-audit-log.md %})

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
- CI/CD integrates via REST + webhooks
- Terminal workflows via CLI
- Claude Code integrates via MCP (your engineers talk to Dandori from their IDE)
- OpenAPI 3.0 spec: autogenerated clients for any language

**Technical design →** [Unified integration surface]({% link architecture-modules-integration-surface.md %})

---

## 10. Generic lifecycle hooks

**Audience:** 👷 Engineers (primary) · tech leads, platform team — leadership consumes audit trail

**Problem it solves:** Engineers want to customize what happens before and after an agent run — but today they'd have to cut custom code outside any governed system. No versioning, no audit, no shared asset.

**What Dandori provides:**

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
- Platform team can mandate org-wide hooks (e.g., "all payments-service runs must log PII check")
- Full audit trail: which hook fired when, return value, error
- Same governance pattern as context and skills: diff, rollback, ownership

**Technical design →** [Generic lifecycle hooks]({% link architecture-modules-lifecycle-hooks.md %})

---

## 11. MCP tool governance

**Audience:** 🤝 Both · engineers *see and use tools*; leadership *approves and caps*

**Problem it solves:** Every engineer cloud registers MCP servers locally. No org-wide allow-list. No description governance. Bad tool descriptions burn context budget fleet-wide and nobody knows.

**What Dandori provides:**

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
│                                                          │
│  Description lints flag:                                 │
│   · bloated descriptions (>500 tokens)                   │
│   · duplicate functionality                              │
│   · ambiguous tool names                                 │
└──────────────────────────────────────────────────────────┘
```

- Dandori **governs** MCP tool availability — the MCP Hub still **hosts** them
- Tool description versioning, diff, rollback
- Per-agent and per-team allow-lists
- Usage analytics: which tools burn the most context fleet-wide
- Security team veto: restricted tools require explicit approval per agent

**Technical design →** [MCP tool governance]({% link architecture-modules-mcp-tool-governance.md %})

---

## 12. Inline sensors (back-pressure integration)

**Audience:** 👷 Engineers (primary) · daily self-correction loop

**Problem it solves:** Quality gates today run *after* the agent finishes. The agent doesn't see feedback — a human must re-assign. True back-pressure means feeding sensor output to the agent mid-run so it can self-correct.

**What Dandori provides:**

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
                  │ ...                      │
                  └──────────┬───────────────┘
                             │
                             ▼
                   Agent reads feedback,
                   fixes, re-runs sensor
                   BEFORE human review
```

- **Computational sensors**: typecheck, lint, tests, architecture fitness — milliseconds
- **Inferential sensors**: AI-powered review (e.g., security review via secondary model) — deeper but slower
- Sensor chains per task type: "migrations must pass schema-match sensor"
- LLM-optimized output format per HumanLayer pattern (silent on success, verbose on error)
- Org-wide sensor definitions: Platform team publishes "database migration sensor" → every agent in org uses it

**Technical design →** [Inline sensors (back-pressure integration)]({% link architecture-modules-inline-sensors.md %})

---

## 13. Sub-agent trace observability

**Audience:** 🤝 Both · engineers *debug*, leadership *audits*

**Problem it solves:** Modern runtimes (Claude Code sub-agents, LangGraph) do intra-run multi-agent work. Dandori today is blind to it — only sees the top-level run. For audit and debugging, this isn't enough.

**What Dandori provides:**

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
- Audit: "show me every run where a sub-agent touched file X"
- Policies: "sub-agents cannot exceed depth N", "sub-agent Y cannot call tool Z"
- UI: expandable run view showing sub-agent tree

**Technical design →** [Sub-agent trace observability]({% link architecture-modules-sub-agent-trace.md %})

---

## See it in context

- [Use Cases →]({% link use-cases.md %}) Management workflows built on these features
- [Architecture →]({% link architecture.md %}) How the pieces connect technically
- [AIPF Integration →]({% link aipf-integration.md %}) How Dandori fits into enterprise AI platforms
