#!/bin/bash
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Setup logging
LOG_FILE="deploy.log"
{
echo "=== Deploy started at $(date) ==="
echo "Project root: $PROJECT_ROOT"
echo ""

# Git pull
echo "--- Git pull ---"
git pull origin main || { echo "ERROR: Git pull failed"; exit 1; }
echo "✓ Git pull completed"
echo ""

# Backend React admin
echo "--- Backend: npm install ---"
cd backend
npm install --no-audit --no-fund || { echo "ERROR: Backend npm install failed"; exit 1; }
echo "✓ Backend npm install completed"
echo "--- Backend: npm run build ---"
npm run build || { echo "ERROR: Backend build failed"; exit 1; }
echo "✓ Backend build completed"
cd ..
echo ""

# Frontend Next.js
echo "--- Frontend: npm install ---"
cd frontend/portalradio_v2
npm install --no-audit --no-fund || { echo "ERROR: Frontend npm install failed"; exit 1; }
echo "✓ Frontend npm install completed"
echo "--- Frontend: npm run build ---"
npm run build || { echo "ERROR: Frontend build failed"; exit 1; }
echo "✓ Frontend build completed"
cd ../..
echo ""

# API dependencies
echo "--- API: composer install ---"
cd api
composer install --no-dev --optimize-autoloader --no-interaction || { echo "ERROR: Composer install failed"; exit 1; }
echo "✓ Composer install completed"
echo ""

# API migrations
echo "--- API: php artisan migrate ---"
php artisan migrate || { echo "ERROR: Database migration failed"; exit 1; }
echo "✓ Database migration completed"
echo ""

# Restart PM2
echo "--- Restart PM2: portalradio_v2 ---"
pm2 restart portalradio_v2 || { echo "ERROR: PM2 restart failed"; exit 1; }
echo "✓ PM2 restart completed"
echo ""

# Chat WebSocket server (Laravel Reverb); started on first deploy, restarted after
echo "--- Restart PM2: portalradio-reverb ---"
cd api
pm2 describe portalradio-reverb > /dev/null 2>&1 \
    && pm2 restart portalradio-reverb \
    || pm2 start artisan --name portalradio-reverb --interpreter php -- reverb:start --host=127.0.0.1 --port=8080 \
    || echo "WARNING: Reverb restart failed; chat falls back to polling"
pm2 save > /dev/null 2>&1 || true
cd ..
echo ""

echo "=== Deploy finished at $(date) ==="
} 2>&1 | tee -a "$LOG_FILE"
