import express from "express";
import {
  registerFarmer,
  loginFarmer,
  createAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerFarmer);
router.post("/login", loginFarmer);
router.post("/create-admin", createAdmin);

export default router;
