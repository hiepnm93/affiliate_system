# Affiliate System Backend - Implementation Notes

## Overview

Backend implementation for affiliate system following Clean Architecture pattern with:
- Multi-level referral tracking
- Cookie and URL parameter-based attribution
- PostgreSQL for persistent data
- Redis for tracking cookies
- JWT authentication

## What Has Been Implemented

### 1. Domain Layer (Business Logic)
- **Entities**:
  - `UserEntity` - User accounts with roles (admin, affiliate, user)
  - `AffiliateEntity` - Affiliate accounts with referral codes
  - `ReferredUserEntity` - Users who signed up via referral
  - `ReferralEventEntity` - Tracking events (clicks, signups, payments)

- **Repository Interfaces**:
  - `IUserRepository`
  - `IAffiliateRepository`
  - `IReferredUserRepository`
  - `IReferralEventRepository`

### 2. Infrastructure Layer
- **TypeORM Entities**: ORM mappings with proper relations and indexes
- **Mappers**: Convert between domain and ORM entities
- **Repository Implementations**: PostgreSQL repository implementations
- **Redis Service**: Tracking cookie management with TTL
- **Database Migrations**: Schema creation for all tables

### 3. Application Layer (Use Cases)
- **Authentication**:
  - `RegisterUserUseCase` - User registration with password hashing
  - `LoginUseCase` - Login with JWT token generation

- **Affiliate**:
  - `GenerateReferralCodeUseCase` - Create unique referral codes

- **Tracking**:
  - `TrackClickUseCase` - Track referral link clicks
  - `TrackSignupUseCase` - Attribute signups to affiliates

### 4. Interface Layer (Controllers)
- `AuthController` - Registration and login endpoints
- `AffiliateController` - Become affiliate, get referral code, track clicks

## Project Structure

```
backend/src/
├── domains/                    # Domain layer (business logic)
│   ├── user/
│   │   ├── entities/           # User domain entities
│   │   └── repositories/       # Repository interfaces
│   └── affiliate/
│       ├── entities/           # Affiliate domain entities
│       └── repositories/       # Repository interfaces
│
├── application/                # Use cases layer
│   ├── auth/                   # Authentication use cases
│   ├── affiliate/              # Affiliate use cases
│   └── tracking/               # Tracking use cases
│
├── infrastructure/             # Infrastructure layer
│   ├── postgres/
│   │   ├── entities/           # TypeORM entities
│   │   ├── mappers/            # Domain/ORM mappers
│   │   └── repositories/       # Repository implementations
│   └── redis/
│       └── tracking.service.ts # Redis tracking service
│
├── interfaces/                 # Controllers layer
│   └── web/
│       ├── auth/               # Auth controllers
│       └── affiliate/          # Affiliate controllers
│
└── migrations/                 # Database migrations
```

## Next Steps to Complete

### 1. Module Configuration (Required)

Create module files to wire up dependencies:

**src/domains/user/user.module.ts**:
```typescript
import { Module } from '@nestjs/common';
// Import and export UserEntity, repositories, etc.
```

**src/infrastructure/infrastructure.module.ts**:
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// Import all ORM entities and provide repository implementations
```

**src/application/application.module.ts**:
```typescript
import { Module } from '@nestjs/common';
// Import and provide all use cases
```

### 2. Update app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    // Add your modules here
  ],
})
export class AppModule {}
```

### 3. Environment Setup

1. Copy `.env_sample` to `.env`:
   ```bash
   cp .env_sample .env
   ```

2. Update values in `.env` as needed

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Start Development

```bash
# Start with Docker Compose
docker-compose up

# Or manually
npm install
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "referralCode": "ABC12345" // optional
  }
  ```

- `POST /auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Affiliate
- `POST /affiliate/become-affiliate` - Become an affiliate
  ```json
  {
    "parentReferralCode": "ABC12345" // optional
  }
  ```

- `GET /affiliate/me/code` - Get your referral code

- `GET /affiliate/r/:code` - Track referral click (redirects to landing page)

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Architecture Principles

1. **Clean Architecture**: Domain layer has no framework dependencies
2. **Dependency Inversion**: Use interfaces and dependency injection
3. **Separation of Concerns**: Each layer has clear responsibilities
4. **Type Safety**: Strict TypeScript with no `any` types

## What's Missing (Sprint 2+)

- Campaign management
- Commission calculation
- Payout management
- Admin reporting
- Fraud detection
- Complete authentication guards
- Comprehensive test coverage

## Notes

- JWT authentication guards need to be implemented and applied to protected routes
- IP address and user agent extraction should use proper NestJS decorators
- Error handling can be improved with global exception filters
- Validation pipes should be added using class-validator DTOs
