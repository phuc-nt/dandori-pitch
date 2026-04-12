---
layout: default
title: Approval Workflow
nav_exclude: true
search_exclude: true
description: "Human approval gates with audit trail and Slack interactive approvals."
---

# Approval Workflow

**Pillar:** Task Tracking · **Audience:** 🤝 Both

Tasks flagged `needs_approval` stop at In Review until a human approves. Every decision is logged with who, when, and rationale. Rejections re-queue the task with feedback.

---

## Where it sits

Sits between the agent run and the task lifecycle transition. When a task is flagged, the run completes into `IN_REVIEW` instead of `DONE`. Approval decisions move the task forward or back.

## Depends on

- **Task Board** — owns the task state machine
- **Audit Log** — approval decisions are immutable audit entries
- **Integration Surface** — Slack bot for in-channel approvals

## Workflow

```mermaid
sequenceDiagram
    participant Run as Agent run
    participant TB as Task Board
    participant AW as Approval service
    participant Slack as Slack bot
    participant User as Approver

    Run->>TB: run completes
    TB->>AW: is needs_approval?
    AW->>TB: set IN_REVIEW
    AW->>Slack: post approval request
    Slack->>User: interactive buttons
    User->>Slack: approve / reject + note
    Slack->>AW: decision
    AW->>TB: DONE or back to TODO
    AW->>AW: log decision (immutable)
```

## Interfaces

- **Web UI** — review queue, task detail with full context/diff, approve/reject actions
- **Slack** — interactive approval messages with buttons
- **REST API** — list pending, submit decision, query history
- **Compliance export** — all decisions as structured data

## See also

- [Task Board]({{ site.baseurl }}{% link modules/task-board.md %})
- [Audit Log]({{ site.baseurl }}{% link modules/audit-log.md %})
