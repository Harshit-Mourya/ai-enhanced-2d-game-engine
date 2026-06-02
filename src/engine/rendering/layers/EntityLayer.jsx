import astronautHeadSVG from "../../../assets/characters/astronaut-head.svg";

import ufo5SVG from "../../../assets/characters/ufo-5.svg";
import ufo3SVG from "../../../assets/characters/ufo-3.svg";
import moonRoverSVG from "../../../assets/characters/moon-rover-0.svg";

export default function EntityLayer({ entities }) {
  if (!entities) return null;

  return (
    <>
      {entities.map((entity) => {
        // ===============================
        // PLAYER
        // ===============================

        if (entity.type === "player") {
          return (
            <image
              key="player"
              href={astronautHeadSVG}
              x={entity.x}
              y={entity.y}
              width="40"
              height="40"
            />
          );
        }

        // ===============================
        // ENEMIES
        // ===============================

        if (entity.type === "enemy") {
          let enemySVG = ufo5SVG;

          if (entity.enemyClass === "hunter") {
            enemySVG = ufo3SVG;
          }

          if (entity.enemyClass === "tank") {
            enemySVG = moonRoverSVG;
          }
          // console.log("Rendering enemy", entity);
          return (
            <g key={entity.id}>
              <image
                href={enemySVG}
                x={entity.x}
                y={entity.y}
                width="40"
                height="40"
              />
            </g>
          );
        }

        return null;
      })}
    </>
  );
}
