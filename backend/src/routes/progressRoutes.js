import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProgress,
  saveCheckpoint,
  completeLevel,
  clearCheckpoint,
} from "../controllers/progressController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProgress);
router.put("/checkpoint", saveCheckpoint);
router.post("/complete", completeLevel);
router.delete("/checkpoint", clearCheckpoint);

export default router;
