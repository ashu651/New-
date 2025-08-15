# Snapzy UI/UX

## Design Tokens
- Colors: primary #7C3AED, bg light/dark, text, muted
- Radii: 8,12,16,24,pill
- Shadows: sm, md, lg
- Type: Inter scale 12..32, weights 400..700

## Components (Figma-style specs)
- Button: variants primary/ghost; sizes sm/md/lg; 44px min touch target
- Input: 44px min height; visible focus; label+aria-label
- Card: radius 16; shadow md; supports dark mode
- Avatar: sizes 24/32/48/80; status ring

## Motion
- Use Framer Motion for feed card enter/exit; 200ms ease-out; reduce-motion media query

## Accessibility
- WCAG 2.1 AA; focus visible; color contrast >= 4.5 for body
- Keyboard: tab order; skip links; trap focus in dialogs
- Screen readers: aria-labels, roles; live regions for async status

## Flows
- Auth: Email/handle login -> 2FA prompt (if enabled) -> token storage -> redirect to feed
- Feed: Ranked blend follow graph + quality + similarity + freshness; infinite scroll; pinned reels
- Post: Compose -> media picker -> AI co-creator -> caption -> visibility -> publish -> presigned upload
- Reel: Capture -> template -> chapters/transcript -> publish; support remix/duet
- Story: Capture -> stickers -> publish (24h expiry)
- Search: Typeahead OpenSearch; filters; semantic vectors
- Profile: Grid, highlights, shops tab, badges; follow/subscribe
- Chat: E2E; topic threads; safety layers; appeals
- Shop: Creator shop -> products -> cart -> Stripe/UPI