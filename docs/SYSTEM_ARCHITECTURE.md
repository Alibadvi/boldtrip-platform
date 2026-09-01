# System architecture

Decision: one modular full-stack application, not separate frontend and backend services.

## Runtime view

~~~mermaid
flowchart TD
    C["Customer browser"] --> W["Next.js application"]
    A["Staff browser"] --> W
    W --> P["Payload and application modules"]
    P --> D["PostgreSQL"]
    P --> O["Private object storage"]
    P --> N["SMS or email provider"]
~~~

Next.js and Payload run in the same Node.js process/deployment. PostgreSQL and object storage are separate managed resources or containers. Provider integrations are behind adapters.

## Frontend responsibilities

The frontend includes:

- public Persian/RTL pages and SEO rendering;
- customer account and guided forms;
- availability, booking, request, document, and payment view models;
- optimistic feedback only where failure is safely reversible;
- accessible validation and progress states;
- no trust decisions.

Use Server Components by default for public content and authenticated read screens. Use Client Components for calendars, upload controls, multi-step form interactions, and other browser state. Keep Client Component boundaries narrow.

The browser may send an intent, but it cannot decide ownership, price, availability, payment status, or allowed state transitions.

## Backend responsibilities

Backend code lives in the same repository and deployment:

- Payload collections, authentication, admin, access control, hooks, and migrations;
- application use cases for bookings, requests, documents, and payments;
- domain policies and state transitions;
- server validation;
- PostgreSQL transactions and concurrency constraints;
- signed upload/download operations;
- notification and audit outbox processing;
- staff-only operational endpoints.

Server Actions are appropriate for same-application form mutations. Route handlers are used for uploads, provider callbacks, health checks, and endpoints that need an explicit HTTP contract. Both must call the same application use cases.

## Read paths

Published country page:

    URL -> Next.js Server Component -> Payload Local API -> published catalog/content -> HTML

Customer request:

    authenticated route -> actor context -> Cases query service -> ownership filter -> view model -> HTML

The Local API avoids an unnecessary HTTP hop inside the same process, but it must still enforce access and publication rules.

## Write paths

Booking:

    form -> server validation -> hold-slot use case -> transaction
         -> availability check + collision constraint -> booking/payment records
         -> response

Receipt upload:

    request -> authorization -> file validation -> private upload
            -> DocumentRecord -> submit-receipt use case -> audit/outbox

Payment review:

    admin action -> finance authorization -> review-payment use case
                 -> payment transition + related booking/request transition
                 -> audit/outbox -> notification worker

## Persistence

- Payload PostgreSQL adapter is the default persistence mechanism.
- Domain invariants requiring concurrency safety use explicit migrations, indexes, and transactions.
- Repository adapters isolate important domain operations from collection details.
- Do not create a parallel Prisma schema.
- Dates are stored in UTC. Business timezone is configuration.
- Money is stored as an integer in the smallest configured unit. Display formatting is separate.

## File storage

PostgreSQL stores metadata only. Private object storage stores bytes.

- Uploads use server-authorized operations or tightly scoped pre-signed uploads.
- Downloads use short-lived signed URLs after authorization.
- Storage keys are random and do not contain names, phone numbers, passport numbers, or request references.
- Public marketing media uses a separate public storage policy from private customer documents.

## Authentication and authorization

Recommended customer authentication is mobile OTP, pending client/provider confirmation. Staff authentication uses strong passwords and 2FA before production.

Authorization is layered:

1. route/session check;
2. Payload collection access rules;
3. resource ownership or staff capability;
4. use-case transition permission;
5. storage authorization.

Roles are customer, consultant, case_operator, finance_operator, content_editor, and admin. Capabilities are checked rather than assuming every staff account is an administrator.

## Background work

The MVP needs a small database-backed job/outbox worker for:

- slot-hold expiry;
- transactional notifications and retries;
- retention/deletion tasks;
- malware-scan completion if asynchronous.

It may run as a second process from the same codebase. A queue cluster or message broker is not required initially. Jobs must be idempotent.

## Deployment

Recommended production topology:

- reverse proxy/TLS;
- Next.js/Payload web container;
- worker container from the same image;
- PostgreSQL with automated encrypted backups;
- private S3-compatible storage;
- external SMS/email provider;
- error monitoring and centralized logs.

Development may use Docker Compose for PostgreSQL and local object-storage emulation. Production documents must not be stored on the web container's local disk.

## Environments

- local: fake customer data and sandbox providers;
- staging: production-like access rules with synthetic documents;
- production: real providers, private storage, restricted staff access.

Each environment has separate database, bucket, secrets, and provider credentials.

## Reliability

- health endpoint checks application and database readiness without exposing details;
- transactional outbox prevents a successful state change from losing its notification job;
- idempotency keys protect repeated submissions;
- structured logs include request/correlation IDs, not document content;
- backups have a documented restore test;
- safe error pages never reveal stack traces or sensitive fields.

## Why not a separate NestJS backend now?

A separate backend would add API contracts, duplicated authentication context, CORS, two deployments, cross-service debugging, and more code before there is a second client or backend team. The module/application boundaries preserve an extraction path later without paying that cost in the MVP.