import {
  type RenderState,
  type InputState,
  type AudioState,
} from 'atari-monk-atom-engine';

import {
  resizeBoard,
  type BoardState,
} from './components/board';

import {
  getViewportSize,
} from '../engine/viewport-size';

import {
  createCardInteraction,
  updateCardInteraction,
  type CardInteractionState,
} from './components/card-interaction';

import {
  attachTouchInput,
  clearTouchPressed,
  createTouchInputState,
  type TouchInputState,
} from '../engine/touch-input';

import {
  createTimeScoreState,
  updateTimeScore,
  recordTimeScore,
  resetTimeScore,
  type TimeScoreState,
} from './components/time-score';

import {
  resizeCanvasToViewport,
} from '../engine/canvas';

import {
  getGameLayout,
  type GameLayout,
} from './layout';

import {
  createBoardFromLayout,
} from './factory/create-board';

import {
  isGameComplete,
} from './logic/game-rules';

import {
  renderGameRenderer,
} from './renderer/game-renderer';

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  layout: GameLayout;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
  running: boolean;
};

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

  const viewport = getViewportSize();

  resizeCanvasToViewport(
    canvas,
    viewport,
  );

  const layout = getGameLayout(
    viewport,
  );

  const board = createBoardFromLayout(
    layout,
  );

  const state: GameState = {
    render,
    input,
    touch,
    audio,
    board,
    layout,
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
    running: false,
  };

  const resize = () => {
    const viewport = getViewportSize();

    resizeCanvasToViewport(
      canvas,
      viewport,
    );

    state.layout = getGameLayout(
      viewport,
    );

    resizeBoard(
      state.board,
      state.layout.board.x,
      state.layout.board.y,
      state.layout.board.width,
      state.layout.board.height,
    );
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
  state.board = createBoardFromLayout(
    state.layout,
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

  if (!isGameComplete(state.board)) {
    clearTouchPressed(
      state.touch,
    );

    return false;
  }

  recordTimeScore(
    state.timeScore,
  );

  state.board = createBoardFromLayout(
    state.layout,
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
  renderGameRenderer(
    state.render,
    state.board,
    state.timeScore,
    state.layout.score,
  );
}