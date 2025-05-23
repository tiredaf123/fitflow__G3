// --- routes/membershipRoutes.js ---
import express from 'express';
import {
  checkMembership,
  createPaymentIntent,
  confirmPayment,
  cancelSubscription
  ,handleWebhook,
} from '../controllers/membershipController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook route (no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Authenticated membership routes
router.use(protect);
router.get('/check', checkMembership);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.post('/cancel',cancelSubscription );

export default router;
