export function resolveWallCollision(entity, walls) {
  if (!walls || walls.length === 0) return;

  walls.forEach((wall) => {
    const entitySize = 40;

    const entityRight = entity.x + entitySize;
    const entityBottom = entity.y + entitySize;

    const wallRight = wall.x + wall.width;
    const wallBottom = wall.y + wall.height;

    const collision =
      entity.x < wallRight &&
      entityRight > wall.x &&
      entity.y < wallBottom &&
      entityBottom > wall.y;

    if (collision) {
      const overlapLeft = entityRight - wall.x;
      const overlapRight = wallRight - entity.x;

      const overlapTop = entityBottom - wall.y;
      const overlapBottom = wallBottom - entity.y;

      const minOverlapX =
        overlapLeft < overlapRight ? -overlapLeft : overlapRight;

      const minOverlapY =
        overlapTop < overlapBottom ? -overlapTop : overlapBottom;

      if (Math.abs(minOverlapX) < Math.abs(minOverlapY)) {
        entity.x += minOverlapX;
      } else {
        entity.y += minOverlapY;
      }
    }
  });
}
