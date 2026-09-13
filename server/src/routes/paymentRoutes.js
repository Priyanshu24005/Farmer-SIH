import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  markPaymentPaid,
  getFarmerPayments
} from '../controllers/paymentController.js';
import { protect, requireAdmin, requireSelf } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requireAdmin, createPayment);
router.get('/', protect, requireAdmin, getPayments);
router.get('/farmer/:farmerId', protect, requireSelf('farmerId'), getFarmerPayments);
router.get('/:id', protect, getPaymentById);
router.put('/:id/pay', protect, requireAdmin, markPaymentPaid);

export default router;