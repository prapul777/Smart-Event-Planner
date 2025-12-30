import { Request, Response } from 'express';
import pool from '../config/db';
import path from 'path';

// Create Event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizer_id, name, description, venue, date_time, category, capacity } = req.body;
    // if file uploaded (multer), available as req.file
    const file = (req as any).file;
    const imagePath = file ? path.join('uploads', file.filename) : null;

    // Validation
    if (!organizer_id || !name || !venue || !date_time || !category || !capacity) {
      res.status(400).json({ error: 'All required fields must be provided' });
      return;
    }

    if (capacity <= 0) {
      res.status(400).json({ error: 'Capacity must be greater than 0' });
      return;
    }

    const [result] = await pool.execute(
      'INSERT INTO events (organizer_id, name, description, venue, date_time, category, capacity, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [organizer_id, name, description || null, venue, date_time, category, capacity, imagePath]
    );

    const insertResult = result as any;
    res.status(201).json({
      id: insertResult.insertId,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Update Event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, venue, date_time, category, capacity } = req.body;
    const file = (req as any).file;
    const imagePath = file ? path.join('uploads', file.filename) : undefined;

    // Check if event exists
    const [events] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);
    const eventArray = events as any[];

    if (eventArray.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Validation
    if (capacity !== undefined && capacity <= 0) {
      res.status(400).json({ error: 'Capacity must be greater than 0' });
      return;
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (venue !== undefined) {
      updates.push('venue = ?');
      values.push(venue);
    }
    if (date_time !== undefined) {
      updates.push('date_time = ?');
      values.push(date_time);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(capacity);
    }
    if (imagePath !== undefined) {
      updates.push('image_path = ?');
      values.push(imagePath);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    values.push(id);
    await pool.execute(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// Cancel Event (delete event - bookings will be cascade deleted)
export const cancelEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if event exists
    const [events] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);
    const eventArray = events as any[];

    if (eventArray.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Delete the event (bookings will be automatically deleted due to CASCADE)
    await pool.execute('DELETE FROM events WHERE id = ?', [id]);

    res.json({ message: 'Event cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling event:', error);
    res.status(500).json({ error: 'Failed to cancel event' });
  }
};

// List Events (with filters)
export const listEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, organizer_id, upcoming, venue, startDate, endDate } = req.query;

    let query = `
      SELECT 
        e.*,
        COALESCE(SUM(b.tickets_booked), 0) as tickets_sold,
        (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_seats
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Apply filters
    if (category && category !== '') {
      query += ' AND e.category = ?';
      params.push(category);
    }

    if (organizer_id && organizer_id !== '') {
      query += ' AND e.organizer_id = ?';
      params.push(organizer_id);
    }

    if (venue && venue !== '') {
      query += ' AND e.venue LIKE ?';
      params.push(`%${venue}%`);
    }

    if (startDate && startDate !== '') {
      query += ' AND DATE(e.date_time) >= ?';
      params.push(startDate);
    }

    if (endDate && endDate !== '') {
      query += ' AND DATE(e.date_time) <= ?';
      params.push(endDate);
    }

    if (upcoming === 'true') {
      query += ' AND e.date_time > NOW()';
    }

    query += ' GROUP BY e.id ORDER BY e.date_time ASC';

    const [events] = await pool.execute(query, params);
    res.json(events);
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get Event Details (with available seats)
export const getEventDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [events] = await pool.execute(
      `SELECT 
        e.*,
        COALESCE(SUM(b.tickets_booked), 0) as tickets_sold,
        (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_seats
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.id = ?
      GROUP BY e.id`,
      [id]
    );

    const eventArray = events as any[];

    if (eventArray.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(eventArray[0]);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
};
