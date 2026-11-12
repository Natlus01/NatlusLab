import { Router, Request, Response } from 'express';
import { query, getClient } from '../db.js';

const router = Router();

// GET all transactions
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT 
        id, 
        transaction_code AS "transactionCode", 
        borrower_name AS "borrowerName", 
        item_id AS "itemId", 
        item_code AS "itemCode", 
        item_name AS "itemName", 
        quantity, 
        borrow_date AS "borrowDate", 
        return_date AS "returnDate", 
        status, 
        processed_by_user_id AS "processedByUserId", 
        processed_by_user_name AS "processedByUserName", 
        returned_by_user_id AS "returnedByUserId", 
        returned_by_user_name AS "returnedByUserName", 
        notes, 
        created_at AS "createdAt" 
      FROM transactions 
      ORDER BY created_at DESC`
    );
    res.json({ success: true, transactions: result.rows });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi dari basis data.' });
  }
});

// POST borrow transaction (Atomic Database Transaction)
router.post('/borrow', async (req: Request, res: Response): Promise<void> => {
  const client = await getClient();
  try {
    const { borrowerName, itemId, quantity, borrowDate, processedByUser, notes } = req.body;

    if (!borrowerName || !itemId || !quantity || !borrowDate || !processedByUser) {
      res.status(400).json({ success: false, message: 'Informasi peminjaman tidak lengkap.' });
      return;
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      res.status(400).json({ success: false, message: 'Jumlah peminjaman harus lebih dari 0 unit.' });
      return;
    }

    await client.query('BEGIN');

    // Row-level lock on item
    const itemRes = await client.query('SELECT * FROM items WHERE id = $1 FOR UPDATE', [itemId]);
    if (itemRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ success: false, message: 'Barang tidak ditemukan di laboratorium.' });
      return;
    }

    const item = itemRes.rows[0];
    if (item.stock < qty) {
      await client.query('ROLLBACK');
      res.status(400).json({
        success: false,
        message: `Stok tidak mencukupi. Tersedia ${item.stock} unit, sedangkan permintaan ${qty} unit.`,
      });
      return;
    }

    // Update item stock & borrowed_count
    await client.query(
      `UPDATE items 
       SET stock = stock - $1, borrowed_count = borrowed_count + $1, updated_at = NOW() 
       WHERE id = $2`,
      [qty, itemId]
    );

    const countRes = await client.query('SELECT count(*) FROM transactions');
    const trxSequence = String(Number(countRes.rows[0].count) + 1).padStart(3, '0');
    const datePrefix = new Date().toISOString().slice(0, 7).replace('-', '');
    const transactionCode = `TRX-${datePrefix}-${trxSequence}`;
    const transactionId = `trx-${Date.now()}`;

    const insertRes = await client.query(
      `INSERT INTO transactions (
        id, transaction_code, borrower_name, item_id, item_code, item_name,
        quantity, borrow_date, status, processed_by_user_id, processed_by_user_name, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'DIPINJAM', $9, $10, $11)
      RETURNING 
        id, 
        transaction_code AS "transactionCode", 
        borrower_name AS "borrowerName", 
        item_id AS "itemId", 
        item_code AS "itemCode", 
        item_name AS "itemName", 
        quantity, 
        borrow_date AS "borrowDate", 
        return_date AS "returnDate", 
        status, 
        processed_by_user_id AS "processedByUserId", 
        processed_by_user_name AS "processedByUserName", 
        returned_by_user_id AS "returnedByUserId", 
        returned_by_user_name AS "returnedByUserName", 
        notes, 
        created_at AS "createdAt"`,
      [
        transactionId,
        transactionCode,
        borrowerName.trim(),
        item.id,
        item.code,
        item.name,
        qty,
        borrowDate,
        processedByUser.id,
        processedByUser.name,
        notes?.trim() || null,
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: `Peminjaman ${qty} unit ${item.name} berhasil dicatat (Kode: ${transactionCode}).`,
      transaction: insertRes.rows[0],
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error in borrow transaction:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses transaksi peminjaman di basis data.' });
  } finally {
    client.release();
  }
});

// POST return transaction (Atomic Database Transaction)
router.post('/return', async (req: Request, res: Response): Promise<void> => {
  const client = await getClient();
  try {
    const { transactionId, returnDate, returnedByUser, returnNotes } = req.body;

    if (!transactionId || !returnDate || !returnedByUser) {
      res.status(400).json({ success: false, message: 'Informasi pengembalian barang tidak lengkap.' });
      return;
    }

    await client.query('BEGIN');

    // Row-level lock on transaction
    const trxRes = await client.query('SELECT * FROM transactions WHERE id = $1 FOR UPDATE', [transactionId]);
    if (trxRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ success: false, message: 'Transaksi peminjaman tidak ditemukan.' });
      return;
    }

    const trx = trxRes.rows[0];
    if (trx.status === 'SELESAI') {
      await client.query('ROLLBACK');
      res.status(400).json({ success: false, message: 'Transaksi ini telah berstatus SELESAI sebelumnya.' });
      return;
    }

    // Row-level lock on item
    const itemRes = await client.query('SELECT * FROM items WHERE id = $1 FOR UPDATE', [trx.item_id]);
    if (itemRes.rows.length > 0) {
      await client.query(
        `UPDATE items 
         SET stock = stock + $1, borrowed_count = GREATEST(0, borrowed_count - $1), updated_at = NOW() 
         WHERE id = $2`,
        [trx.quantity, trx.item_id]
      );
    }

    const combinedNotes = returnNotes
      ? (trx.notes ? `${trx.notes} | Pengembalian: ${returnNotes}` : `Pengembalian: ${returnNotes}`)
      : trx.notes;

    const updatedTrxRes = await client.query(
      `UPDATE transactions 
       SET 
         status = 'SELESAI', 
         return_date = $1, 
         returned_by_user_id = $2, 
         returned_by_user_name = $3, 
         notes = $4 
       WHERE id = $5
       RETURNING 
         id, 
         transaction_code AS "transactionCode", 
         borrower_name AS "borrowerName", 
         item_id AS "itemId", 
         item_code AS "itemCode", 
         item_name AS "itemName", 
         quantity, 
         borrow_date AS "borrowDate", 
         return_date AS "returnDate", 
         status, 
         processed_by_user_id AS "processedByUserId", 
         processed_by_user_name AS "processedByUserName", 
         returned_by_user_id AS "returnedByUserId", 
         returned_by_user_name AS "returnedByUserName", 
         notes, 
         created_at AS "createdAt"`,
      [returnDate, returnedByUser.id, returnedByUser.name, combinedNotes, transactionId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `Pengembalian barang ${trx.item_name} berhasil diverifikasi. Stok laboratorium dipulihkan.`,
      transaction: updatedTrxRes.rows[0],
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error in return transaction:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses pengembalian di basis data.' });
  } finally {
    client.release();
  }
});

export default router;
