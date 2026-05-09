#!/usr/bin/env bash
# `.env.local` の STITCH_GOOGLE_API_KEY を export してから Cursor でこのリポジトリを開く。
# MCP（.cursor/mcp.json の ${env:STITCH_GOOGLE_API_KEY}）用。既存の Cursor は一度終了してから実行。
#
# 使い方（リポジトリ直下でも scripts からでも可）:
#   bash scripts/cursor-with-stitch-env.sh
#   npm run cursor:here

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"

load_stitch_key() {
  [[ -f "$ENV_FILE" ]] || return 0
  local line val
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// /}" ]] && continue
    if [[ "$line" =~ ^STITCH_GOOGLE_API_KEY[[:space:]]*=[[:space:]]*(.*)$ ]]; then
      val="${BASH_REMATCH[1]}"
      val="${val%$'\r'}"
      if [[ "$val" =~ ^\"(.*)\"$ ]]; then val="${BASH_REMATCH[1]}"; fi
      if [[ "$val" =~ ^\'(.*)\'$ ]]; then val="${BASH_REMATCH[1]}"; fi
      export STITCH_GOOGLE_API_KEY="$val"
      return 0
    fi
  done <"$ENV_FILE"
  return 0
}

load_stitch_key

if [[ -z "${STITCH_GOOGLE_API_KEY:-}" ]]; then
  echo "warn: STITCH_GOOGLE_API_KEY が .env.local に無いか空です（MCP は未認証のまま起動します）" >&2
fi

exec cursor "$ROOT"
