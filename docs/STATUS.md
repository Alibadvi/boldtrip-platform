# Project status

Last updated: 2026-09-01  
Current phase: Phase 0 — documentation review  
Feature code: not started

## Confirmed by project owner

- One Next.js + Payload full-stack application.
- PostgreSQL persistence.
- Practical DDD modular monolith.
- Manual transfer instructions with receipt upload and staff confirmation.
- Customer account with bookings, requests, documents, and payment status.
- No online payment gateway in the current scope.

## Phase 0 deliverables

| Document | Status |
|---|---|
| Product scope | Drafted |
| Sitemap | Drafted |
| User flows | Drafted |
| Domain boundaries | Drafted |
| Data model | Drafted |
| System architecture | Drafted |
| Security model | Drafted |
| Design system | Drafted |
| Architecture decisions | Drafted |
| Roadmap | Drafted |
| Agent working agreement | Drafted |

Drafted means ready for project-owner/client review, not approved business truth.

## Current risks

- Repository is public; make it private before feature code or configuration is added.
- Launch countries, visa types, services, forms, and document requirements are not finite yet.
- Customer authentication and notification providers are not selected.
- Consultation rules and number of consultants are unknown.
- Retention/privacy terms for passport data are not approved.
- Final SVG logo, Persian copy, licensed images, and font decision are pending.
- Real transfer details must be configured outside source control.

## Next action

Review Phase 0, then collect written client answers for the open decisions in docs/DECISIONS.md. Update affected documents before opening the application-foundation issue.

## Change discipline

When work starts, this file should contain only current facts:

- active phase and branch/issue;
- last completed vertical slice;
- current blockers;
- next testable action;
- verification state.

Do not turn STATUS.md into a daily diary or duplicate the Git history.