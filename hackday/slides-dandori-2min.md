---
layout: default
title: "Hackday Slides — Dandori (2 phút)"
nav_exclude: true
search_exclude: true
description: "Slide 2 phút thuyết trình hackday — Dandori, outer harness gọn nhẹ cho công ty mix human + agent."
---

# Dandori — 2 phút thuyết trình Hackday
{: .fs-9 }

> Bản rút gọn cho pitch nhanh. Hy sinh chiều sâu để giữ sắc nét. Bản blog đầy đủ: [blog-dandori]({{ site.baseurl }}/hackday/blog-dandori.html).

*Unlisted page — share the direct URL only.*

---

## Slide 1 — Hook (30 giây)

Mỗi tháng công ty trả hóa đơn AI. Sếp hỏi: *"Tiền này đi đâu?"* — không ai trả lời được.

Thử thêm vài câu nữa:

- 💸 **Tiền đi đâu?** Project nào, team nào, task nào ngốn nhiều nhất?
- 🎯 **Ai hiệu quả?** Team A và Team B — ai dùng AI tốt hơn, dựa trên gì?
- 🛡 **Chất lượng có đảm bảo?** Agent có bỏ test để pass nhanh không? Ai kiểm chứng?
- 🔍 **Sự cố thì truy ai?** Migration sập staging sáng nay — agent nào, ai approve?
- ⚖️ **Human vs agent?** Dev thật và AI, so sánh thế nào cho công bằng?

Không trả lời được **không phải lỗi AI**. Là **thiếu một lớp hạ tầng quản lý** — và đó là thứ đội tôi làm trong hackday này.

---

## Slide 2 — Dandori (25 giây)

Một công cụ. Hai việc. **Cho cả agent lẫn human engineer.**

- 📊 **Tracking** — mỗi run AI + mỗi commit/PR human (qua Jira + GitHub)
- 📈 **Analytics đa cấp** — agent · engineer · team · project · department

**Điểm khác biệt quyết định**: các tool khác chỉ quản AI. Dandori đặt **human và agent trên cùng thước đo** — vì tương lai công ty là **mix**, không phải thay thế.

---

## Slide 3 — Dashboard trả lời cả 6 câu hỏi (30 giây)

**[1 ảnh dashboard chiếm toàn slide]** — thiết kế ảnh gồm các khối sau:

```
┌─ DANDORI DASHBOARD ──────────────────────────────────────────────┐
│                                                                  │
│  💰 Cost by Department        🎯 Throughput by Engineer          │
│  ┌────────────────────┐      ┌──────────────────────────────┐    │
│  │ Platform   ████    │      │ alice+alpha  cao   nhanh     │    │
│  │ Growth     ██      │      │ bob (human)  TB    chậm hơn  │    │
│  │ Data       █       │      │ carol+beta   TB    nhanh ⚠   │    │
│  └────────────────────┘      └──────────────────────────────┘    │
│                                                                  │
│  🚦 DORA Scorecard            🔍 Audit Chain (last 24h)          │
│  ┌────────────────────┐      ┌──────────────────────────────┐    │
│  │ Deploy freq   🟢   │      │ PAY-142  alice → alpha  ✓    │    │
│  │ Lead time     🟢   │      │ PAY-151  agent beta    ⚠     │    │
│  │ Change fail % 🔴   │      │ AUTH-77  bob (manual)   ✓    │    │
│  │ MTTR          🟢   │      │ chain verified · anchor ✓    │    │
│  │ (mix H+A)          │      └──────────────────────────────┘    │
│  └────────────────────┘                                          │
│                                                                  │
│  📊 Human vs Agent — same metric, same dashboard                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ AC completion:  Human ▓▓▓▓▓▓▓▓▓▓                        │    │
│  │                 Agent ▓▓▓▓▓▓▓▓▓▌                        │    │
│  │ Cycle time:     Human ▓▓▓▓▓▓▓▓                          │    │
│  │                 Agent ▓▓▓▓▓                              │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

Một dashboard — trả lời **cả 6 pain point** ở Slide 1.

---

## Slide 4 — Giá trị thật (35 giây)

Dandori không thay đổi cách dev dùng AI. Nó thay đổi cách **quản lý** dùng AI:

- **Trước**: sếp **đoán** team nào hiệu quả, đầu tư AI có đáng không.
  **Sau**: sếp **nhìn dashboard, nói chuyện bằng số**.

- **Trước**: "chất lượng AI" là **ý kiến cá nhân**.
  **Sau**: ngưỡng config sẵn, metric đo, audit chain có witness ngoài — không sửa lén được.

- **Trước**: "hiệu quả" mỗi công ty đo một kiểu, không so sánh được.
  **Sau**: dùng **DORA** — chuẩn ngành — và **mở rộng cho mix human + agent**.

> **Thay đổi cốt lõi**: từ cảm tính → dữ liệu. Từ tin lời → nhìn số.

---

## Slide 5 — Close (10 giây)

> Câu hỏi cũ: *"AI có thay được developer không?"*
> Câu hỏi đúng: *"**Công ty có đủ kỷ luật process để AI làm việc hiệu quả không?**"*

Hackday này chúng tôi trả lời **có** — và đưa luôn công cụ để công ty bắt đầu ngay tuần sau.

---

## Timing guide

| Slide | Thời lượng | Điểm mấu chốt |
|---|---|---|
| 1. Hook | 30s | 6 pain point nhức nhối |
| 2. Dandori | 25s | **Mix human+agent** |
| 3. Dashboard | 30s | 1 ảnh — trả lời cả 6 pain point |
| 4. Giá trị | 35s | Trước/Sau — cảm tính → dữ liệu |
| 5. Close | 10s | Câu hỏi đúng |
| **Tổng** | **~2 phút 10s** | Buffer ngắn cho transitions |

Live demo (cross-project analytics) thực hiện **sau** phần thuyết trình — không tính giờ pitch.

---

## Gợi ý thiết kế ảnh Slide 3

Ảnh dashboard nên có 5 khối (theo thứ tự đọc mắt Z-pattern):

1. **Top-left**: Cost by Department — bar chart ngang, scale tương đối
2. **Top-right**: Throughput by Engineer — bảng mix human + `human+agent` cặp
3. **Mid-left**: DORA Scorecard — 4 metric chuẩn ngành (deploy freq, lead time, change fail %, MTTR) traffic light 🟢/🟡/🔴, ghi chú "mix H+A"
4. **Mid-right**: Audit Chain — list 3-4 entry gần nhất với ✓/⚠ + dòng `chain verified · anchor ✓`
5. **Bottom full-width**: Human vs Agent — 2 metric (AC completion, cycle time) với bar đối xứng

Màu: xanh lá (OK), vàng (cảnh báo), đỏ (dưới ngưỡng). Font mono cho cột data.
Tránh số tuyệt đối — dùng nhãn định tính (cao/TB/thấp, nhanh/chậm, OK/⚠) để không bị soi metric chưa kiểm chứng.

---

# Appendix

> Phần phụ — không phải nội dung pitch chính. Dành cho Q&A hoặc khi pitch dài hơn.

## A. Phạm vi hackday — chọn 1 use case đắt giá để demo

Một ngày không build được cả Dandori. Đội tôi chuẩn bị **design document đầy đủ** trước hackday + dataset mẫu + module foundation. Trong ngày, focus vào **một use case duy nhất**.

**Use case chọn**: **Cross-project analytics — 1 dashboard trả lời câu hỏi tiền AI của sếp.**

### Setup trước hackday

- Dataset cross-project sẵn (multi-project, multi-sprint, multi-run)
- Mix human commits + agent runs (Jira + GitHub đã sync)
- Metrics đã tính: cost by department, throughput by engineer, cycle time, AC completion
- Dashboard render được

### Trong ngày — cái thật sự ship

**Action duy nhất**: kích hoạt 1 run thật end-to-end → chèn data mới vào dataset có sẵn → dashboard tự refresh → dòng mới xuất hiện.

### Demo flow (sau pitch, không tính giờ)

```
# Trước: dashboard show dataset chuẩn bị sẵn
$ open http://localhost:3200/dashboard

# Live action: chạy 1 task thật
$ dandori claude "Add --json flag to dandori analytics cost"
[claude code chạy, edit file, commit]
✓ Run captured: PAY-189 · alice+alpha

# Refresh dashboard
[hàng mới ở Throughput, Cost cập nhật, Audit trail có entry mới]
```

### Story 3 lớp khi demo

1. **Data có sẵn** → analytics đa cấp hoạt động với data thật
2. **Live capture** → tracking không cần config thêm, không thay đổi thói quen dev
3. **Mix human + agent** → cùng dashboard, cùng thước đo

### Risk + mitigation

- Live `claude` chạy có thể chậm/fail → pre-record GIF backup + task cực nhỏ
- Dashboard không auto-refresh → có nút refresh hoặc deep-link tới run drawer

---

## B. Dùng AI agent build Dandori

> Bằng chứng meta — sản phẩm giải bài toán AI trong dev cycle được build bằng đúng cách đó.

### B1. Quy trình 7 công đoạn

7 công đoạn × 5 task pattern (`plan / do / check / decide / record`):

| Công đoạn | plan | do | check | decide | record |
|---|---|---|---|---|---|
| Idea | H | H | H | H | B |
| Discovery & Design | B | B | B | H | B |
| Planning | B | A | B | H | A |
| Coding | B | A* | A | H | A |
| Testing | A | A* | A | H | A |
| Review & Docs | A | A | B | H | A |
| Release & Maintenance | B | B | B | H | B |

**H** = Human · **A** = Agent · **B** = Both · **A*** = Agent autonomous

Quan sát: agent mạnh ở **do + check**, yếu ở **decide**.

### B2. Top agent + skill dùng nhiều nhất

| Agent | Tần suất | Skill | Tần suất |
|---|---|---|---|
| `researcher` | ★★★★ | Hook injections (vô hình) | ★★★★★ |
| `tester` | ★★★★ | `/loop` autonomous | ★★★★ |
| `code-reviewer` | ★★ | `/ck:preview` (diagram) | ★★★ |
| `debugger` | ★★ | `chrome-devtools` (E2E) | ★★★ |
| `planner` | ★★ | `/ck:plan` | ★★ |

### B3. Bài học

1. Agent giỏi nhất ở **do + check** — đừng giao **decide**
2. **Plan rõ là điều kiện tiên quyết** — không có checklist → autonomous lạc đề
3. **Hook injection ROI cao nhất** nhưng vô hình
4. **`/loop` chỉ an toàn khi**: plan chốt + gate test rõ + commit local + rollback dễ
5. **Devlog format chuẩn** giúp agent viết nhất quán giữa các version

Tài liệu chi tiết: [`docs/agent-coding-workflow.md`](../../docs/agent-coding-workflow.md) — ma trận đầy đủ + phân tích ROI.

---

## C. Dandori tracking những data gì

Liệt kê sơ bộ — không bao gồm tất cả cột.

### Run-level (mỗi lần gọi AI hoặc mỗi commit/PR human)

- **Identity**: ai chạy (user, engineer_name, department), workstation, agent_name + agent_type
- **Task linkage**: jira_issue_key, jira_sprint_id, git_remote, git_head_before/after
- **Timing**: started_at, ended_at, duration_sec
- **Cost**: input_tokens, output_tokens, cache_read/write_tokens, model, cost_usd
- **Outcome**: exit_code, status (`running`/`done`/`failed`), session_end_reason
- **Interaction shape**: human_message_count, agent_message_count, human_intervention_count

### Event-level (chi tiết trong 1 run)

- **Events stream**: tool calls, file edits, test runs, error logs — timestamp + payload JSON
- **Quality metrics**: lint delta, test delta, diff size, AC completion score, commit message score
- **Audit log**: hash-chained entries (actor, action, target, details, prev_hash, curr_hash)
- **Audit anchors**: snapshots tip + Confluence witness page references

### Cross-source (sync từ ngoài)

- **Jira**: tasks, sprint membership, status transitions, AC checklist
- **GitHub**: commits, PRs, review time, merge time, labels
- **Confluence**: PBI design docs, audit witness pages
- **Buglinks**: liên kết run → bug được tạo ra (rework attribution)

### Aggregations (tính sẵn để query nhanh)

- **metric_snapshots** — daily aggregates: KPI strip, WoW deltas
- **task_attribution** — split công sức human vs agent trên cùng task

---

## D. Data Dandori → DORA cho mix human+agent

Cách 4 DORA metric được hiện thực hoá từ data có sẵn.

### Deploy frequency

- **Nguồn**: GitHub merges to main + tags + deploy events
- **Lát mix**: gắn mỗi merge với run(s) đã đóng góp commit (`git_head_after` ↔ commit SHA). Kết quả: deploy nào có agent contribute, deploy nào human-only
- **Hiển thị**: deploys/tuần, chia 3 lát (human-only / agent-touched / mixed)

### Lead time for changes

- **Nguồn**: `commit timestamp` (từ git) → `deploy timestamp` (từ GitHub release/tag)
- **Lát mix**: lead time của commit human-authored vs agent-authored vs cặp human+agent (review human trên agent code)
- **Hiển thị**: median + p95, chia 3 lát. Phát hiện "agent code mất bao lâu mới merge được"

### Change failure rate

- **Nguồn**: `buglinks` table — link bug → run gây ra. Deploy fail = có bug được link trong N giờ sau deploy
- **Lát mix**: tỉ lệ fail trên deploy human-only vs agent-touched. Trả lời thẳng "agent có làm tăng tỉ lệ hỏng không"
- **Hiển thị**: % theo tuần, ngưỡng đỏ vượt benchmark Elite/High DORA

### MTTR (mean time to restore)

- **Nguồn**: thời điểm bug-creating run → thời điểm fix-run (bug closed). Cả hai đều có trong `runs` + `audit_log`
- **Lát mix**: thời gian fix khi nguyên nhân do human vs do agent. Quan trọng: agent gây bug có khả năng tự fix nhanh hơn không?
- **Hiển thị**: median hours-to-fix, chia 3 lát

### Tổng quan trên dashboard

- 4 ô DORA = 4 traffic light (🟢/🟡/🔴) so với benchmark Elite/High/Medium/Low
- Mỗi ô click vào → drill-down 3 lát (human / agent / mixed)
- Trend line tuần để thấy xu hướng (agent đang kéo DORA lên hay xuống)

> Điểm mấu chốt: **DORA đã được track ngầm bởi data Dandori thu thập.** Không cần dev nhập tay. Không cần config thêm. Bật dashboard → có 4 metric ngay, đã chia mix sẵn.

---

## E. Cắt gì so với bản 5 phút

- ❌ Demo CLI terminal → 1 ảnh dashboard
- ❌ Chi tiết quality gates ở Slide 2 → dời vào Slide 4 (Trước/Sau)
- ❌ "3 điều mang về cho công ty" → gộp vào câu close
- ❌ Phần CK sub-agent ở slide chính → đẩy xuống appendix B
- ❌ Số tuyệt đối (hóa đơn $X, ROI $Y, N dev) → loại bỏ, dùng nhãn định tính
- ✅ **Slide 4 viết lại** thành "Trước/Sau" — tập trung giá trị quản lý
- ✅ **Liệt kê rõ 6 pain point** (Slide 1)

*Nguyên tắc chọn lọc: giữ những điểm **chỉ Dandori có** (mix + audit chain). Phạm vi hackday + meta build-by-AI chuyển thành appendix.*
