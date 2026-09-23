import { clearTouchPressed } from '../engine/touch-input';
import type { BoardState } from './board';
import { createBoardFromLayout } from './board';
import {
  createCardInteraction,
  updateCardInteraction,
} from './card-interaction';
import { recordTimeScore, resetTimeScore, updateTimeScore } from './time-score';
import type { GameState } from './game-type';

export function startGameRound(state: GameState) {
  state.board = createBoardFromLayout(state.layout);

  state.cardInteraction = createCardInteraction();

  resetTimeScore(state.timeScore);

  state.running = true;

  clearTouchPressed(state.touch);
}

export function advanceGame(state: GameState, dt: number): boolean {
  if (!state.running) {
    clearTouchPressed(state.touch);

    return false;
  }

  updateTimeScore(state.timeScore, dt);

  updateCardInteraction(
    state.cardInteraction,
    state.board,
    state.touch,
    state.audio,
    dt,
  );

  if (!isComplete(state.board)) {
    clearTouchPressed(state.touch);

    return false;
  }

  recordTimeScore(state.timeScore);

  state.cardInteraction = createCardInteraction();

  state.running = false;

  clearTouchPressed(state.touch);

  return true;
}

function isComplete(board: BoardState): boolean {
  return board.cards.every((card) => card.matched);
}
