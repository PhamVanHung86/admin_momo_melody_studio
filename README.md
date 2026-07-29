# Momo's Melody Studio — Admin Panel

Trang quản trị (admin dashboard) cho shop **momo's melody studio**, xây dựng
bằng React 19 + Vite + Tailwind CSS. Kết nối tới backend qua REST API
(cookie-based session, `credentials: "include"`).

## Chức năng chính

- Đăng nhập admin (chỉ tài khoản có `role: "admin"` được vào)
- Dashboard: thống kê đơn hàng, doanh thu, biểu đồ (recharts)
- Quản lý sản phẩm: thêm / sửa / xoá, lọc theo danh mục, tìm kiếm
- Quản lý đơn hàng, cập nhật trạng thái
- Quản lý khách hàng
- Flash sale, Banner trang chủ
- Mail Club (gói thành viên): quản lý subscriber, gia hạn, gửi email
- Mail Club Collections
- Quản lý tin nhắn liên hệ

## Yêu cầu

- Node.js 18+
- Backend API đang chạy (xem biến `VITE_API_URL` bên dưới)

## Cài đặt

```bash
npm install
cp .env.example .env   # rồi chỉnh VITE_API_URL cho đúng backend của bạn
npm run dev
```

## Biến môi trường

Toàn bộ URL gọi backend được cấu hình tập trung tại `src/api/client.js`,
đọc từ biến môi trường sau (khai báo trong file `.env`, xem mẫu ở
`.env.example`):

| Biến           | Mô tả                                       | Mặc định (dev)          |
| -------------- | ------------------------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL của backend API, không có `/` cuối | `http://localhost:4000` |

Khi deploy production, đặt `VITE_API_URL` trỏ về domain API thật trước khi
`npm run build` (Vite nhúng biến môi trường vào lúc build).

## Scripts

```bash
npm run dev       # chạy dev server
npm run build     # build production vào thư mục dist/
npm run preview   # xem thử bản build
npm run lint      # kiểm tra eslint
```

## Cấu trúc thư mục

```
src/
  api/            # lớp gọi API tập trung (client.js)
  components/     # component dùng chung (Sidebar, Header, ErrorBoundary...)
  context/        # AuthContext (quản lý phiên đăng nhập admin)
  constansts/     # hằng số dùng chung (danh mục, màu trạng thái...)
  pages/          # các trang theo route (Dashboard, Products, Orders...)
```

## Ghi chú kỹ thuật / việc còn tồn đọng

- `MailClubManager.jsx` và `MailClubCollections.jsx` khá lớn (1000+ dòng),
  nên được tách nhỏ thành component con trong đợt refactor tiếp theo.
- Phần lớn lỗi API hiện chỉ log ra console, chưa có toast/thông báo cho
  admin — cần bổ sung để tránh thao tác thất bại âm thầm.
- Danh sách sản phẩm/đơn hàng/khách hàng hiện tải toàn bộ một lần, chưa
  phân trang phía server — cần lưu ý khi dữ liệu lớn dần.
