import express from 'express';
import CalendarNote from '../models/calendarNote.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Save or update a note
router.post('/', protect, async (req, res) => {
  const { date, note } = req.body;

  if (!date || !note || note.trim() === '') {
    return res.status(400).json({ message: 'Date and note are required.' });
  }

  try {
    const userId = req.user._id;

    const existingNote = await CalendarNote.findOne({ userId, date });

    if (existingNote) {
      existingNote.note = note;
      await existingNote.save();
      return res.status(200).json({ message: 'Note updated successfully.', note: existingNote });
    }

    const newNote = new CalendarNote({ userId, date, note });
    await newNote.save();
    return res.status(201).json({ message: 'Note created successfully.', note: newNote });
  } catch (err) {
    console.error('Error saving note:', err.message);
    res.status(500).json({ message: 'Server error while saving note.' });
  }
});

// ✅ Get all notes for a user
router.get('/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const notes = await CalendarNote.find({ userId });

    return res.status(200).json(notes); // Always return an array
  } catch (err) {
    console.error('Error fetching notes:', err.message);
    res.status(500).json({ message: 'Server error while fetching notes.' });
  }
});

// ✅ Delete a note by userId and date
router.delete('/:userId/:date', protect, async (req, res) => {
  try {
    const { userId, date } = req.params;

    const deletedNote = await CalendarNote.findOneAndDelete({ userId, date });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found for this user on this date.' });
    }

    return res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).json({ message: 'Server error while deleting note.' });
  }
});

export default router;
