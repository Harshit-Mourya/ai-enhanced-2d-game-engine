export default function MainMenu({ onStartGame, onSettings, onAuth }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#0f172a,_#020617_70%)] text-white">
      <h1 className="mb-3 text-6xl font-extrabold text-sky-400 drop-shadow-[0_0_20px_#38bdf8]">
        Adaptive Maze Escape
      </h1>

      <p className="mb-12 text-lg text-slate-400">
        AI-Enhanced Real-Time Sci-Fi Survival
      </p>

      <div className="flex w-[260px] flex-col gap-5">
        <button
          onClick={onStartGame}
          className="rounded-xl bg-sky-500 px-6 py-4 text-lg font-bold tracking-wide shadow-[0_0_15px_rgba(14,165,233,0.5)] transition hover:scale-105 hover:bg-sky-400"
        >
          START GAME
        </button>

        <button
          onClick={onAuth}
          className="rounded-xl bg-sky-500 px-6 py-4 text-lg font-bold tracking-wide shadow-[0_0_15px_rgba(14,165,233,0.5)] transition hover:scale-105 hover:bg-sky-400"
        >
          ACCOUNT
        </button>

        <button
          onClick={onSettings}
          className="rounded-xl bg-sky-500 px-6 py-4 text-lg font-bold tracking-wide shadow-[0_0_15px_rgba(14,165,233,0.5)] transition hover:scale-105 hover:bg-sky-400"
        >
          SETTINGS
        </button>
      </div>
    </div>
  );
}
