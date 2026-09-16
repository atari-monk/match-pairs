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
} from 'atari-monk-atom-engine';
import { createGame, updateGame, renderGame } from './game';

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
  await loadAudio(audio, 'bg', './sounds/twinkle.wav');
})();

const game = createGame(render, input, audio);

const overlay = document.getElementById('start-overlay');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

overlay?.addEventListener('click', async () => {
  overlay.style.display = 'none';
  canvas.style.display = 'block';

  await playMusicAfterGesture(audio, 'bg', 0.5);
});

const loop = createLoop(
  (dt) => updateGame(game, dt),
  (alpha) => renderGame(game, alpha),
);

startLoop(loop);
