import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import authRoutes from './routes/auth.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files (FIXED PATH)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;
