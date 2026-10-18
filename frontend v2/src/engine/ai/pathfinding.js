/**
 * Pathfinding Utilities: A* and BFS algorithms for Maze Engine AI
 */

const TILE_SIZE = 40;

function toGrid(val) {
  return Math.floor(val / TILE_SIZE);
}

function toWorld(gridVal) {
  return gridVal * TILE_SIZE + TILE_SIZE / 2;
}

// Checks if a grid cell overlaps with any wall in the maze
export function isCellBlocked(col, row, walls) {
  if (col < 0 || row < 0) return true;
  const cellX = col * TILE_SIZE;
  const cellY = row * TILE_SIZE;
  const margin = 2;

  return walls.some((wall) => {
    return (
      cellX + margin < wall.x + wall.width &&
      cellX + TILE_SIZE - margin > wall.x &&
      cellY + margin < wall.y + wall.height &&
      cellY + TILE_SIZE - margin > wall.y
    );
  });
}

/**
 * A* Pathfinding algorithm for intelligent pursuit avoiding walls
 */
export function findPathAStar(startX, startY, targetX, targetY, walls, maxCols = 64, maxRows = 48) {
  const startCol = toGrid(startX);
  const startRow = toGrid(startY);
  const targetCol = toGrid(targetX);
  const targetRow = toGrid(targetY);

  if (startCol === targetCol && startRow === targetRow) {
    return [{ x: targetX, y: targetY }];
  }

  const startKey = `${startCol},${startRow}`;
  const targetKey = `${targetCol},${targetRow}`;

  const openSet = new Set([startKey]);
  const cameFrom = new Map();

  const gScore = new Map();
  gScore.set(startKey, 0);

  const fScore = new Map();
  const heuristic = (c1, r1, c2, r2) => Math.abs(c1 - c2) + Math.abs(r1 - r2);
  fScore.set(startKey, heuristic(startCol, startRow, targetCol, targetRow));

  const neighbors = [
    { dc: 0, dr: -1 }, // North
    { dc: 0, dr: 1 },  // South
    { dc: -1, dr: 0 }, // West
    { dc: 1, dr: 0 },  // East
  ];

  let iterations = 0;
  const maxIterations = 300;

  while (openSet.size > 0 && iterations < maxIterations) {
    iterations++;

    let currentKey = null;
    let lowestF = Infinity;
    for (const key of openSet) {
      const score = fScore.get(key) ?? Infinity;
      if (score < lowestF) {
        lowestF = score;
        currentKey = key;
      }
    }

    if (!currentKey) break;

    const [c, r] = currentKey.split(",").map(Number);

    if (currentKey === targetKey) {
      const path = [];
      let curr = currentKey;
      while (cameFrom.has(curr)) {
        const [cc, rr] = curr.split(",").map(Number);
        path.unshift({ x: toWorld(cc), y: toWorld(rr) });
        curr = cameFrom.get(curr);
      }
      return path;
    }

    openSet.delete(currentKey);

    for (const { dc, dr } of neighbors) {
      const neighborCol = c + dc;
      const neighborRow = r + dr;

      if (neighborCol < 0 || neighborRow < 0 || neighborCol >= maxCols || neighborRow >= maxRows) {
        continue;
      }

      if (isCellBlocked(neighborCol, neighborRow, walls)) {
        continue;
      }

      const neighborKey = `${neighborCol},${neighborRow}`;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + heuristic(neighborCol, neighborRow, targetCol, targetRow));
        openSet.add(neighborKey);
      }
    }
  }

  return [{ x: targetX, y: targetY }];
}

/**
 * BFS algorithm for corridor navigation and patrol pathing
 */
export function findNextBFSWaypoint(startX, startY, waypoints) {
  if (!waypoints || waypoints.length === 0) return null;

  let closestWp = waypoints[0];
  let minDistance = Infinity;

  for (const wp of waypoints) {
    const dist = Math.hypot(wp.x - startX, wp.y - startY);
    if (dist < minDistance) {
      minDistance = dist;
      closestWp = wp;
    }
  }

  return closestWp;
}
