import { useSelector } from "react-redux";
import BackgroundLayer from "./layers/BackgroundLayer";
import WallLayer from "./layers/WallLayer";
import SafeZoneLayer from "./layers/SafeZoneLayer";
import DetectionLayer from "./layers/DetectionLayer";
import EntityLayer from "./layers/EntityLayer";
import cometSVG from "../../assets/characters/comet.svg";
import meteoriteSVG from "../../assets/characters/meteorite.svg";

export default function GameRenderer({ portalAnimation }) {
  const {
    player,
    enemies,
    safeZones,
    walls,
    observatory,
    exitGate,
    pickups,
    projectiles,
    arena,
    explosions,
    playerDefeatPending,
  } = useSelector((state) => state.entities);

  const arenaWidth = arena?.width || 2000;
  const arenaHeight = arena?.height || 1500;

  // console.log("Player state:", {
  //   x: player.x,
  //   y: player.y,
  //   dx: player.dx,
  //   dy: player.dy,
  //   portalAnimation,
  // });

  return (
    <g
      transform={`translate(500 350) scale(1.5) translate(${-player.x - 20} ${-player.y - 20})`}
    >
      {/* Background Parallax & Nebula */}
      <BackgroundLayer width={arenaWidth} height={arenaHeight} />

      {/* Safe Zone Forcefield Domes */}
      <SafeZoneLayer safeZones={safeZones} />

      {/* Sci-Fi Maze Walls */}
      <WallLayer walls={walls} />

      {/* Enemy AI Detection Radius Rings */}
      <DetectionLayer enemies={enemies} />

      {/* Game Entities (Player, Enemies, Pickups, Observatory, Exit Gate) */}
      <EntityLayer
        player={player}
        enemies={enemies}
        pickups={pickups}
        observatory={observatory}
        exitGate={exitGate}
        explosions={explosions}
        playerDefeatPending={playerDefeatPending}
        portalAnimation={portalAnimation}
      />

      {/* Projectiles */}
      {projectiles.map((projectile, index) => {
        let projectileSVG = cometSVG;
        let projGlow = "drop-shadow-[0_0_8px_#38bdf8]";

        if (projectile.owner === "enemy") {
          projectileSVG = meteoriteSVG;
          projGlow = "drop-shadow-[0_0_8px_#ef4444]";
        }

        const angle =
          (Math.atan2(projectile.dy, projectile.dx) * 180) / Math.PI + 180;

        return (
          <image
            key={index}
            href={projectileSVG}
            x={projectile.x - 10}
            y={projectile.y - 10}
            width="20"
            height="20"
            transform={`rotate(${angle} ${projectile.x} ${projectile.y})`}
            className={projGlow}
          />
        );
      })}
    </g>
  );
}
