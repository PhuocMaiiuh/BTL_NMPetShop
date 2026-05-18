# 📋 Sprint 1 Report — NM PetShop

**Sprint:** 1 / 2  
**Thời gian:** Tuần 1 – Tuần 3  
**Trạng thái:** ✅ Hoàn thành

---

## 🎯 Mục tiêu Sprint 1

Xây dựng nền tảng hệ thống: thiết lập dự án, kết nối database, xây dựng các tính năng cốt lõi phía khách hàng và backend API cơ bản.

---

## 👥 Phân công công việc

| Thành viên | Nhiệm vụ |
|---|---|
| [Thành viên 1] | Backend: Express server, MongoDB setup, Product API |
| [Thành viên 2] | Frontend: React setup, HomePage, ProductListPage |
| [Thành viên 3] | Frontend: Header, Footer, ProductCard, HeroBanner |
| [Thành viên 4] | Backend: User API, Auth flow; Frontend: AuthPage |

---

## ✅ Công việc đã hoàn thành

### 🔧 Infrastructure & Setup
- [x] Khởi tạo project với Vite + React 18 (frontend)
- [x] Khởi tạo Express.js server (backend)
- [x] Setup MongoDB với Docker Compose
- [x] Cấu hình CORS, dotenv, nodemon
- [x] Thiết kế Mongoose schemas: Product, Order, User
- [x] Import dữ liệu sản phẩm từ `petmall_products.json` (~800 sản phẩm)

### 🖥 Frontend — Giao diện khách hàng
- [x] **MainLayout**: Header responsive với search, giỏ hàng, nav; Footer đầy đủ
- [x] **HomePage**: Hero banner, carousel sản phẩm bán chạy, danh mục, stats counter
- [x] **ProductListPage**: Grid sản phẩm, sidebar bộ lọc (danh mục, thương hiệu, giá), phân trang
- [x] **ProductDetailPage**: Chi tiết sản phẩm, gallery ảnh, thêm vào giỏ
- [x] **CartPage**: Quản lý giỏ hàng, tính tổng tiền
- [x] **AuthPage**: Form đăng nhập / đăng ký với validation

### 🔌 Backend — API
- [x] `GET/POST /api/products` — Danh sách và tạo sản phẩm
- [x] `GET /api/products/meta` — Categories và brands cho sidebar
- [x] `GET /api/products/:id` — Chi tiết sản phẩm
- [x] `POST /api/users/login` — Đăng nhập
- [x] `POST /api/users/register` — Đăng ký
- [x] `GET /api/health` — Health check endpoint

### 🎨 UI/UX
- [x] Dark mode design với color palette #070e1a
- [x] Responsive layout (mobile, tablet, desktop)
- [x] Animations: hero gradient, floating elements, hover effects
- [x] Google Fonts (Inter)
- [x] Toast notification system
- [x] Scroll to top functionality

---

## 🐛 Vấn đề gặp phải & Giải pháp

| Vấn đề | Giải pháp |
|---|---|
| Category filter không hoạt động đúng với tiếng Việt có dấu | Tạo `CATEGORY_KEYWORDS` map URL slug → Vietnamese text |
| Swiper carousel không responsive trên mobile | Cấu hình `breakpoints` cho từng màn hình |
| CORS lỗi khi frontend gọi API | Thêm CORS middleware với origin whitelist |
| Data products không đồng nhất format | Chuẩn hóa qua Mongoose schema với default values |

---

## 📊 Kết quả đạt được

- ✅ Hệ thống cơ sở hoạt động ổn định
- ✅ ~800 sản phẩm được import vào MongoDB
- ✅ Giao diện khách hàng cơ bản đầy đủ
- ✅ API Products và Users hoạt động

---

## 📌 Backlog cho Sprint 2

- [ ] Trang thanh toán & đặt hàng
- [ ] Theo dõi đơn hàng
- [ ] Admin dashboard
- [ ] Quản lý sản phẩm (CRUD)
- [ ] Hệ thống mã giảm giá
- [ ] Quản lý khách hàng
- [ ] Top-selling từ dữ liệu đơn hàng thực
