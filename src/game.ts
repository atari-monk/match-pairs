import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';
import { createBoard, renderBoard, type BoardState } from './shared/board';
import {
  createCardInteraction,
  updateCardInteraction,
  type CardInteractionState,
} from './shared/card-interaction';
import { attachTouchInput, clearTouchPressed, createTouchInputState, type TouchInputState } from './engine/touch-input';

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  cardInteraction: CardInteractionState;
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
    board: createBoard(240, 90, 1440, 900, 4, 4),
    cardInteraction: createCardInteraction(),
  };
}

export function updateGame(state: GameState, dt: number) {
  updateCardInteraction(state.cardInteraction, state.board, state.touch, dt);
  clearTouchPressed(state.touch);
}

export function renderGame(state: GameState, _alpha: number) {
  clear(state.render);
  renderBoard(state.board, state.render.ctx);
}
