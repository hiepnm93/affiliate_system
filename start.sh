#!/bin/bash

# Quick start script for Affiliate System
# Helps choose between Docker (production) or Local Dev

set -e

echo "🚀 Affiliate System - Quick Start"
echo "=================================="
echo ""
echo "Choose deployment mode:"
echo ""
echo "1) 🐳 Docker (Production) - Recommended"
echo "   - Full stack with containers"
echo "   - Access: http://localhost"
echo ""
echo "2) 💻 Local Development"
echo "   - Backend: npm run start:dev"
echo "   - Frontend: pnpm run dev"
echo "   - Access: http://localhost:3001"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
  1)
    echo ""
    echo "🐳 Starting Docker containers..."
    echo "=================================="
    docker compose down 2>/dev/null || true
    docker compose up -d --build
    echo ""
    echo "✅ Docker deployment complete!"
    echo ""
    echo "📊 Services:"
    docker compose ps
    echo ""
    echo "🌐 Access points:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:3000/api"
    echo "   API Docs: http://localhost:3000/api-docs"
    echo ""
    echo "🔑 Admin Login:"
    echo "   Email:    admin@affiliate.com"
    echo "   Password: Admin@123456"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:        docker compose logs -f"
    echo "   Stop services:    docker compose down"
    echo "   Restart backend:  docker compose restart backend"
    ;;
  2)
    echo ""
    echo "💻 Starting Local Development..."
    echo "=================================="
    echo ""
    echo "⚠️  Prerequisites:"
    echo "   - PostgreSQL running on localhost:5432"
    echo "   - Redis running on localhost:6379"
    echo "   - Node.js v20+ installed"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
    echo ""
    echo "📦 Installing dependencies..."

    # Backend
    if [ ! -d "backend/node_modules" ]; then
      echo "   Installing backend dependencies..."
      cd backend && npm install && cd ..
    fi

    # Frontend
    if [ ! -d "frontend/node_modules" ]; then
      echo "   Installing frontend dependencies..."
      cd frontend && pnpm install --ignore-scripts && cd ..
    fi

    echo ""
    echo "✅ Dependencies installed!"
    echo ""
    echo "🚀 To start development servers, run in separate terminals:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "   cd backend && npm run start:dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "   cd frontend && pnpm run dev"
    echo ""
    echo "🌐 Access points:"
    echo "   Frontend: http://localhost:3001"
    echo "   Backend:  http://localhost:3000/api"
    echo ""
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac
