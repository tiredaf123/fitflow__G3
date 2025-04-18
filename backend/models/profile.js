// models/Profile.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
  weightHistory: [
    {
      weight: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('UserProfile', profileSchema);
