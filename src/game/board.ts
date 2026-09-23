import type { GameLayout } from './layout';

export type CardState = {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  faceUp: boolean;
  matched: boolean;
};

export type BoardState = {
  x: number;
  y: number;
  width: number;
  height: number;
  columns: number;
  rows: number;
  cards: CardState[];
};

function shuffle(values: number[]) {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
}

export function createBoard(
  x: number,
  y: number,
  width: number,
  height: number,
  columns: number,
  rows: number,
): BoardState {
  const count = columns * rows;

  if (count < 2 || count % 2 !== 0) {
    throw new Error('Board must contain an even number of cards');
  }

  const values = Array.from({ length: count / 2 }, (_, index) => index + 1);
  const pairs = [...values, ...values];

  shuffle(pairs);

  const cardWidth = width / columns;
  const cardHeight = height / rows;

  const cards = pairs.map((value, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);

    return {
      x: x + column * cardWidth,
      y: y + row * cardHeight,
      width: cardWidth,
      height: cardHeight,
      value,
      faceUp: false,
      matched: false,
    };
  });

  return {
    x,
    y,
    width,
    height,
    columns,
    rows,
    cards,
  };
}

export function resizeBoard(
  board: BoardState,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  board.x = x;
  board.y = y;
  board.width = width;
  board.height = height;

  const cardWidth = width / board.columns;
  const cardHeight = height / board.rows;

  for (let index = 0; index < board.cards.length; index += 1) {
    const column = index % board.columns;
    const row = Math.floor(index / board.columns);
    const card = board.cards[index];

    card.x = x + column * cardWidth;
    card.y = y + row * cardHeight;
    card.width = cardWidth;
    card.height = cardHeight;
  }
}

function renderCard(
  card: CardState,
  ctx: CanvasRenderingContext2D,
  faceDownImage: HTMLImageElement,
  faceUpImage: HTMLImageElement,
) {
  if (card.faceUp) {
    ctx.globalAlpha = 1;
    ctx.drawImage(faceUpImage, card.x, card.y, card.width, card.height);

    drawNumber(ctx, card);
  } else {
    ctx.globalAlpha = 0.6;
    ctx.drawImage(faceDownImage, card.x, card.y, card.width, card.height);
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(card.x, card.y, card.width, card.height);
}

function drawNumber(ctx: CanvasRenderingContext2D, card: CardState) {
  ctx.fillStyle = 'red';

  const fontSize = Math.floor(Math.min(card.width, card.height) * 0.45);

  ctx.font = `700 ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(
    String(card.value),
    card.x + card.width / 2,
    card.y + card.height / 2,
  );
}

export function renderBoard(
  board: BoardState,
  ctx: CanvasRenderingContext2D,
  faceDownImage: HTMLImageElement,
  faceUpImage: HTMLImageElement,
) {
  for (const card of board.cards) {
    renderCard(card, ctx, faceDownImage, faceUpImage);
  }
}

const BOARD_COLUMNS = 4;
const BOARD_ROWS = 4;

export function createBoardFromLayout(layout: GameLayout): BoardState {
  return createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );
}
