#!/bin/bash

# Deploy script for Do I Know This Artist?
# Build locally, transfer images to VPS

set -e

echo "Building images locally..."
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f docker-compose.prod.yml build --pull --no-cache

echo "Saving images..."
docker save dikta-backend:latest | gzip > backend.tar.gz
docker save dikta-frontend:latest | gzip > frontend.tar.gz

echo "Uploading to VPS..."
ssh h "mkdir -p /root/dikta"
scp backend.tar.gz frontend.tar.gz docker-compose.prod.yml backend/.env h:/root/dikta/

echo "Deploying..."
ssh h << 'ENDSSH'
cd /root/dikta
docker load < backend.tar.gz
docker load < frontend.tar.gz
rm *.tar.gz
docker compose -f docker-compose.prod.yml up -d --force-recreate
docker compose -f docker-compose.prod.yml ps
ENDSSH

rm backend.tar.gz frontend.tar.gz

echo "Checking running containers..."
# Local checks (the heredoc above has no set -e): fail the deploy on a vulnerable Node or a dev-mode backend.
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

echo "Deployment complete!"
