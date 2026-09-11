import express from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  markPaymentPaid,
  getFarmerPayments
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.get('/farmer/:farmerId', getFarmerPayments);
router.put('/:id/pay', markPaymentPaid);

export default router;