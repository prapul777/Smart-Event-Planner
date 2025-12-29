import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;
