---
layout: default
title: Quality Gates
parent: Architecture
nav_order: 9
description: "Post-run independent quality pipeline with trend analytics."
---

# Quality Gates

**Pillar:** Quality Gates · **Audience:** 🤝 Both

Run a pipeline of independent checks on every agent output: typecheck, lint, security scan, coverage. Produces a quality score per run. Trend analytics per agent, team, phase, and time window.

**Why independent:** Separation of Duties. Inner Harness TDD loop runs *inside* the agent — the agent can skip tests to finish faster. Outer gates run *after*, outside the agent's control.

---

## Where it sits

Sits between the agent run and downstream consumers (approval queue, analytics). A run's output is not considered "done" until gates complete.

## Depends on

- **Adapter layer** — runs expose their output artifacts
- **Lifecycle Hooks** — `after_run` invokes the gate pipeline
- **Audit Log** — every gate result is an audit event

## Workflow

```mermaid
flowchart TB
    Run[Agent run output] --> G1[TypeCheck]
    G1 --> G2[Lint]
    G2 --> G3[Security scan]
    G3 --> G4[Coverage check]
    G4 --> Score[Compute quality score]
    Score -->|below threshold| Reject[Reject + re-queue]
    Score -->|above threshold| Forward[Forward to approval / done]
    Score --> Log[Log to analytics]
```

## Interfaces

- **Web UI** — per-run gate results, per-team/per-agent trend charts
- **REST API** — gate config, query results, export trends
- **Gate registry** — org-wide and per-project pipelines
- **Score rule** — configurable thresholds per project

## See also

- [Inline Sensors]({{ site.baseurl }}{% link modules/inline-sensors.md %})
- [Cross-agent Analytics]({{ site.baseurl }}{% link modules/cross-agent-analytics.md %})
