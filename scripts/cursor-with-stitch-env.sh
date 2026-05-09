#!/usr/bin/env bash
# `.env.local` の STITCH_GOOGLE_API_KEY を export してから Cursor でこのリポジトリを開く。
# MCP（.cursor/mcp.json の ${env:STITCH_GOOGLE_API_KEY}）用。
#
# 前提・手順・トラブルシュートは docs/develop/CURSOR_STITCH.md を参照。
# Windows は Git Bash 想定。「Shell Command: Install 'cursor' in PATH」を済ませておく。
#
# 使い方（任意の cwd からでも同じフォルダを開く）:
#   bash scripts/cursor-with-stitch-env.sh
#   npm run cursor:here   （bash が PATH に必要）

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
  echo "warn: STITCH_GOOGLE_API_KEY が .env.local に無いか空です（MCP は未認証のままです）" >&2
fi

prepend_cursor_bins() {
  # Git Bash で `cursor` が PATH に載っていないとき、既定インストール先を PATH に足す
  local -a cand=()
  [[ -n "${LOCALAPPDATA:-}" ]] &&
    cand+=("${LOCALAPPDATA}/Programs/cursor/resources/app/bin")
  [[ -n "${USERPROFILE:-}" ]] &&
    cand+=("${USERPROFILE}/AppData/Local/Programs/cursor/resources/app/bin")

  local d unix
  for d in "${cand[@]}"; do
    [[ -z "$d" ]] && continue
    unix="$d"
    # C:\ Windows パスなら POSIX へ（Git Bash）
    if [[ "$d" =~ ^[A-Za-z]: ]] && command -v cygpath >/dev/null 2>&1; then
      unix="$(cygpath -u "$d" 2>/dev/null)" || unix="$d"
    fi
    if [[ -d "$unix" ]]; then
      export PATH="$unix:$PATH"
      return 0
    fi
  done
}

if ! command -v cursor >/dev/null 2>&1; then
  prepend_cursor_bins
fi

if ! command -v cursor >/dev/null 2>&1; then
  echo "error: Cursor CLI 'cursor' が見つかりません。" >&2
  echo "  Cursor で \"Shell Command: Install 'cursor' command in PATH\" を実行し、Git Bash を開き直してください。" >&2
  echo "  詳細は docs/develop/CURSOR_STITCH.md を参照。" >&2
  exit 1
fi

exec cursor "$ROOT"
