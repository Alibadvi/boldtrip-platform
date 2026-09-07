# Roadmap

## Current state

Phase 0 architecture and the Phase 1 foundation are implemented. The public shell includes the
navbar, mobile navigation, footer, homepage, and FAQ. Countries and visa details are the first
data-driven catalog slice: staff maintain them in Payload and the public routes render only
published records. Customer authentication/account views, services, embassy requests, basic
consultation booking, private local uploads and manual receipt review are implemented for the
demo. Article publishing and the production hardening described below are still outstanding.

## Session and demo-content fixes — 2026-09-07

Branch: `fix/customer-admin-sessions`. Code reviewed against the installed Payload 3.88.0
authentication and endpoint implementation. Runtime verification is still outstanding: log
in/out of both accounts in either order, try an expired customer session, and exercise customer
uploads and bookings with both accounts signed in. No database was populated from this
workspace; the local database needs the corrected seed command.

- Separate customer/admin cookies and route customer mutations through `/api/customer/*`.
- Preserve Payload ownership checks; restrict staff access to active staff identities.
- Demo seeding loads `.env*` before config evaluation and explicitly publishes catalog records.
- `pnpm seed:demo:content` refreshes public demo content and fake payment settings without
  resetting customer accounts or operational records. Run it locally; a GitHub merge does not
  populate the database. No test suite or application run was performed for this change.

## Admin usability — 2026-09-07

- Persian translations and RTL admin layout, with a locally hosted Vazirmatn font.
- BoldTrip branding and Tailwind styling for navigation, forms, tables and login.
- Dashboard queues for pending receipts, new requests, pending documents and confirmed
  consultations in the next seven days; links open the record or its filtered list.
- Reads use the current staff request and Payload access rules. Shortcuts follow visible
  collections/globals. Database errors display an unavailable state rather than a zero count.
- No schema or authentication changes. Source review only; no tests, build or application run.

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

- [ ] approved font and final brand assets;
- [x] navbar, mobile navigation, and footer;
- [x] homepage and FAQ;
- [x] country index, country detail, and visa detail templates;
- [ ] representative approved country/visa content;
- [ ] responsive and accessibility review.

## Phase 3 — Catalog/content

- [x] countries, visa options, official sources, and review dates;
- [ ] services and their relationship to countries/visas;
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
