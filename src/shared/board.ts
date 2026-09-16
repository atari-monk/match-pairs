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

export function renderBoard(
  board: BoardState,

  ctx: CanvasRenderingContext2D,
) {
  for (const card of board.cards) {
    ctx.fillStyle = card.faceUp ? 'white' : 'gray';

    ctx.fillRect(card.x, card.y, card.width, card.height);

    ctx.strokeStyle = 'black';

    ctx.strokeRect(card.x, card.y, card.width, card.height);

    if (card.faceUp) {
      ctx.fillStyle = 'black';
      ctx.font = `${Math.floor(card.height * 0.4)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        String(card.value),
        card.x + card.width / 2,
        card.y + card.height / 2,
      );
    }
  }
}
