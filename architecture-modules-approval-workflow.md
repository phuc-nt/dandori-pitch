---
layout: default
title: Approval Workflow
parent: Modules
grand_parent: Architecture
nav_order: 6
description: "Human review gates with audit trail and Slack interactive approvals."
---

# Approval Workflow

## Purpose

Insert human review gates into agent execution. Tasks flagged `needs_approval=true` stop at status REVIEW until a human approves. Every approval (and rejection) is logged with who, when, and why. Reviewers see full prompt, context versions, diff, quality results, and self-explanation in one view.

## Architecture

```mermaid
flowchart TB
    Run[Run completes<br/>task.needs_approval=true]
    Status[task.status = REVIEW]
    Fan[Notification fan-out]
    Slack[Slack interactive]
    Email[Email digest]
    Inbox[In-app inbox]
    Rev[Reviewer opens task]
    View[Sees: prompt + context versions + diff + quality + self-explanation]
    Decide{Approve or Reject}
    Done[task.status = DONE]
    Todo[task.status = TODO + rejection reason]
    Audit[(audit_events)]

    Run --> Status
    Status --> Fan
    Fan --> Slack
    Fan --> Email
    Fan --> Inbox
    Slack --> Rev
    Email --> Rev
    Inbox --> Rev
    Rev --> View
    View --> Decide
    Decide -->|approve| Done
    Decide -->|reject| Todo
    Done --> Audit
    Todo --> Audit
```

## Data model

```sql
CREATE TABLE approvals (
  id              TEXT PRIMARY KEY,
  task_id         TEXT NOT NULL,
  run_id          TEXT NOT NULL,
  decision        TEXT NOT NULL,  -- 'approved' | 'rejected'
  decided_by      TEXT NOT NULL,
  decided_at      DATETIME NOT NULL,
  rationale       TEXT,
  rejection_reason TEXT
);
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Run as Run service
    participant App as Approval Workflow
    participant Slack
    actor Rev as Reviewer
    participant API as Dandori API
    participant Audit as Audit log

    Run->>App: status = REVIEW
    App->>Slack: post Block Kit message<br/>[View] [Approve] [Reject]
    Slack->>Rev: see in #channel or DM
    Rev->>Slack: click [Approve]
    Slack->>API: interaction payload
    API->>App: approve(task_id, user)
    App->>App: status = DONE
    App->>Audit: record approval<br/>actor, time, rationale
    API->>Slack: update message<br/>"Approved by Alice ✓"
```

## Slack interactive message

Block Kit composition:

```
┌───────────────────────────────────┐
│ 🤖 Task T-4812 needs review       │
│ payments-service / Add stripe...  │
│ Cost $0.42  Quality 87  Trace 11  │
│                                   │
│ [ View ] [ Approve ] [ Reject ]   │
└───────────────────────────────────┘
```

## Ecosystem integration

### Slack (interactive — bidirectional)

```mermaid
flowchart LR
    App[Approval Workflow]
    Bot[Slack bot]
    Ch[#payments channel]
    User[Reviewer]
    DW[Dandori webhook]

    App -->|Block Kit POST| Bot
    Bot --> Ch
    User -->|click button| Bot
    Bot -->|signed payload| DW
    DW --> App
```

**Auth:** Slack Bot token + signing secret. Inbound interactions verified via HMAC.

### Email

Optional — uses SMTP / SES for notifications when Slack is down or for non-Slack users. One-click approve link with signed token.

### GitHub Enterprise

```mermaid
flowchart LR
    App[Approval Workflow]
    GA[GitHub App]
    PR[PR status check]

    App -->|status REVIEW| GA
    GA -->|POST /check-runs<br/>status: pending| PR
    App -->|approved| GA
    GA -->|status: success| PR
    App -->|rejected| GA
    GA -->|status: failure| PR
```

## Tech specifics

- Approvals are immutable; a rejected task can be re-submitted but creates a new approval row
- Multi-approver flow (e.g., requires 2 of 3 reviewers) is config per project
- Time-out: tasks in REVIEW > N days emit a stale-approval alert
- Approval history exportable in compliance pack (see [Audit Log]({% link architecture-modules-audit-log.md %}))

## See also

- [Task Board]({% link architecture-modules-task-board.md %}) — owns the status field this module flips
- [Audit Log]({% link architecture-modules-audit-log.md %}) — every decision recorded
- [Use Case Flow 1 — Jira → PR → approval]({% link architecture-use-cases.md %}#flow-1-jira-issue--agent-run--pr-with-audit)
