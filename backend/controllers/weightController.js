import WeightEntry from '../models/WeightEntry.js';

export const saveWeight = async (req, res) => {
  const { weight, date } = req.body;

  try {
    const entry = new WeightEntry({
      userId: req.user._id,
      weight,
      date: date || new Date()
    });

    await entry.save();
    res.status(201).json({ message: 'Weight saved', entry });
  } catch (err) {
    console.error('Save weight error:', err);
    res.status(500).json({ message: 'Failed to save weight', error: err.message });
  }
};

export const getWeightHistory = async (req, res) => {
  try {
    const entries = await WeightEntry.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error('Fetch history error:', err);
    res.status(500).json({ message: 'Failed to fetch weight history', error: err.message });
  }
};
