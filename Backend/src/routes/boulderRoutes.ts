import { Router } from "express";
import {
  createBoulder,
  deleteBoulder,
  getBoulders,
} from "../controllers/boulderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createBoulder);
router.get("/", protect, getBoulders);
router.delete("/:id", protect, deleteBoulder);

export default router;
