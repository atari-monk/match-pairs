---
title: 'Match Pairs SRS'
description: 'Software requirements specification for the mobile-first Match Pairs memory game.'
tags:
  - srs
  - game
  - match-pairs
  - mobile
  - atom-engine
---

## Match Pairs SRS

A mobile-first memory game in which the player flips numbered cards and finds matching pairs. The project is an MVP intended to demonstrate focused, time-boxed development and organization over a four-hour development period.

- The project must be generated from the `atom-engine` project generator.
- The generated `match-pairs` project must use or extend `atom-engine` where required by the game.
- Engine extensions required by the game should remain reusable rather than being implemented only as game-specific workarounds.

## Content

- [Code Rules](#code-rules)
- [Game Board](#game-board)
  - [Card Interaction](#card-interaction)
- [Game Progress](#game-progress)
  - [Game Cycle](#game-cycle)
- [Score Persistence](#score-persistence)
- [Mobile Support](#mobile-support)
  - [Mobile Screen](#mobile-screen)
- [Sounds](#sounds)
- [Cards](#cards)
  - [Card Texture](#card-texture)
- [MVP Scope](#mvp-scope)

### Code Rules

- Use structs and functions
- No comments in code
- Write in style of the code that is provided as context
- Implement only strict requrerments
- Try to keep balance: minimal high quality code to implement srs
- If context allows, implement, if not ask for missing source, docs or info
- Use full code files as response and short description of the solution

### Game Board

- Game Rules
  - The game must display a configurable grid of cards.
  - Each card must contain a number representing a pair.
  - The grid must contain matching pairs, with each number appearing exactly twice.
  - The board must support configurable grid dimensions.
  - The initial board arrangement must be randomized.
- Structure
  - Use game object API

#### Card Interaction

- Game Rules
  - A player must be able to flip a face-down card.
  - A flipped card must remain visible for a configurable amount of time when required by the game rules.
  - The player must be able to select cards through mobile touch input.
  - The game must prevent invalid interactions while cards are temporarily unavailable for interaction.
  - The game must determine whether two selected cards form a matching pair.
  - Matched cards must remain identified as completed and must not be available for further matching.
- Structure
  - Implement mobile input needed in engine
  - Create `engine/touch-input.ts`
  - Create `game/card-interaction.ts`

### Game Progress

- The game must continue until every pair has been found.
- The game must track the elapsed time for the current game.
- When all pairs are found, the game must record the completed game time as a score.
- The game must maintain the five best scores.
- Scores must be ordered from best to worst according to completion time.
- We should render current time and best scores
- Structure
  - Create `game/time-score.ts`

#### Game Cycle

**Start / finished state**

- canvas hidden
- black overlay visible
- “Start game” button visible
- best scores visible on the overlay

**Gameplay state**

- canvas visible
- board visible
- current time visible
- no best-score list

### Score Persistence

- Browser refresh should not wipe out top 5 best scores
- Persist 5 best scores in browser storage and load them

### Mobile Support

- The project must be designed for mobile devices as the primary target.
- `atom-engine` must be extended where necessary to provide mobile-specific functionality.
- The engine must provide input helpers suitable for touch interaction.
- The game must consume the engine's touch input helpers rather than implementing unrelated input handling directly.
- The game must support screen resolutions and aspect ratios appropriate for mobile devices.
- `atom-engine` must be extended where necessary to support mobile-oriented resolution and screen handling.

#### Mobile Screen

##### Viewport Size

Proposed interface:

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

##### Board Size

Use the `getViewportSize()` helper to determine the available viewport dimensions and size the board accordingly.

The board should adapt to the current viewport width and height and update its dimensions when the viewport changes, including transitions between portrait and landscape orientations.

##### Board Behavior

For this task, focus exclusively on the game board and its responsive behavior.

The board should use the available viewport dimensions to automatically adjust its size. When the mobile viewport dimensions change, including when switching between portrait and landscape orientations, the board should resize accordingly while maintaining its intended proportions and fitting within the available space.

### Sounds

- I have click, miss and pair ogg files
- On card click play click sound
- On second card not beeing pair, play miss sound
- On second card beeing pair, play pair sound
- When game is done and returns to start page stop background music

### Cards

- Implement new helper `engine/image.ts` where load image from path
- In `src/game/board.ts`, renderBoard, extract function to render card
- Load image `public/face-down.png` (vite), use custom base
- Render card with image
- Load image in main
- Put it in GameState type in assets
- Consume it in renderers
- Add another texture `public/face-up.png`
- If card is face up transition to face up texture
- Transition in 100ms by switching opacity from 0 to 1, it oposite directions for both textures

#### Card Texture

- 2D game png texture
- horizontal rectangular white crystal
- 3:2 aspect ratio
- flat front-facing texture
- no text, numbers, symbols, patterns, borders, or objects
- transparent background
- crystal fills entire image
- Face Down
  - opaque frosted crystal
  - matte surface
  - subtle crystalline texture
  - soft internal glow
  - gentle light scattering
- Face Up
  - transparent crystal
  - frosted glass appearance
  - subtle translucency
  - soft refraction
  - gentle internal glow

### MVP Scope

- The implementation must prioritize the complete playable game loop over non-essential features.
- The MVP must include configurable board size, card flipping, pair matching, elapsed-time tracking, best-five scores, game reset, and mobile touch input.
- Features not required for the core game loop should not be added unless they are necessary for the engine or mobile requirements.
