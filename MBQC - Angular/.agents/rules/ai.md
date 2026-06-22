# PROJECT CONTEXT
Tên dự án: [tên]
Mô tả: [làm gì]

# MEMORY BANK PROTOCOL
- CHỈ sử dụng công cụ đọc file (File/Read Tool) để nạp `.ai/architecture.md` và `.ai/progress.md` khi user nói "load", "bắt đầu session", hoặc khi bị mất ngữ cảnh.
- Đang trong luồng chat/code liên tục: Dùng trí nhớ ngắn hạn, TUYỆT ĐỐI KHÔNG tự động đọc lại file.
- Quy mô: Giữ các file trong `.ai/` luôn dưới 50 dòng.

# WORKFLOW
[START] Khi user yêu cầu load/bắt đầu → Đọc 2 file `.ai/` → Tóm tắt nhiệm vụ tiếp theo ≤ 3 dòng → Hỏi confirm trước khi execute.
[EXECUTE] Giải quyết dứt điểm từng task nhỏ, tuân thủ nghiêm ngặt Global Rules.
[SAVE] Khi user nói "lưu trạng thái" → Tự động cập nhật file `.ai/progress.md` (chuyển task sang Đã xong, dọn dẹp Đang làm, đẩy task mới vào Next).

# SLASH COMMANDS — ON-DEMAND SKILLS
Khi user mở đầu bằng lệnh `/`, BẮT BUỘC đọc SKILL.md tương ứng trước khi thực thi.
TUYỆT ĐỐI KHÔNG đọc nếu user không gõ lệnh `/`.
- `/bug`    → `.agents/skills/debugging-and-error-recovery/SKILL.md`
- `/review` → `.agents/skills/code-review-and-quality/SKILL.md`
- `/perf`   → `.agents/skills/performance-optimization/SKILL.md`

# Understand-Anything Skills:
- `/understand`           → `.agents/skills/understand/SKILL.md`
- `/understand-chat`      → `.agents/skills/understand-chat/SKILL.md`
- `/understand-diff`      → `.agents/skills/understand-diff/SKILL.md`
- `/understand-explain`   → `.agents/skills/understand-explain/SKILL.md`
- `/understand-domain`    → `.agents/skills/understand-domain/SKILL.md`
- `/understand-dashboard` → `.agents/skills/understand-dashboard/SKILL.md`
- `/understand-onboard`   → `.agents/skills/understand-onboard/SKILL.md`
- `/understand-knowledge` → `.agents/skills/understand-knowledge/SKILL.md`

# SYSTEM PROTECTION
- TUYỆT ĐỐI KHÔNG xóa, đổi tên, ghi đè thư mục `.agents/` và `.ai/`.
- Trong thư mục `.ai/`: Chỉ đọc `architecture.md`, được phép ĐỌC và GHI vào `progress.md`.
- Cho phép đọc các file `SKILL.md` trong `.agents/` ĐÚNG THEO các lệnh SLASH COMMANDS tương ứng.
