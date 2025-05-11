import express from 'express';
import {
  checkMembership,
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  cancelSubscription,
  updatePaymentMethod,
  getInvoices,
  getInvoice
} from '../controllers/membershipController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook handler (no auth needed)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Authenticated routes
router.use(protect);

// Membership status
router.get('/check', checkMembership);

// Payment flow
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);

// Subscription management
router.post('/cancel', cancelSubscription);
router.put('/payment-method', updatePaymentMethod);

// Billing history
router.get('/invoices', getInvoices);
router.get('/invoice/:id', getInvoice);


export {
  router as default,
  handleWebhook
};