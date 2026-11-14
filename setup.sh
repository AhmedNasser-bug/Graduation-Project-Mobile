#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MODE="${1:-run}"

if [ "$MODE" = "--docker" ]; then
  echo "[Mobile Setup] Building Docker image 'nephroguard-mobile' ..."
  docker build -t nephroguard-mobile .
  docker rm -f nephroguard-mobile-bedside >/dev/null 2>&1 || true
  echo "[Mobile Setup] Starting container on http://localhost:5173 ..."
  docker run -d --rm --name nephroguard-mobile-bedside -p 5173:80 nephroguard-mobile
  echo "[Mobile Setup] Running at http://localhost:5173 (stop with: docker stop nephroguard-mobile-bedside)"
  exit 0
fi

echo "[Mobile Setup] Installing dependencies via npm ci ..."
npm ci

echo "[Mobile Setup] Running TypeScript check + Vite production build ..."
npm run build

if [ "$MODE" = "--verify-only" ]; then
  echo "[Mobile Setup] Verification complete (dist/ built cleanly)."
  exit 0
fi

if [ "$MODE" = "--dev" ]; then
  echo "[Mobile Setup] Starting Vite dev server on http://localhost:5173 ..."
  exec npm run dev
fi

echo "[Mobile Setup] Starting production preview server on http://localhost:5173 ..."
exec npm run preview -- --host
