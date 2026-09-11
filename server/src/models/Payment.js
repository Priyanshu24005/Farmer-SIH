import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: true },
  amount: { type: Number, required: true },
  quantityKg: { type: Number, required: true },
  qualityGrade: { type: String, enum: ['A', 'B', 'C'], required: true },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paidAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);