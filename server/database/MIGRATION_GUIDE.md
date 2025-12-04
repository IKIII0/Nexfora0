# 🔄 Migration Guide - Update Database View

Panduan untuk update view `v_order_summary` agar kompatibel dengan frontend yang sudah ada.

---

## 🎯 Tujuan

Menambahkan field `nama_paket` dan `tipe_pemesanan` ke view `v_order_summary` untuk backward compatibility dengan frontend yang masih menggunakan field tersebut.

---

## 📋 Perubahan

### Field Baru di View `v_order_summary`:

1. **`nama_paket`** - Gabungan nama produk (sama dengan `products`)
2. **`tipe_pemesanan`** - 'single' jika 1 item, 'multiple' jika lebih dari 1

### Field Tambahan:
- `catatan` - Catatan pesanan
- `nama_lengkap` - Nama pemesan
- `email` - Email pemesan
- `phone` - Telepon pemesan
- `created_at` - Waktu dibuat
- `updated_at` - Waktu update

---

## 🚀 Cara Update

### Opsi 1: Jalankan File Update (Recommended)

```bash
# Login ke PostgreSQL
psql -U postgres -d nexfora_db

# Jalankan update script
\i server/database/update_view.sql

# Atau langsung dari command line
psql -U postgres -d nexfora_db -f server/database/update_view.sql
```

### Opsi 2: Manual Query

```sql
-- Drop existing view
DROP VIEW IF EXISTS v_order_summary;

-- Create updated view
CREATE OR REPLACE VIEW v_order_summary AS
SELECT 
    p.id_pesanan,
    p.kode_pesanan,
    p.tanggal,
    p.status,
    p.total,
    p.payment_method,
    p.catatan,
    p.nama_lengkap,
    p.email,
    p.phone,
    p.created_at,
    p.updated_at,
    u.id as user_id,
    u.nama_lengkap as user_name,
    u.email as user_email,
    u.phone as user_phone,
    COUNT(oi.id) as total_items,
    STRING_AGG(oi.nama_produk, ', ') as products,
    -- Backward compatibility fields
    STRING_AGG(oi.nama_produk, ', ') as nama_paket,
    CASE 
        WHEN COUNT(oi.id) = 1 THEN 'single'
        ELSE 'multiple'
    END as tipe_pemesanan
FROM pemesanan p
JOIN users u ON p.user_id = u.id
LEFT JOIN order_items oi ON p.id_pesanan = oi.order_id
GROUP BY p.id_pesanan, p.kode_pesanan, p.tanggal, p.status, p.total, 
         p.payment_method, p.catatan, p.nama_lengkap, p.email, p.phone,
         p.created_at, p.updated_at, u.id, u.nama_lengkap, u.email, u.phone;
```

---

## ✅ Verifikasi

### Test Query

```sql
-- Check view structure
\d+ v_order_summary

-- Test query
SELECT 
    id_pesanan,
    kode_pesanan,
    nama_paket,
    tipe_pemesanan,
    total,
    status
FROM v_order_summary
LIMIT 5;
```

### Expected Output

```
 id_pesanan | kode_pesanan        | nama_paket                    | tipe_pemesanan | total    | status
------------+---------------------+-------------------------------+----------------+----------+--------
 1          | ORD-20241204-000001 | React JS, Vue JS              | multiple       | 3000000  | Selesai
 2          | ORD-20241204-000002 | Flutter Mobile Development    | single         | 2000000  | Dalam Proses
```

---

## 🔍 Troubleshooting

### Error: "view v_order_summary does not exist"

Ini normal jika view belum pernah dibuat. Jalankan script update.

### Error: "column does not exist"

Pastikan tabel `pemesanan`, `users`, dan `order_items` sudah ada dan memiliki kolom yang benar.

### Error: "permission denied"

Pastikan user PostgreSQL Anda memiliki permission untuk DROP dan CREATE view:

```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

---

## 📝 Rollback

Jika perlu rollback ke view lama:

```sql
DROP VIEW IF EXISTS v_order_summary;

CREATE OR REPLACE VIEW v_order_summary AS
SELECT 
    p.id_pesanan,
    p.kode_pesanan,
    p.tanggal,
    p.status,
    p.total,
    p.payment_method,
    u.id as user_id,
    u.nama_lengkap as user_name,
    u.email as user_email,
    u.phone as user_phone,
    COUNT(oi.id) as total_items,
    STRING_AGG(oi.nama_produk, ', ') as products
FROM pemesanan p
JOIN users u ON p.user_id = u.id
LEFT JOIN order_items oi ON p.id_pesanan = oi.order_id
GROUP BY p.id_pesanan, p.kode_pesanan, p.tanggal, p.status, p.total, 
         p.payment_method, u.id, u.nama_lengkap, u.email, u.phone;
```

---

## 🎯 Impact

### Backend
- ✅ Tidak ada perubahan kode backend
- ✅ API tetap berfungsi normal
- ✅ View mengembalikan field tambahan

### Frontend
- ✅ Field `nama_paket` dan `tipe_pemesanan` tersedia
- ✅ Tidak perlu update kode frontend
- ✅ Backward compatible

### Database
- ✅ Hanya update view (tidak ada perubahan tabel)
- ✅ Data tidak berubah
- ✅ Performance tidak terpengaruh

---

## 📊 Mapping Field

| Frontend Field    | Database Field    | Source                          |
|-------------------|-------------------|---------------------------------|
| `nama_paket`      | `nama_paket`      | STRING_AGG(oi.nama_produk)      |
| `tipe_pemesanan`  | `tipe_pemesanan`  | CASE WHEN count = 1 THEN...     |
| `products`        | `products`        | STRING_AGG(oi.nama_produk)      |
| `total_items`     | `total_items`     | COUNT(oi.id)                    |

---

## 🚀 Next Steps

Setelah update view:

1. ✅ Restart backend server
2. ✅ Test API endpoint `/api/orders`
3. ✅ Test frontend order list
4. ✅ Verify data tampil dengan benar

---

**Last Updated:** December 4, 2024
