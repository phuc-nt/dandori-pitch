# Enterprise

How Dandori fits into a 1,000 – 50,000-engineer organization. This page answers the questions your security, compliance, and platform teams will ask.

---

## Deployment model

Dandori is **self-hosted by default**. You control the data, the uptime, and the network boundary.

| Dimension | Answer |
|---|---|
| **Where does data live?** | Your infrastructure. Your database. Your logs. |
| **Internet access required?** | Only for the AI provider calls (which already need it). |
| **Air-gapped deployments?** | Yes, with self-hosted or local AI models. |
| **Multi-region?** | Yes, stateless servers with replicated database. |
| **HA?** | Horizontal scaling supported; database is the only stateful component. |

Dandori is designed to run inside your existing Kubernetes cluster, VM fleet, or single-node deployment.

---

## Security controls

### Authentication & authorization
- API keys with scoped access (per-user, per-project)
- SSO via OIDC/SAML *(roadmap)*
- Role-based access control: Admin, Lead, Engineer, Viewer *(roadmap)*
- Per-project access boundaries enforced at every query

### Data handling
- All mutations logged to immutable audit trail
- Context layers support PII classification tags
- Secrets never stored in prompts or context (host-level env vars only)
- Configurable data retention policies per project

### Network
- HTTPS/TLS enforced
- Rate limiting per API key (configurable)
- Outbound AI provider calls can be proxied through your egress gateway
- No phone-home telemetry

---

## Compliance

Dandori provides the primitives for:

| Framework | What Dandori contributes |
|---|---|
| **SOC 2** | Audit log, access controls, change management |
| **ISO 27001** | Asset inventory (agents, prompts, skills), access logs |
| **HIPAA** (if applicable) | Per-project PII classification, no PII in prompts policy |
| **GDPR** | Data residency control, export, deletion workflows |
| **AI governance policies** (NIST AI RMF, EU AI Act) | Traceability of every agent decision |

Your compliance team gets a single export: *"show me every agent-generated change in Q3, who reviewed it, and what context it saw."*

---

## Scaling patterns

### By engineer count

| Org size | Deployment |
|---|---|
| **< 100 engineers** | Single instance, SQLite, one server |
| **100 – 1,000** | Single instance, Postgres, dedicated DB |
| **1,000 – 10,000** | Horizontal scale, 2-3 regions, read replicas |
| **10,000+** | Multi-tenant federation (one instance per business unit), shared skill library |

### By agent throughput

- **< 1,000 runs/day:** Default configuration
- **1,000 – 10,000 runs/day:** Add worker queue for async agent execution
- **10,000+ runs/day:** Partition by project, dedicated adapter pools

---

## Integration patterns

### With your PM stack
- **Jira / Linear:** Two-way sync of tasks (roadmap)
- **GitHub / GitLab:** PR webhook → create review task; task status → PR checks
- **Slack / Teams:** Notifications for approvals, failures, cost alerts

### With your CI/CD
- Trigger agent runs from pipeline steps (REST API)
- Gate merges on Dandori quality score
- Post agent findings as PR comments

### With your observability
- Metrics exported in Prometheus format (roadmap)
- Logs in structured JSON, pluggable to your log aggregator
- Trace correlation via OpenTelemetry (roadmap)

### With your identity provider
- SSO via OIDC (Okta, Auth0, Azure AD) — roadmap
- SCIM user provisioning — roadmap

---

## Organizational adoption path

Most orgs follow this rollout:

### Phase 1 — Pilot (1 team, 4 weeks)
- One team installs Dandori
- Migrate their existing agent prompts into shared skills
- Set up quality gates + approval flow
- Measure cost attribution + incident reduction

### Phase 2 — Expansion (5 teams, 8 weeks)
- Build company-wide context layer (standards, compliance)
- Share skill library across teams
- Introduce cross-team analytics

### Phase 3 — Standard (all engineering, 3-6 months)
- Enforce Dandori as the gateway for all agent usage
- CTO-level cost dashboards
- Security team owns company context
- Compliance team uses audit export for quarterly reviews

### Phase 4 — Integrated (ongoing)
- Dandori hooks into hiring onboarding (new engineers inherit team skills day 1)
- Agents routed by skill across organizational boundaries
- Prompt IP treated as first-class company asset

---

## Total cost of ownership

### What you spend
- **Infrastructure:** 1-2 small VMs + Postgres (trivial compared to AI spend)
- **Operations:** ~0.25 FTE to maintain after setup
- **AI provider costs:** Unchanged (you'd pay them anyway)

### What you save (conservative)
- **10-20% reduction in wasted tokens** via identifying bad prompts
- **30 min/engineer/week** saved on prompt management
- **2 hours per new engineer** on onboarding (skills inherited automatically)
- **Incident cost avoidance** from quality gates (quantify from your incident data)

**Typical payback period:** 2-3 months at 500+ engineers.

---

## What you get, day one

- Central cost dashboard (per-agent, per-project, per-team)
- 5-layer context hierarchy with version control
- Built-in approval workflow
- Automated quality gates (TypeScript, ESLint, test scanners)
- Cross-agent comparison table
- Skill library shareable across teams
- Full audit log of every action
- REST API + CLI + MCP server for automation
- Self-hosted, no vendor lock-in

---

## What's on the roadmap

Near-term:

- **Multi-user + SSO** (OIDC, SAML, SCIM)
- **Role-based access control** (Admin, Lead, Engineer, Viewer)
- **Jira integration** (two-way sync)
- **Production hardening** (Docker images, structured logging, metrics)

Medium-term:

- **Google Workspace write** (agents write docs, calendar, email)
- **Webhook system** (react to events)
- **Advanced analytics** (trend detection, anomaly alerts)
- **Prompt A/B testing** (compare skill versions at scale)

---

## Next steps for enterprise evaluation

1. **Review [core features](core-features.md)** — see the management capabilities
2. **Read [use cases](use-cases.md)** — identify your highest-ROI scenario
3. **Study the [architecture](architecture.md)** — confirm fit with your stack
3. **Contact us** — we're onboarding design partner organizations

<div style="text-align: center; padding: 2rem 0; margin-top: 2rem; border-top: 1px solid #e0e0e0;">
<h3>Let's talk</h3>
<p>Interested in piloting Dandori at your organization?</p>
<p>We're working with design partners running <strong>1,000+ engineers</strong>.</p>
<p><a href="mailto:hello@dandori.io"><strong>hello@dandori.io</strong></a></p>
</div>
