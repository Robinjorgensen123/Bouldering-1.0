import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateSetting } from "../controllers/authController.js";

const router = Router();

router.put("/settings", protect, updateSetting);

export default router;
