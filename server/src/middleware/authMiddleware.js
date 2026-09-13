import jwt from 'jsonwebtoken';
import Farmer from '../models/Farmer.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.farmer = await Farmer.findById(decoded.id).select('-password');
      if (!req.farmer) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.farmer?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const requireSelf = (paramName) => (req, res, next) => {
  if (req.farmer?.role === 'admin' || req.farmer?._id.toString() === req.params[paramName]) {
    return next();
  }
  return res.status(403).json({ message: 'You can only access your own data' });
};

export const requireFarmer = (req, res, next) => {
  if (req.farmer?.role !== 'farmer') {
    return res.status(403).json({ message: 'Farmer access required' });
  }
  next();
};