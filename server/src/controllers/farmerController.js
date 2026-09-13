import Farmer from '../models/Farmer.js';

// Create farmer
export const createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    const response = farmer.toObject();
    delete response.password;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all farmers
export const getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select('-password').populate('mandi', 'name location');
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single farmer by ID
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).select('-password').populate('mandi', 'name location');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update farmer
export const updateFarmer = async (req, res) => {
  try {
    const allowedFields = ['name', 'mobile', 'aadhaar', 'cropType'];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => Object.prototype.hasOwnProperty.call(req.body, field))
        .map((field) => [field, req.body[field]])
    );
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.status(200).json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete farmer
export const deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.status(200).json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};