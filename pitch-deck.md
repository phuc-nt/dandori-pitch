---
layout: default
title: Pitch Deck
nav_order: 7
description: "Script thuyết trình Dandori (tiếng Việt)."
---

# Script thuyết trình

*Mỗi phần là một nhịp vẽ. Bắt đầu với bảng trắng. Vẽ thêm từng thứ đúng lúc script nói — không vẽ trước.*

---

## Nhịp 1 — Những kỹ sư

**Nói:** "Bắt đầu từ điều đơn giản nhất. Một tổ chức 10.000 kỹ sư. Năm 2026."

**Vẽ:**

```
  [KS]  [KS]  [KS]  [KS]  [KS]

  [KS]  [KS]  [KS]  [KS]  [KS]

  [KS]  [KS]  [KS]  [KS]  [KS]

              ... × 10.000
```

---

## Nhịp 2 — Mỗi kỹ sư có một agent

**Nói:** "Mỗi người trong số họ đang dùng một AI coding agent. Claude Code, Cursor, Codex — tùy họ chọn. Agent viết code thật. Code đó lên production."

**Vẽ:** *(thêm mũi tên từ mỗi kỹ sư xuống một bong bóng agent)*

```
  [KS]  [KS]  [KS]  [KS]  [KS]
    │      │      │      │      │
    ▼      ▼      ▼      ▼      ▼
  (agent)(agent)(agent)(agent)(agent)

              ... × 10.000
```

---

## Nhịp 3 — Agent gọi AI provider

**Nói:** "Mỗi lần agent chạy là một lần gọi đến AI provider — Anthropic, OpenAI. Token burn. Tiền chạy ra."

**Vẽ:** *(thêm một đám mây ở dưới, tất cả agent trỏ vào)*

```
  [KS]  [KS]  [KS]  [KS]  [KS]
    │      │      │      │      │
  (agent)(agent)(agent)(agent)(agent)
    │      │      │      │      │
    └──────┴──────┼──────┴──────┘
                  │
                  ▼
          ┌───────────────┐
          │  AI Providers │
          │  $$$  / tháng │
          └───────────────┘
```

---

## Nhịp 4 — Hoá đơn tới

**Nói:** "Cuối tháng. Hoá đơn về. 240.000 đô. Vậy thôi. Một con số."

**Vẽ:** *(thêm một ô riêng biệt, không kết nối với gì)*

```
  [KS]  [KS]  ...
    │      │
  (agent)(agent) ...
    └──────┘
        │
        ▼
  ┌──────────────┐         ┌──────────────┐
  │ AI Providers │         │  HOÁ ĐƠN     │
  └──────────────┘         │  $240.000    │
                           │              │
                           │  ???         │
                           └──────────────┘
```

**Nói:** "Team nào? Feature nào? Prompt nào đang đốt nhiều nhất? Không ai trả lời được."

---

## Nhịp 5 — Vấn đề context

**Nói:** "Tệ hơn: agent biết gì? Mỗi kỹ sư tự paste những gì họ nhớ vào prompt. Hôm nay."

**Vẽ:** *(thêm các tờ giấy nhớ lộn xộn phía trên agent)*

```
 [copy-paste] [quên policy] [doc cũ] [ghi chú cá nhân]
      │              │            │              │
  [KS]  [KS]  [KS]  [KS]  [KS]
    │      │      │      │      │
  (agent)(agent)(agent)(agent)(agent)
```

**Nói:** "Policy bảo mật cập nhật tuần trước? Ba người biết. Bảy người không. Agent thì chắc chắn không."

---

## Nhịp 6 — Không có ai kiểm soát

**Nói:** "Và khi có sự cố — migration làm sập prod, agent viết code vi phạm policy bảo mật — câu hỏi đầu tiên là: ai đã approve cái này?"

**Vẽ:** *(thêm dấu hỏi giữa kỹ sư và agent)*

```
  [KS]  [KS]  [KS]
    │      │      │
    ?      ?      ?      ← ai approve? khi nào? tại sao?
    │      │      │
  (agent)(agent)(agent)
           │
           ▼
      💥 sự cố production
```

**Nói:** "Câu trả lời thường là một cái Slack thread. Nếu may mắn."

---

## Nhịp 7 — Dandori vào giữa

**Nói:** "Đây là khoảng trống mà Dandori lấp đầy. Một layer. Nằm giữa kỹ sư và agent của họ."

**Vẽ:** *(vẽ một thanh ngang giữa kỹ sư và agent — đây là khoảnh khắc chính, dừng lại sau khi vẽ xong)*

```
  [KS]  [KS]  [KS]  [KS]  [KS]
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

**Nói:** "Dandori không thay thế agent. Dandori quản lý chúng."

*(dừng. để audience nhìn bảng.)*

---

## Nhịp 8 — Project & Task management

**Nói:** "Dandori bắt đầu từ một thứ rất quen thuộc: task board. Nhưng đây không phải Jira — đây là task board được thiết kế cho agent."

**Vẽ:** *(vẽ kanban board và task lifecycle)*

```
  TODO ──────▶ IN PROGRESS ──────▶ IN REVIEW ──────▶ DONE
                    │                    │
                    │                    └── human approve/reject
                    │
                    └── agent chạy ở đây
                        (prompt tự động lắp context)
                        (quality gate tự động chạy)
```

**Nói:** "Task được tổ chức theo Project. Mỗi task có phase tag: Research → Concept → Design → Implement → Test → Deploy. Task có thể phụ thuộc nhau — con chỉ bắt đầu khi cha xong, Dandori tự động trigger."

**Vẽ thêm:** *(dependency chain)*

```
  [Research] ──▶ [Design] ──▶ [Implement] ──▶ [Test] ──▶ [Deploy]
                                   │
                              agent tự chạy
                              khi task cha done
```

**Nói:** "Đây là layer mà kỹ sư và manager dùng hằng ngày. Mọi thứ khác — context, approval, quality — đều gắn vào đây."

---

## Nhịp 9 — Cost attribution

**Nói:** "Thứ đầu tiên về visibility: phân bổ chi phí. Mỗi token đều được log — agent nào, task nào, project nào, team nào."

**Vẽ:** *(mở rộng box Dandori, thêm module cost bên trong)*

```
         ┌──────────────────────────────┐
         │            DANDORI           │
         │                              │
         │  ┌──────────────────────┐    │
         │  │  Cost attribution    │    │
         │  │  theo agent / team / │    │
         │  │  project / feature   │    │
         │  └──────────────────────┘    │
         └──────────────────────────────┘
```

**Nói:** "Hoá đơn $240K giờ đọc được: team payments $52K, auth $38K, data pipeline $29K. Drill down đến từng prompt."

---

## Nhịp 10 — Context & Skills — một hệ thống

**Nói:** "Thứ hai: context và skill. Đây là cùng một hệ thống — cùng cơ chế kế thừa theo tầng, cùng version control."

**Vẽ:** *(vẽ hierarchy với skill library tích hợp vào)*

```
  ┌─────────────────────────────────────────┐
  │         Knowledge hierarchy             │
  │                                         │
  │  1. Công ty  ← policy, compliance       │
  │       │                                 │
  │  2. Dự án   ← stack, architecture       │
  │       │                                 │
  │  3. Team    ← convention, protocol      │
  │       │                                 │
  │  4. Agent   ← role, skills attached ◀──┼── Skill lib
  │       │        api-security             │   code-review
  │  5. Task    ← work item, deadline       │   test-gen
  └─────────────────────────────────────────┘
           │ toàn bộ inject vào prompt
           ▼
         agent
```

**Nói:** "Cập nhật policy ở tầng Công ty — tất cả agent thấy ngay. Cập nhật skill 'api-security' — tất cả agent đang dùng skill đó đều nhận phiên bản mới ở lần chạy tiếp. Kỹ sư nghỉ việc, skill của họ ở lại. Versioned. Rollback được. Audit được."

---

## Nhịp 11 — Approval gates

**Nói:** "Thứ tư: approval gate. Task rủi ro cao — migration database, thay đổi infra — dừng lại đây cho đến khi con người approve."

**Vẽ:** *(thêm gate vào luồng task lifecycle)*

```
  IN PROGRESS ──▶ [agent chạy] ──▶ IN REVIEW ──▶ DONE
                                        │
                                   [KS] approve
                                        │
                                   log: alice
                                        14:22
                                        "diff reviewed,
                                         tests pass"
```

**Nói:** "Mỗi lần approve được log: ai, lúc mấy giờ, họ đã xem gì. Một lần export là có đủ evidence cho đội compliance."

---

## Nhịp 12 — Quality gates

**Nói:** "Thứ năm: quality gates. Dandori không tự kiểm tra code — nó kết nối với CI/CD và các tool bảo mật mà tổ chức đã có."

**Vẽ:** *(vẽ pipeline kết nối với các tool bên ngoài)*

```
  agent output
       │
       ▼
  ┌────────────────────────────────────────┐
  │           Quality gate pipeline        │
  │                                        │
  │  TypeScript / ESLint  → type & style   │
  │  SonarQube            → code quality,  │
  │                          coverage, bugs│
  │  Snyk                 → CVE, dep vuln, │
  │                          secrets scan  │
  │  Test runner          → unit / integ   │
  │                                        │
  │  Score: 0–100  (tổng hợp từ tất cả)   │
  └────────────────────────────────────────┘
       │
       ▼
  IN REVIEW / DONE
```

**Nói:** "SonarQube quét code quality và coverage. Snyk quét CVE trong dependencies và secrets bị lọt vào code. Tất cả tổng hợp thành một điểm 0–100 cho mỗi lần agent chạy. Theo dõi trend theo thời gian — agent nào đang cải thiện, agent nào đang tụt."

---

## Nhịp 13 — Cross-agent analytics

**Nói:** "Thứ sáu: analytics so sánh giữa các agent. Không chỉ biết chi phí — còn biết agent nào đang cho ra chất lượng tốt hơn, ai đang cải thiện, ai đang tụt."

**Vẽ:** *(thêm bảng so sánh bên cạnh Dandori box)*

```
  ┌──────────────────────────────────────────────┐
  │  Cross-agent analytics                       │
  │                                              │
  │  Agent       Score   Trend   Cost/run        │
  │  ─────────   ─────   ─────   ────────        │
  │  Alice        87     ↑ +5    $0.42           │
  │  Bob          72     → =0    $0.38           │
  │  Charlie      61     ↓ -8    $0.71  ← check  │
  └──────────────────────────────────────────────┘
```

**Nói:** "CTO nhìn vào bảng này một lần mỗi tuần. Charlie đang đắt hơn 70% và chất lượng đang tụt — điều tra ngay. Không cần hỏi từng team."

---

## Nhịp 14 — Immutable audit log

**Nói:** "Thứ tám: audit log. Mỗi lần agent chạy tạo ra một bản ghi đầy đủ, không sửa được."

**Vẽ:** *(vẽ một cuốn sổ log bên cạnh)*

```
  Run #4821
  ├── agent:    Alice
  ├── task:     migrate-payments-schema
  ├── project:  payments
  ├── prompt:   [full 5-layer prompt]
  ├── context:  company-v12, project-v3, team-v7
  ├── tokens:   4.821 in / 1.203 out
  ├── cost:     $0.42
  ├── score:    84/100
  ├── approved: bob @ 14:22
  └── output:   [full text]
```

**Nói:** "Sáu tháng sau có sự cố, câu hỏi là: lúc đó agent thấy gì, ai đã approve, phiên bản context nào đang active? Tất cả đều có. Một lần export cho đội compliance là xong."

---

## Nhịp 15 — Integration surface

**Nói:** "Thứ chín: Dandori không đứng một mình. Nó có 4 mặt tiếp xúc với phần còn lại của hệ thống."

**Vẽ:** *(thêm 4 mũi tên ra từ box Dandori)*

```
              [Web UI]   [REST API]
                  │          │
                  └────┬─────┘
                       │
              ┌────────────────┐
              │    DANDORI     │
              └────────────────┘
                       │
                  ┌────┴─────┐
                  │          │
               [CLI]      [MCP]
                            └── Claude Code, Cursor
```

**Nói:** "Web UI cho kỹ sư và manager dùng hằng ngày. REST API cho CI/CD tích hợp. CLI cho automation. MCP server cho chính Claude Code và Cursor — agent có thể tự tạo task trong Dandori."

---

## Nhịp 16 — Bức tranh tổng thể

**Nói:** "Đây là bảng lúc kết thúc. Đây là những gì Dandori mang lại."

**Vẽ:** *(bức tranh đầy đủ — tất cả kết nối)*

```
  ┌────────────────────────────────────────────────────────┐
  │                   TỔ CHỨC KỸ THUẬT                    │
  │  [CTO]  [Security]  [Compliance]  [Platform]           │
  │     │        │           │             │               │
  │     └────────┴───────────┴─────────────┘               │
  │                          │  đặt policy / review        │
  └──────────────────────────┼────────────────────────────┘
                             │
  ┌──────────────────────────▼────────────────────────────┐
  │                        DANDORI                        │
  │                                                       │
  │   Cost attribution   │   Context 5 tầng              │
  │   Approval gates     │   Quality gates               │
  │   Skill library      │   Audit log                   │
  │   Task dependencies  │   Cross-agent analytics       │
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

**Nói:** "Kỹ sư vẫn dùng Claude Code, Cursor, Codex — những gì họ quen. Dandori là layer quản lý phía trên. Đó là mảnh còn thiếu."

---

## Nhịp 17 — Kết

**Nói:** "Mọi tổ chức có hơn 100 kỹ sư sẽ cần cái này trước cuối 2026. Cùng pattern như DevOps tools những năm 2010, observability 2015, feature flags 2020. Đến lượt AI agent. Dandori là layer hợp nhất đó."

**Để lại trên bảng:**

```
  TRƯỚC DANDORI               VỚI DANDORI

  $240K → ???                 $240K → payments  $52K
                                    → auth      $38K
                                    → data      $29K

  copy-paste prompt           Context 5 tầng, version control

  "ai approve?" →             log: alice, 14:22,
  Slack thread, có khi không  lý do đính kèm

  kỹ sư nghỉ →                skill ở lại trong tổ chức
  kiến thức mất               người mới kế thừa ngay
```

**Nói:** "Chúng tôi đang làm việc với các tổ chức design partner có từ 1.000 kỹ sư trở lên. Nếu đây là bài toán của bạn — hãy nói chuyện với chúng tôi."

---

## Ghi chú speaker

- **Tổng thời gian:** 20–30 phút có cả Q&A
- **Nhịp 1–6:** ~5 phút — vấn đề. Để nó thấm. Đừng vội đến giải pháp.
- **Nhịp 7:** dừng sau khi vẽ xong thanh Dandori. Để audience nhìn bảng vài giây.
- **Nhịp 8–15:** ~12 phút — mỗi capability là một nét vẽ thêm. Giữ sơ đồ gọn.
- **Nhịp 16:** ~3 phút — lùi lại khỏi bảng, để họ nhìn tổng thể.
- **Nhịp 17:** ~2 phút — kết + CTA.
- **Q&A:** vẽ lên bảng khi trả lời. Sơ đồ là công cụ của bạn.
