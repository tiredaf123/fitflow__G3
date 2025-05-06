import express from 'express';
import {
  getAllTrainers,
  createTrainer,
  deleteTrainer
} from '../controllers/trainerController.js';

import verifyToken from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// ✅ Public access for logged-in users
router.get('/', getAllTrainers);

// ✅ Admin-only for creating and deleting
router.post('/', verifyToken, isAdmin, createTrainer);
router.delete('/:id', verifyToken, isAdmin, deleteTrainer);

export default router;
