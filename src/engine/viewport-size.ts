export type ViewportSize = {
  width: number;
  height: number;
};

export function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}