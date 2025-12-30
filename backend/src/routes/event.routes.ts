import express from 'express';
import {
  createEvent,
  updateEvent,
  cancelEvent,
  listEvents,
  getEventDetails
} from '../controllers/event.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/');
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Event routes
router.post('/', authenticateJWT, authorizeRole('ORGANIZER','ADMIN'), upload.single('image'), createEvent);           // Create Event (organizer/admin only)
router.get('/', listEvents);             // List Events (with filters)
router.get('/:id', getEventDetails);     // Get Event Details
router.put('/:id', authenticateJWT, authorizeRole('ORGANIZER','ADMIN'), upload.single('image'), updateEvent);         // Update Event (organizer/admin only)
router.delete('/:id', authenticateJWT, authorizeRole('ORGANIZER','ADMIN'), cancelEvent);      // Cancel Event (organizer/admin only)

export default router;
