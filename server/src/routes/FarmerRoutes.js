import express from 'express';
import {
  createFarmer,
  getFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer
} from '../controllers/farmerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createFarmer);
router.get('/', getFarmers);
router.get('/:id', protect, getFarmerById);
router.put('/:id', updateFarmer);
router.delete('/:id', deleteFarmer);

export default router;