import mongoose from 'mongoose';

const supplementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, default: '' },
});

export default mongoose.model('Supplement', supplementSchema);
