---
layout: default
title: Workflows
nav_order: 4
description: "How the 13 Dandori features get used — leadership and engineer scenarios with component interaction diagrams."
---

# Workflows

How the features from [Dandori Overview]({{ site.baseurl }}{% link dandori-overview.md %}) actually get used. Each scenario is a sequence diagram showing which Dandori components interact in a real workflow.

---

## Leadership scenarios

### CFO: "Where did the AI bill go?"

Opens Cost Attribution dashboard. Drills from total spend → top project → top agent by cost-to-quality ratio. Spots an outlier burning far above baseline at low quality. Action: investigate the outlier, shift low-complexity work to a cheaper model. **Minutes, not meetings.** Before Dandori: "we'll ask the teams" → spreadsheet next week.

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

### Platform VP: morning fleet check

Opens Fleet Operations Dashboard at stand-up. Sees live view: 23 agents active across 6 teams, total burn rate $4.2/min, owner mapping per agent. One agent flagged red — duration 40 min vs usual 12. Drills in: stuck on a dependency loop. Action: ping the owning team in Slack.

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

### Platform lead: 8 teams, one standard

Sets Company context (Layer 1): security rules, approved libraries, style guide. Publishes shared skills and agent templates. All 8 teams inherit automatically; each still owns its project + team context. Cross-team analytics spot best practices and flag outliers.

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

### CISO: "Show me PII-touching runs in Q1"

Queries audit log: runs where context contained PII-tagged layers, date range Q1. Result set with full context versions per run. One-click compliance export (JSON / CSV / SOC 2 format).

```mermaid
sequenceDiagram
    actor CISO
    participant UI as Web UI
    participant AL as Audit Log
    participant CH as Context Hub
    participant Exp as Compliance Export

    CISO->>UI: filter: PII tag + Q1 date
    UI->>AL: query runs matching filter
    AL-->>UI: run IDs + context version snapshots
    UI->>CH: resolve each version used
    CH-->>UI: layer bodies per run
    CISO->>UI: one-click export
    UI->>Exp: build evidence pack
    Exp-->>CISO: JSON / CSV / SOC 2 PDF
```

### Engineering Director: quality trending

Dashboard shows company quality trend + per-team breakdown. One team is drifting downward. Drill down: specific agent's score dropped — root cause: outdated skill version. Action: Platform team updates the skill, change propagates to every attached agent.

```mermaid
sequenceDiagram
    actor Dir as Director
    participant UI as Web UI
    participant XA as Cross-agent Analytics
    participant QG as Quality Gates
    participant SL as Skill Library
    participant Agents as Attached agents

    Dir->>UI: view quality trends
    UI->>XA: company + per-team scores
    XA-->>Dir: team drifting down
    Dir->>UI: drill to agent
    UI->>QG: per-run scores
    QG-->>Dir: root cause: skill v3 outdated
    Dir->>SL: request update
    SL->>SL: publish v4
    SL-->>Agents: auto-propagate v4 on next fetch
```

### Compliance: SOC 2 audit prep

One-click evidence pack: access control, change management, audit trail, data classification, policy enforcement, incident traceability. All the controls an auditor asks about, already logged. Before Dandori: a custom tooling project.

```mermaid
sequenceDiagram
    actor Comp as Compliance
    participant UI as Web UI
    participant AL as Audit Log
    participant AW as Approval Workflow
    participant CH as Context Hub
    participant Exp as Compliance Export

    Comp->>UI: generate SOC 2 pack
    UI->>AL: access control + audit events
    AL-->>Exp: log stream
    UI->>AW: approval records
    AW-->>Exp: approval trail
    UI->>CH: policy versions + PII tags
    CH-->>Exp: classification snapshots
    Exp-->>Comp: PDF / JSON / CSV evidence pack
```

---

## Engineer scenarios

### Tech lead: multi-phase feature with 4 agents

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

### Senior engineer: publishing a team skill

Creates skill `go-microservice-review` v1 with review checklist. Attaches to agents across 2 teams. When skill updates to v2 → all attached agents pick it up automatically. New teammate's agent inherits day 1. **Knowledge stays with the org, not the individual.**

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

### Team engineer: forking an agent template

Clones the Platform team's `code-reviewer` template. Customizes it with team-specific context (style guide, service boundaries). Uses it for daily reviews. Two months later, shares the customized variant back for other teams to adopt.

```mermaid
sequenceDiagram
    actor TE as Team Engineer
    participant AT as Agent Templates
    participant SL as Skill Library
    participant CH as Context Hub
    participant Inst as Agent instance

    TE->>AT: clone code-reviewer template
    AT->>SL: resolve referenced skills
    SL-->>AT: skill set
    AT->>CH: bind team context layer
    CH-->>AT: team + project layers
    AT-->>Inst: instantiate agent
    Note over TE,Inst: daily use (weeks)
    TE->>AT: promote variant as alt template
    AT->>AT: publish new template version
```

### Release manager: agent regression check before rollout

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

### Mid-level engineer: picking up an in-review task

Opens Task Board → task in "In Review". Sees: full prompt sent to agent, assembled context versions (company v12, project v3, team v7), agent output with self-explanation ("What I did / Why / Risks"), quality gate results. **Full reproducible state — reviews without pinging anyone.**

```mermaid
sequenceDiagram
    actor Eng as Engineer
    participant TB as Task Board
    participant CH as Context Hub
    participant QG as Quality Gates
    participant AW as Approval Workflow

    Eng->>TB: open task T-4812 (IN_REVIEW)
    TB->>CH: resolve context versions used
    CH-->>TB: 5-layer snapshot
    TB->>QG: fetch gate results
    QG-->>TB: typecheck ✓ · lint ⚠ · tests ✓
    TB->>AW: approval status
    AW-->>TB: waiting
    TB-->>Eng: full reproducible view
    Eng->>AW: approve + rationale
    AW->>TB: move to DONE
```

### Agent during a run: self-correcting via sensors

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

Across all 10 scenarios, the shape is the same: **engineers work inside Dandori, leaders see through Dandori** — pulling from the same database, trusting the same audit trail, acting on the same data.

- Policies propagate automatically (no copy-paste)
- Every decision backed by data (no gut feel)
- Incidents become learnings (full reproducibility)
- Knowledge stays with the org (not the individual)

---

## Read next

[Architecture →]({{ site.baseurl }}{% link architecture.md %}) How these components are wired together technically — tech stack, adapter layer, ecosystem integrations, deployment
{: .fs-5 }
