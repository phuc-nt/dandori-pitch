---
layout: default
title: AIPF Product Value
nav_exclude: true
search_exclude: true
description: "How Dandori makes each AIPF product more valuable — talking points for AIPF product owners."
---

# How Dandori makes each AIPF product more valuable

**Audience:** AIPF product owners and platform architects.
**Purpose:** Answer the single question every AIPF product team will ask before they let Dandori wrap their product: *"What's in it for my product?"*

**The short answer:**

> Dandori is not a competitor. It is **the organizational outer harness** that gives your AIPF product the [5 pillars]({% link harness-engineering.md %}#the-5-pillars-of-outer-harness) it's missing: Cost Attribution, Knowledge Flow, Task Tracking, Quality Gates, and Audit & Analytics. Wrapping your product with Dandori turns it from "a great technical tool" into "a great technical tool that is org-ready, audited, cost-attributed, and dual-audience." Your adoption goes up. Your perceived value goes up. Your compliance story writes itself.

---

## The pattern (applies to every AIPF product)

Every AIPF product has two kinds of users today:

1. **Individual engineers** who love the technical capability
2. **Leadership** who keep asking "how is this being used? how much does it cost? what's the ROI? is it safe?"

Each AIPF product team either has to:

- Build its own outer harness (context governance, cost attribution, audit, quality gates, compliance export) — *expensive, duplicated across 8 products*
- Punt the question to "the platform team" — *the platform team doesn't exist in most orgs*
- Lose the enterprise deal — *because the enterprise can't answer leadership's questions*

**Dandori solves this once, for all AIPF products simultaneously.**

```
  Without Dandori                       With Dandori

  Each AIPF product must                Each AIPF product focuses on
  build its own outer harness:          its core execution capability.
                                        Dandori provides the 5 pillars
  ┌──────┐ + 5 pillars (dup)            for all of them.
  │ Prod │
  └──────┘                              ┌──────────────────────┐
  ┌──────┐ + 5 pillars (dup)            │       DANDORI        │
  │ Prod │                              │  outer harness       │
  └──────┘                              │  (one implementation)│
  ┌──────┐ + 5 pillars (dup)            └──────────┬───────────┘
  │ Prod │                                         │
  └──────┘                              ┌──────────┴───────────┐
  × 8                                   │  all 8 AIPF products │
  = 40 features to build                │                      │
                                        └──────────────────────┘
                                        = 5 pillars, built once
```

---

## Product-by-product value story

### 1. MultiAgent Runtime

**Runtime's strength:** Fast, reliable agent execution with sub-agent context isolation, sandbox, tool loop. Inner harness done right.

**What Runtime is missing for enterprise adoption:**
- No org-wide context governance (every team reinvents system prompts)
- No cost attribution per task (only per-agent at best)
- No approval gates (runtime runs to completion; human review is out-of-band)
- No audit log that ties runs to policy violations
- No way for leadership to see fleet-wide performance

**What Dandori adds on top of Runtime (the 5 pillars):**
- **Organizational outer harness** — 5-layer context, skills, sensors, approval, orchestration
- **Cost attribution down to task level** via adapter telemetry
- **Quality gates + inline sensors** so agents self-correct before human review
- **Audit log + compliance export** covering every run
- **Fleet dashboards** for leadership

**Why this helps Runtime:** Every enterprise objection to Runtime ("I can't audit it, I can't budget it, I can't approve it") gets answered without Runtime having to build any of it. Runtime can focus on what it does best: running agents well.

**One-sentence pitch to Runtime team:** *"We wrap your runtime with the organizational layer that makes it enterprise-adoptable — so you can stay focused on runtime performance."*

---

### 2. GenAI Gateway

**Gateway's strength:** Model routing, rate limiting, provider abstraction, billing aggregation.

**What Gateway is missing:**
- Billing is aggregate — no per-task / per-team / per-agent breakdown
- No cost attribution to business units
- No budget ceilings at agent or project level
- No spike detection tied to agent behavior

**What Dandori adds on top of Gateway:**
- Subscribes to Gateway billing events, **enriches with agent/task/project metadata**
- Per-project / per-team / per-agent / per-phase cost breakdown dashboards
- Budget ceilings per agent (hard stop) and per project (soft alert)
- Spike detection correlated with task/prompt changes

**Why this helps Gateway:** Gateway's billing becomes the "raw ledger" and Dandori becomes the "business intelligence layer." Gateway doesn't need to build BI dashboards; Dandori does it once for every billing event Gateway emits.

**One-sentence pitch to Gateway team:** *"We make your billing data actionable for finance and engineering managers — you stay the source of truth, we make it queryable."*

---

### 3. Sentinel

**Sentinel's strength:** Security scanning, threat detection, vulnerability flagging.

**What Sentinel is missing:**
- Events fire in isolation — no link to which task / agent / project caused them
- Compliance teams can't correlate security events with business actions
- No replay: "what was the agent doing when Sentinel fired?"

**What Dandori adds on top of Sentinel:**
- **Event correlation** — every Sentinel event linked to agent run, task, project, team
- **Inferential sensor** — Sentinel becomes a gate in Dandori's quality pipeline
- **Replay** — full prompt + context version + output available when a Sentinel event is investigated
- **Compliance packs** combining Sentinel events + approval records + context versions

**Why this helps Sentinel:** Sentinel becomes the brain of the compliance story. Enterprise compliance teams buy Dandori + Sentinel as a package because they can finally answer "what, when, who, and in what context."

**One-sentence pitch to Sentinel team:** *"We turn your security events into compliance evidence by correlating them with agent activity — you stay the detector, we make the story."*

---

### 4. MCP Hub

**MCP Hub's strength:** Hosts MCP servers, standardizes tool protocol, shares tools across agents.

**What MCP Hub is missing:**
- No org-wide allow-list per agent or per team
- No description governance (bad descriptions burn context for everyone)
- No tool usage analytics (which tools are actually used vs just registered)
- No tool description versioning / rollback

**What Dandori adds on top of MCP Hub:**
- **Tool governance layer** — per-agent allow-list, per-team policy, security team veto
- **Description linting + versioning** — MCP Hub hosts tools, Dandori versions their descriptions
- **Usage analytics cross-fleet** — which tools burn the most context budget
- **Allow-list enforcement** via Dandori adapter

**Why this helps MCP Hub:** MCP Hub becomes the tool store; Dandori becomes the tool shelf manager. Hub doesn't need to build RBAC / policy / analytics; it delegates those to the layer above.

**One-sentence pitch to MCP Hub team:** *"We add the governance layer you'd have to build for enterprise — so you can stay focused on protocol quality and tool hosting."*

---

### 5. AI Developer

**AI Developer's strength:** Developer-focused AI workflows, code suggestions, in-IDE helpers.

**What AI Developer is missing:**
- No org-wide policy injection (company coding standards)
- No cross-developer sharing of proven prompts
- No audit of AI-assisted changes
- No quality trend per team

**What Dandori adds on top of AI Developer:**
- **Context Hub** pushes company coding standards into every AI Developer session automatically
- **Skill Library** lets a senior engineer publish a review pattern that every AI Developer user picks up day 1
- **Quality gates** produce trend data per team
- **Audit log** makes AI-assisted changes traceable

**Why this helps AI Developer:** AI Developer becomes the front-end experience; Dandori becomes the backend policy engine. Adoption by enterprises who demand "explain every AI-assisted change in Q3" becomes possible.

**One-sentence pitch to AI Developer team:** *"We inject org context into every session and audit every change — so you can sell into compliance-heavy orgs without building compliance yourself."*

---

### 6. AgentMemory

**AgentMemory's strength:** Per-agent learned memory, bottom-up, session-aware.

**What AgentMemory is missing:**
- No top-down context governance (the *should know*, as opposed to *has learned*)
- No org-wide memory federation for leadership visibility

**What Dandori adds on top of AgentMemory:**
- **Context Hub is the top-down complement** — "what this agent *should* know"
- AgentMemory remains the bottom-up "what this agent *has* learned"
- Together: full cognitive model per agent
- Dashboard shows both side-by-side per agent

**Why this helps AgentMemory:** Not competition — **complement**. AgentMemory stays in its lane (bottom-up learning) and Dandori covers the top-down lane (policy governance). The two-way story is more compelling than either alone.

**One-sentence pitch to AgentMemory team:** *"You cover what agents learn; we cover what agents should know. Together we give the full cognitive picture — and neither of us has to build the other's half."*

---

### 7. App Catalog

**App Catalog's strength:** Catalog of AI-powered apps / agents, discoverable, shareable.

**What App Catalog is missing:**
- Catalogs apps and tools, not the **knowledge** (prompts, patterns) that goes into them
- No versioning of reusable prompt knowledge
- No way to "inherit" a proven pattern into a new agent at creation time

**What Dandori adds on top of App Catalog:**
- **Skill Library** = catalog of reusable prompt knowledge (complements App Catalog's tool catalog)
- Skills are versioned, many-to-many attached to agents
- New agents created via App Catalog can pre-attach skills from Dandori
- Analytics: which skills are used across which apps

**Why this helps App Catalog:** Two catalogs, one ecosystem. App Catalog catalogs executables; Skill Library catalogs knowledge. Users discover via App Catalog, then instantly inherit proven patterns via Skill Library.

**One-sentence pitch to App Catalog team:** *"Our Skill Library is the knowledge catalog that sits next to your app catalog — two complementary stores, one discovery surface."*

---

### 8. Data Hub

**Data Hub's strength:** Data classification, data sources, controlled data access for agents.

**What Data Hub is missing:**
- Data classification tags don't propagate into agent prompts automatically
- No audit of "which prompt touched which classified data"
- No policy: "agent X cannot use PII-tagged context"

**What Dandori adds on top of Data Hub:**
- **Context Hub inherits Data Hub tags** — PII classification flows into context layers
- **Policy enforcement**: agents can be restricted to non-PII context via Dandori hooks
- **Audit**: every run logs which Data Hub-sourced context (and its classification) was used

**Why this helps Data Hub:** Data Hub's classifications finally get enforced at the agent prompt level, not just at the data query level. This is the missing piece for enterprise data governance.

**One-sentence pitch to Data Hub team:** *"Your classifications finally reach the prompt. We enforce your tags in every agent run — you stay the source of truth, we enforce it."*

---

## The common thread — every pitch is the same shape

| Pattern | Example |
|---|---|
| **"You stay X, we add Y"** | Runtime stays the runtime; Dandori adds org governance |
| **"You don't have to build the other half"** | Gateway doesn't build BI; Dandori does |
| **"We make your product enterprise-ready"** | MCP Hub becomes enterprise-viable via Dandori governance |
| **"Two complementary halves"** | AgentMemory + Context Hub = full cognitive model |
| **"We bring your signals to compliance"** | Sentinel events become compliance evidence |

**None of these are zero-sum.** Every AIPF product gets more adoption, higher perceived value, and easier enterprise sales — *without building any of the governance features themselves*.

---

## Objection handling — what AIPF PMs will actually ask

### "You're going to wrap my product — does that mean you control the customer relationship?"

No. Dandori sits on top but doesn't own the user. Engineers still interact with runtime / IDE / CLI directly when appropriate. Dandori is the **org surface**, not a new UX replacement. Your product keeps its brand and its customer touchpoints.

### "What if Dandori rewrites my governance features badly?"

The pitch is the opposite — *we already did the work*. Review Dandori's Context Hub, Skill Library, Audit Log, Cost Attribution. If any of them falls short, we iterate based on your feedback before integrating with your product.

### "What if my product already has [feature X]?"

Then we don't duplicate. Dandori explicitly maps overlap cases in [aipf-integration.md]({% link aipf-integration.md %}). Examples: Dandori does NOT do billing (Gateway does), does NOT host MCP servers (MCP Hub does), does NOT run agents (Runtime does). We delegate and consume.

### "What does integration cost my team?"

One API contract per integration point: billing webhook (Gateway), event stream (Sentinel), runtime invocation (Runtime), tool registry API (MCP Hub). Typically 1-2 weeks of PM alignment + 2-4 weeks of engineering per product. Shared with our team.

### "Are you replacing our dashboards?"

No. Dandori adds **cross-product dashboards** (cost across Gateway + Runtime, compliance across Sentinel + approvals). Your product-specific dashboards stay. Users go to yours for deep dives, Dandori for the fleet view.

### "What if we want to build this ourselves?"

You can. Each AIPF product would need to implement the 5 outer harness pillars (cost attribution, knowledge flow, task tracking, quality gates, audit & analytics). Multiplied by 8 products, that's massive duplication. Dandori implements those 5 pillars once, usable by all 8 — versioned, audited, compliance-ready, with dual-audience dashboards. The build-vs-buy math is heavily in favor of buy.

---

## The ask

Each AIPF product team gets:

1. A **technical integration meeting** — concrete API contract, no surprises
2. A **value demo on your actual data** — 4-week pilot using your billing / event / runtime feed
3. A **joint customer success story** — first enterprise that adopts Dandori + your product gets mentioned in both case studies
4. **Roadmap input** — your PM gets a seat on Dandori's outer harness roadmap for features touching your product

---

## The slogan

> **AIPF runs the agents. Dandori runs the org that runs the agents.**
>
> Every AIPF product is better inside Dandori than outside. None of them are smaller.

---

## Next steps

- [AIPF Integration →]({% link aipf-integration.md %}) — Full integration architecture (also hidden from nav)
- [Outer Harness →]({% link harness-engineering.md %}) — The 5 pillars and why Dandori is the outer harness for AIPF
- [Core Features →]({% link core-features.md %}) — 13 modules organized under the 5 pillars
