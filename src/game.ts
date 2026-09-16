import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';

import { createBoard, renderBoard, type BoardState } from './shared/board';

export type GameState = {
  render: RenderState;
  input: InputState;
  audio: AudioState;
  board: BoardState;
};

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  return {
    render,
    input,
    audio,
    board: createBoard(240, 90, 1440, 900, 4, 4),
  };
}

export function updateGame(_state: GameState, _dt: number) {}

export function renderGame(state: GameState, _alpha: number) {
  clear(state.render);
  renderBoard(state.board, state.render.ctx);
}
