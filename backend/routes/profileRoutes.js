import express from 'express';
import protect from '../middleware/authMiddleware.js';
=======
import multer from 'multer';
import {
  getMe,
  saveProfileData,
  updateProfile,
  getWeightData,
  saveWeight,
  getMembership,
  updateMembership,
  getClients,           // ← Make sure this is imported
  getWeightData,
  uploadProfilePhoto,
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
// Configure multer to store image in memory (for buffer-based upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/me', protect, getMe);
router.post('/save', protect, saveProfileData);
router.put('/update', protect, updateProfile);
router.get('/weight', protect, getWeightData);
router.post('/weight', protect, saveWeight);

// 🆕 Add this route for profile photo upload
router.post('/upload-photo', protect, upload.single('photo'), uploadProfilePhoto);

export default router;
