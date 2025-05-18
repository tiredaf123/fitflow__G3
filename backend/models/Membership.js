
import mongoose from 'mongoose';
const membershipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  status: { 
    type: String, 
    enum: ['active', 'canceled', 'past_due', 'incomplete'], 
    default: 'incomplete' 
  },
  currentPeriodEnd: Date,
  createdAt: { type: Date, default: Date.now },
  planType: { type: String, enum: ['monthly', 'annual'], default: 'monthly' }
});


export default mongoose.model('Membership', membershipSchema);



