import express, { Request } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import {
  createEvent,
  updateEvent,
  cancelEvent,
  listEvents,
  getEventDetails
} from '../controllers/event.controller';

import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (_req: Request, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post(
  '/',
  authenticateJWT,
  authorizeRole('ORGANIZER', 'ADMIN'),
  upload.single('image'),
  createEvent
);

router.get('/', listEvents);

router.get('/:id', getEventDetails);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRole('ORGANIZER', 'ADMIN'),
  upload.single('image'),
  updateEvent
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole('ORGANIZER', 'ADMIN'),
  cancelEvent
);

export default router;
