---
layout: default
title: "Hackday Slides — Dandori (2 phút)"
nav_exclude: true
search_exclude: true
description: "Slide 2 phút thuyết trình hackday — Dandori, outer harness gọn nhẹ cho công ty mix human + agent."
---

# Dandori — 2 phút thuyết trình Hackday
{: .fs-9 }

> Bản rút gọn cho pitch nhanh. Hy sinh chiều sâu để giữ sắc nét. Bản blog đầy đủ: [hackday-blog-dandori]({{ site.baseurl }}/hackday-blog-dandori.html).

*Unlisted page — share the direct URL only.*

---

## Slide 1 — Hook (30 giây)

Công ty chúng ta tháng này chi $10K cho AI. Nhưng hãy thử trả lời:

- 💸 **Tiền đi đâu?** Project nào, team nào, task nào ngốn nhiều nhất?
- 🎯 **Ai hiệu quả?** Team A và Team B — ai dùng AI tốt hơn, dựa trên gì?
- 🛡 **Chất lượng có đảm bảo?** Agent có bỏ test để pass nhanh không? Ai kiểm chứng?
- 🔍 **Sự cố thì truy ai?** Migration sập staging sáng nay — agent nào, ai approve?
- 🧠 **Kinh nghiệm ở đâu?** Senior nghỉ — 6 tháng prompt engineering đi theo cùng?
- ⚖️ **Human vs agent?** Dev thật và AI, so sánh thế nào cho công bằng?

Không trả lời được **không phải lỗi AI**. Là **thiếu một lớp hạ tầng quản lý** — và đó là thứ đội tôi làm trong hackday này.

---

## Slide 2 — Dandori (25 giây)

Một công cụ. Hai việc. **Cho cả agent lẫn human engineer.**

- 📊 **Tracking** — mỗi run AI + mỗi commit/PR human (qua Jira + GitHub)
- 📈 **Analytics đa cấp** — agent · engineer · team · project · department

**Điểm khác biệt quyết định**: các tool khác chỉ quản AI. Dandori đặt **human và agent trên cùng thước đo** — vì tương lai công ty là **mix**, không phải thay thế.

---

## Slide 3 — Kết quả analysis (25 giây)

**[1 ảnh dashboard chiếm toàn slide]** — thiết kế ảnh gồm các khối sau:

```
┌─ DANDORI DASHBOARD ─ Q1/2026 ────────────────────────────────────┐
│                                                                  │
│  💰 Cost by Department        🎯 Throughput by Engineer          │
│  ┌────────────────────┐      ┌──────────────────────────────┐    │
│  │ Platform  $8.4k ██ │      │ alice+alpha  12 task  1.2d   │    │
│  │ Growth    $2.1k █  │      │ bob (human)   9 task  1.8d   │    │
│  │ Data      $1.3k    │      │ carol+beta    7 task  0.9d ⚠ │    │
│  └────────────────────┘      └──────────────────────────────┘    │
│                                                                  │
│  🛡 PQM Quality Score        🔍 Audit Trail (last 24h)           │
│  ┌────────────────────┐      ┌──────────────────────────────┐    │
│  │ Team Auth     92%  │      │ PAY-142  alice → alpha  ✓    │    │
│  │ Team Billing  78%  │      │ PAY-151  agent beta    ⚠     │    │
│  │ Team Growth   64% ⚠│      │ AUTH-77  bob (manual)   ✓    │    │
│  └────────────────────┘      └──────────────────────────────┘    │
│                                                                  │
│  📊 Human vs Agent — same metric, same dashboard                 │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │ AC completion:  Human 94%  ▓▓▓▓▓▓▓▓▓▓                   │    │
│  │                 Agent 89%  ▓▓▓▓▓▓▓▓▓▌                   │    │
│  │ Cycle time:     Human 1.6d ▓▓▓▓▓▓▓▓                     │    │
│  │                 Agent 1.0d ▓▓▓▓▓                         │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

Một dashboard — trả lời **cả 6 pain point** ở Slide 1. ROI: ~$24K/năm cho 50 dev.

---

## Slide 4 — Meta-proof (35 giây)

Đội tôi 2 người: **PO/PDM + QA. Không-developer.** Dandori build trong 1 ngày — nhờ 3 điều:

**1. PBI/AC viết kỹ trước khi gọi AI** — input rác → output rác.

**2. Dùng Claude Code + Agent Kit (CK) — chia vai AI thành 1 team**

CK không phải "AI assistant đơn" — là **bộ sub-agent chuyên môn hoá**, mỗi vai một context sạch, một nhiệm vụ rõ:

| Sub-agent | Vai trò | Chúng tôi review như |
|---|---|---|
| `planner` | Lập plan, chia phase, xác định dependency | Tech lead design review |
| `researcher` | Tra docs, so sánh thư viện, best practices | Senior khảo sát giải pháp |
| `implementer` | Code theo plan, file-by-file | Junior dev làm task |
| `tester` | Viết + chạy test, report failures | QA engineer |
| `code-reviewer` | Review security, edge case, convention | Senior reviewer |
| `debugger` | Trace lỗi khi test fail | SRE on-call |
| `docs-manager` | Update devlog + docs sau mỗi phase | Technical writer |

Kèm **rules files** (`development-rules.md`, `primary-workflow.md`, `orchestration-protocol.md`) — AI tuân thủ convention công ty nhất quán, không cần nhắc lại mỗi prompt.

**Chúng tôi không prompt AI — chúng tôi vận hành một team agent bằng kỹ năng PO/QA thường ngày.**

**3. PQM quality gates đo bằng số** — không tin AI tự chấm.

> Sản phẩm giải bài toán AI trong dev cycle — được build bằng AI trong dev cycle. **Tự chứng minh thesis.**

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
| 3. Dashboard | 25s | 1 ảnh — trả lời cả 6 pain point |
| 4. Meta-proof | 35s | CK sub-agents như 1 team |
| 5. Close | 10s | Câu hỏi đúng |
| **Tổng** | **~2 phút 5s** | Buffer 10s cho transitions |

---

## Cắt gì so với bản 5 phút

- ❌ Finance/EM/QA tách 3 role → gộp vào 1 dashboard ảnh (tiết kiệm 60s)
- ❌ Demo CLI terminal → thay bằng 1 ảnh dashboard (nhanh hơn, visual hơn)
- ❌ Chi tiết PQM quality gates ở Slide 2 → dời vào Slide 4 (ngắn 1 dòng)
- ❌ "3 điều mang về cho công ty" → gộp vào câu close
- ✅ **Đào sâu** CK sub-agents (Slide 4) — điểm mạnh nhất về "ứng dụng AI hiệu quả"
- ✅ **Liệt kê rõ 6 pain point** (Slide 1) — nhiều góc đau hơn 1 câu

*Nguyên tắc chọn lọc: giữ những điểm **chỉ Dandori có** (mix + meta-proof CK). Cắt mọi thứ tool khác cũng làm được.*

---

## Gợi ý thiết kế ảnh Slide 3

Ảnh dashboard nên có 5 khối (theo thứ tự đọc mắt Z-pattern):

1. **Top-left**: Cost by Department — bar chart ngang, số USD
2. **Top-right**: Throughput by Engineer — bảng mix human + `human+agent` cặp
3. **Mid-left**: PQM Quality Score — bar theo team, highlight dưới ngưỡng đỏ
4. **Mid-right**: Audit Trail — list 3-4 entry gần nhất với ✓/⚠
5. **Bottom full-width**: Human vs Agent comparison — 2 metric (AC completion, cycle time) với bar đối xứng

Màu: xanh lá (OK), vàng (cảnh báo), đỏ (dưới ngưỡng). Font mono cho số.
