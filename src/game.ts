import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';

import {
  createBoard,
  renderBoard,
  type BoardState,
} from './shared/board';

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
} from './shared/time-score';

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

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  const touch = createTouchInputState();

  attachTouchInput(touch, render.ctx.canvas);

  return {
    render,
    input,
    touch,
    audio,
    board: createBoard(240, 150, 1440, 840, 4, 4),
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
    running: false,
  };
}

export function startGame(state: GameState) {
  state.board = createBoard(240, 150, 1440, 840, 4, 4);
  state.cardInteraction = createCardInteraction();
  resetTimeScore(state.timeScore);
  state.running = true;
  clearTouchPressed(state.touch);
}

export function updateGame(state: GameState, dt: number) {
  if (!state.running) {
    clearTouchPressed(state.touch);
    return false;
  }

  updateTimeScore(state.timeScore, dt);

  updateCardInteraction(
    state.cardInteraction,
    state.board,
    state.touch,
    dt,
  );

  if (!state.board.cards.every((card) => card.matched)) {
    clearTouchPressed(state.touch);
    return false;
  }

  recordTimeScore(state.timeScore);

  state.board = createBoard(240, 150, 1440, 840, 4, 4);
  state.cardInteraction = createCardInteraction();
  state.running = false;

  clearTouchPressed(state.touch);

  return true;
}

function renderTimeScore(state: TimeScoreState, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ctx.canvas.width, 120);

  ctx.fillStyle = 'black';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.font = '36px sans-serif';

  ctx.fillText(
    `Time: ${state.current.toFixed(2)}s`,
    40,
    20,
  );

  ctx.font = '26px sans-serif';

  ctx.fillText(
    `Best: ${state.scores.length
      ? state.scores.map((score) => `${score.toFixed(2)}s`).join('   ')
      : 'No scores yet'}`,
    40,
    70,
  );
}

export function renderGame(state: GameState, _alpha: number) {
  clear(state.render);

  renderTimeScore(
    state.timeScore,
    state.render.ctx,
  );

  renderBoard(
    state.board,
    state.render.ctx,
  );
}
