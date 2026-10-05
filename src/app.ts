import express, { Application, Request, Response } from 'express';
import cors from 'cors';

console.log('app.ts is loaded');

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test / Health routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'E-commerce API server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
