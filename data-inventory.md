---
layout: default
title: Data Inventory
nav_order: 8
description: "Complete catalog of data Dandori collects, stores, and processes — for enterprise data classification and governance review."
---

# Data Inventory

A complete catalog of every data category Dandori collects, stores, and processes. This page exists so that enterprise security, compliance, and data-governance teams can **classify each category against their own internal taxonomy** (e.g., Top Secret / Secret / Restricted / Internal / Public) and verify policy compliance before deploying Dandori on their internal cloud.

**Who this page is for:**

- CISO / security review teams evaluating deployment feasibility
- Data governance officers mapping Dandori data to internal classification schemes
- Compliance teams verifying SOC 2 / ISO 27001 / GDPR controls
- Platform engineers planning retention, encryption, and access control

**How to use this document:**

1. Read the summary table for a one-page view of all data categories
2. Walk through each category for storage, retention, access, and PII risk
3. Apply your own classification taxonomy to each row
4. Identify any category that conflicts with your policies — flag before pilot

---

## Summary — all data categories at a glance

| # | Category | Storage | Sensitivity hint | PII risk | Editable by |
|---|---|---|---|---|---|
| 1 | Workspace metadata (projects, teams, agents) | DB | Low | None | Admin |
| 2 | User accounts + API keys | DB (hashed) | Medium | Low (names, emails) | User self / admin |
| 3 | Context Hub content (5 layers) | DB | **High — varies** | **High potential** | Per-layer owner |
| 4 | Skill Library content | DB | Medium-High | Medium | Team owner |
| 5 | Task data (titles, specs, tags) | DB | Medium | Low-Medium | Task owner |
| 6 | **Agent run records (prompts + outputs)** | DB + object storage | **Highest** | **Highest potential** | Read-only after creation |
| 7 | Approval records (decisions + rationale) | DB (append-only) | Medium | Low | Immutable |
| 8 | Audit log events | DB (append-only) | Medium | Low | Immutable |
| 9 | Cost / billing records | DB | Low | None | System-only |
| 10 | Hook execution records | DB (append-only) | Medium-High | Variable | Immutable |
| 11 | MCP tool metadata + usage | DB | Low-Medium | None | Admin + usage auto |
| 12 | Quality gate results | DB | Medium | Low (file paths, error text) | Immutable |
| 13 | Sub-agent traces | DB | Medium | Low-Medium | Immutable |
| 14 | Imported context (Confluence, Drive, GitHub) | DB | **Inherits source** | **Inherits source** | Source-of-truth controlled |
| 15 | Ecosystem integration credentials | Sealed secrets | **High** | None | Admin-only |
| 16 | Session + auth tokens | DB (hashed) | High | Low | User self |

**Principle:** Dandori is a *metadata + orchestration layer*. It does NOT execute code, NOT compile, NOT store model weights, NOT hold AI provider credentials. Most of its state is *pointers and records*, but two categories — **Context Hub content (#3)** and **agent run records (#6)** — can contain arbitrary text that your engineers or agents write. Those two deserve the strictest classification review.

---

## Category detail

### 1. Workspace metadata

**What:** Projects, teams, agents, task boards — the organizational scaffolding.

**Example fields:** `project.id`, `project.name`, `team.id`, `team.name`, `agent.id`, `agent.name`, `agent.role_description`.

**Storage:** SQLite (pilot) or Postgres (production). Plain rows in relational tables.

**Retention:** Indefinite; deleted when project/team is retired.

**Access:** Role-based. Read access to members of the project/team. Write access to admins + owners.

**PII risk:** None by default. Agent role descriptions are engineer-authored and are typically not sensitive.

**Classification hint:** Usually **Internal Use Only**. Escalate to Restricted only if project names reveal sensitive initiatives.

---

### 2. User accounts and API keys

**What:** The identities that interact with Dandori.

**Example fields:** `user.id`, `user.name`, `user.email`, `user.role`, `api_key.hash`, `api_key.scope`, `api_key.last_used_at`.

**Storage:** DB. API key secrets are hashed (argon2 or bcrypt); only the hash is stored.

**Retention:** While account is active; on deletion, accounts are soft-deleted first (90 days) then hard-deleted.

**Access:** User can read + edit own profile. Admin can manage all accounts. API key secrets are never readable after creation (hash-only).

**PII risk:** Low — names + emails are standard employee directory data.

**Classification hint:** **Restricted** for user records, **Secret** for API key hashes (even though hashed, compromise enables impersonation).

---

### 3. Context Hub content (5 layers) ⚠ CRITICAL

**What:** Arbitrary markdown written by engineers, team leads, and platform teams. Layers: Company → Project → Team → Agent → Task.

**Example content:**
- Company layer: "Use TypeScript 5.3+, log PII via PiiVault.scrub() only, no synchronous DB calls in hot paths"
- Project layer: "Payments service depends on Stripe SDK v8, uses Postgres schema `payments`"
- Team layer: "Payments team reviews all migrations; on-call alerts go to #payments-oncall"
- Agent layer: "ReviewerBot personality, skill references, review protocol"
- Task layer: "Implement webhook handler per spec at docs/stripe-webhook.md"

**Storage:** DB `context_layers` table. Full markdown text + version history + diff + PII tags.

**Retention:** All versions retained indefinitely for audit. Rollback supported. Can be purged per project.

**Access:** Per-layer ownership. Company layer = CTO / Platform team. Project = project lead. Team = team lead. Agent = agent maintainer. Task = task author.

**PII risk:** **HIGH POTENTIAL** — engineers can paste anything. Risk categories:
- Internal file paths, API endpoints, DB schemas
- Partial credentials or connection strings (if engineer careless)
- Business logic and competitive secrets
- PII if engineer includes user data in examples

**Controls in place:**
- PII tags per layer; layers tagged PII can only be seen by agents with explicit permission
- Context version log captures every edit
- Web UI shows a warning before committing if content matches secret patterns (regex-based scanner)
- Export is admin-gated

**Classification hint:** **varies by layer** — Company/Project layers often **Restricted**, Team/Agent/Task layers can be **Internal Use Only** unless tagged PII.

**⚠ Reviewer action:** Apply your own secret-scanning policy to Context Hub writes. Consider making this a gated field with a `before_context_assembly` hook that rejects content matching known secret patterns.

---

### 4. Skill Library content

**What:** Reusable prompt knowledge — markdown files that engineers attach to agents.

**Example:** "Go microservice review checklist: (1) check context cancellation on I/O, (2) verify error wrapping, (3) ensure metrics + trace spans exist..."

**Storage:** DB `skills` table. Manifest (short metadata) + full content (longer markdown) + version history.

**Retention:** Indefinite. Versions immutable.

**Access:** Read access to agents that have the skill attached. Edit access to owner team.

**PII risk:** Medium — engineer-authored markdown. Lower risk than Context Hub because skills are typically generic review patterns, not project-specific data.

**Classification hint:** **Internal Use Only** typically. Elevate to Restricted if a skill encodes competitive techniques.

---

### 5. Task data

**What:** The unit of work. Titles, descriptions, phase tags, skill tags, dependencies, external IDs.

**Example fields:** `task.title`, `task.description`, `task.phase`, `task.status`, `task.skill_tags`, `task.deadline`, `task.external_id` (e.g., Jira key).

**Storage:** DB `tasks` table.

**Retention:** Until project retirement. Deletable by owner.

**Access:** Read access to project members. Write access to task owner + team leads.

**PII risk:** Low-Medium. Task descriptions are usually engineer-written specs, not user data. Risk: a task may reference a customer ticket ID.

**Classification hint:** Typically **Internal Use Only**. Elevate per project if tasks reference regulated customer data.

---

### 6. Agent run records (prompts + outputs) ⚠ HIGHEST RISK

**What:** Every time a coding agent runs, Dandori records the full prompt sent and the full output received.

**Example fields per run:**
- `run.id`, `run.task_id`, `run.agent_id`
- `run.prompt_text` — **FULL assembled prompt sent to runtime** (includes Context Hub layers, skill content, task spec)
- `run.output_text` — **FULL runtime output** (may include code, explanations, reasoning, tool call summaries)
- `run.context_versions` — JSON snapshot of which layer versions were active
- `run.input_tokens`, `run.output_tokens`, `run.cost_usd`, `run.model_name`
- `run.exit_code`, `run.duration_ms`

**Storage:** DB for metadata + small outputs. Object storage (S3-compatible) for large outputs (> 64 KB) in production topology.

**Retention:** Configurable per project. Default 365 days for compliance; can be shortened for sensitivity. Archival to cold storage after 90 days.

**Access:** Read-only after creation. Visible to task members + approval reviewers. Export is admin-gated with audit log entry.

**PII risk:** **HIGHEST POTENTIAL** — this is where everything can end up:
- If the agent reads a source file containing user data → data appears in output
- If the prompt was assembled with PII-tagged context → PII appears in prompt
- If the agent generates test data → may include realistic-looking PII
- If the agent hallucinates → may invent PII

**Controls in place:**
- Every run records which context versions were used → full reproducibility
- `after_run` hook can scan output for secret patterns + PII before storing
- Per-project retention policy
- Immutable after creation (append-only); no UPDATE/DELETE from API
- Export requires admin + produces audit event

**Classification hint:** **Match the highest classification of any input layer.** If a run touched Company-layer Secret content, the run record must be at least Secret. This is the single most important category to classify correctly.

**⚠ Reviewer actions:**
- Decide per-project retention
- Decide whether to encrypt run.prompt_text + run.output_text at rest
- Decide whether to enable automatic PII scrubbing in `after_run` hook
- Consider excluding certain agent types from long-term retention

---

### 7. Approval records

**What:** Human approval decisions on tasks flagged `needs_approval`.

**Example fields:** `approval.task_id`, `approval.run_id`, `approval.decision`, `approval.decided_by`, `approval.decided_at`, `approval.rationale`, `approval.rejection_reason`.

**Storage:** DB `approvals` table. Append-only.

**Retention:** Indefinite for compliance. Never deleted.

**Access:** Read to task members. Write only through approval API. Immutable.

**PII risk:** Low. Rationale text is engineer-authored.

**Classification hint:** **Restricted** — these records are the audit trail that compliance teams depend on.

---

### 8. Audit log events

**What:** Every mutation in Dandori — creates, updates, deletes, approvals, hook executions, context edits.

**Example fields:** `audit.actor_type`, `audit.actor_id`, `audit.entity_type`, `audit.entity_id`, `audit.action`, `audit.before_data`, `audit.after_data`, `audit.occurred_at`, `audit.hash`.

**Storage:** DB `audit_events` table. **Append-only enforced at DB level** (triggers block UPDATE/DELETE). Optional hash chain for tamper-evidence.

**Retention:** Configurable per project. Default 365 days hot + 7 years cold archive.

**Access:** Read for compliance officers + admins. Never writable from application code — only through audit middleware.

**PII risk:** Low-Medium. Before/after snapshots may contain Context Hub or task data, inheriting their sensitivity.

**Classification hint:** **Restricted** minimum. Elevate to Secret if your retention window is long enough to accumulate sensitive snapshots.

---

### 9. Cost and billing records

**What:** Per-run token counts, model names, computed cost in USD.

**Storage:** DB `runs` table (fields) + `v_agent_runs` view for enriched queries.

**Retention:** Indefinite (aggregated reporting).

**Access:** Read for leadership + finance + engineering managers. System-only write.

**PII risk:** None.

**Classification hint:** **Internal Use Only**.

---

### 10. Hook execution records

**What:** Logs of every lifecycle hook that fires (before_run, after_run, on_error, etc.).

**Example fields:** `hook_execution.hook_id`, `hook_execution.run_id`, `hook_execution.event`, `hook_execution.exit_code`, `hook_execution.duration_ms`, `hook_execution.output` (stdout JSON), `hook_execution.error`.

**Storage:** DB `hook_executions` table. Append-only.

**Retention:** 90 days default; extendable per project.

**Access:** Read to hook owner + admins. Immutable.

**PII risk:** Variable — depends on what the hook script emits. A secret-scanner hook may log matched patterns (be careful).

**Classification hint:** **Restricted** if any hook handles sensitive data. Otherwise Internal Use Only.

---

### 11. MCP tool metadata and usage

**What:** Registry of MCP servers Dandori governs + per-agent allow-lists + tool invocation logs.

**Example fields:** `mcp_servers.name`, `mcp_servers.url`, `mcp_tools.description`, `mcp_tool_usage.run_id`, `mcp_tool_usage.tool_id`, `mcp_tool_usage.invoked_at`.

**Storage:** DB.

**Retention:** Registry indefinite. Usage logs 180 days.

**Access:** Registry admin-only. Usage logs visible to fleet analytics.

**PII risk:** None (Dandori doesn't log tool call arguments or results, only metadata).

**Classification hint:** **Internal Use Only**.

---

### 12. Quality gate results

**What:** Output of automated sensors (typecheck, lint, tests) run after agent work.

**Example fields:** `run.quality_score`, `run.quality_breakdown` (JSON with error messages, file paths, line numbers).

**Storage:** DB `runs` table.

**Retention:** Same as run records.

**Access:** Same as run records.

**PII risk:** Low. May contain internal file paths, error messages, stack traces.

**Classification hint:** **Internal Use Only** typically. Match run record classification.

---

### 13. Sub-agent traces

**What:** Observability data about sub-agents spawned inside a runtime's run (Claude Code sub-agents, etc.).

**Example fields:** `sub_agent_traces.parent_run_id`, `sub_agent_traces.name`, `sub_agent_traces.tokens`, `sub_agent_traces.output_summary`, `sub_agent_traces.tool_calls`.

**Storage:** DB `sub_agent_traces` table.

**Retention:** Same as run records.

**Access:** Same as run records.

**PII risk:** Low-Medium. `output_summary` is a truncated preview; may contain sensitive text if the sub-agent handled sensitive input.

**Classification hint:** Match parent run classification.

---

### 14. Imported ecosystem context (Confluence, Drive, GitHub, Jira)

**What:** Content pulled into Dandori from existing knowledge bases when integration is enabled.

**Source and fields:**
- **Confluence:** page content converted to markdown, page labels
- **Google Drive:** doc content exported as markdown
- **GitHub Enterprise:** repo README, ARCHITECTURE.md, PR titles/descriptions, diffs (when linked to a run)
- **Jira:** issue title, description, labels, status, assignee

**Storage:** DB `context_layers` table with `source: confluence:{page-id}` style tagging for re-import.

**Retention:** Inherits source. Re-synced on schedule or on-demand.

**Access:** Inherits source's access control through the integration's service account.

**PII risk:** **Inherits source.** Confluence pages about payments may contain the same sensitivity as the original page.

**Classification hint:** **Inherits source classification.** If Confluence page is Restricted, the imported context layer is Restricted.

**⚠ Reviewer action:** Verify Dandori's integration service account has read-only scope and cannot exfiltrate beyond what your policy allows. Consider a per-space or per-folder allow-list.

---

### 15. Ecosystem integration credentials

**What:** API tokens Dandori holds to talk to Jira, Confluence, GitHub, Google Drive, Slack.

**Storage:** Sealed secrets directory on disk (encrypted at rest) for team pilot; KMS / HashiCorp Vault for production.

**Retention:** Rotated on schedule or on demand.

**Access:** Admin-only. Never surfaced via API.

**PII risk:** None (they're secrets, not PII).

**Classification hint:** **Secret** — compromise gives access to all integrated systems.

**⚠ Important:** Dandori does NOT hold AI provider credentials (Anthropic, OpenAI). Those remain with the coding agent runtime (Claude Code, Codex) as host environment variables.

---

### 16. Session and auth tokens

**What:** Web UI session cookies, OAuth refresh tokens for Google Drive.

**Storage:** DB with hashing or encryption at rest.

**Retention:** Session cookies expire per config (default 24h). OAuth refresh tokens rotated automatically.

**Access:** User self only.

**PII risk:** Low — linkage only, not content.

**Classification hint:** **Restricted**.

---

## What Dandori does NOT store

To reduce scope for your review, here is everything Dandori is designed to **never** hold:

| Category | Where it lives instead |
|---|---|
| AI provider API keys (Anthropic, OpenAI) | Host env vars of the coding agent runtime — Dandori never sees them |
| Model weights | Provider-side only |
| Source code repositories | Stays in GitHub Enterprise / local filesystem |
| Customer data from production DBs | Stays in production DB; Dandori only sees what engineers paste into context |
| Financial transaction data | Stays in billing systems; Dandori only sees aggregated cost reports from GenAI Gateway |
| HR / payroll / personnel data | Not touched |
| End-user session data of your product | Not touched |
| Sandbox execution results (beyond metadata) | Sandbox is the runtime's responsibility; Dandori records exit code + summary, not file contents |
| MCP tool call arguments or results | Runtime invokes tools directly; Dandori only logs metadata |

---

## Data flow map

```
┌─────────────────────────────────────────────────────────────┐
│   DATA ENTERING DANDORI                                     │
│                                                             │
│   Engineer writes:     Context Hub content, skills, tasks   │
│   Runtime reports:     Run records, tool usage, traces      │
│   Integrations pull:   Confluence, Drive, GitHub, Jira      │
│   Admin configures:    Hooks, MCP registry, budgets         │
│   System generates:    Audit events, cost records, scores   │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│   DANDORI STORAGE                                           │
│                                                             │
│   Hot DB          (SQLite or Postgres)                      │
│   Object storage  (S3 for large run outputs, production)    │
│   Sealed secrets  (encrypted disk for integration tokens)   │
│                                                             │
│   Append-only:  audit_events, approvals, hook_executions    │
│   Versioned:    context_layers, skills, hooks, mcp_tools    │
│   Immutable:    runs (after completion)                     │
│                                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│   DATA LEAVING DANDORI                                      │
│                                                             │
│   Web UI display   (read access by user role)               │
│   REST API export  (audit-logged, admin-gated)              │
│   MCP server       (exposes context + skills to runtimes)   │
│   Compliance pack  (on-demand evidence bundle)              │
│   Integrations write-back:                                  │
│     · Jira status updates                                   │
│     · GitHub PR status checks + comments                    │
│     · Slack notifications + interactive approvals           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Retention and deletion summary

| Category | Default retention | Configurable? | Deletion mechanism |
|---|---|---|---|
| Workspace metadata | Indefinite | Yes | Soft delete + 30-day purge |
| User accounts | While active | Yes | Soft delete + 90-day purge |
| Context Hub | Indefinite (all versions) | Per project | Project purge cascades |
| Skill Library | Indefinite (all versions) | Per team | Team purge cascades |
| Tasks | Until project retired | Per project | Project purge cascades |
| **Run records** | **365 days (default)** | **Per project** | Archive to cold + delete after N years |
| Approval records | Indefinite | No | Never deleted (compliance) |
| Audit log | 365 days hot + 7 years cold | Yes | Cold archive after 90 days |
| Cost records | Indefinite | Yes | Aggregated reporting forever |
| Hook executions | 90 days | Yes | Auto-purge |
| MCP usage | 180 days | Yes | Auto-purge |
| Imported context | Inherits source + cache | Yes | Re-sync overwrites |
| Integration credentials | Rotated | Yes | Rotation replaces |

**Right-to-erasure (GDPR):** User deletion cascades to all owned records except append-only audit entries (which are retained under "legal obligation" basis per GDPR Art. 17(3)(b)). Audit entries containing user references are anonymized after deletion by replacing `actor_id` with a hashed placeholder.

---

## Access control model

### Roles

| Role | Permissions |
|---|---|
| **Admin** | Full control; manage users, projects, hooks, MCP registry, integration credentials |
| **Team lead** | Manage team context, skills, approval routing |
| **Engineer** | Create tasks, run agents, review approvals, author skills, author context |
| **Viewer** | Read-only on tasks, runs, dashboards (for auditors, managers) |
| **Compliance** | Read audit log, generate compliance packs, configure retention |

### Principles

- **Project isolation:** Row-level filtering on every query by `project_id`
- **Least privilege:** Default role is Viewer; elevated per invitation
- **API keys scoped:** Each key declares project + role + expiration
- **Audit everything:** Every read of sensitive data (run export, audit pack) is itself logged

---

## Encryption and network controls

| Dimension | Team pilot | Production |
|---|---|---|
| TLS for all HTTP | Required (via reverse proxy) | Required (mTLS between services) |
| DB at rest | SQLite encrypted via disk encryption | Postgres TDE or filesystem encryption |
| Object storage at rest | N/A | S3 SSE-KMS or provider KMS |
| Sealed secrets at rest | Encrypted disk + file permissions 600 | KMS or HashiCorp Vault |
| In-process memory | Not encrypted (standard) | Not encrypted (standard) |
| Backups | Encrypted tarball | Encrypted + offsite + access-logged |

---

## Where Dandori runs (for data residency review)

Dandori is self-hosted. **All data stays within the customer's infrastructure.** Deployment options:

1. **Team pilot** — single Node.js process on a Linux VM in your internal cloud
2. **Multi-team production** — multiple workers behind a load balancer, Postgres HA, S3-compatible storage
3. **Enterprise** — integrates with your existing platform (e.g., AIPF)

Dandori does NOT send data to any Dandori-operated SaaS or analytics endpoint. There is no phone-home.

---

## Helpers for classification review

To speed up your review, here is a suggested action table. Replace the "Your classification" column with your internal taxonomy.

| # | Category | Suggested minimum | Your classification | Notes |
|---|---|---|---|---|
| 1 | Workspace metadata | Internal Use Only | | |
| 2 | User accounts | Restricted | | Hashed keys |
| 3 | **Context Hub** | **Restricted (varies)** | | **Per-layer, use PII tags** |
| 4 | Skill Library | Internal Use Only | | |
| 5 | Tasks | Internal Use Only | | |
| 6 | **Run records** | **Match highest input** | | **Most sensitive, consider encryption at rest** |
| 7 | Approvals | Restricted | | Compliance artifact |
| 8 | Audit log | Restricted | | Immutable |
| 9 | Cost records | Internal Use Only | | |
| 10 | Hook executions | Restricted | | Variable |
| 11 | MCP metadata | Internal Use Only | | |
| 12 | Quality gate results | Internal Use Only | | |
| 13 | Sub-agent traces | Match parent run | | |
| 14 | Imported context | **Inherits source** | | Audit integration service account |
| 15 | Integration credentials | **Secret** | | KMS/Vault recommended |
| 16 | Session tokens | Restricted | | |

---

## Questions we'd like answered during the review

To move the pilot forward quickly, these are the questions we expect your team will want to confirm:

1. **Which categories are blocked by policy?** (If any. Most commonly, the Context Hub is a concern because engineers can write anything — do you require secret-scanning pre-commit?)
2. **What retention windows apply?** (Default 365 days for runs — does your policy require shorter?)
3. **Does run.prompt_text + run.output_text need encryption at rest?** (Recommended for regulated environments.)
4. **Which integrations are allowed in the pilot?** (Jira, Confluence, GitHub, Drive, Slack — any blocked?)
5. **Who in your org owns each role** (Admin, Compliance, Team leads)? (Needed for RBAC provisioning.)
6. **Is your deployment target internal cloud** (Flava/YNW/other)? (Confirms Node.js + SQLite/Postgres compatibility.)
7. **Do you need multi-tenant isolation** (one Dandori serving multiple org units) or per-team instances?
8. **Any cross-border data restriction** on the data Dandori writes back to GitHub / Jira / Slack?

---

## Related

- [Architecture]({% link architecture.md %}) — Tech stack, system overview, deployment topologies
- [Modules]({% link architecture-modules.md %}) — Per-module data models (SQL schemas)
- [Use Case Flows]({% link architecture-use-cases.md %}) — End-to-end flows showing where data enters and leaves
- [Proposed Roadmap]({% link proposed-roadmap.md %}) — Implementation path including security milestones
