import Stripe from 'stripe';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

// Initialize Stripe with configuration
const stripe = new Stripe('sk_test_51RNPAV4SrJuut3amIkB0ilvG8DWb6NXdlqtsezunuyIAK1giBmYeMFkWbWu63TRCGzMRqiELyBQJjXYl67HLAIsR00eNhe3INZ', {
  apiVersion: '2023-08-16',
  typescript:false
});

/**
 * Check user's membership status
 */
export const checkMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ 
      user: req.user.id,
      status: { $in: ['active', 'trialing'] }
    });

    const hasMembership = membership && 
      new Date(membership.currentPeriodEnd) > new Date();

    res.json({ 
      hasMembership,
      membership: hasMembership ? membership : null
    });
  } catch (err) {
    console.error('Membership check error:', err);
    res.status(500).json({ error: 'Failed to check membership status' });
  }
};

/**
 * Create payment intent for membership purchase
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { planType = 'monthly' } = req.body;

    if (!['monthly', 'annual'].includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    const priceId = planType === 'annual' 
      ? process.env.STRIPE_ANNUAL_PRICE_ID 
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    let customer;
    const user = await User.findById(req.user.id);
    
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() }
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

    res.json({
      clientSecret,
      subscriptionId: subscription.id
    });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: err.message 
    });
  }
};

/**
 * Confirm successful payment and activate membership
 */
export const confirmPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Accept trialing as valid too
    if (!['active', 'trialing'].includes(subscription.status)) {
      return res.status(202).json({
        success: false,
        message: 'Payment is still processing. Please wait or refresh later.'
      });
    }

    const planType = subscription.items.data[0].price.id === process.env.STRIPE_ANNUAL_PRICE_ID 
      ? 'annual' 
      : 'monthly';

    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    const membership = await Membership.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        planType,
        status: subscription.status,
        currentPeriodEnd,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id
      },
      { upsert: true, new: true }
    );

    res.json({ 
      success: true, 
      membership,
      currentPeriodEnd
    });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: err.message 
    });
  }
};

/**
 * Cancel user's subscription
 */
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active'
    });

    if (subscriptions.data.length === 0) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const subscription = subscriptions.data[0];
    
    // Cancel subscription at period end
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.id,
      { cancel_at_period_end: true }
    );

    // Update membership status
    await Membership.findOneAndUpdate(
      { user: req.user.id },
      { 
        status: 'canceled',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: new Date(canceledSubscription.current_period_end * 1000)
      }
    );

    res.json({ 
      success: true,
      message: 'Subscription will cancel at period end',
      cancelAt: new Date(canceledSubscription.current_period_end * 1000)
    });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

/**
 * Update payment method
 */
export const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No customer record found' });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.json({ success: true, message: 'Payment method updated' });
  } catch (err) {
    console.error('Update payment method error:', err);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
};

/**
 * Get user's invoices
 */
export const getInvoices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10
    });

    res.json({ invoices: invoices.data });
  } catch (err) {
    console.error('Get invoices error:', err);
    res.status(500).json({ error: 'Failed to get invoices' });
  }
};

/**
 * Get specific invoice
 */
export const getInvoice = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const invoice = await stripe.invoices.retrieve(req.params.id);

    if (invoice.customer !== user.stripeCustomerId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ invoice });
  } catch (err) {
    console.error('Get invoice error:', err);
    res.status(500).json({ error: 'Failed to get invoice' });
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handleSubscriptionPayment(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Helper functions for webhook events
async function handlePaymentSuccess(paymentIntent) {
  const userId = paymentIntent.metadata.userId;
  await Membership.findOneAndUpdate(
    { user: userId },
    { status: 'active' },
    { upsert: true }
  );
  console.log(`Payment succeeded for user ${userId}`);
}

async function handleSubscriptionPayment(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const customerId = subscription.customer;
  
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await Membership.findOneAndUpdate(
    { user: user._id },
    {
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: 'active'
    }
  );
  console.log(`Subscription payment processed for user ${user._id}`);
}

async function handlePaymentFailure(invoice) {
  const customerId = invoice.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await Membership.findOneAndUpdate(
    { user: user._id },
    { status: 'past_due' }
  );
  console.log(`Payment failed for user ${user._id}`);
}

async function handleSubscriptionCancelled(subscription) {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await Membership.findOneAndUpdate(
    { user: user._id },
    { 
      status: 'canceled',
      canceledAt: new Date() 
    }
  );
  console.log(`Subscription cancelled for user ${user._id}`);
}
