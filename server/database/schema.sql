-- ============================================
-- NEXFORA DATABASE SCHEMA
-- Comprehensive Database Design with Advanced Features
-- ============================================

-- Drop existing tables if needed (for fresh setup)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS pemesanan CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE (Enhanced with more fields)
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CATEGORIES TABLE (For products/services)
-- ============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('kelas', 'jasa')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. PRODUCTS TABLE (Kelas & Jasa)
-- ============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    nama_produk VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(12,2) NOT NULL DEFAULT 0,
    durasi VARCHAR(50), -- e.g., "3 bulan", "1 project"
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    max_peserta INTEGER, -- for kelas
    stok INTEGER DEFAULT 0, -- available slots
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. PEMESANAN TABLE (Enhanced Orders)
-- ============================================
CREATE TABLE pemesanan (
    id_pesanan SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kode_pesanan VARCHAR(50) UNIQUE NOT NULL,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'Dalam Proses' 
        CHECK (status IN ('Selesai', 'Dalam Proses', 'Dibatalkan', 'Menunggu Pembayaran')),
    payment_method VARCHAR(50),
    payment_proof TEXT, -- URL to payment proof image
    catatan TEXT,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. ORDER_ITEMS TABLE (Order Details)
-- ============================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES pemesanan(id_pesanan) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    nama_produk VARCHAR(255) NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. REVIEWS TABLE (Product Reviews)
-- ============================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES pemesanan(id_pesanan) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false, -- verified purchase
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id, order_id) -- One review per product per order
);

-- ============================================
-- 7. ACTIVITY_LOGS TABLE (Audit Trail)
-- ============================================
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_rating ON products(rating DESC);
CREATE INDEX idx_products_harga ON products(harga);

-- Orders indexes
CREATE INDEX idx_pemesanan_user_id ON pemesanan(user_id);
CREATE INDEX idx_pemesanan_status ON pemesanan(status);
CREATE INDEX idx_pemesanan_tanggal ON pemesanan(tanggal DESC);
CREATE INDEX idx_pemesanan_kode ON pemesanan(kode_pesanan);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Reviews indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger 1: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pemesanan_updated_at BEFORE UPDATE ON pemesanan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger 2: Auto-generate order code
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.kode_pesanan = 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEW.id_pesanan::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_code BEFORE INSERT ON pemesanan 
    FOR EACH ROW EXECUTE FUNCTION generate_order_code();

-- Trigger 3: Update product stock when order is completed
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Selesai' AND OLD.status != 'Selesai' THEN
        UPDATE products p
        SET stok = stok - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.id_pesanan AND oi.product_id = p.id;
        
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stock_on_complete BEFORE UPDATE ON pemesanan 
    FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- Trigger 4: Update product rating when review is added/updated
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE product_id = NEW.product_id),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review AFTER INSERT OR UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Trigger 5: Log activity for important actions
CREATE OR REPLACE FUNCTION log_order_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (user_id, action, table_name, record_id, new_value)
        VALUES (NEW.user_id, 'ORDER_CREATED', 'pemesanan', NEW.id_pesanan, row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO activity_logs (user_id, action, table_name, record_id, old_value, new_value)
        VALUES (NEW.user_id, 'ORDER_STATUS_CHANGED', 'pemesanan', NEW.id_pesanan, 
                jsonb_build_object('status', OLD.status), jsonb_build_object('status', NEW.status));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_order_changes AFTER INSERT OR UPDATE ON pemesanan 
    FOR EACH ROW EXECUTE FUNCTION log_order_activity();

-- ============================================
-- FUNCTIONS & STORED PROCEDURES
-- ============================================

-- Function 1: Calculate total revenue
CREATE OR REPLACE FUNCTION calculate_total_revenue(
    start_date TIMESTAMP DEFAULT NULL,
    end_date TIMESTAMP DEFAULT NULL
)
RETURNS DECIMAL(12,2) AS $$
DECLARE
    total_revenue DECIMAL(12,2);
BEGIN
    SELECT COALESCE(SUM(total), 0)
    INTO total_revenue
    FROM pemesanan
    WHERE status = 'Selesai'
    AND (start_date IS NULL OR tanggal >= start_date)
    AND (end_date IS NULL OR tanggal <= end_date);
    
    RETURN total_revenue;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Get user order statistics
CREATE OR REPLACE FUNCTION get_user_order_stats(p_user_id INTEGER)
RETURNS TABLE (
    total_orders INTEGER,
    completed_orders INTEGER,
    pending_orders INTEGER,
    cancelled_orders INTEGER,
    total_spent DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_orders,
        COUNT(*) FILTER (WHERE status = 'Selesai')::INTEGER as completed_orders,
        COUNT(*) FILTER (WHERE status = 'Dalam Proses')::INTEGER as pending_orders,
        COUNT(*) FILTER (WHERE status = 'Dibatalkan')::INTEGER as cancelled_orders,
        COALESCE(SUM(total) FILTER (WHERE status = 'Selesai'), 0) as total_spent
    FROM pemesanan
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Get product popularity score
CREATE OR REPLACE FUNCTION get_product_popularity(p_product_id INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    popularity_score DECIMAL(5,2);
    order_count INTEGER;
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT COUNT(*), COALESCE(AVG(p.rating), 0)
    INTO order_count, avg_rating
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.product_id = p_product_id;
    
    -- Popularity = (order_count * 0.6) + (avg_rating * 20 * 0.4)
    popularity_score := (order_count * 0.6) + (avg_rating * 20 * 0.4);
    
    RETURN popularity_score;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure 1: Process order checkout
CREATE OR REPLACE PROCEDURE process_checkout(
    p_user_id INTEGER,
    p_product_ids INTEGER[],
    p_quantities INTEGER[],
    p_nama_lengkap VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_payment_method VARCHAR,
    p_catatan TEXT,
    OUT p_order_id INTEGER,
    OUT p_total DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id INTEGER;
    v_total DECIMAL(12,2) := 0;
    v_product_id INTEGER;
    v_quantity INTEGER;
    v_harga DECIMAL(12,2);
    v_nama_produk VARCHAR(255);
    v_subtotal DECIMAL(12,2);
    i INTEGER;
BEGIN
    -- Create order
    INSERT INTO pemesanan (user_id, total, nama_lengkap, email, phone, payment_method, catatan, status)
    VALUES (p_user_id, 0, p_nama_lengkap, p_email, p_phone, p_payment_method, p_catatan, 'Menunggu Pembayaran')
    RETURNING id_pesanan INTO v_order_id;
    
    -- Add order items
    FOR i IN 1..array_length(p_product_ids, 1) LOOP
        v_product_id := p_product_ids[i];
        v_quantity := p_quantities[i];
        
        SELECT harga, nama_produk INTO v_harga, v_nama_produk
        FROM products WHERE id = v_product_id;
        
        v_subtotal := v_harga * v_quantity;
        v_total := v_total + v_subtotal;
        
        INSERT INTO order_items (order_id, product_id, nama_produk, harga, quantity, subtotal)
        VALUES (v_order_id, v_product_id, v_nama_produk, v_harga, v_quantity, v_subtotal);
    END LOOP;
    
    -- Update order total
    UPDATE pemesanan SET total = v_total WHERE id_pesanan = v_order_id;
    
    p_order_id := v_order_id;
    p_total := v_total;
END;
$$;

-- ============================================
-- VIEWS
-- ============================================

-- View 1: Order Summary with User Details
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

-- View 2: Product Sales Report
CREATE OR REPLACE VIEW v_product_sales AS
SELECT 
    p.id,
    p.nama_produk,
    c.nama_kategori,
    c.tipe,
    p.harga,
    p.rating,
    p.total_reviews,
    COUNT(oi.id) as total_sold,
    COALESCE(SUM(oi.subtotal), 0) as total_revenue,
    p.stok as current_stock
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN pemesanan pm ON oi.order_id = pm.id_pesanan AND pm.status = 'Selesai'
GROUP BY p.id, p.nama_produk, c.nama_kategori, c.tipe, p.harga, p.rating, p.total_reviews, p.stok;

-- View 3: User Activity Dashboard
CREATE OR REPLACE VIEW v_user_dashboard AS
SELECT 
    u.id,
    u.nama_lengkap,
    u.email,
    u.role,
    u.last_login,
    COUNT(DISTINCT p.id_pesanan) as total_orders,
    COUNT(DISTINCT p.id_pesanan) FILTER (WHERE p.status = 'Selesai') as completed_orders,
    COALESCE(SUM(p.total) FILTER (WHERE p.status = 'Selesai'), 0) as total_spent,
    COUNT(DISTINCT r.id) as total_reviews,
    COALESCE(AVG(r.rating), 0)::DECIMAL(3,2) as avg_rating_given
FROM users u
LEFT JOIN pemesanan p ON u.id = p.user_id
LEFT JOIN reviews r ON u.id = r.user_id
GROUP BY u.id, u.nama_lengkap, u.email, u.role, u.last_login;

-- View 4: Daily Sales Report
CREATE OR REPLACE VIEW v_daily_sales AS
SELECT 
    DATE(tanggal) as sale_date,
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'Selesai') as completed_orders,
    COALESCE(SUM(total) FILTER (WHERE status = 'Selesai'), 0) as daily_revenue,
    COALESCE(AVG(total) FILTER (WHERE status = 'Selesai'), 0)::DECIMAL(12,2) as avg_order_value
FROM pemesanan
GROUP BY DATE(tanggal)
ORDER BY sale_date DESC;

-- ============================================
-- USER ROLES & PERMISSIONS
-- ============================================

-- Create roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'nexfora_admin') THEN
        CREATE ROLE nexfora_admin WITH LOGIN PASSWORD 'admin_secure_pass_2024';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'nexfora_user') THEN
        CREATE ROLE nexfora_user WITH LOGIN PASSWORD 'user_secure_pass_2024';
    END IF;
END
$$;

-- Grant permissions to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nexfora_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nexfora_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO nexfora_admin;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA public TO nexfora_admin;

-- Grant limited permissions to user role
GRANT SELECT ON users, products, categories, reviews TO nexfora_user;
GRANT SELECT, INSERT ON pemesanan, order_items, reviews TO nexfora_user;
GRANT UPDATE (status) ON pemesanan TO nexfora_user; -- Can only update their own order status
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO nexfora_user;
GRANT EXECUTE ON FUNCTION get_user_order_stats TO nexfora_user;

-- Revoke dangerous permissions from user role
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM nexfora_user;
REVOKE TRUNCATE ON ALL TABLES IN SCHEMA public FROM nexfora_user;
-- Note: DROP privilege tidak perlu di-REVOKE karena memang tidak ada privilege DROP untuk tables
-- User hanya bisa DROP table jika mereka adalah owner atau superuser

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert admin user
INSERT INTO users (nama_lengkap, email, password, role) VALUES
('Admin Nexfora', 'admin@nexfora.com', '123456', 'admin'),
('Rifki Al Sauqy', 'rifki@gmail.com', '123456', 'user'),
('John Doe', 'john@example.com', '123456', 'user');

-- Insert categories
INSERT INTO categories (nama_kategori, deskripsi, tipe) VALUES
('Dasar Pemrograman', 'Kelas pemrograman menggunakan bahasa c++', 'kelas'),
('Basic Python', 'Belajar dasar-dasar python', 'kelas');
('Design', 'Jasa design berbasis figma', 'jasa');
('Website Development', 'Jasa pembuatan website profesional', 'jasa');

-- Insert products (kelas)
INSERT INTO products (category_id, nama_produk, deskripsi, harga, durasi, level, max_peserta, stok) VALUES
(1, 'Basic C++', 'Belajar fundamental dan logika pemrograman', 15000, '1 materi', 'beginner', 10, 10),
(1, 'Basic Pascal', 'Belajar fundamental dan logika pemrograman', 10000, '1 materi', 'beginner', 10, 10),
(2, 'Basic Python', 'Belajar fundamental dengan bahasa python', 50000, '7 hari', 'beginner', 10, 10);

-- Insert products (jasa)
INSERT INTO products (category_id, nama_produk, deskripsi, harga, durasi, level, stok) VALUES
(3, 'UI','User Interface untuk website e-commerce dan sejenisnya', 450000, '5 hari', NULL, 10),
(3, 'Twibbon','Desain twibbon untuk kampanye, event, atau promosi di media sosial', 25000, '2 hari', NULL, 10),
(3, 'Banner','Desain banner untuk promosi produk, layanan, atau acara', 30000, '3 hari', NULL, 5),
(3, 'Flyer','Desain flyer informatif untuk pemasaran offline maupun digital', 30000, '3 hari', NULL, 5),
(3, 'Poster','Desain poster kreatif untuk publikasi acara, produk, atau kampanye', 30000, '2 hari', NULL, 5),
(3, 'ID Card','Desain kartu identitas profesional untuk organisasi, sekolah, atau komunitas', 25000, '2 hari', NULL, 5),
(3, 'Sertifikat','Desain sertifikat resmi untuk pelatihan, seminar, atau lomba', 35000, '2 hari', NULL, 5),
(3, 'PPT','Desain presentasi PowerPoint yang menarik dan informatif', 15000, '1 hari', NULL, 5);



-- ============================================
-- COMPLEX QUERIES EXAMPLES
-- ============================================

-- Query 1: Top selling products with category and revenue (JOIN 3 tables)
-- SELECT 
--     p.nama_produk,
--     c.nama_kategori,
--     c.tipe,
--     COUNT(oi.id) as total_sold,
--     SUM(oi.subtotal) as total_revenue,
--     AVG(p.rating) as avg_rating
-- FROM products p
-- JOIN categories c ON p.category_id = c.id
-- JOIN order_items oi ON p.id = oi.product_id
-- JOIN pemesanan pm ON oi.order_id = pm.id_pesanan
-- WHERE pm.status = 'Selesai'
-- GROUP BY p.id, p.nama_produk, c.nama_kategori, c.tipe
-- HAVING COUNT(oi.id) > 0
-- ORDER BY total_revenue DESC
-- LIMIT 10;

-- Query 2: User spending analysis with order details (JOIN 4 tables)
-- SELECT 
--     u.nama_lengkap,
--     u.email,
--     COUNT(DISTINCT p.id_pesanan) as total_orders,
--     COUNT(DISTINCT oi.product_id) as unique_products,
--     SUM(p.total) as total_spent,
--     AVG(p.total) as avg_order_value,
--     MAX(p.tanggal) as last_order_date
-- FROM users u
-- JOIN pemesanan p ON u.id = p.user_id
-- JOIN order_items oi ON p.id_pesanan = oi.order_id
-- JOIN products pr ON oi.product_id = pr.id
-- WHERE p.status = 'Selesai'
-- GROUP BY u.id, u.nama_lengkap, u.email
-- HAVING SUM(p.total) > 1000000
-- ORDER BY total_spent DESC;

-- Query 3: Monthly revenue by category (Aggregate with GROUP BY)
-- SELECT 
--     TO_CHAR(p.tanggal, 'YYYY-MM') as month,
--     c.nama_kategori,
--     c.tipe,
--     COUNT(DISTINCT p.id_pesanan) as total_orders,
--     SUM(p.total) as monthly_revenue,
--     AVG(p.total) as avg_order_value,
--     MIN(p.total) as min_order,
--     MAX(p.total) as max_order
-- FROM pemesanan p
-- JOIN order_items oi ON p.id_pesanan = oi.order_id
-- JOIN products pr ON oi.product_id = pr.id
-- JOIN categories c ON pr.category_id = c.id
-- WHERE p.status = 'Selesai'
-- GROUP BY TO_CHAR(p.tanggal, 'YYYY-MM'), c.nama_kategori, c.tipe
-- ORDER BY month DESC, monthly_revenue DESC;

-- Query 4: Product performance with reviews (Aggregate functions)
-- SELECT 
--     p.nama_produk,
--     COUNT(DISTINCT oi.order_id) as times_ordered,
--     COUNT(DISTINCT r.id) as total_reviews,
--     AVG(r.rating) as avg_review_rating,
--     p.rating as system_rating,
--     SUM(oi.subtotal) as total_revenue,
--     MAX(pm.tanggal) as last_ordered
-- FROM products p
-- LEFT JOIN order_items oi ON p.id = oi.product_id
-- LEFT JOIN pemesanan pm ON oi.order_id = pm.id_pesanan AND pm.status = 'Selesai'
-- LEFT JOIN reviews r ON p.id = r.product_id
-- GROUP BY p.id, p.nama_produk, p.rating
-- HAVING COUNT(DISTINCT oi.order_id) > 0
-- ORDER BY total_revenue DESC;

COMMENT ON TABLE users IS 'User accounts with role-based access';
COMMENT ON TABLE categories IS 'Product categories for kelas and jasa';
COMMENT ON TABLE products IS 'Products including courses (kelas) and services (jasa)';
COMMENT ON TABLE pemesanan IS 'Customer orders with payment tracking';
COMMENT ON TABLE order_items IS 'Individual items in each order';
COMMENT ON TABLE reviews IS 'Product reviews and ratings from customers';
COMMENT ON TABLE activity_logs IS 'Audit trail for important system activities';
