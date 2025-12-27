import { Router } from "express";
import {
  createBoulder,
  deleteBoulder,
  getBoulders,
  updateBoulder,
} from "../controllers/boulderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { boulderSchema } from "../validators/boulderValidator.js";

const router = Router();

router.post("/", protect, validate(boulderSchema), createBoulder);
router.get("/", protect, getBoulders);
router.put("/:id", protect, validate(boulderSchema), updateBoulder);
router.delete("/:id", protect, deleteBoulder);

export default router;
