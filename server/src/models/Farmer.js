import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  aadhaar: { type: String },
  password: { type: String, required: true },
  cropType: { type: String },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  mandi: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandi' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Farmer', farmerSchema);