import express from 'express';
import {
  signup,
  login,
  getCurrentUser,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);
router.patch('/update-profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
