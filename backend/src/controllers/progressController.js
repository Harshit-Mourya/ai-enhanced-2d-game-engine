import mongoose from "mongoose";
import GameProgress from "../models/GameProgress.js";

const MAX_LEVEL = 3;

function validLevel(level) {
  return Number.isInteger(level) && level >= 1 && level <= MAX_LEVEL;
}

async function getOrCreateProgress(userId) {
  return GameProgress.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        currentLevelId: 1,
        unlockedLevels: 1,
        completedLevels: [],
        checkpoint: null,
        totalScore: 0,
        bestSurvivalTime: 0,
        totalGames: 0,
        enemiesKilled: 0,
        totalSurvivalTime: 0,
        victories: 0,
      },
    },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
  );
}

export async function getProgress(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user identity.",
      });
    }

    const progress = await getOrCreateProgress(req.userId);

    return res.json({ success: true, progress });
  } catch (error) {
    console.error("Get progress failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load game progress.",
    });
  }
}

export async function saveCheckpoint(req, res) {
  try {
    const { levelId, checkpoint } = req.body;

    if (!validLevel(levelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sector ID.",
      });
    }

    if (
      !checkpoint ||
      typeof checkpoint !== "object" ||
      Array.isArray(checkpoint)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid checkpoint is required.",
      });
    }

    const progress = await getOrCreateProgress(req.userId);

    if (levelId > progress.unlockedLevels) {
      return res.status(403).json({
        success: false,
        message: "This sector is not unlocked.",
      });
    }
    if (levelId < progress.currentLevelId) {
      return res.status(409).json({
        success: false,
        message: "Cannot overwrite progress from an earlier sector.",
      });
    }

    // Never overwrite a checkpoint belonging to a different sector
    // if that sector is no longer the current sector.
    progress.currentLevelId = levelId;
    progress.checkpoint = {
      ...checkpoint,
      levelId,
      savedAt: new Date().toISOString(),
    };

    await progress.save();

    return res.json({
      success: true,
      message: "Checkpoint saved.",
      progress,
    });
  } catch (error) {
    console.error("Save checkpoint failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save game progress.",
    });
  }
}

export async function completeLevel(req, res) {
  try {
    const {
      levelId,
      score = 0,
      survivalTime = 0,
      enemiesKilled = 0,
    } = req.body;

    if (!validLevel(levelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sector ID.",
      });
    }

    for (const value of [score, survivalTime, enemiesKilled]) {
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid completion statistics.",
        });
      }
    }

    const progress = await getOrCreateProgress(req.userId);

    if (levelId > progress.unlockedLevels) {
      return res.status(403).json({
        success: false,
        message: "This sector is not unlocked.",
      });
    }

    // Prevent repeated completion requests from double-counting stats.
    // Prevent repeated completion requests from double-counting stats.
    const alreadyCompleted = progress.completedLevels.includes(levelId);

    // Only advance the current sector when completing the current
    // or a later sector. Replaying an earlier sector must not regress progress.
    const shouldAdvanceCurrentSector = levelId >= progress.currentLevelId;

    if (!alreadyCompleted) {
      progress.completedLevels.push(levelId);
      progress.totalGames += 1;
      progress.victories += 1;
      progress.totalScore += score;
      progress.enemiesKilled += enemiesKilled;
      progress.totalSurvivalTime += survivalTime;
    }

    progress.bestSurvivalTime = Math.max(
      progress.bestSurvivalTime,
      survivalTime,
    );

    progress.unlockedLevels = Math.min(
      MAX_LEVEL,
      Math.max(progress.unlockedLevels, levelId + 1),
    );

    if (shouldAdvanceCurrentSector) {
      progress.currentLevelId = Math.min(levelId + 1, MAX_LEVEL);
      progress.checkpoint = null;
    }

    await progress.save();

    return res.json({
      success: true,
      message: "Sector completion saved.",
      progress,
    });
  } catch (error) {
    console.error("Complete level failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save sector completion.",
    });
  }
}

export const clearCheckpoint = async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.userId);

    progress.checkpoint = null;
    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Checkpoint cleared successfully.",
      progress,
    });
  } catch (error) {
    console.error("Clear checkpoint error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to clear checkpoint.",
    });
  }
};
