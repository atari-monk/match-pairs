import type { TouchInputState } from '../engine/touch-input';
import type { BoardState, CardState } from './board';

export type CardInteractionState = {
  first: CardState | null;
  second: CardState | null;
  blocked: number;
  revealDuration: number;
};

export function createCardInteraction(
  revealDuration = 0.75,
): CardInteractionState {
  return {
    first: null,
    second: null,
    blocked: 0,
    revealDuration,
  };
}

function getCardAt(
  board: BoardState,
  x: number,
  y: number,
): CardState | undefined {
  return board.cards.find(
    (card) =>
      x >= card.x &&
      x < card.x + card.width &&
      y >= card.y &&
      y < card.y + card.height,
  );
}

function resetSelection(state: CardInteractionState) {
  state.first = null;
  state.second = null;
}

function resolveSelection(state: CardInteractionState) {
  if (!state.first || !state.second) {
    return;
  }

  if (state.first.value === state.second.value) {
    state.first.matched = true;
    state.second.matched = true;

    resetSelection(state);
    return;
  }

  state.blocked = state.revealDuration;
}

export function updateCardInteraction(
  state: CardInteractionState,
  board: BoardState,
  input: TouchInputState,
  dt: number,
) {
  if (state.blocked > 0) {
    state.blocked = Math.max(0, state.blocked - dt);

    if (state.blocked === 0) {
      if (state.first) {
        state.first.faceUp = false;
      }

      if (state.second) {
        state.second.faceUp = false;
      }

      resetSelection(state);
    }

    return;
  }

  if (!input.pressed) {
    return;
  }

  const card = getCardAt(
    board,
    input.x,
    input.y,
  );

  if (!card || card.faceUp || card.matched) {
    return;
  }

  card.faceUp = true;

  if (!state.first) {
    state.first = card;
    return;
  }

  if (card === state.first) {
    return;
  }

  state.second = card;

  resolveSelection(state);
}