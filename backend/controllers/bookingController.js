import Booking from '../models/Booking.js';
import Trainer from '../models/Trainer.js';

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('trainerId', 'username fullName imageUrl specialties bio');

    const result = bookings.map((b) => ({
      trainer: b.trainerId,
      appointmentDate: b.appointmentDate,
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createBooking = async (req, res) => {
  const { trainerId, appointmentDate } = req.body;

  if (!trainerId || !appointmentDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newBooking = new Booking({
      userId: req.user.id,
      trainerId,
      appointmentDate: new Date(appointmentDate),
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: 'Could not create booking' });
  }
};
