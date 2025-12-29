import { Request, Response } from 'express';
import pool from '../config/db';

// Book Tickets
export const bookTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, attendee_id, tickets_booked, total_price } = req.body;

    // Validation
    if (!event_id || !attendee_id || !tickets_booked || total_price === undefined) {
      res.status(400).json({ error: 'All required fields must be provided' });
      return;
    }

    if (tickets_booked <= 0) {
      res.status(400).json({ error: 'Tickets booked must be greater than 0' });
      return;
    }

    // Get event details and available seats
    const [events] = await pool.execute(
      `SELECT 
        e.*,
        COALESCE(SUM(b.tickets_booked), 0) as tickets_sold,
        (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_seats
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.id = ?
      GROUP BY e.id`,
      [event_id]
    );

    const eventArray = events as any[];

    if (eventArray.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    const event = eventArray[0];
    const availableSeats = parseInt(event.available_seats);

    // Check capacity
    if (tickets_booked > availableSeats) {
      res.status(400).json({ 
        error: `Not enough seats available. Available: ${availableSeats}, Requested: ${tickets_booked}` 
      });
      return;
    }

    // Create booking
    const [result] = await pool.execute(
      'INSERT INTO bookings (event_id, attendee_id, tickets_booked, total_price) VALUES (?, ?, ?, ?)',
      [event_id, attendee_id, tickets_booked, total_price]
    );

    const insertResult = result as any;
    res.status(201).json({
      id: insertResult.insertId,
      message: 'Tickets booked successfully'
    });
  } catch (error) {
    console.error('Error booking tickets:', error);
    res.status(500).json({ error: 'Failed to book tickets' });
  }
};

// View bookings for an event
export const getBookingsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id } = req.params;

    // Check if event exists
    const [events] = await pool.execute('SELECT * FROM events WHERE id = ?', [event_id]);
    const eventArray = events as any[];

    if (eventArray.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Get all bookings for the event
    const [bookings] = await pool.execute(
      'SELECT * FROM bookings WHERE event_id = ? ORDER BY booking_time DESC',
      [event_id]
    );

    // Calculate summary
    const [summary] = await pool.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(tickets_booked) as total_tickets_sold,
        SUM(total_price) as total_revenue
      FROM bookings
      WHERE event_id = ?`,
      [event_id]
    );

    const summaryArray = summary as any[];
    res.json({
      bookings,
      summary: summaryArray[0]
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// Get booking confirmation by booking ID
export const getBookingConfirmation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.execute(
      `SELECT 
        b.*,
        e.name as event_name,
        e.venue,
        e.date_time,
        e.category
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ?`,
      [id]
    );

    const bookingArray = bookings as any[];

    if (bookingArray.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(bookingArray[0]);
  } catch (error) {
    console.error('Error fetching booking confirmation:', error);
    res.status(500).json({ error: 'Failed to fetch booking confirmation' });
  }
};
