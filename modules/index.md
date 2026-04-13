---
layout: default
title: Module Specs
nav_exclude: true
search_exclude: true
description: "Index of all 14 Dandori module specs."
---

# Module Specs

Basic design for each of Dandori's 14 modules. Each page follows the same shape: **where it sits · depends on · workflow · interfaces**. No code, no schemas — just enough to understand the boundary and wire it up.

---

## Pillar 1 — Cost Attribution

- [Cost Attribution]({{ site.baseurl }}{% link modules/cost-attribution.md %})

## Pillar 2 — Multi-layer Knowledge Flow

- [Context Hub]({{ site.baseurl }}{% link modules/context-hub.md %})
- [Skill Library]({{ site.baseurl }}{% link modules/skill-library.md %})
- [Agent Templates]({{ site.baseurl }}{% link modules/agent-templates.md %})

## Pillar 3 — Task Tracking

- [Task Board]({{ site.baseurl }}{% link modules/task-board.md %})
- [Approval Workflow]({{ site.baseurl }}{% link modules/approval-workflow.md %})
- [Lifecycle Hooks]({{ site.baseurl }}{% link modules/lifecycle-hooks.md %})

## Pillar 4 — Quality Gates

- [Quality Gates]({{ site.baseurl }}{% link modules/quality-gates.md %})
- [Inline Sensors]({{ site.baseurl }}{% link modules/inline-sensors.md %})

## Pillar 5 — Audit & Analytics

- [Audit Log]({{ site.baseurl }}{% link modules/audit-log.md %})
- [Cross-agent Analytics]({{ site.baseurl }}{% link modules/cross-agent-analytics.md %})
- [Sub-agent Trace]({{ site.baseurl }}{% link modules/sub-agent-trace.md %})
- [MCP Tool Governance]({{ site.baseurl }}{% link modules/mcp-tool-governance.md %})

## Foundation

- [Integration Surface]({{ site.baseurl }}{% link modules/integration-surface.md %})

---

## Dependency overview

```mermaid
flowchart TB
    IS[Integration Surface]
    AL[Audit Log]
    TB[Task Board]
    AD[Adapter layer]
    CH[Context Hub]
    SL[Skill Library]
    AT[Agent Templates]
    AW[Approval Workflow]
    LH[Lifecycle Hooks]
    QG[Quality Gates]
    IS2[Inline Sensors]
    CA[Cost Attribution]
    ST[Sub-agent Trace]
    CAA[Cross-agent Analytics]
    MCG[MCP Tool Governance]

    IS --> AL
    IS --> TB
    TB --> AD
    AD --> CH
    AD --> SL
    SL --> AT
    CH --> AT
    TB --> AW
    AL --> AW
    AD --> LH
    AL --> LH
    AD --> QG
    AD --> CA
    AD --> ST
    IS --> IS2
    IS --> MCG
    QG --> CAA
    CA --> CAA
```
