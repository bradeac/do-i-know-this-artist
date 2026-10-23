#!/bin/bash

# Deploy script for Do I Know This Artist?
# Build locally, transfer images to VPS

set -e

echo "Building images locally..."
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f docker-compose.prod.yml build --pull --no-cache

echo "Checking built images..."
# Gate before anything is uploaded: a vulnerable Node or a dev-mode CMD must never reach the VPS.
for img in dikta-backend:latest dikta-frontend:latest; do
  v=$(docker run --rm --entrypoint node "$img" -v)
  echo "$img: node $v"
  bash "$(dirname "$0")/check-node-version.sh" "$v"
done
cmd=$(docker image inspect -f '{{join .Config.Cmd " "}}' dikta-backend:latest)
if [ "$cmd" != "node dist/index.js" ]; then
  echo "dikta-backend CMD is '$cmd', want 'node dist/index.js'" >&2
  exit 1
fi

echo "Saving images..."
docker save dikta-backend:latest | gzip > backend.tar.gz
docker save dikta-frontend:latest | gzip > frontend.tar.gz

echo "Uploading to VPS..."
ssh h "mkdir -p /root/dikta"
scp backend.tar.gz frontend.tar.gz docker-compose.prod.yml backend/.env h:/root/dikta/

echo "Deploying..."
ssh h << 'ENDSSH'
set -e
cd /root/dikta
docker load < backend.tar.gz
docker load < frontend.tar.gz
rm *.tar.gz
docker compose -f docker-compose.prod.yml up -d --force-recreate
docker compose -f docker-compose.prod.yml ps
ENDSSH

rm backend.tar.gz frontend.tar.gz

echo "Checking running containers..."
# Confirm on the live containers: fail the deploy on a vulnerable Node or a dev-mode backend.
for c in dikta-backend dikta-frontend; do
  v=$(ssh h "docker exec $c node -v")
  echo "$c: node $v"
  bash "$(dirname "$0")/check-node-version.sh" "$v"
done
cmd=$(ssh h "docker exec dikta-backend cat /proc/1/cmdline" | tr '\0' ' ')
echo "dikta-backend PID 1: $cmd"
case "$cmd" in
  "node dist/index.js "*) ;;
  *) echo "backend is not running node dist/index.js" >&2; exit 1 ;;
esac

# The container can start and die a second later (bad env, runtime error): wait for the app to answer.
for i in $(seq 15); do
  ssh h "curl -fsS http://localhost:5177/api/health" && break
  [ "$i" -eq 15 ] && { echo "backend /api/health not answering" >&2; exit 1; }
  sleep 2
done
echo

echo "Deployment complete!"
