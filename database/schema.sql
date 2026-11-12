-- =======================================================
-- NatlusLab: PostgreSQL Database Schema & Seed Data
-- =======================================================

-- 1. Tabel Pengguna (Users)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Inventaris Barang (Items)
CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    total_stock INTEGER NOT NULL CHECK (total_stock >= 0),
    borrowed_count INTEGER DEFAULT 0 CHECK (borrowed_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Transaksi Sirkulasi (Transactions)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    borrower_name VARCHAR(100) NOT NULL,
    item_id VARCHAR(64) NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    borrow_date VARCHAR(50) NOT NULL,
    return_date VARCHAR(50),
    status VARCHAR(20) NOT NULL CHECK (status IN ('DIPINJAM', 'SELESAI')),
    processed_by_user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    processed_by_user_name VARCHAR(100) NOT NULL,
    returned_by_user_id VARCHAR(64) REFERENCES users(id),
    returned_by_user_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeks untuk optimasi performa query
CREATE INDEX IF NOT EXISTS idx_items_code ON items(code);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_item_id ON transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Trigger otomatis untuk memperbarui updated_at saat data barang diubah
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
CREATE TRIGGER trg_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =======================================================
-- Data Awal (Seed Data)
-- =======================================================

-- Users bawaan sistem
INSERT INTO users (id, username, password, name, role, is_active, created_at) VALUES
('usr-admin-01', 'admin', 'admin123', 'Administrator Laboratorium', 'ADMIN', true, '2026-11-01 08:00:00+00'),
('usr-staff-01', 'staff', 'staff123', 'Petugas Operasional (Staff 1)', 'STAFF', true, '2026-11-01 08:30:00+00'),
('usr-staff-02', 'staff2', 'staff123', 'Petugas Magang (Staff 2 Nonaktif)', 'STAFF', false, '2026-11-02 09:00:00+00')
ON CONFLICT (username) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Data inventaris laboratorium (10 unit aset awal)
INSERT INTO items (id, code, name, category, stock, total_stock, borrowed_count, created_at, updated_at) VALUES
('item-001', 'BR001', 'Laptop Lenovo', 'Laptop & Komputer', 4, 5, 1, '2026-11-01 08:00:00+00', '2026-11-01 08:00:00+00'),
('item-002', 'BR002', 'Mouse Logitech', 'Aksesori & Periferal', 10, 10, 0, '2026-11-01 08:00:00+00', '2026-11-01 08:00:00+00'),
('item-003', 'BR003', 'Keyboard Mechanical', 'Aksesori & Periferal', 8, 8, 0, '2026-11-01 08:00:00+00', '2026-11-01 08:00:00+00'),
('item-004', 'BR004', 'Proyektor Epson', 'Audio Visual & Presentasi', 3, 3, 0, '2026-11-01 08:00:00+00', '2026-11-01 08:00:00+00'),
('item-005', 'BR005', 'Monitor LG', 'Display & Monitor', 6, 6, 0, '2026-11-01 08:00:00+00', '2026-11-01 08:00:00+00'),
('item-006', 'BR006', 'Router MikroTik RB750Gr3', 'Perangkat Jaringan', 4, 4, 0, '2026-11-02 10:00:00+00', '2026-11-02 10:00:00+00'),
('item-007', 'BR007', 'Switch Cisco Catalyst 2960', 'Perangkat Jaringan', 2, 2, 0, '2026-11-02 10:15:00+00', '2026-11-02 10:15:00+00'),
('item-008', 'BR008', 'Crimping Tool & LAN Cable Tester', 'Peralatan & Perkakas Lab', 5, 5, 0, '2026-11-02 10:30:00+00', '2026-11-02 10:30:00+00'),
('item-009', 'BR009', 'Webcam Logitech C920 Pro HD', 'Audio Visual & Presentasi', 6, 6, 0, '2026-11-02 11:00:00+00', '2026-11-02 11:00:00+00'),
('item-010', 'BR010', 'Toolkit Obeng Presisi Elektronik', 'Peralatan & Perkakas Lab', 7, 7, 0, '2026-11-02 11:15:00+00', '2026-11-02 11:15:00+00')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    stock = EXCLUDED.stock,
    total_stock = EXCLUDED.total_stock,
    borrowed_count = EXCLUDED.borrowed_count;

-- Riwayat transaksi sirkulasi bawaan
INSERT INTO transactions (id, transaction_code, borrower_name, item_id, item_code, item_name, quantity, borrow_date, return_date, status, processed_by_user_id, processed_by_user_name, returned_by_user_id, returned_by_user_name, notes, created_at) VALUES
('trx-001', 'TRX-202611-001', 'Rian Pratama (NIM 210101001)', 'item-001', 'BR001', 'Laptop Lenovo', 1, '2026-11-10', NULL, 'DIPINJAM', 'usr-staff-01', 'Petugas Operasional (Staff 1)', NULL, NULL, 'Praktikum Jaringan Komputer Lab 2', '2026-11-10 09:15:00+00'),
('trx-002', 'TRX-202611-002', 'Dian Kusuma, M.Kom (Dosen)', 'item-004', 'BR004', 'Proyektor Epson', 1, '2026-11-08', '2026-11-08', 'SELESAI', 'usr-admin-01', 'Administrator Laboratorium', 'usr-staff-01', 'Petugas Operasional (Staff 1)', 'Kuliah Tamu Sistem Tertanam', '2026-11-08 08:00:00+00')
ON CONFLICT (transaction_code) DO NOTHING;
