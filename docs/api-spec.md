# 📡 API Specification — NM PetShop

**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json`  
**Authentication:** Không có JWT (session-based via sessionStorage trên client)

---

## 🔋 Health Check

### `GET /api/health`
Kiểm tra server đang chạy.

**Response 200:**
```json
{ "status": "ok", "timestamp": "2026-05-18T06:00:00.000Z" }
```

---

## 📦 Products

### `GET /api/products`
Lấy danh sách sản phẩm có phân trang và bộ lọc.

**Query Parameters:**

| Param | Type | Mô tả |
|---|---|---|
| `page` | number | Trang hiện tại, default: 1 |
| `limit` | number | Số item/trang, default: 20 |
| `sort` | string | `price_asc`, `price_desc`, `newest`, `rating` |
| `category` | string | Slug danh mục: `cho`, `meo`, `phu-kien`, `do-choi`, `suc-khoe` |
| `filter` | string | `top-selling` (dùng isBestSelling flag) |
| `search` | string | Tìm kiếm theo tên, danh mục, thương hiệu |
| `subCategories` | string | Các danh mục cụ thể, phân cách bằng dấu phẩy |
| `brands` | string | Các thương hiệu, phân cách bằng dấu phẩy |
| `priceMin` | number | Giá tối thiểu |
| `priceMax` | number | Giá tối đa |
| `includeInactive` | string | `"true"` để bao gồm sản phẩm ẩn (admin) |

**Response 200:**
```json
{
  "products": [ { "id": 1, "name": "...", "price": 150000, ... } ],
  "total": 150,
  "page": 1,
  "totalPages": 13
}
```

---

### `GET /api/products/top-selling`
Lấy Top 10 sản phẩm bán chạy nhất, tổng hợp từ dữ liệu đơn hàng thực tế.

**Logic:** Aggregate Orders → đếm `items[].quantity` theo `productId` → sort giảm dần → lookup Product.  
**Fallback:** Nếu chưa có đơn hàng, trả về top 10 theo `reviews` + `rating`.

**Response 200:**
```json
{
  "products": [
    { "id": 5, "name": "Royal Canin Poodle", "price": 195000, "totalSold": 42, ... }
  ],
  "total": 10,
  "page": 1,
  "totalPages": 1
}
```

---

### `GET /api/products/meta`
Lấy danh sách category và brand có sẵn (dùng cho sidebar filter).

**Query Parameters:** Tương tự `GET /api/products` (dùng để scope filter).

**Response 200:**
```json
{
  "categories": ["Thức ăn hạt (Sản phẩm cho Chó)", "Pate & Đồ hộp (Sản phẩm cho Mèo)"],
  "brands": ["Royal Canin", "Pedigree", "Whiskas"]
}
```

---

### `GET /api/products/:id`
Lấy chi tiết một sản phẩm theo numeric ID.

**Response 200:** Object sản phẩm đầy đủ.  
**Response 404:** `{ "error": "Sản phẩm không tồn tại" }`

---

### `POST /api/products`
Tạo sản phẩm mới *(Admin)*.

**Request Body:**
```json
{
  "name": "Tên sản phẩm",
  "price": 150000,
  "category": "Thức ăn hạt (Sản phẩm cho Chó)",
  "brand": "Royal Canin",
  "description": "Mô tả",
  "image": "https://...",
  "stockCount": 50
}
```

**Response 201:** Object sản phẩm vừa tạo (với `id` tự động tăng).

---

### `PUT /api/products/:id`
Cập nhật sản phẩm *(Admin)*.

**Request Body:** Các field cần cập nhật.  
**Response 200:** Sản phẩm sau khi cập nhật.

---

### `PATCH /api/products/:id/status`
Toggle trạng thái active/inactive *(Admin)*.

**Response 200:**
```json
{ "id": 5, "active": false }
```

---

### `DELETE /api/products/:id`
Xóa sản phẩm *(Admin)*.

**Response 200:**
```json
{ "message": "Xóa sản phẩm thành công", "id": 5 }
```

---

## 🛍️ Orders

### `GET /api/orders`
Lấy danh sách đơn hàng *(Admin)*.

**Query Parameters:**

| Param | Type | Mô tả |
|---|---|---|
| `status` | string | Filter theo trạng thái |
| `search` | string | Tìm theo orderId, customerName, phone |
| `sort` | string | Default: `-createdAt` |
| `page` | number | |
| `limit` | number | Default: 20 |

**Response 200:**
```json
{
  "orders": [...],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

---

### `GET /api/orders/stats`
Lấy thống kê tổng quan cho Admin Dashboard.

**Response 200:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 45000000,
  "pendingOrders": 12,
  "totalProducts": 800,
  "totalCustomers": 320
}
```

---

### `GET /api/orders/user/:userId`
Lấy đơn hàng theo user ObjectId.

**Response 200:** Array các đơn hàng của user.

---

### `GET /api/orders/:id`
Lấy chi tiết đơn hàng theo `orderId` (VD: ORD-123456).

**Response 200:** Object đơn hàng đầy đủ.  
**Response 404:** `{ "error": "Đơn hàng không tồn tại" }`

---

### `POST /api/orders`
Tạo đơn hàng mới.

**Request Body:**
```json
{
  "orderId": "ORD-173241",
  "customerName": "Nguyễn Văn A",
  "email": "user@email.com",
  "phone": "0901234567",
  "shippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
  "items": [
    { "productId": 5, "name": "Royal Canin", "image": "...", "price": 195000, "quantity": 2 }
  ],
  "totalAmount": 390000,
  "discountAmount": 0,
  "shippingFee": 30000,
  "promoCode": "",
  "paymentMethod": "COD",
  "note": "",
  "user": "60b8d295f1c2a4001e8d1234"
}
```

**Response 201:** Object đơn hàng vừa tạo.

---

### `PUT /api/orders/:id/status`
Cập nhật trạng thái đơn hàng *(Admin)*.

**Request Body:**
```json
{ "status": "Confirmed" }
```

**Status flow:** `Pending` → `Confirmed` → `Shipping` → `Delivered` | `Cancelled`

---

### `DELETE /api/orders/:id`
Xóa đơn hàng *(Admin)*.

---

## 👤 Users

### `GET /api/users`
Lấy danh sách người dùng *(Admin)*.

**Query Parameters:** `search`, `role`, `page`, `limit`

**Response 200:**
```json
{
  "users": [
    { "id": 1, "fullName": "Nguyễn Văn A", "email": "...", "orderCount": 5, "totalSpent": 1500000 }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 3
}
```

> ℹ️ Mỗi user được enhance với `orderCount` và `totalSpent` (aggregate từ Orders).

---

### `POST /api/users/login`
Đăng nhập.

**Request Body:**
```json
{ "email": "user@email.com", "password": "123456" }
```

**Response 200:** Object user (không có password).  
**Response 401:** `{ "error": "Email hoặc mật khẩu không chính xác" }`  
**Response 403:** `{ "error": "Tài khoản của bạn đã bị khóa" }`

---

### `POST /api/users/register`
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "user@email.com",
  "password": "123456",
  "phone": "0901234567"
}
```

**Response 201:** Object user mới (không có password).  
**Response 400:** `{ "error": "Email đã được sử dụng" }`

---

### `PUT /api/users/profile/:id`
Cập nhật hồ sơ cá nhân.

**Request Body:** `fullName`, `email`, `phone`, `birthday`, `address`, `avatar`

---

### `PATCH /api/users/:id/status`
Toggle khóa/mở tài khoản user *(Admin)*.

---

### `DELETE /api/users/:id`
Xóa người dùng *(Admin)*.

---

## 🎫 Promotions

### `GET /api/promotions`
Lấy tất cả mã giảm giá.

**Response 200:** Array promotions.

---

### `POST /api/promotions`
Tạo mã giảm giá mới *(Admin)*.

**Request Body:**
```json
{
  "code": "SALE20",
  "title": "Giảm 20% toàn sàn",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderValue": 200000,
  "maxDiscountAmount": 100000,
  "startDate": "2026-05-01T00:00:00Z",
  "endDate": "2026-05-31T23:59:59Z",
  "usageLimit": 100,
  "category": "Toàn sàn"
}
```

---

### `POST /api/promotions/validate`
Kiểm tra mã giảm giá có hợp lệ không.

**Request Body:**
```json
{ "code": "SALE20", "totalAmount": 350000 }
```

**Response 200:** Object promotion với thông tin giảm giá.  
**Response 400:** `{ "error": "Mã giảm giá không hợp lệ" }` hoặc chi tiết lỗi.

---

### `PUT /api/promotions/:id`
Cập nhật mã giảm giá *(Admin)*.

---

### `DELETE /api/promotions/:id`
Xóa mã giảm giá *(Admin)*.

---

## 🏥 Services

### `GET /api/services`
Lấy danh sách dịch vụ thú cưng (spa, grooming, hotel, medical).

**Response 200:** Array services.

---

### `POST /api/services`
Tạo dịch vụ mới.

**Request Body:**
```json
{
  "title": "Dịch vụ tắm & cắt lông",
  "description": "...",
  "price": "150.000đ",
  "image": "https://...",
  "icon": "MdPets",
  "category": "grooming"
}
```

---

## ⚠️ Error Responses

Tất cả lỗi đều theo format chung:

```json
{ "error": "Mô tả lỗi ngắn gọn" }
```

| HTTP Code | Ý nghĩa |
|---|---|
| 400 | Bad Request — dữ liệu đầu vào không hợp lệ |
| 401 | Unauthorized — chưa xác thực hoặc sai credentials |
| 403 | Forbidden — tài khoản bị khóa |
| 404 | Not Found — resource không tồn tại |
| 500 | Internal Server Error |
