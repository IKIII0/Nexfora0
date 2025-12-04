-- ============================================
-- UPDATE VIEW v_order_summary
-- Menambahkan backward compatibility untuk frontend
-- ============================================

-- Drop existing view
DROP VIEW IF EXISTS v_order_summary;

-- Create updated view with backward compatibility fields
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

-- Verify view
SELECT * FROM v_order_summary LIMIT 1;
