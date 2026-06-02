export default function VictoryScreen({ isVisible, onRestart, onExit }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 text-center shadow-2xl">
        <h1 className="mb-4 text-5xl font-extrabold tracking-wide text-emerald-400">
          MISSION COMPLETE
        </h1>

        <p className="mb-8 text-slate-400">
          You successfully escaped the maze.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={onRestart}
            className="rounded-xl bg-sky-500 py-3 font-bold transition hover:scale-105 hover:bg-sky-400"
          >
            PLAY AGAIN
          </button>

          <button
            onClick={onExit}
            className="rounded-xl bg-emerald-500 py-3 font-bold transition hover:scale-105 hover:bg-emerald-400"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
