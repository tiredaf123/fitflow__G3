// routes/profileRoutes.js

import express from 'express';
import {
  getMe,
  saveProfileData,
  updateProfile,
  saveWeight,
  getWeightData,
  getMembership,
  updateMembership  // Ensure correct import
} from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile routes
router.get('/me', protect, getMe);
router.post('/save', protect, saveProfileData);
router.put('/update', protect, updateProfile);

// Weight-related routes
router.get('/weight', protect, getWeightData);  // ✅ fetch weight history + current
router.post('/weight', protect, saveWeight);    // ✅ save new weight

// Membership-related routes
router.get('/membership', protect, getMembership);   // ✅ fetch membership deadline
router.put('/membership', protect, updateMembership); // ✅ update membership deadline

export default router;
