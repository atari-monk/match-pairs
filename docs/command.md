## Command

- [Note](#note)
- [Pomodoro](#pomodoro)
- [Bundle](#bundle)
- [Project Bundle](#project-bundle)
  - [TS formater](#ts-formater)
  - [Commit messages](#commit-messages)
- [Game Bundle](#game-bundle)
  - [Game srs](#game-srs)
  - [Game board](#game-board)
  - [Card interaction](#card-interaction)
  - [Time score](#time-score)
  - [Mobile screen](#mobile-screen)

### Note

```sh
proj note \
-l match-pairs \
-t ""
```

### Pomodoro

```sh
proj timer -o
```

### Bundle

```sh
proj files bundle \
-o \
-p
```

### Project Bundle

#### TS formater

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/004-ts-formater.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/004-ts-formater.md
```

#### Commit messages

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/002-format-commit-msgs.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/format-commit-msgs.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/game.md \
   /home/atari-monk/atari-monk/project/dev-notes/en/convention/commit-message.md
```

### Game Bundle

#### Game srs

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/001b-game-srs.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/001-game-draft.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/srs-template.md
```

#### Game board

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/003-game-board-impl.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/implement-board.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/game.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/rule.md \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/rect.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/game.ts
```

#### Card interaction

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/005-card-interaction2.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/005-card-interaction.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/001-game.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/rule.md \
   /home/atari-monk/atari-monk/project/atom-engine/src/input.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/board.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/game.ts
```

#### Time score

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/006-time-score.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/006-time-score.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/001-game.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/rule.md \
   /home/atari-monk/atari-monk/project/match-pairs/src/engine/touch-input.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/board.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/card-interaction.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/time-score.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/game.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/main.ts
```

#### Mobile screen

```sh
proj files bundle \
-o /home/atari-monk/atari-monk/project/match-pairs/docs/prompt/007-mobile-screen.md \
-p /home/atari-monk/atari-monk/project/match-pairs/docs/task/007-mobile-screen.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/srs/002-mobile-screen.md \
   /home/atari-monk/atari-monk/project/match-pairs/docs/rule.md \
   /home/atari-monk/atari-monk/project/match-pairs/src/engine/viewport-size.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/engine/touch-input.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/board.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/card-interaction.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/shared/time-score.ts \
   /home/atari-monk/atari-monk/project/match-pairs/src/game.ts
```
