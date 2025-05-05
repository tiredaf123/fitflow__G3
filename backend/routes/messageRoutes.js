// messageRoutes.js
import express from 'express';
import { getMessages, sendMessage, sendImageMessage } from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/:trainerId', protect, getMessages);
router.post('/', protect, sendMessage);
router.post('/image', protect, upload.single('image'), sendImageMessage); // ← New route

export default router;
