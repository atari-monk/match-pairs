import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';

import {
  createBoard,
  resizeBoard,
  renderBoard,
  type BoardState,
} from './shared/board';

import {
  getViewportSize,
  type ViewportSize,
} from './engine/viewport-size';

import {
  createCardInteraction,
  updateCardInteraction,
  type CardInteractionState,
} from './shared/card-interaction';

import {
  attachTouchInput,
  clearTouchPressed,
  createTouchInputState,
  type TouchInputState,
} from './engine/touch-input';

import {
  createTimeScoreState,
  updateTimeScore,
  recordTimeScore,
  resetTimeScore,
  type TimeScoreState,
  renderTimeScore,
} from './shared/time-score';

const BOARD_COLUMNS = 4;
const BOARD_ROWS = 4;

const SCORE_HEIGHT_RATIO = 0.18;
const MIN_SCORE_HEIGHT = 64;
const MAX_SCORE_HEIGHT = 120;

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
  running: boolean;
};

type GameLayout = {
  score: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  board: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

function getScoreHeight(
  viewport: ViewportSize,
) {
  return Math.min(
    MAX_SCORE_HEIGHT,
    Math.max(
      MIN_SCORE_HEIGHT,
      viewport.height * SCORE_HEIGHT_RATIO,
    ),
  );
}

function getGameLayout(
  viewport: ViewportSize,
): GameLayout {
  const scoreHeight = getScoreHeight(viewport);

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

/**
 * Make the canvas drawing buffer use the same coordinate
 * system as the viewport used by the game layout.
 *
 * The CSS size and drawing-buffer size are deliberately
 * handled independently. Pointer input converts from the
 * CSS/client coordinate system into this drawing-buffer
 * coordinate system.
 */
function resizeCanvasToViewport(
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

function createViewportBoard(
  canvas: HTMLCanvasElement,
): BoardState {
  const viewport = getViewportSize();

  resizeCanvasToViewport(
    canvas,
    viewport,
  );

  const layout = getGameLayout(viewport);

  return createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );
}

function resizeGameLayout(
  state: GameState,
) {
  const canvas = state.render.ctx.canvas;
  const viewport = getViewportSize();

  /*
   * Keep the canvas drawing buffer synchronized with the
   * coordinate system used by the board.
   */
  resizeCanvasToViewport(
    canvas,
    viewport,
  );

  const layout = getGameLayout(viewport);

  resizeBoard(
    state.board,
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
  );
}

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  const canvas = render.ctx.canvas;

  const touch = createTouchInputState();

  attachTouchInput(
    touch,
    canvas,
  );

  /*
   * Initialize the canvas before creating the board so both
   * use exactly the same coordinate system.
   */
  const viewport = getViewportSize();

  resizeCanvasToViewport(
    canvas,
    viewport,
  );

  const layout = getGameLayout(viewport);

  const board = createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );

  const state: GameState = {
    render,
    input,
    touch,
    audio,
    board,
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
    running: false,
  };

  const resize = () => {
    resizeGameLayout(state);
  };

  window.addEventListener(
    'resize',
    resize,
  );

  window.addEventListener(
    'orientationchange',
    resize,
  );

  return state;
}

export function startGame(
  state: GameState,
) {
  state.board = createViewportBoard(
    state.render.ctx.canvas,
  );

  state.cardInteraction =
    createCardInteraction();

  resetTimeScore(
    state.timeScore,
  );

  state.running = true;

  clearTouchPressed(
    state.touch,
  );
}

export function updateGame(
  state: GameState,
  dt: number,
) {
  if (!state.running) {
    clearTouchPressed(
      state.touch,
    );

    return false;
  }

  updateTimeScore(
    state.timeScore,
    dt,
  );

  updateCardInteraction(
    state.cardInteraction,
    state.board,
    state.touch,
    dt,
  );

  if (
    !state.board.cards.every(
      (card) => card.matched,
    )
  ) {
    clearTouchPressed(
      state.touch,
    );

    return false;
  }

  recordTimeScore(
    state.timeScore,
  );

  state.board = createViewportBoard(
    state.render.ctx.canvas,
  );

  state.cardInteraction =
    createCardInteraction();

  state.running = false;

  clearTouchPressed(
    state.touch,
  );

  return true;
}

export function renderGame(
  state: GameState,
  _alpha: number,
) {
  const viewport = getViewportSize();

  /*
   * Make sure the canvas and layout remain synchronized
   * even if the viewport changed between resize events
   * and rendering.
   */
  resizeCanvasToViewport(
    state.render.ctx.canvas,
    viewport,
  );

  const layout = getGameLayout(
    viewport,
  );

  /*
   * If the viewport changed, update the existing board's
   * geometry without recreating its card state.
   */
  if (
    state.board.x !== layout.board.x ||
    state.board.y !== layout.board.y ||
    state.board.width !== layout.board.width ||
    state.board.height !== layout.board.height
  ) {
    resizeBoard(
      state.board,
      layout.board.x,
      layout.board.y,
      layout.board.width,
      layout.board.height,
    );
  }

  clear(state.render);

  const ctx = state.render.ctx;

  renderTimeScore(
    state.timeScore,
    ctx,
    layout.score.width,
    layout.score.height,
  );

  renderBoard(
    state.board,
    ctx,
  );
}