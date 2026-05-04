# Phụ lục Hackday — Phạm vi demo và cách build Dandori bằng AI agent

> Phần phụ — bổ trợ cho [blog-dandori.md](blog-dandori.md). Dành cho người tò mò về cách Dandori được demo trong hackday và được build bằng chính AI agent.

## A. Phạm vi hackday — chọn 1 use case đắt giá để demo

Một ngày không build được cả Dandori từ đầu. Đội tôi chuẩn bị **design document đầy đủ** trước hackday, dataset mẫu (3 projects × nhiều sprint × các run), và các module foundation. Trong ngày hackday, focus vào **một use case duy nhất** mà demo được, đắt giá, kể được câu chuyện end-to-end.

**Use case chọn**: **Cross-project analytics — 1 dashboard trả lời câu hỏi tiền AI của sếp**.

### Setup trước hackday

- Dataset cross-project sẵn (multi-project, multi-sprint, multi-run)
- Mix human commits + agent runs (Jira + GitHub đã sync)
- Metrics đã tính sẵn: cost by department, throughput by engineer, cycle time, AC completion
- Dashboard v2 với 6 persona tab đã render được

### Trong ngày hackday — cái thật sự ship

**Action duy nhất**: kích hoạt 1 run thật end-to-end để chèn data mới vào dataset đã có → dashboard tự refresh → dòng mới xuất hiện ở Throughput, Cost, Audit Trail.

**Demo flow** (sau phần thuyết trình, không tính giờ pitch):

```
# Trước demo: dashboard đang show dataset chuẩn bị sẵn
$ open http://localhost:3200/dashboard
[hiện dashboard có sẵn data cross-project]

# Live action trong hackday: chạy 1 task thật
$ dandori claude "Add --json flag to dandori analytics cost"
[claude code chạy ~vài chục giây, edit file, commit]
✓ Run captured: PAY-189 · alice+alpha · $0.xx

# Refresh dashboard
[hàng mới xuất hiện ở Throughput, Cost tăng nhẹ, Audit trail có entry mới]
```

### Story 3 lớp khi demo

1. **Data có sẵn** (dataset prep) — chứng minh analytics đa cấp hoạt động với data thật
2. **Live capture** (1 run mới) — chứng minh tracking layer không cần config thêm, không cần thay đổi thói quen dev
3. **Mix human + agent** — `alice+alpha` nằm cùng dòng với `bob một mình` → chứng minh thước đo chung

### Tại sao chọn use case này

- **Visual nhất** — 1 hàng mới xuất hiện trên dashboard ngay sau action, audience thấy được
- **Trả lời thẳng** pain point #1 + #2 + #5 ở phần mở blog (tiền đi đâu, ai hiệu quả, human vs agent)
- **Khả thi 1 ngày** — phần lớn data đã có, chỉ cần wire-up tracking layer + đảm bảo dashboard refresh
- **Khác biệt rõ** — tool khác cũng có dashboard, nhưng không tool nào mix human+agent trên cùng thước đo

### Risk + mitigation

- Risk: live `claude` chạy có thể chậm/fail. Mitigation: pre-record GIF backup + chuẩn bị task cực nhỏ
- Risk: dashboard không auto-refresh đẹp. Mitigation: có nút refresh hoặc deep-link tới run drawer

---

## B. Dùng AI agent để build Dandori

> Bằng chứng meta — sản phẩm giải bài toán "AI vào dev cycle" được build bằng đúng cách đó.

### B1. Quy trình 7 công đoạn — ai làm phần nào

Mỗi công đoạn có 5 task pattern: **plan / do / check / decide / record**. Vai phân chia:

| Công đoạn | plan | do | check | decide | record |
|---|---|---|---|---|---|
| Idea | H | H | H | H | B |
| Discovery & Design | B | B | B | H | B |
| Planning | B | A | B | H | A |
| Coding | B | A* | A | H | A |
| Testing | A | A* | A | H | A |
| Review & Docs | A | A | B | H | A |
| Release & Maintenance | B | B | B | H | B |

**H** = Human · **A** = Agent · **B** = Both · **A*** = Agent autonomous (chạy không cần xác nhận từng bước)

Quan sát: agent mạnh ở **do + check**, yếu ở **decide**. Quyết định kinh doanh, breaking change, tag release — luôn là Human.

### B2. Bộ Claude Code Agent Kit — agent và skill nào dùng nhiều

**Agent dùng nhiều nhất** (xếp hạng tương đối, đo qua dấu vết file):

| Agent | Tần suất | Vai trò |
|---|---|---|
| `researcher` | ★★★★ | Research song song nhiều topic, tránh bloat context chính |
| `tester` | ★★★★ | Chạy test, viết test mới, fix flaky |
| `code-reviewer` | ★★ | Review diff lớn, security-sensitive |
| `debugger` | ★★ | Bug spike, log analysis |
| `planner` | ★★ | Tạo plan + phase files (ít lần, ROI cao) |

**Skill dùng nhiều nhất**:

| Skill | Tần suất | Vai trò |
|---|---|---|
| Hook `SessionStart` / `UserPromptSubmit` | ★★★★★ | Vô hình — inject context mỗi turn |
| `/loop` | ★★★★ | Autonomous run khi plan đã chốt |
| `/ck:preview` | ★★★ | Diagram + explain khi viết doc |
| `chrome-devtools` | ★★★ | Headless screenshot + console capture cho UI E2E |
| `/ck:plan` | ★★ | Tạo plan có cấu trúc với phase files |

### B3. Bài học rút ra

1. **Agent giỏi nhất ở "do + check"** — đừng giao "decide" cho agent.
2. **Plan rõ là điều kiện tiên quyết** — không có checklist → autonomous run lạc đề.
3. **`researcher` song song giảm bloat** — mỗi con tự đọc tài liệu, trả về summary ngắn.
4. **`/loop` autonomous chỉ an toàn khi**: plan chốt + gate test rõ + commit local + rollback dễ.
5. **Hook injection ROI cao nhất nhưng vô hình** — không có hook thì phải copy-paste path mỗi prompt.
6. **Devlog là thẻ căn cước của mỗi version** — format chuẩn → agent viết nhất quán.

Tài liệu chi tiết: [`docs/agent-coding-workflow.md`](../../docs/agent-coding-workflow.md) — ma trận đầy đủ, danh sách agent + skill, phân tích ROI.
