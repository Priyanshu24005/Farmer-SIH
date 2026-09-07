import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  mandi: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandi', required: true },
  tokenNumber: { type: Number, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['waiting', 'served', 'cancelled'],
    default: 'waiting'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Token', tokenSchema);