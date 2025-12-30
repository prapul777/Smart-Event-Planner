import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = express.Router();

// Optional register endpoint (useful for seeding/testing)
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

export default router;
