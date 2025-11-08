import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth';
import itemRoutes from './api/items';
import locationRoutes from './api/locations';
import categoryRoutes from './api/categories';
import userRoutes from './api/users';
import borrowingRoutes from './api/borrowings';
import profileRoutes from './api/profile';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/profile', profileRoutes);


// Health Check
app.get('/', (req: Request, res: Response) => {
  res.send('Inventory Management API is running!');
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
