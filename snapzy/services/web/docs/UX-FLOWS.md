# UX flows and components

## Flows
- Auth: email/handle + password, 2FA prompt if enabled, device/session review
- Feed: blended Home with follow graph + quality score + recs; client prefetch via React Query
- Post: create with WASM filters, captions from AI service, drafts autosave
- Reels: long video with transcripts/chapters; remix/duet workflows
- Search: typeahead backed by OpenSearch; semantic search via embeddings
- Profile: grid/list toggles; circles (topic-based audiences)
- Chat: E2E DMs; safety layers; appeals flow
- Shop: in-profile storefront, Stripe/UPI checkout

## Components
- AppShell: header with tabs, FAB for capture
- Button, Input, Select, Toggle, Modal, Tooltip: documented variants and states
- MediaCard: hover actions, focus-visible states, aria-labels for assistive tech

## Accessibility
- Contrast ratios AA; keyboard navigable lists; skip links; screen reader labels

## Motion
- Shared element transitions; reduced motion: honors `prefers-reduced-motion`