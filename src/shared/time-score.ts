export type TimeScoreState = {
  current: number;
  lastCompleted: number | null;
  scores: number[];
  completed: boolean;
};

export function createTimeScoreState(): TimeScoreState {
  return {
    current: 0,
    lastCompleted: null,
    scores: [],
    completed: false,
  };
}

export function updateTimeScore(
  state: TimeScoreState,
  dt: number,
) {
  if (state.completed) {
    return;
  }

  state.current += dt;
}

export function recordTimeScore(
  state: TimeScoreState,
) {
  if (state.completed) {
    return state.lastCompleted ?? state.current;
  }

  const score = state.current;

  state.lastCompleted = score;
  state.completed = true;

  state.scores = [
    ...state.scores,
    score,
  ]
    .sort((a, b) => a - b)
    .slice(0, 5);

  return score;
}

export function resetTimeScore(
  state: TimeScoreState,
) {
  state.current = 0;
  state.completed = false;
}

export function renderTimeScore(
  state: TimeScoreState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'black';

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const padding = Math.max(
    12,
    Math.min(width, height) * 0.08,
  );

  const timeFontSize = Math.max(
    18,
    Math.min(36, height * 0.36),
  );

  const bestFontSize = Math.max(
    14,
    Math.min(26, height * 0.25),
  );

  ctx.font = `${Math.floor(timeFontSize)}px sans-serif`;

  ctx.fillText(
    `Time: ${state.current.toFixed(2)}s`,
    padding,
    height * 0.3,
  );

  ctx.font = `${Math.floor(bestFontSize)}px sans-serif`;

  const bestText = state.scores.length
    ? state.scores
        .map((score) => `${score.toFixed(2)}s`)
        .join('   ')
    : 'No scores yet';

  ctx.fillText(
    `Best: ${bestText}`,
    padding,
    height * 0.72,
  );
}