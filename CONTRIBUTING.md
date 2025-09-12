# Contributing

Thanks for your interest in improving Keystone Notary Group’s site!

## Dev setup

- Node 18+
- Install deps: `npm install`
- Dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Tests: `npm test` (watch: `npm run test:watch`, coverage: `npm run coverage`)

## Code style & patterns

- React + TypeScript, Tailwind CSS.
- Prefer transform/opacity for animations; respect `prefers-reduced-motion`.
- Keep scroll work passive; use `requestAnimationFrame` for smoothing if needed.
- Use `Section` wrapper for section spacing and container.
- Keep components small; colocate simple helpers; avoid global singletons.

## Testing

- Unit tests live under `components/__tests__` and `hooks/__tests__`.
- Use Vitest + Testing Library (jsdom). IntersectionObserver is mocked in `test/setup.ts`.
- Add tests alongside new components/hooks. Aim to cover:
  - Visible output / aria attributes
  - Hook return values and basic behavior
  - Accessibility affordances (e.g., accordions)

## Accessibility

- Use semantic landmarks and roles.
- Ensure visible focus states and keyboard support.
- Respect reduced motion; provide non-animated fallbacks.

## Performance

- Avoid expensive work in scroll handlers; prefer rAF and memoized styles.
- Large images: set width/height; lazy-load below the fold.

## Pull Requests

- Keep PRs focused and small where possible.
- Include before/after notes or a brief demo for motion tweaks.

