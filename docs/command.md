## Command

Custom cli, list of commands, tailored for this project.

### Content

- [Note](#note)
- [Bundle](#bundle)
- [Docs](#docs)

### Note

Note:

```sh
proj note -l match-pairs -t ""
```

Pomodoro:

```sh
proj timer -o
```

Open logs:

```sh
code /home/atari-monk/atari-monk/project/log/match-pairs.log
```

```sh
code /home/atari-monk/atari-monk/project/log/timer.log
```

### Bundle

Bundles all project code and most configs to a prompt. Remove not relevant files to get shorter prompt.

```sh
proj files bundle \
  -o prompt/_prompt.md \
  -p prompt/_srs.md \
  src/style.css \
  src/main.ts \
  src/game/game-type.ts \
  src/game/game-rules.ts \
  src/game/time-score.ts \
  src/game/layout.ts \
  src/game/create-game.ts \
  src/game/game.ts \
  src/game/card-interaction.ts \
  src/game/game-renderer.ts \
  src/game/board.ts \
  src/engine/image.ts \
  src/engine/canvas.ts \
  src/engine/viewport-size.ts \
  src/engine/touch-input.ts \
  ./index.html \
  ./package.json \
  ./tsconfig.json \
  ./vite.config.js && \
xclip -selection clipboard < prompt/_prompt.md
```

#### Get paths

Get all file paths from the `src` directory first, followed by files in the project root, while ignoring `.prettierrc`, `pnpm-lock.yaml`, `.gitignore`, and `.prettierignore`. Each path is prefixed with three spaces. The `\` at the end of each line is the **`sh` line-continuation character**, allowing the command to span multiple lines. The combined output is printed to the terminal and copied to the clipboard.

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && \
{

    find src -type f -printf '   %p \\\n'

    find . -maxdepth 1 -type f \
        ! -name '.prettierrc' \
        ! -name 'pnpm-lock.yaml' \
        ! -name '.gitignore' \
        ! -name '.prettierignore' \
        -printf '   %p \\\n'

} | tee >(xclip -selection clipboard)
```

### Docs

Remove order and index files:

```sh
cd "/home/atari-monk/atari-monk/project/match-pairs/" && rm -rf docs/order.txt docs/index.md
```

Generate order file:

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && proj docs gen_idx_order -p ./docs
```

Generate index file:

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && proj docs gen_idx -p ./docs
```

New doc:

```sh
cd /home/atari-monk/atari-monk/project/match-pairs/ && proj docs new -p . -c docs/category -n name
```

New dev-note:

```sh
cd /home/atari-monk/atari-monk/project/ && proj docs new -p dev-notes -c en/category -n name
```
