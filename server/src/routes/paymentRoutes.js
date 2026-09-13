import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  markPaymentPaid,
  getFarmerPayments
} from '../controllers/paymentController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requireAdmin, createPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.get('/farmer/:farmerId', getFarmerPayments);
router.put('/:id/pay', protect, requireAdmin, markPaymentPaid);

export default router;