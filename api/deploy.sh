#!/bin/bash
set -e

echo "=== Deploy started at $(date) ==="

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Git pull
echo "--- Git pull ---"
git pull origin main

# Backend React admin
echo "--- Backend: npm run build ---"
cd backend
npm run build

# Frontend Next.js
echo "--- Frontend: npm run build ---"
cd ../frontend/portalradio_v2
npm run build

# API migrations
echo "--- API: php artisan migrate ---"
cd ../../api
php artisan migrate

echo "=== Deploy finished at $(date) ==="
