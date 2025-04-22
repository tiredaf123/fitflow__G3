import express from 'express';
import CalendarNote from '../models/calendarNote.js'; // Import your CalendarNote model
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// 📝 Save or update a note for a user
router.post('/', protect, async (req, res) => {
  const { date, note } = req.body;

  if (!date || !note || note.trim() === '') {
    return res.status(400).json({ message: 'Date and note are required.' });
  }

  try {
    const userId = req.user._id;

    console.log('📥 Request Body:', req.body);
    console.log('👤 Authenticated User ID:', userId);

    const existing = await CalendarNote.findOne({ userId, date });

    if (existing) {
      existing.note = note;
      await existing.save();
      return res.status(200).json({ message: 'Note updated successfully.', note: existing });
    }

    const newNote = new CalendarNote({ userId, date, note });
    await newNote.save();
    return res.status(201).json({ message: 'Note created successfully.', note: newNote });
  } catch (err) {
    console.error('❌ Error saving note:', err);
    res.status(500).json({ message: 'Server Error while saving note' });
  }
});

// 📄 Get all notes for a user
router.get('/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;
    const notes = await CalendarNote.find({ userId });

    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user.' });
    }

    res.json(notes);
  } catch (err) {
    console.error('❌ Error fetching notes:', err);
    res.status(500).json({ message: 'Server Error while fetching notes' });
  }
});

// 🗑️ Delete a specific note by userId and date
router.delete('/:userId/:date', protect, async (req, res) => {
  try {
    const { userId, date } = req.params;

    const deletedNote = await CalendarNote.findOneAndDelete({ userId, date });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found for this user on this date.' });
    }

    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting note:', err);
    res.status(500).json({ message: 'Server Error while deleting note' });
  }
});

export default router;
