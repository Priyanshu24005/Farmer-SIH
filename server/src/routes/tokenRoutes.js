import express from 'express';
import {
  bookToken,
  getTokenById,
  getMandiQueue,
  updateTokenStatus,
  getFarmerTokens
} from '../controllers/tokenController.js';
import { protect, requireAdmin, requireFarmer, requireSelf } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requireFarmer, bookToken);
router.get('/mandi/:mandiId/queue', getMandiQueue);
router.get('/farmer/:farmerId', protect, requireSelf('farmerId'), getFarmerTokens);
router.get('/:id', getTokenById);
router.put('/:id/status', protect, requireAdmin, updateTokenStatus);

export default router;