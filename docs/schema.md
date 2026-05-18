# 📊 ERD — Data Schema

## Tổng quan Collections

NM PetShop sử dụng **MongoDB** (NoSQL) với 5 collections chính:

```
products ──────────────────────────┐
                                   │ items[].productId → products.id
orders ────── items[] ─────────────┘
  │
  └──── user → users._id

users

promotions  (độc lập)

services    (độc lập)
```

---

## 📦 Collection: `products`

Lưu trữ toàn bộ sản phẩm của shop.

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `_id` | ObjectId | auto | MongoDB ID |
| `id` | Number | ✅ unique | Numeric ID tuần tự |
| `name` | String | ✅ | Tên sản phẩm |
| `image` | String | | URL ảnh chính |
| `images` | [String] | | Mảng URL ảnh phụ |
| `price` | Number | ✅ | Giá bán hiện tại (VNĐ) |
| `originalPrice` | Number | | Giá gốc (để hiện khuyến mãi) |
| `rating` | Number | | Điểm đánh giá (0–5), default: 4 |
| `reviews` | Number | | Số lượt đánh giá |
| `category` | String | | Danh mục sản phẩm |
| `brand` | String | | Thương hiệu |
| `description` | String | | Mô tả chi tiết |
| `specifications` | [{label, value}] | | Thông số kỹ thuật |
| `inStock` | Boolean | | Còn hàng, default: true |
| `stockCount` | Number | | Số lượng tồn kho |
| `isBestSelling` | Boolean | | Đánh dấu bán chạy thủ công |
| `active` | Boolean | | Trạng thái hiển thị, default: true |
| `badge` | String | | Nhãn badge (VD: "HOT", "NEW") |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:** `name` (text), `description` (text), `category`, `brand`, `price`, `active`, `isBestSelling`

**Ví dụ document:**
```json
{
  "id": 101,
  "name": "Thức ăn hạt Royal Canin Poodle 500g",
  "price": 195000,
  "originalPrice": 220000,
  "category": "Thức ăn hạt (Sản phẩm cho Chó)",
  "brand": "Royal Canin",
  "rating": 4.8,
  "reviews": 256,
  "active": true,
  "isBestSelling": false
}
```

---

## 🛍️ Collection: `orders`

Lưu trữ đơn đặt hàng của khách.

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `orderId` | String | ✅ unique | Mã đơn hàng (VD: ORD-123456) |
| `user` | ObjectId (ref: User) | | Liên kết tài khoản khách hàng |
| `customerName` | String | ✅ | Tên người đặt |
| `email` | String | | Email liên hệ |
| `phone` | String | ✅ | Số điện thoại |
| `shippingAddress` | String | ✅ | Địa chỉ giao hàng |
| `items` | [OrderItem] | | Danh sách sản phẩm trong đơn |
| `items[].productId` | Number | | ID sản phẩm |
| `items[].name` | String | | Tên sản phẩm (snapshot) |
| `items[].image` | String | | Ảnh (snapshot) |
| `items[].price` | Number | | Giá tại thời điểm mua |
| `items[].quantity` | Number | | Số lượng |
| `totalAmount` | Number | ✅ | Tổng tiền sau giảm giá |
| `discountAmount` | Number | | Số tiền giảm, default: 0 |
| `shippingFee` | Number | | Phí ship, default: 0 |
| `promoCode` | String | | Mã giảm giá đã áp dụng |
| `paymentMethod` | String | | Phương thức thanh toán, default: COD |
| `status` | String | | Trạng thái đơn hàng |
| `note` | String | | Ghi chú |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Status values:** `Pending` → `Confirmed` → `Shipping` → `Delivered` | `Cancelled`

---

## 👤 Collection: `users`

Lưu trữ tài khoản người dùng.

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `id` | Number | unique | Numeric ID tuần tự |
| `fullName` | String | ✅ | Họ tên đầy đủ |
| `email` | String | ✅ unique | Email đăng nhập |
| `password` | String | ✅ | Mật khẩu (plain text*) |
| `phone` | String | | Số điện thoại |
| `address` | String | | Địa chỉ mặc định |
| `role` | String | | `user` hoặc `admin` |
| `avatar` | String | | URL avatar |
| `status` | String | | `active` hoặc `locked` |
| `lastLogin` | Date | | Lần đăng nhập gần nhất |
| `createdAt` | Date | auto | |

> *⚠️ Lưu ý: Password hiện lưu plain text — cần hash bằng bcrypt trong production.*

---

## 🎫 Collection: `promotions`

Lưu trữ mã giảm giá.

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `code` | String | ✅ unique | Mã code (VD: SALE20) |
| `title` | String | | Tiêu đề hiển thị |
| `discountType` | String | | `percentage`, `fixed`, `free_shipping` |
| `discountValue` | Number | ✅ | Giá trị giảm (% hoặc VNĐ) |
| `minOrderValue` | Number | | Đơn hàng tối thiểu để áp dụng |
| `maxDiscountAmount` | Number | | Giảm tối đa (dùng với percentage) |
| `startDate` | Date | ✅ | Ngày bắt đầu |
| `endDate` | Date | ✅ | Ngày hết hạn |
| `usageLimit` | Number | | Số lần sử dụng tối đa |
| `usedCount` | Number | | Số lần đã dùng, default: 0 |
| `status` | String | | `active`, `expired`, `disabled` |
| `category` | String | | Danh mục áp dụng |
| `description` | String | | Mô tả |

---

## 🏥 Collection: `services`

Lưu trữ các dịch vụ thú cưng (spa, grooming, hotel, medical).

| Field | Type | Required | Mô tả |
|---|---|---|---|
| `_id` | ObjectId | auto | |
| `title` | String | ✅ | Tên dịch vụ |
| `description` | String | ✅ | Mô tả dịch vụ |
| `price` | String | ✅ | Giá dịch vụ (chuỗi, VD: "150.000đ") |
| `image` | String | ✅ | URL ảnh minh hoạ |
| `icon` | String | ✅ | Tên icon (VD: "MdPets") |
| `category` | String | | `spa`, `grooming`, `hotel`, `medical` |

---

## 🗺 ERD Diagram (Text)

```
┌────────────────────────────────────────┐
│                USERS                   │
│  _id (PK)  │ email (UQ) │ role        │
│  id (UQ)   │ fullName   │ status      │
│  password  │ phone      │ avatar      │
└─────────────────┬──────────────────────┘
                  │ 1
                  │ user references
                  │ N
┌─────────────────▼──────────────────────┐
│               ORDERS                   │
│  _id (PK)   │ orderId (UQ)            │
│  user → USERS._id                     │
│  customerName │ phone │ shippingAddress│
│  totalAmount  │ status │ promoCode    │
│  items[] ──────────────────────────┐  │
└─────────────────────────────────── │ ─┘
                                     │ N:M (embedded)
┌────────────────────────────────────▼──┐
│            ORDER ITEMS (embedded)     │
│  productId → PRODUCTS.id              │
│  name │ image │ price │ quantity      │
└───────────────────────────────────────┘

┌────────────────────────────────────────┐
│              PRODUCTS                  │
│  _id (PK)  │ id (UQ)   │ name        │
│  price     │ category  │ brand       │
│  rating    │ reviews   │ active      │
│  isBestSelling │ stockCount          │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│             PROMOTIONS                 │
│  _id (PK)  │ code (UQ) │ discountType│
│  discountValue │ startDate │ endDate  │
│  usageLimit │ usedCount │ status     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│              SERVICES                  │
│  _id (PK)  │ title     │ category    │
│  price     │ icon      │ image       │
└────────────────────────────────────────┘
```
