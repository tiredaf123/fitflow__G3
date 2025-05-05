import Message from '../models/Message.js';
export const getMessages = async (req, res) => {
    try {
      const userId = req.user._id;
      const { trainerId } = req.params;
      console.log('📥 GET MESSAGES:', { userId, trainerId });
  
      const messages = await Message.find({ userId, trainerId }).sort({ timestamp: 1 });
      res.json(messages);
    } catch (err) {
      console.error('❌ GET MESSAGE ERROR:', err);
      res.status(500).json({ error: 'Failed to fetch messages.' });
    }
  };
  
  export const sendMessage = async (req, res) => {
    try {
      const userId = req.user._id;
      const { trainerId, text, image } = req.body;
  
      if (!trainerId || (!text && !image)) {
        return res.status(400).json({ error: 'Message content is required' });
      }
  
      const message = new Message({
        sender: 'user',
        text,
        image,
        trainerId,
        userId,
      });
  
      await message.save();
  
      res.status(201).json(message);
    } catch (err) {
      console.error('❌ Message Send Error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  export const sendImageMessage = async (req, res) => {
    try {
      const userId = req.user._id;
      const { trainerId } = req.body;
      const file = req.file;
  
      if (!file || !trainerId) {
        return res.status(400).json({ error: 'Image and trainerId are required' });
      }
  
      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: 'fitflow/messages',
      });
  
      const message = await Message.create({
        trainerId,
        userId,
        sender: 'user',
        type: 'image',
        image: result.secure_url,
        timestamp: new Date(),
      });
  
      res.status(201).json(message);
    } catch (err) {
      console.error('❌ Cloudinary image upload failed:', err);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  };