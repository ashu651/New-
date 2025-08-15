# Snapzy — A next-gen social platform

Snapzy is a full-stack, production-ready social platform that blends media creation, realtime interactions, AI-powered safety and recommendations, and a creator-first economy. This monorepo ships a complete stack: web, mobile, backend APIs, realtime services, AI microservices, a fast media pipeline, infra as code, monitoring, and CI/CD.

## High-level architecture
```mermaid
flowchart LR
  subgraph Client Apps
    W[Web (Next.js)]
    M[Mobile (React Native)]
    EdgeWASM[Edge WASM Filters]
  end

  subgraph API Layer
    GQL[GraphQL Gateway (NestJS)]
    REST[REST (NestJS)]
  end

  subgraph Realtime (Go)
    Chat[Chat / DMs]
    Notif[Notifications]
    Live[Live Presence]
  end

  subgraph AI Services (Python FastAPI)
    Mod[Moderation]
    Recs[Recommendations]
    Cap[Captions]
  end

  subgraph Media (Rust)
    ImgVid[Image/Video Pipeline]
  end

  W -->|GraphQL/REST| GQL
  M -->|GraphQL/REST| GQL
  EdgeWASM --- W

  GQL <-->|Events| Realtime
  GQL --> Media
  GQL --> Mod
  GQL --> Recs
  GQL --> Cap

  subgraph Data
    PG[(PostgreSQL + pgvector)]
    CAS[(Cassandra/Scylla)]
    REDIS[(Redis)]
    ES[(OpenSearch/Elasticsearch)]
    S3[(MinIO/S3 + CDN)]
  end

  GQL <--> PG
  GQL <--> ES
  Recs <--> PG
  Realtime <--> REDIS
  Realtime <--> CAS
  Media <--> S3
  GQL <--> REDIS
```

## Key capabilities
- AI co-creator tools, semantic search, personalized Explore with user-tunable dials
- Smart albums, collaborative posts, Remix/Duet, long Reels with chapters/transcripts
- Topic Circles, Communities & moderation tools, expertise badges
- Monetization: Subscriptions, tips/micro-donations, shops & affiliate graph, sponsor marketplace with escrow
- Safety & privacy: multi-layer comment safety, E2E DMs, transparent appeals & moderation case system
- Performance: edge-cached hot feeds, WASM image effects, Rust media service, Go realtime
- Observability: OpenTelemetry tracing, Prometheus metrics, Grafana dashboards, Loki logs

## Monorepo layout
- `services/web` — Next.js (TypeScript), Tailwind, Framer Motion, Redux Toolkit, React Query
- `services/mobile` — React Native (TypeScript, Expo), native bridges (Swift/Kotlin) for media capture
- `services/api` — NestJS (TypeScript) GraphQL + REST, JWT/OAuth 2.1, RBAC, rate limits, signed URLs
- `services/realtime` — Go microservices (chat, notifications) with Redis + Cassandra
- `services/ai` — Python FastAPI (moderation, recommendations, captions)
- `services/media` — Rust media pipeline for image/video processing
- `db` — PostgreSQL migrations, Cassandra CQL, OpenSearch mappings, vector schemas, Redis key docs
- `infra` — Docker, K8s, Helm charts, observability stack, ingress, CI/CD workflows
- `seeds` — Seed scripts for realistic fixtures
- `tests` — Unit, integration, and E2E tests

## Quickstart (Docker)
- Copy `.env.sample` to `.env` and update values if needed
- Build and start: `docker compose up -d --build`
- Web: `http://localhost:3000`
- API (REST): `http://localhost:8080/api` | GraphQL: `http://localhost:8080/graphql`
- AI: `http://localhost:8082`
- Realtime: `ws://localhost:8083/ws`
- Media: `http://localhost:8084`
- OpenSearch Dashboards: `http://localhost:5601` (if enabled)
- MinIO Console: `http://localhost:9001`

## Deploy to Kubernetes
- See `infra/k8s/helm/` charts. Example:
```
helm upgrade --install snapzy infra/k8s/helm/snapzy -n snapzy --create-namespace -f infra/k8s/helm/values.dev.yaml
```

## Documentation
- INSTALL and runbook: `INSTALL.md`
- Feature set (150+): `docs/FEATURES.md`
- Database schemas: `db/`
- UI/UX design system and flows: `services/web/docs/`
- Observability dashboards: `infra/observability/`

---

Licensed under Apache-2.0. © Snapzy contributors.