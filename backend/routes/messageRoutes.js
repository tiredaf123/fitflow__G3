import express from 'express';
import protect from '../middleware/authMiddleware.js'; // Protects normal user
import { getMessages, sendMessage } from '../controllers/userMessageController.js';

const router = express.Router();

router.get('/:trainerId', protect, getMessages);

// Send text message only
router.post('/', protect, sendMessage);

export default router;
