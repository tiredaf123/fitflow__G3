import express from 'express';
import {
  createTrainer,
  getAllTrainers,
  getPublicTrainers,
  updateTrainer,
  deleteTrainer,
  loginTrainer,
  getMyTrainerProfile,
} from '../controllers/trainerController.js';

import protect from '../middleware/authMiddleware.js';          // For admin or user
import protectTrainer from '../middleware/protectTrainer.js';  // ✅ For trainers
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ✅ Public route for users to browse trainers
router.get('/public', getPublicTrainers);

// ✅ Trainer login
router.post('/login', loginTrainer);

// ✅ Logged-in trainer profile (self)
router.get('/me', protectTrainer, getMyTrainerProfile);

// ✅ Admin-only routes
router.post('/', protect, isAdmin, upload.single('image'), createTrainer);
router.get('/', protect, isAdmin, getAllTrainers);
router.put('/:id', protect, isAdmin, updateTrainer);
router.delete('/:id', protect, isAdmin, deleteTrainer);

export default router;
//Adharsh Sapkota