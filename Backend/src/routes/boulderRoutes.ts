import { Router } from "express";
import {
  createBoulder,
  getBoulders,
} from "../controllers/boulderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createBoulder);
router.get("/", protect, getBoulders);

export default router;
