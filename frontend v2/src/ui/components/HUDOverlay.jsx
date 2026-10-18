import { useSelector } from "react-redux";
import { Shield, Heart, Zap, Crosshair, Award, Clock, Telescope, Lock, CheckCircle2 } from "lucide-react";

export default function HUDOverlay() {
  const player = useSelector((state) => state.entities.player);
  const survivalTime = useSelector((state) => state.entities.survivalTime);
  const difficultyLevel = useSelector((state) => state.entities.difficultyLevel);
  const enemies = useSelector((state) => state.entities.enemies);
  const score = useSelector((state) => state.entities.score);
  const currentLevelName = useSelector((state) => state.entities.currentLevelName);
  const currentLevelId = useSelector((state) => state.entities.currentLevelId);
  const weaponDisabledNotice = useSelector((state) => state.entities.weaponDisabledNotice);
  const observatoryNotice = useSelector((state) => state.entities.observatoryNotice);
  const gateLockedNotice = useSelector((state) => state.entities.gateLockedNotice);
  const observatory = useSelector((state) => state.entities.observatory);
  const exitGate = useSelector((state) => state.entities.exitGate);
  const lastItemNotice = useSelector((state) => state.entities.lastItemNotice);
  const artifactsCollected = useSelector((state) => state.entities.artifactsCollected);

  const hpPercent = Math.max(0, Math.min(100, (player.health / (player.maxHealth || 100)) * 100));

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 select-none">
      {/* Top HUD Bar */}
      <div className="flex justify-between items-start">
        {/* Left Stats Card */}
        <div className="flex flex-col gap-2.5 rounded-2xl border border-slate-800/90 bg-slate-950/80 p-3.5 backdrop-blur-md shadow-2xl w-64">
          {/* Health Bar */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500" /> VITAL SIGNS
              </span>
              <span className="text-white font-mono">{Math.round(player.health)} HP</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-emerald-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          {/* Weapon / Safe Zone Status & Stats */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1 text-slate-400">
              <Crosshair className="w-3 h-3 text-sky-400" /> WEAPON STATUS:
            </span>
            {player.inSafeZone ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                <Shield className="w-3 h-3" /> SAFE ZONE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sky-400 font-bold px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/30">
                <Zap className="w-3 h-3 text-sky-400" /> ARMED
              </span>
            )}
          </div>

          {/* Upgrades & Tech Stats */}
          <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/80 text-[10px] font-mono text-center">
            <div className="bg-slate-900/80 rounded border border-slate-800/80 p-1">
              <span className="text-slate-400 block">DMG</span>
              <span className="text-orange-400 font-bold">{(player.projectileDamage || 2.5).toFixed(1)}</span>
            </div>
            <div className="bg-slate-900/80 rounded border border-slate-800/80 p-1">
              <span className="text-slate-400 block">SPD</span>
              <span className="text-sky-400 font-bold">{(player.speed || 2.5).toFixed(1)}</span>
            </div>
            <div className="bg-slate-900/80 rounded border border-slate-800/80 p-1">
              <span className="text-slate-400 block">RELICS</span>
              <span className="text-amber-400 font-bold">{artifactsCollected || 0}</span>
            </div>
          </div>
        </div>

        {/* Center Alert Banner / Notices */}
        <div className="flex flex-col items-center gap-2 max-w-md">
          {lastItemNotice && (
            <div className="transition-all duration-300 ease-out transform scale-100 rounded-xl border border-amber-400/90 bg-amber-950/95 px-5 py-2.5 text-amber-100 shadow-2xl backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide">
                <Award className="w-4 h-4 text-amber-300" /> {lastItemNotice}
              </p>
            </div>
          )}

          {weaponDisabledNotice && (
            <div className="transition-all duration-300 ease-out rounded-xl border border-rose-500/50 bg-rose-950/90 px-5 py-2 text-rose-200 shadow-2xl backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide">
                <Shield className="w-3.5 h-3.5 text-rose-400" /> WEAPONS DISABLED INSIDE SAFE ZONE
              </p>
            </div>
          )}

          {gateLockedNotice && (
            <div className="animate-pulse rounded-xl border border-amber-500/80 bg-amber-950/95 px-5 py-2.5 text-amber-200 shadow-2xl backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide">
                <Lock className="w-4 h-4 text-amber-400" /> WARP GATE LOCKED! Activate Alien Observatory First!
              </p>
            </div>
          )}

          {observatoryNotice && (
            <div className="transition-all duration-300 rounded-xl border border-sky-400/80 bg-sky-950/95 px-5 py-2.5 text-sky-100 shadow-2xl backdrop-blur-md">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-sky-400" /> {observatoryNotice}
              </p>
            </div>
          )}

          {/* Mission Objective Bar */}
          <div className="rounded-xl border border-slate-700/80 bg-slate-900/85 px-4 py-1.5 backdrop-blur-md flex items-center gap-2.5 shadow-lg">
            <Telescope className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold text-slate-300">
              MISSION:
            </span>
            {observatory && observatory.status === "charging" && !observatory.activated ? (
              <span className="text-[11px] font-bold text-sky-400 animate-pulse">
                DATA UPLINK IN PROGRESS ({Math.floor(observatory.progress || 0)}%) — DEFEND POSITION!
              </span>
            ) : observatory && !observatory.activated ? (
              <span className="text-[11px] font-bold text-amber-400 animate-pulse">
                Find & Activate the Alien Observatory
              </span>
            ) : exitGate?.unsealed || (observatory && observatory.activated) ? (
              <span className="text-[11px] font-bold text-emerald-400">
                Observatory Activated! Warp Gate Unsealed — Escape!
              </span>
            ) : (
              <span className="text-[11px] font-bold text-sky-400">
                Navigate Maze & Reach Warp Gate
              </span>
            )}
          </div>
        </div>

        {/* Right Info Card */}
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/90 bg-slate-950/80 p-3.5 backdrop-blur-md shadow-2xl text-right w-64">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded-full">
              SECTOR {currentLevelId}
            </span>
            <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-full">
              {difficultyLevel}
            </span>
          </div>

          <h2 className="text-sm font-bold text-white tracking-wide">{currentLevelName}</h2>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
            <div className="text-left">
              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-sky-400" /> TIME
              </span>
              <p className="text-xs font-mono font-bold text-white">{survivalTime.toFixed(1)}s</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 flex items-center gap-1 justify-end text-[11px]">
                <Award className="w-3 h-3 text-emerald-400" /> SCORE
              </span>
              <p className="text-xs font-mono font-bold text-emerald-400">{score}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls / Radar Prompt */}
      <div className="flex justify-between items-end text-xs text-slate-400">
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 backdrop-blur-md flex items-center gap-4">
          <span><strong className="text-sky-400">WASD / ARROWS</strong> Move</span>
          <span><strong className="text-sky-400">MOUSE CLICK</strong> Fire Laser</span>
          <span><strong className="text-sky-400">ESC</strong> Pause</span>
          <span><strong className="text-sky-400">R</strong> Restart Level</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 backdrop-blur-md text-emerald-400 font-semibold">
          HOSTILE UFO GUARDS IN SECTOR: {enemies.length}
        </div>
      </div>
    </div>
  );
}
