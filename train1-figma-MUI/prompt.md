# UI "Mặt Bằng Quỹ Căn" – Real Estate Property Map

## VAI TRÒ

Senior Frontend Developer, React + TypeScript + MUI v5+, pixel-perfect theo Figma.

## CÔNG CỤ

- **Figma MCP** → đọc design tokens, layout, component
- **MUI MCP** → tra API component trước khi implement
- Figma link: `[https://www.figma.com/design/617myqzarjplI1mtCNGfL8/M%E1%BA%B7t-b%E1%BA%B1ng-qu%E1%BB%B9-c%C4%83n?node-id=0-1&p=f&t=EEieorg6x9lTZoWD-0]`

---

## BƯỚC 1 — ĐỌC FIGMA

Dùng Figma MCP trích xuất và in bảng tóm tắt:
| Token | Value |
|---|---|
| primary | #xxx |
| typography | ... |
| spacing | ... |

Sau đó tự động chạy thẳng sang Bước 2, KHÔNG dừng chờ confirm.

---

## BƯỚC 2 — THEME

Tạo `src/theme.ts` với `createTheme()`, map toàn bộ tokens từ Bước 1:

- `palette`, `typography`, `shape`
- `components.Mui[X].styleOverrides` cho Chip, Button, TextField
  > Không hardcode màu/font trong bất kỳ component file nào.

---

## BƯỚC 3 — TYPES + MOCK DATA

`src/types/property.ts`:

```ts
export type PropertyStatus = "available" | "sold" | "contact";
export type PropertyType =
  | "don-lap"
  | "song-lap"
  | "tu-lap"
  | "lien-ke"
  | "shophouse";

export interface Property {
  id: string;
  code: string;
  isHot: boolean;
  type: PropertyType;
  area: number;
  listedPrice: number;
  loanPrice: number;
  status: PropertyStatus;
  position: { x: number; y: number }; // % relative trên map container
}
```

`src/data/mockData.ts`: tối thiểu 8 căn, đa dạng type/status/isHot,
position phân bố hợp lý. Xóa file này là thay bằng API call được ngay.

---

## BƯỚC 4 — IMPLEMENT COMPONENTS

Cấu trúc file:
src/components/PropertyMap/
├── index.tsx # Root, state chính (selectedId, activeFilters)
├── MapHeader.tsx # Title + SearchBar
├── FilterBar.tsx # Filter chips, toggle state
├── MapCanvas.tsx # Bản đồ + render markers
├── PropertyMarker.tsx # Badge marker (stateless)
└── PropertyPopup.tsx # Card popup khi click (stateless)
Thứ tự implement:
`theme` → `Marker` → `Popup` → `FilterBar` → `MapCanvas` → `MapHeader` → `index`

Logic bắt buộc:

- Marker click → mở Popup tại vị trí tương ứng
- Click ngoài Popup → đóng (`ClickAwayListener`)
- FilterBar toggle → ẩn/hiện Marker theo `type` active
- Popup render đúng theo `status`:
    - `available`: hiện giá + nút CTA
    - `sold`: badge "Đã bán"
    - `contact`: text "Admin sẽ liên hệ sớm nhất"

---

## BƯỚC 5 — RESPONSIVE & MAP BEHAVIOR

### Map Container

- Wrapper ngoài: `overflow-x: auto` trên mobile
- Image container: `position: relative`, `min-width: 800px`
- `<Box component="img">` với `width: 100%`, `height: auto`

### Marker Position — Thuần CSS, không JS

Tuyệt đối KHÔNG dùng `ResizeObserver` hay `getBoundingClientRect`.
CSS `%` tự scale theo ảnh, không cần JS can thiệp:

```tsx
sx={{
  position: 'absolute',
  left: `${position.x}%`,
  top: `${position.y}%`,
  transform: 'translate(-50%, -100%)',
}}
```

### Responsive Popup

- Desktop/Tablet: `position: absolute` gần marker + `ClickAwayListener`
- Mobile (`useMediaQuery(theme.breakpoints.down('md'))`):
    → Dùng `<Drawer anchor="bottom">` thay Popup tuyệt đối

---

## RÀNG BUỘC

| ❌ KHÔNG                            | ✅ BẮT BUỘC                       |
| ----------------------------------- | --------------------------------- |
| CSS / SCSS / Tailwind               | Chỉ `sx` hoặc `styled()` của MUI  |
| `import { X } from '@mui/material'` | `import X from '@mui/material/X'` |
| `<div style="display:flex">`        | `<Stack>` (1D) / `<Grid>` (2D)    |
| `any` type                          | TypeScript strict                 |
| File > 200 dòng                     | Tách component                    |
| JS để tính lại marker position      | Thuần CSS `%`                     |

### Xử lý Output Dài

Code theo thứ tự batch:

1. `theme.ts` + `types/` + `mockData.ts`
2. `PropertyMarker` + `PropertyPopup` + `MapCanvas`
3. `FilterBar` + `MapHeader` + `index`

Nếu đạt giới hạn output, dừng cuối file hoàn chỉnh và in:
`[ĐỢI LỆNH CONTINUE ĐỂ CODE TIẾP]`
Tuyệt đối không cắt ngang giữa function.

---

## CHECKLIST HOÀN THÀNH

- [ ] Tokens từ Figma đã in bảng tóm tắt
- [ ] `theme.ts` không có màu hardcode
- [ ] Marker dùng thuần CSS `%`, không JS resize
- [ ] Mock data xóa là thay API được
- [ ] Popup đóng khi click ngoài
- [ ] Mobile dùng Drawer bottom
- [ ] Filter hoạt động đúng
- [ ] Không có lỗi TypeScript

Đây là bản cuối, đã ổn chưa, tôi muốn confirm từ figma
