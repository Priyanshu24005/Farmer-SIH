import mongoose from 'mongoose';

const mandiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  dailyCapacity: { type: Number, required: true },
  currentTokenCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Mandi', mandiSchema);