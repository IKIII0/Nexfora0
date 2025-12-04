# 📡 NEXFORA API Documentation

Dokumentasi lengkap untuk semua endpoint API NEXFORA.

**Base URL:** `http://localhost:5000/api` (Development)

---

## 🔐 Authentication

Semua endpoint yang memerlukan autentikasi harus menyertakan token JWT di header:

```
Authorization: Bearer <token>
```

---

## 📋 Endpoints

### 1. **Auth Endpoints** (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "nama_lengkap": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "Register berhasil",
  "user": {
    "id": 1,
    "nama_lengkap": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "user"
}
```

---

#### Get User by ID
```http
GET /api/auth/:id
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "nama_lengkap": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

#### Get All Users
```http
GET /api/auth
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Users retrieved successfully",
  "data": [...]
}
```

---

### 2. **Product Endpoints** (`/api/products`)

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category_id` (optional) - Filter by category
- `tipe` (optional) - Filter by type: 'kelas' or 'jasa'
- `level` (optional) - Filter by level: 'beginner', 'intermediate', 'advanced'
- `min_price` (optional) - Minimum price
- `max_price` (optional) - Maximum price
- `search` (optional) - Search in name and description

**Example:**
```http
GET /api/products?tipe=kelas&level=beginner&search=react
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_produk": "React JS Masterclass",
      "deskripsi": "Belajar React dari dasar",
      "harga": 1500000,
      "durasi": "2 bulan",
      "level": "beginner",
      "rating": 4.5,
      "total_reviews": 10,
      "stok": 25,
      "nama_kategori": "Web Development",
      "kategori_tipe": "kelas"
    }
  ]
}
```

---

#### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Produk berhasil diambil",
  "data": {
    "id": 1,
    "nama_produk": "React JS Masterclass",
    "deskripsi": "Belajar React dari dasar",
    "harga": 1500000,
    "durasi": "2 bulan",
    "level": "beginner",
    "rating": 4.5,
    "total_reviews": 10,
    "stok": 25,
    "nama_kategori": "Web Development",
    "kategori_tipe": "kelas"
  }
}
```

---

#### Get Product Popularity
```http
GET /api/products/:id/popularity
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Popularitas produk berhasil diambil",
  "data": {
    "popularity_score": 85.5
  }
}
```

---

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "category_id": 1,
  "nama_produk": "Vue JS Bootcamp",
  "deskripsi": "Belajar Vue JS dari dasar",
  "harga": 1200000,
  "durasi": "2 bulan",
  "level": "beginner",
  "max_peserta": 30,
  "stok": 25
}
```

**Response:**
```json
{
  "status": "success",
  "code": 201,
  "message": "Produk berhasil dibuat",
  "data": {...}
}
```

---

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "harga": 1300000,
  "stok": 30
}
```

---

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

---

### 3. **Category Endpoints** (`/api/categories`)

#### Get All Categories
```http
GET /api/categories
```

**Query Parameters:**
- `tipe` (optional) - Filter by type: 'kelas' or 'jasa'

**Example:**
```http
GET /api/categories?tipe=kelas
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Kategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_kategori": "Web Development",
      "deskripsi": "Kelas pengembangan website",
      "tipe": "kelas",
      "is_active": true
    }
  ]
}
```

---

#### Get Categories with Product Count
```http
GET /api/categories/with-count
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Kategori dengan jumlah produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_kategori": "Web Development",
      "deskripsi": "Kelas pengembangan website",
      "tipe": "kelas",
      "total_products": 5
    }
  ]
}
```

---

#### Get Category by ID
```http
GET /api/categories/:id
```

---

#### Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "nama_kategori": "Data Science",
  "deskripsi": "Kelas data science dan machine learning",
  "tipe": "kelas"
}
```

---

#### Update Category (Admin Only)
```http
PUT /api/categories/:id
Authorization: Bearer <admin_token>
```

---

#### Delete Category (Admin Only)
```http
DELETE /api/categories/:id
Authorization: Bearer <admin_token>
```

---

### 4. **Order Endpoints** (`/api/orders`)

#### Process Checkout
```http
POST /api/orders/checkout
Authorization: Bearer <token>
```

**Body:**
```json
{
  "product_ids": [1, 2, 3],
  "quantities": [1, 2, 1],
  "nama_lengkap": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "payment_method": "Transfer Bank",
  "catatan": "Mohon segera diproses"
}
```

**Response:**
```json
{
  "status": "success",
  "code": 201,
  "message": "Checkout berhasil",
  "data": {
    "id_pesanan": 1,
    "kode_pesanan": "ORD-20241204-000001",
    "total": 5000000,
    "status": "Menunggu Pembayaran"
  }
}
```

---

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Pesanan berhasil diambil",
  "data": [
    {
      "id_pesanan": 1,
      "kode_pesanan": "ORD-20241204-000001",
      "total": 5000000,
      "status": "Dalam Proses",
      "tanggal": "2024-12-04",
      "total_items": 3,
      "products": "React JS, Vue JS, Angular"
    }
  ]
}
```

---

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Pesanan berhasil diambil",
  "data": {
    "id_pesanan": 1,
    "kode_pesanan": "ORD-20241204-000001",
    "total": 5000000,
    "status": "Dalam Proses",
    "items": [
      {
        "id": 1,
        "nama_produk": "React JS Masterclass",
        "harga": 1500000,
        "quantity": 1,
        "subtotal": 1500000
      }
    ]
  }
}
```

---

#### Upload Payment Proof
```http
PUT /api/orders/:id/payment
Authorization: Bearer <token>
```

**Body:**
```json
{
  "payment_proof": "https://example.com/payment-proof.jpg"
}
```

---

#### Cancel Order
```http
PUT /api/orders/:id/cancel
Authorization: Bearer <token>
```

---

#### Get Order Statistics
```http
GET /api/orders/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Statistik pesanan berhasil diambil",
  "data": {
    "total_orders": 10,
    "completed_orders": 5,
    "pending_orders": 3,
    "cancelled_orders": 2,
    "total_spent": 15000000
  }
}
```

---

### 5. **Review Endpoints** (`/api/reviews`)

#### Get Product Reviews
```http
GET /api/reviews/product/:productId
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Review produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "rating": 5,
      "comment": "Kelas sangat bagus!",
      "user_name": "John Doe",
      "is_verified": true,
      "created_at": "2024-12-04T10:00:00Z"
    }
  ]
}
```

---

#### Get User Reviews
```http
GET /api/reviews/user
Authorization: Bearer <token>
```

---

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>
```

**Body:**
```json
{
  "product_id": 1,
  "order_id": 1,
  "rating": 5,
  "comment": "Kelas sangat bagus dan mudah dipahami!"
}
```

---

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer <token>
```

**Body:**
```json
{
  "rating": 4,
  "comment": "Kelas bagus tapi bisa lebih baik"
}
```

---

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

---

### 6. **Dashboard Endpoints** (`/api/dashboard`)

#### Get User Dashboard
```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Dashboard berhasil diambil",
  "data": {
    "user": {
      "id": 1,
      "nama_lengkap": "John Doe",
      "email": "john@example.com",
      "total_orders": 10,
      "completed_orders": 5,
      "total_spent": 15000000
    },
    "stats": {
      "total_orders": 10,
      "completed_orders": 5,
      "pending_orders": 3,
      "cancelled_orders": 2,
      "total_spent": 15000000
    },
    "recent_orders": [...]
  }
}
```

---

### 7. **Admin Endpoints** (`/api/admin`)

#### Get Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Dashboard berhasil diambil",
  "data": {
    "revenue": {
      "total": 50000000,
      "monthly": 10000000
    },
    "orders": {
      "total_orders": 100,
      "completed_orders": 50,
      "pending_orders": 30,
      "waiting_payment": 15,
      "cancelled_orders": 5
    },
    "users": {
      "total_users": 200,
      "admin_count": 2,
      "user_count": 198,
      "active_users": 180
    },
    "products": {
      "total_products": 20,
      "active_products": 18,
      "avg_rating": 4.5,
      "total_reviews": 150
    },
    "recent_orders": [...],
    "top_products": [...],
    "daily_sales": [...]
  }
}
```

---

#### Get All Orders (Admin)
```http
GET /api/admin/orders
Authorization: Bearer <admin_token>
```

---

#### Verify Order
```http
PUT /api/admin/orders/:orderId/verify
Authorization: Bearer <admin_token>
```

---

#### Cancel Order
```http
PUT /api/admin/orders/:orderId/cancel
Authorization: Bearer <admin_token>
```

---

#### Get Sales Report
```http
GET /api/admin/sales-report
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Laporan penjualan berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama_produk": "React JS Masterclass",
      "nama_kategori": "Web Development",
      "total_sold": 50,
      "total_revenue": 75000000,
      "current_stock": 25
    }
  ]
}
```

---

#### Get Revenue Report
```http
GET /api/admin/revenue?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Laporan revenue berhasil diambil",
  "data": {
    "total_revenue": 50000000,
    "daily_breakdown": [
      {
        "date": "2024-12-04",
        "total_orders": 5,
        "daily_revenue": 5000000
      }
    ]
  }
}
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "code": 400,
  "message": "Error message here"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "code": 401,
  "message": "Token akses diperlukan"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "code": 403,
  "message": "Akses ditolak"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "code": 404,
  "message": "Resource tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "code": 500,
  "message": "Terjadi kesalahan pada server"
}
```

---

## 📝 Notes

1. Semua endpoint yang memerlukan autentikasi harus menyertakan token JWT di header
2. Admin endpoints hanya bisa diakses oleh user dengan role 'admin'
3. Semua response menggunakan format JSON
4. Timestamp menggunakan format ISO 8601
5. Harga dalam format Rupiah (tanpa desimal untuk kemudahan)

---

**Last Updated:** December 4, 2024
