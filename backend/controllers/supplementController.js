import Supplement from '../models/Supplement.js';
import { cloudinary } from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// Helper to upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'fitflow-supplements' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// GET /api/supplements
export const getSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.find();
    res.json(supplements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/supplements
export const createSupplement = async (req, res) => {
  const { name, purpose, price } = req.body;
  if (!name || !purpose || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let imageUrl = '';
    if (req.file && req.file.buffer) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newSupplement = new Supplement({ name, purpose, price, imageUrl });
    await newSupplement.save();
    res.status(201).json(newSupplement);
  } catch (err) {
    console.error('Create Supplement Error:', err);
    res.status(400).json({ message: 'Creation failed', error: err.message });
  }
};

// PUT /api/supplements/:id
export const updateSupplement = async (req, res) => {
  const { name, purpose, price, imageUrl } = req.body;

  try {
    let updatedFields = { name, purpose, price };

    if (req.file && req.file.buffer) {
      const uploadedUrl = await uploadToCloudinary(req.file.buffer);
      updatedFields.imageUrl = uploadedUrl;
    } else if (imageUrl) {
      updatedFields.imageUrl = imageUrl;
    }

    const updated = await Supplement.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Supplement not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update Supplement Error:', err);
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/supplements/:id
export const deleteSupplement = async (req, res) => {
  try {
    const deleted = await Supplement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Supplement not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Deletion failed', error: err.message });
  }
};
