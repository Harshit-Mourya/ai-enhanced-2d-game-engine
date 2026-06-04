export default function PauseMenu({ isPaused, onResume, onRestart, onExit }) {
  if (!isPaused) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[320px] rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
        <h1 className="mb-8 text-4xl font-bold text-sky-400">GAME PAUSED</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            className="rounded-xl bg-sky-500 py-3 font-bold transition hover:scale-105 hover:bg-sky-400"
          >
            RESUME
          </button>

          <button
            onClick={onRestart}
            className="rounded-xl bg-yellow-500 py-3 font-bold transition hover:scale-105 hover:bg-yellow-400"
          >
            RESTART
          </button>

          <button
            onClick={onExit}
            className="rounded-xl bg-red-500 py-3 font-bold transition hover:scale-105 hover:bg-red-400"
          >
            EXIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
