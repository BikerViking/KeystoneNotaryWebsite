# Keystone Notary Group, LLC - Modern Website

This project is a premium, modern website for Keystone Notary Group, LLC, showcasing services with scroll‑driven motion, refined depth, and accessibility built‑in.

## Features

-   **Stunning Animations:** Smooth, scroll-driven animations for each section, creating an engaging user experience.
-   **Responsive Design:** Fully responsive layout that looks great on all devices, from mobile phones to desktops.
-   **Modern Stack:** Built with React, TypeScript, and Tailwind CSS (via CDN).
-   **Accessible:** Built with semantic HTML and accessibility best practices in mind.

## Tech Stack

-   **Framework:** [React](https://react.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## How It Works

This is a single-page application built with modern web technologies but without a complex build setup.

-   Vite dev server powers local development; Tailwind is built via PostCSS.
-   `Section` wraps sections with consistent spacing and `scroll-mt` anchor offsets.
-   Motion follows the guidelines in `docs/ANIMATIONS.md` and respects reduced motion.

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run typecheck` – TypeScript checks
- `npm test` – run unit tests (Vitest + RTL)

## Tests

Unit tests exist for key components and hooks:
- `components/__tests__`: Header, Section, FAQ, AnimatedOnView, ProofBar
- `hooks/__tests__`: useOnScreen, useScrollProgress

## Accessibility

- Visible focus states, keyboard support, ARIA for accordions and progress bars.
- Reduced motion support across animations.

## Contributing

See `CONTRIBUTING.md` and `SECURITY.md`.
