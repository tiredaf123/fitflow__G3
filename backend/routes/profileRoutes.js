import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getMe,
  saveProfileData,
  updateProfile,
  getWeightData,
  saveWeight,
  getMembership,
  updateMembership,
  getClients,           // ← Make sure this is imported
} from '../controllers/profileController.js';

const router = express.Router();

// Profile endpoints
router.get('/me', protect, getMe);
router.post('/save', protect, saveProfileData);
router.put('/update', protect, updateProfile);

// Weight endpoints
router.get('/weight', protect, getWeightData);
router.post('/weight', protect, saveWeight);

// Membership endpoints
router.get('/membership', protect, getMembership);
router.put('/membership', protect, updateMembership);

// ——— NEW ———
// Clients for TrainerDashboard
router.get('/clients', protect, getClients);

export default router;
