#!/bin/bash
set -e

echo "=== Deploy started at $(date) ==="

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "--- Git pull ---"
git pull origin main

# API
echo "--- API: composer install ---"
cd api
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend Next.js
echo "--- Frontend: npm build ---"
cd ../frontend/portalradio_v2
npm install
npm run build

# Backend React admin
echo "--- Backend: npm build ---"
cd ../../backend
npm install
npm run build

echo "=== Deploy finished at $(date) ==="
