---
layout: default
title: Use Cases
nav_order: 5
description: "9 management scenarios for CTO, CISO, Platform, and Compliance teams."
---

# Use Cases

Dandori is a **dual-audience platform**. This page walks through scenarios for both sides:

- **🧭 Leadership scenarios (1–9)** — how CTOs, CISOs, Platform teams, and Compliance use Dandori as a control plane.
- **👷 Engineer scenarios (10–12)** — how staff engineers and tech leads use Dandori as a daily workspace.

Agents execute code. **Dandori is where engineers coordinate that work and where leadership governs it** — same database, two lenses.

---

## Leadership scenarios (control plane)

## 1. CFO: Monthly AI cost review

**Role:** CFO, VP Engineering
**Question:** "Where did our $240K AI bill go this month, and is it trending safely?"

**Before Dandori:**
```
Anthropic invoice:  $180,000
OpenAI invoice:      $60,000
────────────────────────────
Total:              $240,000

Breakdown?  "We'll ask the teams."
Trend?      "Spreadsheet next week."
Waste?      "No way to tell."
```

**With Dandori:**
```
┌──────────────────────────────────────────────────────┐
│  MONTHLY COST REVIEW — DANDORI DASHBOARD             │
│                                                      │
│  Total:                           $240,130           │
│  vs. previous month:              +18%     ⚠         │
│                                                      │
│  Top projects (by spend):                            │
│    1. payments-service      $52,100     ↑ 42%  ⚠⚠    │
│    2. auth-platform         $38,240     ↓  3%        │
│    3. data-pipeline         $29,880     →  0%        │
│                                                      │
│  Top agents (by cost/quality ratio):                 │
│    • RefactorBot      $8,420   quality 64   ⚠        │
│    • DocsSynthesizer  $3,110   quality 89   ✓        │
│                                                      │
│  Actions:                                            │
│    1. Investigate payments-service 42% jump          │
│    2. Review RefactorBot (low quality/high cost)     │
│    3. Shift low-complexity tasks to cheaper model    │
└──────────────────────────────────────────────────────┘
```

**Dandori capability used:** Cost attribution, cross-agent analytics, trend detection.

---

## 2. Platform team: Standardizing agent usage across 8 product teams

**Role:** Head of Developer Platform
**Question:** "How do I roll out AI agents consistently without 8 different stacks?"

**The management problem:**

```
Without Dandori:
  Team A → uses Claude Code + hand-written prompts in repo
  Team B → uses Cursor + prompts in Notion
  Team C → uses custom Python wrapper + prompts in .env
  Team D → uses Codex via CLI alias
  ...
  Result: no shared standards, no central cost view,
          no learning from one team to another
```

**With Dandori:**

```
       ┌─────────────────────────────────────────┐
       │     COMPANY CONTEXT (set by Platform)   │
       │  Security rules · Approved libs · Style │
       └─────────────────────────────────────────┘
                          │
        ┌─────────┬───────┴───────┬─────────────┐
        ▼         ▼               ▼             ▼
     Team A    Team B          Team C        Team D
   (inherits) (inherits)     (inherits)    (inherits)

        + shared skill library: security-review,
          perf-analysis, api-design, test-patterns
```

**What Platform team manages centrally:**
- Company-level context (security, compliance, approved deps)
- Skill library (all teams reuse same proven prompts)
- Analytics across all teams (spot best practices, flag outliers)
- Rate limits per team (prevent runaway cost from one team)

**What product teams own:**
- Their project + team context
- Their specific agents
- Their own tasks

**Dandori capability used:** 5-layer context, skill library, per-project scoping, cross-team analytics.

---

## 3. CISO: AI security posture review

**Role:** CISO, Security Architect
**Question:** "Show me every prompt that touched our PII-tagged data last quarter."

**Without Dandori:** Impossible. No single source of logs.

**With Dandori:**

```
Query: SELECT runs WHERE context_contains PII_CLASSIFIED
       AND date BETWEEN 2026-01-01 AND 2026-03-31

┌─────────────────────────────────────────────────────┐
│  PII-TOUCHING RUNS — Q1 2026                        │
│                                                     │
│  Total runs:          8,421                         │
│  Flagged for review:     12                         │
│  Violations detected:     0                         │
│                                                     │
│  Projects involved:                                 │
│    ├─ user-data-service     (6,120 runs)            │
│    ├─ billing-platform      (1,983 runs)            │
│    └─ internal-analytics      (318 runs)            │
│                                                     │
│  Context versions at time of run: all logged        │
│  Output retention: 90 days                          │
│  Exportable: JSON / CSV / SOC2 audit format         │
└─────────────────────────────────────────────────────┘
```

**Dandori capability used:** Audit log, context versioning, PII tagging, compliance export.

---

## 4. Engineering Director: Quality trend across teams

**Role:** VP Engineering, Director
**Question:** "Are our AI-generated outputs getting better or worse? Is any team drifting?"

**With Dandori:**

```
┌─────────────────────────────────────────────────────┐
│  AGENT QUALITY TREND — 6 months                     │
│                                                     │
│  Company avg: 82 ────► 87    ↑ +5   (good)          │
│                                                     │
│  By team:                                           │
│    Payments    78 ─▶ 91   ↑ +13   (excellent)       │
│    Auth        85 ─▶ 88   ↑  +3                     │
│    Data        81 ─▶ 76   ↓  -5   ⚠  investigate    │
│    Internal    83 ─▶ 84   →  +1                     │
│                                                     │
│  Drill-down: Data team quality drop                 │
│    Agent "Refactorer" dropped 64 → 48               │
│    Root cause: outdated skill version               │
│    Action: Platform to update skill                 │
└─────────────────────────────────────────────────────┘
```

**Dandori capability used:** Quality gates, cross-agent analytics, trend detection.

---

## 5. Compliance officer: SOC 2 AI controls audit

**Role:** Compliance Officer, GRC
**Question:** "Our auditor requires evidence of AI governance. What do we show them?"

**Before Dandori:** Custom tooling project, 3 months, one-off export scripts.

**With Dandori:**

```
┌──────────────────────────────────────────────────────────┐
│  SOC 2 AI CONTROLS EVIDENCE PACK                         │
│                                                          │
│  ✓ Access control         → API keys per user, revocable │
│  ✓ Change management      → Approval gates, logged       │
│  ✓ Audit trail            → Immutable log, 365 days      │
│  ✓ Data classification    → Context PII tags             │
│  ✓ Policy enforcement     → Company context versioned    │
│  ✓ Incident traceability  → Run-level prompt replay      │
│                                                          │
│  One-click export: JSON · CSV · PDF                      │
│  Retention: 365 days configurable                        │
└──────────────────────────────────────────────────────────┘
```

**Dandori capability used:** Audit log, access control, context versioning, export.

---

## 6. Org-wide knowledge transfer on hiring/attrition

**Role:** Head of Engineering
**Question:** "Our best prompt-engineer just quit. What did they leave behind?"

**Without Dandori:** Text files in their home dir. Gone.

**With Dandori:**

```
      BEFORE (knowledge walks out the door)
      ────────────────────────────────────
      Alice's magic prompts live in:
        ~/scripts/prompts.txt         (laptop, deleted)
        .cursorrules (one of her branches, forgotten)
        Confluence "DRAFT - Alice's tips"
        Slack DMs
      Result: 6 months to rebuild, tribal knowledge


      AFTER (knowledge stays with the org)
      ────────────────────────────────────
      Alice's skills live in Dandori:
        skill: "code-review-patterns"   (version 12)
        skill: "refactor-checklist"     (version 8)
        skill: "perf-investigation"     (version 5)

      Attached to: 14 agents across 4 teams.
      New engineer day 1: inherits proven prompts automatically.
      Result: zero knowledge loss.
```

**Dandori capability used:** Skill library, version control, team ownership.

---

## 7. Evaluating a new AI model/provider

**Role:** VP Engineering, Platform Architect
**Question:** "Should we switch from Claude to Gemini? Where's the data?"

**With Dandori:**

```
  Evaluation plan: run 50 real tasks through both models
  ──────────────────────────────────────────────────────

  Week 1: Create agent "Reviewer-Claude" (existing)
          Create agent "Reviewer-Gemini" (new model)
          Both inherit: same context, same skills, same tasks

  Week 2-3: Route same task set to both
            Dandori logs: quality, cost, duration, output length

  Week 4: Review comparison table

┌────────────────────────────────────────────────────────┐
│  MODEL EVAL — 50 matched tasks                         │
│                                                        │
│  Metric            Claude    Gemini    Winner          │
│  ─────────────────────────────────────────────────     │
│  Avg quality         87        82      Claude          │
│  Cost/run         $0.42     $0.18      Gemini (-57%)   │
│  Duration          12.3s     8.1s      Gemini          │
│  Pass quality gates  94%       79%     Claude          │
│                                                        │
│  Decision: Keep Claude for high-stakes tasks,          │
│            route low-complexity work to Gemini         │
│  Projected savings: $14K/month                         │
└────────────────────────────────────────────────────────┘
```

**Dandori capability used:** Multiple adapters, per-agent analytics, controlled experiments.

---

## 8. Incident postmortem: Agent-caused outage

**Role:** Engineering Manager, SRE Lead
**Question:** "The agent shipped a broken migration. How did we get here?"

**With Dandori:**

```
  Incident #INC-4812 postmortem
  ────────────────────────────────────────

  Run ID: R-48291
  Agent: SchemaMigrator
  Executed: 2026-04-04 02:14 UTC
  Task: #T-9102 (auto-generated schema migration)

  Prompt context (as sent to AI):
    Company context v12 — 2026-03-01
    Project context (data-pipeline) v3 — 2026-02-15   ⚠
    Team context v7 — 2026-04-01
    Agent instruction v4 — 2026-03-20
    Task spec — 2026-04-03

  ⚠ Root cause: project context v3 from Feb still listed
    old column names removed in Feb 20 refactor.
    Migration agent used stale info.

  Remediation:
    1. Update project context to v4
    2. Add quality gate: "verify schema matches live DB"
    3. Require approval for all migrations
```

**Dandori capability used:** Audit log, context versioning, prompt replay, approval workflow.

---

## 9. Fair work attribution + team KPIs

**Role:** Engineering Manager
**Question:** "Which engineers drove the most agent-assisted value this quarter?"

**With Dandori:**

```
┌──────────────────────────────────────────────────────┐
│  Q1 AGENT USAGE BY ENGINEER                          │
│                                                      │
│  Engineer    Tasks   Approvals   Skills   Cost-adj   │
│                      given       contrib. quality    │
│  ─────────────────────────────────────────────       │
│  Alice         42       28          3        91      │
│  Bob           38       12          0        84      │
│  Carol         31       55*         1        87      │
│                                                      │
│  * Carol did majority of approvals → bottleneck?     │
│    Or: Carol has context others lack → celebrate     │
└──────────────────────────────────────────────────────┘
```

**Dandori capability used:** Approval tracking, skill ownership, per-user analytics.

---

## Engineer scenarios (daily workspace)

## 10. Staff engineer: Shipping a multi-phase feature with a DAG of agents

**Role:** Staff engineer / Tech lead
**Question:** "I need to ship a new payments webhook: research the spec, design the schema, implement, test, deploy. How do I coordinate 4 agents without playing Slack dispatcher?"

**Without Dandori:**
```
9:00  "Hey Claude Code, research the Stripe webhook spec"
       → agent finishes → lead copies output into Notion
10:30 "Hey Claude, design the schema using that research"
       → agent asks "what research?" → lead pastes it in
...repeat for implement, test, deploy
```

Every handoff is a manual copy-paste. Context decays at each step.

**With Dandori:**

```
  Feature: payments-webhook
  ┌─────────────────────────────────────────────────────┐
  │  Task DAG (phases enforced)                         │
  │                                                     │
  │  T-1 research-stripe-spec          [research]       │
  │        ▼                                            │
  │  T-2 design-db-schema              [design]         │
  │        ▼                                            │
  │  T-3 implement-handler             [implement]      │
  │        ▼                                            │
  │  T-4 write-integration-tests       [test]           │
  │        ▼                                            │
  │  T-5 deploy-to-staging             [deploy]         │
  │                                                     │
  │  ✓ Each task auto-wakes when parent completes       │
  │  ✓ Each agent inherits: company + project + team    │
  │    context + outputs from upstream tasks            │
  │  ✓ Lead reviews output at each phase boundary       │
  └─────────────────────────────────────────────────────┘
```

- Lead builds the DAG once. Auto-orchestration takes over.
- Each agent sees upstream task outputs as context — no copy-paste handoffs.
- Phase tags (research → design → implement → test → deploy) give the lead a clean review checkpoint at each step.
- If T-3 fails quality gates, only T-3 re-runs; T-4/T-5 stay blocked until green.

**Dandori capability used:** Task DAGs, phase workflow, context inheritance, quality gates, auto-wakeup.

---

## 11. Senior engineer: Publishing a team skill

**Role:** Senior / staff engineer
**Question:** "I've figured out a great pattern for reviewing Go microservices. How do I make it stick across the team — without it getting lost in a Notion doc no one re-reads?"

**Without Dandori:**
- Write it up in Confluence. Team bookmarks it. Nobody actually pastes it into their Cursor.
- Six months later: two engineers rediscover the same thing.

**With Dandori:**

```
  1. Senior engineer creates a skill:

     Skill: go-microservice-review
     Owner: payments-team
     Version: v1

     Content:
       # How we review Go microservices
       1. Check context cancellation on all I/O
       2. Verify error wrapping is in place
       3. Ensure metrics + trace spans exist
       ...

  2. Attach skill to agents:
     ✓ ReviewerBot-payments
     ✓ ReviewerBot-auth
     ✓ ReviewerBot-data

  3. Every code-review run from those agents now includes
     this skill automatically.

  4. Skill improves over time — versioned.
     Every attached agent picks up v2, v3, v4 automatically.
```

- Knowledge becomes org asset, not personal notes.
- New teammate's agent inherits the patterns day 1.
- When the senior engineer leaves, the skill stays.

**Dandori capability used:** Skill library, versioning, many-to-many skill-agent attachment.

---

## 12. Team engineer: Picking up an in-review task

**Role:** Mid-level engineer
**Question:** "The task board shows a task stuck in 'In Review'. I want to pick it up and move it forward — what do I need?"

**Without Dandori:**
- Ping the author on Slack. Wait for context.
- Scroll through comment thread for the original prompt.
- Guess which version of the docs was current.

**With Dandori:**

```
  Task: T-4812  (In Review)
  ┌─────────────────────────────────────────────────────┐
  │  ▸ Prompt sent to agent (full)                      │
  │  ▸ Context assembled:                               │
  │      company v12 · project v3 · team v7             │
  │      agent v4 · task spec                           │
  │  ▸ Agent output (diff + self-explanation)           │
  │     "What I did: ..."                               │
  │     "Why: ..."                                      │
  │     "Risks: ..."                                    │
  │  ▸ Quality gates:                                   │
  │     typecheck ✓  lint ⚠  tests ✓                    │
  │  ▸ Approval status: waiting on reviewer             │
  └─────────────────────────────────────────────────────┘
```

- Full reproducible state — any engineer can pick up and review without pinging the author.
- Self-explanation block gives instant "what and why".
- Context version links make it obvious which docs were live.

**Dandori capability used:** Context versioning, self-explanation, quality gates, approval queue.

---

## Pattern: Management runs the org, agents run the tasks

```
           │                                          │
  LEADERS  │  ◀── Dandori dashboards ──               │  AGENTS
  (govern) │       · cost attribution                 │  (execute)
           │       · quality trends                   │
           │       · compliance reports               │    │
           │                                          │    │
           ├─ set policies ─ set contexts ─ approve ──┤    │
           │                                          │    │
           │  ─── Dandori orchestrates ──▶            │    ▼
           │                                          │  writes
           │                                          │  code,
           │                                          │  tests,
           │                                          │  docs
```

**The pattern across all 12 use cases:**

1. Engineers work *inside* Dandori; leaders see *through* it. Same database, two lenses.
2. Policies live at the right layer and propagate automatically.
3. Every decision is backed by data, not gut feel.
4. Incidents become learnings, not finger-pointing.
5. Knowledge (skills, context, approval rationale) stays with the org, not the individual.

---

## See it in context

- [Core Features →]({% link core-features.md %}) The capabilities behind these scenarios
- [Architecture →]({% link architecture.md %}) How Dandori delivers them technically
- [AIPF Integration →]({% link aipf-integration.md %}) Fitting into enterprise AI platforms
