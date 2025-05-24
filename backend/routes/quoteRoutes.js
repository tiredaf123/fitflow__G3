import express from 'express';
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdmin.js';
import {
  createQuote,
  deleteQuote,
  getQuote,
  updateQuote,
} from '../controllers/quoteController.js';

const router = express.Router();

router.get('/', getQuote); // Public
router.post('/', protect, isAdmin, createQuote); // Admin: Add new quote
router.put('/:id', protect, isAdmin, updateQuote); // Admin: Update quote
router.delete('/:id', protect, isAdmin, deleteQuote); // Admin: Delete quote

export default router;