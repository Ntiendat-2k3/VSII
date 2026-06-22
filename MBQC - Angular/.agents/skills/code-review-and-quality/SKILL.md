---
name: code-review-and-quality
description: Conducts multi-axis code review for React/MUI/Redux Frontend. Use before merging any change.
---

# Code Review and Quality

## Five-Axis Review

### 1. Correctness
- Có khớp với spec/task không?
- Edge cases handled? (null, empty array, undefined props)
- Error states handled? (API fail, loading fail)
- Logic Redux asyncThunk đúng không? (pending/fulfilled/rejected)

### 2. Readability
- Naming đúng convention? PascalCase/camelCase/UPPER_SNAKE_CASE
- Không dùng `temp`, `data`, `result` không có context
- Component < 200 dòng không? Nếu vượt → tách
- Logic phức tạp đã ra Custom Hook chưa?

### 3. Architecture
- Component UI thuần không gọi API, không dispatch trực tiếp?
- Redux: slice đúng feature chưa? Selector tách ra chưa?
- API call đúng qua `createAsyncThunk`, không gọi trong component?
- Form dùng React Hook Form, không dùng `useState` cho form value?

### 4. Security (Frontend)
- Input có sanitize trước khi render không? (tránh XSS)
- Không render `dangerouslySetInnerHTML` với data chưa sanitize
- Không log token, user data nhạy cảm ra console
- Không hardcode API key, secret trong code

### 5. Performance
- Tạo object/function mới trong JSX render? → Dùng `useCallback`/`useMemo`
- Component re-render không cần thiết? → `React.memo`
- Import MUI đúng cách? `import Button from '@mui/material/Button'`
- Ảnh có `loading="lazy"`, `width`, `height` không?
- Redux selector có tính toán nặng? → `createSelector`

## Checklist
```
### Correctness
- [ ] Khớp spec/task
- [ ] Edge cases: null, empty, undefined
- [ ] API states: loading/error/empty

### Code Standards
- [ ] Naming đúng convention
- [ ] Component < 200 dòng
- [ ] Logic phức tạp → Custom Hook
- [ ] Không console.log
- [ ] Không hardcode màu/số/string

### Architecture
- [ ] Component không gọi API trực tiếp
- [ ] Redux slice đúng cấu trúc
- [ ] Form dùng RHF

### Performance
- [ ] Không tạo object mới trong render
- [ ] MUI import đúng path
- [ ] Ảnh có lazy loading

### Verdict
- [ ] Approve
- [ ] Request changes
```

## Severity Labels
- **Critical:** Bug ảnh hưởng functionality, security
- **Important:** Vi phạm architecture/convention
- **Nit:** Style nhỏ, không bắt buộc fix
