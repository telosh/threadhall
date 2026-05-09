# `.env.local` の STITCH_GOOGLE_API_KEY を環境に載せてから Cursor でこのリポジトリを開く。
# MCP（.cursor/mcp.json の ${env:STITCH_GOOGLE_API_KEY}）用。既存の Cursor は一度終了してから実行。
#
# 使い方（PowerShell）:
#   .\scripts\cursor-with-stitch-env.ps1
#   npm run cursor:here:pwsh

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$EnvFile = Join-Path $Root ".env.local"

if (Test-Path $EnvFile) {
  Get-Content $EnvFile | ForEach-Object {
    $t = $_.TrimEnd()
    if ($t -match "^\s*#" -or $t -eq "") { return }
    if ($t -match "^\s*STITCH_GOOGLE_API_KEY\s*=\s*(.*)$") {
      $raw = $matches[1].Trim()
      if ($raw.Length -ge 2 -and $raw.StartsWith('"') -and $raw.EndsWith('"')) {
        $raw = $raw.Substring(1, $raw.Length - 2)
      }
      elseif ($raw.Length -ge 2 -and $raw.StartsWith("'") -and $raw.EndsWith("'")) {
        $raw = $raw.Substring(1, $raw.Length - 2)
      }
      $env:STITCH_GOOGLE_API_KEY = $raw
    }
  }
}

if (-not $env:STITCH_GOOGLE_API_KEY) {
  Write-Warning "STITCH_GOOGLE_API_KEY が .env.local に無いか空です（MCP は未認証のまま起動します）"
}

Set-Location $Root
& cursor $Root
