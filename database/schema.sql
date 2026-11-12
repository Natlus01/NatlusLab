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

-- =======================================================
-- Data Awal (Seed Data)
-- =======================================================

-- User bawaan
INSERT INTO users (id, username, password, name, role, is_active) VALUES
('user-1', 'admin', 'admin123', 'Administrator Utama', 'ADMIN', true),
('user-2', 'staff', 'staff123', 'Staf Laboratorium', 'STAFF', true)
ON CONFLICT (username) DO NOTHING;

-- Data inventaris awal laboratorium
INSERT INTO items (id, code, name, category, stock, total_stock, borrowed_count) VALUES
('item-1', 'BR001', 'Laptop Lenovo', 'Laptop & Komputer', 5, 5, 0),
('item-2', 'BR002', 'Mouse Logitech', 'Aksesori & Periferal', 10, 10, 0),
('item-3', 'BR003', 'Keyboard Mechanical', 'Aksesori & Periferal', 8, 8, 0),
('item-4', 'BR004', 'Proyektor Epson', 'Audio Visual & Presentasi', 3, 3, 0),
('item-5', 'BR005', 'Monitor LG', 'Display & Monitor', 6, 6, 0),
('item-6', 'BR006', 'Router MikroTik RB750Gr3', 'Perangkat Jaringan', 4, 4, 0),
('item-7', 'BR007', 'Switch Cisco Catalyst 2960', 'Perangkat Jaringan', 2, 2, 0),
('item-8', 'BR008', 'Crimping Tool & LAN Tester', 'Peralatan & Perkakas Lab', 5, 5, 0),
('item-9', 'BR009', 'Webcam Logitech C920 Pro', 'Audio Visual & Presentasi', 6, 6, 0),
('item-10', 'BR010', 'Toolkit Obeng Presisi', 'Peralatan & Perkakas Lab', 7, 7, 0)
ON CONFLICT (code) DO NOTHING;
