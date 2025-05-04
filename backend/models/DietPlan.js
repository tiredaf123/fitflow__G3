import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  meals: [String], // or use an object format if you want more detail
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DietPlan', dietPlanSchema);
