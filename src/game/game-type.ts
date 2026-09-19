import type { RenderState, InputState, AudioState } from "atari-monk-atom-engine";
import type { TouchInputState } from "../engine/touch-input";
import type { BoardState } from "./components/board";
import type { CardInteractionState } from "./components/card-interaction";
import type { TimeScoreState } from "./components/time-score";
import type { GameLayout } from "./layout";

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  board: BoardState;
  layout: GameLayout;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
  running: boolean;
};