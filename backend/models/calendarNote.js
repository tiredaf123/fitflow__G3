
import mongoose from 'mongoose';

const CalendarNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String, // Format: 'YYYY-MM-DD'
      required: true,
      validate: {
        validator: function(value) {
          // Regular expression to validate YYYY-MM-DD format
          return /^\d{4}-\d{2}-\d{2}$/.test(value);
        },
        message: props => `${props.value} is not a valid date format! Use 'YYYY-MM-DD'.`,
      },
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Adding a compound index to ensure a unique combination of userId and date
CalendarNoteSchema.index({ userId: 1, date: 1 }, { unique: true });

const CalendarNote = mongoose.model('CalendarNote', CalendarNoteSchema);
export default CalendarNote;
