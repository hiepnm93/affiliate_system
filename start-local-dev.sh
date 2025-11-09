#!/bin/bash

echo "========================================="
echo "  Affiliate System - Local Development"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

echo "Checking dependencies..."
echo ""

# Check PostgreSQL
echo -n "PostgreSQL: "
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    PG_VERSION=$(psql --version | awk '{print $3}')
    echo "  Version: $PG_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install: https://www.postgresql.org/download/"
fi

# Check Redis
echo -n "Redis: "
if command -v redis-cli &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    REDIS_VERSION=$(redis-cli --version | awk '{print $2}')
    echo "  Version: $REDIS_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    echo "  Install: https://redis.io/download"
fi

# Check Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    NODE_VERSION=$(node --version)
    echo "  Version: $NODE_VERSION"
else
    echo -e "${RED}✗ Not found${NC}"
    exit 1
fi

echo ""
echo "========================================="
echo "  Database Connection Test"
echo "========================================="
echo ""

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Test PostgreSQL connection
echo -n "Testing PostgreSQL connection to ${DB_HOST}:${DB_PORT}... "
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✓ Success${NC}"

    # Check if database exists
    echo -n "Checking database '$DB_NAME'... "
    DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
    if [ "$DB_EXISTS" = "1" ]; then
        echo -e "${GREEN}✓ Exists${NC}"
    else
        echo -e "${YELLOW}✗ Not found. Creating...${NC}"
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}✓ Database created${NC}"
    fi
else
    echo -e "${RED}✗ Failed${NC}"
    echo ""
    echo "Please check:"
    echo "  1. PostgreSQL is running"
    echo "  2. Connection details in .env are correct:"
    echo "     DB_HOST=$DB_HOST"
    echo "     DB_PORT=$DB_PORT"
    echo "     DB_USERNAME=$DB_USERNAME"
    echo "     DB_PASSWORD=***"
    echo ""
    echo "To start PostgreSQL:"
    echo "  - Linux: sudo systemctl start postgresql"
    echo "  - macOS: brew services start postgresql"
    echo "  - Windows: Start PostgreSQL service"
    exit 1
fi

# Test Redis connection
echo -n "Testing Redis connection to ${REDIS_HOST}:${REDIS_PORT}... "
if [ -n "$REDIS_PASSWORD" ]; then
    REDIS_TEST=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD ping 2>/dev/null)
else
    REDIS_TEST=$(redis-cli -h $REDIS_HOST -p $REDIS_PORT ping 2>/dev/null)
fi

if [ "$REDIS_TEST" = "PONG" ]; then
    echo -e "${GREEN}✓ Success${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
    echo ""
    echo "Please check:"
    echo "  1. Redis is running"
    echo "  2. Connection details in .env are correct:"
    echo "     REDIS_HOST=$REDIS_HOST"
    echo "     REDIS_PORT=$REDIS_PORT"
    echo ""
    echo "To start Redis:"
    echo "  - Linux: sudo systemctl start redis"
    echo "  - macOS: brew services start redis"
    echo "  - Windows: Start Redis service"
    exit 1
fi

echo ""
echo "========================================="
echo "  Starting Development Servers"
echo "========================================="
echo ""

# Start backend
echo "Starting backend server..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 5

# Start frontend
echo "Starting frontend server..."
cd frontend
pnpm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Development Servers Started!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Backend:  http://localhost:${BACKEND_PORT:-3000}"
echo "Frontend: http://localhost:${FRONTEND_PORT:-3001}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
