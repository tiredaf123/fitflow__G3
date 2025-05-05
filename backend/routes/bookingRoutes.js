import express from 'express';
import { getUserBookings, createBooking } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', authMiddleware, getUserBookings);
router.post('/', authMiddleware, createBooking);

export default router;
