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

  const values = Array.from(
    { length: count / 2 },
    (_, index) => index + 1,
  );

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

export function renderBoard(
  board: BoardState,
  ctx: CanvasRenderingContext2D,
) {
  for (const card of board.cards) {
    ctx.fillStyle = card.faceUp ? 'white' : 'gray';

    ctx.fillRect(
      card.x,
      card.y,
      card.width,
      card.height,
    );

    ctx.strokeStyle = 'black';

    ctx.strokeRect(
      card.x,
      card.y,
      card.width,
      card.height,
    );

    if (!card.faceUp) {
      continue;
    }

    ctx.fillStyle = 'black';

    const fontSize = Math.max(
      12,
      Math.floor(Math.min(card.width, card.height) * 0.4),
    );

    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(
      String(card.value),
      card.x + card.width / 2,
      card.y + card.height / 2,
    );
  }
}