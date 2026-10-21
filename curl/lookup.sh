#!/usr/bin/env bash
# Usage: WAGE_API_KEY=dak_... ./lookup.sh [employer-slug]
set -euo pipefail
: "${WAGE_API_KEY:?Set WAGE_API_KEY (your API key)}"
BASE="${WAGE_API_BASE_URL:-https://data-api.premed-toolkit.workers.dev}"
SLUG="${1:-amazon}"
curl -fsS -H "X-API-Key: $WAGE_API_KEY" "$BASE/v1/wages/employer/$SLUG"
echo
curl -fsS -H "X-API-Key: $WAGE_API_KEY" "$BASE/v1/usage"
echo
