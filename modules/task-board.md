---
layout: default
title: Task Board
parent: Architecture
nav_order: 6
description: "Tasks with phases, DAG dependencies, auto-wakeup, skill matching."
---

# Task Board

**Pillar:** Task Tracking · **Audience:** 👷 Engineers

Tasks are the root entity for runs, approvals, cost, and quality. Supports phase tags, DAG dependencies with cycle prevention, auto-wakeup on parent completion, and skill-based agent suggestions.

---

## Where it sits

One of the four foundation modules. Nothing else has data until tasks exist. A task ties together: the context assembled for its run, the agent that ran it, the cost it accrued, and the approval/quality records attached.

## Depends on

- **Integration Surface** — CRUD via UI/API/CLI
- **Audit Log** — every status change + dependency edit is logged
- **Skill Library** — skill tags on tasks drive agent suggestions

## Workflow

```mermaid
stateDiagram-v2
    [*] --> TODO
    TODO --> IN_PROGRESS: agent starts
    IN_PROGRESS --> IN_REVIEW: run completes
    IN_PROGRESS --> TODO: run fails
    IN_REVIEW --> DONE: approved or gates pass
    IN_REVIEW --> TODO: rejected
    DONE --> [*]

    note right of DONE: auto-wakes<br/>dependent tasks
```

```mermaid
flowchart LR
    T1[research] --> T2[design]
    T2 --> T3[implement]
    T3 --> T4[test]
    T4 --> T5[deploy]
    T3 -.->|auto-wake on complete| T4
```

## Interfaces

- **Web UI** — board view, DAG visualizer, phase portfolio, task detail
- **REST API + CLI** — full CRUD, dependency management, status changes
- **Webhook ingress** — Jira issues become tasks automatically
- **MCP tool** — `create_task`, `update_task_status` for agents to manage their own work

## See also

- [Approval Workflow]({{ site.baseurl }}{% link modules/approval-workflow.md %})
- [Lifecycle Hooks]({{ site.baseurl }}{% link modules/lifecycle-hooks.md %})
