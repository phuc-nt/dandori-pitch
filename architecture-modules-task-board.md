---
layout: default
title: Task Board
parent: Modules
grand_parent: Architecture
nav_order: 5
description: "Tasks with phases, dependencies (DAG), auto-wakeup, and skill matching."
---

# Task Board

## Purpose

Coordinate multi-step agent work without engineers playing dispatcher in Slack. Tasks have phase tags, dependencies (DAG), and auto-wake when their parents complete. Skill matcher suggests the best agent for each task based on skill overlap.

## Architecture

```mermaid
flowchart TB
    UI[Task Board UI<br/>kanban + DAG view]
    TS[Task service]
    CRUD[CRUD]
    Resolver[DAG + phase resolver]
    WS[Wakeup scheduler]
    SM[Skill matcher]
    T[(tasks table)]
    TD[(task_dependencies)]

    UI --> TS
    TS --> CRUD
    TS --> Resolver
    TS --> WS
    TS --> SM
    CRUD --> T
    Resolver --> TD
    WS --> T
    SM --> T
```

## Data model

```sql
CREATE TABLE tasks (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL,
  phase           TEXT,           -- research|concept|requirement|design|implement|test|deploy|maintain
  status          TEXT NOT NULL,  -- TODO|IN_PROGRESS|REVIEW|DONE|REJECTED
  needs_approval  BOOLEAN NOT NULL DEFAULT 0,
  agent_id        TEXT,
  skill_tags      TEXT,           -- JSON array
  deadline        DATETIME,
  external_id     TEXT,           -- e.g. JIRA-1234
  created_at      DATETIME NOT NULL
);

CREATE TABLE task_dependencies (
  task_id              TEXT NOT NULL,
  depends_on_task_id   TEXT NOT NULL,
  PRIMARY KEY (task_id, depends_on_task_id)
);
```

Cycles prevented at insert time via topological check.

## Processing flow (auto-wakeup)

```mermaid
sequenceDiagram
    autonumber
    participant T3 as Task T-3
    participant WS as Wakeup scheduler
    participant TD as task_dependencies
    participant T as tasks table
    participant Run as Run service
    participant Adp as Adapter

    T3->>T: status = DONE
    T->>WS: emit task_done event
    WS->>TD: SELECT task_id WHERE depends_on_task_id = T-3
    TD-->>WS: [T-4, T-5]
    loop For each candidate
        WS->>TD: SELECT all parents of candidate
        TD-->>WS: parent task_ids
        WS->>T: SELECT statuses of parents
        T-->>WS: parent statuses
        alt all parents = DONE
            WS->>Run: spawn run for candidate task
            Run->>Adp: dispatch
        else still waiting
            WS->>WS: skip
        end
    end
```

## Phase tags

`research → concept → requirement → design → implement → test → deploy → maintain`

Used for portfolio views: leadership can see "all design-phase tasks across the org" or "implement tasks blocked > 2 days."

## Ecosystem integration

### Jira (bidirectional)

```mermaid
flowchart LR
    Jira[Jira issue]
    DW[Dandori webhook]
    TS[Task service]
    T[(tasks)]

    Jira -->|webhook on issue create| DW
    DW -->|create task<br/>external_id=JIRA-key| TS
    TS --> T
    T -->|status change| TS
    TS -->|REST PUT /issue/key| Jira
```

| Jira | Dandori |
|---|---|
| Issue | Task |
| Issue type | Phase tag (Story → implement, Spike → research) |
| Sprint | Project sub-grouping |
| Assignee | Owner |
| Labels | Skill tags |
| Status | Task status |
| Due date | Task deadline |

### GitHub Enterprise

```mermaid
flowchart LR
    GH[PR with `dandori review` label]
    GA[GitHub App]
    DW[Dandori webhook]
    TS[Task service]

    GH -->|webhook| GA
    GA --> DW
    DW -->|create review task<br/>linked to PR| TS
```

PR labeled `dandori review` creates a Dandori task assigned to ReviewerBot.

### Slack

```mermaid
flowchart LR
    User[User in Slack]
    Cmd[/dandori task create]
    SH[Slash command handler]
    TS[Task service]

    User -->|/dandori task create "..."| Cmd
    Cmd --> SH
    SH --> TS
```

## Tech specifics

- DAG cycle prevention runs at insert time
- Auto-wakeup is event-driven via the `task_done` event bus (in-process)
- Skill matcher uses Jaccard similarity between task `skill_tags` and agent `attached_skills`
- `external_id` indexed for bidirectional Jira/GitHub sync

## See also

- [Approval Workflow]({% link architecture-modules-approval-workflow.md %}) — gates tasks at status REVIEW
- [Skill Library]({% link architecture-modules-skill-library.md %}) — supplies skill metadata for matcher
- [Use Case Flow 2 — Multi-phase DAG]({% link architecture-use-cases.md %}#flow-2-multi-phase-feature-dag)
