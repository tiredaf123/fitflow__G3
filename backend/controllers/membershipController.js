import Stripe from 'stripe';
import Membership from '../models/Membership.js';
import User from '../models/User.js';

// Initialize Stripe with configuration
const stripe = new Stripe('sk_test_51RNPAV4SrJuut3amIkB0ilvG8DWb6NXdlqtsezunuyIAK1giBmYeMFkWbWu63TRCGzMRqiELyBQJjXYl67HLAIsR00eNhe3INZ', {
  apiVersion: '2023-08-16',
  typescript:false
});



export const checkMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user.id,
      status: { $in: ['active', 'trialing'] },
    });

    const hasMembership = membership && new Date(membership.currentPeriodEnd) > new Date();

    res.json({
      hasMembership,
      membershipDeadline: hasMembership ? membership.currentPeriodEnd : null,
    });
  } catch (err) {
    console.error('Membership check error:', err);
    res.status(500).json({ error: 'Failed to check membership status' });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { planType = 'monthly' } = req.body;
    const priceId = planType === 'annual' ? process.env.STRIPE_ANNUAL_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) return res.status(400).json({ error: 'Stripe price ID is missing.' });

    const user = await User.findById(req.user.id);
    let customer;

    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
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
    res.json({ clientSecret, subscriptionId: subscription.id });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!['active', 'trialing'].includes(subscription.status)) {
      return res.status(202).json({ success: false, message: 'Payment is still processing. Please refresh later.' });
    }

    const planType = subscription.items.data[0].price.id === process.env.STRIPE_ANNUAL_PRICE_ID ? 'annual' : 'monthly';
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    const membership = await Membership.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        planType,
        status: subscription.status,
        currentPeriodEnd,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, membership, currentPeriodEnd });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user.id,
      status: { $in: ['active', 'trialing'] },
    });

    if (!membership) {
      return res.status(400).json({
        success: false,
        message: 'No active membership found to cancel.',
      });
    }

    // Cancel the subscription immediately
    const cancelledSub = await stripe.subscriptions.cancel(membership.stripeSubscriptionId);

    await Membership.findOneAndUpdate(
      { _id: membership._id },
      {
        status: 'canceled',
        cancelAtPeriodEnd: false,
        canceledAt: new Date(),
        currentPeriodEnd: new Date(), // end access now
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Membership cancelled immediately.',
    });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel membership' });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
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
      console.log(`Unhandled event: ${event.type}`);
  }

  res.json({ received: true });
};

async function handlePaymentSuccess(paymentIntent) {
  const userId = paymentIntent.metadata.userId;
  await Membership.findOneAndUpdate(
    { user: userId },
    { status: 'active' },
    { upsert: true }
  );
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
      status: 'active',
    }
  );
}

async function handlePaymentFailure(invoice) {
  const customerId = invoice.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await Membership.findOneAndUpdate(
    { user: user._id },
    { status: 'past_due' }
  );
}

async function handleSubscriptionCancelled(subscription) {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) return;

  await Membership.findOneAndUpdate(
    { user: user._id },
    {
      status: 'canceled',
      canceledAt: new Date(),
      currentPeriodEnd: new Date(),
    }
  );
}
