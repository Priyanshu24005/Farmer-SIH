import Mandi from '../models/Mandi.js';

// Create mandi
export const createMandi = async (req, res) => {
  try {
    const mandi = await Mandi.create(req.body);
    res.status(201).json(mandi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all mandis
export const getMandis = async (req, res) => {
  try {
    const mandis = await Mandi.find();
    res.status(200).json(mandis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single mandi by ID
export const getMandiById = async (req, res) => {
  try {
    const mandi = await Mandi.findById(req.params.id);
    if (!mandi) return res.status(404).json({ message: 'Mandi not found' });
    res.status(200).json(mandi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update mandi
export const updateMandi = async (req, res) => {
  try {
    const mandi = await Mandi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!mandi) return res.status(404).json({ message: 'Mandi not found' });
    res.status(200).json(mandi);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete mandi
export const deleteMandi = async (req, res) => {
  try {
    const mandi = await Mandi.findByIdAndDelete(req.params.id);
    if (!mandi) return res.status(404).json({ message: 'Mandi not found' });
    res.status(200).json({ message: 'Mandi deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};