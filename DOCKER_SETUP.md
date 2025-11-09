# Docker Setup Guide - Affiliate System

Hướng dẫn chạy toàn bộ Affiliate System với Docker Compose.

## 📋 Yêu cầu

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM khả dụng
- 10GB dung lượng đĩa

## 🚀 Quick Start

### 1. Cấu hình môi trường

Copy file `.env.example` thành `.env` và cập nhật các giá trị:

```bash
cp .env.example .env
```

**QUAN TRỌNG:** Thay đổi các giá trị sau trong `.env`:

```env
# Thay đổi passwords
POSTGRES_PASSWORD=your_strong_password_here
REDIS_PASSWORD=your_redis_password_here

# Thay đổi JWT secret (tối thiểu 32 ký tự)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# Tùy chọn: Thay đổi ports nếu bị conflict
BACKEND_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
```

### 2. Khởi động tất cả services

```bash
# Build và start tất cả services
docker-compose up -d

# Hoặc build lại images trước khi start
docker-compose up -d --build
```

### 3. Kiểm tra trạng thái

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Kiểm tra health status
docker-compose ps
```

### 4. Chạy migrations

```bash
# Chạy database migrations
docker-compose exec backend npm run migration:run
```

### 5. Truy cập ứng dụng

- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **API Documentation:** http://localhost:3000/api (nếu có Swagger)

## 📦 Services

### Backend (NestJS)

- **Container:** `affiliate_backend`
- **Port:** 3000 (configurable)
- **Health check:** Kiểm tra mỗi 30s
- **Dependencies:** PostgreSQL, Redis

### PostgreSQL

- **Container:** `affiliate_postgres`
- **Port:** 5432 (configurable)
- **Version:** PostgreSQL 16 Alpine
- **Data persistence:** `postgres_data` volume

### Redis

- **Container:** `affiliate_redis`
- **Port:** 6379 (configurable)
- **Version:** Redis 7 Alpine
- **Data persistence:** `redis_data` volume

## 🛠️ Các lệnh thường dùng

### Quản lý services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Stop và xóa volumes (XÓA DỮ LIỆU!)
docker-compose down -v
```

### Xem logs

```bash
# Tất cả logs
docker-compose logs -f

# Backend logs
docker-compose logs -f backend

# 100 dòng logs cuối
docker-compose logs --tail=100 backend
```

### Truy cập container

```bash
# Bash vào backend container
docker-compose exec backend sh

# Bash vào postgres container
docker-compose exec postgres sh

# Kết nối PostgreSQL client
docker-compose exec postgres psql -U postgres -d affiliate_db
```

### Database operations

```bash
# Chạy migrations
docker-compose exec backend npm run migration:run

# Tạo migration mới
docker-compose exec backend npm run migration:generate -- -n MigrationName

# Rollback migration
docker-compose exec backend npm run migration:revert
```

### Development

```bash
# Build lại backend image
docker-compose build backend

# Restart backend sau khi thay đổi code
docker-compose restart backend

# Xem logs real-time
docker-compose logs -f backend
```

## 🔧 Troubleshooting

### Port đã được sử dụng

Thay đổi ports trong file `.env`:

```env
BACKEND_PORT=3001
POSTGRES_PORT=5433
REDIS_PORT=6380
```

### Backend không kết nối được database

```bash
# Kiểm tra postgres đã ready chưa
docker-compose exec postgres pg_isready

# Xem logs postgres
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Clear data và restart fresh

```bash
# Dừng tất cả services
docker-compose down

# Xóa volumes (XÓA TẤT CẢ DỮ LIỆU!)
docker-compose down -v

# Xóa images
docker-compose down --rmi all

# Start lại từ đầu
docker-compose up -d --build
```

### Health check failed

```bash
# Kiểm tra logs
docker-compose logs backend

# Kiểm tra health endpoint
curl http://localhost:3000/health

# Restart service
docker-compose restart backend
```

## 📊 Monitoring

### Kiểm tra resource usage

```bash
# Docker stats
docker stats

# Container specific
docker stats affiliate_backend affiliate_postgres affiliate_redis
```

### Database backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres affiliate_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres affiliate_db < backup.sql
```

## 🔒 Security Best Practices

1. **Thay đổi tất cả passwords mặc định** trong `.env`
2. **Sử dụng JWT secret mạnh** (min 32 characters)
3. **Không commit file `.env`** vào git
4. **Giới hạn exposed ports** trong production
5. **Sử dụng secrets management** cho production (Docker Secrets, Vault)
6. **Enable SSL/TLS** cho production
7. **Regular security updates** cho Docker images

## 🚀 Production Deployment

### Sử dụng docker-compose.prod.yml

Tạo file riêng cho production:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      NODE_ENV: production
    # Không expose ports, dùng reverse proxy
    expose:
      - "3000"
```

```bash
# Deploy production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Sử dụng với Nginx reverse proxy

Thêm Nginx service vào docker-compose:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - backend
```

## 📝 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Application environment |
| `BACKEND_PORT` | 3000 | Backend API port |
| `POSTGRES_HOST` | postgres | PostgreSQL host |
| `POSTGRES_PORT` | 5432 | PostgreSQL port |
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | - | Database password |
| `POSTGRES_DB` | affiliate_db | Database name |
| `REDIS_HOST` | redis | Redis host |
| `REDIS_PORT` | 6379 | Redis port |
| `REDIS_PASSWORD` | - | Redis password |
| `JWT_SECRET` | - | JWT signing secret |
| `JWT_EXPIRES_IN` | 7d | JWT expiration time |
| `MAX_AFFILIATE_LEVELS` | 10 | Max affiliate chain depth |
| `COOKIE_TTL_DAYS` | 30 | Tracking cookie TTL |

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra health: `docker-compose ps`
3. Restart services: `docker-compose restart`
4. Check documentation: `backend/COMPLETE_IMPLEMENTATION_GUIDE.md`

## 📚 Tài liệu liên quan

- [Backend Implementation Guide](backend/COMPLETE_IMPLEMENTATION_GUIDE.md)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
