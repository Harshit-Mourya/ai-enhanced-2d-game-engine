export default function EntityLayer({ entities }) {
  if (!entities) return null;

  return (
    <>
      {entities.map((entity) => {
        if (entity.type === "player") {
          return (
            <rect
              key="player"
              x={entity.x}
              y={entity.y}
              width="30"
              height="30"
              fill="#22d3ee"
            />
          );
        }

        if (entity.type === "enemy") {
          return (
            <rect
              key={entity.id}
              x={entity.x}
              y={entity.y}
              width="30"
              height="30"
              fill="#ef4444"
            />
          );
        }

        return null;
      })}
    </>
  );
}
