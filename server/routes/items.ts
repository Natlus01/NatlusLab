import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET all items
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT 
        id, 
        code, 
        name, 
        category, 
        stock, 
        total_stock AS "totalStock", 
        borrowed_count AS "borrowedCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt" 
      FROM items 
      ORDER BY code ASC`
    );
    res.json({ success: true, items: result.rows });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data barang dari basis data.' });
  }
});

// POST new item
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, category, stock, totalStock } = req.body;

    if (!code || !name || !category) {
      res.status(400).json({ success: false, message: 'Kode, nama, dan kategori barang wajib diisi.' });
      return;
    }

    const initialStock = Number(stock ?? totalStock ?? 0);
    const initialTotal = Number(totalStock ?? stock ?? 0);

    if (initialStock < 0 || initialTotal < 0 || initialStock > initialTotal) {
      res.status(400).json({ success: false, message: 'Stok tersedia tidak boleh melebihi total unit aset.' });
      return;
    }

    // Check duplicate code
    const existing = await query('SELECT id FROM items WHERE LOWER(code) = LOWER($1)', [code.trim()]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, message: 'Kode barang sudah terdaftar di sistem.' });
      return;
    }

    const newItemId = `item-${Date.now()}`;
    const result = await query(
      `INSERT INTO items (id, code, name, category, stock, total_stock, borrowed_count)
       VALUES ($1, $2, $3, $4, $5, $6, 0)
       RETURNING 
         id, 
         code, 
         name, 
         category, 
         stock, 
         total_stock AS "totalStock", 
         borrowed_count AS "borrowedCount", 
         created_at AS "createdAt", 
         updated_at AS "updatedAt"`,
      [newItemId, code.trim().toUpperCase(), name.trim(), category.trim(), initialStock, initialTotal]
    );

    res.status(201).json({
      success: true,
      message: 'Barang berhasil ditambahkan ke inventaris.',
      item: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error adding item:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan barang ke basis data.' });
  }
});

// PUT update item
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, name, category, stock, totalStock } = req.body;

    const currentItemRes = await query('SELECT * FROM items WHERE id = $1', [id]);
    if (currentItemRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Data barang tidak ditemukan.' });
      return;
    }

    const current = currentItemRes.rows[0];

    // Check code duplication
    if (code && code.trim().toUpperCase() !== current.code) {
      const dup = await query('SELECT id FROM items WHERE LOWER(code) = LOWER($1) AND id <> $2', [code.trim(), id]);
      if (dup.rows.length > 0) {
        res.status(409).json({ success: false, message: 'Kode barang sudah digunakan oleh item lain.' });
        return;
      }
    }

    const newCode = code ? code.trim().toUpperCase() : current.code;
    const newName = name ? name.trim() : current.name;
    const newCategory = category ? category.trim() : current.category;
    const newStock = stock !== undefined ? Number(stock) : current.stock;
    const newTotalStock = totalStock !== undefined ? Number(totalStock) : current.total_stock;

    if (newStock < 0 || newTotalStock < 0 || newStock > newTotalStock) {
      res.status(400).json({ success: false, message: 'Stok tersedia tidak valid (tidak boleh lebih dari total aset).' });
      return;
    }

    const result = await query(
      `UPDATE items 
       SET code = $1, name = $2, category = $3, stock = $4, total_stock = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING 
         id, 
         code, 
         name, 
         category, 
         stock, 
         total_stock AS "totalStock", 
         borrowed_count AS "borrowedCount", 
         created_at AS "createdAt", 
         updated_at AS "updatedAt"`,
      [newCode, newName, newCategory, newStock, newTotalStock, id]
    );

    res.json({
      success: true,
      message: 'Data barang berhasil diperbarui.',
      item: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui barang di basis data.' });
  }
});

// DELETE item
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const currentItemRes = await query('SELECT * FROM items WHERE id = $1', [id]);
    if (currentItemRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Data barang tidak ditemukan.' });
      return;
    }

    const current = currentItemRes.rows[0];
    if (current.borrowed_count > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus barang. Masih ada ${current.borrowed_count} unit yang sedang dipinjam aktif.`,
      });
      return;
    }

    // Check if there are active transactions
    const activeTrx = await query(
      "SELECT id FROM transactions WHERE item_id = $1 AND status = 'DIPINJAM'",
      [id]
    );
    if (activeTrx.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus barang yang masih memiliki transaksi peminjaman aktif.',
      });
      return;
    }

    await query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ success: true, message: 'Barang berhasil dihapus dari sistem.' });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus barang (terdapat relasi data pada transaksi sebelumnya).',
    });
  }
});

export default router;
