import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('--- Inisialisasi Database PostgreSQL NatlusLab ---');
  
  const connected = await testConnection();
  if (!connected) {
    console.error('Koneksi ke PostgreSQL gagal. Pastikan database PostgreSQL aktif.');
    process.exit(1);
  }

  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  console.log(`Membaca berkas schema SQL: ${schemaPath}`);
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`Berkas schema tidak ditemukan di: ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');
  
  console.log('Mengeksekusi skema tabel dan seed data...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Skema tabel dan seed data berhasil dieksekusi!');

    // Verifikasi data
    const usersCount = await client.query('SELECT count(*) FROM users');
    const itemsCount = await client.query('SELECT count(*) FROM items');
    const trxsCount = await client.query('SELECT count(*) FROM transactions');

    console.log('Hasil Verifikasi:');
    console.log(`- Jumlah Pengguna (Users): ${usersCount.rows[0].count}`);
    console.log(`- Jumlah Barang (Items): ${itemsCount.rows[0].count}`);
    console.log(`- Jumlah Transaksi (Transactions): ${trxsCount.rows[0].count}`);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Gagal mengeksekusi skema database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }

  console.log('Inisialisasi database PostgreSQL selesai dengan sukses!');
}

initDatabase();
