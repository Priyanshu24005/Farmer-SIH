import Farmer from '../models/Farmer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register farmer
export const registerFarmer = async (req, res) => {
  try {
    const { name, mobile, aadhaar, password, cropType } = req.body;

    const existingFarmer = await Farmer.findOne({ mobile });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer already registered with this mobile' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = await Farmer.create({
      name,
      mobile,
      aadhaar,
      password: hashedPassword,
      cropType
    });

    const token = generateToken(farmer._id);

    res.status(201).json({
      _id: farmer._id,
      name: farmer.name,
      mobile: farmer.mobile,
      cropType: farmer.cropType,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login farmer
export const loginFarmer = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) {
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }

    const token = generateToken(farmer._id);

    res.status(200).json({
      _id: farmer._id,
      name: farmer.name,
      mobile: farmer.mobile,
      cropType: farmer.cropType,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};