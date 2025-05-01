// models/achievement.js
import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
});

const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);
export default Achievement;
