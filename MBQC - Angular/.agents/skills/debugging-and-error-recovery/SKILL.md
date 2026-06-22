---
name: debugging-and-error-recovery
description: Systematic frontend debugging for React/MUI/Redux stack. Use when tests fail, UI breaks, Redux state sai, hoặc behavior không như kỳ vọng.
---

# Debugging and Error Recovery

## Stop-the-Line Rule
```
1. STOP thêm feature
2. PRESERVE error (screenshot, console log, repro steps)
3. DIAGNOSE theo checklist dưới
4. FIX root cause (không fix symptom)
5. VERIFY sau khi fix
```

## Triage Checklist

### Step 1: Xác định layer lỗi
```
Lỗi ở đâu?
├── UI render     → Check Console, React DevTools
├── Redux state   → Check Redux DevTools
├── API call      → Check Network tab
├── Form          → Check RHF formState
└── MUI component → Check props, sx, theme
```

### Step 2: Triage theo loại lỗi

**React Errors:**
```
Cannot read property of undefined
→ Data chưa load xong mà đã render
→ Check: loading state, optional chaining (?.)

Component không re-render
→ Mutate state trực tiếp thay vì return new object
→ Check: Redux reducer có return state mới không?

useEffect chạy vô hạn
→ Dependency array sai
→ Check: object/array trong deps (tạo mới mỗi render)

Stale closure
→ Dùng giá trị cũ trong callback
→ Check: useCallback deps, setState với function updater
```

**Redux Errors:**
```
State không update
→ Check Redux DevTools: action có dispatch không?
→ Reducer có handle action đó không?
→ Có mutate state trực tiếp không?

asyncThunk không chạy
→ Check: dispatch(action()) có được gọi không?
→ Check: rejected case có error gì không?

Selector trả về wrong data
→ Check: selector đang select đúng slice chưa?
```

**MUI Errors:**
```
Style không apply
→ sx prop syntax đúng chưa?
→ Theme override có đúng component name không?
→ Specificity conflict với Bootstrap?

Component không nhận props
→ Import đúng path chưa?
→ Props có đúng tên theo MUI docs không?
```

**React Hook Form Errors:**
```
Field không register
→ Thiếu {...register('fieldName')}
→ name prop có khớp với register không?

Validation không chạy
→ Trigger mode: onChange/onBlur/onSubmit?
→ handleSubmit có wrap onSubmit không?

formState.errors rỗng dù sai
→ errors được destructure từ formState chưa?
```

### Step 3: Tools
```
React DevTools  → Components tab → Check props, state, hooks
Redux DevTools  → Actions tab → Check dispatched actions & state diff
Network tab     → Check API request/response
Console         → Check errors và warnings
```

### Step 4: Fix Root Cause
```
❌ Symptom fix: Force re-render bằng key={Math.random()}
✅ Root cause fix: Tìm nguyên nhân state không update đúng
```

### Step 5: Verify
- [ ] Bug không còn reproduce
- [ ] Không có lỗi mới trong Console
- [ ] Redux state đúng trong DevTools
- [ ] Các component liên quan không bị ảnh hưởng

## Red Flags
- Fix mà không hiểu tại sao nó fix được
- Thêm `key={Math.random()}` để force re-render
- Mutate Redux state trực tiếp trong component
- `useEffect` không có dependency array
- Bỏ qua warning trong Console
