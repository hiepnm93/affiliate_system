#!/bin/bash

# Test frontend Docker build only
# This helps debug frontend build issues without waiting for full stack

set -e

echo "🐳 Testing Frontend Docker Build..."
echo "===================================="
echo ""

cd frontend

echo "📦 Building frontend Docker image..."
docker build -t affiliate-frontend-test .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Frontend Docker build successful!"
    echo ""
    echo "🔍 Image details:"
    docker images | grep affiliate-frontend-test
    echo ""
    echo "🧹 Cleaning up test image..."
    docker rmi affiliate-frontend-test
    echo ""
    echo "✅ All tests passed! You can now run: docker compose up -d --build"
else
    echo ""
    echo "❌ Frontend Docker build failed!"
    echo "Please check the error messages above."
    exit 1
fi
