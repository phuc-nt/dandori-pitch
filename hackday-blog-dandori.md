---
layout: default
title: "Hackday Blog — Dandori"
nav_exclude: true
search_exclude: true
description: "Hai người không code — một công cụ trả lời câu hỏi 10.000 đô. Câu chuyện hackday của team PO/PDM + QA."
---

# Hai người không code, một ngày hackday, và công cụ trả lời câu hỏi 10.000 đô
{: .fs-9 }

*Bài viết blog — không phải slide. Dành cho người đọc không chuyên kỹ thuật vẫn hiểu được.*
{: .fs-5 .fw-300 }

*Unlisted page — share the direct URL only.*

---

## Mở đầu: sáu câu hỏi không ai trả lời được

Hãy thử tưởng tượng công ty bạn có 50 dev. Mỗi người dùng Claude Code, Cursor, hoặc Copilot 5–10 lần một ngày. Cuối tháng, hóa đơn AI về tới tay sếp: **$10.000**.

Sếp hỏi đơn giản: *"Tiền này đi đâu?"*

Không ai trả lời được.

Thử hỏi thêm vài câu nữa:

- **Team A và Team B** — ai dùng AI hiệu quả hơn? Dựa vào đâu mà nói?
- Cái **migration sập staging sáng nay** — agent nào làm, ai approve, có test không?
- **Chất lượng code AI sinh ra** có đảm bảo không? Hay agent cứ comment-out test cho pass là xong?
- Bạn senior vừa nghỉ — **6 tháng kinh nghiệm prompt** của bạn ấy đi theo luôn, ai lưu lại?
- **Human vs agent** — dev thật và AI, so sánh công bằng thế nào?

Cả sáu câu — hầu hết công ty đều tịt.

Và đây mới là điều thú vị: **đó không phải lỗi của AI**. AI làm việc tốt. Đó là lỗi của **lớp hạ tầng quản lý** xung quanh AI — cái lớp mà chưa ai đặt tên đúng.

Đội tôi gọi nó là **outer harness**. Và hackday này chúng tôi build một phiên bản nhỏ của nó: **Dandori**.

---

## Chúng tôi là ai

Trước khi nói về sản phẩm, nói về đội trước — vì cái "ai làm ra nó" mới là phần thú vị.

**Đội tôi 2 người. Tôi là PO/PDM. Bạn còn lại là QA.**

Chúng tôi **không code hàng ngày**. Tôi viết requirement, review demo, nói chuyện với stakeholder. QA viết test case, review chất lượng, chạy regression. Git, chúng tôi dùng ở mức commit-push cơ bản. Go, Node.js, SQL — hiểu khái niệm, không đủ tự tin viết từ đầu.

Vậy mà chúng tôi build được Dandori trong **một ngày hackday**.

Không phải vì chúng tôi giỏi code giấu nghề. Vì **chúng tôi có process chuẩn + công cụ AI đúng cách**. Hai thứ này, nếu công ty bạn có, thì dev không-chuyên như chúng tôi cũng ship được sản phẩm thật. Nếu thiếu, thì dev senior dùng AI cũng chỉ tạo ra đống code khó maintain.

Đây chính là **thesis của bài blog này**: AI không phải chuyện giỏi prompt hay không. AI là chuyện **công ty có đủ kỷ luật process** để AI làm việc ra hồn không.

---

## Dandori — một công cụ, hai việc

Để dễ hình dung: Dandori giống như **cái đồng hồ điện trong nhà bạn**. Nó không làm cho bạn tiết kiệm điện. Nó chỉ **cho bạn thấy** bạn đang tiêu điện vào đâu — để bạn tự biết chỗ nào lãng phí.

Dandori làm đúng hai việc:

### 1. Tracking — ghi lại mọi thứ

Mỗi lần ai đó trong công ty chạy AI (dù là Claude Code, Cursor, hay gì), Dandori tự động ghi:

- Ai chạy, task gì, mất bao nhiêu phút
- Tốn bao nhiêu token, ra bao nhiêu tiền
- Code thay đổi ra sao, test pass hay fail
- Task này trên Jira là cái gì, PR trên GitHub là cái nào

Người dùng **không cần làm gì thêm**. Họ dùng AI như bình thường. Dandori là một layer mỏng ngồi phía sau, lặng lẽ ghi chép.

Quan trọng hơn: Dandori **cũng kéo data của human engineer** từ Jira (task closed, cycle time) và GitHub (commits, PRs, review time). Nghĩa là agent và người **được đo trên cùng thước đo, cùng dashboard**.

Điểm này quan trọng sẽ giải thích ở dưới.

### 2. Analytics — trả lời câu hỏi

Có data rồi, Dandori cho bạn query theo **sáu cấp độ**: **agent → engineer → task → team → project → department**.

Ví dụ câu hỏi thật sếp hay hỏi:

> *"Tháng này department Platform tiêu bao nhiêu cho AI? Chia theo project nào?"*

Trên Dandori: một dòng lệnh, ra số ngay.

> *"Team Auth và Team Billing — team nào dùng AI hiệu quả hơn trên cùng loại task?"*

Một dòng lệnh, ra bảng so sánh.

> *"Sáng nay có run nào vượt ngưỡng chất lượng PQM không?"*

Một dòng lệnh, ra danh sách cần QA review kỹ.

---

## Tại sao **mix human + agent** là khác biệt cốt lõi

Đa số công cụ hiện tại chỉ quản AI. Bạn thấy agent dùng bao nhiêu token, agent nào chạy lâu, agent nào fail.

Nhưng công ty phần mềm **không chỉ có AI**. Công ty có **cả dev thật lẫn AI**, và tương lai gần chắc chắn là **mix**, không phải thay thế hoàn toàn.

Khi công ty là mix, câu hỏi quản lý quan trọng nhất là:

> *"Alice + agent alpha vs Bob một mình — ai hiệu quả hơn? Đầu tư AI có đáng không?"*

Không có data chung, không trả lời được câu này. Sếp phải đoán.

Dandori kéo data từ **Jira + GitHub + agent runs**, đưa lên **cùng một dashboard**:

| Engineer | Agent | Tasks đóng | Cycle time | AC completion |
|---|---|---|---|---|
| Alice | alpha | 12 | 1.2 ngày | 94% |
| Bob | — | 9 | 1.8 ngày | 92% |
| Carol | beta | 7 | 0.9 ngày | 64% ⚠ |

Nhìn bảng này, sếp thấy ngay:

- **Alice + alpha**: throughput cao, chất lượng cao → model hiệu quả, nhân rộng.
- **Bob một mình**: chậm hơn chút nhưng chất lượng sát Alice → dev cứng, không cần agent ép.
- **Carol + beta**: nhanh nhất nhưng chất lượng dưới ngưỡng → đang đi đường tắt, cần review.

Ba người, ba câu chuyện khác nhau. Cùng một dashboard. Đây là thứ **chỉ có khi human và agent cùng thước đo**.

---

## Chất lượng — ai là người định nghĩa?

Một điều đội tôi cẩn thận hơn người khác: **không bao giờ để AI tự chấm chất lượng công việc của AI**.

Agent rất dễ "pass" bằng cách comment-out test. Hoặc sinh code trông đẹp nhưng logic sai. Nếu bạn hỏi agent "chất lượng OK chưa?" — nó sẽ luôn trả lời "OK".

Vậy ai chấm?

**PQM team** — Product Quality Management. Đây là team của bạn QA trong đội chúng tôi. PQM định nghĩa sẵn **các chỉ số chất lượng chuẩn công ty**: lint delta, test delta, commit message score, diff size, có AC đầy đủ không.

Các chỉ số này được config **một lần**. Dandori sau đó enforce **mọi run, không miễn trừ**.

Tại sao điều này quan trọng? Vì nó đảo ngược thế "ai kiểm chứng ai":

- Không phải dev tự đánh giá PR của mình.
- Không phải agent tự khen code của nó.
- **PQM** — team có thẩm quyền chất lượng — đặt tiêu chuẩn, Dandori đo bằng số.

Số không nói dối. Và tiêu chuẩn đến từ đúng người có quyền đặt tiêu chuẩn.

---

## Phần "meta" — chúng tôi build Dandori bằng chính thứ Dandori đang giải

Đây là phần đội tôi tự hào nhất.

Sản phẩm hackday của chúng tôi **giải bài toán "đưa AI vào dev cycle hiệu quả"**. Và chúng tôi build nó **bằng đúng cách đó**. Meta-proof. Không cần giả thuyết — bản thân sản phẩm là bằng chứng.

Ba trụ cột:

### Trụ cột 1 — PBI viết như hợp đồng, không phải wishlist

80% lý do "AI sinh code rác" là **PBI (Product Backlog Item) viết mơ hồ**. Agent input rác → output rác.

Chúng tôi viết PBI có **AC (Acceptance Criteria) checklist test được**. Ví dụ:

> **PBI-142**: Thêm command `dandori analytics cost --by department`
>
> **AC**:
> - [ ] Lệnh in ra bảng với cột: Department, Projects, Runs, Cost
> - [ ] Số liệu đọc từ SQLite bảng `runs`, group by `department`
> - [ ] Nếu không có data, in thông báo "No data" thay vì crash
> - [ ] `--since 7d` filter được theo thời gian
> - [ ] Test unit cho hàm aggregation đạt 80% coverage

Mỗi dấu tick là một thứ **agent phải làm đúng, test được**. Không có chỗ cho "tôi nghĩ là OK". Đầu tư viết PBI trước hackday — tiết kiệm 10x thời gian debug trong ngày hackday.

### Trụ cột 2 — Chia vai AI như một team, không ôm mega-prompt

Đây là phần chúng tôi muốn kể kỹ hơn — vì **đây là chỗ đội tôi tận dụng AI khác với hầu hết mọi người**.

Thay vì nhồi tất cả vào một prompt khổng lồ ("Làm feature X, viết test, review giúp tôi nhé"), chúng tôi dùng **Claude Code + Agent Kit (CK)** — một bộ sub-agent chuyên môn hóa.

CK cho phép chia một công việc thành nhiều **vai**, mỗi vai có **context sạch riêng** và **nhiệm vụ rõ ràng**:

| Sub-agent CK | Vai trò | Chúng tôi review nó như |
|---|---|---|
| `planner` | Lập plan, chia phase, xác định dependency | Tech lead làm design review |
| `researcher` | Tra docs, so sánh thư viện, best practices | Senior dev khảo sát giải pháp |
| `implementer` | Code theo plan, file-by-file | Junior dev làm task |
| `tester` | Viết + chạy test, report failures | QA engineer |
| `code-reviewer` | Review security, edge case, convention | Senior reviewer |
| `debugger` | Trace lỗi khi test fail | SRE on-call |
| `docs-manager` | Update docs + devlog sau mỗi phase | Technical writer |

Kèm theo là **rules files** (`development-rules.md`, `primary-workflow.md`, `orchestration-protocol.md`) — định nghĩa convention chuẩn của công ty, load tự động vào mọi session. AI tuân thủ nhất quán, không cần nhắc lại mỗi prompt.

**Tại sao cách này mạnh?**

Vì chúng tôi — PO/PDM + QA — **đã có sẵn kỹ năng review đúng 7 vai đó**:

- Tôi (PO) review `planner` giống tôi review tech lead trình bày design.
- QA review `tester` giống QA review test plan của dev.
- Cả hai chúng tôi review `code-reviewer` giống review PR comment.

Chúng tôi **không cần biết code** để review. Chúng tôi cần biết **task này đã đủ AC chưa, test này có cover case này chưa, logic này có khớp spec không**.

**Chúng tôi không "prompt AI". Chúng tôi vận hành một team agent — bằng kỹ năng PO/QA thường ngày.**

Đây là chỗ đa số công ty hiểu sai về AI. Họ nghĩ dùng AI hiệu quả = viết prompt giỏi. Thật ra dùng AI hiệu quả = **có đủ process và role clarity** để AI plug vào đúng vị trí.

### Trụ cột 3 — Quality gates đo bằng số, không tin cảm tính

Đã nói ở trên. Nhắc lại vì quan trọng: **không tin AI tự chấm**. PQM định nghĩa ngưỡng, Dandori đo, dashboard hiển thị. Pass hay fail là chuyện của con số.

---

## Bạn mang về công ty được gì?

Giả sử bạn không ship Dandori ngay. Ba điều dưới đây, áp dụng được **tuần sau**, không cần công cụ gì:

**1. Đầu tư vào PBI trước khi đầu tư vào token.**
Mỗi giờ viết AC rõ, tiết kiệm ~10 giờ sửa output AI. Đơn giản thế thôi. Đây là ROI cao nhất của AI mà không ai nói.

**2. Chia vai AI thay vì dùng một prompt ôm hết.**
Planner, implementer, tester, reviewer — ít nhất 4 vai. Dễ làm với bất kỳ công cụ AI nào. Output rõ, dễ review, dễ tin.

**3. Quality gates do đúng người định nghĩa, đo bằng số.**
Đừng để dev tự chấm. Đừng để AI tự chấm. QA/PQM team đặt ngưỡng, công cụ đo. Khi có tranh cãi, nhìn số.

Dandori chỉ là cái công cụ. Ba điều trên là **process**. Process quan trọng hơn công cụ.

---

## Câu hỏi cũ, câu hỏi mới

Câu hỏi cũ, ai cũng hỏi:

> *"AI có thay được developer không?"*

Câu hỏi này sai. Không phải vì câu trả lời khó. Vì nó **đặt vấn đề nhầm chỗ**.

Câu hỏi đúng:

> *"Công ty có đủ kỷ luật process để AI làm việc hiệu quả không?"*

Hackday này đội tôi trả lời **có**. Bằng một công cụ nhỏ, một process chuẩn, và hai người không code.

Nếu PO/PDM + QA còn ship được, thì đội bạn — với dev thật sự — không lý do gì không ship được. Trừ khi thiếu process.

Đó là vấn đề phải giải. Và đó là lý do Dandori tồn tại.

---

*Đội tác giả: PO/PDM + QA. Không-developer. Dùng Claude Code + Agent Kit (CK) + process chuẩn.*

*Link slide 2 phút thuyết trình hackday: [hackday-slides-dandori-2min.html]({{ site.baseurl }}/hackday-slides-dandori-2min.html)*
