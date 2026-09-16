export type TouchInputState = {
  pressed: boolean;
  x: number;
  y: number;
  canvas: HTMLCanvasElement | null;
};

export function createTouchInputState(): TouchInputState {
  return {
    pressed: false,
    x: 0,
    y: 0,
    canvas: null,
  };
}

export function attachTouchInput(
  state: TouchInputState,
  canvas: HTMLCanvasElement,
) {
  state.canvas = canvas;

  canvas.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const rect = canvas.getBoundingClientRect();
      state.x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      state.y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
      state.pressed = true;
      e.preventDefault();
    },
    { passive: false },
  );
}

export function clearTouchPressed(state: TouchInputState) {
  state.pressed = false;
}

export function isTouchPressed(state: TouchInputState) {
  return state.pressed;
}
