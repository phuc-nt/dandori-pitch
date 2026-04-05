---
hide:
  - navigation
  - toc
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

## Nhịp 8 — Cost attribution

**Nói:** "Thứ đầu tiên Dandori làm được: phân bổ chi phí. Mỗi token đều được log — agent nào, task nào, project nào, team nào."

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

## Nhịp 9 — Context hierarchy

**Nói:** "Thứ hai: context. Thay vì copy-paste, một cấu trúc 5 tầng. Mỗi agent tự kế thừa — không cần ai nhớ paste."

**Vẽ:** *(thêm stack bên trái box Dandori)*

```
  ┌─────────────┐     ┌──────────────────────────────┐
  │ 1. Công ty  │     │            DANDORI           │
  │ 2. Dự án    │────▶│                              │
  │ 3. Team     │     │  ┌──────────────┐            │
  │ 4. Agent    │     │  │ Cost         │            │
  │ 5. Task     │     │  ├──────────────┤            │
  └─────────────┘     │  │ Context hub  │            │
                      │  └──────────────┘            │
                      └──────────────────────────────┘
```

**Nói:** "Cập nhật policy bảo mật một lần ở tầng Công ty. Lần chạy tiếp theo, tất cả agent đều thấy. Có version control, có rollback, có audit log."

---

## Nhịp 10 — Approval gates

**Nói:** "Thứ ba: approval gate. Task rủi ro cao — migration database, thay đổi infra — dừng lại đây cho đến khi con người approve."

**Vẽ:** *(thêm module approval, thêm ký hiệu cổng trên luồng)*

```
  ┌─────────────┐     ┌──────────────────────────────┐
  │ Context     │     │            DANDORI           │
  │ tầng        │────▶│                              │
  └─────────────┘     │  ┌──────────────┐            │
                      │  │ Cost         │            │
  [KS] ───────────────┤  ├──────────────┤            │
  review & approve    │  │ Context hub  │            │
         ▲            │  ├──────────────┤            │
         │            │  │ ⛔ Approval  │            │
         └────────────│  │   gate       │            │
                      │  └──────────────┘            │
                      └──────────────────────────────┘
```

**Nói:** "Mỗi lần approve được log: ai, lúc mấy giờ, họ đã xem gì. Một lần export là có đủ evidence cho đội compliance."

---

## Nhịp 11 — Quality gates

**Nói:** "Thứ tư: quality gates. Trước khi output nào được chấp nhận, scanner tự động chạy."

**Vẽ:** *(thêm pipeline quality gate bên dưới Dandori, trước agent)*

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

**Nói:** "Mỗi lần chạy có điểm chất lượng 0–100. Theo dõi theo thời gian — agent nào đang tốt hơn, agent nào đang tệ đi."

---

## Nhịp 12 — Skill library

**Nói:** "Thứ năm: skill library. Những prompt tốt nhất của tổ chức, lưu tập trung. Kỹ sư mới vào — kế thừa ngay hôm đầu tiên."

**Vẽ:** *(thêm skill box feed vào context stack)*

```
  ┌─────────────┐
  │ Skill lib   │
  │ api-security│
  │ code-review │
  │ test-gen    │
  └──────┬──────┘
         │ tự gắn vào
         ▼
  ┌─────────────┐     ┌──────────────────────────────┐
  │ Context     │     │            DANDORI           │
  │ tầng        │────▶│  Cost │ Context │ Approval   │
  └─────────────┘     │  Quality gates │ Skills      │
                      └──────────────────────────────┘
```

**Nói:** "Kỹ sư nghỉ việc. Prompt của họ vẫn ở lại. Kiến thức không đi theo người nữa."

---

## Nhịp 13 — Bức tranh tổng thể

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

## Nhịp 14 — Kết

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
- **Nhịp 8–12:** ~10 phút — mỗi capability là một nét vẽ thêm. Giữ sơ đồ gọn.
- **Nhịp 13:** ~3 phút — lùi lại khỏi bảng, để họ nhìn tổng thể.
- **Nhịp 14:** ~2 phút — kết + CTA.
- **Q&A:** vẽ lên bảng khi trả lời. Sơ đồ là công cụ của bạn.
