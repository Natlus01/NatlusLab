import { Router, Request, Response } from 'express';
import { query } from '../db.js';

const router = Router();

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
      return;
    }

    const result = await query(
      'SELECT id, username, password, name, role, is_active as "isActive", created_at as "createdAt" FROM users WHERE LOWER(username) = LOWER($1)',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: 'Username atau password salah.' });
      return;
    }

    const user = result.rows[0];

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Akun ini dinonaktifkan oleh Administrator. Hubungi admin untuk pengaktifan kembali.',
      });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ success: false, message: 'Username atau password salah.' });
      return;
    }

    const { password: _, ...userSafe } = user;
    res.json({
      success: true,
      message: 'Login berhasil.',
      user: userSafe,
    });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server database.' });
  }
});

export default router;
