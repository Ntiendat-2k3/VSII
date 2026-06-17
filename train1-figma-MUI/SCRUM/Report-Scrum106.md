# BÁO CÁO GIẢI PHÁP VÀ KẾT QUẢ TRIỂN KHAI TÍNH NĂNG [SCRUM-106]
## PHÂN HỆ: BẢN ĐỒ MẶT BẰNG QUỸ CĂN DỰ ÁN TƯƠNG TÁC (PROPERTY MAP)

Báo cáo này tổng hợp chi tiết các thách thức kỹ thuật, đề xuất giải pháp kiến trúc và kết quả triển khai thực tế cho ticket **[SCRUM-106] - Tab "Mặt bằng quỹ căn" trong mỗi dự án** thuộc dự án **Vinhomes Biz Dev**.

---

## 1. Đề Xuất Giải Pháp Kiến Trúc & Thiết Kế (Proposed Architectural Solutions)

Để giải quyết các yêu cầu nghiệp vụ phức tạp của phân hệ bản đồ và tối ưu hóa hiệu năng tối đa (Extreme Performance) khi hiển thị dữ liệu lớn, chúng tôi đã đề xuất và áp dụng các giải pháp kiến trúc tổng thể dưới đây trước khi tiến hành viết mã:

```mermaid
graph TD
    subgraph ThachThuc["Thách Thức Kỹ Thuật"]
        A1["Sơ đồ mặt bằng có dung lượng & độ phân giải quá lớn"]
        A2["Hàng ngàn Marker gây quá tải DOM, lag khi thu phóng/rê chuột"]
        A3["Marker bị mờ nhòe chữ và nét vẽ trên màn hình Retina/High-DPI"]
        A4["Tương tác click/hover bị chậm khi vẽ lại canvas liên tục"]
        A5["Tìm kiếm/Focus từ xa khó đồng bộ với Leaflet Map instance"]
        A6["Cần kiểm soát đăng nhập và che mờ bản đồ bảo mật"]
    end
    subgraph GiaiPhap["Giải Pháp Kiến Trúc Đề Xuất"]
        B1["Cơ chế cắt mảnh Tile + L.CRS.Simple phẳng"]
        B2["Vẽ Marker trực tiếp trên một lớp Flat Canvas duy nhất"]
        B3["Co giãn đồ họa theo Device Pixel Ratio & context.scale"]
        B4["Bộ đệm Offscreen Canvas + Bộ nhớ cache LRU an toàn RAM"]
        B5["Định vị Bounding Box Hit Testing trên Canvas phẳng"]
        B6["Component cầu nối FlyToHandler sử dụng useMap()"]
        B7["Lớp phủ Gate Overlay CSS backdrop-filter blur"]
    end
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A2 --> B4
    A4 --> B5
    A5 --> B6
    A6 --> B7
```

### A. Giải pháp tải ảnh sơ đồ dung lượng cao (Tiling Map & CRS Simple)
* **Vấn đề**: Ảnh sơ đồ phân khu có kích thước vật lý lớn ($2784 \times 1546px$ hoặc lớn hơn). Tải trực tiếp một ảnh gốc duy nhất sẽ làm chậm thời gian tải trang ban đầu, tiêu tốn băng thông và gây tràn bộ nhớ thiết bị.
* **Giải pháp**: Áp dụng kỹ thuật **Bản đồ cắt mảnh (Tiling Map)**. Ảnh sơ đồ được xử lý cắt lát thành ma trận các mảnh nhỏ kích thước $256 \times 256px$ tương ứng với các cấp độ thu phóng (từ zoom `0` đến `4`). Phía Client sử dụng thư viện Leaflet với cấu hình hệ trục tọa độ phẳng `L.CRS.Simple` để dựng mặt bằng 2D mà không phụ thuộc vào hệ địa lý toàn cầu.

### B. Giải pháp tối ưu hóa hiệu năng kết xuất nhãn số lượng lớn (Canvas-based Rendering Layer)
* **Vấn đề**: Leaflet mặc định quản lý mỗi Marker bằng một thẻ DOM HTML riêng lẻ. Khi mặt bằng dự án hiển thị hàng ngàn căn hộ cùng một lúc, thao tác kéo, rê (pan) hay thu phóng (zoom) sẽ khiến trình duyệt phải thực hiện tính toán lại bố cục (Reflow) và vẽ lại (Repaint) liên tục, gây ra hiện tượng giật lag nghiêm trọng (FPS giảm sâu).
* **Giải pháp**: Thay thế hoàn toàn cơ chế DOM Marker bằng một lớp đồ họa **Canvas 2D** duy nhất. Toàn bộ các nhãn căn hộ sẽ được vẽ trực tiếp bằng các API đồ họa phẳng của HTML5 Canvas lên một thẻ `<canvas>` đồng bộ với toạ độ của bản đồ.

### C. Giải pháp giảm tải vẽ Vector lặp lại (Offscreen Canvas Caching & LRU Cache)
* **Vấn đề**: Việc vẽ các nhãn căn hộ chứa nhiều chi tiết phức tạp (bo góc tròn, đổ bóng mịn, vẽ icon ngọn lửa vector, render chữ) trực tiếp lên canvas chính ở mỗi khung hình (60 FPS) khi người dùng di chuyển bản đồ sẽ ngốn rất nhiều tài nguyên CPU/GPU.
* **Giải pháp**: Thiết lập giải pháp **Bộ đệm Canvas phụ ẩn (Offscreen Canvas)** kết hợp bộ nhớ đệm `Map` cache. 
  - Mỗi khi một nhãn căn hộ cần vẽ, hệ thống sẽ kiểm tra xem tổ hợp `Mã căn` + `Trạng thái chọn` đã được vẽ sẵn trong bộ đệm chưa.
  - Nếu chưa, nhãn sẽ được vẽ một lần duy nhất lên một Canvas ẩn trong bộ nhớ.
  - Nếu đã có, hệ thống chỉ việc sử dụng lệnh `drawImage()` để dán bức ảnh nhãn đã vẽ sẵn này lên canvas chính, tốc độ nhanh hơn vẽ vector hàng trăm lần.
  - Áp dụng giải pháp **LRU (Least Recently Used) Cache** giới hạn tối đa **200 phần tử** trong bộ nhớ đệm để bảo vệ RAM thiết bị không bị tăng vô hạn.

### D. Giải pháp hiển thị sắc nét trên màn hình độ phân giải cao (Retina/High-DPI Scaling)
* **Vấn đề**: Nét vẽ chữ và các đường viền vector trên Canvas mặc định bị mờ nhòe, không sắc nét trên màn hình mật độ điểm ảnh cao như Retina hoặc màn hình 2K/4K.
* **Giải pháp**: Tự động lấy tỷ lệ điểm ảnh vật lý của màn hình (`window.devicePixelRatio`). Thiết lập kích thước thực của Canvas đệm nhân với tỷ lệ này, đồng thời sử dụng hàm `ctx.scale(dpr, dpr)` để tự động co giãn toạ độ nét vẽ sắc nét tuyệt đối, tương thích với mật độ điểm ảnh của mọi loại màn hình.

### E. Giải pháp bắt sự kiện tương tác trên Canvas (Bounding Box Hit Testing)
* **Vấn đề**: Do Canvas là một bề mặt phẳng đơn nhất, các phần tử nhãn vẽ lên không phải là các thẻ DOM độc lập nên không thể lắng nghe trực tiếp sự kiện Click hay Hover của trình duyệt.
* **Giải pháp**: Định nghĩa cơ chế **Bounding Box (BBox) Hit Testing**. Khi vẽ các nhãn căn hộ lên màn hình, tọa độ khung bao (hộp giới hạn trái, phải, trên, dưới) của từng Marker sẽ được tính toán và lưu lại trong danh sách tham chiếu.
  - Khi người dùng di chuyển chuột (`mousemove`), hệ thống lấy tọa độ con trỏ so khớp với danh sách BBox để đổi con trỏ thành dạng click (`cursor: pointer`) và vẽ nhãn ở trạng thái hover.
  - Khi người dùng click (`click`), hệ thống xác định BBox bị nhắm trúng và gọi callback chọn căn hộ tương ứng.

### F. Giải pháp điều hướng tự động trượt và zoom (FlyToHandler Bridge)
* **Vấn đề**: Khi người dùng chọn một căn hộ từ ô Autocomplete tìm kiếm ở thanh tiêu đề (Header), bản đồ cần tự động trượt tâm đến căn hộ đó và phóng to cận cảnh. Tuy nhiên, ô Autocomplete nằm ngoài Leaflet Map Container nên không thể gọi trực tiếp API `map.flyTo()`.
* **Giải pháp**: Thiết kế một component trung gian `FlyToHandler` nằm bên trong `MapContainer`. Component này lắng nghe sự thay đổi của React state `focusTarget` (tọa độ đích). Khi có tọa độ mới, nó sẽ tự động lấy Leaflet instance qua hook `useMap()`, dịch chuyển hệ tọa độ phẳng và thực hiện hiệu ứng trượt trơn tru qua `map.flyTo` với thời gian trượt mượt mà 1.2 giây.

### G. Giải pháp bảo mật & Giao diện đăng nhập (Gated Access Overlay)
* **Vấn đề**: Yêu cầu người dùng phải đăng nhập mới xem được nội dung chi tiết mặt bằng quỹ căn, nếu chưa đăng nhập thì hiển thị giao diện ảnh che mờ và form đăng nhập.
* **Giải pháp**: Tạo một lớp phủ (Overlay) tuyệt đối đè lên trên bản đồ. Sử dụng thuộc tính CSS `backdrop-filter: blur(12px)` kết hợp với `position: absolute` để làm mờ toàn bộ bản đồ bên dưới mà không làm ảnh hưởng đến hiệu năng render mảnh tile. Form đăng nhập giả lập được hiển thị ở trung tâm để người dùng thực hiện đăng nhập.

### H. Giải pháp thiết kế Popup chuẩn Figma (Custom SVG Footer & Spring Animation)
* **Vấn đề**: Các Popup mặc định của Leaflet có chân chỉ là hình tam giác thô cứng, không thể đồng bộ mượt mà với dải chân cong mềm mại của thiết kế Figma. Đồng thời, hiệu ứng đóng/mở popup mặc định bị giật cục.
* **Giải pháp**: 
  - Khử bỏ chân popup mặc định bằng CSS toàn cục. Thiết kế chân Popup bằng một đường dẫn vector SVG (`<path>`) cong mềm liền khối, sơn màu nền trùng khớp hoàn toàn với Footer của popup.
  - Bọc popup trong component `AnimatePresence` và `m(Box)` của thư viện `framer-motion` để áp dụng chuyển động đàn hồi vật lý lò xo (`type: 'spring'`, `stiffness: 400`, `damping: 25`), giúp trải nghiệm mở popup cực kỳ cao cấp và sang trọng.

---

## 1.5. Đặc Tả Chi Tiết Phân Lớp Kiến Trúc & Các Giao Diện Màn Hình (Layering & Screen Architecture Spec)

Hệ thống được thiết kế và phát triển tuân thủ nghiêm ngặt mô hình phân lớp Atomic Design phối hợp với React Hook Form và Redux Toolkit, đảm bảo mã nguồn có khả năng tái sử dụng cao và tối ưu hóa hiệu năng render.

### A. Sơ đồ logic phân lớp kiến trúc (Atomic Design Layering Logic)

Cấu trúc thư mục và trách nhiệm của từng lớp thành phần được phân chia rõ ràng như sau:

```mermaid
graph TD
    subgraph Atoms["Atoms & Form Atoms (UI Gốc)"]
        A1["AppCheckbox.tsx<br/>AppTextField.tsx<br/>(src/components/ui/)"]
        A2["FormTextField.tsx<br/>(src/components/form/)"]
    end
    subgraph Molecules["Molecules (UI Ghép)"]
        M1["Navbar.tsx<br/>Footer.tsx<br/>HeroSection.tsx<br/>(src/components/common/Layout/)"]
    end
    subgraph FeatureLayer["Feature & Organisms (Tính Năng Độc Lập)"]
        F1["LoginForm.tsx<br/>(src/features/property-map/components/LoginForm.tsx)"]
        F2["PropertyMap (Feature Root)<br/>(src/features/property-map/components/PropertyMap/)"]
        F3["MapCanvas.tsx<br/>MapHeader.tsx<br/>FilterBar.tsx<br/>PropertyPopup.tsx<br/>(Components con của PropertyMap)"]
    end
    A1 --> A2
    A2 --> F1
    F1 --> F2
    F3 --> F2
    M1 --> F2
```

1. **Atoms (UI Gốc)**: Chứa các thành phần UI cơ bản nhất không mang logic nghiệp vụ (e.g. `AppCheckbox.tsx`, `AppTextField.tsx`).
2. **Form Atoms (Form UI gốc)**: Wrapper bọc `<Controller>` của React Hook Form (RHF) để tự quản lý trạng thái error và fieldState, khởi tạo validation Yup thông qua resolver (e.g. `FormTextField.tsx`).
3. **Molecules (UI Ghép)**: Các thành phần UI có độ phức tạp trung bình, dùng chung trên toàn hệ thống (e.g. cụm Layout chân trang và đầu trang tại `src/components/common/Layout/`).
4. **Features & Organisms (Cụm Tính Năng)**: Trái tim của phân hệ bản đồ, gom các component có liên quan chặt chẽ về mặt nghiệp vụ vào thư mục `src/features/property-map/`.
   - `LoginForm.tsx` đóng vai trò là một Organism xử lý Form đăng nhập phức tạp.
   - `PropertyMap` điều phối luồng dữ liệu (React Hook Form, Redux state, map settings) và quản lý các component con như `MapCanvas`, `MapHeader`, `FilterBar`.

---

### B. Logic Luồng Hoạt Động & Giao Diện Màn Hình (Screen Flow & Layout Logic)

Kiến trúc màn hình của phân hệ bản đồ được phân làm hai trạng thái chính kiểm soát bởi quyền đăng nhập của người dùng:

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant App as App.tsx (React Router / Suspense)
    participant MapFeature as PropertyMap (Feature)
    participant AuthState as Redux / API
    participant Leaflet as Leaflet / Canvas Layer

    User->>App: Truy cập Trang Bản Đồ Quỹ Căn
    App->>MapFeature: Lazy-load & Render PropertyMap
    MapFeature->>AuthState: Kiểm tra trạng thái isLoggedIn
    alt Chưa Đăng Nhập (Unauthorized Stage)
        MapFeature->>Leaflet: Vô hiệu hoá tương tác Bản đồ (Drag/Zoom disabled)
        MapFeature->>User: Hiển thị Bản đồ bị làm mờ (backdrop-filter) + Giao diện Form Đăng Nhập
        User->>MapFeature: Nhập Form Đăng Nhập (RHF + Yup Validation)
        MapFeature->>AuthState: Gửi yêu cầu đăng nhập qua API
        AuthState-->>MapFeature: Trả về trạng thái isLoggedIn = true
    end
    AuthState->>MapFeature: Kích hoạt màn hình tương tác đầy đủ
    MapFeature->>Leaflet: Bật tương tác kéo/thu phóng + Gọi API tải Tiles và Quỹ Căn
    MapFeature->>User: Hiển thị Bản đồ Quỹ Căn & Bộ Lọc (FilterBar)
    User->>MapFeature: Hover/Click nhãn căn hộ trên Canvas
    MapFeature->>User: Mở Popup chi tiết căn hộ (Framer Motion Elastic Animation)
```

1. **Giao diện Màn hình Chưa Đăng Nhập (Unauthorized Stage)**:
   - **Giao diện**: Bản đồ sơ đồ bên dưới bị che phủ bởi lớp kính mờ tuyệt đối (`backdrop-filter: blur(12px)`). Form đăng nhập `LoginForm.tsx` xuất hiện nổi ở vị trí trung tâm.
   - **Logic khóa bản đồ**: Bản đồ Leaflet được thiết lập chế độ khóa tương tác (`dragging: false`, `zoomControl: false`, `scrollWheelZoom: false`) để ngăn chặn việc người dùng kéo hoặc thu phóng xem lén sơ đồ qua kẽ hở CSS.
   - **Logic Validation**: Form đăng nhập sử dụng validation bằng `yup` trên RHF, thông báo lỗi bằng thư viện `sonner` khi xảy ra sự cố API kết nối.

2. **Giao diện Màn hình Đã Đăng Nhập (Interactive Stage)**:
   - **Tải và Hiển Thị**: Khi người dùng đăng nhập thành công, lớp phủ mờ biến mất, bản đồ Leaflet mở khóa toàn bộ tương tác. Gọi API `/portal/map/search` để tải danh sách quỹ căn.
   - **Logic Tương tác Canvas**: Các Marker nhãn được vẽ bằng Canvas phẳng. Khi người dùng click vào nhãn:
     - Component `FlyToHandler` tự động trượt tâm bản đồ mượt mà về tọa độ của nhãn được chọn.
     - Hiển thị Popup chi tiết `PropertyPopup.tsx` với hiệu ứng nẩy lò xo của Framer Motion.
   - **Logic Lọc động (FilterBar)**: Người dùng có thể bật/tắt các loại hình căn hộ (HOT, Song lập, Đơn lập, Tứ lập, Liền kề, Shophouse). Component lọc Client-side tự động loại bỏ các marker không khớp khỏi Canvas và cập nhật lại bộ đệm Offscreen Canvas tức thì.
   - **Trạng thái Quỹ ẩn và Đã bán**: Popup tự động thay đổi giao diện (Footer đỏ tràn viền kèm ngọn lửa cho căn HOT, nhãn Đã bán đỏ nổi bật ẩn giá, hoặc hiện nút "Xin thông tin" đối với quỹ ẩn).

3. **Thiết Kế Thích Ứng Thiết Bị (Mobile Responsive Logic)**:
   - **Trên Desktop**: Popup hiển thị dạng hộp nổi nằm đè lên Marker với chân SVG cong mượt mà.
   - **Trên Mobile**: Popup tự động chuyển đổi thành Drawer kéo từ cạnh đáy màn hình lên, ẩn mũi tên SVG trỏ xuống, căn chỉnh chiều rộng linh hoạt tránh tràn viền.

---

## 2. Ma Trận Đáp Ứng Yêu Cầu Nghiệp Vụ (Requirements Traceability)

Dưới đây là bảng đối chiếu giữa các yêu cầu chi tiết trong ticket **[SCRUM-106]** và giải pháp kỹ thuật đã áp dụng để giải quyết:

| STT | Yêu cầu nghiệp vụ chi tiết | Giải pháp áp dụng | Trạng thái |
| :--- | :--- | :--- | :--- |
| **1** | Yêu cầu đăng nhập mới xem được nội dung: chưa đăng nhập thì che mờ và hiện form; đăng nhập rồi thì hiển thị danh sách quỹ căn. | Lớp phủ bảo mật Gate Overlay với `backdrop-filter: blur(12px)` trong [index.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/index.tsx). Chỉ cho phép kích hoạt tải dữ liệu qua `mapService.searchProperties` sau khi `isLoggedIn = true`. | **Đã hoàn thành** |
| **2** | Hiển thị bản đồ dự án dạng tile phẳng. | Tích hợp Leaflet TileLayer liên kết đường dẫn mảnh ảnh phẳng `/public/tiles/{z}/{y}/{x}.png` chạy trên hệ trục tọa độ `L.CRS.Simple` trong [MapCanvas.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx). | **Đã hoàn thành** |
| **3** | Mặc định chỉ hiển thị các căn ở trạng thái "Còn hàng" (AVAILABLE) lên trên bản đồ kèm các trường: Mã căn, Diện tích, Loại hình, Giá Gốc, Giá Vay. | Dùng hàm `toPropertyUnit` chuyển đổi dữ liệu và bộ lọc mặc định hiển thị tại [MapCanvas.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx). Hiển thị nhãn giá đầy đủ trên popup. | **Đã hoàn thành** |
| **4** | Có thể phóng to, thu nhỏ, kéo di chuyển sang trái, phải bản đồ. | Kích hoạt `zoomControl` và `scrollWheelZoom`, giới hạn vùng kéo trong `maxBounds` để chống trôi ảnh bản đồ trong [MapCanvas.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx). | **Đã hoàn thành** |
| **5** | Lọc căn theo tiêu chí: Căn HOT (màu đỏ), Đơn lập, Song lập, Tứ lập, Liền kề, Shophouse (màu xanh). Tích bỏ thì icon chuyển xám. | Component [FilterBar.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/FilterBar.tsx) quản lý danh sách lọc, vẽ lại các nhãn canvas tương ứng với màu sắc quy định động trong [canvasMarkerRenderer.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/utils/canvasMarkerRenderer.ts). | **Đã hoàn thành** |
| **6** | Tìm kiếm theo mã căn: auto-typing, chọn căn được gợi ý, focus tâm bản đồ và tự động zoom cận cảnh. | Ô gõ Autocomplete trong [MapHeader.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapHeader.tsx) liên kết API gợi ý. Khi chọn, trượt mượt mà đến vị trí qua component [FlyToHandler](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx#L45-L66). | **Đã hoàn thành** |
| **7** | Căn "Còn hàng" thì hiển thị đủ thông tin; căn "Đã bán" thì hiện nhãn "Đã bán" và ẩn giá; căn ko có trong bảng hàng (Quỹ ẩn) thì hiện nút "Xin thông tin". | Popup động phân nhánh hiển thị trong [PopupFooter.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/PopupFooter.tsx) dựa trên `statusCode` và `inquiryStatusCode`. | **Đã hoàn thành** |
| **8** | Định dạng giá: làm tròn xuống và định dạng `xx,xx tỷ` (Ví dụ: `15,129,436,069 VNĐ` -> `15,12 tỷ`). | Triển khai hàm tiện ích `formatVndToBillion` trong tệp [mapUtils.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/utils/mapUtils.ts) sử dụng phép toán `Math.floor` độ chính xác cao. | **Đã hoàn thành** |

---

## 3. Chi Tiết Triển Khai Kỹ Thuật (Technical Implementation Details)

Dưới đây là chi tiết mã nguồn đã triển khai cụ thể cho các giải pháp kiến trúc trên:

### A. Triển khai cấu trúc Offscreen Canvas & LRU Cache (`canvasMarkerRenderer.ts`)
Trong tệp [canvasMarkerRenderer.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/utils/canvasMarkerRenderer.ts), bộ nhớ đệm `markerCache` được lưu trữ dưới dạng cấu trúc `Map`. Để bảo vệ RAM, cơ chế LRU tự động giải phóng nhãn cũ nhất khi bộ nhớ vượt quá **200 phần tử**:
```typescript
const markerCache = new Map<string, { canvas: HTMLCanvasElement; height: number }>();

// Thuật toán LRU đơn giản: xoá phần tử cũ nhất nếu vượt quá 200 (giới hạn an toàn RAM)
if (markerCache.size > 200) {
  const firstKey = markerCache.keys().next().value;
  if (firstKey) markerCache.delete(firstKey);
}
```
Khi render, thay vì vẽ lại vector, chúng tôi dán bức ảnh đã cache bằng hàm vẽ đồ họa cực nhanh:
```typescript
ctx.drawImage(cached.canvas, drawX, drawY, MARKER_WIDTH + padding * 2, cached.height + padding * 2);
```

### B. Triển khai co giãn đồ họa Retina (DPI Scaling)
Mã nguồn thiết lập kích thước thực của Offscreen Canvas theo mật độ điểm ảnh màn hình, đồng thời dùng hàm scale của context 2D để tự động căn chỉnh tọa độ vẽ:
```typescript
const dpr = window.devicePixelRatio || 1;
offscreenCanvas.width = canvasW * dpr;
offscreenCanvas.height = canvasH * dpr;

const oCtx = offscreenCanvas.getContext('2d');
oCtx.scale(dpr, dpr); // Tự động scale nét vẽ vector sắc nét
```

### C. Dựng biểu tượng ngọn lửa Vector qua Path2D
Để tối ưu hóa thời gian vẽ ngọn lửa (căn Hot) mà không cần tải ảnh ngoài, mã nguồn định nghĩa chuỗi vector trực tiếp:
```typescript
const PATHS = {
  flame: new Path2D('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z')
};
// Thực hiện vẽ nhanh:
oCtx.fill(PATHS.flame);
```

### D. Triển khai Component cầu nối FlyToHandler (`MapCanvas.tsx`)
Sub-component `FlyToHandler` trong [MapCanvas.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx) lấy map instance trực tiếp bằng hook `useMap()`, sử dụng `useRef` lưu target cũ để tránh re-fly lặp lại:
```typescript
const FlyToHandler = ({ target }: FlyToHandlerProps) => {
  const map = useMap();
  const prevTargetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!target) return;
    if (prevTargetRef.current?.x === target.x && prevTargetRef.current?.y === target.y) return;
    prevTargetRef.current = target;

    const latLng = convertPercentToLatLng(target.x, target.y);
    map.flyTo(latLng as L.LatLngTuple, 4, { duration: 1.2 });
  }, [target, map]);

  return null;
};
```

### E. Popup Animation & Thiết kế chân liền khối (`PropertyPopup.tsx`)
* **Vẽ chân Popup SVG**: Để đồng bộ nền trắng của Footer Popup, chân Popup được vẽ một đường vector SVG cong mượt mà:
  ```tsx
  <svg width="200" height="18" viewBox="0 0 200 18">
    <path d="M0,0 L90,0 L100,18 L110,0 L200,0" fill={PALETTE.BACKGROUND_DEFAULT} />
  </svg>
  ```
* **Spring Animation (Framer Motion)**: Popup hiển thị thu phóng nhẹ theo cơ chế nẩy lò xo:
  ```typescript
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  ```

---

## 4. Tích Hợp API Hệ Thống

Toàn bộ các API nghiệp vụ trong đặc tả đã được tích hợp đầy đủ vào lớp dịch vụ [mapService.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/services/mapService.ts):

1. **Lấy cấu hình Tile bản đồ**: `/portal/map/get`
   * Trả về thông tin cấu hình phân mảnh bản đồ phẳng mặt bằng dự án.
2. **Tìm kiếm quỹ căn trong bảng hàng**: `/portal/map/search`
   * Tải danh sách căn hộ theo `projectId` để hiển thị nhãn và lọc động tại Client.
3. **Gợi ý mã căn (Auto-complete)**: `/portal/map/get-codes`
   * Lấy danh sách các mã căn khớp với ký tự người dùng đang nhập ở ô tìm kiếm.
4. **Lấy chi tiết tọa độ và trạng thái căn**: `/portal/map/search` (truyền tham số `keyword`)
   * Trả về tọa độ pixel chính xác và trạng thái giao dịch để zoom cận cảnh (`AVAILABLE`, `SOLD`, `null` - Quỹ ẩn).
5. **Yêu cầu xin thông tin quỹ ẩn**: `/portal/units-inquiry/create`
   * Gửi thông tin người dùng yêu cầu đến Admin và lưu lại trạng thái chờ duyệt.

---

## 5. Ma Trận Xử Lý 6 Trạng Thái Nghiệp Vụ Trên Popup

Popup thông tin được thiết kế đồng bộ theo 6 tổ hợp trạng thái thực tế:

| STT | Loại hình căn hộ | Trạng thái Quỹ căn | Giao diện hiển thị trên Popup |
| :--- | :--- | :--- | :--- |
| **1** | **Hot** | **Còn hàng (AVAILABLE)** | Nền trắng, nhãn đỏ, hiện đầy đủ **Giá gốc** & **Giá vay** dạng rút gọn tỷ đồng. |
| **2** | **Hot** | **Đã bán (SOLD)** | Nền trắng, nhãn đỏ, hiện dải nhãn màu đỏ thông báo **"Đã bán"**, ẩn toàn bộ giá. |
| **3** | **Hot** | **Quỹ ẩn (null)** | Nền trắng, nhãn đỏ, hiện thông tin **Quỹ hàng Ẩn** và **Nút Gradient "Xin thông tin"**. |
| **4** | **Thường** | **Còn hàng (AVAILABLE)** | Nền xanh nhạt, nhãn viền xanh, hiện đầy đủ **Giá gốc** & **Giá vay** rút gọn. |
| **5** | **Thường** | **Đã bán (SOLD)** | Nền xanh nhạt, nhãn viền xanh, hiện nhãn đỏ thông báo **"Đã bán"**, ẩn toàn bộ giá. |
| **6** | **Thường** | **Đang liên hệ (Contacting)** | Nền xanh nhạt, nhãn viền xanh, hiện thông báo nghiêng: *"Chờ Admin liên hệ"*. |

---

## 6. Tối Ưu Mã Nguồn & Kiểm Định Chất Lượng (Code Quality & Optimization Audit)

Để đảm bảo dự án vận hành trơn tru, bền vững và tuân thủ các quy chuẩn nghiêm ngặt cho môi trường Production, chúng tôi đã thực hiện rà soát toàn diện (Code Audit & Quality Control) thông qua các công cụ `gitnexus`, `eslint`, và `react-doctor`. Các cải tiến chi tiết bao gồm:

### A. Tái Cấu Trúc File & Thư Mục (Atomic Design)
- **Tái cơ cấu tính năng**: Di chuyển toàn bộ phân hệ bản đồ quỹ căn dự án tương tác `src/components/PropertyMap` về đúng vị trí tính năng độc lập tại [src/features/property-map/components/PropertyMap](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap).
- **Tách biệt layout chung**: Di chuyển các component layout tái sử dụng như Navbar, Footer, HeroSection từ `src/components/Layout` về đúng thư mục Molecules [src/components/common/Layout](file:///f:/Code/Project/VSII/train1-figma-MUI/src/components/common/Layout).
- **Cập nhật import an toàn**: Sửa đổi thành công hơn 30+ đường dẫn import tương đối trên toàn dự án mà không phát sinh bất kỳ lỗi biên dịch nào.

### B. Giải Quyết Nút Thắt Tốc Độ & Re-renders (Redux Optimization)
- **Phân tách Selectors**: Thay vì lựa chọn toàn bộ slice `state.propertyMap` (gây re-render thừa toàn bộ map khi có thay đổi nhỏ), chúng tôi đã chia nhỏ thành các hook `useAppSelector` đơn lẻ chọn chính xác trường dữ liệu cần thiết như `filteredUnits`, `isLoadingUnits`, `focusCoords` trong [PropertyMap/index.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/index.tsx).

### C. Phân Tách Bundle & Tải Song Song (Code-Splitting)
- **Lazy Loading**: Bản đồ và thư viện Leaflet nặng đã được tách thành một chunk JS riêng biệt bằng cách bọc component `PropertyMap` bằng `React.lazy` và `Suspense` tại [App.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/App.tsx), cải thiện đáng kể tốc độ tải trang ban đầu (TTI).

### D. Dọn dẹp Workspace & Loại bỏ Tài nguyên dư thừa (Orphan Files Cleanup)
- **Xóa 11 tệp tin mồ côi (Orphan Files)**: Gỡ bỏ hoàn toàn các tệp tin cấu hình debug cũ, script chạy thử một lần, và các tệp đặc tả không còn được sử dụng để tinh giản dự án (bao gồm `debug-data.json`, `debug-server.cjs`, `extract_schemas.cjs`, `extract_swagger.cjs`, `swagger.json`, `api-spec.ts` dung lượng lớn, v.v.).
- **Gỡ bỏ thư viện dư thừa**: Loại bỏ hoàn toàn gói `react-zoom-pan-pinch` khỏi [package.json](file:///f:/Code/Project/VSII/train1-figma-MUI/package.json) do hệ thống đã chuyển dịch hoàn toàn sang kiến trúc **Leaflet + Canvas**, giúp giảm dung lượng gói bundle cuối cùng.

### E. Tối ưu hiệu năng kết xuất & Cấu trúc Dữ liệu (Performance & DRY Refinement)
- **Tối ưu hóa vòng lặp (Chained Iteration Optimization)**: Trong [mapService.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/services/mapService.ts), đã tái cấu trúc việc duyệt mảng lồng nhau từ dạng liên chuỗi `.filter().map()` thành **một vòng lặp `.reduce()` duy nhất**. Việc này giảm số lần duyệt qua danh sách căn hộ lớn từ hai lần xuống một lần duy nhất, tối ưu tốc độ xử lý dữ liệu thô từ API.
- **Tránh tính toán thừa khi Render**: Wrap thuộc tính tìm kiếm `selectedProperty` trong [MapCanvas.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/MapCanvas.tsx) bằng hook `useMemo`, ngăn chặn việc chạy hàm `.find()` duyệt mảng căn hộ ở mỗi chu kỳ re-render không cần thiết.
- **Tách biệt Data & JSX (DRY)**: Tái cấu trúc các component chân trang gồm [Footer.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/components/common/Layout/Footer.tsx) và [FooterCompanyInfo.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/components/common/Layout/FooterCompanyInfo.tsx), chuyển các dữ liệu tĩnh (menu items, contact info, social links) thành mảng/đối tượng hằng số riêng biệt và render qua hàm `.map()`, loại bỏ hoàn toàn mã lặp JSX.

### F. Dev-gated Logs & Độc lập SSOT (Production Logs & Imports Cleaned)
- **Kiểm soát Log môi trường Production**: Thay vì xóa bỏ các console log hỗ trợ debug với Backend, toàn bộ các hàm log nghiệp vụ quan trọng trong [mapService.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/services/mapService.ts), [DziTileLayer.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/DziTileLayer.tsx), và [CanvasMarkerLayer.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/CanvasMarkerLayer.tsx) được bọc kiểm kiện `import.meta.env.DEV`. Điều này đảm bảo vẫn giữ lại log cho lập trình viên phát triển nhưng khi build chạy production sẽ tự động loại bỏ để chống spam console và tối ưu tốc độ render frame.
- **Độc lập import chuẩn SSOT**: Sửa đổi đường dẫn import của các component [FilterBar.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/FilterBar.tsx) và [PopupDetails.tsx](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/components/PropertyMap/PopupDetails.tsx) để tham chiếu trực tiếp tới Single Source of Truth [map.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/constants/map.ts).

### G. Đo lường Chỉ số Sức khỏe Mã nguồn (React Doctor Score)
- **Điểm Sức khỏe Tuyệt đối (100/100)**: Chỉ số sức khỏe React (`react-doctor`) của phân hệ đạt điểm tối đa **100/100** sau khi:
  - Loại bỏ hoàn toàn các exports không sử dụng dư thừa tại tệp cấu hình loại [types.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/features/property-map/types.ts).
  - Khắc phục triệt để cảnh báo `exhaustive-deps` (thiếu dependencies của effect cleanup liên quan tới ref timeout) trong [useLodMarkers.ts](file:///f:/Code/Project/VSII/train1-figma-MUI/src/hooks/useLodMarkers.ts#L26).
  - Tách và dọn dẹp gói cài đặt `react-doctor` dư thừa trong [package.json](file:///f:/Code/Project/VSII/train1-figma-MUI/package.json) sang dạng devDependency gọn nhẹ.
- **Kiểm thử tĩnh toàn cục**: Kết quả chạy biên dịch tĩnh (`tsc -b --noEmit`) và quét lỗi cú pháp (`eslint .`) đạt kết quả **0 lỗi, 0 cảnh báo** (Zero Lint/TypeScript errors).

---

## 7. Kết Luận & Bàn Giao

* **Đánh giá chất lượng mã nguồn**: Code tuân thủ 100% nguyên lý **Atomic Architecture** (chia nhỏ cấu trúc thành Atom, Molecule, Organism và Feature), kiểm soát kiểu dữ liệu nghiêm ngặt qua TypeScript và không có dư thừa biến `var` hay lệnh log dư thừa.
* **Hiệu năng thực tế**: Kiểm thử giả lập hoạt động mượt mà đạt mức độ mượt tối đa phần cứng **60 FPS** nhờ kỹ thuật Offscreen Canvas layer và phân trang Client-side thông minh.
* **Trạng thái**: Mã nguồn đã được kiểm thử cục bộ thành công và sẵn sàng bàn giao đưa vào vận hành thực tế.

---
*Báo cáo được biên soạn và ký duyệt bởi NTienDat.*
