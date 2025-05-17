import express from 'express';
import {
  getUserBookings,
  createBooking,
  getTrainerBookings,
  cancelBooking,
} from '../controllers/bookingController.js';

import protect from '../middleware/authMiddleware.js';          // For logged-in users
import protectTrainer from '../middleware/protectTrainer.js';  // ✅ For logged-in trainers

const router = express.Router();

// ✅ Get bookings for logged-in user (future and past)
router.get('/user', protect, getUserBookings);

// ✅ Create a new booking (user)
router.post('/', protect, createBooking);

// ✅ Get bookings for logged-in trainer (upcoming and past)
router.get('/trainer', protectTrainer, getTrainerBookings);

// ✅ Cancel a booking by ID (trainer or user)
// You can enhance this by checking role in controller if needed
router.delete('/:bookingId', protect, cancelBooking);

export default router;
