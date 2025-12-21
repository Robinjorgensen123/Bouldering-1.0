import { Router } from "express";
import { createBoulder } from "../controllers/boulderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createBoulder);

export default router;
