import express from 'express';
import multer from 'multer';
import {
  getSupplements,
  createSupplement,
  updateSupplement,
  deleteSupplement,
} from '../controllers/supplementController.js';

import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.get('/', protect, getSupplements);

// Admin-only routes with image upload
router.post('/', protect, isAdmin, upload.single('image'), createSupplement);
router.put('/:id', protect, isAdmin, upload.single('image'), updateSupplement);
router.delete('/:id', protect, isAdmin, deleteSupplement);

export default router;
