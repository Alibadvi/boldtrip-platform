# Implementation roadmap

The roadmap builds vertical capability, not a large generated scaffold. Estimates assume one full-time developer, stable client answers, and timely content/assets. Unknown integrations can move the dates.

## Phase 0 — Product and architecture

Status: in review

Deliverables:

- product scope and exclusions;
- sitemap and main user flows;
- frontend/backend architecture;
- DDD boundaries and data model;
- security model;
- design system specification;
- decisions and open questions;
- implementation roadmap and working agreement.

Exit criteria:

- project owner approves the three core decisions;
- client answers launch scope and workflow questions;
- unresolved items have named owners;
- no feature code has started.

## Phase 1 — Application foundation

Estimated: 1–2 weeks

- Next.js/Payload/PostgreSQL foundation;
- TypeScript strict mode, lint, formatting, tests, CI;
- environment validation and safe example configuration;
- Docker development services;
- module skeleton only where needed;
- base access roles and audit infrastructure;
- private/public storage adapter setup;
- migrations and seed data with fictional content.

Exit: local setup is reproducible; CI passes; admin sign-in works; secrets scan is clean.

## Phase 2 — Design system and public shell

Estimated: 1–2 weeks

- tokens, typography, RTL primitives, layout, navigation, footer;
- core buttons, fields, feedback, cards, status, file control;
- Storybook or focused component preview only if it saves review time;
- home page and one representative content detail page;
- accessibility and responsive baseline.

Exit: approved visual direction works at 360px and desktop with no placeholder brand assumptions.

## Phase 3 — Catalog and editorial content

Estimated: 1–2 weeks

- countries, visa options, services, sources/review dates;
- articles, FAQ, pages, SEO, draft/publish behavior;
- country/visa/service routes, search/filter basics;
- editor permissions and preview.

Exit: editors can publish the finite MVP catalog without developer changes.

## Phase 4 — Identity and customer account shell

Estimated: 1–2 weeks

- approved customer sign-in/verification/recovery;
- staff roles and 2FA path;
- account layout, profile, security, ownership policies;
- action-oriented dashboard and empty states.

Exit: cross-customer access tests pass and account recovery is operational.

## Phase 5 — Consultation booking

Estimated: 2 weeks

- consultation types and consultant availability;
- exceptions and server-generated slots;
- transactional slot hold and expiry worker;
- booking state transitions and policies;
- account/admin booking views;
- concurrency, timezone, and expiry tests.

Exit: concurrent attempts cannot double-book and expired holds release correctly.

## Phase 6 — Service requests and documents

Estimated: 2–3 weeks

- service-specific versioned forms;
- draft, review, submit, correction, and status timeline;
- embassy appointment and one visa service vertical slice;
- private upload, validation, scanning, signed access, versions;
- admin queues and ownership tests.

Exit: a customer and operator can complete a request/document correction end to end without direct file exposure.

## Phase 7 — Manual payments

Estimated: 1–2 weeks

- instruction management and immutable snapshots;
- fixed price and quotation entry;
- receipt upload/versioning;
- finance review, rejection/correction, confirmation;
- linked booking/request transition;
- audit and idempotency tests.

Exit: payment state and linked domain state cannot disagree after a completed action.

## Phase 8 — Notifications, hardening, and deployment

Estimated: 2 weeks

- approved SMS/email templates and adapter;
- outbox worker, retry, failure queue;
- rate limits, headers, error scrubbing, monitoring;
- retention jobs and audit review;
- production containers, TLS, backups, restore test;
- Playwright critical paths and launch checklist.

Exit: security release gate passes and rollback/restore procedures are documented.

## Expected total

A realistic solo-developer range is approximately 12–16 full-time weeks after client decisions and content are available. Do not promise a compressed date by silently cutting document security, access control, concurrency testing, or operational readiness.

## Task and commit discipline

- One issue represents one testable vertical slice.
- Each task names the relevant modules/files and done criteria.
- Use short branches and reviewable commits.
- Avoid a single generated initial application commit.
- Update docs/STATUS.md after each merged slice.
- Record architecture changes in docs/DECISIONS.md.
- Ask the coding agent to inspect only relevant files, not the entire repository on every task.

## Suggested first implementation issues

1. Bootstrap Next.js, Payload, PostgreSQL, CI, and environment validation.
2. Add identity roles and access-control integration tests.
3. Implement tokens, RTL shell, navigation, and core controls.
4. Build country/visa catalog publishing vertical slice.
5. Build consultation slot generation and database collision rule.
6. Build customer booking flow through pending receipt.
7. Build private document upload and access tests.
8. Build embassy request vertical slice.
9. Build manual receipt review through domain confirmation.
10. Add notifications, retention, production hardening, and deploy runbook.