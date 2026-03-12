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
echo "--- Backend: npm run build ---"
cd backend
npm run build || { echo "ERROR: Backend build failed"; exit 1; }
echo "✓ Backend build completed"
cd ..
echo ""

# Frontend Next.js
echo "--- Frontend: npm run build ---"
cd frontend/portalradio_v2
npm run build || { echo "ERROR: Frontend build failed"; exit 1; }
echo "✓ Frontend build completed"
cd ../..
echo ""

# API migrations
echo "--- API: php artisan migrate ---"
cd api
php artisan migrate || { echo "ERROR: Database migration failed"; exit 1; }
echo "✓ Database migration completed"
echo ""

# Restart PM2
echo "--- Restart PM2: portalradio_v2 ---"
pm2 restart portalradio_v2 || { echo "ERROR: PM2 restart failed"; exit 1; }
echo "✓ PM2 restart completed"
echo ""

echo "=== Deploy finished at $(date) ==="
} 2>&1 | tee -a "$LOG_FILE"
