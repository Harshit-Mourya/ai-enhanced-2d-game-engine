import { useSelector } from "react-redux";

import BackgroundLayer from "./layers/BackgroundLayer";
import GridLayer from "./layers/GridLayer";
import ArenaBorderLayer from "./layers/ArenaBorderLayer";
import SafeZoneLayer from "./layers/SafeZoneLayer";
import DetectionLayer from "./layers/DetectionLayer";
import EntityLayer from "./layers/EntityLayer";
import WallLayer from "./layers/WallLayer";
import SVGMazeLayer from "./layers/SVGMazeLayer";
import cometSVG from "../../assets/characters/comet.svg";

import meteoriteSVG from "../../assets/characters/meteorite.svg";

import shootingStarSVG from "../../assets/characters/shooting-star.svg";

export default function GameRenderer() {
  const { player, enemies, safeZones, walls, exitGate, projectiles } =
    useSelector((state) => state.entities);
  // console.log(enemies);
  // console.log(enemies[0]);
  const cameraX = player.x - 500;
  const cameraY = player.y - 350;

  const width = 1000;
  const height = 700;

  return (
    <>
      <g
        transform={`translate(500 350)
    scale(1.5)
    translate(${-player.x} ${-player.y})
`}
      >
        {/* <BackgroundLayer width={width} height={height} /> */}

        {/* <GridLayer width={width} height={height} /> */}
        {/* <SVGMazeLayer /> */}

        <WallLayer walls={walls} />

        {/* <SafeZoneLayer safeZones={safeZones} /> */}

        {/* {exitGate && (
          <rect
            x={exitGate.x}
            y={exitGate.y}
            width={exitGate.width}
            height={exitGate.height}
            rx="8"
            fill="#22c55e"
            stroke="#86efac"
            strokeWidth="3"
          />
        )} */}

        {/* <ArenaBorderLayer width={width} height={height} /> */}

        {/* <DetectionLayer enemies={enemies} />

        <EntityLayer entities={[{ ...player, type: "player" }, ...enemies]} /> */}

        <DetectionLayer enemies={enemies} />

        {/* {enemies.map((enemy, index) => (
          <circle key={index} cx={enemy.x} cy={enemy.y} r="30" fill="red" />
        ))} */}

        <EntityLayer
          entities={[
            { ...player, type: "player" },

            ...enemies.map((enemy) => ({
              ...enemy,
              type: "enemy",
            })),
          ]}
        />
        {projectiles.map((projectile, index) => {
          let projectileSVG = cometSVG;

          if (projectile.projectileType === "meteor") {
            projectileSVG = meteoriteSVG;
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
            />
          );
        })}
      </g>
    </>
  );
}
