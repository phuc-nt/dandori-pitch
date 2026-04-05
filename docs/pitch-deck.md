# Presentation Guide

*Whiteboard script — each section is one drawing beat. Start with a blank board. Add only what the script says, nothing else.*

---

## Beat 1 — The engineers

**Say:** "Let's start with your engineers. Today, 2026. A 10,000-person engineering org."

**Draw:**

```
  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]

  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]

  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]

              ... × 10,000
```

---

## Beat 2 — Each engineer has an agent

**Say:** "Each of them has an AI coding agent. Claude Code, Cursor, Codex — pick your flavor. The agents write real code. They ship to production."

**Draw:** (add arrows from each engineer down to an agent bubble)

```
  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]
    │      │      │      │      │
    ▼      ▼      ▼      ▼      ▼
  (agent)(agent)(agent)(agent)(agent)

              ... × 10,000
```

---

## Beat 3 — The agents talk to AI providers

**Say:** "Every agent call hits an AI provider — Anthropic, OpenAI, whoever. Tokens burn. Money flows out."

**Draw:** (add a cloud at the bottom, all agents point to it)

```
  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]
    │      │      │      │      │
  (agent)(agent)(agent)(agent)(agent)
    │      │      │      │      │
    └──────┴──────┼──────┴──────┘
                  │
                  ▼
          ┌───────────────┐
          │  AI Providers │
          │  $$$  / month │
          └───────────────┘
```

---

## Beat 4 — The bill arrives

**Say:** "End of month. A bill arrives. $240,000. That's it. One number. No breakdown."

**Draw:** (add a box on the side, disconnected from everything)

```
  [Eng]  [Eng]  [Eng]  ...
    │      │      │
  (agent)(agent)(agent) ...
    └──────┴──────┘
           │
           ▼
   ┌───────────────┐         ┌──────────────┐
   │  AI Providers │         │  BILL        │
   │               │         │  $240,000    │
   └───────────────┘         │              │
                             │  ???         │
                             └──────────────┘
```

**Say:** "Which team? Which feature? Which prompt is burning the most? You can't answer any of it."

---

## Beat 5 — The context problem

**Say:** "Worse: what does the agent actually know? Each engineer pastes whatever they remember into the prompt. Today."

**Draw:** (add messy sticky notes floating above agents)

```
 [copy-paste] [forgot policy] [stale docs] [personal notes]
      │              │               │              │
  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]
    │      │      │      │      │
  (agent)(agent)(agent)(agent)(agent)
```

**Say:** "Company policy updated last week? Three engineers know. Seven don't. The agent doesn't."

---

## Beat 6 — The governance gap

**Say:** "And when something goes wrong — migration breaks prod, agent writes insecure code — you ask: who approved this?"

**Draw:** (add a question mark cloud between engineers and agents)

```
  [Eng]  [Eng]  [Eng]
    │      │      │
    ?      ?      ?      ← who approved? when? why?
    │      │      │
  (agent)(agent)(agent)
           │
           ▼
      💥 prod incident
```

**Say:** "The answer is a Slack thread. Maybe. If it exists."

---

## Beat 7 — Dandori goes in the middle

**Say:** "This is the gap Dandori fills. One layer. Between your engineers and their agents."

**Draw:** (draw a horizontal bar between engineers and agents — this is the key moment)

```
  [Eng]  [Eng]  [Eng]  [Eng]  [Eng]
    │      │      │      │      │
    └──────┴──────┼──────┴──────┘
                  │
         ┌────────────────┐
         │    DANDORI     │
         │  (mgmt layer)  │
         └────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
 (Claude)      (Codex)      (custom)
    └─────────────┼─────────────┘
                  │
                  ▼
          ┌───────────────┐
          │  AI Providers │
          └───────────────┘
```

**Say:** "Dandori does not replace the agents. It manages them."

---

## Beat 8 — Cost attribution

**Say:** "First thing Dandori gives you: cost attribution. Every token logged — which agent, which task, which project, which team."

**Draw:** (expand the Dandori box, add a cost module inside it)

```
         ┌──────────────────────────────┐
         │            DANDORI           │
         │                              │
         │  ┌──────────────────────┐    │
         │  │  Cost attribution    │    │
         │  │  per agent / team /  │    │
         │  │  project / feature   │    │
         │  └──────────────────────┘    │
         └──────────────────────────────┘
```

**Say:** "That $240K bill? Now it reads: payments team $52K, auth $38K, data pipeline $29K. Drill down to individual prompts."

---

## Beat 9 — Context hierarchy

**Say:** "Second: context. Instead of copy-paste, a five-layer hierarchy. Every agent inherits it automatically."

**Draw:** (add a stack on the left of the Dandori box)

```
  ┌─────────────┐     ┌──────────────────────────────┐
  │ 1. Company  │     │            DANDORI           │
  │ 2. Project  │────▶│                              │
  │ 3. Team     │     │  ┌──────────────┐            │
  │ 4. Agent    │     │  │ Cost         │            │
  │ 5. Task     │     │  ├──────────────┤            │
  └─────────────┘     │  │ Context hub  │            │
                      │  └──────────────┘            │
                      └──────────────────────────────┘
```

**Say:** "Update the company security policy once. Every agent sees it on the next run. Versioned. Rollback-able. Audited."

---

## Beat 10 — Approval gates

**Say:** "Third: approval gates. High-risk tasks — database migrations, infra changes — stop here until a human approves."

**Draw:** (add approval module inside Dandori, add a gate symbol on the flow)

```
  ┌─────────────┐     ┌──────────────────────────────┐
  │ Context     │     │            DANDORI           │
  │ layers      │────▶│                              │
  └─────────────┘     │  ┌──────────────┐            │
                      │  │ Cost         │            │
  [Eng] ──────────────┤  ├──────────────┤            │
  reviews & approves  │  │ Context hub  │            │
         ▲            │  ├──────────────┤            │
         │            │  │ ⛔ Approval  │            │
         └────────────│  │   gate       │            │
                      │  └──────────────┘            │
                      └──────────────────────────────┘
```

**Say:** "Every approval logged: who, when, what they saw. One export for your compliance team."

---

## Beat 11 — Quality gates

**Say:** "Fourth: quality gates. Before any output is accepted, automated scanners run."

**Draw:** (add quality gate as a pipeline below Dandori before agents)

```
         ┌──────────────────────────────┐
         │            DANDORI           │
         │  Cost │ Context │ Approval   │
         └──────────────────────────────┘
                          │
               ┌──────────▼──────────┐
               │   Quality gates     │
               │  TypeCheck → Lint   │
               │  → Tests → Score    │
               └──────────┬──────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           (Claude)    (Codex)    (custom)
```

**Say:** "Every run gets a quality score 0–100. You can see which agents improve over time, which degrade."

---

## Beat 12 — Skill library

**Say:** "Fifth: skills. Your best prompts, centralized. New engineer joins — they inherit the team's proven prompts on day one."

**Draw:** (add a skills box feeding into the context stack)

```
  ┌─────────────┐
  │ Skill lib   │
  │ api-security│
  │ code-review │
  │ test-gen    │
  └──────┬──────┘
         │ auto-attach
         ▼
  ┌─────────────┐     ┌──────────────────────────────┐
  │ Context     │     │            DANDORI           │
  │ layers      │────▶│  Cost │ Context │ Approval   │
  └─────────────┘     │  Quality gates │ Skills      │
                      └──────────────────────────────┘
```

**Say:** "Engineer leaves. Their prompts stay. Knowledge doesn't walk out the door anymore."

---

## Beat 13 — The complete picture

**Say:** "Here's what the board looks like at the end. This is what Dandori gives you."

**Draw:** (full picture — everything connected)

```
  ┌────────────────────────────────────────────────────────┐
  │                   ENGINEERING ORG                      │
  │  [CTO]  [Security]  [Compliance]  [Platform]           │
  │     │        │           │             │               │
  │     └────────┴───────────┴─────────────┘               │
  │                          │  set policy / review        │
  └──────────────────────────┼────────────────────────────┘
                             │
  ┌──────────────────────────▼────────────────────────────┐
  │                        DANDORI                        │
  │                                                       │
  │   Cost attribution   │   5-layer context             │
  │   Approval gates     │   Quality gates               │
  │   Skill library      │   Audit log                   │
  │   Task DAGs          │   Cross-agent analytics       │
  │                                                       │
  └──────────────────────────┬────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           (Claude)       (Codex)       (custom)
              └──────────────┼──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │         AI Providers        │
              │   Anthropic · OpenAI · ...  │
              └─────────────────────────────┘
```

**Say:** "Your engineers still use Claude Code, Cursor, Codex — whatever they love. Dandori is the management layer on top. That's the missing piece."

---

## Beat 14 — The close

**Say:** "Every org with 100+ engineers will need this by end of 2026. Same pattern as DevOps tools in the 2010s, observability in 2015, feature flags in 2020. Dandori is the consolidation layer for AI agents."

**Leave on board:**

```
  BEFORE DANDORI          WITH DANDORI

  $240K → ???             $240K → payments $52K
                                → auth     $38K
                                → data     $29K

  copy-paste prompts      5-layer context, versioned

  "who approved?" →       logged: alice, 14:22,
  Slack thread maybe      rationale attached

  engineer leaves →       skills stay in org
  knowledge gone          new hire inherits day 1
```

**Say:** "We're onboarding design-partner organizations running 1,000+ engineers. If this is your problem — let's talk."

---

## Speaker notes

- **Total time:** 20–30 min with questions
- **Beats 1–6:** 5 min — the problem. Let it land. Don't rush to the solution.
- **Beat 7:** pause after drawing the Dandori bar. Let the audience sit with it.
- **Beats 8–12:** 10 min — each capability is one drawing stroke. Keep the diagram clean.
- **Beat 13:** 3 min — step back from the board, let them look at the full picture.
- **Beat 14:** 2 min — close + CTA.
- **Questions:** Draw on the board as you answer. The diagram is your tool.

---

*Reference pages: [Why Dandori](why-dandori.md) · [Core Features](core-features.md) · [Use Cases](use-cases.md) · [Architecture](architecture.md) · [Enterprise](enterprise.md)*
