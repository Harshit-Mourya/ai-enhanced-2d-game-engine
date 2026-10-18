import Dexie from "dexie";

export const db = new Dexie("AdaptiveMazeEscapeDB");

db.version(1).stores({
  users: "++id, username, email",
  progress: "userId, currentLevel, unlockedLevels, bestSurvivalTime, totalScore",
  stats: "userId, totalGames, enemiesKilled, totalSurvivalTime, victories",
  achievements: "++id, userId, achievementKey, unlockedAt",
  settings: "userId, soundVolume, musicVolume, showDetectionRadius",
});

export const INITIAL_ACHIEVEMENTS = [
  {
    key: "FIRST_ESCAPE",
    title: "Quantum Leap",
    description: "Complete your first maze level.",
    icon: "🚀",
  },
  {
    key: "SURVIVOR",
    title: "Void Survivor",
    description: "Survive for over 60 seconds in a single run.",
    icon: "⏱️",
  },
  {
    key: "ALIEN_HUNTER",
    title: "Alien Hunter",
    description: "Destroy 10 enemy alien drones.",
    icon: "🎯",
  },
  {
    key: "UNTOUCHABLE",
    title: "Untouchable",
    description: "Reach the Warp Gate without taking any damage.",
    icon: "🛡️",
  },
  {
    key: "MAZE_MASTER",
    title: "Maze Master",
    description: "Unlock all 3 level sectors.",
    icon: "🌌",
  },
];

// Helper to get or create default profile data for logged-in user or guest
export async function getOrCreateUserData(userId = "guest") {
  let userProgress = await db.progress.get(userId);
  if (!userProgress) {
    userProgress = {
      userId,
      currentLevel: 1,
      unlockedLevels: 1,
      bestSurvivalTime: 0,
      totalScore: 0,
      updatedAt: new Date().toISOString(),
    };
    await db.progress.put(userProgress);
  }

  let userStats = await db.stats.get(userId);
  if (!userStats) {
    userStats = {
      userId,
      totalGames: 0,
      enemiesKilled: 0,
      totalSurvivalTime: 0,
      victories: 0,
    };
    await db.stats.put(userStats);
  }

  let userSettings = await db.settings.get(userId);
  if (!userSettings) {
    userSettings = {
      userId,
      soundVolume: 80,
      musicVolume: 70,
      showDetectionRadius: true,
    };
    await db.settings.put(userSettings);
  }

  const userAchievements = await db.achievements.where({ userId }).toArray();

  return {
    progress: userProgress,
    stats: userStats,
    settings: userSettings,
    achievements: userAchievements,
  };
}

export async function saveGameResult(userId = "guest", resultData) {
  const { level, won, survivalTime, enemiesKilled, score, undamaged } = resultData;

  const stats = (await db.stats.get(userId)) || {
    userId,
    totalGames: 0,
    enemiesKilled: 0,
    totalSurvivalTime: 0,
    victories: 0,
  };

  stats.totalGames += 1;
  stats.enemiesKilled += enemiesKilled || 0;
  stats.totalSurvivalTime += survivalTime || 0;
  if (won) stats.victories += 1;

  await db.stats.put(stats);

  const progress = (await db.progress.get(userId)) || {
    userId,
    currentLevel: 1,
    unlockedLevels: 1,
    bestSurvivalTime: 0,
    totalScore: 0,
  };

  progress.totalScore = (progress.totalScore || 0) + (score || 0);
  if (survivalTime > (progress.bestSurvivalTime || 0)) {
    progress.bestSurvivalTime = survivalTime;
  }

  if (won && level >= progress.unlockedLevels) {
    progress.unlockedLevels = Math.min(3, level + 1);
  }

  progress.updatedAt = new Date().toISOString();
  await db.progress.put(progress);

  // Check achievements
  const newUnlocks = [];

  const unlockAchievement = async (key) => {
    const existing = await db.achievements.where({ userId, achievementKey: key }).first();
    if (!existing) {
      const achDef = INITIAL_ACHIEVEMENTS.find((a) => a.key === key);
      if (achDef) {
        await db.achievements.add({
          userId,
          achievementKey: key,
          unlockedAt: new Date().toISOString(),
        });
        newUnlocks.push(achDef);
      }
    }
  };

  if (won) await unlockAchievement("FIRST_ESCAPE");
  if (survivalTime >= 60) await unlockAchievement("SURVIVOR");
  if (stats.enemiesKilled >= 10) await unlockAchievement("ALIEN_HUNTER");
  if (won && undamaged) await unlockAchievement("UNTOUCHABLE");
  if (progress.unlockedLevels >= 3) await unlockAchievement("MAZE_MASTER");

  return { newUnlocks, progress, stats };
}

export async function updateUserSettings(userId = "guest", newSettings) {
  const settings = { userId, ...newSettings };
  await db.settings.put(settings);
  return settings;
}
