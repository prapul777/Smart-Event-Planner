import express from 'express';
import {
  createEvent,
  updateEvent,
  cancelEvent,
  listEvents,
  getEventDetails
} from '../controllers/event.controller';

const router = express.Router();

// Event routes
router.post('/', createEvent);           // Create Event
router.get('/', listEvents);             // List Events (with filters)
router.get('/:id', getEventDetails);     // Get Event Details
router.put('/:id', updateEvent);         // Update Event
router.delete('/:id', cancelEvent);      // Cancel Event

export default router;
