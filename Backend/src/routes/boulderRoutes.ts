import { Router } from "express";
import {
  createBoulder,
  deleteBoulder,
  getBoulders,
  updateBoulder,
} from "../controllers/boulderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { validateId } from "../middleware/validateId.js";
import { boulderSchema } from "../validators/boulderValidator.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  validate(boulderSchema),
  createBoulder
);
router.get("/", protect, getBoulders);
router.put(
  "/:id",
  protect,
  validateId,
  upload.single("image"),
  validate(boulderSchema),
  updateBoulder
);
router.delete("/:id", protect, validateId, deleteBoulder);

export default router;
