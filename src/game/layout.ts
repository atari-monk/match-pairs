import type { ViewportSize } from '../engine/viewport-size';

const SCORE_HEIGHT_RATIO = 0.18;
const MIN_SCORE_HEIGHT = 64;
const MAX_SCORE_HEIGHT = 120;

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GameLayout = {
  score: Rect;
  board: Rect;
};

function getScoreHeight(
  viewport: ViewportSize,
): number {
  return Math.min(
    MAX_SCORE_HEIGHT,
    Math.max(
      MIN_SCORE_HEIGHT,
      viewport.height * SCORE_HEIGHT_RATIO,
    ),
  );
}

export function getGameLayout(
  viewport: ViewportSize,
): GameLayout {
  const scoreHeight = getScoreHeight(
    viewport,
  );

  const boardHeight = Math.max(
    0,
    viewport.height - scoreHeight,
  );

  return {
    score: {
      x: 0,
      y: 0,
      width: viewport.width,
      height: scoreHeight,
    },

    board: {
      x: 0,
      y: scoreHeight,
      width: viewport.width,
      height: boardHeight,
    },
  };
}