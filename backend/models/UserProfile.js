import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: Number,
  height: Number, // in cm
  weight: Number, // in kg
  goal: {
    type: String,
    enum: ['Gain Weight', 'Lose Weight', 'Build Muscles', 'Tone & Define', 'Improve Flexibility'],
  }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
export default UserProfile;
