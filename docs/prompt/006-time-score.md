## Task

- Given game srs, code spec, input, board, card interaction and game
- Implement Game Progress and Board Reset srs sections
- Create time-score file in shared and consume it in game

## docs/software-requirements-specification/001-game.md

````markdown
---
title: 'Match Pairs — Software Requirements Specification'

slug: 'srs-match-pairs'

description: 'Software requirements specification for the mobile-first Match Pairs memory game.'

date: 2026-09-16

draft: false

author: 'atari-monk'

tags:
  - srs
  - game
  - match-pairs
  - mobile
  - atom-engine

categories:
  - software-requirements-specification
---

## Match Pairs

A mobile-first memory game in which the player flips numbered cards and finds matching pairs. The project is an MVP intended to demonstrate focused, time-boxed development and organization over a four-hour development period.

### Project

- The project must be generated from the `atom-engine` project generator.
- The generated `match-pairs` project must use or extend `atom-engine` where required by the game.
- Engine extensions required by the game should remain reusable rather than being implemented only as game-specific workarounds.

### Game Board

- The game must display a configurable grid of cards.
- Each card must contain a number representing a pair.
- The grid must contain matching pairs, with each number appearing exactly twice.
- The board must support configurable grid dimensions.
- The initial board arrangement must be randomized.

### Card Interaction

- A player must be able to flip a face-down card.
- A flipped card must remain visible for a configurable amount of time when required by the game rules.
- The player must be able to select cards through mobile touch input.
- The game must prevent invalid interactions while cards are temporarily unavailable for interaction.
- The game must determine whether two selected cards form a matching pair.
- Matched cards must remain identified as completed and must not be available for further matching.

### Game Progress

- The game must continue until every pair has been found.
- The game must track the elapsed time for the current game.
- When all pairs are found, the game must record the completed game time as a score.
- The game must maintain the five best scores.
- Scores must be ordered from best to worst according to completion time.
- We should render current time and best scores

### Board Reset

- After a game is completed, the board must reset so that a new game can be started.
- Game should be reset to start screen

### Mobile Support

- The project must be designed for mobile devices as the primary target.
- `atom-engine` must be extended where necessary to provide mobile-specific functionality.
- The engine must provide input helpers suitable for touch interaction.
- The game must consume the engine's touch input helpers rather than implementing unrelated input handling directly.
- The game must support screen resolutions and aspect ratios appropriate for mobile devices.
- `atom-engine` must be extended where necessary to support mobile-oriented resolution and screen handling.

### MVP Scope

- The implementation must prioritize the complete playable game loop over non-essential features.
- The MVP must include configurable board size, card flipping, pair matching, elapsed-time tracking, best-five scores, game reset, and mobile touch input.
- Features not required for the core game loop should not be added unless they are necessary for the engine or mobile requirements.

### Commits

- chore(generator): generate project with atom-engine
- feat(game): add configurable card grid and randomized pairs
- feat(game): add card flipping and pair matching
- feat(game): track elapsed time and best five scores
- feat(game): add game completion and board reset
- feat(engine): add mobile touch input support
- feat(engine): add mobile screen and resolution support
- feat(game): integrate mobile engine extensions into Match Pairs
````

## docs/guidelines/code.md

````markdown
## Code

- Use structs and functions
- No comments in code
- Write in style of code provided as context
- Implement only strict requrerments
- Try to keep balance: minimal high quality code to implement srs
- If context allow implement, if not ask for missing source, docs or info
- Use full code files as response and short description of solution
````

## src/engine/touch-input.ts

```typescript
export type TouchInputState = {
  pressed: boolean;
  x: number;
  y: number;
  canvas: HTMLCanvasElement | null;
};

export function createTouchInputState(): TouchInputState {
  return {
    pressed: false,
    x: 0,
    y: 0,
    canvas: null,
  };
}

export function attachTouchInput(
  state: TouchInputState,
  canvas: HTMLCanvasElement,
) {
  state.canvas = canvas;

  canvas.addEventListener(
    'touchstart',
    (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const rect = canvas.getBoundingClientRect();
      state.x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      state.y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
      state.pressed = true;
      e.preventDefault();
    },
    { passive: false },
  );
}

export function clearTouchPressed(state: TouchInputState) {
  state.pressed = false;
}

export function isTouchPressed(state: TouchInputState) {
  return state.pressed;
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

function getCardAt(board: BoardState, x: number, y: number) {
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
  if (!state.first || !state.second) return;

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
      if (state.first) state.first.faceUp = false;
      if (state.second) state.second.faceUp = false;
      resetSelection(state);
    }

    return;
  }

  if (!input.pressed) return;

  const card = getCardAt(board, input.x, input.y);
  if (!card || card.faceUp || card.matched) return;

  card.faceUp = true;

  if (!state.first) {
    state.first = card;
    return;
  }

  if (card === state.first) return;

  state.second = card;
  resolveSelection(state);
}
```

## src/shared/time-score.ts

```typescript
export type TimeScoreState = {
  elapsed: number;
  scores: number[];
  completed: boolean;
};

export function createTimeScoreState(): TimeScoreState {
  return {
    elapsed: 0,
    scores: [],
    completed: false,
  };
}

export function updateTimeScore(
  state: TimeScoreState,
  dt: number,
) {
  if (state.completed) return;

  state.elapsed = Math.max(0, state.elapsed + dt);
}

export function recordTimeScore(state: TimeScoreState) {
  if (state.completed) return state.elapsed;

  state.completed = true;
  state.scores = [...state.scores, state.elapsed]
    .sort((a, b) => a - b)
    .slice(0, 5);

  return state.elapsed;
}

export function resetTimeScore(state: TimeScoreState) {
  state.elapsed = 0;
  state.completed = false;
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
import { createBoard, renderBoard, type BoardState } from './shared/board';
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
} from './shared/time-score';

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
};

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  const touch = createTouchInputState();

  attachTouchInput(touch, render.ctx.canvas);

  return {
    render,
    input,
    touch,
    audio,
    board: createBoard(240, 90, 1440, 900, 4, 4),
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
  };
}

export function updateGame(state: GameState, dt: number) {
  updateTimeScore(state.timeScore, dt);
  updateCardInteraction(state.cardInteraction, state.board, state.touch, dt);

  if (state.board.cards.every((card) => card.matched)) {
    recordTimeScore(state.timeScore);
    state.board = createBoard(240, 90, 1440, 900, 4, 4);
    state.cardInteraction = createCardInteraction();
    resetTimeScore(state.timeScore);
  }

  clearTouchPressed(state.touch);
}

export function renderGame(state: GameState, _alpha: number) {
  clear(state.render);
  renderBoard(state.board, state.render.ctx);
}
```

## src/main.ts

```typescript
import './style.css';
import {
  createRenderState,
  createInputState,
  attachInput,
  createAudioState,
  loadAudio,
  playMusicAfterGesture,
  createLoop,
  startLoop,
} from 'atari-monk-atom-engine';
import { createGame, updateGame, renderGame } from './game';

const render = createRenderState('canvas');
const blockedKeys: string[] = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  ' ',
  'e',
];
const input = createInputState(blockedKeys);
attachInput(input);

const audio = createAudioState();

(async () => {
  await loadAudio(audio, 'bg', './sounds/twinkle.wav');
})();

const game = createGame(render, input, audio);

const overlay = document.getElementById('start-overlay');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

overlay?.addEventListener('click', async () => {
  overlay.style.display = 'none';
  canvas.style.display = 'block';

  await playMusicAfterGesture(audio, 'bg', 0.5);
});

const loop = createLoop(
  (dt) => updateGame(game, dt),
  (alpha) => renderGame(game, alpha),
);

startLoop(loop);
```

