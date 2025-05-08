import express from 'express';
import CalendarNote from '../models/calendarNote.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Save or update a note for a user
router.post('/', protect, async (req, res) => {
  const { date, note } = req.body;

  console.log('📥 Incoming POST /api/calendar');
  console.log('📦 Body:', req.body);
  console.log('🔐 User:', req.user);

  if (!date || !note || note.trim() === '') {
    return res.status(400).json({ message: 'Date and note are required.' });
  }

  try {
    const userId = req.user._id; // Ensure the user is authenticated

    // Check if a note already exists for the given userId and date
    const existingNote = await CalendarNote.findOne({ userId, date });

    if (existingNote) {
      // Update the existing note
      existingNote.note = note;
      await existingNote.save();
      console.log('✅ Note updated');
      return res.status(200).json({ message: 'Note updated successfully.', note: existingNote });
    }

    // If no existing note, create a new one
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
    // Fetch all notes for the user
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

// Delete a specific note by userId and date
router.delete('/:userId/:date', protect, async (req, res) => {
  const { userId, date } = req.params;
  console.log(`🗑️ DELETE /api/calendar/${userId}/${date}`);

  try {
    // Delete the note based on userId and date
    const deleted = await CalendarNote.findOneAndDelete({ userId, date });

    if (!deleted) {
      console.log('⚠️ No note found to delete.');
      return res.status(404).json({ message: 'Note not found for this user on this date.' });
    }

    console.log('✅ Note deleted successfully');
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting note:', err);
    res.status(500).json({ message: 'Server Error while deleting note' });
  }
});

export default router;
