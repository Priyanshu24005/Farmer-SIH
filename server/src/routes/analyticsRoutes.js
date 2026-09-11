import express from 'express';
import { getDashboardStats, getMandiStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.get('/mandi/:mandiId', getMandiStats);

export default router;