export default function GameOverScreen({ isVisible, onRestart, onExit }) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[380px] rounded-3xl border border-red-500/40 bg-slate-900/90 p-8 text-center shadow-2xl">
        <h1 className="mb-4 text-5xl font-extrabold tracking-wide text-red-500">
          GAME OVER
        </h1>

        <p className="mb-8 text-slate-400">
          The maze has consumed another explorer.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={onRestart}
            className="rounded-xl bg-sky-500 py-3 font-bold transition hover:scale-105 hover:bg-sky-400"
          >
            RESTART
          </button>

          <button
            onClick={onExit}
            className="rounded-xl bg-red-500 py-3 font-bold transition hover:scale-105 hover:bg-red-400"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
