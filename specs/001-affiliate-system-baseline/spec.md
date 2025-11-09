# Feature Specification: Affiliate System — Baseline

**Feature Branch**: `001-affiliate-system-baseline`
**Created**: 2025-11-09
**Status**: Draft
**Input**: User description: "Affiliate System — Baseline Specification with multi-level tracking, commission calculation, fraud prevention, and payout management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Affiliate Obtains and Shares Referral Link (Priority: P1)

An affiliate user wants to get their unique referral code/link and share it with potential customers to start earning commissions.

**Why this priority**: This is the core entry point for the entire affiliate system. Without affiliates being able to obtain and share links, no referrals can occur.

**Independent Test**: Can be fully tested by creating an affiliate account, requesting a referral code, and verifying the code is unique and trackable. Delivers immediate value as affiliates can start sharing links.

**Acceptance Scenarios**:

1. **Given** an authenticated affiliate user, **When** they request their referral code via the affiliate dashboard, **Then** the system returns a unique referral code and shareable link
2. **Given** an affiliate has a referral link, **When** they share it with others, **Then** the link redirects to the landing page with tracking parameters preserved
3. **Given** a new affiliate joins the system, **When** they request their code for the first time, **Then** a unique code is generated and associated with their account

---

### User Story 2 - Track Referral Clicks and Signups (Priority: P1)

The system must track when someone clicks an affiliate link and when they sign up using that referral, ensuring proper attribution.

**Why this priority**: Tracking is essential for commission calculation and affiliate analytics. Without accurate tracking, the entire referral attribution system fails.

**Independent Test**: Can be tested by clicking a referral link, verifying event logging, checking cookie placement, and completing signup with the referral code. Delivers value through accurate attribution data.

**Acceptance Scenarios**:

1. **Given** a user clicks an affiliate referral link, **When** the landing page loads, **Then** the system records a click event with IP, user agent, timestamp, and sets a tracking cookie
2. **Given** a user has clicked a referral link and has an active tracking cookie, **When** they register an account, **Then** the system creates a signup event and links the new user to the referring affiliate
3. **Given** a user registers with a referral code in the URL, **When** they complete registration, **Then** the system attributes the signup to the correct affiliate even without a cookie
4. **Given** a user clicks multiple referral links from different affiliates, **When** they register, **Then** the system attributes the signup to the most recent valid referral (last-click attribution)

---

### User Story 3 - Multi-Level Commission Calculation on Payment (Priority: P2)

When a referred user makes a payment or top-up, the system calculates commissions for the direct referrer and potentially multiple levels up the affiliate hierarchy.

**Why this priority**: This is the monetization core of the affiliate system. It must work correctly to ensure affiliates are compensated fairly and according to campaign rules.

**Independent Test**: Can be tested by simulating a payment from a referred user and verifying commissions are calculated for all eligible affiliate levels according to campaign rules. Delivers value through automated commission tracking.

**Acceptance Scenarios**:

1. **Given** a referred user makes a payment, **When** the payment is confirmed, **Then** the system creates a transaction record and calculates commission for the direct referrer
2. **Given** a multi-level commission campaign is active, **When** a referred user makes a payment, **Then** the system calculates commissions for all configured levels (e.g., Level 1: 10%, Level 2: 5%, Level 3: 2%)
3. **Given** a campaign with fixed commission rules, **When** a referred user makes a payment, **Then** the system creates commission records with the fixed amount per level
4. **Given** multiple campaigns are active, **When** a payment occurs, **Then** the system applies the correct campaign rules based on campaign dates and eligibility
5. **Given** commission records are created, **When** calculation completes, **Then** all commissions start in "pending" status awaiting admin approval

---

### User Story 4 - Affiliate Dashboard and Performance Analytics (Priority: P2)

Affiliates need to view their performance metrics including clicks, signups, conversions, earnings, and available balance for withdrawal.

**Why this priority**: Transparency builds trust and motivates affiliates. Without visibility into their performance, affiliates cannot optimize their efforts or trust the system.

**Independent Test**: Can be tested by an affiliate logging in and viewing their dashboard with real-time statistics. Delivers value through actionable insights.

**Acceptance Scenarios**:

1. **Given** an authenticated affiliate, **When** they access their dashboard, **Then** they see total clicks, signups, successful conversions, total commissions earned, and available balance
2. **Given** an affiliate has pending commissions, **When** they view their dashboard, **Then** commissions are categorized by status (pending, approved, paid, rejected)
3. **Given** an affiliate wants to track performance over time, **When** they select a date range, **Then** the dashboard filters statistics to show performance for that period
4. **Given** an affiliate has multiple referral levels, **When** they view their network, **Then** they can see their direct referrals and downstream affiliates

---

### User Story 5 - Admin Campaign Management and Commission Approval (Priority: P3)

Administrators need to create and manage affiliate campaigns, define commission rules, approve or reject pending commissions, and generate reports.

**Why this priority**: Campaign management enables flexibility in commission structures and allows business control over affiliate incentives. This is important but can be manual initially.

**Independent Test**: Can be tested by an admin creating a campaign with specific rules, monitoring commission requests, and approving/rejecting them. Delivers value through business control.

**Acceptance Scenarios**:

1. **Given** an admin user, **When** they create a new campaign, **Then** they can define campaign name, date range, reward type (percentage/fixed/voucher), reward value, and multi-level configuration
2. **Given** pending commissions exist, **When** an admin reviews them, **Then** they can approve or reject commissions with optional notes
3. **Given** an admin wants to monitor system performance, **When** they access the reports section, **Then** they see overview metrics including total affiliates, total referrals, total commissions, and conversion rates
4. **Given** an admin approves a commission, **When** approval is confirmed, **Then** the commission status changes to "approved" and becomes eligible for payout

---

### User Story 6 - Payout Request and Processing (Priority: P3)

Affiliates with sufficient approved commission balance need to request payouts, and admins need to process these payout requests.

**Why this priority**: Payouts complete the affiliate value cycle but can be handled with some delay initially. Essential for long-term affiliate satisfaction.

**Independent Test**: Can be tested by an affiliate requesting a payout and an admin processing it. Delivers value through financial fulfillment.

**Acceptance Scenarios**:

1. **Given** an affiliate has approved commissions exceeding the minimum payout threshold, **When** they request a payout, **Then** the system creates a payout request with their chosen payment method
2. **Given** a payout request is created, **When** an admin processes the payout, **Then** the payout status changes to "paid" and the affiliate's available balance is deducted
3. **Given** an affiliate has insufficient balance, **When** they attempt to request a payout, **Then** the system prevents the request and displays the minimum threshold requirement
4. **Given** multiple payout methods are supported, **When** an affiliate requests a payout, **Then** they can choose their preferred method (bank transfer, e-wallet, etc.)

---

### User Story 7 - Embedded Landing Page with Dual Flow Support (Priority: P2)

The system provides a landing page that supports both customer signup with voucher rewards and affiliate recruitment (join as downstream affiliate).

**Why this priority**: A flexible landing page maximizes conversion opportunities and enables viral affiliate growth. Important for user acquisition.

**Independent Test**: Can be tested by accessing the landing page with different parameters and verifying the correct flow is presented. Delivers value through conversion optimization.

**Acceptance Scenarios**:

1. **Given** a user accesses the landing page via a referral link, **When** the page loads, **Then** they see options to either sign up as a customer (with voucher) or join as an affiliate
2. **Given** a user chooses to sign up as a customer, **When** they complete registration, **Then** they receive the promised voucher and are linked to the referring affiliate
3. **Given** a user chooses to join as an affiliate, **When** they complete registration, **Then** they become a downstream affiliate under the referrer and receive their own referral code
4. **Given** a website wants to embed the affiliate functionality, **When** they add the embed script with their referral code, **Then** the tracking works seamlessly on their site

---

### Edge Cases

- What happens when a user clears cookies between clicking a link and registering?
  - System falls back to URL parameter-based tracking if referral code is present in registration
- What happens when the same user clicks multiple affiliate links?
  - System uses last-click attribution: most recent valid referral wins
- What happens when a referred user makes a payment but the affiliate has been deactivated?
  - Commission is calculated but marked with special status for admin review
- What happens when a payment webhook arrives late or gets retried?
  - System uses transaction ID deduplication to prevent double commission calculation
- What happens when an affiliate tries to refer themselves?
  - System detects and blocks self-referrals based on email, user ID, or configurable fraud rules
- What happens when multiple signups occur from the same IP within a short time window?
  - System flags these events for anti-fraud review but does not automatically reject
- What happens when a campaign ends but there are pending commissions from that campaign?
  - Pending commissions remain valid and can still be approved; campaign end date only affects new referrals
- What happens when an affiliate's parent is changed after they've already earned commissions?
  - Existing commissions are not recalculated; only future commissions use the new hierarchy

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & User Management**

- **FR-001**: System MUST allow users to register with email and password
- **FR-002**: System MUST allow users to authenticate and receive session tokens
- **FR-003**: System MUST support three distinct user roles: Admin, Affiliate, and Referred User
- **FR-004**: System MUST allow authenticated users to become affiliates upon request

**Affiliate Code & Link Generation**

- **FR-005**: System MUST generate unique referral codes for each affiliate
- **FR-006**: System MUST provide shareable referral links that include the affiliate's unique code
- **FR-007**: System MUST ensure referral codes remain stable and do not change once assigned

**Referral Tracking**

- **FR-008**: System MUST track click events when users access referral links, recording IP address, user agent, referrer, and timestamp
- **FR-009**: System MUST set tracking cookies with configurable time-to-live when users click referral links
- **FR-010**: System MUST track signup events when users register with a referral code, linking them to the referring affiliate
- **FR-011**: System MUST support both cookie-based and URL parameter-based referral attribution
- **FR-012**: System MUST use last-click attribution when a user clicks multiple referral links before registering

**Payment Tracking & Transaction Recording**

- **FR-013**: System MUST record transactions when referred users make payments or top-ups
- **FR-014**: System MUST accept payment notifications from webhook endpoints
- **FR-015**: System MUST validate payment authenticity before creating transaction records
- **FR-016**: System MUST prevent duplicate transaction processing using transaction ID deduplication

**Commission Calculation**

- **FR-017**: System MUST calculate commissions based on active campaign rules when a transaction occurs
- **FR-018**: System MUST support percentage-based commission calculation
- **FR-019**: System MUST support fixed-amount commission calculation
- **FR-020**: System MUST support multi-level commission calculation up to configurable depth
- **FR-021**: System MUST create commission records in "pending" status by default
- **FR-022**: System MUST associate each commission with the specific affiliate level (Level 1, Level 2, etc.)
- **FR-023**: System MUST apply commission rules from the active campaign at the time of transaction

**Campaign Management**

- **FR-024**: Admins MUST be able to create campaigns with name, start date, end date, reward type, and reward value
- **FR-025**: System MUST support campaign reward types: percentage, fixed amount, and voucher
- **FR-026**: Admins MUST be able to configure multi-level commission percentages per campaign
- **FR-027**: System MUST only apply campaigns that are within their active date range
- **FR-028**: System MUST allow campaigns to have configurable cookie TTL (time-to-live in days)

**Affiliate Dashboard**

- **FR-029**: Affiliates MUST be able to view their referral code and shareable link
- **FR-030**: Affiliates MUST be able to view total clicks, signups, conversions, and commission earnings
- **FR-031**: Affiliates MUST be able to view commission breakdown by status: pending, approved, paid, rejected
- **FR-032**: Affiliates MUST be able to view their available balance for withdrawal
- **FR-033**: Affiliates MUST be able to filter dashboard statistics by date range

**Commission Approval**

- **FR-034**: Admins MUST be able to view all pending commissions
- **FR-035**: Admins MUST be able to approve commissions, changing status to "approved"
- **FR-036**: Admins MUST be able to reject commissions with optional rejection notes
- **FR-037**: System MUST update affiliate available balance when commissions are approved

**Payout Management**

- **FR-038**: Affiliates MUST be able to request payouts when their available balance meets the minimum threshold
- **FR-039**: System MUST support multiple payout methods (configurable)
- **FR-040**: System MUST create payout records with status tracking (pending, processing, paid, failed)
- **FR-041**: Admins MUST be able to process payout requests and mark them as paid
- **FR-042**: System MUST deduct the payout amount from affiliate's available balance when payout is marked as paid

**Landing Page & Embedding**

- **FR-043**: System MUST provide a landing page accessible via `/r/:refCode` that redirects with tracking
- **FR-044**: Landing page MUST support two flows: customer signup with voucher and affiliate recruitment
- **FR-045**: System MUST provide an embeddable script that websites can use to enable tracking
- **FR-046**: Embedded script MUST accept a `data-ref` attribute to specify the referral code

**Anti-Fraud Measures**

- **FR-047**: System MUST detect and prevent self-referrals (same user referring themselves)
- **FR-048**: System MUST flag multiple signups from the same IP address within a configurable time window
- **FR-049**: System MUST flag repeated clicks from the same IP/user agent combination within a short time window
- **FR-050**: System MUST store IP address and user agent for all referral events to enable fraud analysis
- **FR-051**: Admins MUST be able to review flagged events and take action

**Reporting**

- **FR-052**: Admins MUST be able to view system-wide metrics: total affiliates, total referrals, total commissions, conversion rates
- **FR-053**: Admins MUST be able to filter reports by date range and campaign
- **FR-054**: System MUST provide exportable reports in standard format

**API Endpoints**

- **FR-055**: System MUST expose authentication endpoints: login and registration
- **FR-056**: System MUST expose affiliate endpoints: get affiliate info, get referral code, track payment
- **FR-057**: System MUST expose admin endpoints: affiliate management, campaign CRUD, commission approval
- **FR-058**: System MUST expose reporting endpoints with filtering capabilities
- **FR-059**: System MUST expose webhook endpoints for payment provider callbacks

### Key Entities

- **Affiliate**: Represents a user participating in the referral program. Key attributes include unique referral code, parent affiliate (for multi-level), tier level, and status (active/inactive). Can have many referred users and downstream affiliates.

- **Referred User**: Represents someone who was referred by an affiliate. Key attributes include email, optional user ID (if they complete registration), referral code used, and the referring affiliate. Linked to transactions they create.

- **Campaign**: Defines the rules for commission calculation. Key attributes include name, start/end dates, reward type (percentage/fixed/voucher), reward value, cookie TTL, and multi-level configuration. Multiple campaigns can exist but only active ones apply.

- **Referral Event**: Tracks individual referral-related actions. Key attributes include affiliate ID, referred user ID (if applicable), IP address, user agent, cookie ID, event type (click/signup/payment), metadata, and timestamp. Used for attribution and fraud detection.

- **Transaction**: Represents a payment or top-up made by a referred user. Key attributes include referred user ID, amount, currency, status (pending/completed/failed), and timestamp. Triggers commission calculation.

- **Commission**: Represents earnings for an affiliate from a transaction. Key attributes include affiliate ID, transaction ID, amount, status (pending/approved/paid/rejected), level (1/2/3...), and timestamps. Tracks the complete lifecycle of affiliate earnings.

- **Payout**: Represents a withdrawal request from an affiliate. Key attributes include affiliate ID, requested amount, payment method, status (pending/processing/paid/failed), request timestamp, and payment timestamp. Links to multiple commission records.

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Performance & Scalability**

- **SC-001**: Referral link clicks are tracked and redirected in under 100 milliseconds at 95th percentile
- **SC-002**: System handles at least 1,000 concurrent referral tracking events without degradation
- **SC-003**: Payment webhook processing completes within 500 milliseconds to avoid timeout retries

**Accuracy & Reliability**

- **SC-004**: 100% of valid referral attributions are correctly linked to the referring affiliate
- **SC-005**: 100% of transactions trigger commission calculations for all eligible affiliate levels
- **SC-006**: Zero duplicate commission records are created for the same transaction
- **SC-007**: Commission calculations match campaign rules with 100% accuracy

**User Experience**

- **SC-008**: Affiliates can obtain their referral code in under 30 seconds from dashboard access
- **SC-009**: Landing page loads and displays referral-specific content in under 2 seconds
- **SC-010**: Affiliate dashboard displays current statistics in under 3 seconds
- **SC-011**: 95% of affiliates successfully share their referral link on first attempt

**Business Outcomes**

- **SC-012**: System supports at least 10,000 active affiliates without performance degradation
- **SC-013**: Admin can review and approve 100 commission records in under 5 minutes
- **SC-014**: Payout processing reduces manual reconciliation time by at least 70%
- **SC-015**: Fraud detection flags at least 90% of suspicious activities for admin review

**Data Integrity**

- **SC-016**: All referral events are persisted with complete attribution data (IP, user agent, timestamp)
- **SC-017**: Cookie-based tracking has at least 80% success rate (accounting for cookie-blocking users)
- **SC-018**: URL parameter fallback tracking captures at least 95% of referrals when cookies are unavailable

## Assumptions

- Payment provider webhooks are reliable and include transaction ID, user ID, and amount
- Users who clear cookies will still have referral code available in URL or registration form
- Multi-level commissions default to 3 levels unless campaign specifies otherwise
- Minimum payout threshold defaults to $50 USD equivalent unless configured differently
- Last-click attribution model is acceptable for determining referral ownership
- Session-based authentication is acceptable; JWT/OAuth details will be specified during planning
- Payment methods for payouts will be determined based on business requirements (bank transfer, e-wallet, etc.)
- Anti-fraud rules are configurable; specific thresholds will be defined during implementation
- Landing page design and branding will be provided separately; spec focuses on functionality
- Voucher reward distribution mechanism will be designed during planning phase

## Open Questions

The following items require clarification to finalize the specification:

1. **Multi-level depth**: Should the system support unlimited multi-level depth, or is there a maximum (e.g., 5 levels)?
   - **Impact**: Affects database schema design and commission calculation complexity

2. **Commission approval workflow**: Should commissions be auto-approved after a grace period, or always require manual admin approval?
   - **Impact**: Affects admin workload and payout velocity for affiliates

3. **Cookie TTL default**: What is the default cookie time-to-live if not specified in a campaign?
   - **Impact**: Affects attribution window and fairness of credit assignment
