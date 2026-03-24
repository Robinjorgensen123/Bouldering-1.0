import express from "express";
import {
  createHistoryRecord,
  getUserHistory,
  getHistoryByBoulder,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createHistoryRecord);
router.get("/", protect, getUserHistory);

router.get("/boulder/:id", protect, getHistoryByBoulder);

export default router;
