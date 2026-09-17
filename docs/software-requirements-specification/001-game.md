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
- feat(game): track elapsed time, best five scores, reset board
- feat(engine): add mobile touch input support
- feat(engine): add mobile screen and resolution support
- feat(game): integrate mobile engine extensions into Match Pairs
