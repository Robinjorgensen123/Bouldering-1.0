import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateSettings } from "../controllers/userController.js";

const router = Router();

router.put("/settings", protect, updateSettings);

export default router;
