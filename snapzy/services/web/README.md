# Web App (Next.js)

- Design tokens in `tailwind.config.ts` and `app/globals.css`
- Accessibility: skip links, dark/light, high-contrast support. All interactive elements keyboard focusable.
- Pages: `/` landing, `/explore` placeholder. Connects to API via env URLs.

See design docs in `services/web/docs/`.

## Component library
- Buttons: sizes sm/md/lg, variants primary/secondary/ghost; focus ring and WCAG AA contrast
- Cards: elevation `shadow-soft`, radii `xl`
- Avatars: sizes 24/32/40/64, fallback initials

## Motion
- Orchestrated via Framer Motion; prefer opacity/transform for GPU-accelerated animations

## Modes
- Light/Dark: automatic via `prefers-color-scheme`; manual override can be added with a toggle stored in localStorage
- High contrast: honors `prefers-contrast: more`