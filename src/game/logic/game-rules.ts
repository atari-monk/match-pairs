import type { BoardState } from "../components/board";

export function isGameComplete(
  board: BoardState,
): boolean {
  return board.cards.every(
    (card) => card.matched,
  );
}