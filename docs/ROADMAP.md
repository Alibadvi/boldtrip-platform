# Roadmap

## Current state

Phase 0 architecture is documented. The foundation/design-system branch contains the first implementation work. Navbar, footer, production homepage, customer authentication, bookings, requests, documents, and payment workflows are not implemented.

## Phase 1 — Foundation

Current work:

- Next.js, Payload, PostgreSQL, pnpm, Docker;
- environment validation;
- TypeScript, ESLint, Prettier, Vitest, CI;
- staff identity/capabilities as the first real DDD slice;
- RTL design tokens and core UI primitives;
- temporary foundation page.

Exit:

- clean install;
- Payload admin opens and first staff account can be created;
- typecheck, lint, unit tests, and production build pass;
- no real secrets or customer data.

## Phase 2 — Public shell

- approved font and brand assets;
- navbar, mobile navigation, footer;
- homepage;
- one representative country/service page;
- responsive and accessibility review.

## Phase 3 — Catalog/content

- countries, visa options, services, sources/review dates;
- articles, FAQ, pages, SEO;
- editor access and publish workflow.

## Phase 4 — Customer identity/account

- approved customer sign-in/verification/recovery;
- account shell, profile, ownership tests;
- action-focused dashboard.

## Phase 5 — Consultation

- types, consultants, availability and exceptions;
- transactional slot hold and expiry;
- booking account/admin views;
- concurrency and timezone tests.

## Phase 6 — Requests/documents

- versioned service forms;
- embassy and visa-request slices;
- private upload, scanning, signed access, replacement;
- case status/actions and admin queues.

## Phase 7 — Manual payments

- transfer instruction snapshots;
- fixed price and quotation;
- receipt upload, review, rejection/correction, confirmation;
- linked booking/request state and audit.

## Phase 8 — Launch

- notifications/outbox;
- retention and security hardening;
- monitoring, backups, restore;
- end-to-end tests and deployment runbook.

A realistic solo-developer range remains approximately 12–16 full-time weeks after client decisions/content are available.

## Work discipline

One issue is one testable vertical slice. Use short branches and natural commits. Each task states goal, files, constraints, and done criteria. Update this file after meaningful progress.
