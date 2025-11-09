#!/bin/bash

# Affiliate System - Deployment Script
# This script helps you build and deploy the entire stack

set -e  # Exit on error

echo "🚀 Affiliate System - Deployment Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_warn ".env file not found!"
    if [ -f .env.example ]; then
        print_info "Copying .env.example to .env..."
        cp .env.example .env
        print_warn "⚠️  Please edit .env and update sensitive values (passwords, JWT_SECRET)"
        echo ""
        read -p "Press Enter to continue after editing .env..."
    else
        print_error ".env.example not found!"
        exit 1
    fi
fi

# Step 1: Pull base images (helps with timeout issues)
print_info "Step 1: Pulling Docker base images..."
echo "This helps avoid timeout issues during build"
echo ""

docker pull node:20-alpine &
docker pull node:22.20.0-alpine &
docker pull nginx:alpine &
docker pull postgres:16-alpine &
docker pull redis:7-alpine &

wait
print_info "✅ All base images pulled successfully!"
echo ""

# Step 2: Build services
print_info "Step 2: Building Docker images..."
docker compose build --no-cache

if [ $? -eq 0 ]; then
    print_info "✅ Build completed successfully!"
else
    print_error "❌ Build failed!"
    exit 1
fi
echo ""

# Step 3: Start services
print_info "Step 3: Starting services..."
docker compose up -d

if [ $? -eq 0 ]; then
    print_info "✅ Services started successfully!"
else
    print_error "❌ Failed to start services!"
    exit 1
fi
echo ""

# Step 4: Wait for services to be healthy
print_info "Step 4: Waiting for services to be ready..."
echo "This may take 30-60 seconds..."
sleep 10

# Check backend health
for i in {1..30}; do
    if curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
        print_info "✅ Backend is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "❌ Backend health check timeout!"
    fi
    echo -n "."
    sleep 2
done
echo ""

# Check frontend health
for i in {1..15}; do
    if curl -sf http://localhost/health > /dev/null 2>&1; then
        print_info "✅ Frontend is healthy!"
        break
    fi
    if [ $i -eq 15 ]; then
        print_error "❌ Frontend health check timeout!"
    fi
    echo -n "."
    sleep 2
done
echo ""

# Step 5: Run database migrations
print_info "Step 5: Running database migrations..."
docker compose exec -T backend npm run migration:run

if [ $? -eq 0 ]; then
    print_info "✅ Migrations completed successfully!"
else
    print_warn "⚠️  Migrations failed or already applied"
fi
echo ""

# Final status
echo "========================================"
echo "🎉 Deployment Complete!"
echo "========================================"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost:3000/api"
echo ""
echo "🔍 Health Checks:"
echo "   Frontend:  http://localhost/health"
echo "   Backend:   http://localhost:3000/api/health"
echo ""
echo "📊 View Logs:"
echo "   All:       docker compose logs -f"
echo "   Backend:   docker compose logs -f backend"
echo "   Frontend:  docker compose logs -f frontend"
echo ""
echo "🛑 Stop Services:"
echo "   docker compose down"
echo ""
echo "♻️  Restart Services:"
echo "   docker compose restart"
echo ""
