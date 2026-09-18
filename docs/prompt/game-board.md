## docs/task/game-board.md

```markdown
## Task

- Given:
  - Srs
  - Code rules
  - Rect (game object example)
  - Game
- Implement game board
```

## docs/srs/game-board.md

```markdown
## Game Board

- The game must display a configurable grid of cards.
- Each card must contain a number representing a pair.
- The grid must contain matching pairs, with each number appearing exactly twice.
- The board must support configurable grid dimensions.
- The initial board arrangement must be randomized.
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

## ../atom-starter/src/shared/rect.ts

```typescript
export type RectState = {
  x: number;
  y: number;
  width: number;
  height: number;
  baseWidth: number;
  baseHeight: number;
  color: string;
  time: number;
  speed: number;
  scale: number;
};

export function createRect(
  x: number,
  y: number,
  width: number,
  height: number,
  color = 'white',
): RectState {
  return {
    x,
    y,
    width,
    height,
    baseWidth: width,
    baseHeight: height,
    color,
    time: 0,
    speed: 3,
    scale: 1,
  };
}

export function updateRect(rect: RectState, dt: number) {
  rect.time += dt;

  rect.scale = 1 + Math.sin(rect.time * rect.speed) * 0.9;
}

export function renderRect(rect: RectState, ctx: CanvasRenderingContext2D) {
  const w = rect.baseWidth * rect.scale;
  const h = rect.baseHeight * rect.scale;

  const dx = rect.x - (w - rect.baseWidth) / 2;
  const dy = rect.y - (h - rect.baseHeight) / 2;

  ctx.fillStyle = rect.color;
  ctx.fillRect(dx, dy, w, h);
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
