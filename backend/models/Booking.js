import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  appointmentDate: { type: Date, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
