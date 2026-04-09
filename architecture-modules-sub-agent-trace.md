---
layout: default
title: Sub-agent Trace
parent: Modules
grand_parent: Architecture
nav_order: 8
description: "Observe (not spawn) sub-agents inside runtime runs for audit, debug, and cost roll-up."
---

# Sub-agent Trace

## Purpose

Modern coding agent runtimes (Claude Code sub-agents, LangGraph) do intra-run multi-agent work. Without observability, Dandori is blind to it — only sees the top-level run. This module **observes** sub-agent activity via adapter protocol extension, persists traces, and rolls up cost. **Dandori does not spawn sub-agents** — runtimes do (inner harness).

## Architecture

```mermaid
flowchart TB
    Adp[Adapter spawns runtime]
    RT[Runtime emits structured events<br/>via stdout JSON or websocket]
    EC[Adapter event consumer<br/>parses sub-agent_start /<br/>sub-agent_end events]
    SAT[(sub_agent_traces)]
    Roll[Cost roll-up<br/>sub-agent → run → task → project]

    Adp --> RT
    RT --> EC
    EC --> SAT
    SAT --> Roll
```

## Data model

```sql
CREATE TABLE sub_agent_traces (
  id              TEXT PRIMARY KEY,
  parent_run_id   TEXT NOT NULL,
  parent_trace_id TEXT,           -- for nested sub-agents
  name            TEXT NOT NULL,
  started_at      DATETIME NOT NULL,
  ended_at        DATETIME,
  input_tokens    INTEGER,
  output_tokens   INTEGER,
  cost_usd        REAL,
  output_summary  TEXT,
  tool_calls      TEXT,           -- JSON array
  exit_code       INTEGER
);
CREATE INDEX idx_sat_parent ON sub_agent_traces(parent_run_id);
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Adp as Adapter
    participant CC as Claude Code
    participant SA as SchemaResearcher (sub)
    participant TW as TypeWriter (sub)
    participant EC as Event consumer
    participant SAT as sub_agent_traces

    Adp->>CC: spawn with --json-output
    CC->>SA: spawn sub-agent (runtime feature)
    CC-->>EC: {event: sub_agent_start, name: SchemaResearcher, parent_run: R-9201}
    EC->>SAT: INSERT row
    SA-->>CC: result
    CC-->>EC: {event: sub_agent_end, name: SchemaResearcher, tokens: 142, duration: 0.8s}
    EC->>SAT: UPDATE row

    CC->>TW: spawn next sub-agent
    CC-->>EC: {event: sub_agent_start, name: TypeWriter}
    EC->>SAT: INSERT row
    TW-->>CC: result
    CC-->>EC: {event: sub_agent_end, name: TypeWriter, tokens: 380}
    EC->>SAT: UPDATE row

    CC-->>Adp: run complete
    Adp->>SAT: SELECT all traces for run
    SAT-->>Adp: tree
    Adp->>Adp: roll up cost: $0.08 → run.cost
```

## UI: expandable run view

```
Run R-9201 (task: implement-payment-webhook)
├── parent agent: PaymentImplementor
│     ├── sub-agent: SchemaResearcher (142 tokens, 0.8s)
│     │     └── tool calls: grep, read
│     ├── sub-agent: TypeWriter (380 tokens, 1.2s)
│     │     └── tool calls: write, run_typecheck
│     └── sub-agent: TestWriter (512 tokens, 2.1s)
│           └── tool calls: write, run_tests
│
└── total: 1,034 tokens, 4.1s, quality 87, cost $0.08
```

## Ecosystem integration

### Claude Code

Supported via `--json-output` mode. Adapter parses streamed JSON events from stdout.

```mermaid
flowchart LR
    Adp[Claude Code adapter]
    CC[claude-code --json-output]
    EC[Event consumer]
    SAT[(sub_agent_traces)]

    Adp -->|spawn| CC
    CC -->|stdout JSON lines| EC
    EC --> SAT
```

### Codex CLI

Same protocol via `codex run --json-output` (in roadmap; protocol negotiation in progress).

### GitHub Copilot

N/A — Copilot runs in IDE, doesn't emit structured sub-agent events.

## Tech specifics

- Adapter protocol extension defines JSON event schema
- Trace tree is reconstructed via `parent_trace_id` for arbitrary nesting depth
- Sub-agent costs roll up to parent run via [Cost Attribution]({% link architecture-modules-cost-attribution.md %})
- Policies enforceable: "sub-agents cannot exceed depth N", "sub-agent X cannot call tool Y" — enforced at adapter level
- Future: align JSON schema with OpenTelemetry GenAI spec when stable

## See also

- [Cost Attribution]({% link architecture-modules-cost-attribution.md %}) — sub-agent costs roll up here
- [Audit Log]({% link architecture-modules-audit-log.md %}) — sub-agent traces are queryable for compliance
- [Use Case Flow 6 — Compliance audit pack]({% link architecture-use-cases.md %}#flow-6-compliance-audit-show-me-pii-touching-runs-in-q1)
