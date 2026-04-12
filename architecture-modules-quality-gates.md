---
layout: default
title: Quality Gates
parent: Modules
grand_parent: Architecture
nav_order: 3
description: "Post-run computational sensors that compute quality score per run and trend per team."
---

# Quality Gates

## Purpose

After every agent run completes, automatically run a configurable set of computational sensors (typecheck, lint, tests) and compute a quality score (0-100). Score is logged per run and rolled up into per-agent / per-team trend lines for leadership.

## Architecture

```mermaid
flowchart TB
    Run[Run completes]
    QGE[Quality Gate Engine]
    TC[TypeScript / typecheck]
    LT[ESLint / lint]
    TS[Test scanner]
    DS[Diff size check]
    Score[Score computation<br/>base 100<br/>− 10 / TS error<br/>− 5 / lint warn<br/>− 15 / no test<br/>− 5 / diff > 500 LOC]
    Run2[(runs.quality_score<br/>+ quality_breakdown)]
    Trend[Cross-run trend<br/>analytics]

    Run --> QGE
    QGE --> TC
    QGE --> LT
    QGE --> TS
    QGE --> DS
    TC --> Score
    LT --> Score
    TS --> Score
    DS --> Score
    Score --> Run2
    Run2 --> Trend
```

## Data model

```sql
ALTER TABLE runs ADD COLUMN quality_score INTEGER;
ALTER TABLE runs ADD COLUMN quality_breakdown TEXT; -- JSON

-- Project-level config
CREATE TABLE quality_gate_configs (
  project_id      TEXT PRIMARY KEY,
  enabled_sensors TEXT NOT NULL,  -- JSON array
  thresholds      TEXT NOT NULL,  -- JSON
  updated_at      DATETIME NOT NULL
);
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Adp as Adapter
    participant QG as Quality Gate Engine
    participant TC as Typecheck (npx tsc)
    participant LT as Lint (eslint)
    participant TS as Tests (vitest)
    participant Run as runs table
    participant An as Analytics

    Adp->>QG: run.completed(run_id, workdir)
    par Computational sensors
        QG->>TC: subprocess npx tsc --noEmit
        TC-->>QG: 0 errors
    and
        QG->>LT: subprocess eslint
        LT-->>QG: 2 warnings
    and
        QG->>TS: subprocess vitest --run
        TS-->>QG: pass
    end
    QG->>QG: score = 100 - (5*2) = 90
    QG->>Run: UPDATE quality_score=90, breakdown={...}
    QG->>An: emit quality_event for trend
```

## Ecosystem integration

### GitHub Enterprise

Quality gate failure can post a PR check status; success can comment with the breakdown.

```mermaid
flowchart LR
    QG[Quality Gates]
    GA[GitHub App]
    PR[Pull request]

    QG -->|score < threshold| GA
    GA -->|POST /check-runs<br/>status: failure| PR
    QG -->|always| GA
    GA -->|POST PR comment<br/>with breakdown| PR
```

### Slack

```mermaid
flowchart LR
    QG[Quality Gates]
    No[Notifier]
    Slack[#dev-quality]

    QG -->|score drop > 10 vs 7-day avg| No
    No --> Slack
```

## Tech specifics

- Each sensor is a subprocess invocation (`execa` / `child_process`) with timeout
- Outputs parsed into structured findings stored in `quality_breakdown` JSON
- Pluggable: project-level config selects which sensors run + their thresholds
- Sensors run in parallel for speed; total wall-clock typically &lt;30s
- Distinct from [Inline Sensors]({{ site.baseurl }}{% link architecture-modules-inline-sensors.md %}) which run *during* the agent's run

## See also

- [Inline Sensors]({{ site.baseurl }}{% link architecture-modules-inline-sensors.md %}) — same sensors but called by the agent mid-run for self-correction
- [Cross-agent Analytics]({{ site.baseurl }}{% link architecture-modules-cross-agent-analytics.md %}) — consumes quality scores for trend lines
- [Use Case Flow 1 — Jira → PR → approval]({{ site.baseurl }}{% link architecture-use-cases.md %}#flow-1-jira-issue--agent-run--pr-with-audit)
