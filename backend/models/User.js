// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true, required: true },
  email: String,
  password: String,
  provider: {
    type: String,
    enum: ['manual', 'google', 'apple'],
    default: 'manual',
  },
  photoURL: String,
  isAdmin: { type: Boolean, default: false },
  membershipDeadline: { type: Date, default: null },

  // ✅ For login streak tracking
  lastLoginDate: { type: Date },
  loginStreak: { type: Number, default: 0 },


  // ✅ Add these for login streak tracking
  lastLoginDate: {
    type: String, // Format: 'YYYY-MM-DD'
    default: null,
  },
  loginStreak: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
