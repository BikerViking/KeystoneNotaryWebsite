# Debug Tools

You can toggle a lightweight on-screen debug overlay via a query param or keyboard shortcut:

```
http://localhost:5173/?debug=1
```

Current overlays (fixed top-right):

- Services: shows scroll scrub progress (0..1) while the sticky window is in view.
- About: shows smoothed progress value (0..1) as you move through the section.

Global metrics:

- FPS instantaneous and average, max frame time (ms)
- scrollY and scroll velocity (px/s)

Controls (while debug is shown):

- d: toggle overlay on/off
- Buttons: copy (clipboard), pause/resume sampling, reset stats

Keyboard toggle: press `d` to toggle the overlay on/off at any time.

Remove `?debug=1` or press `d` to hide the overlay. These overlays do not affect production behavior.
