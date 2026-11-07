import { useDispatch } from "react-redux";
import { setMousePosition } from "../state/store";
import { shoot } from "../input/shootingHandler";
import GameRenderer from "./GameRenderer";

export default function SvgRenderer({ portalAnimation }) {
  const dispatch = useDispatch();

  return (
    <svg
      width="1000"
      height="700"
      className="cursor-crosshair border border-slate-800 bg-[#040711] shadow-2xl rounded-2xl overflow-hidden select-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        dispatch(
          setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }),
        );
      }}
      onMouseDown={(e) => {
        // Left click to fire laser weapon
        if (e.button === 0) {
          shoot(dispatch);
        }
      }}
    >
      <GameRenderer portalAnimation={portalAnimation} />{" "}
    </svg>
  );
}
