#!/bin/bash

# Quick build test script
# Tests if frontend builds successfully without full Docker deployment

set -e

echo "🧪 Testing Frontend Build..."
echo "=============================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install --ignore-scripts
fi

# Run TypeScript check
echo "🔍 Running TypeScript check..."
pnpm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build output:"
    ls -lh dist/ | head -10
    echo ""
    echo "🚀 Ready for Docker deployment!"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
