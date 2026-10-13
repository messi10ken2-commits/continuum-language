#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Disposable local development database; never use this configuration in production.
if docker container inspect continuum-dev-db >/dev/null 2>&1; then
  test "$(docker inspect --format '{{index .Config.Labels "continuum.purpose"}}' continuum-dev-db)" = development
  docker start continuum-dev-db >/dev/null
else
  docker run -d --name continuum-dev-db --label continuum.purpose=development \
    -p 127.0.0.1:55432:5432 -e POSTGRES_HOST_AUTH_METHOD=trust \
    -e POSTGRES_USER=continuum_dev -e POSTGRES_DB=continuum_dev \
    postgres@sha256:3645570cccdfa447589da9f57dd740faa29b30938e861289a5574b6ca6b03826 >/dev/null
fi
for attempt in {1..30}; do
  if docker exec continuum-dev-db pg_isready -U continuum_dev -d continuum_dev >/dev/null; then break; fi
  sleep 1
done
docker exec continuum-dev-db pg_isready -U continuum_dev -d continuum_dev
npm run build
# Always use the isolated local DB, regardless of any inherited production URL.
export DATABASE_URL=postgresql://continuum_dev@127.0.0.1:55432/continuum_dev
export NODE_ENV=development
exec node server.mjs
