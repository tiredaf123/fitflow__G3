
import express from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.post('/logout', protect, logout); // ⬅️ requires token
router.get('/me', protect, getCurrentUser); // ⬅️ for profile info based on token


export default router;
