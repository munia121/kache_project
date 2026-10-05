import { Pool, PoolConfig, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'ecommerce_db',
    };

export const pool = new Pool(poolConfig);

// Helper function to test database connectivity
export const testDbConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (error: any) {
    console.warn('Database connection warning:', error.message);
  }
};

// Helper function to execute SQL queries
export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

export default pool;
