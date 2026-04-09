---
layout: default
title: Audit Log
parent: Modules
grand_parent: Architecture
nav_order: 11
description: "Immutable record of every mutation, with optional hash chain for tamper-evidence."
---

# Audit Log

## Purpose

Immutable record of every state mutation — for compliance evidence, incident replay, and forensic queries. Append-only by design. Optional hash chain (`current.hash = sha256(prev.hash + current.payload)`) gives tamper-evidence in production.

## Architecture

```mermaid
flowchart TB
    Mut[Any service mutates state]
    AM[Audit middleware<br/>intercepts CRUD]
    AE[(audit_events<br/>append-only)]
    Q[Query API:<br/>time / actor / entity / action]
    Exp[Export:<br/>JSON / CSV / SOC 2 PDF]
    HC[Hash chain verifier]

    Mut --> AM
    AM --> AE
    AE --> Q
    AE --> Exp
    AE --> HC
```

## Data model

```sql
CREATE TABLE audit_events (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_type      TEXT NOT NULL,  -- 'user' | 'agent' | 'system'
  actor_id        TEXT NOT NULL,
  entity_type     TEXT NOT NULL,  -- 'task' | 'context_layer' | 'skill' | ...
  entity_id       TEXT NOT NULL,
  action          TEXT NOT NULL,  -- 'create' | 'update' | 'delete' | 'approve' | 'execute'
  before_data     TEXT,           -- JSON snapshot
  after_data      TEXT,           -- JSON snapshot
  metadata        TEXT,           -- JSON
  hash            TEXT,           -- sha256(prev_hash + payload)
  prev_hash       TEXT,
  occurred_at     DATETIME NOT NULL
);

-- enforce append-only via trigger
CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit_events
  BEGIN SELECT RAISE(ABORT, 'audit_events is append-only'); END;
CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit_events
  BEGIN SELECT RAISE(ABORT, 'audit_events is append-only'); END;
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Svc as Any Dandori service
    participant Mid as Audit middleware
    participant AE as audit_events
    participant Hash as Hash chain
    actor Auditor

    Svc->>Mid: mutation: update task T-4812 status REVIEW→DONE
    Mid->>AE: SELECT MAX(id) prev_hash
    AE-->>Mid: latest hash
    Mid->>Hash: compute current hash
    Hash-->>Mid: sha256(prev + payload)
    Mid->>AE: INSERT row
    Note over AE: append-only, triggers prevent UPDATE/DELETE

    Auditor->>AE: query Q1 2026 PII runs
    AE-->>Auditor: matching events
    Auditor->>Hash: verify chain integrity
    Hash->>AE: walk chain
    Hash-->>Auditor: chain valid ✓
```

## What gets audited

- Task mutations (create, update, delete, status changes)
- Context layer edits (every version saved)
- Skill creates / updates / attachments
- Approval decisions
- Hook executions (with output)
- Sensor results
- MCP tool invocations
- Budget threshold events
- User auth events

## Ecosystem integration

### Compliance Export

```mermaid
flowchart LR
    AE[audit_events]
    QE[Query engine]
    Asm[Pack assembler]
    PDF[SOC 2 evidence PDF]

    AE --> QE
    QE --> Asm
    Asm --> PDF
```

Pack includes: filtered events, context snapshots at point-in-time, approval records, hook executions, sub-agent traces, optional Sentinel events. Hash chain replay verifies integrity before delivery.

### S3 / Object storage (production)

```mermaid
flowchart LR
    AE[audit_events table]
    Arch[Archive worker]
    S3[(S3 bucket)]

    AE -->|nightly batch| Arch
    Arch -->|JSON Lines| S3
```

Archives older than N days off DB to keep query latency low.

### External SIEM

Optional: emit events to Splunk / Elastic / Datadog via webhook for org-wide security monitoring.

## Tech specifics

- Append-only enforced at DB layer (triggers in SQLite, RLS in Postgres)
- Hash chain optional but recommended for production
- Retention configurable per project
- Query API supports time range, actor, entity, action filters
- For enterprise scale: partition by month, archive older partitions to S3

## See also

- [Approval Workflow]({% link architecture-modules-approval-workflow.md %}) — every decision audited here
- [Lifecycle Hooks]({% link architecture-modules-lifecycle-hooks.md %}) — every hook execution audited
- [Use Case Flow 6 — Compliance audit pack]({% link architecture-use-cases.md %}#flow-6-compliance-audit-show-me-pii-touching-runs-in-q1)
