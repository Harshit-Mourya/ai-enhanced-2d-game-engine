import level1 from "./level1.json";
import level2 from "./level2.json";
import level3 from "./level3.json";

export const levels = [level1, level2, level3];

export function getLevelById(id) {
  const found = levels.find((lvl) => lvl.id === id);
  return found || level1;
}

export function getNextLevel(currentId) {
  const nextId = currentId + 1;
  return levels.find((lvl) => lvl.id === nextId) || null;
}
