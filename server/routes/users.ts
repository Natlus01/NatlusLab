import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// GET all users
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT 
        id, 
        username, 
        name, 
        role, 
        is_active AS "isActive", 
        created_at AS "createdAt" 
      FROM users 
      ORDER BY created_at ASC`
    );
    res.json({ success: true, users: result.rows });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data staf dari basis data.' });
  }
});

// POST new user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name, role, isActive } = req.body;

    if (!username || !password || !name || !role) {
      res.status(400).json({ success: false, message: 'Data akun tidak lengkap.' });
      return;
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE LOWER(username) = $1', [cleanUsername]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, message: 'Username sudah digunakan oleh akun lain.' });
      return;
    }

    const userId = `usr-${Date.now()}`;
    const result = await query(
      `INSERT INTO users (id, username, password, name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING 
         id, 
         username, 
         name, 
         role, 
         is_active AS "isActive", 
         created_at AS "createdAt"`,
      [userId, cleanUsername, password.trim(), name.trim(), role, isActive !== false]
    );

    res.status(201).json({
      success: true,
      message: 'Akun staf berhasil ditambahkan ke basis data.',
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat akun staf di basis data.' });
  }
});

// PUT update user
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, password, name, role, isActive } = req.body;

    const userRes = await query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      return;
    }

    const current = userRes.rows[0];
    const newUsername = username ? username.trim().toLowerCase() : current.username;

    if (newUsername !== current.username) {
      const dup = await query('SELECT id FROM users WHERE LOWER(username) = $1 AND id <> $2', [newUsername, id]);
      if (dup.rows.length > 0) {
        res.status(409).json({ success: false, message: 'Username sudah digunakan oleh akun lain.' });
        return;
      }
    }

    const newPassword = password ? password.trim() : current.password;
    const newName = name ? name.trim() : current.name;
    const newRole = role || current.role;
    const newActive = isActive !== undefined ? Boolean(isActive) : current.is_active;

    const result = await query(
      `UPDATE users 
       SET username = $1, password = $2, name = $3, role = $4, is_active = $5 
       WHERE id = $6
       RETURNING 
         id, 
         username, 
         name, 
         role, 
         is_active AS "isActive", 
         created_at AS "createdAt"`,
      [newUsername, newPassword, newName, newRole, newActive, id]
    );

    res.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna di basis data.' });
  }
});

// PATCH toggle status
router.patch('/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const userRes = await query('SELECT id, is_active FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      return;
    }

    const currentActive = userRes.rows[0].is_active;
    const newActive = !currentActive;

    const result = await query(
      `UPDATE users 
       SET is_active = $1 
       WHERE id = $2
       RETURNING 
         id, 
         username, 
         name, 
         role, 
         is_active AS "isActive", 
         created_at AS "createdAt"`,
      [newActive, id]
    );

    res.json({
      success: true,
      message: `Status akun staf diubah menjadi ${newActive ? 'AKTIF' : 'NONAKTIF'}.`,
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah status staf di basis data.' });
  }
});

export default router;
