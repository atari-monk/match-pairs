import { clearTouchPressed } from "../../engine/touch-input";
import type { BoardState } from "../components/board";
import { createCardInteraction, updateCardInteraction } from "../components/card-interaction";
import { recordTimeScore, resetTimeScore, updateTimeScore } from "../components/time-score";
import type { GameState } from "../game-type";

export function startGameRound(
  state: GameState,
) {
  state.cardInteraction = createCardInteraction();
  resetTimeScore(state.timeScore);
  state.running = true;
  clearTouchPressed(state.touch);
}

export function advanceGame(
  state: GameState,
  dt: number,
): boolean {
  if (!state.running) {
    clearTouchPressed(state.touch);
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

  if (!isComplete(state.board)) {
    clearTouchPressed(
      state.touch,
    );

    return false;
  }

  recordTimeScore(
    state.timeScore,
  );

  state.cardInteraction =
    createCardInteraction();

  state.running = false;

  clearTouchPressed(
    state.touch,
  );

  return true;
}

function isComplete(
  board: BoardState,
): boolean {
  return board.cards.every(
    (card) => card.matched,
  );
}
