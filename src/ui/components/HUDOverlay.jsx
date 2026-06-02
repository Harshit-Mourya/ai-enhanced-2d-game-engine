import { useSelector } from "react-redux";

export default function HUDOverlay() {
  const player = useSelector((state) => state.entities.player);

  const survivalTime = useSelector((state) => state.entities.survivalTime);

  const difficultyLevel = useSelector(
    (state) => state.entities.difficultyLevel,
  );

  const enemies = useSelector((state) => state.entities.enemies);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Top HUD */}

      <div className="flex justify-between p-6">
        {/* Left Side */}

        <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 backdrop-blur-md">
          <p className="text-lg font-semibold text-sky-400">
            Health:{" "}
            <span className="text-white">{Math.round(player.health)}</span>
          </p>

          <p className="text-lg font-semibold text-sky-400">
            Survival Time:{" "}
            <span className="text-white">{survivalTime.toFixed(1)}s</span>
          </p>

          <p className="text-lg font-semibold text-sky-400">
            Difficulty:{" "}
            <span className="uppercase text-white">{difficultyLevel}</span>
          </p>

          <p className="text-lg font-semibold text-sky-400">
            Enemies: <span className="text-white">{enemies.length}</span>
          </p>
        </div>

        {/* Right Side */}

        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4 backdrop-blur-md">
          <p className="text-lg font-semibold text-emerald-400">
            Adaptive Maze Escape
          </p>

          <p className="mt-2 text-sm text-slate-400">
            AI-Enhanced Real-Time Engine
          </p>
        </div>
      </div>
    </div>
  );
}
