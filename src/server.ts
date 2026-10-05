import dotenv from 'dotenv';

// Load environment variables before loading app or other modules
dotenv.config();

console.log('server.ts is loaded');

import app from './app';
import { testDbConnection } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  // Test database connection
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
