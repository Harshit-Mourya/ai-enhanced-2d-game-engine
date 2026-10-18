import mongoose from "mongoose";

const gameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Permanent progression
    currentLevelId: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    unlockedLevels: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    completedLevels: {
      type: [Number],
      default: [],
    },

    // State required to resume a running sector
    checkpoint: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Permanent statistics
    totalScore: {
      type: Number,
      default: 0,
    },
    bestSurvivalTime: {
      type: Number,
      default: 0,
    },
    totalGames: {
      type: Number,
      default: 0,
    },
    enemiesKilled: {
      type: Number,
      default: 0,
    },
    totalSurvivalTime: {
      type: Number,
      default: 0,
    },
    victories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const GameProgress = mongoose.model("GameProgress", gameProgressSchema);

export default GameProgress;
