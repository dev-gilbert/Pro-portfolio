# Gilbert Muhire — Animated Portfolio

A responsive, motion-led portfolio built with Vite, React, TypeScript, Motion for React, and Lucide icons.

## Requirements
- Node.js 20 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```

## Verify and build
```bash
npm run build
npm run preview
```

## Customize
- Edit project content in `src/App.tsx`.
- Edit visual styles and responsive breakpoints in `src/index.css`.
- Update metadata and fonts in `index.html`.

## Features
- **Motion animations** (`motion/react`): staggered hero entrance, scroll-triggered reveals, hero parallax, spring-based reading progress bar, magnetic scroll button, 3D tilt on project cards, staggered skill chips.
- **Interactive particles**: a full-page canvas particle network (`src/components/ParticleCanvas.tsx`) that links nearby particles, reacts to the cursor, pauses when the tab is hidden, and recolours with the theme.
- **Dark / light mode**: animated sun/moon toggle (`src/components/ThemeToggle.tsx`). Follows the system setting until you choose, remembers your choice in `localStorage`, and applies before first paint (no flash).
- **Smooth scrolling**: inertia scrolling and eased anchor navigation via [Lenis](https://github.com/darkroomengineering/lenis) (`src/hooks/useSmoothScroll.ts`).
- **Accessibility**: all motion, particles and smooth scrolling respect `prefers-reduced-motion`.

Project artwork is created with CSS and HTML rather than external image dependencies.
