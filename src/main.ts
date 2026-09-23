import './style.css';
import {
  createRenderState,
  createInputState,
  attachInput,
  createAudioState,
  loadAudio,
  playMusicAfterGesture,
  createLoop,
  startLoop,
  stopMusic,
} from 'atari-monk-atom-engine';
import { loadImage } from './engine/image';
import { createGame, startGame, updateGame, renderGame } from './game/game';

async function main() {
  const assets = {
    faceDown: await loadImage(`${import.meta.env.BASE_URL}face-down.png`),
    faceUp: await loadImage(`${import.meta.env.BASE_URL}face-up.png`),
  };

  const render = createRenderState('canvas');

  const blockedKeys: string[] = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    ' ',
    'e',
  ];

  const input = createInputState(blockedKeys);

  attachInput(input);

  const audio = createAudioState();
  (async () => {
    await loadAudio(audio, 'bg', './sounds/bg.mp3');
    loadAudio(audio, 'click', './sounds/click.ogg');
    loadAudio(audio, 'miss', './sounds/miss.ogg');
    loadAudio(audio, 'pair', './sounds/pair.ogg');
  })();

  const game = createGame(render, input, audio, assets);

  const overlay = document.getElementById('start-overlay');
  const startButton = document.getElementById('start-button');
  const bestScores = document.getElementById('best-scores');
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  function showStartScreen() {
    if (overlay) {
      overlay.style.display = 'flex';
    }
    canvas.style.display = 'none';
  }

  function showGameplayScreen() {
    if (overlay) {
      overlay.style.display = 'none';
    }
    canvas.style.display = 'block';
  }

  function renderBestScores(scores: number[]) {
    if (!bestScores) {
      return;
    }
    if (scores.length === 0) {
      bestScores.innerHTML = '<p>No scores yet</p>';
      return;
    }
    const list = document.createElement('ol');
    for (const score of scores) {
      const item = document.createElement('li');
      item.textContent = `${score.toFixed(2)}s`;
      list.appendChild(item);
    }
    bestScores.replaceChildren(list);
  }

  showStartScreen();
  renderBestScores(game.timeScore.scores);

  window.addEventListener('game-scores-updated', (event: Event) => {
    const customEvent = event as CustomEvent<{
      scores: number[];
    }>;
    renderBestScores(customEvent.detail.scores);
  });

  startButton?.addEventListener('click', async () => {
    showGameplayScreen();
    startGame(game);
    await playMusicAfterGesture(audio, 'bg', 0.1);
  });

  const loop = createLoop(
    (dt) => {
      const completed = updateGame(game, dt);
      if (completed) {
        stopMusic(audio);
        showStartScreen();
      }
    },
    (alpha) => {
      renderGame(game, alpha);
    },
  );

  startLoop(loop);
}

main();
