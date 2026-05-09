# 本番用（Cloud Run の dev / prod 共通イメージ。threadhall-dev は cloudbuild.dev.yaml で別タグ）。
# `npm run build` → devDependencies を `npm prune` で落とし、ランタイムは `npm run start`
# （`next start --hostname 0.0.0.0` … Cloud Run の PORT は環境変数で上書き）。
# compose のホットリロードだけ Dockerfile.dev の `npm run dev`。
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
ENV NEXT_TELEMETRY_DISABLED=1 \
    DEBIAN_FRONTEND=noninteractive

FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next ビルドで @/lib/auth が読み込まれると Better Auth が libSQL を初期化する。
# CI（.github/workflows/ci.yml）と同様、イメージビルド時だけファイル URL とダミーシークレットを使う。
# 実行時は Cloud Run の環境変数・Secret が上書きする。
ENV TURSO_DATABASE_URL=file:/tmp/threadhall-docker-build.db
ENV BETTER_AUTH_SECRET=01234567890123456789012345678901
ENV BETTER_AUTH_URL=http://localhost:3000
RUN npm run build \
  && npm prune --omit=dev

FROM base AS runner
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs \
  && mkdir -p /tmp/npm-cache \
  && chown nextjs:nodejs /tmp/npm-cache

COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
ENV NPM_CONFIG_CACHE=/tmp/npm-cache
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "start"]
