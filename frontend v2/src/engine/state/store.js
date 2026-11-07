import { configureStore, createSlice } from "@reduxjs/toolkit";
import { resolveWallCollision } from "../physics/wallCollision";
import { updateEnemyAI, isEntityInSafeZone } from "../ai/enemyAI";

const entitySlice = createSlice({
  name: "entities",
  initialState: {
    currentLevelId: 1,
    currentLevelName: "Outer Sector Grid",
    arena: { width: 2000, height: 1500 },
    gameStatus: "playing", // 'playing' | 'paused' | 'gameOver' | 'victory'
    survivalTime: 0,
    difficultyLevel: "normal",
    score: 0,
    enemiesKilled: 0,
    artifactsCollected: 0,
    enemyShotsFired: 0,
    playerDamageEvents: 0,
    enemyDamageEvents: 0,
    explosions: [],
    explosionEvents: 0,
    pickupCollectedEvents: 0,
    nextExplosionId: 1,
    playerDefeatPending: false,
    takenDamage: false,
    weaponDisabledNotice: false,
    observatoryNotice: null,
    gateLockedNotice: false,
    lastItemNotice: null,
    lastItemNoticeTimer: 0,
    walls: [],
    safeZones: [],
    pickups: [],
    observatory: null,
    exitGate: null,
    player: {
      x: 100,
      y: 100,
      dx: 0,
      dy: 0,
      rotation: 0,
      speed: 2.5,
      health: 100,
      maxHealth: 100,
      projectileSpeed: 5.5,
      projectileDamage: 2.5,
      projectileType: "comet",
      collided: false,
      inSafeZone: false,
    },
    enemies: [],
    mouse: {
      x: 500,
      y: 350,
      worldX: 500,
      worldY: 350,
    },
    projectiles: [],
  },
  reducers: {
    // PLAYER INPUT DIRECTION
    setDirection: (state, action) => {
      if (action.payload.dx !== undefined) state.player.dx = action.payload.dx;
      if (action.payload.dy !== undefined) state.player.dy = action.payload.dy;
    },

    // MOUSE POSITION & ROTATION
    setMousePosition: (state, action) => {
      state.mouse.x = action.payload.x;
      state.mouse.y = action.payload.y;

      // Calculate world mouse position relative to player camera (viewport 1000x700 centered on player)
      const worldMouseX = state.player.x + (action.payload.x - 500) / 1.5;
      const worldMouseY = state.player.y + (action.payload.y - 350) / 1.5;

      state.mouse.worldX = worldMouseX;
      state.mouse.worldY = worldMouseY;

      const pCenterX = state.player.x + 20;
      const pCenterY = state.player.y + 20;
      const angleRad = Math.atan2(
        worldMouseY - pCenterY,
        worldMouseX - pCenterX,
      );
      state.player.rotation = (angleRad * 180) / Math.PI;
    },

    // MAIN GAME TICK
    updatePosition: (state, action) => {
      // Update active explosion timers
      state.explosions = state.explosions.filter((explosion) => {
        explosion.remainingMs -= action.payload;

        if (explosion.remainingMs <= 0) {
          if (explosion.type === "player") {
            state.playerDefeatPending = false;
            state.gameStatus = "gameOver";
          }

          return false;
        }

        return true;
      });

      // Stop normal gameplay after a terminal state
      if (state.gameStatus === "gameOver" || state.gameStatus === "victory") {
        return;
      }

      // Pause normal gameplay while player defeat animation plays
      if (state.playerDefeatPending) return;

      const deltaSec = action.payload / 1000;

      // Survival time & Score
      state.survivalTime += deltaSec;
      state.score += Math.round(deltaSec * 10);

      if (state.survivalTime > 60) state.difficultyLevel = "hard";
      else if (state.survivalTime > 30) state.difficultyLevel = "medium";
      else state.difficultyLevel = "normal";

      // Player Movement
      state.player.x += state.player.speed * state.player.dx;
      state.player.y += state.player.speed * state.player.dy;

      // Arena boundary lock
      const arenaW = state.arena?.width || 2000;
      const arenaH = state.arena?.height || 1500;
      state.player.x = Math.max(10, Math.min(arenaW - 50, state.player.x));
      state.player.y = Math.max(10, Math.min(arenaH - 50, state.player.y));

      // Wall collision resolution
      resolveWallCollision(state.player, state.walls);

      // Check if player is inside Safe Zone
      const playerInSafe = isEntityInSafeZone(state.player, state.safeZones);
      state.player.inSafeZone = playerInSafe;

      // Enemy AI Update (Line of Sight and Fixed Guarding behavior)
      // Enemy AI Update
      const previousProjectileCount = state.projectiles.length;

      updateEnemyAI(state);

      const newProjectileCount =
        state.projectiles.length - previousProjectileCount;

      if (newProjectileCount > 0) {
        state.enemyShotsFired =
          (state.enemyShotsFired || 0) + newProjectileCount;
      }
      state.enemies.forEach((enemy) => {
        resolveWallCollision(enemy, state.walls);
      });

      // Projectiles Movement & Collisions
      state.projectiles = state.projectiles.filter((projectile) => {
        projectile.x += projectile.dx * projectile.speed;
        projectile.y += projectile.dy * projectile.speed;

        // Projectile distance tracking & range cap
        projectile.distanceTraveled =
          (projectile.distanceTraveled || 0) + projectile.speed;
        const maxRange =
          projectile.maxDistance || (projectile.owner === "player" ? 480 : 650);
        if (projectile.distanceTraveled >= maxRange) {
          return false;
        }

        // Out of world boundary check
        if (
          projectile.x < 0 ||
          projectile.x > arenaW ||
          projectile.y < 0 ||
          projectile.y > arenaH
        ) {
          return false;
        }

        // Wall collision check
        const hitWall = state.walls.some((wall) => {
          return (
            projectile.x < wall.x + wall.width &&
            projectile.x + 8 > wall.x &&
            projectile.y < wall.y + wall.height &&
            projectile.y + 8 > wall.y
          );
        });
        if (hitWall) return false;

        // Enemy Projectile hitting Player
        if (projectile.owner === "enemy") {
          // Safe Zone shield absorbs enemy projectiles!
          if (playerInSafe) return false;

          const playerHit =
            projectile.x < state.player.x + 35 &&
            projectile.x + 8 > state.player.x &&
            projectile.y < state.player.y + 35 &&
            projectile.y + 8 > state.player.y;

          if (playerHit) {
            state.player.health -= projectile.damage;
            state.takenDamage = true;
            state.playerDamageEvents = (state.playerDamageEvents || 0) + 1;
            return false;
          }
          return true;
        }

        // Player Projectile hitting Enemy
        let hitEnemy = false;
        state.enemies.forEach((enemy) => {
          const enemyHit =
            projectile.x < enemy.x + 35 &&
            projectile.x + 8 > enemy.x &&
            projectile.y < enemy.y + 35 &&
            projectile.y + 8 > enemy.y;

          if (enemyHit) {
            enemy.health -= projectile.damage;
            hitEnemy = true;
            state.enemyDamageEvents = (state.enemyDamageEvents || 0) + 1;

            if (enemy.health <= 0 && !enemy.destroyed) {
              enemy.destroyed = true;

              state.score += 200;
              state.enemiesKilled += 1;

              state.explosions.push({
                id: state.nextExplosionId++,
                x: enemy.x,
                y: enemy.y,
                type: "enemy",
                remainingMs: 1000,
              });

              state.explosionEvents += 1;
            }
          }
        });

        if (hitEnemy) return false;

        return true;
      });

      // Remove Dead Enemies
      state.enemies = state.enemies.filter((enemy) => enemy.health > 0);

      // Pickups & Sci-Fi Collectibles Interaction
      state.pickups = state.pickups.filter((pickup) => {
        const pCenterX = state.player.x + 20;
        const pCenterY = state.player.y + 20;
        const dist = Math.hypot(pCenterX - pickup.x, pCenterY - pickup.y);

        if (dist < 38) {
          state.pickupCollectedEvents = (state.pickupCollectedEvents || 0) + 1;
          state.artifactsCollected = (state.artifactsCollected || 0) + 1;

          if (pickup.type === "plasma-cell") {
            state.player.projectileDamage =
              (state.player.projectileDamage || 2.5) + 1.5;
            state.player.projectileSpeed =
              (state.player.projectileSpeed || 5.5) + 0.8;
            state.score += 250;
            state.lastItemNotice =
              "PLASMA CELL COLLECTED! WEAPON DAMAGE & SPEED UPGRADED!";
          } else if (pickup.type === "quantum-crystal") {
            state.player.maxHealth = (state.player.maxHealth || 100) + 25;
            state.player.health = Math.min(
              state.player.maxHealth,
              state.player.health + 50,
            );
            state.score += 350;
            state.lastItemNotice = `QUANTUM CRYSTAL HARVESTED! MAX HEALTH INCREASED TO ${state.player.maxHealth} HP!`;
          } else if (pickup.type === "ancient-artifact") {
            state.player.speed = (state.player.speed || 2.5) + 0.4;
            state.score += 500;
            state.lastItemNotice =
              "ANCIENT RELIC ACQUIRED! THRUSTERS PERMANENTLY BOOSTED!";
          } else if (pickup.type === "research-data") {
            state.score += 350;
            if (state.observatory && state.observatory.progress !== undefined) {
              state.observatory.progress = Math.min(
                100,
                state.observatory.progress + 25,
              );
            }
            state.lastItemNotice =
              "RESEARCH DATA MODULE ANALYZED! OBSERVATORY UPLINK BOOSTED (+25%)!";
          } else if (pickup.type === "energy-core") {
            state.player.health = Math.min(
              state.player.maxHealth || 100,
              state.player.health + 60,
            );
            state.score += 200;
            state.lastItemNotice =
              "HYPER-FLUX ENERGY CORE DISCOVERED! VITAL SYSTEMS RECHARGED!";
          } else {
            // Standard health pickup
            state.player.health = Math.min(
              state.player.maxHealth || 100,
              state.player.health + (pickup.amount || 25),
            );
            state.score += 50;
            state.lastItemNotice = "+25 HP REPAIR POD APPLIED!";
          }
          state.lastItemNoticeTimer = 3.2;
          return false;
        }
        return true;
      });

      // ==========================================
      // OBSERVATORY OBJECTIVE MISSION SEQUENCE
      // ==========================================
      if (state.observatory && !state.observatory.activated) {
        const obsCenterX =
          state.observatory.x + (state.observatory.width || 90) / 2;
        const obsCenterY =
          state.observatory.y + (state.observatory.height || 90) / 2;
        const playerCenterX = state.player.x + 20;
        const playerCenterY = state.player.y + 20;

        const distToObservatory = Math.hypot(
          playerCenterX - obsCenterX,
          playerCenterY - obsCenterY,
        );
        const activationRadius = 110;

        if (distToObservatory <= activationRadius) {
          state.observatory.status = "charging";
          // Progress increments by 22% per second (takes ~4.5 seconds of holding terminal range)
          state.observatory.progress = Math.min(
            100,
            (state.observatory.progress || 0) + deltaSec * 22,
          );

          const currentPct = Math.floor(state.observatory.progress);

          if (state.observatory.progress < 100) {
            state.observatoryNotice = `OBSERVATORY DATA UPLINK: ${currentPct}% (HOLD POSITION & DEFEND!)`;
          } else {
            state.observatory.status = "activated";
            state.observatory.activated = true;
            state.observatoryNotice =
              "MISSION ACCOMPLISHED! OBSERVATORY ACTIVATED — EXIT WARP GATE UNSEALED!";
            if (state.exitGate) {
              state.exitGate.unsealed = true;
            }
            state.score += 500;
          }
        } else if (
          state.observatory.status === "charging" &&
          state.observatory.progress < 100
        ) {
          // Player stepped out of terminal range before reaching 100%
          state.observatory.progress = Math.max(
            0,
            state.observatory.progress - deltaSec * 15,
          );
          if (state.observatory.progress <= 0) {
            state.observatory.status = "unactivated";
            state.observatoryNotice = null;
          } else {
            const currentPct = Math.floor(state.observatory.progress);
            state.observatoryNotice = `WARNING: SIGNAL LOSS! RETURN TO TERMINAL RANGE (${currentPct}%)`;
          }
        }
      }

      // ==========================================
      // EXIT WARP GATE UNSEALED / LOCKED LOGIC
      // ==========================================
      if (state.exitGate) {
        const gateRight = state.exitGate.x + (state.exitGate.width || 80);
        const gateBottom = state.exitGate.y + (state.exitGate.height || 80);
        const playerRight = state.player.x + 30;
        const playerBottom = state.player.y + 30;

        const reachedExit =
          state.player.x < gateRight &&
          playerRight > state.exitGate.x &&
          state.player.y < gateBottom &&
          playerBottom > state.exitGate.y;

        if (reachedExit) {
          const isObservatoryRequired = !!state.observatory;
          const isActivated = state.observatory
            ? state.observatory.activated
            : true;

          if (isObservatoryRequired && !isActivated) {
            state.gateLockedNotice = true;
          } else {
            state.gateLockedNotice = false;
            state.score += 500;
            state.gameStatus = "victory";
          }
        } else {
          state.gateLockedNotice = false;
        }
      }

      // Item Notice Fade-out Timer
      if (state.lastItemNoticeTimer > 0) {
        state.lastItemNoticeTimer -= deltaSec;
        if (state.lastItemNoticeTimer <= 0) {
          state.lastItemNoticeTimer = 0;
          state.lastItemNotice = null;
        }
      }

      // Game Over Condition
      if (state.player.health <= 0 && !state.playerDefeatPending) {
        state.player.health = 0;
        state.playerDefeatPending = true;

        state.explosions.push({
          id: state.nextExplosionId++,
          x: state.player.x,
          y: state.player.y,
          type: "player",
          remainingMs: 1000,
        });

        state.explosionEvents += 1;
      }
    },

    // SPAWN PROJECTILE (SAFE ZONE CHECK ENFORCED HERE)
    spawnProjectile: (state) => {
      // SAFE ZONE RULE: Player CANNOT shoot while inside safe zone!
      if (state.player.inSafeZone) {
        state.weaponDisabledNotice = true;
        return;
      }
      state.weaponDisabledNotice = false;

      const pCenterX = state.player.x + 20;
      const pCenterY = state.player.y + 20;

      const dx = state.mouse.worldX - pCenterX;
      const dy = state.mouse.worldY - pCenterY;
      const len = Math.hypot(dx, dy);

      if (len > 0) {
        state.projectiles.push({
          x: pCenterX,
          y: pCenterY,
          dx: dx / len,
          dy: dy / len,
          speed: state.player.projectileSpeed || 5.5,
          damage: state.player.projectileDamage || 2.5,
          owner: "player",
          projectileType: state.player.projectileType || "comet",
          distanceTraveled: 0,
          maxDistance: 480,
        });
      }
    },

    clearNotice: (state) => {
      state.weaponDisabledNotice = false;
      state.observatoryNotice = null;
      state.gateLockedNotice = false;
      state.lastItemNotice = null;
    },

    // LOAD / RESET LEVEL STATE
    loadLevel: (state, action) => {
      const level = action.payload;

      state.currentLevelId = level.id || 1;
      state.currentLevelName = level.name || "Outer Sector Grid";
      state.arena = level.arena || { width: 2000, height: 1500 };

      state.gameStatus = "playing";
      state.survivalTime = 0;
      state.score = 0;
      state.enemiesKilled = 0;
      state.artifactsCollected = 0;
      state.takenDamage = false;
      state.weaponDisabledNotice = false;
      state.observatoryNotice = null;
      state.gateLockedNotice = false;
      state.lastItemNotice = null;
      state.difficultyLevel = "normal";

      state.safeZones = level.safeZones || [];
      state.walls = level.walls || [];
      state.pickups = level.pickups || [];

      state.observatory = level.observatory
        ? { ...level.observatory, activated: false }
        : null;

      state.exitGate = level.exitGate
        ? { ...level.exitGate, unsealed: false }
        : null;

      state.player.x = level.player?.x ?? 100;
      state.player.y = level.player?.y ?? 100;
      state.player.speed = level.player?.speed ?? 2.5;
      state.player.health = level.player?.health ?? 100;
      state.player.maxHealth = level.player?.health ?? 100;
      state.player.projectileSpeed = level.player?.projectileSpeed ?? 5.5;
      state.player.projectileDamage = level.player?.projectileDamage ?? 2.5;
      state.player.projectileType = level.player?.projectileType ?? "comet";
      state.player.dx = 0;
      state.player.dy = 0;
      state.player.rotation = 0;
      state.player.collided = false;
      state.player.inSafeZone = false;

      state.enemies = (level.enemies || []).map((enemy) => ({
        id: enemy.id || crypto.randomUUID(),
        ...enemy,
        guardX: enemy.x,
        guardY: enemy.y,
        health: enemy.health || 5,
        maxHealth: enemy.health || 5,
        collided: false,
        state: "idle",
        lastAttackTime: 0,
      }));

      state.projectiles = [];
    },

    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },

    // restoreCheckpoint: (state, action) => {
    //   const checkpoint = action.payload;

    //   if (!checkpoint || checkpoint.levelId !== state.currentLevelId) {
    //     return;
    //   }

    //   if (checkpoint.player) {
    //     state.player = {
    //       ...state.player,
    //       ...checkpoint.player,
    //       dx: 0,
    //       dy: 0,
    //       collided: false,
    //       inSafeZone: false,
    //     };
    //   }

    //   state.score = checkpoint.score ?? state.score;
    //   state.survivalTime = checkpoint.survivalTime ?? state.survivalTime;
    //   state.enemiesKilled = checkpoint.enemiesKilled ?? state.enemiesKilled;
    //   state.artifactsCollected =
    //     checkpoint.artifactsCollected ?? state.artifactsCollected;

    //   if (Array.isArray(checkpoint.enemies)) {
    //     state.enemies = checkpoint.enemies;
    //   }

    //   if (Array.isArray(checkpoint.pickups)) {
    //     state.pickups = checkpoint.pickups;
    //   }

    //   if (checkpoint.observatory) {
    //     state.observatory = checkpoint.observatory;
    //   }

    //   if (checkpoint.exitGate) {
    //     state.exitGate = checkpoint.exitGate;
    //   }

    //   state.takenDamage = checkpoint.takenDamage ?? false;
    //   state.projectiles = [];
    //   state.gameStatus = "playing";
    // },
  },
});

export const {
  setDirection,
  setMousePosition,
  updatePosition,
  spawnProjectile,
  clearNotice,
  loadLevel,
  setGameStatus,
  // restoreCheckpoint,
} = entitySlice.actions;

export const store = configureStore({
  reducer: {
    entities: entitySlice.reducer,
  },
});
