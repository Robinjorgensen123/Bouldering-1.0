import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { changePassword, updateSettings } from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { changePasswordSchema } from "../validators/userValidator.js";

const router = Router();

router.put("/settings", protect, updateSettings);
router.put(
	"/change-password",
	protect,
	validate(changePasswordSchema),
	changePassword,
);

export default router;
