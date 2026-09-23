import type { RenderState, InputState, AudioState } from "atari-monk-atom-engine";
import { createTouchInputState, attachTouchInput } from "../engine/touch-input";
import { createCardInteraction } from "./card-interaction";
import { createTimeScoreState } from "./time-score";
import type { GameAssets, GameState } from "./game-type";
import { updateLayout } from "./layout";
import { createBoardFromLayout, resizeBoard } from "./board";

export function buildGame(
  render: RenderState,
  input: InputState,
  audio: AudioState,
  assets: GameAssets,
): GameState {
  const canvas = render.ctx.canvas;
  const touch = createTouchInputState();
  attachTouchInput(
    touch,
    canvas,
  );
  const layout = updateLayout(render.canvas);
  const state: GameState = {
    render,
    input,
    touch,
    audio,
    assets,
    board: createBoardFromLayout(
      layout,
    ),
    layout,
    cardInteraction: createCardInteraction(),
    timeScore: createTimeScoreState(),
    running: false,
  };
  window.addEventListener(
    'resize',
    () => {
      resizeGame(state);
    },
  );
  window.addEventListener(
    'orientationchange',
    () => {
      resizeGame(state);
    },
  );
  return state;
}

function resizeGame(
  state: GameState,
) {
  state.layout = updateLayout(state.render.canvas);
  resizeBoard(
    state.board,
    state.layout.board.x,
    state.layout.board.y,
    state.layout.board.width,
    state.layout.board.height,
  );
}
