import express from 'express';
import { registerFarmer, loginFarmer } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);

export default router;