import express from 'express';
import {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer
} from '../controllers/farmerController.js';
import { protect, requireAdmin, requireSelf } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requireAdmin, createFarmer);
router.get('/', getFarmers);
router.get('/:id', protect, requireSelf('id'), getFarmerById);
router.put('/:id', protect, requireSelf('id'), updateFarmer);
router.delete('/:id', protect, requireAdmin, deleteFarmer);

export default router;