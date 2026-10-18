import spacecraft0SVG from "../../../assets/characters/spacecraft-0.svg";
import ufo5SVG from "../../../assets/characters/ufo-5.svg";
import ufo3SVG from "../../../assets/characters/ufo-3.svg";
import moonRoverSVG from "../../../assets/characters/moon-rover-0.svg";
import capsuleSVG from "../../../assets/characters/capsule.svg";
import blackHoleSVG from "../../../assets/characters/black-hole.svg";
import observatorySVG from "../../../assets/characters/observatory.svg";
import cometSVG from "../../../assets/characters/comet.svg";
import constellationSVG from "../../../assets/characters/constellation.svg";
import starsSVG from "../../../assets/characters/stars.svg";
import satelliteSVG from "../../../assets/characters/satellite-0.svg";
import orbitSVG from "../../../assets/characters/orbit.svg";

export default function EntityLayer({
  player,
  enemies = [],
  pickups = [],
  observatory = null,
  exitGate = null,
}) {
  return (
    <g className="select-none">
      {/* =============================== */}
      {/* ALIEN OBSERVATORY OBJECTIVE */}
      {/* =============================== */}
      {observatory && (
        <g key="observatory">
          {/* Signal Pulse Rings */}
          <circle
            cx={observatory.x + (observatory.width || 90) / 2}
            cy={observatory.y + (observatory.height || 90) / 2}
            r="65"
            fill="none"
            stroke={observatory.activated ? "#38bdf8" : "#f59e0b"}
            strokeWidth="2"
            strokeDasharray="6 4"
            className="animate-spin-slow"
          />
          <circle
            cx={observatory.x + (observatory.width || 90) / 2}
            cy={observatory.y + (observatory.height || 90) / 2}
            r="45"
            fill={observatory.activated ? "#0284c7" : "#d97706"}
            opacity="0.15"
            className="animate-pulse"
          />

          {/* Observatory Graphic */}
          <image
            href={observatorySVG}
            x={observatory.x}
            y={observatory.y}
            width={observatory.width || 90}
            height={observatory.height || 90}
            className={
              observatory.activated
                ? "drop-shadow-[0_0_25px_#38bdf8]"
                : "drop-shadow-[0_0_15px_#f59e0b]"
            }
          />

          {/* Label & Status */}
          <text
            x={observatory.x + (observatory.width || 90) / 2}
            y={observatory.y - 14}
            fill={observatory.activated ? "#38bdf8" : "#fbbf24"}
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            className="uppercase tracking-wider"
          >
            {observatory.name || "Alien Observatory"}
          </text>

          {/* Progress Bar during Uplink Sequence */}
          {observatory.status === "charging" && !observatory.activated && (
            <g>
              <rect
                x={observatory.x + (observatory.width || 90) / 2 - 50}
                y={observatory.y - 8}
                width="100"
                height="7"
                rx="3.5"
                fill="#0f172a"
                stroke="#0284c7"
                strokeWidth="1"
              />
              <rect
                x={observatory.x + (observatory.width || 90) / 2 - 50}
                y={observatory.y - 8}
                width={Math.min(100, Math.max(0, observatory.progress || 0))}
                height="7"
                rx="3.5"
                fill="#38bdf8"
                className="animate-pulse"
              />
            </g>
          )}

          <rect
            x={observatory.x + (observatory.width || 90) / 2 - 55}
            y={observatory.y + (observatory.height || 90) + 8}
            width="110"
            height="18"
            rx="4"
            fill={
              observatory.activated
                ? "#0369a1"
                : observatory.status === "charging"
                ? "#0284c7"
                : "#78350f"
            }
            stroke={observatory.activated || observatory.status === "charging" ? "#38bdf8" : "#f59e0b"}
            strokeWidth="1"
          />
          <text
            x={observatory.x + (observatory.width || 90) / 2}
            y={observatory.y + (observatory.height || 90) + 20}
            fill="#ffffff"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            className="uppercase tracking-widest"
          >
            {observatory.activated
              ? "✓ ACTIVATED"
              : observatory.status === "charging"
              ? `UPLINK: ${Math.floor(observatory.progress || 0)}%`
              : "APPROACH TO ACTIVATE"}
          </text>
        </g>
      )}

      {/* =============================== */}
      {/* EXIT WARP GATE (PORTAL) */}
      {/* =============================== */}
      {exitGate && (
        <g key="exit-gate">
          {/* Outer Pulsing Rift Ring */}
          <circle
            cx={exitGate.x + (exitGate.width || 80) / 2}
            cy={exitGate.y + (exitGate.height || 80) / 2}
            r="55"
            fill="none"
            stroke={exitGate.unsealed ? "#10b981" : "#ef4444"}
            strokeWidth="3"
            strokeDasharray="10 6"
            className={
              exitGate.unsealed
                ? "animate-spin-slow drop-shadow-[0_0_15px_#10b981]"
                : "drop-shadow-[0_0_10px_#ef4444]"
            }
          />

          {/* Locked Shield Barrier */}
          {!exitGate.unsealed && (
            <circle
              cx={exitGate.x + (exitGate.width || 80) / 2}
              cy={exitGate.y + (exitGate.height || 80) / 2}
              r="40"
              fill="#ef4444"
              opacity="0.3"
              stroke="#f87171"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}

          {/* Portal Graphic */}
          <image
            href={blackHoleSVG}
            x={exitGate.x}
            y={exitGate.y}
            width={exitGate.width || 80}
            height={exitGate.height || 80}
            className={
              exitGate.unsealed
                ? "drop-shadow-[0_0_20px_#10b981]"
                : "opacity-60 drop-shadow-[0_0_10px_#ef4444]"
            }
          />

          {/* Label & Status */}
          <text
            x={exitGate.x + (exitGate.width || 80) / 2}
            y={exitGate.y - 12}
            fill={exitGate.unsealed ? "#34d399" : "#f87171"}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            className="uppercase tracking-widest"
          >
            {exitGate.name || "Warp Gate"}
          </text>

          <text
            x={exitGate.x + (exitGate.width || 80) / 2}
            y={exitGate.y + (exitGate.height || 80) + 16}
            fill={exitGate.unsealed ? "#34d399" : "#f87171"}
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            className="uppercase tracking-wider"
          >
            {exitGate.unsealed ? "GATE UNSEALED - ESCAPE" : "GATE LOCKED (OBSERVATORY REQUIRED)"}
          </text>
        </g>
      )}

      {/* =============================== */}
      {/* SCI-FI COLLECTIBLES & PICKUPS */}
      {/* =============================== */}
      {pickups.map((pickup) => {
        let pickupSVG = capsuleSVG;
        let auraColor = "#0ea5e9";
        let labelColor = "#38bdf8";
        let labelText = "+25 HP";
        let glowClass = "drop-shadow-[0_0_8px_#38bdf8]";

        if (pickup.type === "plasma-cell") {
          pickupSVG = cometSVG;
          auraColor = "#f97316";
          labelColor = "#fb923c";
          labelText = "PLASMA CELL";
          glowClass = "drop-shadow-[0_0_12px_#f97316]";
        } else if (pickup.type === "quantum-crystal") {
          pickupSVG = constellationSVG;
          auraColor = "#a855f7";
          labelColor = "#c084fc";
          labelText = "QUANTUM CRYSTAL";
          glowClass = "drop-shadow-[0_0_12px_#a855f7]";
        } else if (pickup.type === "ancient-artifact") {
          pickupSVG = starsSVG;
          auraColor = "#eab308";
          labelColor = "#fde047";
          labelText = "ANCIENT RELIC";
          glowClass = "drop-shadow-[0_0_12px_#eab308]";
        } else if (pickup.type === "research-data") {
          pickupSVG = satelliteSVG;
          auraColor = "#06b6d4";
          labelColor = "#22d3ee";
          labelText = "RESEARCH MODULE";
          glowClass = "drop-shadow-[0_0_10px_#06b6d4]";
        } else if (pickup.type === "energy-core") {
          pickupSVG = orbitSVG;
          auraColor = "#10b981";
          labelColor = "#34d399";
          labelText = "ENERGY CORE";
          glowClass = "drop-shadow-[0_0_10px_#10b981]";
        }

        return (
          <g key={pickup.id || `${pickup.x}-${pickup.y}`}>
            {/* Glowing Aura Ring */}
            <circle
              cx={pickup.x}
              cy={pickup.y}
              r="22"
              fill={auraColor}
              opacity="0.25"
              className="animate-pulse"
            />
            <circle
              cx={pickup.x}
              cy={pickup.y}
              r="14"
              fill="none"
              stroke={auraColor}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="animate-spin-slow"
            />
            <image
              href={pickupSVG}
              x={pickup.x - 15}
              y={pickup.y - 15}
              width="30"
              height="30"
              className={glowClass}
            />
            <text
              x={pickup.x}
              y={pickup.y + 26}
              fill={labelColor}
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              className="tracking-wider uppercase"
            >
              {labelText}
            </text>
          </g>
        );
      })}

      {/* =============================== */}
      {/* ENEMIES */}
      {/* =============================== */}
      {enemies.map((enemy) => {
        let enemySVG = ufo5SVG;
        let badgeColor = "#38bdf8";
        if (enemy.enemyClass === "hunter") {
          enemySVG = ufo3SVG;
          badgeColor = "#f59e0b";
        } else if (enemy.enemyClass === "tank") {
          enemySVG = moonRoverSVG;
          badgeColor = "#ef4444";
        }

        const hpPercent = Math.max(0, (enemy.health / (enemy.maxHealth || 5)) * 100);

        return (
          <g key={enemy.id}>
            {/* Health Bar above enemy */}
            <rect
              x={enemy.x}
              y={enemy.y - 12}
              width="40"
              height="4"
              fill="#1e293b"
              rx="2"
            />
            <rect
              x={enemy.x}
              y={enemy.y - 12}
              width={(40 * hpPercent) / 100}
              height="4"
              fill={hpPercent > 50 ? "#22c55e" : hpPercent > 25 ? "#eab308" : "#ef4444"}
              rx="2"
            />

            {/* AI FSM State Tag */}
            <text
              x={enemy.x + 20}
              y={enemy.y - 16}
              fill={badgeColor}
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              className="uppercase tracking-wider"
            >
              {enemy.state || "GUARDING"}
            </text>

            {/* Enemy Alien/Robot SVG Graphic */}
            <image
              href={enemySVG}
              x={enemy.x}
              y={enemy.y}
              width="40"
              height="40"
              className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            />
          </g>
        );
      })}

      {/* =============================== */}
      {/* PLAYER SPACESHIP */}
      {/* =============================== */}
      {player && (
        <g key="player">
          {/* Safe Zone Forcefield Shield */}
          {player.inSafeZone && (
            <circle
              cx={player.x + 20}
              cy={player.y + 20}
              r="28"
              fill="#10b981"
              opacity="0.25"
              stroke="#34d399"
              strokeWidth="2"
              className="animate-pulse drop-shadow-[0_0_10px_#10b981]"
            />
          )}

          {/* Spaceship Graphic with Rotation pointing at cursor */}
          <image
            href={spacecraft0SVG}
            x={player.x}
            y={player.y}
            width="40"
            height="40"
            transform={`rotate(${(player.rotation || 0) + 90} ${player.x + 20} ${player.y + 20})`}
            className="drop-shadow-[0_0_12px_#38bdf8]"
          />

          {/* Engine Thrust Glow behind ship */}
          {(player.dx !== 0 || player.dy !== 0) && (
            <circle
              cx={player.x + 20 - Math.cos(((player.rotation || 0) * Math.PI) / 180) * 18}
              cy={player.y + 20 - Math.sin(((player.rotation || 0) * Math.PI) / 180) * 18}
              r="5"
              fill="#38bdf8"
              className="animate-ping"
            />
          )}
        </g>
      )}
    </g>
  );
}
