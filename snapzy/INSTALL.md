# INSTALL / RUNBOOK

## Prerequisites
- Docker + Docker Compose
- pnpm 9.x (for local dev outside containers)

## Local (Docker Compose)
1. Copy env: `cp .env.sample .env`
2. Start stack: `docker compose up -d --build`
3. Apply Cassandra schema:
   - `docker exec -it snapzy-cassandra cqlsh -e "SOURCE '/schema.cql'"` (or run via `infra/scripts/apply_cql.sh`)
4. Create OpenSearch indices (from repo root):
   - `curl -XPUT "$ES_HOST/users_idx" -H 'Content-Type: application/json' -d @db/opensearch/users_idx.json`
   - `curl -XPUT "$ES_HOST/posts_idx" -H 'Content-Type: application/json' -d @db/opensearch/posts_idx.json`
   - `curl -XPUT "$ES_HOST/shops_idx" -H 'Content-Type: application/json' -d @db/opensearch/shops_idx.json`
5. Seed data: `pnpm seed` (or `docker exec -it snapzy-api node /app/dist/seeds/seed.js`)
6. Open:
   - Web: http://localhost:3000
   - API: http://localhost:8080/graphql
   - MinIO: http://localhost:9001

## Kubernetes
- Charts in `infra/k8s/helm`. Example dev deploy:
```
helm upgrade --install snapzy infra/k8s/helm/snapzy -n snapzy --create-namespace \
  -f infra/k8s/helm/values.dev.yaml
```

## Observability (optional)
- Start with profile: `docker compose --profile observability up -d`
- Grafana at http://localhost:3001 (admin/admin)

## Common commands
- Stop: `docker compose down -v`
- Logs: `docker compose logs -f api | sed -E 's/(Bearer\s+)[A-Za-z0-9\._\-]+/\1REDACTED/g'`

## Security
- Rotate `JWT_SECRET` for prod and configure OAuth credentials.
- Configure CORS and CSRF per environment in `services/api`.