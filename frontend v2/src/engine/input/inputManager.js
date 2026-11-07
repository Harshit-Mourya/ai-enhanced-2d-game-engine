import { shoot } from "./shootingHandler";

const keys = {};

export function resetInputKeys(dispatch, setDirection) {
  for (const k in keys) {
    delete keys[k];
  }
  if (dispatch && setDirection) {
    dispatch(setDirection({ dx: 0, dy: 0 }));
  }
}

export function initializeInput(dispatch, setDirection) {
  function updateDirection() {
    let dx = 0;
    let dy = 0;

    if (keys["ArrowRight"] || keys["d"] || keys["D"]) dx += 1;
    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) dx -= 1;
    if (keys["ArrowUp"] || keys["w"] || keys["W"]) dy -= 1;
    if (keys["ArrowDown"] || keys["s"] || keys["S"]) dy += 1;

    dispatch(setDirection({ dx, dy }));
  }

  const handleKeyDown = (e) => {
    // Prevent default scrolling on arrow keys and space
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
    ) {
      e.preventDefault();
    }

    // Space key to fire laser weapon
    if (e.code === "Space" && !e.repeat) {
      shoot(dispatch);
    }

    keys[e.key] = true;
    updateDirection();
  };

  const handleKeyUp = (e) => {
    keys[e.key] = false;
    updateDirection();
  };

  const handleBlur = () => {
    resetInputKeys(dispatch, setDirection);
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleBlur);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleBlur);
  };
}
