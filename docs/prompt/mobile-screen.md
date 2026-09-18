## docs/task/mobile-screen.md

````markdown
## Task - Mobile Screen

- Do you have context you need to do it ?
- Implement util in separate file and update board to adapt to screen
- Card interactions seems to be afected by this
- Time score should also adapt to screen and have layout with a board
- There is issue with clicking. After clicking a cell, some other cell is on, coordinates are messed up somehow
````

## docs/srs/mobile-screen.md

````markdown
## Mobile Screen

### Viewport Size

**Proposed interface:**

```ts
interface ViewportSize {
  width: number;
  height: number;
}

function getViewportSize(): ViewportSize;
```

Implement a helper function that retrieves the current viewport dimensions of the device.

The helper should return the current `window.innerWidth` and `window.innerHeight`, allowing the board to be sized according to the available viewport rather than the device's physical screen resolution.

The function should work automatically in both portrait and landscape orientations.

### Board Size

Use the `getViewportSize()` helper to determine the available viewport dimensions and size the board accordingly.

The board should adapt to the current viewport width and height and update its dimensions when the viewport changes, including transitions between portrait and landscape orientations.

### Board Behavior

For this task, focus exclusively on the game board and its responsive behavior.

The board should use the available viewport dimensions to automatically adjust its size. When the mobile viewport dimensions change, including when switching between portrait and landscape orientations, the board should resize accordingly while maintaining its intended proportions and fitting within the available space.

### Commits

- feat: add mobile screen and resolution support
````

## docs/rule/code.md

````markdown
## Code rules

- Use structs and functions
- No comments in code
- Write in style of code provided as context
- Implement only strict requrerments
- Try to keep balance: minimal high quality code to implement srs
- If context allow implement, if not ask for missing source, docs or info
- Use full code files as response and short description of solution
````

## src/engine/viewport-size.ts

```typescript
export type ViewportSize = {
  width: number;
  height: number;
};

export function getViewportSize(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
```

## src/engine/touch-input.ts

```typescript
export type TouchInputState = {
  x: number;
  y: number;
  pressed: boolean;
};

export function createTouchInputState(): TouchInputState {
  return {
    x: 0,
    y: 0,
    pressed: false,
  };
}

export function attachTouchInput(
  state: TouchInputState,
  canvas: HTMLCanvasElement,
) {
  const updatePosition = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    /*
     * Convert CSS/client coordinates into canvas drawing-buffer
     * coordinates.
     *
     * The board uses drawing-buffer coordinates, so this conversion
     * must account for any difference between the CSS canvas size
     * and the actual canvas width/height.
     */
    state.x = (clientX - rect.left) * (canvas.width / rect.width);
    state.y = (clientY - rect.top) * (canvas.height / rect.height);
  };

  canvas.addEventListener('pointerdown', (event) => {
    updatePosition(event.clientX, event.clientY);
    state.pressed = true;
  });

  canvas.addEventListener('pointermove', (event) => {
    updatePosition(event.clientX, event.clientY);
  });
}

export function clearTouchPressed(state: TouchInputState) {
  state.pressed = false;
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
```

## src/shared/card-interaction.ts

```typescript
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
```

## src/shared/time-score.ts

```typescript
export type TimeScoreState = {
  current: number;
  lastCompleted: number | null;
  scores: number[];
  completed: boolean;
};

export function createTimeScoreState(): TimeScoreState {
  return {
    current: 0,
    lastCompleted: null,
    scores: [],
    completed: false,
  };
}

export function updateTimeScore(
  state: TimeScoreState,
  dt: number,
) {
  if (state.completed) {
    return;
  }

  state.current += dt;
}

export function recordTimeScore(
  state: TimeScoreState,
) {
  if (state.completed) {
    return state.lastCompleted ?? state.current;
  }

  const score = state.current;

  state.lastCompleted = score;
  state.completed = true;

  state.scores = [
    ...state.scores,
    score,
  ]
    .sort((a, b) => a - b)
    .slice(0, 5);

  return score;
}

export function resetTimeScore(
  state: TimeScoreState,
) {
  state.current = 0;
  state.completed = false;
}

export function renderTimeScore(
  state: TimeScoreState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'black';

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const padding = Math.max(
    12,
    Math.min(width, height) * 0.08,
  );

  const timeFontSize = Math.max(
    18,
    Math.min(36, height * 0.36),
  );

  const bestFontSize = Math.max(
    14,
    Math.min(26, height * 0.25),
  );

  ctx.font = `${Math.floor(timeFontSize)}px sans-serif`;

  ctx.fillText(
    `Time: ${state.current.toFixed(2)}s`,
    padding,
    height * 0.3,
  );

  ctx.font = `${Math.floor(bestFontSize)}px sans-serif`;

  const bestText = state.scores.length
    ? state.scores
        .map((score) => `${score.toFixed(2)}s`)
        .join('   ')
    : 'No scores yet';

  ctx.fillText(
    `Best: ${bestText}`,
    padding,
    height * 0.72,
  );
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

import {
  getViewportSize,
  type ViewportSize,
} from './engine/viewport-size';

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

function getScoreHeight(
  viewport: ViewportSize,
) {
  return Math.min(
    MAX_SCORE_HEIGHT,
    Math.max(
      MIN_SCORE_HEIGHT,
      viewport.height * SCORE_HEIGHT_RATIO,
    ),
  );
}

function getGameLayout(
  viewport: ViewportSize,
): GameLayout {
  const scoreHeight = getScoreHeight(viewport);

  const boardHeight = Math.max(
    0,
    viewport.height - scoreHeight,
  );

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
  if (
    canvas.width !== viewport.width ||
    canvas.height !== viewport.height
  ) {
    canvas.width = viewport.width;
    canvas.height = viewport.height;
  }
}

function createViewportBoard(
  canvas: HTMLCanvasElement,
): BoardState {
  const viewport = getViewportSize();

  resizeCanvasToViewport(
    canvas,
    viewport,
  );

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

function resizeGameLayout(
  state: GameState,
) {
  const canvas = state.render.ctx.canvas;
  const viewport = getViewportSize();

  /*
   * Keep the canvas drawing buffer synchronized with the
   * coordinate system used by the board.
   */
  resizeCanvasToViewport(
    canvas,
    viewport,
  );

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

  attachTouchInput(
    touch,
    canvas,
  );

  /*
   * Initialize the canvas before creating the board so both
   * use exactly the same coordinate system.
   */
  const viewport = getViewportSize();

  resizeCanvasToViewport(
    canvas,
    viewport,
  );

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

  window.addEventListener(
    'resize',
    resize,
  );

  window.addEventListener(
    'orientationchange',
    resize,
  );

  return state;
}

export function startGame(
  state: GameState,
) {
  state.board = createViewportBoard(
    state.render.ctx.canvas,
  );

  state.cardInteraction =
    createCardInteraction();

  resetTimeScore(
    state.timeScore,
  );

  state.running = true;

  clearTouchPressed(
    state.touch,
  );
}

export function updateGame(
  state: GameState,
  dt: number,
) {
  if (!state.running) {
    clearTouchPressed(
      state.touch,
    );

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

  if (
    !state.board.cards.every(
      (card) => card.matched,
    )
  ) {
    clearTouchPressed(
      state.touch,
    );

    return false;
  }

  recordTimeScore(
    state.timeScore,
  );

  state.board = createViewportBoard(
    state.render.ctx.canvas,
  );

  state.cardInteraction =
    createCardInteraction();

  state.running = false;

  clearTouchPressed(
    state.touch,
  );

  return true;
}

export function renderGame(
  state: GameState,
  _alpha: number,
) {
  const viewport = getViewportSize();

  /*
   * Make sure the canvas and layout remain synchronized
   * even if the viewport changed between resize events
   * and rendering.
   */
  resizeCanvasToViewport(
    state.render.ctx.canvas,
    viewport,
  );

  const layout = getGameLayout(
    viewport,
  );

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

  renderBoard(
    state.board,
    ctx,
  );
}
```

