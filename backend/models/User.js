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
}, { timestamps: true });

export default mongoose.model('User', userSchema);
