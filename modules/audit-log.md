---
layout: default
title: Audit Log
nav_exclude: true
search_exclude: true
description: "Append-only immutable log of every mutation with optional hash chain."
---

# Audit Log

**Pillar:** Audit & Analytics · **Audience:** 🧭 Leadership

Every mutation in Dandori flows through a middleware that writes an immutable record: actor, timestamp, entity, before/after. Append-only at the database level. Optional hash chain for tamper-evidence.

---

## Where it sits

Foundation module. Every write path (REST API, CLI, MCP, webhook ingress) passes through audit middleware before committing. A run's lifecycle (context inject → hook → adapter → gate → approval) also emits audit events.

## Depends on

- **Integration Surface** — the middleware hooks into every write endpoint

## Workflow

```mermaid
flowchart TB
    Write[Any mutation request] --> MW[Audit middleware]
    MW --> Capture[Capture actor, entity,<br/>before/after, timestamp]
    Capture --> Hash[Compute hash<br/>prev_hash + payload]
    Hash --> Append[Append to log<br/>UPDATE/DELETE blocked]
    Append --> Commit[Commit original write]
    Commit --> Done[Return]
```

## Interfaces

- **REST API** — query by actor, entity, date range, action type
- **Compliance export** — JSON / CSV / SOC 2 format, one-click
- **Retention policy** — hot 365d default + cold archive, configurable per project
- **Verification** — recompute hash chain to detect tampering

## See also

- [Cross-agent Analytics]({{ site.baseurl }}{% link modules/cross-agent-analytics.md %})
- [Sub-agent Trace]({{ site.baseurl }}{% link modules/sub-agent-trace.md %})
