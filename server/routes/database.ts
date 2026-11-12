import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getClient } from '../db.js';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export entire database as JSON
router.get('/export', async (_req: Request, res: Response): Promise<void> => {
  try {
    const usersRes = await query('SELECT * FROM users ORDER BY created_at ASC');
    const itemsRes = await query('SELECT * FROM items ORDER BY code ASC');
    const trxsRes = await query('SELECT * FROM transactions ORDER BY created_at DESC');

    const backup = {
      system: 'NatlusLab PostgreSQL',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      data: {
        users: usersRes.rows,
        items: itemsRes.rows,
        transactions: trxsRes.rows,
      },
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=natluslab_backup_${Date.now()}.json`);
    res.json(backup);
  } catch (error: any) {
    console.error('Error exporting database:', error);
    res.status(500).json({ success: false, message: 'Gagal mengekspor data PostgreSQL.' });
  }
});

// Import backup JSON
router.post('/import', async (req: Request, res: Response): Promise<void> => {
  const client = await getClient();
  try {
    const payload = req.body;
    const data = payload?.data || payload;

    if (!Array.isArray(data?.users) || !Array.isArray(data?.items)) {
      res.status(400).json({ success: false, message: 'Format cadangan data tidak valid.' });
      return;
    }

    await client.query('BEGIN');

    // Clean current data
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM items');
    await client.query('DELETE FROM users');

    // Insert users
    for (const u of data.users) {
      await client.query(
        `INSERT INTO users (id, username, password, name, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [u.id, u.username, u.password, u.name, u.role, u.is_active ?? u.isActive ?? true, u.created_at ?? u.createdAt ?? new Date()]
      );
    }

    // Insert items
    for (const it of data.items) {
      await client.query(
        `INSERT INTO items (id, code, name, category, stock, total_stock, borrowed_count, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          it.id,
          it.code,
          it.name,
          it.category,
          it.stock,
          it.total_stock ?? it.totalStock ?? it.stock,
          it.borrowed_count ?? it.borrowedCount ?? 0,
          it.created_at ?? it.createdAt ?? new Date(),
          it.updated_at ?? it.updatedAt ?? new Date(),
        ]
      );
    }

    // Insert transactions
    if (Array.isArray(data.transactions)) {
      for (const t of data.transactions) {
        await client.query(
          `INSERT INTO transactions (
            id, transaction_code, borrower_name, item_id, item_code, item_name,
            quantity, borrow_date, return_date, status, processed_by_user_id,
            processed_by_user_name, returned_by_user_id, returned_by_user_name, notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            t.id,
            t.transaction_code ?? t.transactionCode,
            t.borrower_name ?? t.borrowerName,
            t.item_id ?? t.itemId,
            t.item_code ?? t.itemCode,
            t.item_name ?? t.itemName,
            t.quantity,
            t.borrow_date ?? t.borrowDate,
            t.return_date ?? t.returnDate ?? null,
            t.status,
            t.processed_by_user_id ?? t.processedByUserId,
            t.processed_by_user_name ?? t.processedByUserName,
            t.returned_by_user_id ?? t.returnedByUserId ?? null,
            t.returned_by_user_name ?? t.returnedByUserName ?? null,
            t.notes ?? null,
            t.created_at ?? t.createdAt ?? new Date(),
          ]
        );
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Pemulihan data berhasil. Diimpor: ${data.items.length} barang, ${data.users.length} akun pengguna, dan ${(data.transactions || []).length} riwayat transaksi.`,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error importing database:', error);
    res.status(500).json({ success: false, message: 'Gagal memulihkan basis data: ' + error.message });
  } finally {
    client.release();
  }
});

// Reset database to initial schema.sql
router.post('/reset', async (_req: Request, res: Response): Promise<void> => {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    res.status(500).json({ success: false, message: 'Berkas database/schema.sql tidak ditemukan.' });
    return;
  }

  const sql = fs.readFileSync(schemaPath, 'utf-8');
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS transactions CASCADE');
    await client.query('DROP TABLE IF EXISTS items CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query(sql);
    await client.query('COMMIT');

    res.json({ success: true, message: 'Basis data PostgreSQL berhasil di-reset ke data bawaan awal laboratorium.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error resetting database:', error);
    res.status(500).json({ success: false, message: 'Gagal me-reset database: ' + error.message });
  } finally {
    client.release();
  }
});

export default router;
