import express from 'express';
import {
  bookToken,
  getTokenById,
  getMandiQueue,
  updateTokenStatus,
  getFarmerTokens
} from '../controllers/tokenController.js';

const router = express.Router();

router.post('/', bookToken);
router.get('/:id', getTokenById);
router.get('/mandi/:mandiId/queue', getMandiQueue);
router.get('/farmer/:farmerId', getFarmerTokens);
router.put('/:id/status', updateTokenStatus);

export default router;