export type TimeScoreState = {
  current: number;
  lastCompleted: number | null;
  scores: number[];
  completed: boolean;
};

export const MAX_SCORES = 5;

const SCORES_STORAGE_KEY = 'game-best-scores';

function loadScores(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(SCORES_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (score): score is number =>
          typeof score === 'number' && Number.isFinite(score),
      )
      .sort((a, b) => a - b)
      .slice(0, MAX_SCORES);
  } catch {
    return [];
  }
}

function saveScores(scores: number[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      SCORES_STORAGE_KEY,
      JSON.stringify(scores),
    );
  } catch {
    // Ignore storage errors so the game continues to work.
  }
}

export function createTimeScoreState(): TimeScoreState {
  return {
    current: 0,
    lastCompleted: null,
    scores: loadScores(),
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
    .slice(0, MAX_SCORES);

  saveScores(state.scores);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('game-scores-updated', {
        detail: {
          scores: [...state.scores],
        },
      }),
    );
  }

  return score;
}

export function resetTimeScore(
  state: TimeScoreState,
) {
  state.current = 0;
  state.lastCompleted = null;
  state.completed = false;
}

export function renderTimeScore(
  state: TimeScoreState,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = 'white';

  ctx.fillRect(
    0,
    0,
    width,
    height,
  );

  ctx.fillStyle = 'black';

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const padding = Math.max(
    12,
    Math.min(width, height) * 0.08,
  );

  const timeFontSize = Math.max(
    18,
    Math.min(36, height * 0.5),
  );

  ctx.font = `${Math.floor(timeFontSize)}px sans-serif`;

  ctx.fillText(
    `Time: ${state.current.toFixed(2)}s`,
    padding,
    height * 0.5,
  );
}
