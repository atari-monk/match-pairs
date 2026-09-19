## Prompt command

- [Game srs](#game-srs)
- [Game board](#game-board)
- [Card interaction](#card-interaction)
- [Time score](#time-score)
- [Mobile screen](#mobile-screen)

### Game srs

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/prompt/game-srs.md \
-p docs/task/game-srs.md \
   docs/srs/game-draft.md \
   docs/srs/srs-template.md
```

### Game board

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/prompt/game-board.md \
-p docs/task/game-board.md \
   docs/srs/game-board.md \
   docs/code-rule.md \
   ../atom-starter/src/shared/rect.ts \
   src/game.ts
```

### Card interaction

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/prompt/card-interaction.md \
-p docs/task/card-interaction.md \
   docs/srs/card-interaction.md \
   docs/code-rule.md \
   ../atom-engine/src/input.ts \
   src/shared/board.ts \
   src/game.ts
```

### Time score

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/prompt/time-score.md \
-p docs/task/time-score.md \
   docs/srs/time-score.md \
   docs/code-rule.md \
   src/engine/touch-input.ts \
   src/shared/board.ts \
   src/shared/card-interaction.ts \
   src/shared/time-score.ts \
   src/game.ts \
   src/main.ts
```

### Mobile screen

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/prompt/mobile-screen.md \
-p docs/task/mobile-screen.md \
   docs/srs/mobile-screen.md \
   docs/code-rule.md \
   src/engine/viewport-size.ts \
   src/engine/touch-input.ts \
   src/shared/board.ts \
   src/shared/card-interaction.ts \
   src/shared/time-score.ts \
   src/game.ts
```

### Layout code

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
proj files bundle \
-o docs/_temp.md \
-p src/game/game.ts \
   src/game/layout.ts \
   src/game/factory/create-board.ts
```
