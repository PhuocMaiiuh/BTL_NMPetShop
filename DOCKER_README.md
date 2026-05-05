# MongoDB + NMPetShop - Docker Setup

## Cấu trúc thư mục
```
BTL_NMPetShop/
├── docker-compose.yml
├── mongo-init/
│   └── 01_import_products.sh   # Tự động import JSON vào MongoDB khi khởi động lần đầu
└── NMPetShop/
    └── src/
        └── data/
            └── petmall_products.json   # 2116 sản phẩm
```

---

## Khởi động

### Lần đầu (build + seed data)
```bash
docker compose up -d
```
Script `01_import_products.sh` sẽ **tự động chạy** khi MongoDB khởi động lần đầu và import toàn bộ 2116 sản phẩm.

### Xem logs import
```bash
docker logs nmpetshop_mongodb
```

### Dừng
```bash
docker compose down
```

### Xóa toàn bộ data và khởi động lại từ đầu
```bash
docker compose down -v
docker compose up -d
```

---

## Truy cập

| Service | URL | Thông tin |
|---|---|---|
| **MongoDB** | `mongodb://localhost:27017` | Username: `admin` / Password: `admin123` |
| **Mongo Express** (Web UI) | `http://localhost:8081` | Giao diện quản lý DB trên trình duyệt |

---

## Kết nối MongoDB từ code

### Connection String
```
mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin
```

### Ví dụ với Node.js + Mongoose
```js
import mongoose from 'mongoose';

await mongoose.connect('mongodb://admin:admin123@localhost:27017/nmpetshop?authSource=admin');
```

---

## Collection: `nmpetshop.products`

### Schema một sản phẩm
```json
{
  "id": 1,
  "name": "20KG - Thức ăn chó ALO - Vị thịt gà",
  "image": "https://cdn.hstatic.net/...",
  "images": ["url1", "url2", "url3", "url4", "url5"],
  "price": 1929000,
  "originalPrice": null,
  "rating": 4,
  "reviews": 32,
  "category": "Thức ăn hạt (Sản phẩm cho Chó)",
  "brand": "ALO",
  "description": "Mô tả sản phẩm...",
  "specifications": [
    { "label": "Thương hiệu", "value": "ALO" },
    { "label": "Khối lượng", "value": "20KG" }
  ],
  "inStock": true,
  "stockCount": 10,
  "isBestSelling": false,
  "active": true,
  "stock": 10
}
```

### Indexes đã tạo
- `name` + `description` → Full-text search
- `category` → Lọc theo danh mục
- `brand` → Lọc theo thương hiệu
- `price` → Sắp xếp / lọc giá
- `active` → Lọc sản phẩm đang hoạt động
- `isBestSelling` → Lọc bán chạy
