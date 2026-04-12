---
layout: default
title: Cost Attribution
nav_exclude: true
search_exclude: true
description: "Per-run cost logging + breakdown + budget ceilings."
---

# Cost Attribution

**Pillar:** Cost Attribution · **Audience:** 🧭 Leadership

Log every run's cost with full metadata, break it down by any dimension, enforce budget ceilings, alert on spikes.

---

## Where it sits

Sits immediately after the adapter layer. Every completed run emits a cost event with token counts and metadata. Cost Attribution stores, aggregates, and exposes these for dashboards, alerts, and hard stops.

## Depends on

- **Adapter layer** — runs emit cost events on completion
- **Task Board** — supplies task/project/team metadata for attribution
- **Audit Log** — cost events are also written to the audit stream

## Workflow

```mermaid
flowchart LR
    Run[Run completes] --> Event[Cost event<br/>tokens + $ + metadata]
    Event --> Agg[Aggregator]
    Event --> Budget[Budget checker]
    Agg --> Dash[Dashboards<br/>project/team/agent/model]
    Budget -->|under limit| OK[Continue]
    Budget -->|over limit| Stop[Hard stop +<br/>alert]
    Agg --> Spike[Spike detector]
    Spike -->|N× baseline| Alert[Alert channel]
```

## Interfaces

- **Web UI** — dashboards with drilldowns (project → team → agent → run)
- **REST API** — query, export CSV/JSON
- **Budget config** — per-agent, per-project ceilings with soft/hard thresholds
- **Alert sinks** — Slack, webhook

## See also

- [Cross-agent Analytics]({{ site.baseurl }}{% link modules/cross-agent-analytics.md %})
- [Audit Log]({{ site.baseurl }}{% link modules/audit-log.md %})
