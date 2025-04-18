import express from 'express';
import {
  getMe,
  saveProfileData,
  updateProfile,
  saveWeight,
  getWeightData
} from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/save', protect, saveProfileData);
router.put('/update', protect, updateProfile);
router.get('/weight', protect, getWeightData);  // ✅ fetch weight history + current
router.post('/weight', protect, saveWeight);    // ✅ save new weight

export default router;
