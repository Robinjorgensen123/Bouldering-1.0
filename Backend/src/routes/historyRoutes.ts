import express from "express";
import {
  createHistoryRecord,
  getUserHistory,
  getHistoryByBoulder,
} from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { historySchema } from "../validators/historyValidator.js";
import { validateId } from "../middleware/validateId.js";

const router = express.Router();

router.post("/", protect, validate(historySchema), createHistoryRecord);
router.get("/", protect, getUserHistory);

router.get("/boulder/:id", protect, validateId, getHistoryByBoulder);

export default router;
