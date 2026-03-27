#!/bin/bash

# Deploy script for Do I Know This Artist?
# Build locally, transfer images to VPS

set -e

echo "Building images locally..."
DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f docker-compose.prod.yml build --no-cache

echo "Saving images..."
docker save dikta-backend:latest | gzip > backend.tar.gz
docker save dikta-frontend:latest | gzip > frontend.tar.gz

echo "Uploading to VPS..."
ssh h "mkdir -p /root/dikta"
scp backend.tar.gz frontend.tar.gz docker-compose.prod.yml .env h:/root/dikta/

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
echo "Deployment complete!"
