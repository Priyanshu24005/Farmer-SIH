import express from 'express';
import {
  createMandi,
  getMandis,
  getMandiById,
  updateMandi,
  deleteMandi
} from '../controllers/mandiController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, requireAdmin, createMandi);
router.get('/', getMandis);
router.get('/:id', getMandiById);
router.put('/:id', protect, requireAdmin, updateMandi);
router.delete('/:id', protect, requireAdmin, deleteMandi);

export default router;