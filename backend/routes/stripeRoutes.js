import express from 'express';
import Stripe from 'stripe';
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook event processors
const eventHandlers = {
  'checkout.session.completed': async (session) => {
    console.log('✅ Checkout session completed:', session.id);
    // Handle one-time payments or initial subscription setup
    if (session.mode === 'subscription') {
      await handleSubscriptionCreated(session.subscription);
    }
  },

  'invoice.paid': async (invoice) => {
    console.log('💸 Invoice paid:', invoice.id);
    await handleSubscriptionPayment(invoice);
  },

  'invoice.payment_failed': async (invoice) => {
    console.warn('⚠️ Invoice payment failed:', invoice.id);
    await handlePaymentFailure(invoice);
  },

  'customer.subscription.updated': async (subscription) => {
    console.log('🔄 Subscription updated:', subscription.id);
    await handleSubscriptionUpdate(subscription);
  },

  'customer.subscription.deleted': async (subscription) => {
    console.log('🗑️ Subscription deleted:', subscription.id);
    await handleSubscriptionCancellation(subscription);
  }
};

// Main webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`🔔 Received event: ${event.type}`);
    
    if (eventHandlers[event.type]) {
      await eventHandlers[event.type](event.data.object);
    } else {
      console.log(`🤷 Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Business Logic Handlers
async function handleSubscriptionCreated(subscriptionId) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = subscription.customer;
  
  // Get or create user based on customer ID
  const membership = await Membership.findOneAndUpdate(
    { stripeCustomerId: customerId },
    {
      stripeSubscriptionId: subscription.id,
      status: 'active',
      planType: getPlanType(subscription.items.data[0].price.id),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      paymentStatus: 'paid'
    },
    { upsert: true, new: true }
  );

  // Send welcome email
  const user = await User.findById(membership.user);
  if (user) {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Premium Membership!',
      template: 'welcome-premium',
      context: {
        name: user.name,
        plan: membership.planType,
        renewalDate: membership.currentPeriodEnd.toDateString()
      }
    });
  }
}

async function handleSubscriptionPayment(invoice) {
  const subscriptionId = invoice.subscription;
  const paymentIntent = invoice.payment_intent;
  
  await Membership.findOneAndUpdate(
    { stripeSubscriptionId: subscriptionId },
    {
      lastPaymentDate: new Date(),
      currentPeriodEnd: new Date(invoice.period_end * 1000),
      paymentStatus: 'paid',
      $push: {
        paymentHistory: {
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          invoiceId: invoice.id,
          invoiceUrl: invoice.hosted_invoice_url,
          date: new Date()
        }
      }
    }
  );

  console.log(`💰 Recorded payment for subscription ${subscriptionId}`);
}

async function handlePaymentFailure(invoice) {
  const subscriptionId = invoice.subscription;
  
  await Membership.findOneAndUpdate(
    { stripeSubscriptionId: subscriptionId },
    {
      paymentStatus: 'failed',
      lastFailureDate: new Date(),
      $inc: { paymentFailures: 1 }
    }
  );

  // Notify user
  const membership = await Membership.findOne({ stripeSubscriptionId: subscriptionId });
  if (membership) {
    const user = await User.findById(membership.user);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Payment Failed for Your Membership',
        template: 'payment-failed',
        context: {
          name: user.name,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          retryUrl: invoice.hosted_invoice_url
        }
      });
    }
  }
}

async function handleSubscriptionUpdate(subscription) {
  await Membership.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  );
}

async function handleSubscriptionCancellation(subscription) {
  await Membership.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    {
      status: 'canceled',
      canceledAt: new Date(),
      cancelReason: subscription.cancellation_details?.reason || 'unknown'
    }
  );
}

// Helper function
function getPlanType(priceId) {
  if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) return 'monthly';
  if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) return 'annual';
  return 'custom';
}

export default router;