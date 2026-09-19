import type { ViewportSize } from "./viewport-size";

/**
 * Make the canvas drawing buffer use the same coordinate
 * system as the viewport used by the game layout.
 *
 * The CSS size and drawing-buffer size are deliberately
 * handled independently. Pointer input converts from the
 * CSS/client coordinate system into this drawing-buffer
 * coordinate system.
 */
export function resizeCanvasToViewport(
  canvas: HTMLCanvasElement,
  viewport: ViewportSize,
) {
  if (
    canvas.width !== viewport.width ||
    canvas.height !== viewport.height
  ) {
    canvas.width = viewport.width;
    canvas.height = viewport.height;
  }
}
