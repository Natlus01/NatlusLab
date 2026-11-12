import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5433,
        database: process.env.DB_NAME || 'natluslab_db',
        user: process.env.DB_USER || 'natluslab_user',
        password: process.env.DB_PASSWORD || 'natluslab_password',
      }
);

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const getClient = () => pool.connect();

export async function testConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW() as now');
    console.log('[PostgreSQL] Database connected successfully at:', res.rows[0].now);
    return true;
  } catch (err: any) {
    console.error('[PostgreSQL] Database connection failed:', err.message);
    return false;
  }
}
