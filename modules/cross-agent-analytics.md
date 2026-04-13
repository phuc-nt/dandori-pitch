---
layout: default
title: Cross-agent Analytics
parent: Architecture
nav_order: 12
description: "Agent and team KPI comparison, trend detection, model evaluation."
---

# Cross-agent Analytics

**Pillar:** Audit & Analytics · **Audience:** 🧭 Leadership

Per-agent, per-team, and per-model KPIs: success rate, quality score, cost per run, duration, phase breakdown. Trend detection (improving vs degrading). Controlled experiments for model eval.

---

## Where it sits

Consumer of the data the other pillars produce. Doesn't write — reads from run records, cost events, gate results, audit log. Runs aggregation jobs on a schedule.

## Depends on

- **Cost Attribution** — cost per run + attribution metadata
- **Quality Gates** — quality score per run
- **Adapter layer** — run duration, success/failure
- **Audit Log** — aggregate query source

## Workflow

```mermaid
flowchart LR
    Runs[Run records] --> Agg[Aggregation job]
    Gates[Gate results] --> Agg
    Costs[Cost events] --> Agg
    Agg --> Store[Analytics store]
    Store --> Dash[Dashboards]
    Store --> Trend[Trend detector]
    Trend -->|drift alert| Notify[Leadership notification]
```

## Interfaces

- **Web UI** — agent comparison table, trend charts, phase breakdowns
- **REST API** — query KPIs, export
- **Scheduled jobs** — rebuild aggregates nightly
- **Eval mode** — route matched tasks to multiple agents for comparison

## See also

- [Quality Gates]({{ site.baseurl }}{% link modules/quality-gates.md %})
- [Cost Attribution]({{ site.baseurl }}{% link modules/cost-attribution.md %})
