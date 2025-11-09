<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0 (MINOR update)
Modified principles:
  - Principle I (Clean Architecture): Expanded with NestJS Clean Architecture template reference
  - Principle III (Service Isolation): Clarified API protocol preference (REST JSON default)
Added sections:
  - Vision & Goals (new top-level section)
  - Technology Stack (new section under Core Principles area)
Removed sections: None
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section references this file
  ✅ .specify/templates/spec-template.md - Aligns with functional requirements structure
  ✅ .specify/templates/tasks-template.md - Reflects testing and service isolation principles
Follow-up TODOs: None
-->

# Affiliate System Constitution

## Vision & Goals

Build a multi-level affiliate system based on referral codes/links with comprehensive
features: multi-tier tracking, reporting, fraud prevention, and commission withdrawals.

**Technology Direction:**

- **Backend**: NestJS following Clean Architecture template pattern
- **Frontend**: React using slash-admin structure as foundation
- **Purpose**: Enable scalable referral marketing with transparent commission tracking
  and payout management

## Core Principles

### I. Clean Architecture (NON-NEGOTIABLE)

Backend MUST follow Clean Architecture pattern: Domain → UseCases → Infrastructure →
Controllers, aligned with NestJS Clean Architecture template.

**Rules:**

- Domain layer contains business entities and rules, zero external dependencies
- UseCases orchestrate domain logic, no framework coupling
- Infrastructure implements external interfaces (DB, cache, APIs)
- Controllers handle HTTP/GraphQL transport only, thin layer
- Follow NestJS Clean Architecture template conventions for module organization

**Rationale:** Ensures testability, maintainability, and framework independence. Prevents
business logic leakage into infrastructure concerns. Template alignment ensures team
consistency.

### II. Type Safety

All source code MUST be written in TypeScript for both frontend and backend.

**Rules:**

- TypeScript strict mode enabled (`strict: true` in tsconfig.json)
- No `any` types except when interfacing with untyped third-party libraries (must be
  documented with comment explaining why)
- Type definitions for all public APIs and interfaces

**Rationale:** Catches errors at compile time, improves refactoring safety, provides
self-documenting code through type signatures.

### III. Service Isolation

System MUST separate concerns into distinct services: tracking, commission calculation,
and payouts.

**Rules:**

- Each service has clear bounded context and responsibility
- Services communicate via well-defined contracts
- API protocol: REST JSON as default; GraphQL only when flow-specific benefits justify
  complexity
- No direct database access across service boundaries
- Each service can be deployed and scaled independently

**Rationale:** Enables independent scaling, deployment, and team ownership. Prevents
tight coupling and allows service-specific technology choices when justified. REST-first
reduces initial complexity.

### IV. Technology Stack

Core technologies are standardized to ensure consistency and leverage proven patterns.

**Rules:**

- **Primary Database**: PostgreSQL for persistent data
- **Caching/Session/Tracking**: Redis when performance or ephemeral state requires it
- **Backend Framework**: NestJS with TypeScript
- **Frontend Framework**: React with TypeScript, using slash-admin structure as base
- Technology additions MUST be justified in Architecture Decision Records (ADRs)

**Rationale:** PostgreSQL provides ACID guarantees essential for financial transactions.
Redis enables high-performance session and real-time tracking. NestJS and React offer
mature ecosystems with TypeScript support. Slash-admin provides battle-tested admin UI
patterns.

### V. Code Quality Standards

ESLint and Prettier configurations MUST be applied uniformly across the codebase.

**Rules:**

- Shared ESLint + Prettier config at repository root
- Local overrides forbidden unless documented with justification in PR description
- Pre-commit hooks enforce linting (CI rejects non-compliant code)
- Conventional Commits format required: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`

**Rationale:** Consistent code style reduces cognitive load, simplifies code review,
prevents style bikeshedding. Convention-based commits enable automated changelog
generation.

### VI. Security & Privacy (NON-NEGOTIABLE)

Secrets MUST NOT be committed. All sensitive operations MUST be authenticated and logged.

**Rules:**

- Use environment variables + secret manager (never hardcoded secrets)
- JWT or OAuth required for internal API authentication
- Audit logging mandatory for: referral events, commission calculations, payout requests
- Personally Identifiable Information (PII) encrypted at rest when stored

**Rationale:** Prevents credential leaks, ensures accountability through audit trails,
meets compliance requirements for financial transactions.

### VII. Testing Discipline

Backend MUST have unit + integration tests. Frontend MUST have unit tests; E2E tests
required for critical user journeys.

**Rules:**

- Backend: Jest for unit tests, integration tests cover service contracts
- Frontend: Jest + React Testing Library for unit tests
- E2E tests (Playwright or Cypress) for flows: referral signup, commission tracking,
  payout requests
- Tests run in CI; failing tests block merge

**Rationale:** Multi-level referral logic and commission calculations are complex and
error-prone. Automated tests prevent regressions and enable confident refactoring.

### VIII. Structured Observability

Logging MUST use structured JSON format. Alerts MUST trigger on transaction anomalies.

**Rules:**

- All logs emitted as JSON with minimum fields: timestamp, level, service, message,
  context
- Anti-fraud monitoring: alert when referral volume exceeds baseline by >3σ in 5-minute
  window
- Error logs include stack trace and request correlation ID
- Observability stack (e.g., ELK, Grafana/Loki) ingests structured logs for querying

**Rationale:** Structured logs enable automated parsing and querying. Anomaly detection
protects against referral fraud and system abuse.

## Development Workflow

### Branching Strategy

- Feature branches: `feature/<ticket-id>-short-description`
- Bug fixes: `fix/<ticket-id>-short-description`
- Maintenance: `chore/<short-description>`
- Base branch: `develop` for integration, `main` for production releases

### Pull Request Requirements

All PRs MUST include:

1. **Description**: What changed and why
2. **Checklist**:
   - [ ] Linting passes (`npm run lint`)
   - [ ] Type checking passes (`npm run typecheck`)
   - [ ] Tests added/updated and passing
   - [ ] Changelog note added (if user-facing change)
3. **Review**: At least one approving review required before merge

### Daily Practices

- Daily standup: blockers, progress, plan
- Sprint review: demo completed work, gather feedback

## CI/CD & Deployment

### Continuous Integration

CI pipeline MUST run on every PR and commit to `develop` or `main`:

1. Lint check (`npm run lint`)
2. Type check (`npm run typecheck`)
3. Unit tests (`npm run test:unit`)
4. Integration tests (`npm run test:integration`)
5. Build verification (`npm run build`)

### Continuous Deployment

- **Staging**: Auto-deploy on merge to `develop` branch
- **Production**: Deploy on tag `v*` or merge to `main` (per team policy decision)
- Rollback procedure documented in operations runbook

## Governance

### Amendment Procedure

1. Propose amendment via PR to this constitution file
2. Include rationale and impact analysis
3. Increment `CONSTITUTION_VERSION` following semantic versioning:
   - **MAJOR**: Backward-incompatible principle removal or redefinition
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Update `LAST_AMENDED_DATE` to amendment merge date
5. Team approval required (define quorum based on team size)

### Version History

All amendments tracked via git history of this file. Each amendment MUST update Sync
Impact Report comment at top of file.

### Compliance Review

- All PRs MUST verify compliance with applicable principles
- Architecture Decision Records (ADRs) required when deviating from principles (with
  justification referencing Complexity Tracking in plan template)
- Quarterly review of constitution relevance and adherence

**Version**: 1.1.0 | **Ratified**: 2025-11-09 | **Last Amended**: 2025-11-09
