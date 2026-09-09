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

## Frontend brand and motion — 2026-09-07

- Homepage redesign preserves Payload content and published featured destinations. Country
  accents use country codes. Service, consultation and account links retain existing routes.
- The supplied standalone logo is served locally as-is. A compact SVG favicon adapts its
  orbit/star-pin motif. The reference visa poster and its personal data are not published.
- Frontend Vazirmatn now uses `next/font/local` and the existing licensed font asset. Font
  loading requires no Google/CDN connection; this does not add offline page or API caching.
- Floating navigation, current-route indication, native modal mobile menu with Escape/focus
  behavior, skip link, clearer FAQs/footer, route loader and short page entrances.
- Scroll reveals are progressive enhancement; parallax is bounded and desktop-only. Motion
  respects the system reduced-motion setting, with no artificial loading delay or scroll hijack.
- No dependencies or schema changes. No tests, builds or app runs were performed; browser
  verification, accessibility review and production workflow/security gates remain outstanding.

## Workflow and permission hardening — 2026-09-08

- Active staff identity required by the central capability resolver; new staff no longer
  default to administrator. First-admin bootstrap and self-lockout guards are explicit.
- Internal case notes excluded from customer responses. Customers cannot supply a quote,
  reviewer note, owner or authoritative review status; new destinations/services are checked
  on the server. Request ownership and booking snapshots are immutable after creation.
- Receipt amount/owner/state validation, duplicate-pending/approved protection, mandatory
  rejection reasons and linked transitions sharing a PostgreSQL row lock and transaction.
  Reviewed receipts and operational histories are retained; use status changes instead of delete.
- Private upload size/signature/type checks; corrected files are new records. Closed cases
  refuse uploads. Signature checking does not replace malware scanning.
- Customer request guidance and payment states explain what to do next, suppress repeat
  payment/upload prompts and retain receipt history. Receipt form handles network failure
  without staying stuck or resetting a missing event target.
- Request CMS links open the related documents/receipts; internal notes and review steps have
  clearer labels. Payment settings cannot be activated without account details.
- Demo seeding is blocked in production and preserves existing operational records/passwords.
- No schema/dependency changes. Source review only: no tests, typecheck, build, app run or
  database mutations performed. Generated Payload types remain stale for several existing
  modules; regenerate them locally before the next compile/build review.

Remaining launch gates: private object storage and malware quarantine, delivery-capable
email/password recovery, staff MFA, audit/retention policy, booking expiry/cancellation/refund
rules, deployment backups/restore/monitoring, real approved content/account settings, and
runtime verification of ownership, simultaneous payment reviews and customer/admin sessions.
The basic customer journeys exist; production readiness has not been verified.

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



## Production security branch — 2026-09-08

Implemented regenerated operational types, typed API cleanup, staff authenticator enrollment/recovery and replay protection, persistent auth throttling, append-only application audit records, booking hold expiry, full-refund tracking, private S3 integration, pre-storage ClamAV scanning, Resend email, health probes, monitoring configuration and backup/restore scripts. Added generated schema migrations and focused unit/PostgreSQL integration checks.

Handoff: see DEPLOYMENT.md. No production accounts or credentials were available. Live email/storage/scanner/MFA enrollment, alert delivery, schema rollout and restore drills remain unverified. PostgreSQL integration checks need GitHub CI because this workspace could not install PostgreSQL. Preserve the review branch until its database checks are addressed; do not treat source completion as production readiness.

## Cinematic homepage flight — 2026-09-09

- Reworked the existing flight section while preserving the latest homepage, navbar and CMS content.
- The opening plane/clouds are visible in server-rendered markup. Scroll motion begins during entrance; the plane approaches the camera before banking away through four cloud layers and side mist.
- Responsive, pre-compressed local WebP assets bypass first-request image optimization: approximately 65 KB combined on mobile or 181 KB on larger screens. Repeated clouds reuse one download.
- Native sticky scrolling uses stable viewport dimensions, event-driven animation frames and direct transform/opacity updates. No animation library, WebGL renderer, continuous render loop or database change.
- The following process section remains available to keyboard users and enters over the closing scene without opacity/inert gating. Reduced-motion, short-landscape and no-script layouts use a static scene.
- Source/asset review only. The preview browser blocked local/offline pages; device rendering and physical-device performance remain unverified. No full app build, typecheck or test suite was run, as requested.
