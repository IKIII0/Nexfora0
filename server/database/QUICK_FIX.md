# ⚡ Quick Fix - Error "column tipe_pemesanan does not exist"

## 🚨 Problem

Frontend error:
```
Error: column "tipe_pemesanan" does not exist
```

## ✅ Solution

View `v_order_summary` perlu di-update untuk menambahkan field `nama_paket` dan `tipe_pemesanan`.

---

## 🔧 Fix dalam 2 Menit

### Step 1: Login ke Database

```bash
# Railway
railway run psql $DATABASE_URL

# Heroku
heroku pg:psql

# Local
psql -U postgres -d nexfora_db
```

### Step 2: Run Update Query

Copy-paste query ini:

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

### Step 3: Verify

```sql
SELECT id_pesanan, nama_paket, tipe_pemesanan FROM v_order_summary LIMIT 1;
```

### Step 4: Restart Backend

```bash
# Railway
railway restart

# Heroku
heroku restart

# Local
# Ctrl+C dan npm run dev lagi
```

---

## ✅ Done!

Error seharusnya sudah hilang. Test dengan:
- Buka halaman orders
- Refresh browser
- Check console untuk error

---

## 📝 Alternative: Using File

Jika punya akses ke server files:

```bash
# Download update_view.sql
# Upload ke server
# Run:
psql $DATABASE_URL -f update_view.sql
```

---

## 🆘 Still Not Working?

### Check 1: View exists?
```sql
\dv v_order_summary
```

### Check 2: View has correct columns?
```sql
\d+ v_order_summary
```

### Check 3: Backend using correct view?
Check `server/services/orderService.js` line ~50:
```javascript
const query = `SELECT * FROM v_order_summary WHERE user_id = $1`;
```

### Check 4: Database connection?
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## 📞 Need Help?

1. Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed steps
2. Check [Database README](README.md) for database documentation
3. Create issue on GitHub

---

**Fix Time:** ~2 minutes  
**Downtime:** ~30 seconds (restart only)  
**Risk:** Low (only updating view, no data changes)
