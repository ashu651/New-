# Snapzy Monorepo

A production-grade, Instagram-beating social platform with modern architecture: Web (Next.js), Mobile (React Native), API (NestJS), Realtime (Go), AI (FastAPI), and Media (Rust), plus full data layer, infra, observability, and security.

## High-level Architecture
```mermaid
flowchart LR
  subgraph Clients
    W[Web (Next.js)]
    M[Mobile (React Native)]
  end

  subgraph Edge
    CDN[CDN/Edge Cache]
    Ingress[Ingress (Nginx/Traefik)]
  end

  subgraph Core Services
    API[NestJS GraphQL/REST]
    RT[Go Realtime WS]
    AI[Python FastAPI AI]
    MED[Rust Media]
  end

  subgraph Data
    PG[(PostgreSQL + pgvector)]
    CS[(Cassandra/Scylla)]
    RD[(Redis)]
    OS[(OpenSearch)]
    S3[(MinIO/S3)]
  end

  subgraph Observability
    Prom[Prometheus]
    Graf[Grafana]
    Jaeg[Jaeger]
  end

  Clients -->|HTTPS| Ingress --> API
  Clients -->|WebSocket| Ingress --> RT
  API <--> PG
  API <--> OS
  API <--> RD
  API -->|Presigned URLs| MED
  MED <--> S3
  RT <--> RD
  RT <--> CS
  API <--> AI

  API --> Prom
  RT --> Prom
  MED --> Prom
  API --> Jaeg
  RT --> Jaeg
  MED --> Jaeg
```

## Key Features
- AI co-creator tools; Smart Albums; Collaborative posts; Remix/Duet; Long Reels; Multi-camera capture; Draft sync + versioning
- Topic Circles; Quality-score follows; Communities & mods; Expertise badges; Subscriptions; Tips; Shop-in-profile; Affiliate graph; Sponsor marketplace
- Context labels; Comment safety layers; Digital wellbeing; Transparent appeals; Semantic search; Personalized Explore; Feature flags & A/B; Edge-cached hot feeds

## Next‑gen capabilities (beyond Instagram/TikTok/Snap)
- AI-first creation: co-creator templates, auto-chapters/transcripts, smart remixes, semantic cover selection
- Smart Albums with rules; cross-account collaborative albums and posts with granular roles and rev-split
- Topic Circles and Communities with moderator tools, safety layers, appeals, and transparent audit trails
- Tunable Explore: user-facing dials to adjust novelty, proximity, expertise, and safety
- Quality-score follows and content quality signals blending embeddings + graph + freshness
- E2E DMs with topic threads, guardianship for minors’ accounts, and wellbeing controls (hide likes, quiet hours)
- Sponsor marketplace with escrow and affiliate graph; creator shops, subscriptions, tips; UPI + Stripe
- Feature flags and robust A/B experiments; blue‑green/canary deploys; rollbacks
- Edge-cached hot feeds; realtime notifications and live presence; multi-camera capture and drafting across devices
- Hybrid search (OpenSearch + pgvector) and vector-powered semantic recommendations

## Monorepo Structure
```
apps/
  web/                # Next.js (TypeScript)
  mobile/             # React Native (Expo)
services/
  api/                # NestJS GraphQL/REST
  realtime/           # Go WebSocket services
  ai/                 # FastAPI for moderation/recs/captions
  media/              # Rust Actix-web media pipeline
packages/
  design-system/      # Tokens, Tailwind preset, UI components
  crypto/             # E2E DM crypto utilities (WebCrypto/libsodium)
  tsconfig/           # Shared TS config
  eslint-config/      # Shared ESLint config
infra/
  helm/               # Helm umbrella chart + subcharts
  k8s/                # Raw k8s manifests (optional)
  otel/               # OpenTelemetry configs
  grafana/            # Dashboards
  prometheus/         # Scrape configs
  jaeger/             # Jaeger configs
  nginx/              # Ingress examples
  certs/              # Dev TLS certs (dev only)
db/
  postgres/           # SQL migrations
  cassandra/          # CQL schemas
  opensearch/         # Index templates/mappings
  redis/              # Key design docs
scripts/
  seed/               # Seed/fixtures
  dev/                # Local helper scripts
.github/workflows/    # CI/CD pipelines
```

## Quickstart (Docker Compose)
- Copy `.env.sample` to `.env` and adjust values
- Build and start: `docker compose up -d --build`
- Web: `http://localhost:3000`, API: `http://localhost:4000`, GraphQL: `http://localhost:4000/graphql`
- MinIO: `http://localhost:9001`, OpenSearch Dashboards: `http://localhost:5601`, Jaeger: `http://localhost:16686`, Grafana: `http://localhost:3001`

## Documentation
- INSTALL: `INSTALL.md`
- UI/UX: `docs/uiux.md`
- Data Schemas: `db/`
- Helm/K8s: `infra/helm/`

## License
Apache-2.0 (see LICENSE)

## Deliverables in this repo
- High-level architecture diagram (above)
- Monorepo structure (`apps/`, `services/`, `packages/`, `infra/`, `db/`)
- Database schemas & migrations (Postgres + Cassandra + OpenSearch + Redis docs)
- Backend code (NestJS API, Go realtime, Rust media, Python AI)
- Frontend code (Next.js web + Expo React Native)
- DevOps files (Docker, CI)
- Seed scripts scaffold (`scripts/seed/`)
- Tests scaffold (API Jest config)
- Setup instructions (`INSTALL.md`)
- UI/UX tokens and components (`packages/design-system`)

## ERD (excerpt)
```
users (id) 1---1 user_profiles(user_id)
users (id) 1---* posts(author_id)
posts (id) 1---* post_media(post_id)
posts (id) *---* hashtags via post_hashtags
users (id) *---* users via follows(block)
posts/reels/comments *---* reactions
```

## Sequence: Upload post media
```
Web -> API: request upload token
API -> Media: POST /sign-upload { key }
Media -> S3: presign PUT
Media --> API: signed URL
API --> Web: signed URL
Web -> S3: PUT media
Web -> API: POST /v1/posts (with media refs)
```