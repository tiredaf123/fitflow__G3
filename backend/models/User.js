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

  // ✅ Streak tracking
  loginStreak: { type: Number, default: 1 },
  lastLoginDate: { type: Date, default: null },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
//Adharsh Sapkota