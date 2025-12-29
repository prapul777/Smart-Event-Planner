import express from 'express';
import {
  bookTickets,
  getBookingsByEvent,
  getBookingConfirmation
} from '../controllers/booking.controller';

const router = express.Router();

// Booking routes
router.post('/', bookTickets);                    // Book Tickets
router.get('/event/:event_id', getBookingsByEvent); // View bookings for an event
router.get('/:id', getBookingConfirmation);        // Get booking confirmation

export default router;
