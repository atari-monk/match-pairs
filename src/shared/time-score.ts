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
  if (state.completed) return;

  state.current += dt;
}

export function recordTimeScore(state: TimeScoreState) {
  if (state.completed) {
    return state.lastCompleted ?? state.current;
  }

  const score = state.current;

  state.lastCompleted = score;
  state.completed = true;
  state.scores = [...state.scores, score]
    .sort((a, b) => a - b)
    .slice(0, 5);

  return score;
}

export function resetTimeScore(state: TimeScoreState) {
  state.current = 0;
  state.completed = false;
}
