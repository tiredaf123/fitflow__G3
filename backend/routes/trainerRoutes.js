import express from 'express';
import {
  getAllTrainers,
  getPublicTrainers,
  updateTrainer,
  deleteTrainer,
  loginTrainer,
  getMyTrainerProfile,
  createTrainer,
} from '../controllers/trainerController.js';

import protect from '../middleware/authMiddleware.js';         // For admin or user
import protectTrainer from '../middleware/protectTrainer.js'; // For trainer JWTs
import isAdmin from '../middleware/isAdmin.js';
import upload from '../middleware/multer.js';                 // Assuming you use multer for image upload

const router = express.Router();

// ✅ Public route to view all available trainers
router.get('/public', getPublicTrainers);

// ✅ Trainer login
router.post('/login', loginTrainer);

// ✅ Logged-in trainer profile
router.get('/me', protectTrainer, getMyTrainerProfile);

// ✅ Admin-only routes
router.post('/', protect, isAdmin, upload.single('image'), createTrainer);
router.get('/', protect, isAdmin, getAllTrainers);
router.put('/:id', protect, isAdmin, updateTrainer);
router.delete('/:id', protect, isAdmin, deleteTrainer);

export default router;
