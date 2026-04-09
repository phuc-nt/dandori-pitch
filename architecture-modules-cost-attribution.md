---
layout: default
title: Cost Attribution
parent: Modules
grand_parent: Architecture
nav_order: 10
description: "Per-project / team / agent / task / model / phase / sub-agent cost breakdown."
---

# Cost Attribution

## Purpose

Break agent spend down with the granularity leadership actually needs: project, team, agent, task, model, phase, sub-agent. Vendor billing aggregates everything; Dandori enriches each run with metadata at write-time so any breakdown is a SQL query away.

## Architecture

```mermaid
flowchart TB
    Run[Run completes]
    Adp[Adapter records<br/>input_tokens, output_tokens, model]
    MP[(model_prices)]
    View[v_agent_runs view<br/>computes cost_usd]
    Roll[Roll-up engine]
    P[run → task → project]
    A[run → agent → team]
    Ph[per-phase, per-day]

    Run --> Adp
    Adp --> MP
    Adp --> View
    MP --> View
    View --> Roll
    Roll --> P
    Roll --> A
    Roll --> Ph
```

## Data model

```sql
CREATE TABLE model_prices (
  model_name      TEXT PRIMARY KEY,
  input_per_mtok  REAL NOT NULL,   -- $ per million input tokens
  output_per_mtok REAL NOT NULL,
  cache_read_per_mtok  REAL,
  cache_write_per_mtok REAL,
  effective_from  DATETIME NOT NULL
);

CREATE VIEW v_agent_runs AS
SELECT
  r.id, r.task_id, r.agent_id, r.project_id,
  r.input_tokens, r.output_tokens, r.model_name,
  r.started_at, r.ended_at,
  ((r.input_tokens / 1e6) * mp.input_per_mtok)
    + ((r.output_tokens / 1e6) * mp.output_per_mtok) AS cost_usd
FROM runs r
LEFT JOIN model_prices mp ON r.model_name = mp.model_name;
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Run as Run service
    participant Adp as Adapter
    participant SAT as sub_agent_traces
    participant View as v_agent_runs
    participant Roll as Roll-up
    participant Dash as Dashboard

    Run->>Adp: run finished
    Adp->>Run: record tokens + model
    Adp->>SAT: aggregate sub-agent costs
    SAT-->>Adp: sub-agent cost sum
    Adp->>Run: include in run.cost
    Dash->>View: SELECT WHERE month=...
    View-->>Dash: enriched run records
    Dash->>Roll: aggregate by project/team/agent/phase
    Roll-->>Dash: dashboard data
```

## Budget ceilings & spike alerts

```mermaid
flowchart LR
    R[Each run completes]
    BC[Budget checker]
    BL[(budget_limits)]
    HE[Hooks engine]
    Slack[#alerts]

    R --> BC
    BC --> BL
    BL -->|over threshold| HE
    HE -->|on_budget_exceeded| Slack
```

`budget_limits` table per agent / project / team. Soft alerts and hard stops configurable.

## Ecosystem integration

### GenAI Gateway (if AIPF deployed)

```mermaid
flowchart LR
    GW[AIPF GenAI Gateway<br/>raw billing events]
    Sub[Dandori subscriber]
    En[Enricher<br/>add metadata]
    R[(runs.cost)]

    GW -->|webhook /<br/>event stream| Sub
    Sub --> En
    En --> R
```

Dandori subscribes to billing events, enriches with agent/task/project context, stores in run records.

### Slack

```mermaid
flowchart LR
    BC[Budget checker]
    No[Notifier]
    Slack[#finance-alerts]

    BC -->|budget exceeded| No
    BC -->|spike: 3x average| No
    No --> Slack
```

### Email

Monthly cost summary email to finance team — generated from `v_agent_runs` aggregations.

## Tech specifics

- `model_prices` is configurable; easy to update when providers change pricing
- `v_agent_runs` is a view (not materialized) — fine for team scale; promote to materialized view for enterprise scale
- Roll-up engine queries are scoped via SQL `GROUP BY` chains — no separate aggregation pipeline
- Sub-agent costs roll up via [Sub-agent Trace]({% link architecture-modules-sub-agent-trace.md %}) parent_run_id

## See also

- [Cross-agent Analytics]({% link architecture-modules-cross-agent-analytics.md %}) — uses cost data for cost-per-quality ratios
- [Lifecycle Hooks]({% link architecture-modules-lifecycle-hooks.md %}) — fires `on_budget_exceeded`
- [Use Case Flow 5 — Cost review]({% link architecture-use-cases.md %}#flow-5-leadership-monthly-cost-review)
