import Quote from '../models/Quote.js';

export const getQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne().sort({ date: -1 });
    if (!quote) {
      return res.status(404).json({ message: 'No quote found' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch quote' });
  }
};

export const createQuote = async (req, res) => {
  const { text, author } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Quote text is required' });
  }

  try {
    const newQuote = await Quote.create({
      text: text.trim(),
      author: author?.trim() || 'Unknown',
    });
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quote' });
  }
};

export const updateQuote = async (req, res) => {
  const { text, author } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Quote text is required' });
  }

  try {
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { text: text.trim(), author: author?.trim() || 'Unknown' },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quote' });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const deleted = await Quote.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete quote' });
  }
};
