# Use Cases

**For leaders, not engineers.** These are scenarios that *management* runs — leveraging the capabilities from [Core Features](core-features.md) — not scenarios that agents execute.

The agents execute code. **Dandori lets leadership govern, measure, and scale the agents.**

---

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

**What CISO governs:**
- PII classification at context layer
- Policy: "no PII in agent prompts" enforced by context system
- Audit exports for auditors
- Incident investigation: who did what, when, with which policy version

**Dandori capability used:** Audit log, context versioning, PII tagging, compliance export.

---

## 4. Engineering Director: Quality trend across teams

**Role:** VP Engineering, Director
**Question:** "Are our AI-generated outputs getting better or worse? Is any team drifting?"

**The management problem:** Engineers say "our agents are great." How do you know?

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

**What Director governs:**
- Quality score SLOs per team
- Investigations when trends decline
- Share winning practices across teams
- Data-driven performance reviews

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

**What compliance governs:**
- Access control per project
- Policy versions (when changed, who, why)
- Audit exports on cadence
- Evidence for external auditors

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

**What leadership governs:**
- Skills are org assets, not individual assets
- Ownership transitions when people leave
- Onboarding uses same skills everyone else uses
- Promotions reward people who contribute to skill library

**Dandori capability used:** Skill library, version control, team ownership.

---

## 7. Evaluating a new AI model/provider

**Role:** VP Engineering, Platform Architect
**Question:** "Should we switch from Claude to Gemini? Where's the data?"

**Without Dandori:** Engineer tries it on their tasks, forms opinion, writes memo.

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

**What leadership governs:**
- Rigorous A/B evaluation with same inputs
- Data-driven vendor decisions
- Mixed-model strategies to optimize cost/quality

**Dandori capability used:** Multiple adapters, per-agent analytics, controlled experiments.

---

## 8. Incident postmortem: Agent-caused outage

**Role:** Engineering Manager, SRE Lead
**Question:** "The agent shipped a broken migration. How did we get here?"

**Without Dandori:** Git blame → engineer → "the agent said it was fine."

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

**What management governs:**
- Full prompt replay for incident investigation
- Context version at time-of-incident
- Policy changes post-incident (add gates, approvals)

**Dandori capability used:** Audit log, context versioning, prompt replay, approval workflow.

---

## 9. Fair work attribution + team KPIs

**Role:** Engineering Manager
**Question:** "Which engineers drove the most agent-assisted value this quarter?"

**Before Dandori:** Gut feel. Politically fraught.

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

**What management governs:**
- Fair attribution of agent-assisted output
- Identify reviewer bottlenecks
- Reward skill-library contributors
- Detect over-reliance on one engineer

**Dandori capability used:** Approval tracking, skill ownership, per-user analytics.

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

**The pattern across all 9 use cases:**

1. Leaders see *through* Dandori, not around it.
2. Policies live at the right layer and propagate automatically.
3. Every decision is backed by data, not gut feel.
4. Incidents become learnings, not finger-pointing.

---

## See it in context

- **[Core Features →](core-features.md)** The capabilities behind these scenarios
- **[Architecture →](architecture.md)** How Dandori delivers them technically
- **[Enterprise →](enterprise.md)** Rolling this out at 1,000+ engineers
