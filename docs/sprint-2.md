# 📋 Sprint 2 Report — NM PetShop

**Sprint:** 2 / 2  
**Thời gian:** Tuần 4 – Tuần 6  
**Trạng thái:** ✅ Hoàn thành

---

## 🎯 Mục tiêu Sprint 2

Hoàn thiện luồng mua hàng đầu cuối, xây dựng Admin Panel đầy đủ, tích hợp hệ thống khuyến mãi, và tối ưu tính năng sản phẩm hot.

---

## 👥 Phân công công việc

| Thành viên | Nhiệm vụ |
|---|---|
| [Thành viên 1] | Backend: Order API, Promotion API, Top-Selling aggregation |
| [Thành viên 2] | Frontend: CheckoutPage, OrderDetailPage, ProfilePage |
| [Thành viên 3] | Frontend: Admin Dashboard, AdminProducts, AdminOrders |
| [Thành viên 4] | Frontend: AdminCustomers, AdminDiscounts, AdminMessages; Docker config |

---

## ✅ Công việc đã hoàn thành

### 🛍️ Luồng mua hàng (Customer)

- [x] **CheckoutPage**: Form đặt hàng hoàn chỉnh (địa chỉ, thanh toán COD, ghi chú)
- [x] **Giỏ hàng**: Lưu giỏ hàng qua sessionStorage, cập nhật số lượng, xóa sản phẩm
- [x] **Mã giảm giá**: Validate promo code, hiển thị số tiền giảm, tự động tính tổng
- [x] **OrderDetailPage**: Xem chi tiết đơn hàng, timeline trạng thái
- [x] **ProfilePage**: Cập nhật thông tin cá nhân, xem lịch sử đơn hàng

### 🔧 Admin Panel

- [x] **AdminDashboard**: 
  - Stats cards (doanh thu, đơn hàng, khách hàng, sản phẩm)
  - Biểu đồ dữ liệu thực từ database
- [x] **AdminProducts**:
  - Danh sách sản phẩm với search, phân trang
  - Thêm/sửa sản phẩm qua form modal (`AdminProductForm`)
  - Toggle active/inactive
  - Xóa sản phẩm
- [x] **AdminOrders**:
  - Danh sách đơn hàng với filter trạng thái
  - Cập nhật trạng thái đơn hàng
  - Xem chi tiết items trong đơn
- [x] **AdminCustomers**:
  - Danh sách khách hàng với số đơn và tổng chi tiêu
  - Khóa/mở tài khoản
  - Xóa khách hàng
- [x] **AdminDiscounts**:
  - CRUD mã giảm giá
  - Validation ngày hiệu lực, giới hạn sử dụng
  - Hiển thị trạng thái active/expired/disabled
- [x] **AdminMessages**: Giao diện chat với khách hàng

### 🔌 Backend — API bổ sung

- [x] `POST /api/orders` — Tạo đơn hàng
- [x] `GET /api/orders/stats` — Thống kê cho Dashboard
- [x] `GET /api/orders/user/:userId` — Đơn hàng theo user
- [x] `PUT /api/orders/:id/status` — Cập nhật trạng thái
- [x] `DELETE /api/orders/:id` — Xóa đơn hàng
- [x] `GET/POST/PUT/DELETE /api/promotions` — CRUD Promotions
- [x] `POST /api/promotions/validate` — Validate mã giảm giá
- [x] `PUT/PATCH/DELETE /api/products/:id` — Cập nhật & xóa sản phẩm
- [x] `PATCH /api/products/:id/status` — Toggle product status
- [x] `PUT /api/users/profile/:id` — Cập nhật hồ sơ
- [x] `PATCH/DELETE /api/users/:id` — Admin quản lý users
- [x] **`GET /api/products/top-selling`** — Aggregate sản phẩm bán chạy từ Orders

### 🐳 Docker & Infrastructure

- [x] Dockerfile cho backend
- [x] Docker Compose với 3 services: mongodb, mongo-express, backend
- [x] MongoDB init scripts với auth
- [x] Seed scripts cho services data
- [x] `.env` configuration

---

## 🐛 Vấn đề gặp phải & Giải pháp

| Vấn đề | Giải pháp |
|---|---|
| `MONGO_URI` undefined → app crash khi chạy local | Tạo `backend/.env` với `MONGO_URI=mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin` |
| Top-selling page trống vì không có product nào có `isBestSelling: true` | Xây dựng aggregation pipeline mới từ Orders, tách endpoint riêng `/top-selling` |
| Route conflict `/products/:id` vs `/products/meta` | Khai báo `/meta` và `/top-selling` trước `/:id` trong Express router |
| Admin dashboard hiển thị dữ liệu giả | Kết nối `GET /api/orders/stats` với dữ liệu thực từ MongoDB |
| Promotion validate không xử lý edge cases | Thêm kiểm tra: hết hạn, chưa đến ngày, vượt giới hạn dùng, chưa đủ giá trị đơn |
| User enhance với orderCount làm chậm API | Dùng `Promise.all` để parallel aggregate mỗi user |

---

## 📊 Kết quả đạt được

### Tính năng
| Tính năng | Trạng thái |
|---|---|
| Luồng mua hàng đầu cuối | ✅ Hoàn thành |
| Admin Panel đầy đủ | ✅ Hoàn thành |
| Hệ thống khuyến mãi | ✅ Hoàn thành |
| Top-Selling từ dữ liệu thực | ✅ Hoàn thành |
| Docker containerization | ✅ Hoàn thành |
| Responsive UI | ✅ Hoàn thành |

### Metrics kỹ thuật
- **API Endpoints:** 25+ endpoints
- **Collections:** 5 (products, orders, users, promotions, services)
- **React Components:** 25+ components
- **Frontend Pages:** 12 pages (11 customer + admin sub-pages)
- **Context Providers:** 3 (Auth, Cart, Toast)

---

## 📝 Những điều có thể cải thiện (Future Work)

| Hạng mục | Mô tả |
|---|---|
| 🔐 Security | Hash password với bcrypt, JWT authentication |
| 📤 File Upload | Cho phép upload ảnh sản phẩm (Cloudinary/S3) |
| 🔔 Real-time | WebSocket cho chat và thông báo đơn hàng |
| 💳 Payment | Tích hợp VNPay/MoMo thay vì chỉ COD |
| 🌐 Deployment | Deploy lên Vercel (frontend) + Railway/Render (backend) |
| 🧪 Testing | Unit tests (Jest), E2E tests (Playwright) |
| 📱 PWA | Progressive Web App cho mobile |
| 📦 Cache | Redis cache cho sản phẩm hot, categories |

---

## ✍️ Nhận xét Sprint

**Điểm mạnh:**
- Team hoàn thành đúng tiến độ
- Codebase có cấu trúc rõ ràng, tách biệt concerns (routes/controllers/models)
- UI/UX đẹp, dark mode nhất quán
- Docker giúp onboarding dễ dàng

**Điểm cần cải thiện:**
- Cần thêm error handling phía frontend (hiện còn một số edge cases)
- Password nên được hash trước khi lưu DB
- Cần thêm loading skeleton thay vì spinner đơn giản
