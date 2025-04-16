// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String },
  username: { type: String, unique: true, required: true },
  email: { type: String },
  password: { type: String },
  provider: { type: String, enum: ['google', 'apple', 'manual'], required: true },
  photoURL: String,
  isAdmin: { type: Boolean, default: false },
  // ❌ REMOVE uid field if not using Firebase
}, { timestamps: true });

export default mongoose.model('User', userSchema);
