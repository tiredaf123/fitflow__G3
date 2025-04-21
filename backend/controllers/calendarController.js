

import express from 'express';
import CalendarNote from '../models/calendarNote.js';  // Import your CalendarNote model
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Save or update a note for a user
router.post('/', protect, async (req, res) => {
  const { date, note } = req.body;

  if (!date || !note || note.trim() === '') {
    return res.status(400).json({ message: 'Date and note are required.' });
  }

  try {
    const userId = req.user._id; // Ensure the user is authenticated

    console.log('📥 Request Body:', req.body);
    console.log('👤 Authenticated User ID:', userId);

    // Check if a note already exists for the given userId and date
    const existing = await CalendarNote.findOne({ userId, date });

    if (existing) {
      // Update the existing note
      existing.note = note;
      await existing.save();
      return res.status(200).json({ message: 'Note updated successfully.', note: existing });
    }

    // If no existing note, create a new one
    const newNote = new CalendarNote({ userId, date, note });
    await newNote.save();
    return res.status(201).json({ message: 'Note created successfully.', note: newNote });
  } catch (err) {
    console.error('❌ Error saving note:', err);
    res.status(500).json({ message: 'Server Error while saving note' });
  }
});

// Get all notes for a user
router.get('/:userId', protect, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all notes for the user
    const notes = await CalendarNote.find({ userId });

    // Return notes if found
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user.' });
    }

    // Ensure we return an array of notes
    res.json(notes); // This should return an array of notes
  } catch (err) {
    console.error('❌ Error fetching notes:', err);
    res.status(500).json({ message: 'Server Error while fetching notes' });
  }
});

export default router;
