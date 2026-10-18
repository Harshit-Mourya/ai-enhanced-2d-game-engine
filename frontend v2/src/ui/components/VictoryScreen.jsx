import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveGameResult } from "../../services/db";
import { getNextLevel } from "../../engine/levels";
import { loadLevel, setDirection } from "../../engine/state/store";
import { resetInputKeys } from "../../engine/input/inputManager";
import { completeSector } from "../../services/progressService";
import confetti from "canvas-confetti";
import { Trophy, ArrowRight, RotateCcw, Home, Award } from "lucide-react";

export default function VictoryScreen({ isVisible, onRestart, onExit }) {
  const dispatch = useDispatch();
  const currentLevelId = useSelector((state) => state.entities.currentLevelId);
  const survivalTime = useSelector((state) => state.entities.survivalTime);
  const score = useSelector((state) => state.entities.score);
  const enemiesKilled = useSelector((state) => state.entities.enemiesKilled);
  const takenDamage = useSelector((state) => state.entities.takenDamage);
  const [completionSaved, setCompletionSaved] = useState(false);
  const [isSavingCompletion, setIsSavingCompletion] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const hasSavedRef = useRef(false);

  const nextLevel = getNextLevel(currentLevelId);

  useEffect(() => {
    if (!isVisible) {
      hasSavedRef.current = false;
      setCompletionSaved(false);
      setCompletionError("");
      return;
    }

    if (hasSavedRef.current) return;

    hasSavedRef.current = true;
    setIsSavingCompletion(true);
    setCompletionError("");

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Save authoritative sector completion to MongoDB.
    completeSector(currentLevelId, {
      score,
      survivalTime,
      enemiesKilled,
    })
      .then(() => {
        setCompletionSaved(true);
      })
      .catch((error) => {
        hasSavedRef.current = false;
        setCompletionError(
          error.message || "Unable to save sector completion.",
        );
      })
      .finally(() => {
        setIsSavingCompletion(false);
      });

    // Preserve the existing local achievement functionality.
    saveGameResult("guest", {
      level: currentLevelId,
      won: true,
      survivalTime,
      enemiesKilled,
      score,
      undamaged: !takenDamage,
    })
      .then(({ newUnlocks }) => {
        setUnlockedAchievements(newUnlocks || []);
      })
      .catch((error) => {
        console.error("Achievement save failed:", error.message);
      });
  }, [
    isVisible,
    currentLevelId,
    survivalTime,
    enemiesKilled,
    score,
    takenDamage,
    retryKey,
  ]);

  // useEffect(() => {
  //     if (isVisible && !hasSavedRef.current) {
  //       hasSavedRef.current = true;
  //       confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

  //       saveGameResult("guest", {
  //         level: currentLevelId,
  //         won: true,
  //         survivalTime,
  //         enemiesKilled,
  //         score,
  //         undamaged: !takenDamage,
  //       }).then(({ newUnlocks }) => {
  //         setUnlockedAchievements(newUnlocks || []);
  //       });
  //     } else if (!isVisible) {
  //       hasSavedRef.current = false;
  //     }
  //   }, [
  //     isVisible,
  //     currentLevelId,
  //     survivalTime,
  //     enemiesKilled,
  //     score,
  //     takenDamage,
  //   ]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 select-none">
      <div className="w-115 rounded-3xl border border-emerald-500/50 bg-slate-950/90 p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
          <Trophy className="h-10 w-10 drop-shadow-[0_0_10px_#10b981]" />
        </div>

        <h1 className="mb-2 text-3xl font-extrabold tracking-wide text-emerald-400">
          WARP GATE REACHED!
        </h1>
        <p className="mb-6 text-sm text-slate-400">
          Sector {currentLevelId} Cleared Successfully
        </p>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left text-xs">
          <div>
            <span className="text-slate-400">SURVIVAL TIME</span>
            <p className="text-lg font-mono font-bold text-white">
              {survivalTime.toFixed(1)}s
            </p>
          </div>
          <div>
            <span className="text-slate-400">FINAL SCORE</span>
            <p className="text-lg font-mono font-bold text-emerald-400">
              {score}
            </p>
          </div>
          <div>
            <span className="text-slate-400">HOSTILES NEUTRALIZED</span>
            <p className="text-lg font-mono font-bold text-sky-400">
              {enemiesKilled}
            </p>
          </div>
          <div>
            <span className="text-slate-400">DAMAGE STATUS</span>
            <p className="text-lg font-mono font-bold text-amber-400">
              {takenDamage ? "Hull Damaged" : "Flawless Shield"}
            </p>
          </div>
        </div>

        {/* Achievement Unlocked Popup */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-950/50 p-3 text-amber-300 text-xs text-left">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Award className="w-4 h-4 text-amber-400" /> ACHIEVEMENT UNLOCKED!
            </p>
            {unlockedAchievements.map((ach) => (
              <p key={ach.key} className="text-amber-200/90 font-medium">
                {ach.icon} <strong>{ach.title}</strong>: {ach.description}
              </p>
            ))}
          </div>
        )}
        {completionError && (
          <div className="mb-4 text-sm text-red-400">
            <p>{completionError}</p>
            <button
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-2 rounded-lg bg-red-900/50 px-4 py-2"
            >
              Retry Saving
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {nextLevel ? (
            <button
              onClick={() => {
                if (!completionSaved || isSavingCompletion) return;

                resetInputKeys(dispatch, setDirection);
                dispatch(loadLevel(nextLevel));
              }}
              disabled={!completionSaved || isSavingCompletion}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-base font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition hover:scale-[1.02] hover:bg-emerald-400"
            >
              {isSavingCompletion ? "SAVING PROGRESS..." : "NEXT SECTOR"}
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <p className="text-xs text-emerald-400 font-bold mb-1">
              🎉 ALL MAZE SECTORS COMPLETED! MAZE MASTER RECORD SAVED.
            </p>
          )}

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white transition hover:bg-sky-500"
          >
            <RotateCcw className="w-4 h-4" /> REPLAY SECTOR
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
