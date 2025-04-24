// trainerRoutes.js
import express from 'express';
import {
  createTrainer,
  getAllTrainers,
  updateTrainer,
  deleteTrainer,
  loginTrainer, // ✅ NEW
} from '../controllers/trainerController.js';

import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Trainer login (no auth needed)
router.post('/login', loginTrainer); // ✅ NEW public route

// Admin-only routes
router.post('/', protect, isAdmin, upload.single('image'), createTrainer);
router.get('/', protect, isAdmin, getAllTrainers);
router.put('/:id', protect, isAdmin, updateTrainer);
router.delete('/:id', protect, isAdmin, deleteTrainer);

export default router;
