# 🏗 Diagram Kiến Trúc Hệ Thống — NM PetShop

## 1. Kiến trúc tổng thể (High-Level)

```
╔══════════════════════════════════════════════════════════════╗
║                      CLIENT TIER                             ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐     ║
║  │           React 18 SPA (Vite)  :5173                │     ║
║  │                                                     │     ║
║  │  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │     ║
║  │  │   Pages     │  │  Contexts    │  │ Services  │  │     ║
║  │  │  HomePage   │  │  AuthContext │  │ productApi│  │     ║
║  │  │  ProductList│  │  CartContext │  │ orderApi  │  │     ║
║  │  │  ProductDet.│  │  ToastContext│  │ userApi   │  │     ║
║  │  │  CartPage   │  └──────────────┘  │ promoApi  │  │     ║
║  │  │  Checkout   │                    └─────┬─────┘  │     ║
║  │  │  Profile    │  ┌──────────────┐        │        │     ║
║  │  │  OrderDetail│  │   Layouts    │        │        │     ║
║  │  │  Admin/*    │  │  MainLayout  │   fetch()        │     ║
║  │  └─────────────┘  │  AdminLayout │        │        │     ║
║  │                   │  AuthLayout  │        │        │     ║
║  │                   └──────────────┘        │        │     ║
║  └───────────────────────────────────────────┼────────┘     ║
╚══════════════════════════════════════════════╪══════════════╝
                                               │ HTTP REST API
                                               ▼
╔══════════════════════════════════════════════════════════════╗
║                     SERVER TIER                              ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐     ║
║  │           Express.js Server  :5000                  │     ║
║  │                                                     │     ║
║  │  server.js (entry point)                            │     ║
║  │    ├── CORS middleware                              │     ║
║  │    ├── JSON body parser                             │     ║
║  │    └── Error handler                                │     ║
║  │                                                     │     ║
║  │  Routes              Controllers                    │     ║
║  │  /api/products  ──→  productController              │     ║
║  │  /api/orders    ──→  orderController                │     ║
║  │  /api/users     ──→  userController                 │     ║
║  │  /api/promotions──→  promotionController            │     ║
║  │  /api/services  ──→  (inline in route)              │     ║
║  │  /api/health    ──→  (inline handler)               │     ║
║  │                                                     │     ║
║  │  Models (Mongoose ODM)                              │     ║
║  │    Product | Order | User | Promotion | Service     │     ║
║  └─────────────────────────────────────────┬───────────┘     ║
╚════════════════════════════════════════════╪════════════════╝
                                             │ Mongoose
                                             ▼
╔══════════════════════════════════════════════════════════════╗
║                      DATA TIER                               ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐     ║
║  │        MongoDB 7.0 (Docker)  :27017                 │     ║
║  │                                                     │     ║
║  │  Database: nmpetshop                                │     ║
║  │  ┌────────────┐ ┌──────────┐ ┌──────────────────┐  │     ║
║  │  │ products   │ │  orders  │ │     users        │  │     ║
║  │  │ (800+ docs)│ │          │ │                  │  │     ║
║  │  └────────────┘ └──────────┘ └──────────────────┘  │     ║
║  │  ┌────────────┐ ┌──────────┐                        │     ║
║  │  │ promotions │ │ services │                        │     ║
║  │  └────────────┘ └──────────┘                        │     ║
║  └─────────────────────────────────────────────────────┘     ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐     ║
║  │    Mongo Express (Docker)  :8081    [Optional]      │     ║
║  └─────────────────────────────────────────────────────┘     ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 2. Frontend Component Tree

```
App.jsx
├── BrowserRouter
│   ├── AuthProvider (Context)
│   │   └── CartProvider (Context)
│   │       └── ToastProvider (Context)
│   │           └── Routes
│   │               ├── MainLayout (Header + Footer + Outlet)
│   │               │   ├── HomePage
│   │               │   │   ├── HeroBanner
│   │               │   │   ├── ProductCard (Swiper carousel)
│   │               │   │   ├── CategoryCard
│   │               │   │   └── PromoBanner
│   │               │   ├── ProductListPage
│   │               │   │   ├── Sidebar (filters)
│   │               │   │   └── ProductCard (grid)
│   │               │   ├── ProductDetailPage
│   │               │   ├── CartPage *[Protected]
│   │               │   ├── CheckoutPage *[Protected]
│   │               │   ├── ProfilePage *[Protected]
│   │               │   └── OrderDetailPage *[Protected]
│   │               │
│   │               ├── AuthLayout
│   │               │   └── AuthPage (Login / Register)
│   │               │
│   │               └── AdminLayout *[Protected + Admin Role]
│   │                   ├── AdminDashboard
│   │                   ├── AdminProducts
│   │                   ├── AdminOrders
│   │                   ├── AdminCustomers
│   │                   ├── AdminDiscounts
│   │                   └── AdminMessages
│   │
│   ├── Toast (global notifications)
│   └── ScrollToTopButton
```

---

## 3. Data Flow — Luồng đặt hàng

```
User                Frontend                 Backend              Database
 │                      │                       │                     │
 │──Thêm vào giỏ──────→│                       │                     │
 │                   CartContext.addToCart()    │                     │
 │                   sessionStorage['cart']     │                     │
 │                      │                       │                     │
 │──Áp mã giảm giá────→│                       │                     │
 │                      │──POST /promotions/validate──────────────────│
 │                      │←── promotion object ──│◄────────────────────│
 │                      │                       │                     │
 │──Đặt hàng──────────→│                       │                     │
 │                      │──POST /orders ────────►│                    │
 │                      │                       │──Insert Order──────►│
 │                      │                       │──Inc promoCode──────│
 │                      │←── order object ──────│                     │
 │                   clearCart()                │                     │
 │←── Redirect /don-hang/:id                   │                     │
```

---

## 4. Docker Compose Services

```
docker-compose.yml
├── mongodb (mongo:7.0)
│   ├── Port: 27017:27017
│   ├── Credentials: admin/admin123
│   ├── Init scripts: /mongo-init/
│   └── Volume: mongodb_data
│
├── mongo-express (optional)
│   ├── Port: 8081:8081
│   └── Connects to: mongodb
│
└── backend (Dockerfile)
    ├── Port: 5000:5000
    ├── Env: MONGO_URI, PORT, CLIENT_URL
    └── Depends: mongodb (healthy)
```

---

## 5. Authentication Flow

```
Login Request
     │
     ▼
POST /api/users/login
     │
     ├── Find user by email
     ├── Compare password (plain text)
     ├── Check status !== 'locked'
     └── Return user object (no password)
           │
           ▼
     AuthContext.login()
           │
           ├── setUser(normalizedUser)
           └── sessionStorage.setItem('nm_user', ...)
                     │
                     ▼
              ProtectedRoute checks:
              isAuthenticated → render page
              requiredRole='admin' → check isAdmin
```

---

## 6. Top-Selling Aggregation Pipeline

```
GET /api/products/top-selling

Orders Collection
      │
      ▼ $match: status ≠ 'Cancelled'
      │
      ▼ $unwind: items[]
      │
      ▼ $group: _id=productId, totalSold=$sum(quantity)
      │
      ▼ $sort: totalSold DESC
      │
      ▼ $limit: 10
      │
      ▼ Lookup Products by id[]
      │
      ▼ Merge totalSold into product objects
      │
      ▼ Return [ { ...product, totalSold: N } ]

Fallback (no orders): sort by reviews DESC, rating DESC
```
