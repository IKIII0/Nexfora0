# 📚 NEXFORA Database Documentation

Dokumentasi lengkap untuk database schema, queries, dan cara penggunaannya.

---

## 🚨 Important Notes

### View Update Required
Jika Anda mengalami error `column "tipe_pemesanan" does not exist`, view `v_order_summary` perlu di-update.

**Quick Fix:**
```bash
psql -U postgres -d nexfora_db -f server/database/update_view.sql
```

Lihat [QUICK_FIX.md](QUICK_FIX.md) untuk panduan lengkap.

---

## 📋 Daftar Isi

1. [Struktur Database](#struktur-database)
2. [Tables](#tables)
3. [Triggers](#triggers)
4. [Functions](#functions)
5. [Stored Procedures](#stored-procedures)
6. [Views](#views)
7. [Roles & Permissions](#roles--permissions)
8. [Cara Penggunaan](#cara-penggunaan)
9. [Contoh Query](#contoh-query)
10. [Migration & Updates](#migration--updates)

---

## 🗄️ Struktur Database

Database NEXFORA terdiri dari 7 tabel utama:

```
users (pengguna)
  ↓
pemesanan (orders) ← order_items → products → categories
  ↓                      ↓
activity_logs        reviews
```

---

## 📊 Tables

### 1. **users** - Tabel Pengguna

Menyimpan data pengguna sistem.

**Kolom:**
- `id` - Primary key (auto increment)
- `nama_lengkap` - Nama lengkap user
- `email` - Email unik
- `password` - Password (harus di-hash di aplikasi)
- `role` - Role user: 'admin', 'user', 'moderator'
- `phone` - Nomor telepon
- `address` - Alamat
- `is_active` - Status aktif (true/false)
- `last_login` - Waktu login terakhir
- `dibuat` - Waktu dibuat
- `updated_at` - Waktu update terakhir

**Contoh Insert:**
```sql
INSERT INTO users (nama_lengkap, email, password, role, phone) 
VALUES ('John Doe', 'john@example.com', 'hashed_password', 'user', '081234567890');
```

**Contoh Query:**
```sql
-- Cari user berdasarkan email
SELECT * FROM users WHERE email = 'john@example.com';

-- Update last login
UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = 1;

-- Nonaktifkan user
UPDATE users SET is_active = false WHERE id = 1;
```

---

### 2. **categories** - Tabel Kategori

Menyimpan kategori untuk produk (kelas dan jasa).

**Kolom:**
- `id` - Primary key
- `nama_kategori` - Nama kategori (unik)
- `deskripsi` - Deskripsi kategori
- `tipe` - Tipe: 'kelas' atau 'jasa'
- `is_active` - Status aktif
- `created_at` - Waktu dibuat
- `updated_at` - Waktu update

**Contoh Insert:**
```sql
INSERT INTO categories (nama_kategori, deskripsi, tipe) 
VALUES ('Web Development', 'Kelas pengembangan website', 'kelas');
```

**Contoh Query:**
```sql
-- Ambil semua kategori kelas yang aktif
SELECT * FROM categories WHERE tipe = 'kelas' AND is_active = true;

-- Hitung jumlah produk per kategori
SELECT c.nama_kategori, COUNT(p.id) as total_produk
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.nama_kategori;
```

---

### 3. **products** - Tabel Produk

Menyimpan produk (kelas dan jasa).

**Kolom:**
- `id` - Primary key
- `category_id` - Foreign key ke categories
- `nama_produk` - Nama produk
- `deskripsi` - Deskripsi produk
- `harga` - Harga produk
- `durasi` - Durasi (contoh: "3 bulan", "1 project")
- `level` - Level: 'beginner', 'intermediate', 'advanced'
- `max_peserta` - Maksimal peserta (untuk kelas)
- `stok` - Stok tersedia
- `is_active` - Status aktif
- `rating` - Rating produk (0.00 - 5.00)
- `total_reviews` - Jumlah review
- `created_at` - Waktu dibuat
- `updated_at` - Waktu update

**Contoh Insert:**
```sql
INSERT INTO products (category_id, nama_produk, deskripsi, harga, durasi, level, max_peserta, stok) 
VALUES (1, 'React JS Bootcamp', 'Belajar React dari dasar', 1500000, '2 bulan', 'beginner', 30, 25);
```

**Contoh Query:**
```sql
-- Ambil produk dengan rating tertinggi
SELECT * FROM products 
WHERE is_active = true 
ORDER BY rating DESC, total_reviews DESC 
LIMIT 10;

-- Cari produk berdasarkan harga
SELECT * FROM products 
WHERE harga BETWEEN 1000000 AND 5000000 
AND is_active = true;

-- Produk yang hampir habis stoknya
SELECT * FROM products 
WHERE stok < 5 AND stok > 0 
ORDER BY stok ASC;
```

---

### 4. **pemesanan** - Tabel Pesanan

Menyimpan data pesanan customer.

**Kolom:**
- `id_pesanan` - Primary key
- `user_id` - Foreign key ke users
- `kode_pesanan` - Kode unik (auto-generated)
- `total` - Total harga
- `status` - Status: 'Selesai', 'Dalam Proses', 'Dibatalkan', 'Menunggu Pembayaran'
- `payment_method` - Metode pembayaran
- `payment_proof` - URL bukti pembayaran
- `catatan` - Catatan tambahan
- `nama_lengkap` - Nama pemesan
- `email` - Email pemesan
- `phone` - Telepon pemesan
- `tanggal` - Tanggal pesanan
- `completed_at` - Waktu selesai
- `created_at` - Waktu dibuat
- `updated_at` - Waktu update

**Contoh Insert:**
```sql
-- Jangan insert manual, gunakan stored procedure process_checkout
-- Kode pesanan akan auto-generate
```

**Contoh Query:**
```sql
-- Ambil pesanan user tertentu
SELECT * FROM pemesanan 
WHERE user_id = 1 
ORDER BY tanggal DESC;

-- Update status pesanan
UPDATE pemesanan 
SET status = 'Selesai', payment_proof = 'https://example.com/proof.jpg' 
WHERE id_pesanan = 1;

-- Pesanan yang menunggu pembayaran
SELECT * FROM pemesanan 
WHERE status = 'Menunggu Pembayaran' 
AND tanggal > CURRENT_TIMESTAMP - INTERVAL '7 days';
```

---

### 5. **order_items** - Tabel Detail Pesanan

Menyimpan item-item dalam setiap pesanan.

**Kolom:**
- `id` - Primary key
- `order_id` - Foreign key ke pemesanan
- `product_id` - Foreign key ke products
- `nama_produk` - Nama produk (snapshot)
- `harga` - Harga saat dibeli (snapshot)
- `quantity` - Jumlah
- `subtotal` - Subtotal (harga × quantity)
- `created_at` - Waktu dibuat

**Contoh Query:**
```sql
-- Ambil detail pesanan
SELECT oi.*, p.nama_produk, p.deskripsi
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;

-- Produk terlaris
SELECT product_id, nama_produk, COUNT(*) as total_terjual, SUM(subtotal) as total_revenue
FROM order_items
GROUP BY product_id, nama_produk
ORDER BY total_terjual DESC
LIMIT 10;
```

---

### 6. **reviews** - Tabel Review

Menyimpan review produk dari customer.

**Kolom:**
- `id` - Primary key
- `product_id` - Foreign key ke products
- `user_id` - Foreign key ke users
- `order_id` - Foreign key ke pemesanan
- `rating` - Rating (1-5)
- `comment` - Komentar
- `is_verified` - Verified purchase
- `created_at` - Waktu dibuat
- `updated_at` - Waktu update

**Contoh Insert:**
```sql
INSERT INTO reviews (product_id, user_id, order_id, rating, comment, is_verified) 
VALUES (1, 2, 1, 5, 'Kelas sangat bagus dan mudah dipahami!', true);
```

**Contoh Query:**
```sql
-- Ambil review produk
SELECT r.*, u.nama_lengkap, u.email
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = 1
ORDER BY r.created_at DESC;

-- Review dengan rating rendah
SELECT * FROM reviews 
WHERE rating <= 2 
ORDER BY created_at DESC;
```

---

### 7. **activity_logs** - Tabel Log Aktivitas

Menyimpan audit trail aktivitas penting.

**Kolom:**
- `id` - Primary key
- `user_id` - Foreign key ke users
- `action` - Aksi yang dilakukan
- `table_name` - Nama tabel
- `record_id` - ID record
- `old_value` - Nilai lama (JSON)
- `new_value` - Nilai baru (JSON)
- `ip_address` - IP address
- `user_agent` - User agent
- `created_at` - Waktu dibuat

**Contoh Query:**
```sql
-- Ambil log aktivitas user
SELECT * FROM activity_logs 
WHERE user_id = 1 
ORDER BY created_at DESC 
LIMIT 50;

-- Log perubahan status pesanan
SELECT * FROM activity_logs 
WHERE action = 'ORDER_STATUS_CHANGED' 
AND created_at > CURRENT_TIMESTAMP - INTERVAL '1 day';
```

---

## ⚡ Triggers

### 1. **Auto-Update `updated_at`**

Otomatis update kolom `updated_at` setiap kali ada UPDATE.

**Tables yang menggunakan:**
- users
- categories
- products
- pemesanan
- reviews

**Cara kerja:**
```sql
-- Trigger akan otomatis jalan saat UPDATE
UPDATE users SET nama_lengkap = 'New Name' WHERE id = 1;
-- updated_at akan otomatis berubah ke CURRENT_TIMESTAMP
```

---

### 2. **Auto-Generate Order Code**

Otomatis generate kode pesanan saat INSERT.

**Format:** `ORD-YYYYMMDD-XXXXXX`

**Contoh:** `ORD-20241204-000001`

**Cara kerja:**
```sql
-- Saat insert pemesanan, kode_pesanan akan auto-generate
INSERT INTO pemesanan (user_id, total, nama_lengkap, email, phone) 
VALUES (1, 1500000, 'John Doe', 'john@example.com', '081234567890');
-- kode_pesanan akan otomatis: ORD-20241204-000001
```

---

### 3. **Update Product Stock**

Otomatis kurangi stok produk saat pesanan selesai.

**Cara kerja:**
```sql
-- Saat status berubah menjadi 'Selesai', stok akan berkurang
UPDATE pemesanan SET status = 'Selesai' WHERE id_pesanan = 1;
-- Stok produk di order tersebut akan otomatis berkurang
```

---

### 4. **Update Product Rating**

Otomatis update rating produk saat ada review baru.

**Cara kerja:**
```sql
-- Saat insert review, rating produk akan otomatis di-update
INSERT INTO reviews (product_id, user_id, rating, comment) 
VALUES (1, 2, 5, 'Bagus sekali!');
-- Rating produk akan otomatis di-recalculate
```

---

### 5. **Log Order Activity**

Otomatis log aktivitas pesanan ke activity_logs.

**Cara kerja:**
```sql
-- Saat insert atau update pemesanan, akan otomatis log ke activity_logs
INSERT INTO pemesanan (...) VALUES (...);
-- Akan otomatis insert ke activity_logs dengan action 'ORDER_CREATED'

UPDATE pemesanan SET status = 'Selesai' WHERE id_pesanan = 1;
-- Akan otomatis insert ke activity_logs dengan action 'ORDER_STATUS_CHANGED'
```

---

## 🔧 Functions

### 1. **calculate_total_revenue**

Menghitung total revenue dalam periode tertentu.

**Parameters:**
- `start_date` (TIMESTAMP, optional) - Tanggal mulai
- `end_date` (TIMESTAMP, optional) - Tanggal akhir

**Returns:** DECIMAL(12,2)

**Contoh Penggunaan:**
```sql
-- Total revenue semua waktu
SELECT calculate_total_revenue();

-- Total revenue bulan ini
SELECT calculate_total_revenue(
    DATE_TRUNC('month', CURRENT_TIMESTAMP),
    CURRENT_TIMESTAMP
);

-- Total revenue tahun 2024
SELECT calculate_total_revenue(
    '2024-01-01'::TIMESTAMP,
    '2024-12-31'::TIMESTAMP
);
```

---

### 2. **get_user_order_stats**

Mendapatkan statistik pesanan user.

**Parameters:**
- `p_user_id` (INTEGER) - ID user

**Returns:** TABLE dengan kolom:
- `total_orders` - Total pesanan
- `completed_orders` - Pesanan selesai
- `pending_orders` - Pesanan dalam proses
- `cancelled_orders` - Pesanan dibatalkan
- `total_spent` - Total pengeluaran

**Contoh Penggunaan:**
```sql
-- Statistik user dengan ID 1
SELECT * FROM get_user_order_stats(1);

-- Gabung dengan data user
SELECT u.nama_lengkap, u.email, s.*
FROM users u
CROSS JOIN LATERAL get_user_order_stats(u.id) s
WHERE u.id = 1;
```

---

### 3. **get_product_popularity**

Menghitung skor popularitas produk.

**Parameters:**
- `p_product_id` (INTEGER) - ID produk

**Returns:** DECIMAL(5,2)

**Formula:** `(jumlah_order × 0.6) + (avg_rating × 20 × 0.4)`

**Contoh Penggunaan:**
```sql
-- Popularitas produk dengan ID 1
SELECT get_product_popularity(1);

-- Produk paling populer
SELECT p.id, p.nama_produk, get_product_popularity(p.id) as popularity_score
FROM products p
ORDER BY popularity_score DESC
LIMIT 10;
```

---

## 📦 Stored Procedures

### **process_checkout**

Memproses checkout pesanan dengan multiple produk.

**Parameters:**
- `p_user_id` (INTEGER) - ID user
- `p_product_ids` (INTEGER[]) - Array ID produk
- `p_quantities` (INTEGER[]) - Array jumlah produk
- `p_nama_lengkap` (VARCHAR) - Nama pemesan
- `p_email` (VARCHAR) - Email pemesan
- `p_phone` (VARCHAR) - Telepon pemesan
- `p_payment_method` (VARCHAR) - Metode pembayaran
- `p_catatan` (TEXT) - Catatan tambahan
- `OUT p_order_id` (INTEGER) - ID pesanan yang dibuat
- `OUT p_total` (DECIMAL) - Total harga

**Contoh Penggunaan:**
```sql
-- Checkout dengan 2 produk
CALL process_checkout(
    1,                              -- user_id
    ARRAY[1, 2],                    -- product_ids
    ARRAY[1, 2],                    -- quantities
    'John Doe',                     -- nama_lengkap
    'john@example.com',             -- email
    '081234567890',                 -- phone
    'Transfer Bank',                -- payment_method
    'Mohon segera diproses',        -- catatan
    NULL,                           -- OUT order_id
    NULL                            -- OUT total
);

-- Dengan variable untuk menangkap output
DO $$
DECLARE
    v_order_id INTEGER;
    v_total DECIMAL;
BEGIN
    CALL process_checkout(
        1,
        ARRAY[1, 2, 3],
        ARRAY[1, 1, 2],
        'John Doe',
        'john@example.com',
        '081234567890',
        'Transfer Bank',
        'Catatan pesanan',
        v_order_id,
        v_total
    );
    
    RAISE NOTICE 'Order ID: %, Total: %', v_order_id, v_total;
END $$;
```

**Dari Node.js:**
```javascript
const result = await pool.query(
  `CALL process_checkout($1, $2, $3, $4, $5, $6, $7, $8, NULL, NULL)`,
  [
    userId,
    [1, 2, 3],           // product_ids
    [1, 1, 2],           // quantities
    'John Doe',
    'john@example.com',
    '081234567890',
    'Transfer Bank',
    'Catatan pesanan'
  ]
);
```

---

## 👁️ Views

### 1. **v_order_summary**

View ringkasan pesanan dengan detail user.

**Kolom:**
- `id_pesanan`, `kode_pesanan`, `tanggal`, `status`, `total`
- `payment_method`
- `user_id`, `user_name`, `user_email`, `user_phone`
- `total_items` - Jumlah item
- `products` - Daftar produk (comma-separated)

**Contoh Penggunaan:**
```sql
-- Ambil semua pesanan
SELECT * FROM v_order_summary ORDER BY tanggal DESC;

-- Pesanan user tertentu
SELECT * FROM v_order_summary WHERE user_id = 1;

-- Pesanan hari ini
SELECT * FROM v_order_summary 
WHERE DATE(tanggal) = CURRENT_DATE;
```

---

### 2. **v_product_sales**

View laporan penjualan produk.

**Kolom:**
- `id`, `nama_produk`, `nama_kategori`, `tipe`
- `harga`, `rating`, `total_reviews`
- `total_sold` - Total terjual
- `total_revenue` - Total pendapatan
- `current_stock` - Stok saat ini

**Contoh Penggunaan:**
```sql
-- Produk terlaris
SELECT * FROM v_product_sales 
ORDER BY total_sold DESC 
LIMIT 10;

-- Revenue per kategori
SELECT nama_kategori, SUM(total_revenue) as category_revenue
FROM v_product_sales
GROUP BY nama_kategori
ORDER BY category_revenue DESC;
```

---

### 3. **v_user_dashboard**

View dashboard aktivitas user.

**Kolom:**
- `id`, `nama_lengkap`, `email`, `role`, `last_login`
- `total_orders` - Total pesanan
- `completed_orders` - Pesanan selesai
- `total_spent` - Total pengeluaran
- `total_reviews` - Total review
- `avg_rating_given` - Rata-rata rating yang diberikan

**Contoh Penggunaan:**
```sql
-- Dashboard user tertentu
SELECT * FROM v_user_dashboard WHERE id = 1;

-- Top spenders
SELECT * FROM v_user_dashboard 
ORDER BY total_spent DESC 
LIMIT 10;
```

---

### 4. **v_daily_sales**

View laporan penjualan harian.

**Kolom:**
- `sale_date` - Tanggal
- `total_orders` - Total pesanan
- `completed_orders` - Pesanan selesai
- `daily_revenue` - Revenue harian
- `avg_order_value` - Rata-rata nilai pesanan

**Contoh Penggunaan:**
```sql
-- Penjualan 7 hari terakhir
SELECT * FROM v_daily_sales 
WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY sale_date DESC;

-- Total revenue bulan ini
SELECT SUM(daily_revenue) as monthly_revenue
FROM v_daily_sales
WHERE DATE_TRUNC('month', sale_date) = DATE_TRUNC('month', CURRENT_DATE);
```

---

## 🔐 Roles & Permissions

### **nexfora_admin**

Role untuk administrator dengan akses penuh.

**Permissions:**
- ALL PRIVILEGES pada semua tables
- ALL PRIVILEGES pada semua sequences
- EXECUTE pada semua functions dan procedures

**Login:**
```sql
-- Login sebagai admin
psql -U nexfora_admin -d nexfora_db
```

---

### **nexfora_user**

Role untuk user biasa dengan akses terbatas.

**Permissions:**
- SELECT pada: users, products, categories, reviews
- SELECT, INSERT pada: pemesanan, order_items, reviews
- UPDATE (status) pada: pemesanan
- EXECUTE pada: get_user_order_stats

**Restrictions:**
- Tidak bisa DELETE
- Tidak bisa TRUNCATE
- Tidak bisa DROP
- Tidak bisa ALTER

**Login:**
```sql
-- Login sebagai user
psql -U nexfora_user -d nexfora_db
```

---

## 🚀 Cara Penggunaan

### 1. **Setup Database**

```bash
# Masuk ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE nexfora_db;

# Gunakan database
\c nexfora_db

# Jalankan schema
\i server/database/schema.sql
```

---

### 2. **Dari Node.js**

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'nexfora_admin',
  host: 'localhost',
  database: 'nexfora_db',
  password: 'admin_secure_pass_2024',
  port: 5432,
});

// Query sederhana
const users = await pool.query('SELECT * FROM users WHERE role = $1', ['user']);

// Menggunakan function
const revenue = await pool.query('SELECT calculate_total_revenue()');

// Menggunakan view
const orders = await pool.query('SELECT * FROM v_order_summary WHERE user_id = $1', [1]);

// Menggunakan stored procedure
await pool.query(
  `CALL process_checkout($1, $2, $3, $4, $5, $6, $7, $8, NULL, NULL)`,
  [userId, productIds, quantities, nama, email, phone, paymentMethod, catatan]
);
```

---

## 📝 Contoh Query Kompleks

### 1. **Top Selling Products dengan Revenue**

```sql
SELECT 
    p.nama_produk,
    c.nama_kategori,
    c.tipe,
    COUNT(oi.id) as total_sold,
    SUM(oi.subtotal) as total_revenue,
    AVG(p.rating) as avg_rating
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN order_items oi ON p.id = oi.product_id
JOIN pemesanan pm ON oi.order_id = pm.id_pesanan
WHERE pm.status = 'Selesai'
GROUP BY p.id, p.nama_produk, c.nama_kategori, c.tipe
HAVING COUNT(oi.id) > 0
ORDER BY total_revenue DESC
LIMIT 10;
```

---

### 2. **User Spending Analysis**

```sql
SELECT 
    u.nama_lengkap,
    u.email,
    COUNT(DISTINCT p.id_pesanan) as total_orders,
    COUNT(DISTINCT oi.product_id) as unique_products,
    SUM(p.total) as total_spent,
    AVG(p.total) as avg_order_value,
    MAX(p.tanggal) as last_order_date
FROM users u
JOIN pemesanan p ON u.id = p.user_id
JOIN order_items oi ON p.id_pesanan = oi.order_id
JOIN products pr ON oi.product_id = pr.id
WHERE p.status = 'Selesai'
GROUP BY u.id, u.nama_lengkap, u.email
HAVING SUM(p.total) > 1000000
ORDER BY total_spent DESC;
```

---

### 3. **Monthly Revenue by Category**

```sql
SELECT 
    TO_CHAR(p.tanggal, 'YYYY-MM') as month,
    c.nama_kategori,
    c.tipe,
    COUNT(DISTINCT p.id_pesanan) as total_orders,
    SUM(p.total) as monthly_revenue,
    AVG(p.total) as avg_order_value,
    MIN(p.total) as min_order,
    MAX(p.total) as max_order
FROM pemesanan p
JOIN order_items oi ON p.id_pesanan = oi.order_id
JOIN products pr ON oi.product_id = pr.id
JOIN categories c ON pr.category_id = c.id
WHERE p.status = 'Selesai'
GROUP BY TO_CHAR(p.tanggal, 'YYYY-MM'), c.nama_kategori, c.tipe
ORDER BY month DESC, monthly_revenue DESC;
```

---

### 4. **Product Performance with Reviews**

```sql
SELECT 
    p.nama_produk,
    COUNT(DISTINCT oi.order_id) as times_ordered,
    COUNT(DISTINCT r.id) as total_reviews,
    AVG(r.rating) as avg_review_rating,
    p.rating as system_rating,
    SUM(oi.subtotal) as total_revenue,
    MAX(pm.tanggal) as last_ordered
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN pemesanan pm ON oi.order_id = pm.id_pesanan AND pm.status = 'Selesai'
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.nama_produk, p.rating
HAVING COUNT(DISTINCT oi.order_id) > 0
ORDER BY total_revenue DESC;
```

---

## 🎯 Tips & Best Practices

1. **Gunakan Prepared Statements** untuk mencegah SQL Injection
2. **Gunakan Transactions** untuk operasi yang melibatkan multiple tables
3. **Gunakan Views** untuk query yang sering dipakai
4. **Gunakan Indexes** yang sudah dibuat untuk performa optimal
5. **Monitor Activity Logs** untuk audit trail
6. **Backup Database** secara berkala
7. **Gunakan Role yang Sesuai** (admin vs user) untuk security

---

## 📞 Support

Jika ada pertanyaan atau masalah, silakan hubungi tim development.

---

**Last Updated:** December 4, 2024
**Version:** 1.0.0


---

## 🔄 Migration & Updates

### Update View v_order_summary

View `v_order_summary` telah di-update untuk backward compatibility dengan frontend.

**Field Baru:**
- `nama_paket` - Gabungan nama produk
- `tipe_pemesanan` - 'single' atau 'multiple'
- `catatan` - Catatan pesanan
- `nama_lengkap`, `email`, `phone` - Data pemesan
- `created_at`, `updated_at` - Timestamps

**Cara Update:**

```bash
# Opsi 1: Menggunakan file
psql -U postgres -d nexfora_db -f server/database/update_view.sql

# Opsi 2: Manual query
psql -U postgres -d nexfora_db
```

Kemudian jalankan query dari file `update_view.sql`.

**Dokumentasi Lengkap:**
- [QUICK_FIX.md](QUICK_FIX.md) - Fix cepat untuk error
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Panduan migration lengkap

---

## 📁 File Structure

```
server/database/
├── schema.sql              # Complete database schema
├── update_view.sql         # Update view v_order_summary
├── README.md               # This file
├── QUICK_FIX.md           # Quick fix guide
└── MIGRATION_GUIDE.md     # Migration guide
```

---

## 🔍 Common Issues

### Issue 1: Column "tipe_pemesanan" does not exist

**Cause:** View `v_order_summary` belum di-update  
**Solution:** Jalankan `update_view.sql`  
**Guide:** [QUICK_FIX.md](QUICK_FIX.md)

### Issue 2: Permission denied for view

**Cause:** User tidak punya permission  
**Solution:**
```sql
GRANT SELECT ON v_order_summary TO your_user;
```

### Issue 3: View does not exist

**Cause:** View belum dibuat  
**Solution:** Jalankan `schema.sql` atau `update_view.sql`

---

## 🎯 Best Practices

1. **Backup Database** sebelum migration
2. **Test di staging** sebelum production
3. **Monitor performance** setelah update
4. **Document changes** untuk team
5. **Use transactions** untuk multiple updates

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Check [QUICK_FIX.md](QUICK_FIX.md)
2. Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
3. Create issue on GitHub

---

**Last Updated:** December 4, 2024  
**Version:** 1.1.0 (View update)
