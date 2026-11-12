import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { testConnection } from './db.js';

import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import transactionsRouter from './routes/transactions.js';
import usersRouter from './routes/users.js';
import databaseRouter from './routes/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'online',
    system: 'NatlusLab Management API',
    database: dbConnected ? 'PostgreSQL Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/database', databaseRouter);

// Serve static frontend in production if built
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5: use /{*splat} wildcard for SPA fallback
  app.get('/{*splat}', (req: Request, res: Response, next: any) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan internal server.' });
});

app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(` NatlusLab Backend API berjalan di: http://localhost:${PORT}`);
  console.log(`=======================================================`);
  await testConnection();
});

export default app;
