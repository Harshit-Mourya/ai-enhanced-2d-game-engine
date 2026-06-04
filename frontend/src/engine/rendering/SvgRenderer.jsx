import { useDispatch, useSelector } from "react-redux";

import { setMousePosition, spawnProjectile } from "../state/store";

import GameRenderer from "./GameRenderer";

export default function SvgRenderer() {
  const dispatch = useDispatch();

  const player = useSelector((state) => state.entities.player);

  const mouse = useSelector((state) => state.entities.mouse);

  return (
    <svg
      width="1000"
      height="700"
      className="border border-white bg-[#070404]"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        dispatch(
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }),
        );
      }}
      onClick={() => {
        console.log("CLICK");
        // const playerCenterX = player.x + 15;

        // const playerCenterY = player.y + 15;

        // const dx = mouse.x - playerCenterX;

        // const dy = mouse.y - playerCenterY;

        const dx = mouse.x - 500;
        const dy = mouse.y - 350;

        const length = Math.sqrt(dx * dx + dy * dy);

        const normalizedDx = dx / length;

        const normalizedDy = dy / length;

        dispatch(
          spawnProjectile({
            x: player.x + 20,
            y: player.y + 20,

            dx: normalizedDx,
            dy: normalizedDy,

            speed: player.projectileSpeed,

            damage: player.projectileDamage,

            owner: "player",

            projectileType: player.projectileType,
          }),
        );
      }}
    >
      <GameRenderer />
    </svg>
  );
}
