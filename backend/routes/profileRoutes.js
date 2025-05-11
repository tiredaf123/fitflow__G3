import express from 'express';
import multer from 'multer';
import {
  getMe,
  saveProfileData,
  updateProfile,
  saveWeight,
  getWeightData,
  uploadProfilePhoto,
} from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

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