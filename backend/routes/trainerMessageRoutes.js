import express from 'express';
import { getMessagesWithUser, sendTrainerMessage } from '../controllers/trainerMessageController.js';
import protectTrainer from '../middleware/protectTrainer.js';

const router = express.Router();

router.get('/user/:userId', protectTrainer, getMessagesWithUser);
router.post('/', protectTrainer, sendTrainerMessage);

export default router;
