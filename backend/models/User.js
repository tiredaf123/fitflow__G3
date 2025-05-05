// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, trim: true },
  username: { type: String, unique: true, required: true, trim: true },
  email: { type: String, trim: true },
  password: { type: String },

  provider: {
    type: String,
    enum: ['manual', 'google', 'apple'],
    default: 'manual',
  },

  photoURL: { type: String },
  isAdmin: { type: Boolean, default: false },

  // ✅ Login Streak Tracking Fields
  lastLoginDate: {
    type: String, // Format: 'YYYY-MM-DD'
    default: null,
  },
  loginStreak: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
