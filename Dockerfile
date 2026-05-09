# 本番用（threadhall-prod / Cloud Run 本番）。
# next build の standalone 出力 + node server.js。dev は Dockerfile.dev のみ使用。
# ローカル開発は docker-compose + Dockerfile.dev。
#
# ビルド例:
#   docker build -t threadhall:local .
# 実行例（PORT は Cloud Run が注入。ローカルでは 3000 でよい）:
#   docker run --rm -p 3000:3000 -e PORT=3000 \
#     -e TURSO_DATABASE_URL=... -e TURSO_AUTH_TOKEN=... \
#     -e BETTER_AUTH_SECRET=... -e BETTER_AUTH_URL=http://localhost:3000 \
#     threadhall:local

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# ビルド時に必須になる環境変数があれば --build-arg で渡す（NEXT_PUBLIC_* 等）
RUN npm run build

FROM base AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
