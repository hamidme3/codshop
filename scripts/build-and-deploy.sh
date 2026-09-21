#!/usr/bin/env bash
set -e

echo "=== 1. Building Next.js Standalone Bundle ==="
npm run build

echo "=== 2. Rebuilding Docker Image ==="
sudo docker build -t codshop-codshop:latest .

echo "=== 3. Recreating Container ==="
sudo docker compose -f docker-compose.coolify.yml up -d --force-recreate codshop

echo "=== 4. Waiting for Container Health ==="
sleep 6

sudo docker ps --filter "name=codshop-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "=== 5. Deployment Completed Successfully ==="
