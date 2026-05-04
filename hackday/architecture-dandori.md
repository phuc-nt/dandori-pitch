---
layout: default
title: "Hackday Architecture — Dandori"
nav_exclude: true
search_exclude: true
description: "Kiến trúc đề xuất Dandori — đủ để chứng minh tính khả thi từ con số 0."
---

# Kiến trúc Dandori — chứng minh khả thi

> Phụ lục cho [blog-dandori.md](blog-dandori.md). Mục tiêu: đủ để người không xem code vẫn tin **idea này build được trong thời gian hợp lý** — vì mỗi mảnh đều dùng tech có sẵn, không invent gì mới.

---

## 1. Tổng quan — 1 sơ đồ, 3 mảnh

```
       External:  Jira · Confluence · GitHub · Claude/Cursor/Copilot
                          ▲
                          │  (read-only API · webhook)
   ┌──────────────────────┴──────────────────────┐
   │              CLI (mỗi engineer)             │   ← Mảnh 1: Tracking
   │                                             │
   │   wrap AI tool ──▶ ghi run vào SQLite local │
   │                       │                     │
   │                       ▼                     │
   │                   sync ───────┐             │
   └───────────────────────────────┼─────────────┘
                                   │ batched events
                                   ▼
   ┌─────────────────────────────────────────────┐
   │            Server (1 instance / org)        │   ← Mảnh 2: Aggregate
   │                                             │
   │   ingest API · Jira/GitHub poller           │
   │              │                              │
   │              ▼                              │
   │         Postgres (cross-engineer)           │
   │              │                              │
   │              ▼                              │
   │   metric exporter (DORA · attribution)      │
   └──────────────────────────────────────────────┘
                                   │
                                   ▼
   ┌─────────────────────────────────────────────┐
   │            Dashboard (web)                  │   ← Mảnh 3: Analytics
   │   Overview · DORA · PO View · Tasks ·       │
   │   Agents · Costs · Quality · Audit          │
   └─────────────────────────────────────────────┘
```

**Ba mảnh, mỗi mảnh dùng tech đã được kiểm chứng** — không có chỗ nào yêu cầu nghiên cứu mới.

---

## 2. Mảnh 1 — Tracking (CLI wrapper)

### Cách làm

Engineer gõ `dandori claude "..."` thay vì `claude "..."`. Wrapper:

1. Fork process AI tool, capture stdout/stderr, đo thời gian
2. Tail log session của AI tool (Claude có file JSONL trong `~/.claude/sessions/`) → lấy tokens, cost, model
3. Đọc git diff trước/sau → biết file nào thay đổi
4. Ghi 1 hàng vào SQLite local

### Tại sao khả thi

| Concern | Tại sao OK |
|---|---|
| "Có chặn được tools nào AI tool hỗ trợ không?" | Không — wrapper chỉ ngồi ngoài, không patch internals. Claude/Cursor/Copilot đều xuất stdout + có log file đọc được. |
| "Engineer có chịu đổi command không?" | Cài alias `claude=dandori claude` — không cần đổi thói quen. |
| "Offline thì sao?" | SQLite local — không cần server. Sync sau. |
| "Layer parsing log có fragile không?" | Có. Nên thiết kế **3 layer**: wrapper (bắt buộc, luôn chạy) → log tailer (best-effort) → semantic events từ skills (opt-in). Layer 1 không bao giờ fail. |

### Stack đề xuất

- **Go** (cross-compile single binary, không Python/Node runtime)
- **SQLite** (file-based, zero-config, embed dễ)
- Cobra cho CLI commands

---

## 3. Mảnh 2 — Aggregate (Server + Pollers)

### Cách làm

Server chạy 1 instance / org, có 3 trách nhiệm:

1. **Ingest API**: nhận batch events từ CLI sync
2. **Jira poller**: định kỳ kéo issues, sprints, transitions → biết task nào closed lúc nào
3. **GitHub poller**: kéo commits, PRs, review time → biết human engineer làm gì
4. **Metric exporter**: định kỳ tính DORA + attribution snapshot vào Postgres

### Tại sao khả thi

| Concern | Tại sao OK |
|---|---|
| "Phải build pipeline kafka/airflow phức tạp?" | Không — volume nhỏ (vài trăm runs/ngày/org), Postgres đủ. Job scheduler dùng `cron` system hoặc `gocron`. |
| "Jira API có rate limit không?" | Có, nhưng poll mỗi 5–10 phút là dư. Đã có client SDK chính thức. |
| "Lead time tính sao cho chính xác?" | Dùng Jira transition log (`In Progress` → `Done`). Đây là cách DORA gốc tính, đã standard. |
| "GitHub đã có thông tin CI rồi cần gì thêm?" | GitHub không có cross-org dashboard. Dandori là tầng kết hợp: GitHub commits + Jira tickets + AI runs trên cùng key. |

### Stack đề xuất

- **Go** (cùng codebase với CLI, share types)
- **Postgres** (aggregation, JSON columns cho events)
- Atlassian Go SDK (Jira/Confluence Cloud API)
- `go-github` cho GitHub API

---

## 4. Mảnh 3 — Analytics (Dashboard)

### Cách làm

Web dashboard, server-rendered HTML + JS modules theo view:

- **Overview** — KPI cards, cost trend, agent performance
- **DORA + G9** — 4 metric scorecard với traffic light, click expand modal
- **PO View** — sprint burndown, lead time histogram, throughput
- **Tasks** — sprint board, task lifecycle
- **Agents** — performance per agent
- **Costs** — breakdown by project/team/department
- **Quality KPI** — regression rate, bug rate, cost-quality adjusted
- **Audit** — hash-chain log + verify

### Tại sao khả thi

| Concern | Tại sao OK |
|---|---|
| "Dashboard build phức tạp không?" | Không — htmx + Chart.js UMD, không bundler, không React build chain. |
| "DORA traffic light tính sao?" | DORA nhóm Google đã công bố ngưỡng (Elite/High/Medium/Low) cho từng metric. Dùng số đó. |
| "Cost-quality adjusted là gì?" | Cost / quality_score. Quality score từ quality gate (lint delta + test delta + AC completion). Đã có tools tính được từng phần. |
| "6 cấp filter (agent → engineer → task → team → project → department) có khả thi?" | Có — chỉ là index Postgres + WHERE clause. Heavy lifting nằm ở data model, không phải UI. |

### Stack đề xuất

- Server-side template (Go `html/template`)
- htmx cho interactivity (no bundler)
- Chart.js UMD cho charts
- ES6 modules cho widget logic

---

## 5. Audit chain — chỗ duy nhất "không tin gì cả"

> Đây là điểm khác biệt quan trọng. Mọi mảnh khác có thể fail rồi recover, nhưng audit chain phải **tamper-evident**.

```
audit_log:  id │ timestamp │ event_type │ payload │ prev_hash │ curr_hash
                                                      ▲             │
                                                      └─────────────┘
                                                  hash chain (Merkle-like)

audit_anchors:  ──▶  Confluence page (off-host witness)
                     1 row mỗi N giờ với (last_id, last_curr_hash)
```

**Cơ chế**: mỗi entry mới có `curr_hash = sha256(prev_hash || payload)`. Ai sửa giữa chừng → hash sai. Nhưng nếu rebuild cả chain (xóa rồi thêm lại) thì local verify vẫn pass — nên cần **witness ngoài**: Confluence page định kỳ snapshot tip hash. Verify cross-check chain với witness.

**Tại sao khả thi**: SHA256 là chuẩn ngành, không phải invent. Confluence có REST API page CRUD. UNIQUE constraint trên `last_audit_id` đảm bảo idempotent (re-anchor cùng tip không tạo row trùng).

---

## 6. Schema — đủ cho v1, không over-engineer

| Bảng | Vai trò | Kích thước ước tính |
|---|---|---|
| `runs` | 1 run = 1 lần wrap AI tool | ~500B/run |
| `events` | Layer 3 semantic events (optional) | ~200B/event |
| `audit_log` | append-only, hash-chain | ~300B/entry |
| `audit_anchors` | external anchor tới Confluence | ~150B/anchor |
| `task_attribution` | agent vs human line contribution per Jira task | ~250B/task |
| `quality_metrics` | rework rate, autonomy rate per run | ~200B/run |
| `metric_snapshots` | DORA cache (deploy freq, lead time, MTTR, change fail) | ~500B/snapshot |
| `jira_tasks` · `sprint_state` | Jira poller cache | ~400B/task |

**Volume estimate**: 1 org 50 engineer × 10 runs/ngày × 365 ngày × ~2KB/run = **~365MB/năm**. Postgres xử lý 100× con số đó dễ. SQLite local thì 1 engineer ~7MB/năm.

---

## 7. Cái khó nhất — và cách giải

### "Đo human và agent trên cùng thước đo"

| Bước | Nguồn data | Đã có chưa |
|---|---|---|
| Agent runs | Wrapper layer 1 (Dandori build) | Build mới |
| Human commits/PRs | GitHub API | Có sẵn |
| Task closed time | Jira transition log | Có sẵn |
| Lead time chuẩn DORA | Jira `In Progress` → `Done` | Công thức có sẵn |
| Mix slice (human/agent/mixed) | Group by `agent_name` (NULL = human) | Chỉ là SQL |

→ Mọi mảnh data đều có sẵn từ external system hoặc tự sinh từ wrapper. **Không có chỗ nào cần ML, NLP, hay reasoning AI**. Chỉ là pipeline + aggregation.

### "Quality gate đo bằng số, không tin AI"

| Metric | Cách đo | Tools |
|---|---|---|
| Lint delta | `golangci-lint run` trước/sau diff | có sẵn |
| Test delta | parse `go test -json` output | stdlib |
| Diff size | `git diff --shortstat` | git |
| Commit message score | regex check (conventional commits + length) | <50 lines code |
| AC completion | parse Jira ticket description | Atlassian SDK |

→ 5 chỉ số đơn giản, đo được, không cần AI tự chấm.

---

## 8. Risk thật + mitigation

| Risk | Mức | Mitigation |
|---|---|---|
| Wrapper layer 1 fail giữa run | Cao impact / thấp xác suất | Defer cleanup, log error vào table riêng, vẫn ghi partial run |
| Claude/Cursor đổi format log | Trung bình | Tailer là **best-effort**, không block layer 1; có version detection |
| Engineer bypass wrapper (chạy `claude` trực tiếp) | Trung bình | Detect qua process audit + nudge, không enforce hard |
| Postgres + Server downtime | Thấp impact | CLI vẫn chạy offline, sync resume khi server lên |
| Atlassian rate limit | Thấp | Backoff + cache poll interval |
| Cross-project privacy (data của project A leak sang B) | Cao impact | Filter ở DB query level, audit chain log mọi access |

---

## 9. Roadmap sơ bộ (giả định bắt đầu từ 0)

| Phase | Scope | Estimate |
|---|---|---|
| 0. Skeleton | CLI + SQLite schema + 1 wrapper layer | 1 tuần |
| 1. Layer 2/3 + audit chain | log tailer + semantic events + hash chain | 1 tuần |
| 2. Jira poller + Confluence integration | Atlassian Cloud API + sprint detection | 1 tuần |
| 3. Server + sync + Postgres | CLI sync, ingest API, aggregation | 1 tuần |
| 4. Dashboard v1 (3 view) | Overview + DORA + PO View | 1 tuần |
| 5. Quality gate + attribution | line-blame, rework rate, AC check | 1 tuần |
| 6. Hardening + GitHub poller | mix human+agent slice cho DORA | 1 tuần |

**Tổng: ~7 tuần / 1 senior dev**, hoặc **~3–4 tuần với 1 senior + AI agent assist** (đo qua dự án dandori-cli thật — xem [phụ lục hackday](blog-hackday-appendix.md)).

---

## 10. Kết — tại sao idea này khả thi

1. **Không invent gì mới**: SHA256 audit chain, Postgres aggregation, htmx dashboard, DORA metrics — tất cả đã được nhiều công ty dùng.
2. **Không cần AI để build AI tracking**: data flow là deterministic — wrap, parse log, aggregate, render.
3. **Volume không thách thức**: 1 org / năm ~vài trăm MB.
4. **Có lối thoát ở mọi mảnh**: layer 1 không cần layer 2/3, CLI không cần server, server không cần GitHub.
5. **Đã có dandori-cli làm pilot**: chứng minh cả 7 phase build được trong thời gian thực, có dashboard chạy thật, có audit chain verify được.

Idea Dandori không phải "moonshot AI". Nó là **lớp glue giữa tools đã tồn tại** — và chính vì vậy nó khả thi.

---

*Quay lại blog: [blog-dandori.md](blog-dandori.md) · Slide: [slides-dandori-2min.html]({{ site.baseurl }}/hackday/slides-dandori-2min.html) · Phụ lục hackday: [blog-hackday-appendix.md](blog-hackday-appendix.md)*
