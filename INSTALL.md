# Snapzy Install & Run

## Prereqs
- Node 20, pnpm 9
- Docker + Docker Compose
- Python 3.11 (optional to run AI locally without Docker)
- Go 1.22, Rust 1.79 (if building locally)

## Quickstart (Compose)
1. Copy `.env.sample` to `.env`
2. Start infra + apps:
   - `docker compose up -d --build`
3. Apply DB migrations:
   - `docker compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -f /data/migrations/0001_init.sql` (or run scripts below)
4. Visit services:
   - Web: http://localhost:3000
   - API: http://localhost:4000/v1/health, GraphQL: http://localhost:4000/graphql
   - Realtime: ws://localhost:4100/ws
   - AI: http://localhost:5000/health
   - MinIO Console: http://localhost:9001
   - OpenSearch Dashboards: http://localhost:5601
   - Jaeger: http://localhost:16686
   - Grafana: http://localhost:3001

## Local Dev without Docker
- `pnpm install`
- Start Postgres/Redis/OpenSearch/MinIO locally or via Docker
- `pnpm --filter @snapzy/api dev`
- `pnpm --filter @snapzy/web dev`

## Migrations
- Postgres: see `db/postgres/migrations/0001_init.sql`
- Cassandra: `db/cassandra/schema.cql`
- OpenSearch: index templates in `db/opensearch/*.json`

## Seeding
- Run `scripts/seed/seed-dev.ts` (TBD in repo) after the API is up to create demo users and content.

## Kubernetes
- Helm charts in `infra/helm` (TBD). Set values via `values.yaml` and secrets via `SealedSecrets`.

## Security
- Change `JWT_SECRET` and all credentials in `.env`
- Use TLS in production with a proper ingress and cert manager.