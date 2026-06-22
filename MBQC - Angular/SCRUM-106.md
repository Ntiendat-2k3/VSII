# [SCRUM-106] [EndUser][Chi tiết dự án]Tab "Mặt bằng quỹ căn" trong mỗi dự án

* **Status:** To Do
* **Project:** Vinhomes Biz Dev Team
* **Components:** None
* **Affects versions:** None
* **Fix versions:** None

---

* **Type:** Feature
* **Priority:** Medium
* **Reporter:** Tran The Dung
* **Assignee:** Đạt Nguyễn
* **Resolution:** Unresolved
* **Votes:** 0
* **Labels:** None
* **Remaining Estimate:** Not Specified
* **Time Spent:** Not Specified
* **Original estimate:** Not Specified

---

* **Rank:** 0|i000fr:
* **Sprint:** SCRUM Sprint 1

---

## Link Figma

Web chưa đăng nhập: https://www.figma.com/design/7HeIbkQzihqb0hdFTudDWJ/Website-B%C4%90S?node-id=1586-2941&t=JqTVBQjJhTB7DmVp-0 

Web đã đăng nhập: https://www.figma.com/design/7HeIbkQzihqb0hdFTudDWJ/Website-B%C4%90S?node-id=135-1893&t=JqTVBQjJhTB7DmVp-0 

Mobile: https://www.figma.com/design/7HeIbkQzihqb0hdFTudDWJ/Website-B%C4%90S?node-id=247-8128&t=JqTVBQjJhTB7DmVp-0 

## Description

* Yêu cầu đăng nhập mới xem được nội dung
	* Chưa đăng nhập thì hiện thị giao diện ảnh che mờ và hiển thị form đăng nhập
	* Đăng nhập thì call API hiển thị danh sách quỹ căn
* Hiển thị bản đồ dự án dạng tile
* Mặc định chỉ hiện thị các căn ở trạng thái "Còn hàng" theo dự án đang chọn sẵn lên trên bản đồ
	* Mã căn - Diện Tích - Loại hình
	* Giá Gốc
	* Giá Vay (Nếu có)
* Có thể Phóng to, thu nhỏ bản đồ
* Có thể kéo di chuyển sang trái, sang phải bản đồ
* Lọc các căn theo các tiêu chí: Căn HOT, Đơn lập, Song lập,Tứ Lập, Liền Kề, Shophouse:
	* Mặc định đầu tiên chọn hết (Căn HOT, Đơn lập, Song lập,Tứ Lập, Liền Kề, Shophouse):
		* Icon Căn HOT **màu đỏ**
		* Icon Đơn lập, Song lập,Tứ Lập, Liền Kề, Shophouse **màu xanh**
	* Tiêu chí nào tích bỏ thì thành **màu xám**
* Căn hot thì hiển thị màu đỏ nổi bật trên bản đồ
* Tìm kiếm theo mã căn: auto typing search, Nhập mã căn và chọn căn được gợi ý, focus đến tọa độ căn và zoom lên:
	* Căn "Còn hàng" trong bảng hàng thì đã hiển thị sẵn Titile Mã căn, diện tích, loại hình, Giá gốc, giá vay rồi nên giữ nguyên, nếu bị ẩn do đang lọc thì hiển thị lên lại
	* Căn "Đã bán" trong bảng hàng thì hiện thị lên form dữ liệu Mã căn, diện tích, loại hình và từ "Đã bán" (không hiển thị giá)
	* Căn ko có trong bảng hàng thì hiện thị form dữ liệu Mã Căn, diện tích - Quỹ hàng Ẩn và button "Xin thông tin" -> bấm vào button này thì hiển thị· "Admin sẽ liên hệ sớm nhất" (Gửi mail cho admin thông tin: Thông tin User (SDT, Tên, Email), Tên dự án, Mã căn đang cần xin thông tin), lưu thông tin để quản lý yêu cầu xin thông tin
		* Nếu User đã gửi xin thông tin rồi thì hiển thị trạng thái quản lý yêu cầu này
* Bấm vào 1 căn để Xem chi tiết thông tin căn
* Diện tích ko cần làm tròn, hiển thị bình thường
* Fomat về giá:
	* Giá Gốc và Giá Vay làm tròn xuống và fomat dạng xx,xx tỷ
		* Ví dụ: 15,101,436,069 VNĐ thì fomat về 15,10 tỷ
		* Ví dụ: 15,121,436,069 VNĐ thì fomat về 15,12 tỷ
		* Ví dụ: 15,129,436,069 VNĐ thì fomat về 15,12 tỷ


## Danh sách API

`/portal/map/get` lấy file dzi để hiển thị tile với maxZoomLevel = "totalTiles"

* "mapType": "PROJECT",
* "refId": projectId

`/portal/map/search` lấy danh sách các căn ở trạng thái “Còn hàng“ trong bảng hàng theo dự án đang chọn để hiển thị lên bản đồ

* "refId": projectId,
* "mapType": "PROJECT"
* Lọc các căn theo các tiêu chí: Căn HOT, Đơn lập, Song lập,Tứ Lập, Liền Kề, Shophouse, FE tự lọc trên danh sách dữ liệu đã lấy về

`/portal/map/get-codes` Tìm kiếm theo mã căn: auto typing search, Nhập mã căn và chọn căn

* "refId": projectId,
* "mapType": "PROJECT",
* "keyword":

`/portal/map/search` lấy tọa độ vị trí căn đang tìm kiếm vị trí

* "refId": projectId,
* "mapType": "PROJECT",
* "keyword": Mã căn chính xác chọn từ auto typing search

Dữ liệu từ tìm kiếm căn:

* focus đến tọa độ căn và zoom lên vỡi zoom = "totalTiles"
	* ```
	  "rotation": 270,
	  "pageWidth": 2383.93994140625,
	  "pageHeight": 3370.389892578125,
	  "x": 1104.6239,
	  "y": 1306.5474,
	  "dpi": 600,
	  "xPixel": 9205,
	  "yPixel": 10888
	  ```
* `{"statusCode": "AVAILABLE"}` Căn "Còn hàng" trong bảng hàng thì đã nếu đang hiển thị sẵn Titile Mã căn, diện tích, loại hình, Giá gốc, giá vay rồi thì giữ nguyên, nếu chưa hiển thị thì hiển thị lên lại
* `{"statusCode": "SOLD"}` Căn "Đã bán" trong bảng hàng thì hiện thị lên form dữ liệu Mã căn, diện tích, loại hình và từ "Đã bán" (không hiển thị giá)
* `{"statusCode": null}` Căn ko có trong bảng hàng thì hiện thị form dữ liệu Mã Căn, diện tích - **Quỹ hàng Ẩn** và button "**Xin thông tin**" -> bấm vào button này thì hiển thị· "**Admin sẽ liên hệ sớm nhất**" (Gửi mail cho admin thông tin: Thông tin User (SDT, Tên, Email), Tên dự án, Mã căn đang cần xin thông tin), lưu thông tin để quản lý yêu cầu xin thông tin
* "inquiryStatusCode":, "inquiryStatusName" trạng thái yêu cầu của căn đang tìm kiếm
  PENDING("Chờ Admin liên hệ"),
  COMPLETED("Admin đã gửi thông tin"),
  REJECTED("Admin từ chối yêu cầu"),
  EXPIRE("Hết hạn");

`/portal/units-inquiry/create` xin thông tin căn

* "projectId": projectId,
* "unitCode": Mã căn