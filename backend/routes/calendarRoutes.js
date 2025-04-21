
import express from 'express';
import CalendarNote from '../models/calendarNote.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Save or update a note
router.post('/', protect, async (req, res) => {
  const { date, note } = req.body;

  console.log('📥 Incoming POST /api/calendar');
  console.log('📦 Body:', req.body);
  console.log('🔐 User:', req.user);

  if (!date || !note || note.trim() === '') {
    return res.status(400).json({ message: 'Date and note are required.' });
  }

  try {
    const userId = req.user._id;

    const existingNote = await CalendarNote.findOne({ userId, date });

    if (existingNote) {
      existingNote.note = note;
      await existingNote.save();
      console.log('✅ Note updated');
      return res.status(200).json({ message: 'Note updated successfully.', note: existingNote });
    }

    const newNote = new CalendarNote({ userId, date, note });
    await newNote.save();
    console.log('✅ Note created');
    return res.status(201).json({ message: 'Note created successfully.', note: newNote });
  } catch (err) {
    console.error('❌ Error saving note:', err);
    res.status(500).json({ message: 'Server Error while saving note' });
  }
});

// Get all notes for a user
router.get('/:userId', protect, async (req, res) => {
  const userId = req.params.userId;
  console.log('📥 GET /api/calendar/:userId for', userId);

  try {
    const notes = await CalendarNote.find({ userId });

    if (!notes || notes.length === 0) {
      console.log('⚠️ No notes found for user:', userId);
      return res.status(200).json([]); // Return empty array instead of 404
    }

    console.log(`📤 Found ${notes.length} notes`);
    res.json(notes);
  } catch (err) {
    console.error('❌ Error fetching notes:', err);
    res.status(500).json({ message: 'Server Error while fetching notes' });
  }
});

export default router;
