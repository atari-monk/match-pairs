## Task

- Given game srs, code spec, input, board and game
- Implement Card Interaction srs section
- Input is just example of what engine has. Implement mobile input needed in engine
- Create touch-input as separate file
- Create interaction in card-interaction file in shared and consume it in game

## docs/software-requirements-specification/001-game.md

```markdown
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
- After a game is completed, the board must reset so that a new game can be started.

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
```

## docs/guidelines/code.md

```markdown
## Code

- Use structs and functions
- No comments in code
- Write in style of code provided as context
- Implement only strict requrerments
- Try to keep balance: minimal high quality code to implement srs
```

## project/atom-engine/src/input.ts

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

## src/game.ts

```typescript
import {
  type RenderState,
  type InputState,
  type AudioState,
  clear,
} from 'atari-monk-atom-engine';

import { createBoard, renderBoard, type BoardState } from './shared/board';

export type GameState = {
  render: RenderState;
  input: InputState;
  audio: AudioState;
  board: BoardState;
};

export function createGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
): GameState {
  return {
    render,
    input,
    audio,
    board: createBoard(240, 90, 1440, 900, 4, 4),
  };
}

export function updateGame(_state: GameState, _dt: number) {}

export function renderGame(state: GameState, _alpha: number) {
  clear(state.render);
  renderBoard(state.board, state.render.ctx);
}
```
