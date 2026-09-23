import type {
  RenderState,
  InputState,
  AudioState,
} from 'atari-monk-atom-engine';
import type { TouchInputState } from '../engine/touch-input';
import type { BoardState } from './board';
import type { CardInteractionState } from './card-interaction';
import type { TimeScoreState } from './time-score';
import type { GameLayout } from './layout';

export type GameAssets = {
  faceDown: HTMLImageElement;
  faceUp: HTMLImageElement;
};

export type GameState = {
  render: RenderState;
  input: InputState;
  touch: TouchInputState;
  audio: AudioState;
  assets: GameAssets;
  board: BoardState;
  layout: GameLayout;
  cardInteraction: CardInteractionState;
  timeScore: TimeScoreState;
  running: boolean;
};
