export type TouchInputState = {
  x: number;
  y: number;
  pressed: boolean;
};

export function createTouchInputState(): TouchInputState {
  return {
    x: 0,
    y: 0,
    pressed: false,
  };
}

export function attachTouchInput(
  state: TouchInputState,
  canvas: HTMLCanvasElement,
) {
  const updatePosition = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    /*
     * Convert CSS/client coordinates into canvas drawing-buffer
     * coordinates.
     *
     * The board uses drawing-buffer coordinates, so this conversion
     * must account for any difference between the CSS canvas size
     * and the actual canvas width/height.
     */
    state.x = (clientX - rect.left) * (canvas.width / rect.width);
    state.y = (clientY - rect.top) * (canvas.height / rect.height);
  };

  canvas.addEventListener('pointerdown', (event) => {
    updatePosition(event.clientX, event.clientY);
    state.pressed = true;
  });

  canvas.addEventListener('pointermove', (event) => {
    updatePosition(event.clientX, event.clientY);
  });
}

export function clearTouchPressed(state: TouchInputState) {
  state.pressed = false;
}