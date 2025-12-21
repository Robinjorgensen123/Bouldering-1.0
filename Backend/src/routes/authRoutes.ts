import { Router } from "express";
import {
  register,
  login,
  updateSetting,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/settings", protect, updateSetting);

export default router;
