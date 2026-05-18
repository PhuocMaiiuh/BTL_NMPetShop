# 🐾 NM PetShop — Hệ thống thương mại điện tử thú cưng

> Ứng dụng web bán hàng thú cưng full-stack với React + Node.js + MongoDB, hỗ trợ cả khách hàng và quản trị viên.

---

## 📋 Mục lục

- [Mô tả](#-mô-tả)
- [Tính năng](#-tính-năng)
- [Tech Stack](#-tech-stack)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Setup chạy local](#-setup-chạy-local)
- [Scripts npm](#-scripts-npm)
- [Biến môi trường](#-biến-môi-trường)
- [Tài khoản demo](#-tài-khoản-demo)
- [Link demo](#-link-demo)

---

## 📖 Mô tả

**NM PetShop** là một ứng dụng thương mại điện tử chuyên về sản phẩm và dịch vụ thú cưng. Hệ thống gồm 2 phần:

- **Frontend (Customer)**: Giao diện người dùng với thiết kế dark-mode hiện đại, cho phép duyệt sản phẩm, quản lý giỏ hàng, đặt hàng và theo dõi đơn hàng.
- **Admin Panel**: Bảng điều khiển quản trị viên để quản lý sản phẩm, đơn hàng, khách hàng, khuyến mãi.

---

## ✨ Tính năng

### 👤 Khách hàng

| Tính năng | Mô tả |
|---|---|
| 🔍 Duyệt & Tìm kiếm sản phẩm | Lọc theo danh mục, thương hiệu, khoảng giá; tìm kiếm full-text |
| 🔥 Sản phẩm hot | Top 10 sản phẩm bán chạy được tổng hợp từ dữ liệu đơn hàng thực tế |
| 🛒 Giỏ hàng | Thêm/bớt sản phẩm, lưu session, tính tổng tiền tự động |
| 🎟️ Mã giảm giá | Áp dụng promo code với các loại: %, cố định, miễn phí ship |
| 💳 Thanh toán | Đặt hàng COD với form địa chỉ giao hàng đầy đủ |
| 📦 Theo dõi đơn hàng | Xem lịch sử và trạng thái đơn hàng |
| 👤 Hồ sơ cá nhân | Cập nhật thông tin tài khoản, avatar |
| 🔐 Xác thực | Đăng ký / Đăng nhập, bảo vệ route với ProtectedRoute |

### 🔧 Admin

| Tính năng | Mô tả |
|---|---|
| 📊 Dashboard | Thống kê tổng quan: doanh thu, đơn hàng, khách hàng, sản phẩm |
| 📦 Quản lý sản phẩm | CRUD sản phẩm, toggle trạng thái active/inactive |
| 🛍️ Quản lý đơn hàng | Xem, cập nhật trạng thái, xóa đơn hàng |
| 👥 Quản lý khách hàng | Danh sách khách hàng, thống kê chi tiêu, khóa/mở tài khoản |
| 🎫 Quản lý khuyến mãi | Tạo/sửa/xóa mã giảm giá với đầy đủ điều kiện |
| 💬 Tin nhắn | Giao diện quản lý chat với khách hàng |

---

## 🛠 Tech Stack

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| React | 18.x | UI framework |
| Vite | 5.x | Build tool & dev server |
| React Router DOM | 6.x | Client-side routing |
| Swiper.js | 11.x | Carousel / Slider |
| React Icons | 5.x | Icon library |
| Vanilla CSS | — | Styling |

### Backend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web framework |
| Mongoose | 8.x | MongoDB ODM |
| dotenv | 16.x | Environment config |
| cors | 2.x | Cross-origin policy |
| nodemon | 3.x | Dev auto-reload |

### Infrastructure
| Công nghệ | Vai trò |
|---|---|
| MongoDB 7.0 | Database (via Docker) |
| Mongo Express | Web UI quản lý DB |
| Docker + Docker Compose | Container hóa services |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────┐
│              Client Browser                 │
│   React 18 + Vite (port 5173)               │
│   ┌──────────┐ ┌───────────┐ ┌──────────┐  │
│   │  Pages   │ │Contexts   │ │Services  │  │
│   │(Customer)│ │Auth/Cart  │ │(API Call)│  │
│   └──────────┘ └───────────┘ └──────────┘  │
└─────────────────┬───────────────────────────┘
                  │ HTTP / REST API
                  ▼
┌─────────────────────────────────────────────┐
│         Express.js Backend (port 5000)      │
│   ┌──────────┐ ┌───────────┐ ┌──────────┐  │
│   │  Routes  │→│Controllers│→│  Models  │  │
│   └──────────┘ └───────────┘ └──────────┘  │
└─────────────────┬───────────────────────────┘
                  │ Mongoose ODM
                  ▼
┌─────────────────────────────────────────────┐
│         MongoDB 7.0 (port 27017)            │
│  Collections: products, orders,             │
│               users, promotions, services   │
└─────────────────────────────────────────────┘
```

Xem chi tiết: [`docs/architecture.md`](docs/architecture.md)

---

## 🚀 Setup chạy local

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **Docker Desktop** (để chạy MongoDB)
- **npm** >= 9.x

### Bước 1: Clone project

```bash
git clone <repo-url>
cd BTL_NMPetShop
```

### Bước 2: Khởi động MongoDB (Docker)

```bash
# Tại thư mục gốc BTL_NMPetShop/
docker compose up -d mongodb
```

> Mongo Express UI sẽ chạy tại http://localhost:8081 (tuỳ chọn)

### Bước 3: Cài đặt và chạy Backend

```bash
cd backend
npm install

# Tạo file .env (xem mục Biến môi trường bên dưới)
cp .env.example .env   # hoặc tạo tay

npm run dev
# → Server chạy tại http://localhost:5000
```

### Bước 4: Cài đặt và chạy Frontend

```bash
cd NMPetShop
npm install
npm run dev
# → App chạy tại http://localhost:5173
```

### Seed dữ liệu (tuỳ chọn)

```bash
cd backend
node seed_services.js        # Seed dịch vụ
node scripts/seed_rich_data.js  # Seed dữ liệu mẫu
```

---

## 📜 Scripts npm

### Backend (`/backend`)

| Script | Lệnh | Mô tả |
|---|---|---|
| `npm start` | `node server.js` | Chạy production |
| `npm run dev` | `nodemon server.js` | Chạy dev (auto-reload) |

### Frontend (`/NMPetShop`)

| Script | Lệnh | Mô tả |
|---|---|---|
| `npm run dev` | `vite` | Chạy dev server |
| `npm run build` | `vite build` | Build production |
| `npm run preview` | `vite preview` | Preview bản build |

---

## 🔧 Biến môi trường

### Backend — `/backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin
CLIENT_URL=http://localhost:5173
```

### Frontend — `/NMPetShop/.env` *(tuỳ chọn)*

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎭 Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| 👑 Admin | `admin@nmpetshop.com` | `admin123` |
| 👤 Khách hàng | `user@example.com` | `123456` |

> ⚠️ Nếu DB chưa có dữ liệu, hãy chạy seed script trước hoặc đăng ký tài khoản mới tại `/dang-ky`.

---

## 🌐 Link demo

| Môi trường | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| Mongo Express | http://localhost:8081 |

> 📌 Hiện tại project chỉ chạy local. Chưa deploy lên cloud.

---

## 📁 Cấu trúc thư mục

```
BTL_NMPetShop/
├── backend/                  # Express.js API server
│   ├── config/db.js          # Kết nối MongoDB
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Error handler
│   ├── scripts/              # Seed scripts
│   └── server.js             # Entry point
│
├── NMPetShop/                # React frontend
│   └── src/
│       ├── components/       # Reusable components
│       ├── contexts/         # Auth, Cart, Toast context
│       ├── layouts/          # Main, Admin, Auth layouts
│       ├── pages/            # Route pages
│       │   └── admin/        # Admin pages
│       └── services/         # API call helpers
│
├── docs/                     # Tài liệu kỹ thuật
│   ├── schema.md             # ERD / Data schema
│   ├── api-spec.md           # API specification
│   ├── architecture.md       # Diagram kiến trúc
│   ├── sprint-1.md           # Sprint 1 report
│   └── sprint-2.md           # Sprint 2 report
│
├── mongo-init/               # MongoDB init scripts
├── docker-compose.yml        # Docker services config
└── README.md
```

---

## 📄 Tài liệu kỹ thuật

| File | Nội dung |
|---|---|
| [`docs/schema.md`](docs/schema.md) | ERD và mô tả chi tiết các collection |
| [`docs/api-spec.md`](docs/api-spec.md) | Đặc tả đầy đủ tất cả API endpoints |
| [`docs/architecture.md`](docs/architecture.md) | Diagram kiến trúc hệ thống |
| [`docs/sprint-1.md`](docs/sprint-1.md) | Báo cáo Sprint 1 |
| [`docs/sprint-2.md`](docs/sprint-2.md) | Báo cáo Sprint 2 |
