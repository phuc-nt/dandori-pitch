---
layout: default
title: Use Case Flows
nav_order: 3
nav_exclude: true
search_exclude: true
description: "End-to-end processing flows for the 6 most common Dandori scenarios in a team-pilot ecosystem."
---

# Use Case Flows

End-to-end processing flows for the most common scenarios when a team pilots Dandori with their existing tools (Claude Code, Codex, Copilot, Jira, Confluence, GitHub Enterprise, Google Drive, Slack).

Each flow is rendered as a Mermaid sequence diagram or flowchart showing the modules and integrations involved.

---

## Flow 1: Jira issue → agent run → PR with audit

**Scenario:** PM creates a Jira issue. Dandori picks it up automatically, an agent implements it, opens a PR, posts a self-explanation comment, and waits for human approval.

```mermaid
sequenceDiagram
    autonumber
    actor PM
    participant Jira
    participant DW as Dandori<br/>(webhook)
    participant Task as Task service
    participant Skill as Skill matcher
    participant Ctx as Context Hub
    participant Hook as Hooks engine
    participant Adp as Claude Code adapter
    participant CC as Claude Code (runtime)
    participant Mcp as Dandori MCP server
    participant QG as Quality Gates
    participant GH as GitHub Enterprise
    participant Slack
    actor Reviewer
    participant Audit as Audit log

    PM->>Jira: Create issue<br/>"Add Stripe webhook"<br/>labels: backend, payments, skill:webhook
    Jira-->>DW: webhook event
    DW->>Task: create task<br/>phase=design
    Task->>Skill: find best agent by skill overlap
    Skill-->>Task: PaymentImpl agent
    Task->>Ctx: assemble 5-layer context
    Ctx-->>Task: company v12 + project v3 + team v7 + agent v4 + task spec
    Task->>Hook: fire before_run
    Hook-->>Task: allow (no SQL/secret violations)
    Task->>Adp: dispatch run
    Adp->>CC: spawn subprocess<br/>+ context + skill manifests
    CC->>Mcp: fetch_skill("webhook-impl")
    Mcp-->>CC: full skill content
    CC->>Mcp: run_typecheck(...)
    Mcp-->>CC: silent (pass)
    CC->>Mcp: run_tests(...)
    Mcp-->>CC: silent (pass)
    CC-->>Adp: code + git push branch
    Adp->>Hook: fire after_run
    Adp->>QG: run gates
    QG-->>Adp: score 87
    Adp->>GH: open PR via GitHub App
    Adp->>GH: POST PR comment<br/>(self-explanation + cost + trace)
    Adp->>GH: POST status check: pending
    Adp->>Task: status = REVIEW
    Task->>Slack: notify with [Approve][Reject]
    Task->>Audit: record full run
    Slack->>Reviewer: see message in #payments
    Reviewer->>Slack: click Approve
    Slack-->>DW: interaction payload
    DW->>Task: status = DONE
    Task->>GH: status check = success
    Task->>Jira: issue → Done
    Task->>Audit: record approval
```

**Modules touched:** Task Board, Skill Library (matching), Context Hub, Hooks, Claude Code adapter, Inline Sensors, Quality Gates, Approval Workflow, Audit Log, Cost Attribution

**Integrations:** Jira (in), GitHub Enterprise (out), Slack (out + in)

**Outcome:** Issue → PR → human approval → merge — all traceable, costed, audited.

---

## Flow 2: Multi-phase feature DAG

**Scenario:** Tech lead breaks a feature into a 5-task DAG covering research → design → implement → test → deploy. Each phase auto-wakes when its dependency completes.

### DAG topology

```mermaid
flowchart TD
    T1["T-1 research-stripe-spec<br/>phase: research<br/>runtime: Claude Code"]
    T2["T-2 design-db-schema<br/>phase: design<br/>runtime: Claude Code"]
    T3["T-3 implement-handler<br/>phase: implement<br/>runtime: Claude Code<br/>needs_approval ✓"]
    T4["T-4 write-integration-tests<br/>phase: test<br/>runtime: Codex CLI"]
    T5["T-5 deploy-to-staging<br/>phase: deploy<br/>needs_approval ✓"]

    T1 --> T2
    T2 --> T3
    T3 --> T4
    T4 --> T5

    style T3 fill:#fff3cd,stroke:#cc3333
    style T5 fill:#fff3cd,stroke:#cc3333
```

### Sequence with auto-wakeup and approvals

```mermaid
sequenceDiagram
    autonumber
    actor Lead as Tech Lead
    participant TB as Task Board
    participant WS as Wakeup scheduler
    participant Ctx as Context Hub
    participant Adp as Adapter layer
    participant CC as Claude Code
    participant CX as Codex CLI
    participant Sen as Inline Sensors
    participant App as Approval Workflow
    participant Slack
    actor Rev as Reviewer
    participant GH as GitHub Enterprise
    participant Cost as Cost Attribution

    Lead->>TB: build 5-task DAG with dependencies + phase tags

    Note over TB,WS: T-1 research starts immediately
    WS->>Ctx: assemble context for T-1
    Ctx->>Adp: prompt
    Adp->>CC: spawn (research agent)
    CC-->>Adp: research summary doc
    Adp->>Cost: $0.31, quality 92
    Adp->>WS: T-1 complete

    WS->>WS: scan dependencies — T-2 ready
    WS->>Ctx: assemble for T-2 (inherits T-1 output)
    Ctx->>Adp: prompt + T-1 context
    Adp->>CC: spawn (design agent)
    CC-->>Adp: schema migration file
    Adp->>WS: T-2 complete ($0.18, quality 88)

    WS->>WS: T-3 ready
    WS->>Ctx: assemble for T-3 (inherits T-1 + T-2)
    Ctx->>Adp: prompt
    Adp->>CC: spawn (implement agent)
    CC->>Sen: typecheck, lint, security scan
    Sen-->>CC: pass
    CC-->>Adp: code on branch ($0.84, quality 87)
    Adp->>App: status = REVIEW (needs_approval)
    App->>Slack: notify #payments
    Slack->>Rev: see request
    Rev->>Slack: Approve
    Slack-->>App: approved
    App->>WS: T-3 done

    WS->>WS: T-4 ready
    WS->>Ctx: assemble for T-4
    Ctx->>Adp: prompt
    Adp->>CX: spawn (test agent)
    CX-->>Adp: integration test suite ($0.41, quality 91)
    Adp->>WS: T-4 complete

    WS->>WS: T-5 ready
    WS->>Ctx: assemble for T-5
    Ctx->>Adp: prompt
    Adp->>Sen: pre-deploy security check
    Sen-->>Adp: pass
    Adp->>App: status = REVIEW (deploy gate)
    App->>Slack: DM ops engineer
    Slack->>Rev: deploy gate
    Rev->>Slack: Approve
    Slack-->>App: approved
    App->>GH: trigger Action via webhook

    Cost->>Cost: roll up: total $1.74<br/>5 runs, 11 sub-agents,<br/>2 approvals, 0 rejections
```

**Modules touched:** Task Board (DAG), Context Hub (inheritance + task chain), Skill Library, Inline Sensors (sensor chain), Approval Workflow, Sub-agent Trace, Cost Attribution (roll-up), Audit Log

**Integrations:** Confluence (in), Claude Code, Codex CLI, Slack (notify + approve), GitHub Enterprise (deploy webhook)

**Outcome:** Feature shipped end-to-end with no manual handoffs between phases.

---

## Flow 3: Engineer publishes a team skill

**Scenario:** Senior engineer turns a proven prompt pattern into a versioned skill that all team agents inherit.

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Senior Eng (Alice)
    participant UI as Dandori Web UI
    participant SL as Skill Library
    participant DB as skills table
    participant AS as agent_skills table
    participant Audit as Audit log
    participant Slack
    actor Team as Team channel

    Alice->>UI: Create skill<br/>name: go-microservice-review<br/>triggers: [go, microservice, review]
    Alice->>UI: Paste content (markdown checklist)
    Alice->>UI: Save as v1
    UI->>SL: insert skill
    SL->>DB: INSERT row<br/>id, name, manifest, full_content, v=1
    SL->>Audit: entity=skill, action=create<br/>actor=alice, after=v1

    Alice->>UI: Attach to agents:<br/>ReviewerBot-payments,<br/>ReviewerBot-auth,<br/>ReviewerBot-data
    UI->>SL: attach 3 agents
    SL->>AS: 3 rows<br/>pinned_version=null
    SL->>Audit: 3 attach events
    SL->>Slack: notify #payments-eng
    Slack->>Team: "Alice published go-microservice-review v1<br/>→ attached to 3 agents"

    Note over SL,DB: Next run from any attached agent

    participant Run as Run service
    participant CC as Claude Code
    participant Mcp as Dandori MCP

    Run->>CC: spawn with skill manifests in system prompt
    CC->>CC: sees Go file in diff,<br/>matches trigger
    CC->>Mcp: fetch_skill("go-microservice-review")
    Mcp->>DB: fetch full_content for v1
    DB-->>Mcp: content
    Mcp-->>CC: full skill returned
    Mcp->>DB: insert skill_usage row
```

**Modules touched:** Skill Library, Audit Log

**Integrations:** Slack (notify)

**Outcome:** Knowledge becomes org asset, not personal notes. Every attached agent picks up updates automatically. Usage analytics show which skills actually get fetched.

---

## Flow 4: Engineer asks Copilot a context-aware question

**Scenario:** Engineer in VS Code asks Copilot a question. Copilot calls Dandori MCP server to ground its answer in team standards.

```mermaid
sequenceDiagram
    autonumber
    actor Bob as Engineer (Bob)
    participant VS as VS Code
    participant Cop as GitHub Copilot
    participant Mcp as Dandori MCP server
    participant Ctx as Context Hub
    participant DB as context_layers table
    participant Audit as Audit log

    Bob->>VS: Open payments/webhook.ts
    Bob->>Cop: "How should I handle PII<br/>in this webhook handler?"
    Cop->>Cop: needs org context
    Cop->>Mcp: get_context(file=webhook.ts, project=payments)
    Mcp->>Ctx: resolve project from file path
    Ctx->>DB: SELECT latest version per layer
    DB-->>Ctx: company.security v12,<br/>project.pii v3,<br/>team.review v7
    Ctx->>Ctx: filter for PII relevance
    Ctx-->>Mcp: structured context blocks
    Mcp->>Audit: log context_query<br/>actor=copilot, user=bob,<br/>versions={...}
    Mcp-->>Cop: { company.security, project.pii, team.review }
    Cop->>Cop: thread context into reasoning
    Cop-->>Bob: "Per company security v12,<br/>PII must be masked, tagged,<br/>routed to auth-data svc.<br/>Use PiiVault.scrub() in payments project."
```

**Modules touched:** Context Hub, MCP Server, Audit Log

**Integrations:** GitHub Copilot (in via MCP)

**Outcome:** Engineer gets a grounded answer. Dandori logs which engineer queried which context, when, for which file. Compliance team can answer "did engineers see the security policy when they wrote this code?"

---

## Flow 5: Leadership monthly cost review

**Scenario:** CFO opens Dandori dashboard at month-end. Sees full breakdown, drills into anomalies, exports report.

```mermaid
sequenceDiagram
    autonumber
    actor CFO
    participant UI as Dandori Web UI
    participant CA as Cost Attribution
    participant View as v_agent_runs view
    participant Roll as Roll-up engine
    participant Anal as Cross-agent Analytics
    participant Exp as Export service
    participant Slack
    actor Fin as Finance team

    CFO->>UI: Open Dashboard → Cost
    UI->>CA: query month=2026-04
    CA->>View: SELECT FROM v_agent_runs<br/>GROUP BY project, team, agent
    View-->>CA: enriched run records
    CA->>Roll: aggregate
    Roll->>Roll: sum by project / team / agent<br/>sub-agents roll up to parent
    Roll-->>UI: dashboard data

    UI-->>CFO: Total $4,210<br/>Top: payments-service $1,820<br/>RefactorBot $640 (low quality ⚠)

    CFO->>UI: Click RefactorBot
    UI->>Anal: drill-down query
    Anal->>View: agent runs + quality history
    View-->>Anal: run history + quality trend
    Anal-->>UI: trend graph + top failed runs
    UI-->>CFO: Quality declining,<br/>cost per run rising

    CFO->>UI: Click Export
    UI->>Exp: build report (RefactorBot focus)
    Exp->>View: SELECT runs filter
    Exp->>Audit: SELECT audit events
    Exp->>Anal: SELECT quality breakdown
    Exp->>Exp: bundle: cost.csv +<br/>audit.json + quality.json
    Exp-->>UI: ZIP path
    UI->>Slack: DM CFO with download link
    Slack->>Fin: forwarded report
```

**Modules touched:** Cost Attribution, Cross-agent Analytics, Audit Log

**Integrations:** Slack (deliver report)

**Outcome:** Leadership has actionable cost data without engineering involvement.

---

## Flow 6: Compliance audit "show me PII-touching runs in Q1"

**Scenario:** CISO needs to produce evidence for a SOC 2 audit. Filters audit log + context versions + Sentinel events + approval records.

```mermaid
sequenceDiagram
    autonumber
    actor CISO
    participant UI as Dandori Web UI
    participant QB as Compliance query builder
    participant QE as Query engine
    participant Audit as Audit log
    participant Ctx as Context Hub<br/>(version archive)
    participant App as Approval records
    participant Hook as Hook execution log
    participant Sub as Sub-agent traces
    participant Sen as Sentinel events
    participant Asm as Evidence pack assembler
    participant Hash as Hash chain verifier

    CISO->>UI: Open Compliance → Build Pack
    CISO->>QB: Date 2026-01-01 → 2026-03-31<br/>Filter: context tag includes 'pii'<br/>Format: SOC 2

    QB->>QE: build SQL
    QE->>Audit: SELECT runs WHERE context_tags ⊃ pii<br/>AND ts BETWEEN ...
    Audit-->>QE: matching run IDs
    QE->>Ctx: JOIN context_layers ON version
    Ctx-->>QE: context snapshots
    QE->>App: JOIN approvals
    App-->>QE: approval records
    QE->>Hook: JOIN hook executions
    Hook-->>QE: hook fire log
    QE->>Sub: JOIN sub_agent_traces
    Sub-->>QE: sub-agent activity
    QE->>Sen: LEFT JOIN sentinel_events (if connected)
    Sen-->>QE: security events

    QE-->>Asm: full result set
    Asm->>Asm: write files:<br/>runs.csv,<br/>context-snapshots/*.md,<br/>approvals.json,<br/>hooks-fired.json,<br/>audit-trail.json,<br/>sentinel-events.json,<br/>soc2-evidence.pdf

    Asm->>Hash: verify chain
    Hash->>Audit: replay sha256 chain
    Audit-->>Hash: chain valid
    Hash-->>Asm: tamper status: OK

    Asm-->>UI: signed evidence pack
    UI-->>CISO: download link
```

**Modules touched:** Audit Log, Context Hub (version archive), Approval Workflow, Sub-agent Trace, Hooks (execution log), Compliance Export

**Integrations:** None — entirely internal

**Outcome:** Auditor receives signed, tamper-evident evidence pack in minutes instead of weeks.

---

## Flow summary table

| # | Scenario | Trigger | Key modules | Ecosystem | Outcome |
|---|---|---|---|---|---|
| 1 | Jira → PR → approval | Jira webhook | Task, Context, Hooks, Adapter, Sensors, Approval, Audit | Jira, GH, Slack | Auto PR with audit |
| 2 | Multi-phase DAG | Tech lead builds DAG | Task DAG, Context inheritance, Sensors chain, Sub-agent trace, Approval | Confluence, Claude Code, Codex, Slack, GH | Feature shipped without handoffs |
| 3 | Publish team skill | Senior engineer | Skill Library, Audit | Slack | Knowledge becomes org asset |
| 4 | Copilot context query | Engineer in IDE | Context Hub, MCP, Audit | Copilot | Grounded IDE answer |
| 5 | Cost review | CFO opens dashboard | Cost, Analytics, Audit | Slack | Actionable cost data |
| 6 | Compliance pack | CISO triggers | Audit, Context archive, Approval, Hooks, Compliance Export | None | Audit evidence in minutes |

---

## See also

- [Architecture Overview]({{ site.baseurl }}{% link architecture.md %}) — System architecture, tech stack, deployment topologies
- [Modules]({{ site.baseurl }}{% link modules/architecture-modules.md %}) — Per-module pages with diagrams, data model, and ecosystem integration
- [Use Cases]({{ site.baseurl }}{% link use-cases.md %}) — Higher-level business scenarios that drive these flows
