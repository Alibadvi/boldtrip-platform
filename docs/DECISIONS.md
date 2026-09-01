# Architecture decisions

Accepted decisions are stable until a new decision record explains why they changed.

## ADR-001: Modular monolith

Status: accepted, 2026-09-01

Use one deployable application with domain modules. Do not start with microservices or separate frontend/backend deployments.

Reason: one developer/team can ship, test, and operate it with less authentication, API, deployment, and debugging overhead. Module boundaries preserve a later extraction path.

## ADR-002: Next.js and Payload in one application

Status: accepted, 2026-09-01

Use Next.js App Router with TypeScript. Run Payload CMS inside the same application for admin, authentication, collections, access control, migrations, and Local API.

Do not introduce a parallel NestJS backend or separate Prisma schema in the MVP.

## ADR-003: PostgreSQL

Status: accepted, 2026-09-01

Use PostgreSQL through Payload's supported adapter. Add explicit migrations and constraints for booking concurrency and other invariants.

Reason: scheduling, ownership, state transitions, and reporting are relational and require transaction safety.

## ADR-004: Manual payment with receipt review

Status: accepted by project owner, 2026-09-01

After a fixed price or staff quotation exists, show an admin-managed snapshot of transfer details and exact amount. Customer uploads a private receipt. Authorized staff confirms or rejects it.

The system records staff confirmation; it does not integrate with or claim verification by a bank.

## ADR-005: Customer account

Status: accepted by project owner, 2026-09-01

Customers receive an account containing bookings, service requests, documents, manual payments, and current actions. Tracking code alone is insufficient for private documents and ongoing corrections.

## ADR-006: Private object storage

Status: accepted, 2026-09-01

Store passport files, documents, and receipts in private S3-compatible object storage. PostgreSQL stores metadata. Access requires authorization and a short-lived signed operation.

Local web-server disk and public/ are prohibited for customer files.

## ADR-007: Pragmatic DDD

Status: accepted, 2026-09-01

Use domain, application, infrastructure, and presentation separation where business rules justify it. Avoid generic base classes, placeholder repositories, and symmetrical empty folders.

Core contexts: catalog, scheduling, cases, documents, payments, identity, notifications, and content.

## ADR-008: RTL-first design

Status: accepted, 2026-09-01

Persian RTL is the first customer experience. English/multilingual support is not included until approved. Components use logical CSS properties and explicitly handle LTR identifiers within RTL layouts.

## ADR-009: Database-backed worker/outbox

Status: proposed

Use a small worker from the same codebase for hold expiry, notifications, retention, and asynchronous scanning. Avoid an external message broker until workload proves it necessary.

## Open decisions

| ID | Decision needed | Recommendation / impact |
|---|---|---|
| O-001 | Exact launch countries, visas, and services | Client must provide a finite list before estimating content/forms |
| O-002 | Customer authentication | Mobile OTP recommended; provider and recovery path required |
| O-003 | Consultant model | Confirm one vs multiple consultants and assignment rules |
| O-004 | Booking policy | Duration, hours, timezone, holidays, hold time, cancellation/reschedule/no-show |
| O-005 | Pricing | Identify fixed-price vs quotation services and currency unit |
| O-006 | Payment operations | Receipt review SLA, rejection reason policy, correction deadline |
| O-007 | Form/document requirements | Approved fields and documents per service; no invented passport fields |
| O-008 | Retention/privacy | Legal text, consent, retention, deletion, processor list |
| O-009 | Providers | Hosting, PostgreSQL, object storage, SMS, email, monitoring, malware scan |
| O-010 | Language | Confirm Persian-only MVP and later translation ownership |
| O-011 | Brand | SVG logo, final palette approval, image rights, font licensing, Persian copy |
| O-012 | Repository visibility | Change repository from public to private before feature code |
| O-013 | Staff roles | Named users, assignment, role combinations, and 2FA administration |
| O-014 | Business details | Admin-approved transfer and contact fields; never commit real values |
| O-015 | Quotation workflow | Who may quote, validity period, customer acceptance, amount-change rules |

Resolve open decisions in writing and update this document before the affected feature starts.