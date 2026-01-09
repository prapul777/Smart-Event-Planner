import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const SALT_ROUNDS = 10;

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email and password are required' });
      return;
    }

    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    const existing = (rows as any[]);
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role || 'ATTENDEE']
    );

    const insertResult = result as any;
    res.status(201).json({ id: insertResult.insertId, message: 'User registered' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const users = (rows as any[]);

    if (users.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export default { registerUser, loginUser };
