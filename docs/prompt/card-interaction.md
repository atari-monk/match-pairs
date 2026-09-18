## docs/task/card-interaction.md

```markdown
## Task

- Given:
  - Game srs
  - Code rules
  - Input, board and game
- Implement Card Interaction srs section
- Input is just example of what engine has
- Implement mobile input needed in engine
- Create touch-input as separate file
- Create interaction in card-interaction file in shared and consume it in game
```

## docs/srs/card-interaction.md

```markdown
## Card Interaction

- A player must be able to flip a face-down card.
- A flipped card must remain visible for a configurable amount of time when required by the game rules.
- The player must be able to select cards through mobile touch input.
- The game must prevent invalid interactions while cards are temporarily unavailable for interaction.
- The game must determine whether two selected cards form a matching pair.
- Matched cards must remain identified as completed and must not be available for further matching.
```

## docs/rule/code.md

```markdown
## Code rules

- Use structs and functions
- No comments in code
- Write in style of code provided as context
- Implement only strict requrerments
- Try to keep balance: minimal high quality code to implement srs
- If context allow implement, if not ask for missing source, docs or info
- Use full code files as response and short description of solution
```

## ../atom-engine/src/input.ts

```typescript
export type InputState = {
  keys: Set<string>;
  pressed: Set<string>;
  blockedKeys: Set<string>;
};

export function createInputState(
  blockedKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    ' ',
    'e',
  ],
): InputState {
  return {
    keys: new Set(),
    pressed: new Set(),
    blockedKeys: new Set(blockedKeys),
  };
}

export function attachInput(state: InputState) {
  window.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!e.repeat) {
      state.pressed.add(key);
    }

    state.keys.add(key);

    if (state.blockedKeys.has(key)) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    state.keys.delete(e.key);

    if (state.blockedKeys.has(e.key)) {
      e.preventDefault();
    }
  });
}

export function clearPressed(state: InputState) {
  state.pressed.clear();
}

export function isKeyDown(state: InputState, key: string) {
  return state.keys.has(key);
}

export function isKeyPressed(state: InputState, key: string) {
  return state.pressed.has(key);
}
```

## src/shared/board.ts

```typescript
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

export function renderBoard(board: BoardState, ctx: CanvasRenderingContext2D) {
  for (const card of board.cards) {
    ctx.fillStyle = card.faceUp ? 'white' : 'gray';

    ctx.fillRect(card.x, card.y, card.width, card.height);

    ctx.strokeStyle = 'black';

    ctx.strokeRect(card.x, card.y, card.width, card.height);

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
```

## src/game.ts

```typescript
import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';

import {
  createBoard,
  resizeBoard,
  renderBoard,
  type BoardState,
} from './shared/board';

import { getViewportSize, type ViewportSize } from './engine/viewport-size';

import {
  createCardInteraction,
  updateCardInteraction,
  type CardInteractionState,
} from './shared/card-interaction';

import {
  attachTouchInput,
  clearTouchPressed,
  createTouchInputState,
  type TouchInputState,
} from './engine/touch-input';

import {
  createTimeScoreState,
  updateTimeScore,
  recordTimeScore,
  resetTimeScore,
  type TimeScoreState,
  renderTimeScore,
} from './shared/time-score';

const BOARD_COLUMNS = 4;
const BOARD_ROWS = 4;

const SCORE_HEIGHT_RATIO = 0.18;
const MIN_SCORE_HEIGHT = 64;
const MAX_SCORE_HEIGHT = 120;

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
  running: boolean;
};

type GameLayout = {
  score: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  board: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

function getScoreHeight(viewport: ViewportSize) {
  return Math.min(
    MAX_SCORE_HEIGHT,
    Math.max(MIN_SCORE_HEIGHT, viewport.height * SCORE_HEIGHT_RATIO),
  );
}

function getGameLayout(viewport: ViewportSize): GameLayout {
  const scoreHeight = getScoreHeight(viewport);

  const boardHeight = Math.max(0, viewport.height - scoreHeight);

  return {
    score: {
      x: 0,
      y: 0,
      width: viewport.width,
      height: scoreHeight,
    },

    board: {
      x: 0,
      y: scoreHeight,
      width: viewport.width,
      height: boardHeight,
    },
  };
}

/**
 * Make the canvas drawing buffer use the same coordinate
 * system as the viewport used by the game layout.
 *
 * The CSS size and drawing-buffer size are deliberately
 * handled independently. Pointer input converts from the
 * CSS/client coordinate system into this drawing-buffer
 * coordinate system.
 */
function resizeCanvasToViewport(
  canvas: HTMLCanvasElement,
  viewport: ViewportSize,
) {
  if (canvas.width !== viewport.width || canvas.height !== viewport.height) {
    canvas.width = viewport.width;
    canvas.height = viewport.height;
  }
}

function createViewportBoard(canvas: HTMLCanvasElement): BoardState {
  const viewport = getViewportSize();

  resizeCanvasToViewport(canvas, viewport);

  const layout = getGameLayout(viewport);

  return createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );
}

function resizeGameLayout(state: GameState) {
  const canvas = state.render.ctx.canvas;
  const viewport = getViewportSize();

  /*
   * Keep the canvas drawing buffer synchronized with the
   * coordinate system used by the board.
   */
  resizeCanvasToViewport(canvas, viewport);

  const layout = getGameLayout(viewport);

  resizeBoard(
    state.board,
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
  );
}

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  const canvas = render.ctx.canvas;

  const touch = createTouchInputState();

  attachTouchInput(touch, canvas);

  /*
   * Initialize the canvas before creating the board so both
   * use exactly the same coordinate system.
   */
  const viewport = getViewportSize();

  resizeCanvasToViewport(canvas, viewport);

  const layout = getGameLayout(viewport);

  const board = createBoard(
    layout.board.x,
    layout.board.y,
    layout.board.width,
    layout.board.height,
    BOARD_COLUMNS,
    BOARD_ROWS,
  );

  const state: GameState = {
    render,
    input,
    touch,
    audio,
    board,
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
    running: false,
  };

  const resize = () => {
    resizeGameLayout(state);
  };

  window.addEventListener('resize', resize);

  window.addEventListener('orientationchange', resize);

  return state;
}

export function startGame(state: GameState) {
  state.board = createViewportBoard(state.render.ctx.canvas);

  state.cardInteraction = createCardInteraction();

  resetTimeScore(state.timeScore);

  state.running = true;

  clearTouchPressed(state.touch);
}

export function updateGame(state: GameState, dt: number) {
  if (!state.running) {
    clearTouchPressed(state.touch);

    return false;
  }

  updateTimeScore(state.timeScore, dt);

  updateCardInteraction(state.cardInteraction, state.board, state.touch, dt);

  if (!state.board.cards.every((card) => card.matched)) {
    clearTouchPressed(state.touch);

    return false;
  }

  recordTimeScore(state.timeScore);

  state.board = createViewportBoard(state.render.ctx.canvas);

  state.cardInteraction = createCardInteraction();

  state.running = false;

  clearTouchPressed(state.touch);

  return true;
}

export function renderGame(state: GameState, _alpha: number) {
  const viewport = getViewportSize();

  /*
   * Make sure the canvas and layout remain synchronized
   * even if the viewport changed between resize events
   * and rendering.
   */
  resizeCanvasToViewport(state.render.ctx.canvas, viewport);

  const layout = getGameLayout(viewport);

  /*
   * If the viewport changed, update the existing board's
   * geometry without recreating its card state.
   */
  if (
    state.board.x !== layout.board.x ||
    state.board.y !== layout.board.y ||
    state.board.width !== layout.board.width ||
    state.board.height !== layout.board.height
  ) {
    resizeBoard(
      state.board,
      layout.board.x,
      layout.board.y,
      layout.board.width,
      layout.board.height,
    );
  }

  clear(state.render);

  const ctx = state.render.ctx;

  renderTimeScore(
    state.timeScore,
    ctx,
    layout.score.width,
    layout.score.height,
  );

  renderBoard(state.board, ctx);
}
```
