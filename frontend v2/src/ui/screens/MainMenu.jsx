import { useState, useEffect } from "react";
import { getOrCreateUserData } from "../../services/db";
import { levels } from "../../engine/levels";
import { Play, Layers, Trophy, Settings, User, Lock, Sparkles, Shield, Rocket } from "lucide-react";

export default function MainMenu({ onStartGame, onSettings, onAuth }) {
  const [activeModal, setActiveModal] = useState(null); // 'levels' | 'stats' | null
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    getOrCreateUserData("guest").then((data) => {
      setUserData(data);
    });
  }, []);

  const progress = userData?.progress || { unlockedLevels: 1, bestSurvivalTime: 0, totalScore: 0 };
  const stats = userData?.stats || { totalGames: 0, enemiesKilled: 0, totalSurvivalTime: 0, victories: 0 };
  const achievements = userData?.achievements || [];

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,#0f172a,#020617_80%)] text-white select-none overflow-hidden">
      {/* Background Ambient Stars & Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(14,165,233,0.15),transparent_50%)]" />

      {/* Main Container */}
      <div className="z-10 flex flex-col items-center text-center max-w-xl px-6">
        {/* Engine Badge */}
        <div className="mb-4 flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-950/60 px-4 py-1.5 text-xs font-bold tracking-widest text-sky-400 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-sky-400" /> REUSABLE 2D AI GAME ENGINE
        </div>

        {/* Title */}
        <h1 className="mb-2 text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-200 to-emerald-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
          ADAPTIVE MAZE ESCAPE
        </h1>

        <p className="mb-10 text-base text-slate-400 font-medium">
          Sci-Fi Survival with A* AI Pathfinding & Dynamic Difficulty
        </p>

        {/* Navigation Buttons */}
        <div className="flex w-72 flex-col gap-3.5">
          <button
            onClick={() => onStartGame(1)}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 text-base font-extrabold tracking-wider shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all hover:scale-105 hover:from-sky-400 hover:to-cyan-400"
          >
            <Play className="w-5 h-5 fill-white" /> QUICK START
          </button>

          <button
            onClick={() => setActiveModal("levels")}
            className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur-md transition-all hover:border-sky-500/50 hover:bg-slate-800"
          >
            <Layers className="w-4 h-4 text-sky-400" /> SECTOR SELECT ({progress.unlockedLevels}/3)
          </button>

          <button
            onClick={() => setActiveModal("stats")}
            className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-slate-800"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> ACHIEVEMENTS & STATS
          </button>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={onSettings}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" /> SETTINGS
            </button>

            <button
              onClick={onAuth}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800"
            >
              <User className="w-4 h-4 text-sky-400" /> ACCOUNT
            </button>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 text-xs text-slate-500 font-mono">
        MCA Major Project • IndexedDB Dexie Save Engine Active
      </div>

      {/* MODAL: LEVEL SELECT */}
      {activeModal === "levels" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-sky-500/30 bg-slate-950 p-6 text-left shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2">
                <Rocket className="w-5 h-5" /> SELECT MAZE SECTOR
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {levels.map((lvl) => {
                const isUnlocked = lvl.id <= progress.unlockedLevels;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveModal(null);
                        onStartGame(lvl.id);
                      }
                    }}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                      isUnlocked
                        ? "border-slate-800 bg-slate-900/90 hover:border-sky-500 hover:bg-slate-800 cursor-pointer"
                        : "border-slate-900 bg-slate-950/50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-400 uppercase">SECTOR {lvl.id}</span>
                        <h3 className="text-base font-bold text-white">{lvl.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Arena: {lvl.arena.width}x{lvl.arena.height} • Safe Zones: {lvl.safeZones.length}
                      </p>
                    </div>

                    {isUnlocked ? (
                      <span className="rounded-xl bg-sky-500/20 px-3 py-1.5 text-xs font-bold text-sky-400 border border-sky-500/40">
                        LAUNCH
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                        <Lock className="w-3.5 h-3.5" /> LOCKED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ACHIEVEMENTS & STATS */}
      {activeModal === "stats" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-950 p-6 text-left shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Trophy className="w-5 h-5" /> PILOT RECORDS & STATS
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-xs text-slate-400">BEST SURVIVAL</span>
                <p className="text-lg font-mono font-bold text-sky-400">{progress.bestSurvivalTime.toFixed(1)}s</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-xs text-slate-400">TOTAL SCORE</span>
                <p className="text-lg font-mono font-bold text-emerald-400">{progress.totalScore}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-xs text-slate-400">HOSTILES DESTROYED</span>
                <p className="text-lg font-mono font-bold text-amber-400">{stats.enemiesKilled}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="text-xs text-slate-400">VICTORIES</span>
                <p className="text-lg font-mono font-bold text-purple-400">{stats.victories}</p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              UNLOCKED ACHIEVEMENTS ({achievements.length}/5)
            </h3>

            <div className="space-y-2 mb-6 max-h-40 overflow-y-auto pr-1">
              {achievements.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No achievements unlocked yet. Complete maze runs to earn badges!</p>
              ) : (
                achievements.map((a) => (
                  <div key={a.id} className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-2.5 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300">{a.achievementKey}</span>
                      <p className="text-slate-400 text-[10px]">Unlocked on {new Date(a.unlockedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-amber-400 font-bold">✓ BADGE</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full rounded-xl bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
