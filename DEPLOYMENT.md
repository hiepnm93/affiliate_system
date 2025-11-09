# 🚀 Deployment Guide - Affiliate System

## ✅ Prerequisites

- Docker & Docker Compose installed
- Git installed
- Ports available: 80 (frontend), 3000 (backend), 5432 (postgres), 6379 (redis)

## 📦 Quick Deploy

### 1. Clone & Configure
```bash
git clone <repository-url>
cd affiliate_system

# Copy environment file (optional - has defaults)
cp .env.example .env
```

### 2. Deploy with Docker Compose
```bash
docker compose up -d --build
```

This will:
- ✅ Build frontend (React + Vite)
- ✅ Build backend (NestJS)
- ✅ Start PostgreSQL database
- ✅ Start Redis cache
- ✅ Run database migrations
- ✅ Start all services

### 3. Verify Deployment
```bash
# Check all services are running
docker compose ps

# Check logs
docker compose logs -f

# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost/health
```

## 🔍 Testing Scripts

### Test Local Build (Fast)
```bash
# Test TypeScript compilation only
./test-build.sh
```

### Test Docker Build (Frontend Only)
```bash
# Test frontend Docker image build
./test-docker-frontend.sh
```

### Deploy Full Stack
```bash
# Deploy everything
docker compose up -d --build
```

## 🌐 Access Points

Once deployed, access:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory (optional - has sensible defaults):

```env
# Database
POSTGRES_DB=affiliate_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379

# Backend
BACKEND_PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Application Settings
MAX_AFFILIATE_LEVELS=10
COOKIE_TTL_DAYS=30

# Frontend
FRONTEND_PORT=80
```

### Default Credentials

After first deployment:
1. Register as affiliate: http://localhost/auth/register?type=affiliate
2. Or register as customer: http://localhost/auth/register?type=customer

## 🐛 Troubleshooting

### Build Issues

**TypeScript Errors:**
```bash
cd frontend
pnpm install --ignore-scripts
pnpm run build
```

**Docker Build Fails:**
```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -af
docker compose up -d --build
```

**Port Conflicts:**
```bash
# Check what's using port 80
sudo lsof -i :80

# Change frontend port in docker-compose.yml or .env
FRONTEND_PORT=8080
```

### Runtime Issues

**Database Connection Issues:**
```bash
# Check postgres is running
docker compose logs postgres

# Verify database exists
docker compose exec postgres psql -U postgres -l
```

**Backend Not Starting:**
```bash
# Check backend logs
docker compose logs backend

# Restart backend only
docker compose restart backend
```

**Frontend 502 Error:**
```bash
# Check nginx logs
docker compose logs frontend

# Verify backend is accessible
docker compose exec frontend wget -O- http://backend:3000/health
```

## 🔄 Updates & Maintenance

### Pull Latest Changes
```bash
git pull origin main
docker compose up -d --build
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Stop Services
```bash
# Stop all
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Backup Database
```bash
docker compose exec postgres pg_dump -U postgres affiliate_db > backup.sql
```

### Restore Database
```bash
docker compose exec -T postgres psql -U postgres affiliate_db < backup.sql
```

## 📊 Production Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure proper `POSTGRES_PASSWORD`
- [ ] Configure proper `REDIS_PASSWORD`
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/TLS certificates for nginx
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Review and adjust resource limits in docker-compose.yml
- [ ] Set up reverse proxy (nginx/traefik) with SSL
- [ ] Configure firewall rules

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ http://localhost
       ▼
┌─────────────┐
│   Nginx     │ :80 (Frontend)
│  (Alpine)   │ - Serves React SPA
└──────┬──────┘ - Proxies /api → Backend
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  NestJS     │   │ PostgreSQL  │ :5432
│  Backend    │◄──┤  Database   │
│  :3000      │   └─────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Redis    │ :6379
│   Cache     │
└─────────────┘
```

## 📝 Development

For local development without Docker:

```bash
# Backend
cd backend
npm install
npm run start:dev

# Frontend (in another terminal)
cd frontend
pnpm install --ignore-scripts
pnpm run dev
```

Access:
- Frontend dev: http://localhost:3001
- Backend dev: http://localhost:3000

## 🆘 Support

If you encounter issues:
1. Check logs: `docker compose logs -f`
2. Verify all services are healthy: `docker compose ps`
3. Review this deployment guide
4. Check GitHub issues
