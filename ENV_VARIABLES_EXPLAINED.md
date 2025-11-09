# Environment Variables Explained

## 🔑 Database Configuration - Simplified Structure

### **Single Source of Truth: `POSTGRES_*`**
Định nghĩa **1 LẦN DUY NHẤT** ở đầu file `.env`

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=affiliate_db
```

**Được dùng bởi:**
1. ✅ **docker-compose.yml** - Tạo PostgreSQL container
2. ✅ **DB_* variables** - Reference tới để tránh duplicate

---

### **Connection Variables: `DB_*`**
Reference tới `POSTGRES_*` để tránh lặp lại

```bash
DB_HOST=127.0.0.1              # Chỉ biến này là độc lập
DB_PORT=5432                   # Chỉ biến này là độc lập
DB_USERNAME=${POSTGRES_USER}   # ← Reference
DB_PASSWORD=${POSTGRES_PASSWORD}  # ← Reference
DB_NAME=${POSTGRES_DB}         # ← Reference
```

**Được đọc bởi:**
- ✅ **Backend code** (ormconfig.ts) khi chạy local

**Tại sao làm vậy?**
- ✅ **Không duplicate** username/password/database name
- ✅ **Chỉ cần thay đổi 1 chỗ** (POSTGRES_*) là sync tất cả
- ✅ Vẫn linh hoạt thay đổi `DB_HOST` cho local/docker

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

| Variable | Giá trị | Đọc bởi | Mục đích |
|----------|---------|---------|----------|
| **POSTGRES_USER** | `postgres` | docker-compose, DB_USERNAME | ⭐ Source of truth cho username |
| **POSTGRES_PASSWORD** | `your_password` | docker-compose, DB_PASSWORD | ⭐ Source of truth cho password |
| **POSTGRES_DB** | `affiliate_db` | docker-compose, DB_NAME | ⭐ Source of truth cho database name |
| `DB_HOST` | `127.0.0.1` / `postgres` | Backend code | Địa chỉ PostgreSQL (local/docker) |
| `DB_PORT` | `5432` | Backend code | Port PostgreSQL |
| `DB_USERNAME` | `${POSTGRES_USER}` | Backend code | Reference tới POSTGRES_USER |
| `DB_PASSWORD` | `${POSTGRES_PASSWORD}` | Backend code | Reference tới POSTGRES_PASSWORD |
| `DB_NAME` | `${POSTGRES_DB}` | Backend code | Reference tới POSTGRES_DB |

**⭐ Quan trọng:** Chỉ cần sửa `POSTGRES_*` là tất cả `DB_*` sẽ tự động sync!
