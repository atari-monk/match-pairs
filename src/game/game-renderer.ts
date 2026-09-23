import { type RenderState, clear } from 'atari-monk-atom-engine';
import { type BoardState, renderBoard } from './board';
import { type TimeScoreState, renderTimeScore } from './time-score';
import { type Rect } from './layout';
import type { GameAssets } from './game-type';

export function drawGame(
  render: RenderState,
  board: BoardState,
  timeScore: TimeScoreState,
  score: Rect,
  assets: GameAssets,
) {
  clear(render);
  const ctx = render.ctx;

  renderTimeScore(timeScore, ctx, score.width, score.height);

  renderBoard(board, ctx, assets.faceDown, assets.faceUp);
}
