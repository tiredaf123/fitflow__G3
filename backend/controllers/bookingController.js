import Booking from '../models/Booking.js';
import Trainer from '../models/Trainer.js';

// Helper function to check appointment date validity (now or future)
const isValidAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const now = new Date();
  // Appointment must be now or in the future (not past)
  return appointmentDate >= now;
};

export const getUserBookings = async (req, res) => {
  try {
    const now = new Date();

    // Future bookings
    const bookings = await Booking.find({ 
      userId: req.user.id,
      appointmentDate: { $gte: now }
    })
    .populate('trainerId', 'username fullName imageUrl specialties bio')
    .sort({ appointmentDate: 1 });

    const activeResults = bookings.map((booking) => ({
      _id: booking._id,
      trainer: booking.trainerId,
      appointmentDate: booking.appointmentDate,
      status: 'active'
    }));

    // Past bookings (limit last 5)
    const pastBookings = await Booking.find({
      userId: req.user.id,
      appointmentDate: { $lt: now }
    })
    .populate('trainerId', 'username fullName imageUrl specialties bio')
    .sort({ appointmentDate: -1 })
    .limit(5);

    const pastResults = pastBookings.map(booking => ({
      _id: booking._id,
      trainer: booking.trainerId,
      appointmentDate: booking.appointmentDate,
      status: 'completed'
    }));

    res.status(200).json({
      active: activeResults,
      past: pastResults
    });
  } catch (err) {
    console.error('Error getting user bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

export const createBooking = async (req, res) => {
  const { trainerId, appointmentDate } = req.body;

  if (!trainerId || !appointmentDate) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: !trainerId ? 'Trainer ID is required' : 'Appointment date is required'
    });
  }

  try {
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    if (!isValidAppointmentDate(appointmentDate)) {
      return res.status(400).json({ 
        error: 'Invalid appointment date',
        details: 'Appointment must be now or in the future'
      });
    }

    // Check for conflicting booking ± 1 hour
    const startWindow = new Date(new Date(appointmentDate).getTime() - 60 * 60 * 1000);
    const endWindow = new Date(new Date(appointmentDate).getTime() + 60 * 60 * 1000);

    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      trainerId,
      appointmentDate: { $gte: startWindow, $lte: endWindow }
    });

    if (existingBooking) {
      return res.status(409).json({ 
        error: 'Booking conflict',
        details: 'You already have a booking with this trainer around the same time'
      });
    }

    const newBooking = new Booking({
      userId: req.user.id,
      trainerId,
      appointmentDate: new Date(appointmentDate),
    });

    await newBooking.save();

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('trainerId', 'username fullName imageUrl');

    res.status(201).json({ 
      message: 'Booking created successfully',
      booking: {
        ...populatedBooking.toObject(),
        status: 'active'
      }
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: err.message 
    });
  }
};

export const getTrainerBookings = async (req, res) => {
  try {
    const now = new Date();

    const upcomingBookings = await Booking.find({ 
      trainerId: req.user.id,
      appointmentDate: { $gte: now }
    })
    .populate('userId', 'username fullName email phone')
    .sort({ appointmentDate: 1 });

    const pastBookings = await Booking.find({
      trainerId: req.user.id,
      appointmentDate: { $lt: now }
    })
    .populate('userId', 'username fullName email')
    .sort({ appointmentDate: -1 })
    .limit(10);

    res.status(200).json({
      upcoming: upcomingBookings.map(booking => ({
        _id: booking._id,
        client: booking.userId,
        appointmentDate: booking.appointmentDate,
        status: 'upcoming'
      })),
      past: pastBookings.map(booking => ({
        _id: booking._id,
        client: booking.userId,
        appointmentDate: booking.appointmentDate,
        status: 'completed'
      }))
    });
  } catch (err) {
    console.error('Error fetching trainer bookings:', err);
    res.status(500).json({ 
      error: 'Failed to retrieve bookings',
      details: err.message 
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOneAndDelete({
      _id: bookingId,
      $or: [
        { userId: req.user.id },
        { trainerId: req.user.id }
      ]
    });

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found or unauthorized' 
      });
    }

    res.status(200).json({ 
      message: 'Booking cancelled successfully',
      cancelledBooking: booking
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ 
      error: 'Failed to cancel booking',
      details: err.message 
    });
  }
};
