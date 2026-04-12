---
layout: default
title: Lifecycle Hooks
parent: Modules
grand_parent: Architecture
nav_order: 7
description: "Pluggable scripts at lifecycle events: before_context_assembly, before_run, after_run, on_error, etc."
---

# Lifecycle Hooks

## Purpose

Engineer-pluggable scripts at run lifecycle events. Versioned, sandboxed, org-shareable. Lets a team push policies like "all payments-service runs must log a PII check" without modifying Dandori core. Hooks become a shared organizational asset, not laptop-local bash.

## Architecture

```mermaid
flowchart TB
    Events[Run lifecycle events]
    BC[before_context_assembly]
    BR[before_run]
    AR[after_run]
    OE[on_error]
    OA[on_approval_request]
    OB[on_budget_exceeded]
    Reg[Hook registry lookup]
    H[(hooks table)]
    Sand[Sandboxed exec<br/>subprocess<br/>30s timeout]
    RV[Return value handling<br/>mutate / veto / log]

    Events --> BC
    Events --> BR
    Events --> AR
    Events --> OE
    Events --> OA
    Events --> OB
    BC --> Reg
    BR --> Reg
    AR --> Reg
    OE --> Reg
    OA --> Reg
    OB --> Reg
    Reg --> H
    H --> Sand
    Sand --> RV
```

## Data model

```sql
CREATE TABLE hooks (
  id              TEXT PRIMARY KEY,
  project_id      TEXT,           -- NULL = org-wide
  event           TEXT NOT NULL,  -- before_run, after_run, etc.
  script_path     TEXT NOT NULL,
  enabled         BOOLEAN NOT NULL DEFAULT 1,
  owner_id        TEXT NOT NULL,
  version         INTEGER NOT NULL,
  created_at      DATETIME NOT NULL
);

CREATE TABLE hook_executions (
  id              TEXT PRIMARY KEY,
  hook_id         TEXT NOT NULL,
  run_id          TEXT NOT NULL,
  event           TEXT NOT NULL,
  exit_code       INTEGER,
  duration_ms     INTEGER,
  output          TEXT,           -- stdout JSON
  error           TEXT,
  executed_at     DATETIME NOT NULL
);
```

## Processing flow

```mermaid
sequenceDiagram
    autonumber
    participant Adp as Adapter
    participant HE as Hooks engine
    participant H as hooks table
    participant Proc as Sandboxed subprocess
    participant Audit as Audit log

    Adp->>HE: fire('before_run', payload)
    HE->>H: SELECT enabled hooks WHERE event='before_run'<br/>AND (project_id=? OR project_id IS NULL)
    H-->>HE: matching hook rows
    loop For each hook (sorted by org-wide first)
        HE->>Proc: spawn script_path<br/>stdin: payload JSON<br/>timeout: 30s
        Proc-->>HE: stdout JSON<br/>{action: allow|veto|mutate, ...}
        HE->>Audit: log hook_execution
        alt action = veto
            HE->>Adp: abort run with reason
        else action = mutate
            HE->>HE: apply mutation to payload
        else action = allow
            HE->>HE: continue chain
        end
    end
    HE-->>Adp: final payload (or abort)
```

## Example hook

```bash
#!/usr/bin/env bash
# hook: before_run
# fires before runtime is invoked
# input via stdin: {run_id, agent_id, prompt, context_versions}
# output via stdout: {action: "allow"|"veto", reason?: string}

PROMPT=$(jq -r '.prompt' <&0)

if echo "$PROMPT" | grep -q "DROP TABLE"; then
  echo '{"action":"veto","reason":"forbidden SQL pattern"}'
  exit 0
fi

echo '{"action":"allow"}'
```

## Hook events

| Event | Fires when | Can mutate | Can veto |
|---|---|---|---|
| `before_context_assembly` | After task picked, before context resolver runs | context filters | ✗ |
| `before_run` | After context + skills assembled, before runtime spawn | prompt, args | ✓ |
| `after_run` | After runtime exits, before quality gates | output annotations | ✗ |
| `on_error` | Any unhandled error during run | — | retry / escalate |
| `on_approval_request` | Task enters REVIEW status | notification routing | ✗ |
| `on_budget_exceeded` | Project / agent budget threshold crossed | — | throttle |

## Ecosystem integration

### Slack

```mermaid
flowchart LR
    HE[Hook execution]
    Failed[Hook failed or vetoed]
    No[Notifier]
    Slack[#alerts]

    HE --> Failed
    Failed --> No
    No --> Slack
```

### GitHub Enterprise

A `before_run` hook can call GitHub API to verify "PR has at least 1 reviewer assigned" before letting an agent finish.

### Custom

Hooks can call any HTTP API your team uses (PagerDuty, Datadog, internal compliance API). The hook pattern is intentionally generic.

## Tech specifics

- Hooks run as sandboxed subprocesses (`execa` with cwd, env allowlist, timeout)
- Hook scripts can be bash, python, node, or any executable
- Org-wide hooks (project_id=NULL) run before project-specific hooks
- Future: containerized execution for stronger isolation
- Hook versioning + diff + rollback follow the same pattern as context layers and skills

## See also

- [Approval Workflow]({{ site.baseurl }}{% link architecture-modules-approval-workflow.md %}) — uses `on_approval_request` hook for custom routing
- [Audit Log]({{ site.baseurl }}{% link architecture-modules-audit-log.md %}) — every hook execution logged
- [Cost Attribution]({{ site.baseurl }}{% link architecture-modules-cost-attribution.md %}) — `on_budget_exceeded` fires from this module
