---
layout: default
title: Cross-agent Analytics
nav_order: 12
nav_exclude: true
search_exclude: true
description: "Compare agents across teams, detect drift, support evaluations."
---

# Cross-agent Analytics

## Purpose

Vendor dashboards show aggregate tokens. Leadership needs to ask "which agent is most cost-effective?" or "is Team B's quality drifting?" — these queries are impossible without per-agent metadata. Dandori already records that metadata; this module exposes it as dashboards and trend lines.

## Architecture

```mermaid
flowchart TB
    Runs[(runs table +<br/>v_agent_runs view)]
    Agg[Aggregation queries]
    A[per agent / week:<br/>runs, success rate, quality, cost]
    T[Trend deltas]
    C[Cohort comparison]
    Dash[Dashboard]
    Tab[Cross-agent table]
    Trend[Trend lines]
    Drill[Per-agent drill-down]

    Runs --> Agg
    Agg --> A
    Agg --> T
    Agg --> C
    A --> Dash
    T --> Dash
    C --> Dash
    Dash --> Tab
    Dash --> Trend
    Dash --> Drill
```

## Data model

Reads from existing `runs` table + `v_agent_runs` view. No new tables — just SQL views and aggregations.

```sql
CREATE VIEW v_agent_weekly AS
SELECT
  agent_id,
  strftime('%Y-W%W', started_at) AS week,
  COUNT(*)                       AS run_count,
  AVG(quality_score)             AS avg_quality,
  SUM(cost_usd)                  AS total_cost,
  AVG(CASE WHEN exit_code=0 THEN 1.0 ELSE 0.0 END) AS success_rate
FROM v_agent_runs
GROUP BY agent_id, week;
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    actor VPE as VP Engineering
    participant Dash as Dashboard
    participant View as v_agent_weekly
    participant Drift as Drift detector
    participant Drill as Drill-down query
    participant Run as runs table

    VPE->>Dash: open Q1 quality view
    Dash->>View: SELECT cohort comparison
    View-->>Dash: per-team agent metrics
    Dash->>Drift: detect deltas vs prior period
    Drift-->>Dash: flagged agents
    Dash-->>VPE: render table + trend lines

    VPE->>Dash: drill into RefactorBot
    Dash->>Drill: per-run breakdown
    Drill->>Run: SELECT runs WHERE agent_id=...
    Run-->>Drill: rows
    Drill-->>Dash: failed runs, low scores
    Dash-->>VPE: root cause hint
```

## Sample dashboard query

```sql
-- Top 10 agents by cost / quality ratio
SELECT
  agent_id,
  SUM(cost_usd) AS spend,
  AVG(quality_score) AS quality,
  SUM(cost_usd) / NULLIF(AVG(quality_score), 0) AS dollars_per_quality
FROM v_agent_runs
WHERE started_at > date('now', '-30 days')
GROUP BY agent_id
ORDER BY dollars_per_quality DESC
LIMIT 10;
```

## Use cases

- **Cost-per-quality ratio** ranking
- **Quality drift** detection (vs prior 7-day average)
- **Cohort comparison** (Team A vs Team B agents on same task type)
- **Phase breakdown** (which phase burns most for an agent)
- **Top-cost tasks** (where is spend going)

## Ecosystem integration

### Slack

```mermaid
flowchart LR
    Drift[Drift detector]
    No[Notifier]
    Slack[#eng-quality]

    Drift -->|weekly drift > 10%| No
    No --> Slack
```

Weekly digest of drifted agents posted to `#eng-quality`.

### Email

Monthly executive summary auto-generated.

### Datadog / Grafana (roadmap)

Optional: export aggregations as Prometheus metrics for unified org dashboarding.

## Tech specifics

- All metrics computed via SQL views, no aggregation pipeline
- For team scale: views run in &lt;1s on SQLite
- For enterprise scale: materialized views or read replica with hourly refresh
- Drift detection is a simple delta comparison; ML-based anomaly detection deferred to a Python sidecar (see Node.js vs Python tradeoff)

## See also

- [Quality Gates]({{ site.baseurl }}{% link modules/architecture-modules-quality-gates.md %}) — produces quality scores consumed here
- [Cost Attribution]({{ site.baseurl }}{% link modules/architecture-modules-cost-attribution.md %}) — produces cost data consumed here
- [Use Case Flow 5 — Cost review]({{ site.baseurl }}{% link modules/architecture-use-cases.md %}#flow-5-leadership-monthly-cost-review)
