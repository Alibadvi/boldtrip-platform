# Architecture

## Decision

BoldTrip is one modular full-stack application. Next.js and Payload share a repository, Node.js runtime, deployment, authentication context, and PostgreSQL database. There is no separate NestJS service in the MVP.

~~~mermaid
flowchart TD
    C["Customer browser"] --> N["Next.js"]
    A["Staff browser"] --> N
    N --> M["Application modules and Payload"]
    M --> D["PostgreSQL"]
    M --> S["Private object storage"]
    M --> P["SMS or email provider"]
~~~

## Responsibilities

Frontend:

- Persian/RTL public pages;
- customer account and guided forms;
- accessible calendars, uploads, progress, and status;
- Server Components for reads and narrow Client Components for browser interaction;
- no authority over ownership, price, availability, or state transitions.

Backend inside the same application:

- Payload admin, auth, collections, access control, and migrations;
- application use cases and domain policies;
- server validation;
- PostgreSQL transactions/constraints;
- authorized signed file operations;
- audit and notification outbox.

Server Actions handle same-app form mutations. Route handlers cover Payload REST, uploads, provider callbacks, and explicit HTTP contracts. Both call application use cases.

## DDD boundaries

| Module | Owns |
|---|---|
| identity | Staff/customer identity, roles, capabilities |
| catalog | Countries, visa options, services, requirements, pricing mode |
| scheduling | Consultants, availability, holds, bookings, cancellation rules |
| cases | Service requests, applicants, answers, actions, timelines |
| documents | Metadata, versions, scanning, review, secure access |
| payments | Transfer snapshot, amount, receipt, staff review, payment state |
| notifications | Templates, outbox, provider adapters, retry |
| content | Articles, FAQ, pages, navigation, SEO |

Only create a layer when working code needs it:

    src/modules/<module>/
      domain/
      application/
      infrastructure/
      presentation/

Presentation calls an application use case. Modules communicate through small application contracts/events, never another module's infrastructure implementation.

The identity module is the first implemented example. Empty folders and generic base classes are prohibited.

## Data model

Main records:

| Area | Records |
|---|---|
| Identity | staff, customers, customer profiles |
| Catalog | countries, visa options, services, service form versions, consultation types |
| Scheduling | consultant profiles, availability rules/exceptions, bookings |
| Cases | service requests, applicants, validated answers, case actions, status history |
| Documents | document records, versions, scan/review state, retention |
| Payments | instruction sets, manual payments, receipt versions/reviews |
| Operations | notification outbox, audit events, typed settings |

Core constraints:

- normalized unique account identifiers;
- unique human-facing references;
- non-overlapping active consultant bookings;
- one business owner/purpose per private document;
- one payable relation per payment;
- immutable payment amount/instruction snapshot after receipt submission;
- UTC storage for time and integer storage for money;
- submitted request form/version snapshot;
- explicit status-transition history.

Payload uses PostgreSQL through its official adapter. Custom concurrency constraints and indexes use committed migrations. Do not add a parallel Prisma schema.

## Important states

Booking:

    draft -> pendingReceipt -> receiptSubmitted -> confirmed
                            -> expired
    receiptSubmitted -> paymentRejected -> receiptSubmitted
    confirmed -> completed | cancelled | noShow

Service request:

    draft -> submitted -> underReview -> awaitingDocuments
          -> awaitingQuotation -> awaitingPayment -> paymentReview
          -> inProgress -> completed

Manual payment:

    pendingReceipt -> receiptSubmitted -> confirmed
    receiptSubmitted -> rejected -> receiptSubmitted
    pendingReceipt -> expired

Use cases enforce transitions and permissions. UI buttons do not define valid state.

## Files

PostgreSQL stores metadata only. Private S3-compatible storage stores customer bytes.

- opaque random storage keys;
- MIME, magic-byte, extension, and size checks;
- malware quarantine before download;
- short-lived signed access after ownership/capability checks;
- versioned replacement instead of overwriting;
- staff view/download audit;
- no sensitive values in keys, URLs, logs, analytics, or notifications.

Public marketing media uses a separate policy.

## Authentication and authorization

Staff and customers are separate Payload auth collections using email/password. Customer browser
requests use `/api/customer/*` and the `boldtrip-customer-token` HTTP-only cookie. Payload admin
uses `boldtrip-admin-token`. Customer requests strip browser admin credentials, verify the
customer session and run Payload's existing endpoints/access rules. Mutations enforce an
origin check before forwarding the customer cookie as a JWT. Logging out affects one session.

Roles:

- admin;
- consultant;
- case operator;
- finance operator;
- content editor.

Every sensitive operation applies session, collection access, ownership/assignment, capability, valid state transition, and storage authorization. Admin UI visibility is not authorization.

Staff require individual accounts and 2FA before production. Customer authentication is expected to use mobile OTP after provider confirmation.

## Security baseline

- private repository before secrets/business configuration;
- TLS and HTTP-only secure sessions;
- CSRF protection and strict security headers;
- rate limits for authentication, forms, uploads, and searches;
- server-side validation;
- idempotency for submission, slot hold, receipt upload, and payment review;
- encrypted sensitive identifiers;
- no public database;
- least-privilege DB/storage credentials;
- encrypted backups and demonstrated restore;
- scrubbed structured logs;
- dependency/secrets scanning;
- approved privacy, consent, retention, and incident procedures.

Production is blocked until cross-customer access, upload/malware, booking concurrency, finance permission/idempotency, backup restore, retention, and staff 2FA checks pass.

## Deployment

Recommended topology:

- reverse proxy/TLS;
- Next.js/Payload web container;
- worker container from the same image for expiry/outbox/retention;
- PostgreSQL;
- private object storage;
- SMS/email provider;
- monitoring and centralized logs.

A database-backed idempotent worker is sufficient initially. Do not add a message broker without measured need.

## Accepted decisions

- Next.js + Payload modular monolith.
- PostgreSQL.
- Manual transfer receipt with staff review; no payment gateway.
- Full customer account.
- Private object storage for customer files.
- Pragmatic DDD rather than enterprise ceremony.
- Persian RTL first.
- Database-backed outbox/worker when the first background job is implemented.

Record future architecture changes in this section with date, reason, and consequences.

- 2026-09-07: Separate staff/customer browser sessions. A shared Payload cookie caused customer
  login to block admin login. The API adapter preserves Payload authentication, validation and
  ownership checks; existing account records are retained. The new cookie names require one
  fresh login for each account after pulling this change.


## Workflow integrity — 2026-09-08

Receipt submission/review and the linked request or booking update use the same Payload
request/transaction. A small PostgreSQL adapter helper locks the parent row before rereading
its state. Request/booking edits take the same lock, so payment decisions cannot race a quote
change or cancellation through these collection hooks. Transactions must remain enabled;
the helper fails closed when no active PostgreSQL transaction exists. This relies on the
installed Payload/Postgres adapter session API and needs rechecking when that adapter changes.

Receipt ownership and amount come from the parent. Pending/approved duplicates are refused;
settled receipts and their files cannot be edited or deleted through the app. Rejections need
a customer-visible reason. Closed requests/bookings cannot be reopened; cancellation keeps
the history. These controls do not implement refunds, an immutable audit log or bank matching.

Internal case notes are staff-only fields and are excluded from customer DTOs. File validation
checks the size, extension, MIME type and initial bytes before upload processing; it is not a
malware scanner. Private local storage remains a development arrangement, not the production
object-storage/retention design. New staff default to content-editor privileges; first-account
bootstrap still creates an active administrator.

## Production security additions — 2026-09-08

Staff MFA uses RFC 6238 codes, an AES-GCM-encrypted secret, a row-locked replay counter and one-use hashed recovery codes. Native staff password reset is blocked because it can issue a session without the login MFA hook; trusted server enrollment/recovery revokes old sessions. Customer/admin cookie separation remains in place. Auth attempt counters survive failed login transactions.

Operational audit rows share the source mutation transaction and record IDs, status changes and changed field names without copying documents, bank numbers or internal notes. API roles cannot edit/delete history; database administrators still can. This is not externally tamper-proof audit storage.

Slot reservation takes a slot lock and retains a unique reservation key. Expired unpaid holds release that key, while receipt review and confirmation retain it. Refunds preserve the approved payment receipt and use a separate finance workflow. Private storage, malware scanning and email are configured through deployment environment variables, with production checks that fail closed when required configuration is missing. Deployment and verification limitations are in DEPLOYMENT.md.
