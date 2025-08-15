# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml* nest-cli.json tsconfig.json ./
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate && pnpm install --frozen-lockfile

FROM deps AS build
COPY src ./src
RUN pnpm build

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
EXPOSE 8080
CMD ["node", "dist/main.js"]