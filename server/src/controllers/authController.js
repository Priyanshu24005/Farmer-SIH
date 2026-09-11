import Farmer from '../models/Farmer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register (works for both farmer and admin)
export const registerFarmer = async (req, res) => {
  try {
    const { name, mobile, aadhaar, password, cropType, role } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ message: 'Name, mobile, and password are required' });
    }

    const existingFarmer = await Farmer.findOne({ mobile });
    if (existingFarmer) {
      return res.status(400).json({ message: 'Already registered with this mobile' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalRole = role === 'admin' ? 'admin' : 'farmer';

    const farmer = await Farmer.create({
      name,
      mobile,
      aadhaar,
      password: hashedPassword,
      cropType,
      role: finalRole
    });

    const token = generateToken(farmer._id, farmer.role);

    res.status(201).json({
      _id: farmer._id,
      name: farmer.name,
      mobile: farmer.mobile,
      role: farmer.role,
      cropType: farmer.cropType,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login (works for both)
export const loginFarmer = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' });
    }

    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) {
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile or password' });
    }

    const token = generateToken(farmer._id, farmer.role);

    res.status(200).json({
      _id: farmer._id,
      name: farmer.name,
      mobile: farmer.mobile,
      role: farmer.role,
      cropType: farmer.cropType,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};