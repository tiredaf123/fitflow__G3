import express from 'express';
import {
  createTrainer,
  getAllTrainers,
  getPublicTrainers,
  updateTrainer,
  deleteTrainer,
  loginTrainer,
} from '../controllers/trainerController.js';

import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route to get trainers for users
router.get('/public', getPublicTrainers);

// Login route (public)
router.post('/login', loginTrainer);

// Admin-only routes
router.post('/', protect, isAdmin, upload.single('image'), createTrainer);
router.get('/', protect, isAdmin, getAllTrainers);
router.put('/:id', protect, isAdmin, updateTrainer);
router.delete('/:id', protect, isAdmin, deleteTrainer);

export default router;
