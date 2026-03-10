# Admin Portal Design Spec (MVP vòng 1)

## 1. Information Architecture (Sidebar cấp 1)
- Dashboard
- Trang chủ
- Tin tức/Sự kiện
- Văn bản
- Media
- Duyệt nội dung
- TTHC (phase sau)
- Hỏi đáp (phase sau)
- Liên hệ/Ticket (phase sau)
- Báo cáo
- Người dùng & quyền
- Audit log
- Cấu hình

## 2. Bộ màn hình MVP đã triển khai prototype
- `admin/index.html`: Dashboard tổng quan.
- `admin/homepage-manager.html`: Quản lý block trang chủ.
- `admin/news-list.html`: Danh sách tin tức + filter + bulk action.
- `admin/news-editor.html`: Soạn/chỉnh sửa bài + metadata + SEO + media picker.
- `admin/media-library.html`: Media library + upload + phân loại.
- `admin/approval-queue.html`: Hàng đợi duyệt + compare version + approve/reject.
- `admin/workflow-history.html`: Timeline trạng thái và audit event.

## 3. Wireframe text chuẩn theo màn hình
- Header vùng thao tác: tiêu đề + action chính + action phụ.
- Vùng filter/search: keyword + bộ lọc trạng thái/chuyên mục/thời gian.
- Vùng dữ liệu chính: table/list/card + status badge + quick actions.
- Drawer/modal thao tác: approve/reject, pin/unpin, lịch publish, media picker.
- Footer: pagination + tổng bản ghi + export.

## 4. Quy tắc trạng thái UI
- Trạng thái chung:
  - `Empty`
  - `Loading`
  - `Error`
  - `No permission`
  - `Archived`
  - `Scheduled`
- Validation/feedback:
  - Toast success khi lưu/duyệt thành công.
  - Toast warning khi thiếu metadata hoặc chờ duyệt.
  - Toast error khi lỗi quyền hoặc lỗi dữ liệu bắt buộc.

## 5. Phân quyền hiển thị (prototype)
- Biên tập viên:
  - Có: tạo/sửa/lưu nháp/gửi duyệt.
  - Không có: publish trực tiếp.
- Kiểm duyệt viên:
  - Có: approve/reject/publish/gỡ publish.
- Super Admin:
  - Có toàn quyền + override khẩn.
- Chuyên viên nghiệp vụ:
  - Read ở nhóm nội dung MVP.

## 6. Interface/types dùng cho UI map
- Workflow status:
  - `draft | review | approved | published | archived`
- Content record:
  - `title, category, author, updated_at, published_at, status, featured`
- Homepage config:
  - `block_id, block_type, item_ids, order, visibility, schedule`
- Audit event:
  - `action, module, record_id, actor, timestamp, note`
- Component hệ thống:
  - `DataTable`, `FilterBar`, `StatusBadge`, `ApprovalPanel`, `MediaPicker`, `AuditTimeline`

## 7. Checklist nghiệm thu thiết kế admin
- IA:
  - Mỗi chức năng MVP đi tới được trong <= 2 click từ dashboard.
- Workflow role:
  - Biên tập viên không thấy nút publish trực tiếp.
  - Kiểm duyệt viên thấy approve/reject ở hàng duyệt.
  - Super Admin có quyền override.
- Wireframe:
  - Mỗi màn hình có action bar, filter, data view, feedback states.
- Nhất quán:
  - Trạng thái workflow đồng nhất ở dashboard/list/detail/approval/history.
  - Tác vụ quan trọng phải thể hiện event audit.
