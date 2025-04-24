import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  email: String,
  bio: String,
  specialties: [String], // e.g., ['Yoga', 'Weight Training']
  imageUrl: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;
