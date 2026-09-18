## Mobile Screen

### Viewport Size

**Proposed interface:**

```ts
interface ViewportSize {
  width: number;
  height: number;
}

function getViewportSize(): ViewportSize;
```

Implement a helper function that retrieves the current viewport dimensions of the device.

The helper should return the current `window.innerWidth` and `window.innerHeight`, allowing the board to be sized according to the available viewport rather than the device's physical screen resolution.

The function should work automatically in both portrait and landscape orientations.

### Board Size

Use the `getViewportSize()` helper to determine the available viewport dimensions and size the board accordingly.

The board should adapt to the current viewport width and height and update its dimensions when the viewport changes, including transitions between portrait and landscape orientations.

### Board Behavior

For this task, focus exclusively on the game board and its responsive behavior.

The board should use the available viewport dimensions to automatically adjust its size. When the mobile viewport dimensions change, including when switching between portrait and landscape orientations, the board should resize accordingly while maintaining its intended proportions and fitting within the available space.

### Commits

- feat: add mobile screen and resolution support
