const keys = {};

export function initializeInput(dispatch, setDirection) {
  function updateDirection() {
    let dx = 0;
    let dy = 0;

    if (keys["ArrowRight"]) dx += 1;
    if (keys["ArrowLeft"]) dx -= 1;
    if (keys["ArrowUp"]) dy -= 1;
    if (keys["ArrowDown"]) dy += 1;

    dispatch(setDirection({ dx, dy }));
  }

  const handleKeyDown = (e) => {
    keys[e.key] = true;
    updateDirection();
  };

  const handleKeyUp = (e) => {
    keys[e.key] = false;
    updateDirection();
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
  };
}
