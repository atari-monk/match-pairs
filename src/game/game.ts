import {
  type RenderState,
  type InputState,
  type AudioState,
} from 'atari-monk-atom-engine';

import {
  startGameRound,
  advanceGame,
} from './logic/game-rules';

import {
  drawGame,
} from './renderer/game-renderer';
import { buildGame } from './factory/create-game';
import type { GameState } from './game-type';

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  return buildGame(render, input, audio);
}

export function startGame(
  state: GameState,
) {
  startGameRound(state);
}

export function updateGame(
  state: GameState,
  dt: number,
) {
 return advanceGame(state, dt);
}

export function renderGame(
  state: GameState,
  _alpha: number,
) {
  drawGame(
    state.render,
    state.board,
    state.timeScore,
    state.layout.score,
  );
}