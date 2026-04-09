---
layout: default
title: Inline Sensors
parent: Modules
grand_parent: Architecture
nav_order: 4
description: "Mid-run sensors agents call as MCP tools for self-correction before finishing."
---

# Inline Sensors

## Purpose

True back-pressure: expose sensors as MCP tools so the agent calls them *during* its run and self-corrects *before* finishing. Two flavors:

- **Computational sensors** — typecheck, lint, tests (deterministic, milliseconds)
- **Inferential sensors** — AI-powered review via secondary LLM (semantic, slower)

The agent reads sensor output mid-run instead of waiting for human review.

## Architecture

```mermaid
flowchart TB
    CC[Coding agent runtime<br/>mid-run]
    Mcp[Dandori MCP Server]
    Comp[Computational sensors<br/>local subprocess]
    Inf[Inferential sensors<br/>secondary LLM]
    Ret[Returned to agent<br/>silent on success<br/>verbose on error]

    CC -->|MCP tool call| Mcp
    Mcp --> Comp
    Mcp --> Inf
    Comp --> Ret
    Inf --> Ret
    Ret -->|tool response| CC
```

## Tools exposed

| Tool | Type | Latency |
|---|---|---|
| `run_typecheck(file_paths[])` | Computational | &lt; 500ms |
| `run_lint(file_paths[])` | Computational | &lt; 500ms |
| `run_tests(scope)` | Computational | seconds |
| `check_security(diff)` | Inferential (LLM) | ~3-5s |
| `check_arch_fitness(file_paths[])` | Inferential (LLM) | ~3-5s |
| `check_schema_match(migration)` | Inferential (LLM) | ~3-5s |

## Sensor chain definition

```yaml
# project: payments-service
sensor_chains:
  default:
    - run_typecheck
    - run_lint
    - run_tests
  migrations:
    - run_typecheck
    - run_tests
    - check_schema_match    # inferential, custom
    - check_security        # inferential, default
```

Stored in DB as `sensor_chains` table; versioned and ownable by Platform team.

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant CC as Claude Code (mid-run)
    participant Mcp as Dandori MCP server
    participant Sub as Subprocess<br/>(tsc, eslint, vitest)
    participant LLM as Secondary LLM<br/>(Haiku / similar)
    participant DB as sensor_results

    CC->>Mcp: run_typecheck(["auth.ts"])
    Mcp->>Sub: spawn npx tsc --noEmit auth.ts
    Sub-->>Mcp: 3 errors
    Mcp->>DB: log result
    Mcp-->>CC: {errors: [...]} (verbose)
    CC->>CC: fix errors, edit file
    CC->>Mcp: run_typecheck(["auth.ts"])
    Mcp->>Sub: spawn npx tsc
    Sub-->>Mcp: ok
    Mcp->>DB: log success
    Mcp-->>CC: silent (success)

    CC->>Mcp: check_security(diff)
    Mcp->>LLM: review prompt
    LLM-->>Mcp: "found PII in log statement at line 42"
    Mcp->>DB: log finding
    Mcp-->>CC: {findings: [...]}
    CC->>CC: scrub PII, finalize
```

## Ecosystem integration

### Claude Code, Codex CLI, GitHub Copilot

All three support MCP tool calls. The same Dandori MCP server exposes inline sensors to all of them.

```mermaid
flowchart LR
    CC[Claude Code]
    CX[Codex CLI]
    Cop[GitHub Copilot]
    Mcp[Dandori MCP server]

    CC -->|MCP| Mcp
    CX -->|MCP| Mcp
    Cop -->|MCP| Mcp
```

### GitHub Enterprise (for inferential sensors)

Inferential sensors that need diff context call GitHub for the PR diff.

```mermaid
flowchart LR
    Inf[Inferential sensor]
    GA[GitHub App]
    GH[Pull request]

    Inf -->|need diff| GA
    GA -->|REST contents API| GH
    GH -->|patch| Inf
```

## Tech specifics

- Computational sensors run in subprocess isolation; output formatter follows HumanLayer pattern: `silent on success, verbose on error with file:line markers`
- Inferential sensors call a smaller/faster model (e.g., Haiku) to keep latency &lt; 5s
- Secondary LLM call cost is attributed to the parent run via [Cost Attribution]({% link architecture-modules-cost-attribution.md %})
- Sensor failures don't fail the run by default; the agent decides what to do with the feedback
- Sensor chains can require specific sensors to pass before run completion (gate mode)

## See also

- [Quality Gates]({% link architecture-modules-quality-gates.md %}) — same sensors, but run *after* the agent finishes
- [MCP Tool Governance]({% link architecture-modules-mcp-tool-governance.md %}) — sensors are Dandori-published MCP tools
- [Use Case Flow 2 — Multi-phase DAG]({% link architecture-use-cases.md %}#flow-2-multi-phase-feature-dag)
