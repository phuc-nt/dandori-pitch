---
layout: default
title: Context Hub
parent: Architecture
nav_order: 3
description: "5-layer versioned context hierarchy assembled into every prompt."
---

# Context Hub

**Pillar:** Knowledge Flow · **Audience:** 🤝 Both

Assemble a 5-layer versioned context hierarchy (Company → Project → Team → Agent → Task) into every agent prompt.

---

## Where it sits

Runs between Task Board and the adapter layer. When a run is triggered, the resolver walks the 5 layers, applies PII filters, and emits a single context block plus a version snapshot recorded on the run.

## Depends on

- **Integration Surface** — Web UI and API for authoring
- **Audit Log** — every edit and every rollback is logged
- **Adapter layer** — consumes the assembled context block

## Workflow

```mermaid
sequenceDiagram
    participant T as Task Board
    participant R as Resolver
    participant DB as Context store
    participant P as PII filter
    participant Run as Run service

    T->>R: assemble(task, agent, team, project, company)
    R->>DB: latest version per layer
    DB-->>R: 5 layer payloads
    R->>P: filter by agent permissions
    P-->>R: filtered layers
    R->>Run: context block + version snapshot
```

## Interfaces

- **Web UI** — per-layer editor, diff view, rollback, PII tagging
- **REST API** — CRUD + version history
- **MCP tool** — `fetch_context` for agents that want targeted lookup
- **Importers** — Confluence, Google Drive, GitHub README (read-only, source-tagged)

## See also

- [Skill Library]({{ site.baseurl }}{% link modules/skill-library.md %})
- [Agent Templates]({{ site.baseurl }}{% link modules/agent-templates.md %})
- [Audit Log]({{ site.baseurl }}{% link modules/audit-log.md %})
