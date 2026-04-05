# Architecture

How Dandori works, conceptually. This page is for technical decision-makers evaluating fit with existing systems.

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

## The 5-layer context model

The foundational concept in Dandori. Every agent run inherits context from five layers, in order of specificity:

| # | Layer | Owner | Purpose |
|---|---|---|---|
| 1 | **Company** | CTO / Platform | Org-wide standards, compliance, security policies |
| 2 | **Project** | Project lead | Tech stack, architecture, service boundaries |
| 3 | **Team** | Team lead | Review protocol, naming conventions, on-call rotation |
| 4 | **Agent** | Agent owner | Agent's role, personality, skill references |
| 5 | **Task** | Task author | Specific work item, linked files, deadline |

**Resolution order:** More specific layers override higher ones. A team's review protocol overrides the company's default protocol.

**Version control:** Every layer is versioned. One click reverts context to a prior version. Diff view shows what changed.

**Audit:** Every prompt sent to an AI provider records which version of each layer was active. Reproducibility is built-in.

---

## Task lifecycle

```
  TODO ──────▶ IN PROGRESS ──────▶ IN REVIEW ──────▶ DONE
                    │                    │
                    │                    └── (if needs_approval)
                    │                         human approves/rejects
                    │
                    └── agent runs here
                        (prompt · quality gates · cost log)
```

**Status transitions:**

- Created tasks start in **TODO**.
- Wakeup moves a task to **IN PROGRESS** and triggers an agent run.
- When the agent completes, the task moves to **IN REVIEW** (if `needs_approval`) or **DONE** (if no gate).
- A human approves or rejects in IN REVIEW. Approval moves to DONE. Rejection moves back to TODO with the rejection note.

**Dependencies:** Tasks can depend on other tasks. Dandori enforces the DAG: dependent tasks auto-start only when parents complete.

**Phase tags:** Research → Concept → Requirement → Design → Implement → Test → Deploy → Maintain. Filter boards by phase for portfolio views.

---

## Quality gate pipeline

Every agent run passes through automated scanners before the task moves to review/done:

| Gate | What it checks | Fail action |
|---|---|---|
| **Type check** | Static type errors in modified files | Flag, reduce quality score |
| **Lint** | Style violations, unused imports, complexity | Flag, reduce quality score |
| **Test scanner** | Tests exist for touched code paths | Flag, reduce quality score |
| **Diff size** | Changes exceed expected size | Warn on oversized PRs |

**Quality score:** Computed per run (0-100). Tracked per agent over time. Cross-agent comparison table surfaces which agents are improving.

You can configure which gates run on which task types.

---

## Skill system

**Skills are reusable knowledge blocks** attached to agents.

```
SKILL: "api-security-review"
├── Description: Reviews REST endpoints for OWASP top 10 violations
├── Content: checklist + examples (markdown)
├── Owner: Security Team
└── Attached to: Reviewer-Alice, Reviewer-Bob, Reviewer-Charlie
```

When the skill content updates, all attached agents get the new version on next run. Skills are your organization's prompt IP, stored centrally.

**Skill tags on tasks:** Tag tasks with required skills. Dandori auto-suggests which agent to assign based on skill overlap.

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

## Audit + analytics pipeline

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

## Deployment footprint

- **Backend:** Single Node.js process
- **Database:** SQLite by default, Postgres-compatible schema for scale
- **Frontend:** Server-rendered HTML + minimal JavaScript (no SPA build step)
- **Adapters:** Out-of-process subprocesses (isolated failure domain)
- **State:** All state in database; stateless server process

Runs on a laptop for evaluation. Scales to multi-region deployment for production.

---

## Integration surface

Dandori exposes five integration surfaces:

| Surface | Use |
|---|---|
| **Web UI** | Daily use by engineers, managers, approvers |
| **REST API** (OpenAPI 3.0) | CI/CD pipelines, custom dashboards, webhooks |
| **CLI** | Terminal workflows, scripts, automation |
| **MCP server** | Claude Code and other MCP-compatible tools |
| **Webhooks** (planned) | React to events (run completed, approval needed) |

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

- **[Enterprise →](enterprise.md)** Scaling, compliance, integration with your stack
- **[Use Cases →](use-cases.md)** Concrete patterns built on this architecture
