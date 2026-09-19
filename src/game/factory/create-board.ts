import {
  createBoard,
  type BoardState,
} from '../components/board';

import type { GameLayout } from '../layout';

const BOARD_COLUMNS = 4;
const BOARD_ROWS = 4;

export function createBoardFromLayout(
  layout: GameLayout,
): BoardState {
  return createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );
}