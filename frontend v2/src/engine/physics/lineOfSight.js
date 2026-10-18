/**
 * Line of Sight (LOS) Raycasting Utilities
 * Checks whether a direct line between two points intersects any wall rectangles.
 */

// Line segment intersection with an axis-aligned box
function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Check if either endpoint is inside the rect
  if (x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) return true;
  if (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh) return true;

  // Rect sides as line segments
  const left = rx;
  const right = rx + rw;
  const top = ry;
  const bottom = ry + rh;

  return (
    lineIntersectsLine(x1, y1, x2, y2, left, top, right, top) ||
    lineIntersectsLine(x1, y1, x2, y2, right, top, right, bottom) ||
    lineIntersectsLine(x1, y1, x2, y2, right, bottom, left, bottom) ||
    lineIntersectsLine(x1, y1, x2, y2, left, bottom, left, top)
  );
}

// Line segment (x1,y1)-(x2,y2) vs (x3,y3)-(x4,y4)
function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return false; // Parallel

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

/**
 * Returns true if there is a clear line of sight between (x1,y1) and (x2,y2)
 * without hitting any wall in the walls array.
 */
export function hasLineOfSight(x1, y1, x2, y2, walls) {
  if (!walls || walls.length === 0) return true;

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    if (lineIntersectsRect(x1, y1, x2, y2, wall.x, wall.y, wall.width, wall.height)) {
      return false; // Vision blocked by wall
    }
  }

  return true; // Clear line of sight
}
