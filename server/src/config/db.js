import mongoose from 'mongoose';
import Farmer from '../models/Farmer.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const indexes = await Farmer.collection.listIndexes().toArray();
    const aadhaarIndex = indexes.find((index) => index.name === 'aadhaar_1');

    if (aadhaarIndex && !aadhaarIndex.sparse) {
      await Farmer.collection.dropIndex('aadhaar_1');
    }

    await Farmer.collection.createIndex(
      { aadhaar: 1 },
      { name: 'aadhaar_1', unique: true, sparse: true }
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;