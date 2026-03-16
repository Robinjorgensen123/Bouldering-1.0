import express from "express";
import {
  createHistoryRecord,
  getUserHistory,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createHistoryRecord);
router.get("/", protect, getUserHistory);

export default router;
