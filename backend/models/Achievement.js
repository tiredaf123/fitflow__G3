import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'award',
  },
  isUnlocked: {
    type: Boolean,
    default: false,
  },
  unlockedAt: {
    type: Date,
    default: null,
  },
  type: {
    type: String,
    enum: ['streak', 'general', 'milestone'],
    default: 'general',
  },
  requiredDays: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;