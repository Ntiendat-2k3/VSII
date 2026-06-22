---
name: performance-optimization
description: Tối ưu performance cho React/MUI/Redux Frontend. Use khi UI lag, bundle lớn, hoặc Core Web Vitals kém.
---

# Performance Optimization

## Nguyên tắc: Đo trước, tối ưu sau
Không optimize khi chưa có evidence. Premature optimization = thêm complexity vô ích.

## Core Web Vitals Targets
| Metric | Good | Poor |
|---|---|---|
| LCP | ≤ 2.5s | > 4.0s |
| INP | ≤ 200ms | > 500ms |
| CLS | ≤ 0.1 | > 0.25 |

## Workflow
```
1. MEASURE  → Baseline thực tế (Lighthouse, React DevTools Profiler)
2. IDENTIFY → Bottleneck cụ thể
3. FIX      → Đúng nguyên nhân
4. VERIFY   → Đo lại sau fix
```

## Anti-patterns và Fix

### React Re-renders không cần thiết
```tsx
// ❌ Object mới mỗi render → child re-render
<TaskFilters options={{ sortBy: 'date' }} />

// ✅ Stable reference
const DEFAULT_OPTIONS = { sortBy: 'date' };
<TaskFilters options={DEFAULT_OPTIONS} />

// ✅ React.memo cho component nặng
const TaskItem = React.memo(({ task }) => { ... });

// ✅ useMemo cho tính toán nặng
const stats = useMemo(() => calculateStats(tasks), [tasks]);

// ✅ useCallback cho function truyền xuống child
const handleDelete = useCallback((id) => {
  dispatch(deleteTask(id));
}, [dispatch]);
```

### Redux Re-renders
```tsx
// ❌ Select cả object → re-render mỗi khi bất kỳ field thay đổi
const user = useSelector(state => state.user);

// ✅ Select đúng field cần thiết
const userName = useSelector(state => state.user.name);

// ✅ createSelector cho computed data
import { createSelector } from '@reduxjs/toolkit';
const selectActiveTasks = createSelector(
  state => state.tasks.items,
  tasks => tasks.filter(t => t.status === 'active')
);
```

### MUI Bundle Size
```tsx
// ❌ Barrel import
import { Button, Stack, Typography } from '@mui/material';

// ✅ Named import → tree-shaking tốt hơn
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
```

### Code Splitting
```tsx
// ✅ Lazy load route-level components
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Ảnh
```html
<!-- ✅ Lazy load ảnh below fold -->
<img src="..." loading="lazy" decoding="async" width="800" height="400" />

<!-- ✅ LCP image: không lazy, ưu tiên cao -->
<img src="..." fetchpriority="high" width="1200" height="600" />
```

## Performance Budget
```
JS bundle (initial): < 200KB gzipped
Lighthouse score:    ≥ 85
API response:        < 300ms
```

## Verification
- [ ] Đo được số liệu trước/sau
- [ ] Core Web Vitals trong ngưỡng Good
- [ ] Bundle size không tăng đáng kể
- [ ] Không có re-render thừa (React DevTools Profiler)
- [ ] Không break existing behavior

## Red Flags
- Optimize khi chưa có profiling data
- `React.memo` và `useMemo` khắp nơi (over-optimize)
- Barrel import MUI
- Không có `width`/`height` trên ảnh → CLS
- Redux selector select cả object thay vì field cụ thể
