---
layout: default
title: Architecture
nav_order: 5
description: "Technical architecture for decision-makers evaluating Dandori."
---

# Architecture

How Dandori works, technically. This page is for technical decision-makers evaluating fit with existing systems.

---

## System overview

Dandori sits between your engineers and their AI agents. It does not replace the agents — it orchestrates, measures, and governs them.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENGINEERS                                │
│           (create tasks, review approvals, check analytics)     │
└─────────────────────────────┬───────────────────────────────────┘
                              │ Web UI · CLI · API · MCP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DANDORI                                │
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐     │
│   │  Task Board │   │  Context    │   │   Analytics      │     │
│   │  (Kanban)   │   │  Hub        │   │   Dashboard      │     │
│   └─────────────┘   └─────────────┘   └──────────────────┘     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐       │
│   │          Orchestration + Audit Layer                │       │
│   │  (prompt assembly · approval gates · quality gates) │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌──────────────────┐     │
│   │  Claude     │   │  Codex      │   │  Custom adapter  │     │
│   │  adapter    │   │  adapter    │   │  (your choice)   │     │
│   └─────────────┘   └─────────────┘   └──────────────────┘     │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  AI Providers    │
                    │  (Claude, GPT,   │
                    │   local models)  │
                    └──────────────────┘
```

---

## Data model

Every agent run produces a complete record:

```
Run {
  id, task_id, agent_id, project_id,
  prompt_text,        // Full 5-layer prompt sent to AI
  context_versions,   // Which version of each context layer
  started_at, ended_at, duration_ms,
  input_tokens, output_tokens,
  cost_usd, model_name,
  quality_score, quality_breakdown,
  output_text, exit_code,
  approved_by, approved_at  // If approval gate
}
```

**Queries you can run from day one:**

- Cost per project per month
- Agents ranked by quality score trend
- Tasks blocked in review longer than X days
- Which context versions were active when an incident happened
- Cost-per-line-of-code by agent

---

## Adapter architecture

Dandori does not talk to AI providers directly. It routes through **adapters**:

| Adapter | What it runs |
|---|---|
| **Claude Local** | Claude Code CLI on the host |
| **Codex Local** | OpenAI Codex CLI on the host |
| **Custom** | Any subprocess or HTTP-based agent |

**Why this matters:**

- Swap providers without changing your tasks or prompts
- Run local models (llama.cpp, Ollama) via custom adapter
- Isolate AI vendor SDK dependencies from Dandori core
- Pin different agents to different models based on task phase

---

## Deployment footprint

- **Backend:** Single Node.js process
- **Database:** SQLite by default, Postgres-compatible schema for scale
- **Frontend:** Server-rendered HTML + minimal JavaScript (no SPA build step)
- **Adapters:** Out-of-process subprocesses (isolated failure domain)
- **State:** All state in database; stateless server process

Runs on a laptop for evaluation. Scales to multi-region deployment for production.

---

## Security posture

| Control | Implementation |
|---|---|
| **Authentication** | API keys with scoped access (planned: SSO via OIDC/SAML) |
| **Rate limiting** | Per-key rate limits, configurable |
| **Data isolation** | Row-level user/project scoping on every query |
| **Audit log** | Immutable log of all mutations (create/update/delete/approve) |
| **Secret handling** | No secrets in agent prompts or context; host-level env vars only |
| **PII policy** | Configurable per project; context layer can declare PII restrictions |

---

## Next steps

- [Core Features →]({% link core-features.md %}) The 9 management capabilities
- [Use Cases →]({% link use-cases.md %}) Management scenarios built on this architecture
- [AIPF Integration →]({% link aipf-integration.md %}) Fitting into enterprise AI platforms
