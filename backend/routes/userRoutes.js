import express from 'express';
import { getStreakInfo } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/streak',protect, getStreakInfo);

export default router;
//Adharsh Sapkota