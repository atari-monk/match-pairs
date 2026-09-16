import { type RenderState, type InputState, type AudioState, clear } from "atari-monk-atom-engine";
import { createRect, renderRect, updateRect, type RectState } from "./shared/rect";

export type GameState = {
    render: RenderState;
    input: InputState;
    audio: AudioState;
    rect: RectState;
};

export function createGame(
    render: RenderState,
    input: InputState,
    audio: AudioState
): GameState {
    return {
        render,
        input,
        audio,
        rect: createRect(960 - 50, 540 - 50, 100, 100),
    };
}

export function updateGame(
    state: GameState,
    dt: number
) {
    updateRect(state.rect, dt);
}

export function renderGame(
    state: GameState,
    _alpha: number
) {
    clear(state.render);
    renderRect(
        state.rect,
        state.render.ctx
    );
}
