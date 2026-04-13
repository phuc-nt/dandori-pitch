---
layout: default
title: Workflows
nav_order: 4
description: "8 iconic scenarios showing how Dandori features interact in real leadership and engineer workflows."
---

# Workflows

How the features from [Dandori Overview]({{ site.baseurl }}{% link dandori-overview.md %}) actually get used. **8 iconic scenarios** — each a sequence diagram showing which Dandori components interact in a real workflow. Together they cover all 5 pillars and both directions of knowledge flow.

---

## Leadership scenarios

### 1. CFO: "Where did the AI bill go?"

Opens Cost Attribution dashboard. Drills from total spend → top project → top agent by cost-to-quality ratio. Spots an outlier burning far above baseline at low quality. Action: investigate, shift low-complexity work to a cheaper model, set a budget ceiling. **Minutes, not meetings.**

```mermaid
sequenceDiagram
    actor CFO
    participant UI as Web UI
    participant CA as Cost Attribution
    participant XA as Cross-agent Analytics
    participant BC as Budget Control

    CFO->>UI: open dashboard
    UI->>CA: aggregate by project / team / agent
    CA-->>UI: cost breakdown
    UI->>XA: compute cost / quality ratio
    XA-->>UI: ranked agents (outlier flagged)
    CFO->>UI: drill into outlier
    UI->>CA: per-run detail
    CA-->>UI: run records
    CFO->>UI: set budget ceiling
    UI->>BC: update ceiling
    BC-->>UI: active (hard stop next run)
```

### 2. Platform VP: morning fleet check

Opens Fleet Operations Dashboard at stand-up. Live view: 23 agents active across 6 teams, total burn rate $4.2/min, owner mapping per agent. One agent flagged red — duration 40 min vs usual 12. Drills in: stuck on a dependency loop. Action: ping the owning team in Slack.

```mermaid
sequenceDiagram
    actor VP as Platform VP
    participant UI as Web UI
    participant FO as Fleet Ops Dashboard
    participant TB as Task Board
    participant CA as Cost Attribution

    VP->>UI: open fleet dashboard
    UI->>FO: query active agents NOW
    FO->>TB: in-flight tasks + owners
    FO->>CA: current cost rate
    TB-->>FO: 23 active across 6 teams
    CA-->>FO: $4.2/min total
    FO-->>VP: live snapshot + anomaly flag
    VP->>UI: drill into flagged agent
    UI->>TB: run history + dependency graph
    TB-->>VP: 40min duration, stuck on dep loop
```

### 3. Platform lead: rolling out one standard to 8 teams

Sets Company context (Layer 1): security rules, approved libraries, style guide. Publishes shared skills and agent templates: `security-review`, `perf-analysis`, `api-design`. All 8 teams inherit automatically; each still owns its project + team context. Cross-team analytics spot best practices and flag outliers.

```mermaid
sequenceDiagram
    actor PL as Platform Lead
    participant CH as Context Hub
    participant SL as Skill Library
    participant AT as Agent Templates
    participant Agents as Team agents (×8)
    participant XA as Cross-agent Analytics

    PL->>CH: write Layer 1 (security / libs / style)
    CH-->>Agents: auto-inherit on next run
    PL->>SL: publish shared skills
    PL->>AT: publish code-reviewer template
    SL-->>Agents: available via fetch_skill
    AT-->>Agents: available for cloning
    Agents->>XA: emit run + quality + cost events
    XA-->>PL: best practices + outlier alerts
```

### 4. Compliance: audit query and evidence export

Compliance/CISO queries the audit log — either ad-hoc ("show me all PII-touching runs in Q1") or scheduled (quarterly SOC 2 pack). Audit Log joins with Approval Workflow, Context Hub (to resolve versions), and any PII classifications. One click exports a JSON / CSV / SOC 2 pack. **Every controls question an auditor asks — already logged, nothing to backfill.**

```mermaid
sequenceDiagram
    actor Comp as Compliance / CISO
    participant UI as Web UI
    participant AL as Audit Log
    participant AW as Approval Workflow
    participant CH as Context Hub
    participant Exp as Compliance Export

    Comp->>UI: filter (ad-hoc or scheduled)
    UI->>AL: query runs + mutations matching filter
    AL-->>UI: run IDs + context versions + mutations
    UI->>AW: approval records on matching runs
    AW-->>UI: approval trail
    UI->>CH: resolve versions + PII tags
    CH-->>UI: layer snapshots + classifications
    Comp->>UI: one-click export
    UI->>Exp: build evidence pack
    Exp-->>Comp: JSON / CSV / SOC 2 PDF
```

---

## Engineer scenarios

### 5. Tech lead: multi-phase feature with 5 agents

Builds a DAG (research → design → implement → test → deploy). Each task auto-wakes when its parent completes. Each agent inherits company + project + team context + upstream outputs. Quality gates block downstream tasks if a gate fails. **No Slack dispatching, no copy-paste handoffs.**

```mermaid
sequenceDiagram
    actor TL as Tech Lead
    participant TB as Task Board
    participant CH as Context Hub
    participant AD as Adapter
    participant RT as Runtime
    participant QG as Quality Gates

    TL->>TB: create DAG T1 to T5
    TB->>CH: assemble context for T1
    CH-->>TB: 5-layer prompt
    TB->>AD: run T1
    AD->>RT: spawn Claude Code agent
    RT-->>AD: output
    AD->>QG: post-run gates
    QG-->>TB: score passes
    TB->>TB: auto-wake T2
    TB->>CH: assemble for T2 with T1 output
    CH-->>TB: prompt with upstream
    Note over TB,QG: repeat T2 through T5, gate fail blocks downstream
```

### 6. Senior engineer: publishing a team skill (bottom-up knowledge flow)

Creates skill `go-microservice-review` v1 with review checklist. Attaches to agents across 2 teams. When skill updates to v2 → all attached agents pick it up automatically via `fetch_skill` (progressive disclosure — full body fetched only when needed). **Knowledge stays with the org, not the individual.**

```mermaid
sequenceDiagram
    actor SE as Senior Eng
    participant SL as Skill Library
    participant A1 as Agent (team A)
    participant A2 as Agent (team B)
    participant MCP as MCP fetch_skill

    SE->>SL: publish go-microservice-review v1
    SE->>SL: attach to A1 + A2
    A1->>MCP: fetch_skill(go-microservice-review)
    MCP->>SL: resolve latest version
    SL-->>A1: v1 body
    SE->>SL: update to v2
    A2->>MCP: fetch_skill(go-microservice-review)
    MCP->>SL: resolve latest
    SL-->>A2: v2 body (auto)
```

### 7. Release manager: regression check before rollout

Before rolling out a new Company context version, release manager triggers the Evaluation Suite against the golden task set. Runs 50 golden tasks × 3 agents with the new context pinned. Compares scores vs baseline. If any agent regresses more than 5 points, block the rollout and investigate.

```mermaid
sequenceDiagram
    actor RM as Release Manager
    participant UI as Web UI
    participant ES as Evaluation Suite
    participant CH as Context Hub
    participant Agents as Target agents
    participant XA as Cross-agent Analytics

    RM->>UI: trigger eval with context v12
    UI->>ES: run golden task set
    ES->>CH: pin context v12
    ES->>Agents: execute 50 tasks × 3 agents
    Agents-->>ES: outputs + gate scores
    ES->>XA: compare vs baseline
    XA-->>ES: Agent A: 91 (+2 ✓)
    XA-->>ES: Agent B: 88 (-7 ⚠ block)
    ES-->>RM: rollout blocked by Agent B regression
    RM->>UI: hold release, investigate
```

### 8. Agent during a run: self-correcting via sensors

Mid-run, agent calls `run_typecheck` via MCP. Gets errors back. Fixes them. Calls `run_lint` — 1 warning, fixes. Finishes run. Quality gate confirms. **Self-correction before human review, not after.**

```mermaid
sequenceDiagram
    participant Agent as Agent runtime
    participant MCP as Integration Surface MCP
    participant IS as Inline Sensors
    participant QG as Quality Gates

    Agent->>MCP: tool call: run_typecheck
    MCP->>IS: execute sensor
    IS-->>Agent: 3 errors
    Agent->>Agent: fix errors
    Agent->>MCP: run_typecheck
    MCP->>IS: execute
    IS-->>Agent: ✓ clean
    Agent->>MCP: run_lint
    MCP->>IS: execute
    IS-->>Agent: 1 warning
    Agent->>Agent: fix warning
    Agent->>MCP: run_lint
    IS-->>Agent: ✓ clean
    Agent->>QG: finalize run
    QG-->>Agent: score 91, forward to review
```

---

## The common pattern

Across all 8 scenarios, the shape is the same: **engineers work inside Dandori, leaders see through Dandori** — pulling from the same database, trusting the same audit trail, acting on the same data.

- Policies propagate automatically (no copy-paste)
- Every decision backed by data (no gut feel)
- Incidents become learnings (full reproducibility)
- Knowledge stays with the org (not the individual)

---

## Read next

[Architecture →]({{ site.baseurl }}{% link architecture.md %}) How these components are wired together technically — tech stack, adapter layer, infrastructure primitives, deployment
{: .fs-5 }
