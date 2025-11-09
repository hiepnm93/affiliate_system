# Environment Variables Explained

## 🔑 Database Configuration - Two Sets of Variables

### **Set 1: `DB_*` - Backend Application Config**
Được đọc bởi **backend code** (ormconfig.ts)

```bash
DB_HOST=127.0.0.1      # Backend kết nối tới PostgreSQL ở đây
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=affiliate_db
```

**Khi nào dùng:**
- ✅ Chạy backend **ngoài Docker** (local development với `npm run start:dev`)
- ✅ Backend cần biết PostgreSQL ở đâu để kết nối

---

### **Set 2: `POSTGRES_*` - Docker Container Config**
Được đọc bởi **docker-compose.yml** để tạo PostgreSQL container

```bash
POSTGRES_USER=postgres      # Username cho container postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=affiliate_db    # Database name sẽ tạo trong container
```

**Khi nào dùng:**
- ✅ Chạy với Docker Compose (`docker-compose up`)
- ✅ Docker cần biết tạo user/password/database gì trong container postgres
- ⚠️ Backend code **KHÔNG ĐỌC** những biến này!

---

## 📋 Chi tiết từng scenario

### Scenario 1: Local Development (Backend chạy ngoài Docker)

**Services cần chạy:**
```bash
# Start PostgreSQL locally
sudo systemctl start postgresql

# Start Redis locally
sudo systemctl start redis
```

**Backend đọc từ `.env`:**
```bash
DB_HOST=127.0.0.1          # ✅ Backend kết nối tới localhost
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=affiliate_db
```

**Chạy:**
```bash
cd backend
npm run start:dev
```

---

### Scenario 2: Full Docker (Tất cả chạy trong Docker)

**Docker Compose override:**
```yaml
# docker-compose.yml tự động set cho backend container:
environment:
  DB_HOST: postgres        # ⚠️ Override từ docker-compose, KHÔNG đọc .env
  DB_USERNAME: ${POSTGRES_USER}
  DB_PASSWORD: ${POSTGRES_PASSWORD}
  DB_NAME: ${POSTGRES_DB}
```

**File `.env` cung cấp:**
```bash
POSTGRES_USER=postgres      # ✅ Docker đọc để tạo user trong postgres container
POSTGRES_PASSWORD=your_password
POSTGRES_DB=affiliate_db
```

**Chạy:**
```bash
docker-compose up -d
```

---

## 🎯 Tại sao có 2 sets?

1. **`POSTGRES_*`** = Cấu hình **container** PostgreSQL
   - Docker dùng để **tạo** database
   - Giống như "settings khi install PostgreSQL"

2. **`DB_*`** = Backend **kết nối** tới PostgreSQL
   - Application code dùng để **connect**
   - Giống như "connection string"

---

## ✅ Checklist Setup

### Local Development:
- [ ] PostgreSQL đã cài và chạy
- [ ] Redis đã cài và chạy
- [ ] File `.env` có `DB_HOST=127.0.0.1`
- [ ] `DB_PASSWORD` khớp với PostgreSQL local
- [ ] `REDIS_PASSWORD` khớp với Redis local

### Docker:
- [ ] File `.env` có `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- [ ] `docker-compose.yml` sẽ tự động set `DB_HOST=postgres` cho backend

---

## 🔍 Kiểm tra kết nối

### Local PostgreSQL:
```bash
psql -h 127.0.0.1 -p 5432 -U postgres -d affiliate_db
# Nhập password từ DB_PASSWORD
```

### Docker PostgreSQL:
```bash
docker exec -it affiliate_postgres psql -U postgres -d affiliate_db
```

### Redis:
```bash
# Local
redis-cli -h 127.0.0.1 -p 6379 -a your_redis_password ping

# Docker
docker exec -it affiliate_redis redis-cli -a your_redis_password ping
```

---

## 🐛 Troubleshooting

### Lỗi: `ECONNREFUSED 127.0.0.1:5432`
**Nguyên nhân:** Backend không kết nối được PostgreSQL

**Giải pháp:**
1. Kiểm tra PostgreSQL có chạy không:
   ```bash
   sudo systemctl status postgresql
   # hoặc
   pg_isready -h 127.0.0.1 -p 5432
   ```

2. Kiểm tra password trong `.env` đúng chưa:
   ```bash
   # Test thủ công
   psql -h 127.0.0.1 -p 5432 -U postgres
   ```

3. Kiểm tra backend đọc đúng biến không:
   ```bash
   # Trong backend code, log ra
   console.log('DB_HOST:', process.env.DB_HOST);
   ```

### Lỗi: `password authentication failed`
**Nguyên nhân:** Password sai

**Giải pháp:**
1. Đảm bảo `DB_PASSWORD` trong `.env` khớp với PostgreSQL password
2. Không có khoảng trắng thừa trong `.env`:
   ```bash
   # ❌ SAI
   DB_PASSWORD= postgres

   # ✅ ĐÚNG
   DB_PASSWORD=postgres
   ```

---

## 📝 Summary

| Variable | Đọc bởi | Mục đích | Khi nào cần |
|----------|---------|----------|-------------|
| `DB_HOST` | Backend code | Connect tới PostgreSQL | Local dev + Docker (override) |
| `DB_USERNAME` | Backend code | Username kết nối | Luôn cần |
| `DB_PASSWORD` | Backend code | Password kết nối | Luôn cần |
| `DB_NAME` | Backend code | Database name | Luôn cần |
| `POSTGRES_USER` | docker-compose | Tạo user trong container | Chỉ khi dùng Docker |
| `POSTGRES_PASSWORD` | docker-compose | Password cho container | Chỉ khi dùng Docker |
| `POSTGRES_DB` | docker-compose | Tạo database trong container | Chỉ khi dùng Docker |
