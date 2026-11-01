import { useEffect, useState } from "react";
import { getOrCreateUserData } from "../../../services/db";

export default function DetectionLayer({ enemies }) {
  const [showDetectionRadius, setShowDetectionRadius] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getOrCreateUserData("guest").then((data) => {
      if (!cancelled) {
        setShowDetectionRadius(data.settings?.showDetectionRadius ?? true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!showDetectionRadius || !enemies) return null;

  return (
    <>
      {enemies.map((enemy) => (
        <circle
          key={`detect-${enemy.id}`}
          cx={enemy.x + 20}
          cy={enemy.y + 20}
          r={enemy.detectionRadius}
          stroke="#facc15"
          strokeDasharray="4"
          opacity="0.2"
          fill="none"
        />
      ))}
    </>
  );
}
