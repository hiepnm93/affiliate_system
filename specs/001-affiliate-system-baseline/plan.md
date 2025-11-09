# Implementation Plan: Affiliate System — Baseline

**Branch**: `001-affiliate-system-baseline` | **Date**: 2025-11-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-affiliate-system-baseline/spec.md`

## Summary

Build a multi-level affiliate system with referral tracking, commission calculation, fraud prevention, and payout management. The implementation will modify existing NestJS backend (Clean Architecture) and React frontend (slash-admin) templates to implement all functional requirements.

**Key deliverables:**
- Multi-level referral tracking with cookie and URL parameter attribution
- Campaign-driven commission calculation (percentage, fixed, voucher)
- Affiliate dashboard with analytics and performance metrics
- Admin panel for campaign management and commission approval
- Anti-fraud detection and reporting
- Payout request and processing workflow

## Technical Context

**Backend:**
- **Language/Version**: TypeScript 5.2+ (strict mode enabled)
- **Framework**: NestJS 10.x with Clean Architecture pattern
- **Primary Dependencies**: TypeORM (PostgreSQL), Bull (Redis queue), Passport.js (JWT auth), class-validator
- **Storage**: PostgreSQL 15+ (primary), Redis 7+ (sessions, queue, tracking cookies)
- **Testing**: Jest (unit), Supertest (integration), test coverage >80%
- **Target Platform**: Linux server (Docker containers)
- **Project Type**: Web application (backend API)
- **Performance Goals**: <100ms referral redirect (p95), 1000+ concurrent tracking events, <500ms webhook processing
- **Constraints**: <200ms p95 API response, ACID transactions for commissions, zero duplicate commission records
- **Scale/Scope**: 10,000+ active affiliates, 100,000+ referral events/day

**Frontend:**
- **Language/Version**: TypeScript 5.2+ (strict mode enabled)
- **Framework**: React 18.x with Vite build system
- **UI Template**: slash-admin (Tailwind CSS, shadcn/ui components)
- **Primary Dependencies**: React Router v6, React Query (server state), Zustand (client state), Axios
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E for critical flows)
- **Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Project Type**: Web application (SPA frontend)
- **Performance Goals**: <2s landing page load, <3s dashboard render
- **Constraints**: Mobile-responsive design, accessible (WCAG 2.1 AA)
- **Scale/Scope**: 7 main pages (landing, dashboard, reports, campaigns, payouts, admin, settings)

**Integration:**
- REST JSON APIs (OpenAPI 3.0 contract)
- Payment provider webhooks (signature validation required)
- Redis pub/sub for real-time event notifications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Clean Architecture (NON-NEGOTIABLE)

**Status**: PASS

**Evidence**: Backend already follows NestJS Clean Architecture template with layers:
- `domains/` - Business entities (Affiliate, Commission, Transaction) with zero framework dependencies
- `application/` - UseCases (CalculateCommission, TrackReferral) orchestrating business logic
- `infrastructure/` - External integrations (PostgreSQL via TypeORM, Redis, payment webhooks)
- `interfaces/` - HTTP controllers providing thin REST API layer

**Implementation approach**: Extend existing layer structure by adding new domain entities, use cases, and infrastructure adapters specific to affiliate system requirements.

### ✅ II. Type Safety

**Status**: PASS

**Evidence**:
- Backend: `tsconfig.json` with `"strict": true` already configured
- Frontend: TypeScript with strict mode enabled in `tsconfig.json`
- All new code will maintain strict typing with no `any` except documented third-party library interfaces

**Implementation approach**: Define TypeScript interfaces for all entities, DTOs, API contracts, and component props.

### ✅ III. Service Isolation

**Status**: PASS

**Evidence**: Implementation will create three distinct service modules within NestJS:
- **Tracking Service**: Handles click events, cookie management, signup attribution
- **Commission Service**: Processes transactions, calculates multi-level commissions, manages campaigns
- **Payout Service**: Handles withdrawal requests, admin approval, balance management

**API Protocol**: REST JSON (default per constitution) with OpenAPI contract generation.

**Implementation approach**: Each service will have its own module with bounded context, clear interfaces, and no direct database cross-references.

### ✅ IV. Technology Stack

**Status**: PASS

**Evidence**: Using standardized stack from constitution:
- PostgreSQL 15+ for persistent data ✓
- Redis 7+ for caching, sessions, and tracking ✓
- NestJS with TypeScript for backend ✓
- React with TypeScript for frontend ✓
- slash-admin structure as base ✓

**Implementation approach**: No additional technologies required. All requirements can be implemented with approved stack.

### ✅ V. Code Quality Standards

**Status**: PASS

**Evidence**:
- Backend: ESLint + Prettier configuration already present (`.eslintrc.js`, `.prettierrc`)
- Frontend: Biome configuration present (`biome.json`) for linting/formatting
- Pre-commit hooks will be configured (Husky + lint-staged for backend, lefthook for frontend)

**Implementation approach**:
- Maintain existing linter configurations
- Add pre-commit hooks to enforce standards
- Use Conventional Commits format for all commits

### ✅ VI. Security & Privacy (NON-NEGOTIABLE)

**Status**: PASS

**Implementation approach**:
- Environment variables for all secrets (`.env_sample` already present in backend)
- JWT authentication via Passport.js (already in dependencies)
- Audit logging for all referral events, commissions, and payouts (structured JSON logs)
- PII encryption: Hash IP addresses for storage, encrypt payment method details

**No violations**: All sensitive operations will be authenticated and logged.

### ✅ VII. Testing Discipline

**Status**: PASS

**Implementation approach**:
- **Backend**: Jest unit tests for all use cases, Supertest integration tests for API endpoints
- **Frontend**: Jest + React Testing Library for components, Playwright E2E for flows:
  - Referral link click → signup attribution
  - Payment → commission calculation
  - Payout request → admin approval → processing
- All tests run in CI pipeline (will configure in Sprint 0)

**Target coverage**: >80% code coverage for backend use cases and domain logic.

### ✅ VIII. Structured Observability

**Status**: PASS

**Implementation approach**:
- All logs emitted as JSON with fields: `timestamp`, `level`, `service`, `message`, `context`, `correlationId`
- Anti-fraud monitoring: Alert when referral volume exceeds 3σ baseline in 5-minute window
- Error logs include stack trace and request correlation ID
- Observability stack: JSON logs to stdout → container logging → centralized log aggregation

**No violations**: Structured logging will be implemented from Sprint 1.

---

**GATE RESULT**: ✅ **ALL PRINCIPLES PASS** - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-affiliate-system-baseline/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── auth.openapi.yaml
│   ├── affiliate.openapi.yaml
│   ├── admin.openapi.yaml
│   └── webhooks.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── domains/                    # Domain layer (business entities)
│   │   ├── affiliate/
│   │   │   ├── affiliate.entity.ts
│   │   │   ├── referred-user.entity.ts
│   │   │   └── referral-event.entity.ts
│   │   ├── campaign/
│   │   │   └── campaign.entity.ts
│   │   ├── commission/
│   │   │   ├── commission.entity.ts
│   │   │   └── transaction.entity.ts
│   │   └── payout/
│   │       └── payout.entity.ts
│   ├── application/                # Use cases layer
│   │   ├── tracking/
│   │   │   ├── track-click.use-case.ts
│   │   │   ├── track-signup.use-case.ts
│   │   │   └── attribute-referral.use-case.ts
│   │   ├── commission/
│   │   │   ├── calculate-commission.use-case.ts
│   │   │   ├── approve-commission.use-case.ts
│   │   │   └── multi-level-walker.service.ts
│   │   ├── campaign/
│   │   │   ├── create-campaign.use-case.ts
│   │   │   └── get-active-campaign.use-case.ts
│   │   └── payout/
│   │       ├── request-payout.use-case.ts
│   │       └── process-payout.use-case.ts
│   ├── infrastructure/             # Infrastructure layer
│   │   ├── database/
│   │   │   ├── repositories/       # TypeORM repositories
│   │   │   └── migrations/         # Database migrations
│   │   ├── redis/
│   │   │   ├── tracking-cookie.service.ts
│   │   │   └── session.service.ts
│   │   ├── queue/
│   │   │   └── commission-processor.ts
│   │   └── webhooks/
│   │       └── payment-webhook.handler.ts
│   └── interfaces/                 # Controllers layer (HTTP)
│       ├── auth/
│       │   └── auth.controller.ts
│       ├── affiliate/
│       │   └── affiliate.controller.ts
│       ├── admin/
│       │   ├── campaign.controller.ts
│       │   ├── commission.controller.ts
│       │   └── reports.controller.ts
│       └── webhook/
│           └── payment.controller.ts
└── test/
    ├── unit/                       # Unit tests (use cases, services)
    └── integration/                # API integration tests

frontend/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # shadcn/ui primitives (from slash-admin)
│   │   ├── layout/                 # Layout components
│   │   └── affiliate/              # Domain-specific components
│   │       ├── ReferralCodeCard.tsx
│   │       ├── PerformanceChart.tsx
│   │       └── CommissionTable.tsx
│   ├── pages/                      # Page components
│   │   ├── landing/
│   │   │   └── LandingPage.tsx     # Referral link landing with dual flow
│   │   ├── dashboard/
│   │   │   └── AffiliateDashboard.tsx
│   │   ├── reports/
│   │   │   └── ReportsPage.tsx
│   │   ├── admin/
│   │   │   ├── CampaignManagement.tsx
│   │   │   ├── CommissionApproval.tsx
│   │   │   └── SystemReports.tsx
│   │   └── auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   ├── services/                   # API client services
│   │   ├── api-client.ts           # Axios instance with interceptors
│   │   ├── auth.service.ts
│   │   ├── affiliate.service.ts
│   │   └── admin.service.ts
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAffiliate.ts
│   │   └── useCommissions.ts
│   ├── store/                      # Zustand state management
│   │   ├── auth.store.ts
│   │   └── ui.store.ts
│   └── routes/                     # React Router configuration
│       └── index.tsx
└── tests/
    ├── unit/                       # Component unit tests
    └── e2e/                        # Playwright E2E tests
```

**Structure Decision**: Web application (Option 2) selected. Backend uses Clean Architecture with 4 layers (domains, application, infrastructure, interfaces). Frontend uses slash-admin structure with pages, components, services, hooks pattern. Both projects are in separate directories at repository root to allow independent deployment and scaling.

## Sprint Breakdown

### Sprint 0: Project Setup & Tooling (1 week)

**Goal**: Configure development environment, CI/CD, and prepare base templates for affiliate system implementation

**Tasks**:

1. **Repository configuration**
   - ✅ Backend and frontend base templates already cloned
   - Configure git hooks (Husky for backend, lefthook already configured for frontend)
   - Set up monorepo tooling (optional: Nx/Turborepo for shared types, or keep separate)
   - Create shared TypeScript types package for API contracts (optional)

2. **Backend preparation**
   - Review and validate existing Clean Architecture structure
   - Install additional dependencies:
     - `@nestjs/bull` + `bull` for queue processing
     - `@nestjs/passport` + `passport-jwt` for authentication
     - `ioredis` for Redis client
     - `class-validator` + `class-transformer` for DTO validation
   - Configure environment variables (`.env` from `.env_sample`)
   - Set up PostgreSQL + Redis via Docker Compose
   - Create database migrations structure

3. **Frontend preparation**
   - Review and validate slash-admin structure
   - Install additional dependencies:
     - `@tanstack/react-query` for server state management
     - `zustand` for client state management
     - `axios` for HTTP client
     - `react-router-dom` v6 (check if already included)
   - Configure API base URL in environment variables
   - Set up authentication context and protected routes

4. **CI/CD pipeline setup**
   - Create GitHub Actions workflow (or equivalent):
     - Backend: lint → typecheck → unit tests → integration tests → build
     - Frontend: lint → typecheck → unit tests → build
   - Configure Docker build for backend
   - Configure staging deployment (auto-deploy on merge to `develop`)
   - Document rollback procedure

5. **Development standards**
   - Configure ESLint + Prettier for backend (already present, validate rules)
   - Configure Biome for frontend (already present, validate rules)
   - Set up Conventional Commits validation (commitlint + husky)
   - Create PR template with checklist
   - Document branching strategy in CONTRIBUTING.md

**Deliverables**:
- Working development environment (PostgreSQL, Redis, backend, frontend)
- CI/CD pipeline running on all PRs
- Documentation: CONTRIBUTING.md, DEPLOYMENT.md

---

### Sprint 1: Core Tracking + Landing Page (2 weeks)

**Goal**: Implement referral link tracking, cookie management, and landing page with dual flow

**Backend Tasks**:

1. **Domain layer**: Create entities
   - `Affiliate` entity (id, userId, referralCode, parentAffiliateId, tier, status, createdAt)
   - `ReferredUser` entity (id, email, userId, referralCode, affiliateId, createdAt)
   - `ReferralEvent` entity (id, affiliateId, referredUserId, eventType, ip, userAgent, cookieId, metadata, timestamp)

2. **Application layer**: Implement use cases
   - `GenerateReferralCode` use case (unique code generation with collision check)
   - `TrackClick` use case (record click event, set tracking cookie)
   - `TrackSignup` use case (attribute signup to affiliate via cookie or URL param)
   - `AttributeReferral` service (last-click attribution logic)

3. **Infrastructure layer**:
   - TypeORM repositories for Affiliate, ReferredUser, ReferralEvent
   - Redis service for tracking cookies (TTL configurable per campaign)
   - Database migrations for affiliate, referred_users, referral_events tables

4. **Interfaces layer**:
   - `GET /affiliate/me/code` - Get authenticated user's referral code (generates if not exists)
   - `GET /r/:refCode` - Redirect endpoint (set tracking cookie, redirect to landing page)
   - `POST /affiliate/track/click` - Manual click tracking (if needed)
   - `POST /affiliate/track/signup` - Signup attribution endpoint

**Frontend Tasks**:

1. **Landing page**
   - Create `LandingPage.tsx` component
   - Parse referral code from URL query params (`?ref=ABC123`)
   - Display dual flow UI:
     - Option A: "Sign up as customer" → registration with voucher reward
     - Option B: "Join as affiliate" → registration as downstream affiliate
   - Track page view and interaction events
   - Mobile-responsive design

2. **Affiliate dashboard - initial version**
   - Create `AffiliateDashboard.tsx` component
   - Display referral code with copy-to-clipboard button
   - Display shareable link with social share buttons
   - Basic stats: total clicks (placeholder for Sprint 2 implementation)

3. **Authentication pages**
   - `Login.tsx` with JWT token handling
   - `Register.tsx` with referral code support (pre-filled if from landing page)

**Testing**:
- Unit tests: Use cases for code generation, click tracking, signup attribution
- Integration tests: API endpoints for referral flow
- E2E test: Click referral link → see landing page → register → verify attribution

**Deliverables**:
- Functional referral tracking system
- Landing page with dual flow
- Basic affiliate dashboard

---

### Sprint 2: Registration Flows & Multi-Level Linking (2 weeks)

**Goal**: Complete user registration flows, multi-level affiliate hierarchy, and analytics

**Backend Tasks**:

1. **Domain layer**: Extend Affiliate entity
   - Add methods: `getDownstreamAffiliates()`, `getUpstreamChain()`
   - Add validation: Prevent circular references in hierarchy

2. **Application layer**:
   - `RegisterAsCustomer` use case (creates ReferredUser, assigns voucher if campaign active)
   - `RegisterAsAffiliate` use case (creates Affiliate with parentAffiliateId, tier = parent.tier + 1)
   - `GetAffiliateHierarchy` use case (walk upstream to root, walk downstream to leaves)
   - `GetAffiliateStats` use case (aggregate clicks, signups, conversions from ReferralEvent)

3. **Infrastructure layer**:
   - Implement hierarchical queries (recursive CTEs or nested queries)
   - Add indexes for `parentAffiliateId` and `referralCode` lookups

4. **Interfaces layer**:
   - `POST /auth/register/customer` - Register as referred customer
   - `POST /auth/register/affiliate` - Register as downstream affiliate
   - `GET /affiliate/hierarchy` - Get affiliate's network tree
   - `GET /affiliate/stats` - Get click/signup/conversion metrics

**Frontend Tasks**:

1. **Registration flow completion**
   - Separate registration forms for customer vs affiliate
   - Customer form: Accept voucher code display
   - Affiliate form: Show parent affiliate info, explain tier structure
   - Form validation with user-friendly error messages

2. **Affiliate dashboard - enhanced**
   - Performance charts (line chart for clicks/signups over time)
   - Network tree visualization (direct referrals + downstream)
   - Date range filter for statistics
   - Export stats as CSV

3. **Shared components**
   - `ReferralCodeCard.tsx` - Display code with copy button
   - `PerformanceChart.tsx` - Recharts integration for time-series data
   - `NetworkTree.tsx` - Hierarchical tree visualization

**Testing**:
- Unit tests: Multi-level hierarchy logic, stats aggregation
- Integration tests: Registration flows, hierarchy API
- E2E test: Register as affiliate under parent → verify hierarchy → check stats

**Deliverables**:
- Complete registration flows (customer + affiliate)
- Multi-level hierarchy tracking
- Affiliate analytics dashboard

---

### Sprint 3: Payment Tracking & Commission Calculation (2 weeks)

**Goal**: Implement transaction recording, multi-level commission calculation, and campaign management

**Backend Tasks**:

1. **Domain layer**: Create entities
   - `Transaction` entity (id, referredUserId, amount, currency, status, externalId, createdAt)
   - `Commission` entity (id, affiliateId, transactionId, amount, level, status, campaignId, createdAt)
   - `Campaign` entity (id, name, startDate, endDate, rewardType, rewardValue, multiLevelConfig, cookieTTL, status)

2. **Application layer**:
   - `RecordTransaction` use case (webhook handler, deduplication via externalId)
   - `CalculateCommission` use case:
     - Get active campaign for transaction date
     - Walk up affiliate hierarchy (level 1, 2, 3...)
     - Apply campaign multi-level config: `{1: 10%, 2: 5%, 3: 2%}`
     - Create Commission entities with status=pending
     - Use Bull queue for async processing (handles webhook failures gracefully)
   - `GetActiveCampaign` use case (date range check, priority if multiple)
   - `CreateCampaign` use case (admin only)

3. **Infrastructure layer**:
   - TypeORM repositories for Transaction, Commission, Campaign
   - Bull queue consumer for commission calculation jobs
   - Webhook signature validation (HMAC or provider-specific)
   - Database migrations for transactions, commissions, campaigns tables

4. **Interfaces layer**:
   - `POST /webhook/payment` - Payment provider webhook (signature-validated)
   - `GET /affiliate/commissions` - List commissions for authenticated affiliate
   - `POST /admin/campaigns` - Create campaign
   - `GET /admin/campaigns` - List all campaigns
   - `PUT /admin/campaigns/:id` - Update campaign
   - `DELETE /admin/campaigns/:id` - Deactivate campaign

**Frontend Tasks**:

1. **Campaign management page (Admin)**
   - `CampaignManagement.tsx`
   - Create campaign form:
     - Name, start/end dates (date pickers)
     - Reward type selector (percentage, fixed, voucher)
     - Multi-level config editor (JSON or multi-input fields)
     - Cookie TTL slider (7-90 days)
   - Campaign list table with edit/delete actions
   - Campaign status toggle (active/inactive)

2. **Commission display (Affiliate dashboard)**
   - `CommissionTable.tsx` component
   - Show commissions grouped by status (pending, approved, paid, rejected)
   - Filter by date range and level
   - Display total earnings and available balance
   - Pagination for large datasets

**Testing**:
- Unit tests: Commission calculation logic for multi-level scenarios
- Integration tests: Webhook processing, campaign CRUD
- E2E test: Simulate payment webhook → verify commissions created for all levels

**Deliverables**:
- Payment tracking via webhooks
- Multi-level commission calculation engine
- Campaign management interface

---

### Sprint 4: Payouts & Admin Management (2 weeks)

**Goal**: Implement payout requests, commission approval workflow, and admin reporting

**Backend Tasks**:

1. **Domain layer**: Create entities
   - `Payout` entity (id, affiliateId, amount, paymentMethod, status, requestedAt, processedAt, adminNotes)
   - Extend `Commission` entity: Add `payoutId` foreign key

2. **Application layer**:
   - `RequestPayout` use case:
     - Check available balance >= minimum threshold
     - Create Payout entity with status=pending
     - Deduct from available balance (mark commissions as reserved)
   - `ProcessPayout` use case (admin):
     - Validate payout request
     - Update status to paid/failed
     - Link paid commissions to payout record
   - `ApproveCommission` use case (admin):
     - Update commission status to approved
     - Increment affiliate available balance
   - `RejectCommission` use case (admin):
     - Update commission status to rejected
     - Add rejection notes
   - `GetSystemReports` use case:
     - Aggregate total affiliates, referrals, commissions, conversion rates
     - Filter by date range and campaign

3. **Infrastructure layer**:
   - Repositories for Payout
   - Transaction isolation for payout processing (prevent double-spend)

4. **Interfaces layer**:
   - `POST /affiliate/payouts` - Request payout
   - `GET /affiliate/payouts` - List affiliate's payout history
   - `GET /admin/payouts` - List all payout requests
   - `PUT /admin/payouts/:id/process` - Process payout (mark as paid/failed)
   - `GET /admin/commissions/pending` - List pending commissions
   - `PUT /admin/commissions/:id/approve` - Approve commission
   - `PUT /admin/commissions/:id/reject` - Reject commission
   - `GET /admin/reports` - System-wide reports

**Frontend Tasks**:

1. **Payout request page (Affiliate)**
   - `PayoutRequest.tsx`
   - Display available balance
   - Payment method selection (bank transfer, e-wallet)
   - Minimum threshold validation
   - Payout history table

2. **Commission approval page (Admin)**
   - `CommissionApproval.tsx`
   - Pending commissions table with filters
   - Bulk approve/reject actions
   - Modal for rejection notes
   - Real-time updates (React Query polling or WebSocket)

3. **Admin reports page**
   - `SystemReports.tsx`
   - Dashboard with KPI cards:
     - Total affiliates, total referrals, total commissions paid
     - Conversion rate, average commission per affiliate
   - Date range filter
   - Export reports as CSV/PDF

**Testing**:
- Unit tests: Payout balance calculation, approval workflow
- Integration tests: Payout API, commission approval API
- E2E test: Request payout → admin approves → verify balance deduction

**Deliverables**:
- Payout request and processing workflow
- Commission approval interface
- Admin reporting dashboard

---

### Sprint 5: Anti-Fraud & Advanced Reporting (2 weeks)

**Goal**: Implement fraud detection rules, flagging system, and advanced analytics

**Backend Tasks**:

1. **Domain layer**:
   - `FraudFlag` entity (id, eventId, affiliateId, flagType, reason, status, reviewedBy, reviewedAt)
   - Fraud rule enums: `SELF_REFERRAL`, `IP_ANOMALY`, `CLICK_SPAM`, `VELOCITY_SPIKE`

2. **Application layer**:
   - `DetectFraud` use case (runs after each referral event):
     - Rule 1: Self-referral check (email/userId match)
     - Rule 2: Multiple signups from same IP in 24h window
     - Rule 3: Repeated clicks from same IP/UA in 1h window
     - Rule 4: Affiliate referral volume >3σ above baseline (5-minute window)
     - Create FraudFlag entity if rule violated
   - `ReviewFraudFlag` use case (admin):
     - Approve (mark as false positive)
     - Confirm (deactivate affiliate, void commissions)
   - `GetAdvancedReports` use case:
     - Cohort analysis (referral performance by acquisition month)
     - Affiliate leaderboard (top performers by commissions)
     - Campaign ROI (total commissions vs. customer lifetime value)

3. **Infrastructure layer**:
   - Real-time fraud detection: Bull queue processor for async rule evaluation
   - Anomaly detection: Redis sliding window counters for rate limiting
   - Audit log: Structured JSON logs for all fraud events

4. **Interfaces layer**:
   - `GET /admin/fraud-flags` - List flagged events
   - `PUT /admin/fraud-flags/:id/review` - Approve or confirm fraud
   - `GET /admin/reports/advanced` - Advanced analytics (cohorts, leaderboard, ROI)
   - `GET /admin/reports/export` - Export data as CSV/JSON

**Frontend Tasks**:

1. **Fraud review page (Admin)**
   - `FraudReview.tsx`
   - Flagged events table with filters (flagType, status)
   - Event detail modal (show IP, UA, timestamp, related affiliate)
   - Approve/Confirm actions with confirmation dialog

2. **Advanced reports page (Admin/Affiliate)**
   - `AdvancedReports.tsx`
   - Cohort analysis chart (Recharts line chart)
   - Leaderboard table (top 100 affiliates by earnings)
   - Campaign ROI comparison (bar chart)
   - Interactive filters (date range, campaign, metric)

3. **Real-time notifications**
   - Toast notifications for fraud alerts (admin only)
   - WebSocket or polling for real-time updates

**Testing**:
- Unit tests: Fraud detection rules, anomaly thresholds
- Integration tests: Fraud flagging API, review workflow
- E2E test: Simulate fraud scenario → verify flag created → admin reviews → verify outcome

**Deliverables**:
- Anti-fraud detection system
- Fraud review interface
- Advanced reporting and analytics

---

### Sprint 6: Hardening, Polish & Documentation (2 weeks)

**Goal**: Bug fixes, performance optimization, security hardening, and comprehensive documentation

**Backend Tasks**:

1. **Performance optimization**
   - Add database indexes for frequently queried fields:
     - `referral_events.affiliateId`, `referral_events.timestamp`
     - `commissions.affiliateId`, `commissions.status`
     - `transactions.referredUserId`, `transactions.createdAt`
   - Optimize multi-level hierarchy queries (use recursive CTEs)
   - Implement pagination for large result sets
   - Add Redis caching for:
     - Active campaigns (TTL 5 minutes)
     - Affiliate stats (TTL 1 minute)

2. **Security hardening**
   - Rate limiting: 100 req/min per IP for public endpoints
   - Helmet.js for HTTP security headers
   - CORS configuration (whitelist frontend origin)
   - Input validation: Strict DTO validation with class-validator
   - Secrets audit: Ensure no hardcoded secrets, all via environment variables

3. **Error handling**
   - Global exception filter for consistent error responses
   - Graceful webhook retry handling (exponential backoff)
   - Dead letter queue for failed commission calculations

4. **Logging & monitoring**
   - Structured JSON logging for all requests/responses
   - Correlation IDs for request tracing
   - Performance metrics: Response time histograms, error rates
   - Health check endpoint: `GET /health`

**Frontend Tasks**:

1. **UX polish**
   - Loading states for all async operations (skeletons, spinners)
   - Error states with user-friendly messages and retry actions
   - Empty states with helpful CTAs (e.g., "No commissions yet. Share your link!")
   - Accessibility audit: Keyboard navigation, ARIA labels, color contrast

2. **Mobile responsiveness**
   - Test all pages on mobile devices (320px - 768px)
   - Responsive tables (horizontal scroll or card layout)
   - Touch-friendly buttons and inputs

3. **Performance optimization**
   - Code splitting: Lazy load pages with React.lazy()
   - Image optimization: WebP format, lazy loading
   - Bundle size analysis: Remove unused dependencies
   - Lighthouse score: Aim for >90 performance, >95 accessibility

4. **User onboarding**
   - First-time user tour (highlight referral code, share buttons)
   - Tooltips for complex features (multi-level config, fraud flags)

**Documentation Tasks**:

1. **API documentation**
   - Generate OpenAPI spec from NestJS controllers (@nestjs/swagger)
   - Host Swagger UI at `/api-docs`
   - Document all endpoints with examples

2. **Developer documentation**
   - README.md: Quick start guide (setup, run, test)
   - ARCHITECTURE.md: Clean Architecture explanation, layer responsibilities
   - CONTRIBUTING.md: Code style, PR process, commit conventions
   - DEPLOYMENT.md: Docker deployment, environment variables, migrations

3. **User documentation**
   - AFFILIATE_GUIDE.md: How to get referral code, share links, request payouts
   - ADMIN_GUIDE.md: Campaign setup, commission approval, fraud review
   - FAQ.md: Common questions and troubleshooting

**Testing Tasks**:

1. **Test coverage**
   - Ensure >80% code coverage for backend use cases
   - Add missing unit tests for edge cases
   - Add integration tests for all API endpoints

2. **E2E test suite**
   - Complete user journeys:
     - Affiliate signup → get code → share link → customer registers → payment → commission
     - Admin creates campaign → approves commissions → processes payout
     - Fraud detection → admin reviews → deactivates affiliate

3. **Load testing**
   - Use Artillery or k6 for load testing
   - Simulate 1000 concurrent referral events
   - Verify <100ms p95 response time

**Bug Fixes & Refinements**:
- Fix issues identified in testing
- Address user feedback from beta testing (if applicable)
- Refactor code smells and technical debt

**Deliverables**:
- Production-ready application
- Comprehensive API and user documentation
- Passing E2E and load tests
- Security hardened codebase

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment webhook unreliability | Commission calculation failures | Implement retry logic with exponential backoff, dead letter queue for manual review |
| Cookie blocking (privacy browsers) | Lost referral attribution | Dual attribution: Cookie + URL parameter fallback, prioritize URL param if both present |
| Multi-level calculation complexity | Performance degradation, bugs | Thorough unit testing, limit max depth to 5 levels, use Bull queue for async processing |
| Fraud exploitation (self-referrals, bots) | Revenue loss, system abuse | Implement rule-based detection from Sprint 1, manual admin review required for large payouts |
| Database performance at scale | Slow queries, timeouts | Add indexes early (Sprint 1), use Redis caching, implement pagination, periodic query optimization |
| Third-party API changes | Integration failures | Version lock payment provider SDK, monitor webhook schema changes, implement adapter pattern |

## Success Metrics

**Technical Metrics:**
- API response time: <200ms p95 for all endpoints
- Referral redirect latency: <100ms p95
- Zero duplicate commission records
- >80% code coverage for backend use cases
- Zero critical security vulnerabilities (automated scanning)

**Business Metrics:**
- System supports 10,000+ active affiliates
- 100% accurate commission calculations (matches campaign rules)
- Admin can approve 100 commissions in <5 minutes
- Fraud detection flags >90% of suspicious activities
- Payout processing reduces manual effort by >70%

**User Experience Metrics:**
- Landing page loads in <2s
- Dashboard renders in <3s
- Affiliates obtain referral code in <30s
- 95% of affiliates successfully share link on first attempt
- Mobile-responsive design passes WCAG 2.1 AA

## Phase 0: Research & Technical Decisions

**Research areas** (detailed findings in [research.md](./research.md)):

1. **Multi-level commission algorithm**: Recursive hierarchy walk with configurable depth (default 3, max 5)
2. **Referral attribution model**: Last-click attribution with dual tracking (cookie + URL parameter)
3. **Payment webhook integration**: Signature validation, deduplication, async queue processing
4. **Anti-fraud detection**: Rule-based approach with manual admin review
5. **Database schema design**: PostgreSQL with recursive CTEs for hierarchy queries
6. **Caching strategy**: Redis for tracking cookies, session management, active campaigns
7. **Queue processing**: Bull (Redis-backed) for commission calculations and fraud detection
8. **API authentication**: JWT tokens via Passport.js with role-based access control
9. **Frontend state management**: React Query (server state) + Zustand (client state)
10. **Testing strategy**: Jest (unit), Supertest (integration), Playwright (E2E)

## Phase 1: Design Artifacts

**Generated artifacts** (details in respective files):

1. **[data-model.md](./data-model.md)**: Entity definitions, relationships, validation rules
2. **[contracts/](./contracts/)**: OpenAPI 3.0 specs for all API endpoints
3. **[quickstart.md](./quickstart.md)**: Developer setup guide, local development workflow

## Next Steps

1. **Immediate**: Run `/speckit.tasks` to generate executable task list from this plan
2. **Sprint 0 kickoff**: Set up development environment and CI/CD
3. **Sprint planning**: Break down Sprint 1 tasks into daily sub-tasks
4. **Daily standups**: Track progress, identify blockers
5. **Sprint reviews**: Demo completed features, gather feedback

---

**Plan Status**: ✅ **READY FOR EXECUTION**

**Last Updated**: 2025-11-09 | **Version**: 2.0.0 (updated to reflect existing base templates)
