---
layout: default
title: Data Inventory
nav_order: 8
description: "What data Dandori collects, stores, and processes — for security and compliance review."
---

# Data Inventory

For enterprise security, compliance, and data-governance teams evaluating Dandori.

---

## Summary

| # | Category | Storage | PII risk | Sensitivity |
|---|---|---|---|---|
| 1 | Workspace metadata (projects, teams, agents) | DB | None | Low |
| 2 | User accounts + API keys | DB (hashed) | Low (names, emails) | Medium |
| 3 | **Context Hub content (5 layers)** | DB | **High potential** | **Varies by layer** |
| 4 | Skill Library content | DB | Medium | Medium |
| 5 | Task data | DB | Low | Medium |
| 6 | **Agent run records (prompts + outputs)** | DB + object storage | **Highest** | **Match highest input** |
| 7 | Approval records | DB (append-only) | Low | Restricted |
| 8 | Audit log events | DB (append-only) | Low | Restricted |
| 9 | Cost / billing records | DB | None | Low |
| 10 | Hook execution records | DB (append-only) | Variable | Medium |
| 11 | MCP tool metadata + usage | DB | None | Low |
| 12 | Quality gate results | DB | Low | Low |
| 13 | Sub-agent traces | DB | Low | Match parent |
| 14 | Imported context (Confluence, Drive, GitHub) | DB | **Inherits source** | **Inherits source** |
| 15 | Integration credentials | Sealed secrets | None | **Secret** |
| 16 | Session tokens | DB (hashed) | Low | Restricted |

**Two categories deserve the strictest review:** Context Hub content (#3) and agent run records (#6) — both can contain arbitrary text.

---

## What Dandori does NOT store

| Category | Where it lives instead |
|---|---|
| AI provider API keys | Host env vars of the runtime — Dandori never sees them |
| Model weights | Provider-side only |
| Source code repositories | GitHub / local filesystem |
| Customer production data | Production DBs — Dandori only sees what engineers paste into context |
| MCP tool call arguments/results | Runtime invokes directly — Dandori logs metadata only |

---

## Key controls

- **Append-only tables** for audit log, approvals, hook executions (UPDATE/DELETE blocked at DB level)
- **Optional hash chain** on audit log for tamper-evidence
- **Version control** on all configurable entities (context, skills, hooks, MCP descriptions) with diff + rollback
- **PII tags** per context layer; agents need explicit permission for PII-tagged layers
- **Secret scanner** warns before committing context matching known secret patterns
- **Run records immutable** after creation; export requires admin + produces audit event
- **Retention configurable** per project (default: runs 365 days, audit 365 hot + 7 years cold)

---

## Data residency

Dandori is **self-hosted**. All data stays within the customer's infrastructure. No phone-home, no Dandori-operated SaaS endpoints.

---

## Review questions

1. Which data categories are blocked by your policy?
2. What retention windows apply? (Default 365 days for runs)
3. Does run prompt/output need encryption at rest?
4. Which ecosystem integrations are allowed in the pilot?
5. Who owns each RBAC role (Admin, Compliance, Team leads)?
6. Single-tenant or multi-tenant deployment?

---

For full per-category detail (storage, retention, access, controls), see the module detail pages or request the extended data inventory document.
