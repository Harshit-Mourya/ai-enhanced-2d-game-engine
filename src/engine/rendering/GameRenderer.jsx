import { useSelector } from "react-redux";

import BackgroundLayer from "./layers/BackgroundLayer";
import GridLayer from "./layers/GridLayer";
import ArenaBorderLayer from "./layers/ArenaBorderLayer";
import SafeZoneLayer from "./layers/SafeZoneLayer";
import DetectionLayer from "./layers/DetectionLayer";
import EntityLayer from "./layers/EntityLayer";
import UILayer from "./layers/UILayer";
import WallLayer from "./layers/WallLayer";

export default function GameRenderer() {
  const { player, enemies, safeZones, walls } = useSelector(
    (state) => state.entities,
  );

  const width = 1000;
  const height = 700;

  return (
    <svg
      width={width}
      height={height}
      style={{
        background: "#020617",
        display: "block",
        margin: "auto",
      }}
    >
      <BackgroundLayer width={width} height={height} />

      <GridLayer width={width} height={height} />

      <WallLayer walls={walls} />

      <SafeZoneLayer safeZones={safeZones} />

      <ArenaBorderLayer width={width} height={height} />

      <DetectionLayer enemies={enemies} />

      <EntityLayer entities={[{ ...player, type: "player" }, ...enemies]} />

      <UILayer />
    </svg>
  );
}
