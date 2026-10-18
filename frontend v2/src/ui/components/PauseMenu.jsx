import { Play, RotateCcw, Home, Pause } from "lucide-react";

export default function PauseMenu({ isPaused, onResume, onRestart, onExit }) {
  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 select-none">
      <div className="w-90 rounded-3xl border border-sky-500/40 bg-slate-950/90 p-8 text-center shadow-[0_0_40px_rgba(14,165,233,0.3)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
          <Pause className="h-8 w-8 drop-shadow-[0_0_8px_#38bdf8]" />
        </div>

        <h1 className="mb-2 text-3xl font-extrabold tracking-wide text-sky-400">
          SYSTEM PAUSED
        </h1>
        <p className="mb-6 text-xs text-slate-400">
          Engine simulations suspended. Select an action to proceed.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 text-base font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] transition hover:scale-[1.02] hover:bg-sky-400"
          >
            <Play className="w-5 h-5 fill-white" /> RESUME SIMULATION
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" /> RESTART SECTOR
          </button>

          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/40 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-900/50"
          >
            <Home className="w-4 h-4" /> MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
