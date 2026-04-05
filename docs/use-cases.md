# Use Cases

Real workflows you can deploy today. Each pattern uses Dandori's primitives (projects, agents, tasks, context, approvals) to solve a concrete problem.

---

## 1. Automated code review team

**Problem:** PR review queue is a bottleneck. Senior engineers spend 30% of their week on mechanical review (style, security, test coverage).

**Pattern:**

```
Project: "Code Review"
├── Agent: "Reviewer-Security"  (skills: owasp, secret-scanning, auth)
├── Agent: "Reviewer-Style"     (skills: eslint, naming, structure)
├── Agent: "Reviewer-Tests"     (skills: coverage, edge-cases, mocking)
└── Agent: "Reviewer-Docs"      (skills: api-docs, changelog)
```

**Flow:**

1. CI webhook triggers Dandori task on PR open: `POST /api/tasks`
2. Task assigned to `Reviewer-Security` first (skill match)
3. Agent reviews diff, writes findings to task comments
4. Task marked `in_review` with `needs_approval=true`
5. Senior engineer approves/rejects based on agent findings
6. Findings posted back to GitHub PR

**Context injection:**
- **Company:** Security policies, compliance requirements
- **Project:** Service-specific threat model
- **Agent:** Role-specific checklist (OWASP top 10)
- **Task:** The PR diff + linked tickets

**Value:** Senior engineers review 3× faster. Mechanical issues caught before human eyes. Audit log shows what was checked + approved.

---

## 2. Documentation bot

**Problem:** Docs drift. Nobody updates `README.md` when APIs change. New hires can't onboard.

**Pattern:**

```
Project: "Docs Automation"
└── Agent: "DocsBot"  (skills: api-docs, markdown, mermaid)
```

**Flow:**

1. Nightly cron: `dandori tasks create --title "Sync docs for service X"`
2. Task context includes: OpenAPI spec path, existing docs path, recent commits
3. Agent compares API surface → existing docs, writes updates
4. Task marked `in_review` → tech writer approves
5. Approved docs committed via CI

**Context injection:**
- **Company:** Documentation standards (tone, structure)
- **Project:** Service's public API contract
- **Agent:** Template for API endpoint docs
- **Task:** Specific service + diff since last sync

**Value:** Docs stay within 24 hours of code. No more "docs say X but code does Y" bugs.

---

## 3. Test generation pipeline

**Problem:** Test coverage plateaus at 40%. Engineers skip writing tests under deadline pressure.

**Pattern:**

```
Project: "Test Coverage"
├── Agent: "UnitTestGen"         (skills: jest, vitest, mocking)
├── Agent: "IntegrationTestGen"  (skills: supertest, fixtures, db)
└── Agent: "EdgeCaseFinder"      (skills: property-testing, fuzzing)
```

**Flow:**

1. Coverage report identifies files with <50% coverage
2. Dandori creates tasks: one per low-coverage file, assigned to matching agent
3. Agent writes tests, runs them, iterates until passing
4. Quality gate: must not decrease existing coverage
5. Task marked `in_review` → engineer reviews test quality
6. Approved tests merged

**Context injection:**
- **Company:** Testing conventions, what NOT to test
- **Project:** Framework setup, fixture patterns
- **Agent:** Test style examples
- **Task:** Target file + existing tests + coverage gaps

**Value:** Coverage climbs 40% → 70%+ in one quarter. Engineers focus on complex scenarios, agents handle coverage grinding.

---

## 4. Research agent for technical decisions

**Problem:** Engineers spend days researching "should we use X or Y?" in Slack threads that die inconclusively.

**Pattern:**

```
Project: "Tech Decisions"
└── Agent: "Researcher"  (skills: comparison-matrix, benchmarks, pros-cons)
```

**Flow:**

1. Engineer creates task: "Evaluate Drizzle vs Prisma for new service"
2. Task context: performance requirements, team skills, existing stack
3. Researcher agent pulls docs, benchmarks, GitHub issues, community discussions
4. Writes structured comparison: criteria table, migration effort, risk assessment
5. Output attached to task for architecture review meeting

**Context injection:**
- **Company:** Approved vendors, licensing rules
- **Project:** Non-functional requirements
- **Agent:** Comparison matrix template
- **Task:** Specific decision + constraints

**Value:** Architecture decisions made in hours, not weeks. Consistent evaluation criteria. Decisions documented as side effect.

---

## 5. Incident response co-pilot

**Problem:** On-call engineer is paged at 3 AM. Needs to correlate logs, deploys, config changes fast.

**Pattern:**

```
Project: "Incident Response"
└── Agent: "IncidentBot"  (skills: log-analysis, root-cause, runbooks)
```

**Flow:**

1. PagerDuty webhook → Dandori task with alert details
2. Task marked `high` priority, `needs_approval` off (speed > approval)
3. Agent pulls: recent deploys, config changes, related alerts, runbook matches
4. Agent writes incident summary: likely cause, first mitigation step, escalation contact
5. Output posted to incident Slack channel within 60 seconds
6. Human confirms or redirects

**Context injection:**
- **Company:** Incident severity matrix, escalation policy
- **Project:** Service architecture, dependencies
- **Agent:** Runbook library
- **Task:** Alert payload + correlated data

**Value:** On-call engineers get 60-second summary instead of 15-minute context rebuild. MTTR drops significantly.

---

## 6. Compliance documentation for SOC2 / ISO27001

**Problem:** Auditors ask "show me your AI usage controls". You have 50 engineers using Claude, no central log.

**Pattern:**

```
Project: "Compliance"
└── All agents funnel through Dandori
```

**Flow:**

1. Org policy: "no direct Claude CLI usage, go through Dandori"
2. API keys gate all agent access (per-engineer, revocable)
3. Every run logged: who, what prompt, what context, what output
4. Approval gates enforced on production-impacting tasks
5. Quarterly: export audit log via API, hand to auditor

**Context injection:**
- **Company:** Data classification policies, PII handling rules
- **Project:** Data flow for each service
- **Agent:** What the agent is/isn't allowed to process
- **Task:** Specific data scope

**Value:** Compliance checkbox passes without custom tooling. Single source of truth for AI activity.

---

## 7. Multi-agent feature implementation

**Problem:** Feature spans frontend, backend, tests, docs. One engineer juggles context across 4 agents.

**Pattern:**

```
Project: "Feature X"
├── Agent: "Backend-Alice"    (skills: node, express, postgres)
├── Agent: "Frontend-Bob"     (skills: react, typescript, mui)
├── Agent: "Tester-Carol"     (skills: jest, playwright)
└── Agent: "DocsWriter-Dave"  (skills: api-docs, user-guide)
```

**Flow:**

1. Feature spec broken into tasks with dependencies:
   - `implement-api` (Alice, phase: implement)
   - `implement-ui` (Bob, phase: implement, depends on: implement-api)
   - `write-tests` (Carol, phase: test, depends on: implement-api, implement-ui)
   - `update-docs` (Dave, phase: maintain, depends on: write-tests)
2. Alice wakes up → builds API → task done
3. Auto-start triggers: Bob wakes up → builds UI
4. When both done → Carol wakes up → writes tests
5. Final step: Dave updates docs
6. Engineer reviews each step via approval gates

**Context injection:**
- Shared project context keeps all agents aligned
- Each agent gets task-specific spec + predecessor outputs
- Skills route the right agent to the right work

**Value:** Feature implementation parallelized safely. Engineer orchestrates, doesn't context-switch. Quality gates between phases catch mistakes early.

---

## 8. Skill library as company IP

**Problem:** Senior engineer's prompts are 10× better than junior's. That IP is locked in one person's text file.

**Pattern:**

```
Company-wide Skill Library:
├── "security-review"       (maintained by security team)
├── "performance-analysis"  (maintained by platform team)
├── "api-design"            (maintained by staff engineers)
└── "onboarding-checker"    (maintained by HR engineering)
```

**Flow:**

1. Skills are markdown files with frontmatter + reusable instructions
2. Attach skills to any agent: `POST /api/agents/:id/skills`
3. New agent inherits company expertise immediately
4. Skill updates propagate to all agents using it
5. Skill version history tracks evolution

**Value:** Tribal knowledge becomes organizational IP. Onboarding time cut. Consistency across teams.

---

## Common patterns across all use cases

### Context discipline
Every use case relies on the 5-layer context hierarchy. **Don't copy-paste context into prompts — define it once at the right layer.**

### Approval gates
Use them for production-impacting work (deploys, migrations, customer-facing changes). Skip them for low-risk or high-velocity work (incident response, test generation).

### Skill tags
Tag tasks with required skills. Dandori auto-suggests the best-matching agent. Build your skill library incrementally.

### Quality gates
Run scanners on every implementation task. Track quality score per agent over time. Fire agents whose quality trends downward.

### Dependencies
Model workflows as DAGs of tasks. Let Dandori auto-start dependent tasks. Don't hand-schedule agent wakeups.

---

## Getting started with your use case

1. Define the project scope and success metric
2. Identify which agents (skills + roles) you need
3. Define context at the appropriate layer (Company / Project / Team)
4. Pilot with one manual task
5. Once the pattern works, automate end-to-end

**Start small. Iterate. Expand.**

---

## Next steps

- **[Architecture →](architecture.md)** How Dandori enables these patterns
- **[Enterprise →](enterprise.md)** Security, scaling, and deployment
