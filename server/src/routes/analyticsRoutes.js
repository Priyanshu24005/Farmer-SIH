import express from 'express';
import { getDashboardStats, getMandiStats } from '../controllers/analyticsController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, requireAdmin, getDashboardStats);
router.get('/mandi/:mandiId', protect, requireAdmin, getMandiStats);

export default router;