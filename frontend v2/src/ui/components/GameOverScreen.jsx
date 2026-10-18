import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { saveGameResult } from "../../services/db";
import { RotateCcw, Home, Skull } from "lucide-react";

export default function GameOverScreen({ isVisible, onRestart, onExit }) {
  const currentLevelId = useSelector((state) => state.entities.currentLevelId);
  const survivalTime = useSelector((state) => state.entities.survivalTime);
  const score = useSelector((state) => state.entities.score);
  const enemiesKilled = useSelector((state) => state.entities.enemiesKilled);

  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (isVisible && !hasSavedRef.current) {
      hasSavedRef.current = true;
      saveGameResult("guest", {
        level: currentLevelId,
        won: false,
        survivalTime,
        enemiesKilled,
        score,
        undamaged: false,
      });
    } else if (!isVisible) {
      hasSavedRef.current = false;
    }
  }, [isVisible, currentLevelId, survivalTime, enemiesKilled, score]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-50 select-none">
      <div className="w-105 rounded-3xl border border-rose-500/40 bg-slate-950/90 p-8 text-center shadow-[0_0_40px_rgba(244,63,94,0.3)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-500">
          <Skull className="h-10 w-10 drop-shadow-[0_0_10px_#f43f5e]" />
        </div>

        <h1 className="mb-2 text-3xl font-extrabold tracking-wide text-rose-500">
          CRITICAL FAILURE
        </h1>
        <p className="mb-6 text-sm text-slate-400">
          Your vessel was destroyed in Sector {currentLevelId}
        </p>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left text-xs">
          <div>
            <span className="text-slate-400">SURVIVAL TIME</span>
            <p className="text-lg font-mono font-bold text-white">
              {survivalTime.toFixed(1)}s
            </p>
          </div>
          <div>
            <span className="text-slate-400">SCORE</span>
            <p className="text-lg font-mono font-bold text-sky-400">{score}</p>
          </div>
          <div>
            <span className="text-slate-400">ENEMIES DESTROYED</span>
            <p className="text-lg font-mono font-bold text-amber-400">
              {enemiesKilled}
            </p>
          </div>
          <div>
            <span className="text-slate-400">STATUS</span>
            <p className="text-lg font-mono font-bold text-rose-400">
              Hull Destroyed
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 text-base font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] transition hover:scale-[1.02] hover:bg-sky-400"
          >
            <RotateCcw className="w-5 h-5" /> RESTART SECTOR
          </button>

          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800"
          >
            <Home className="w-4 h-4" /> MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
