import express from 'express';
import { getStreakInfo } from '../controllers/userController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET /api/users/streak — returns login streak info for logged-in user
router.get('/streak', verifyToken, getStreakInfo);

export default router;
