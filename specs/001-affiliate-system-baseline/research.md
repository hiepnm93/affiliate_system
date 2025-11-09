# Research: Affiliate System — Baseline

**Feature**: 001-affiliate-system-baseline
**Date**: 2025-11-09
**Status**: Complete

## Purpose

This document consolidates research findings for key technical decisions in the Affiliate System baseline implementation.

## Key Technical Decisions

### 1. Architecture Pattern: NestJS Clean Architecture

**Decision**: Adopt NestJS Clean Architecture template with 4-layer separation

**Rationale**:
- **Domain layer**: Business entities (Affiliate, Commission, Transaction) with zero framework dependencies
- **UseCases layer**: Orchestrates business logic (CalculateCommission, TrackReferral) without framework coupling
- **Infrastructure layer**: Handles external integrations (PostgreSQL, Redis, payment webhooks)
- **Controllers layer**: Thin HTTP/REST API layer

**Alternatives considered**:
- **MVC pattern**: Rejected due to business logic leakage risk into controllers
- **Layered architecture**: Rejected as less explicit about dependency direction
- **Microservices**: Deferred for v1; current structure supports future split into microservices

**References**:
- NestJS Clean Architecture template: https://github.com/pvarentsov/typescript-clean-architecture
- Clean Architecture principles: Robert C. Martin's "Clean Architecture" book

---

### 2. Database: PostgreSQL 15+ with TypeORM

**Decision**: PostgreSQL as primary database, TypeORM for ORM

**Rationale**:
- **ACID guarantees**: Essential for financial transactions (commissions, payouts)
- **JSON support**: Flexible storage for campaign multi-level config (`{1: 10%, 2: 5%, 3: 2%}`)
- **Performance**: Handles 10k affiliates, 100k+ events/day with proper indexing
- **Mature ecosystem**: TypeORM provides migrations, repositories, query builder

**Alternatives considered**:
- **MySQL**: Rejected due to weaker JSON support and less robust ACID implementation
- **MongoDB**: Rejected due to lack of ACID transactions across documents (critical for commission calculations)
- **Prisma ORM**: Rejected in favor of TypeORM for better NestJS integration and migration tooling

**Database schema highlights**:
- Indexes on: `refCode`, `affiliateId`, `transactionId`, `status`, `createdAt`
- Foreign keys: `ReferredUser.affiliateId`, `Affiliate.parentAffiliateId`, `Commission.transactionId`
- Deduplication: Unique constraint on `Transaction.transactionId` prevents double commission

---

### 3. Caching & Queue: Redis 7+

**Decision**: Redis for session/tracking cache and Bull queue for async jobs

**Rationale**:
- **Session cache**: Store tracking cookies with TTL (default 30 days, configurable per campaign)
- **Affiliate code cache**: Fast lookup for `/r/:refCode` endpoint (target < 100ms p95)
- **Queue**: Bull (Redis-backed) for commission calculation jobs triggered by payment webhooks
- **Retry logic**: 3 retries with exponential backoff, dead letter queue for failures

**Alternatives considered**:
- **Memcached**: Rejected due to lack of persistence and less feature-rich
- **RabbitMQ for queue**: Rejected in favor of Redis-based Bull for simpler infrastructure (single Redis instance)

**Configuration**:
- Cookie TTL: 30 days default (per `COOKIE_TTL_DAYS` env var or campaign-specific override)
- Queue retry: 3 attempts, backoff: 2^attempt seconds

---

### 4. Authentication: JWT with Passport.js

**Decision**: JWT token-based authentication using Passport.js strategies

**Rationale**:
- **Stateless**: No server-side session storage required (JWT payload contains user ID, role)
- **Role-based access**: Admin, Affiliate, ReferredUser roles enforced via guards
- **Standard**: Passport.js is NestJS-recommended, battle-tested library

**Implementation**:
- `POST /api/auth/register`: Returns JWT on successful registration
- `POST /api/auth/login`: Validates credentials, returns JWT
- JWT payload: `{userId, email, role, exp}`
- Token expiration: 7 days (configurable via `JWT_EXPIRY` env var)
- Refresh token: Deferred to future sprint (not MVP requirement)

**Alternatives considered**:
- **Session-based auth**: Rejected due to Redis dependency for sessions (prefer stateless for horizontal scaling)
- **OAuth2**: Deferred for future (not required for internal affiliate management)

---

### 5. Frontend: React 18 + Slash-Admin Template

**Decision**: Use slash-admin as foundation for admin UI structure

**Rationale**:
- **Proven patterns**: Slash-admin provides battle-tested layouts for dashboards, tables, forms
- **React Query integration**: Built-in support for data fetching, caching, optimistic updates
- **Component library**: Pre-built UI components reduce development time

**Frontend architecture**:
- **Pages**: `/landing`, `/auth`, `/affiliate`, `/admin` (maps to user roles)
- **Services**: API client layer with React Query hooks (`useAffiliateStats`, `useCommissions`)
- **State management**: React Context for auth state, React Query for server state

**Alternatives considered**:
- **Next.js**: Rejected for v1 (server-side rendering not required; REST API backend already exists)
- **Vue + Nuxt**: Rejected due to team expertise with React

---

### 6. Multi-Level Commission Calculation

**Decision**: Configurable multi-level depth (default 3, max 5) with campaign-specific rules

**Rationale**:
- **Flexibility**: Different campaigns can have different multi-level structures
- **Performance**: Max depth limit (5) prevents infinite loops and database query explosion
- **Fair attribution**: Last-click attribution model (most recent referral wins)

**Algorithm**:
1. Payment webhook arrives → enqueue commission job
2. Job: Look up `ReferredUser` by `userId`
3. Walk up affiliate hierarchy: `affiliate → parent → grandparent → ...`
4. For each level (1, 2, 3...):
   - Get campaign multi-level config: `{1: 10%, 2: 5%, 3: 2%}`
   - Calculate commission: `transaction.amount * levelPercent`
   - Create `Commission` entity with `status=pending`, `level=N`
5. Stop at max depth or when parent = null

**Edge cases handled**:
- **Orphaned affiliates**: If parent deleted, stop walking hierarchy (no error)
- **Campaign changes**: Use campaign active at transaction time (not current campaign)
- **Deduplication**: Transaction ID unique constraint prevents double-processing

---

### 7. Anti-Fraud Detection

**Decision**: Rule-based fraud detection with admin review workflow

**Rationale**:
- **Self-referral**: Detect when referral email/userId matches affiliate
- **IP anomaly**: Flag multiple signups from same IP within 1-hour window (threshold: 5)
- **Click spam**: Flag repeated clicks from same IP/user-agent within 1-minute window (threshold: 10)
- **Admin review**: Flagged events require manual review before commission approval

**Implementation**:
- Use cases: `DetectSelfReferralUseCase`, `DetectIPAnomalyUseCase`, `DetectClickSpamUseCase`
- Storage: `ReferralEvent.metadata` JSON field stores fraud flags: `{fraudReason: "self-referral"}`
- Admin UI: Table of flagged events with actions: "Clear flag", "Block affiliate", "Reject commission"

**Alternatives considered**:
- **ML-based fraud detection**: Deferred to future (requires historical data, model training)
- **Third-party fraud service**: Rejected for v1 (adds cost, external dependency)

---

### 8. Testing Strategy

**Decision**: Multi-level testing: Unit (Jest), Integration (Supertest), E2E (Playwright)

**Targets**:
- Backend: 80%+ code coverage (focus on use cases, commission calculation logic)
- Frontend: 70%+ code coverage (components, hooks)
- E2E: Critical user journeys (referral flow, commission approval, payout)

**CI pipeline**:
1. Lint (`npm run lint`)
2. Type check (`npm run typecheck`)
3. Unit tests (`npm run test:unit`)
4. Integration tests (`npm run test:integration`)
5. Build (`npm run build`)

Failing tests block PR merge.

---

### 9. Deployment & Infrastructure

**Decision**: Docker Compose for local dev, Docker + Kubernetes for production

**Local development**:
- `docker-compose.yml`: Backend (NestJS), PostgreSQL, Redis
- Hot reload: Volume mounts for backend `src/` directory
- Environment variables: `.env.local` (gitignored)

**Production**:
- Dockerfile: Multi-stage build (build → production)
- Kubernetes manifests: Deployments for backend, StatefulSets for PostgreSQL/Redis
- Secrets: AWS Secrets Manager or HashiCorp Vault
- Monitoring: Structured JSON logs → ELK stack, APM (New Relic or DataDog)

**Alternatives considered**:
- **Serverless (Lambda)**: Rejected due to Redis dependency and queue processing needs
- **PaaS (Heroku)**: Rejected for cost at scale (10k affiliates); Kubernetes provides better control

---

### 10. Open Questions Resolved

Based on spec assumptions and business context:

| Question | Decision | Rationale |
|----------|----------|-----------|
| Multi-level depth | Default 3, max 5 (configurable) | Balances complexity vs. incentive structure |
| Commission approval | Manual by default | Ensures admin oversight before payouts; auto-approve deferred |
| Cookie TTL default | 30 days | Industry standard for affiliate tracking; long enough for conversion cycle |
| Payout threshold | $50 USD (configurable) | Minimizes payout transaction costs while ensuring affiliate satisfaction |

---

## Next Steps

All technical unknowns resolved. Proceed to Phase 1:
1. Generate `data-model.md` (entity schemas)
2. Generate `contracts/` (OpenAPI specs for REST APIs)
3. Generate `quickstart.md` (development setup guide)
4. Update agent context with technology choices
