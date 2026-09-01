# Security model

BoldTrip processes passports, identity data, contact information, consultation details, and bank-transfer receipts. Security is a product requirement, not a final hardening task.

## Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | Published country pages, articles, public service descriptions | CDN/cache allowed |
| Internal | Draft content, operational notes, configuration | Staff capability required |
| Confidential | Customer profile, booking topic, request answers, payment state | Authenticated and resource-scoped |
| Highly sensitive | Passport scans/numbers, identity documents, receipts | Private storage, least privilege, access logging, retention limits |

Do not collect data merely because a future service might use it.

## Repository and secrets

- Change the repository to private before feature implementation.
- Never commit .env files, credentials, real transfer details, customer data, production exports, or real document samples.
- Commit a safe .env.example with variable names only.
- Use separate credentials for local, staging, and production.
- Rotate any credential that appears in source, logs, screenshots, tickets, or prompts.
- Branches and CI artifacts must not contain production documents.

## Authentication

Customers:

- recommended mobile OTP after provider confirmation;
- short-lived verification codes, rate limits, attempt limits, and replay protection;
- secure HTTP-only session cookies;
- verified recovery path;
- re-authentication before sensitive account changes.

Staff:

- unique named accounts; no shared admin login;
- strong password policy;
- 2FA before production;
- session timeout and revocation;
- restricted admin access where practical.

## Authorization

Capabilities:

| Capability | Customer | Consultant | Case operator | Finance | Editor | Admin |
|---|---:|---:|---:|---:|---:|---:|
| View own records | Yes | No | No | No | No | When required |
| Manage availability | No | Own | No | No | No | Yes |
| Review booking details | Own | Assigned | Limited | Payment only | No | Yes |
| Review case/documents | Own files only | No | Assigned | Receipt only | No | Yes |
| Confirm/reject payment | No | No | No | Yes | No | Yes |
| Publish content | No | No | No | No | Yes | Yes |
| Manage staff roles | No | No | No | No | No | Yes |

Every read and write applies:

1. authenticated actor;
2. collection access policy;
3. ownership/assignment/capability;
4. use-case state-transition permission;
5. resource-specific storage authorization.

Admin UI visibility is not authorization.

## Private document controls

- Separate private bucket/prefix from public marketing media.
- Deny anonymous list/read access.
- Use opaque random storage keys.
- Validate declared extension, detected MIME type, magic bytes, and size.
- Allow only approved formats such as PDF, JPEG, and PNG unless a service explicitly requires another type.
- Reject executables, archives, macros, and ambiguous polyglot files.
- Scan uploads for malware before staff/customer download.
- Quarantine files while scan status is pending or failed.
- Render previews through a controlled pipeline; never execute embedded content.
- Generate short-lived signed downloads only after authorization.
- Use Content-Disposition attachment and safe content types where possible.
- Log staff view/download events for highly sensitive files.
- Strip unnecessary image metadata if legally and operationally acceptable.
- Define deletion and legal-hold behavior before production.

## Sensitive fields

- Encrypt passport numbers and comparable identifiers at the application layer.
- Keep encryption keys outside the database.
- Do not put sensitive values in URLs, analytics, logs, notifications, filenames, or error messages.
- Mask identifiers in staff lists and customer summaries.
- Avoid free-text fields when structured data is sufficient.
- Private internal notes must never leak into customer-facing view models.

## Manual payment security

- Transfer instructions are admin-managed and snapshotted on payment creation.
- Only finance/admin roles may change instructions or review receipts.
- Changes to instruction sets and payment decisions are audited.
- The application clearly says receipt submitted or staff confirmed; it must not claim bank settlement verification.
- Amount, currency, recipient details, and payment reference are shown together to reduce mistakes.
- A rejected receipt requires a reason; prior versions remain auditable.
- Receipt files follow the same private storage and scanning controls as passports.
- Protect finance actions against CSRF, repeated submission, and stale state.

## Application controls

- Validate every external input on the server.
- Encode output and rely on React escaping; sanitize any approved rich text.
- CSRF protection for cookie-authenticated mutations.
- Rate-limit authentication, uploads, public forms, and expensive searches.
- Idempotency protection for request submission, slot holds, receipt submission, and payment review.
- Parameterized database operations only.
- Strict security headers: CSP, HSTS, frame restrictions, Referrer-Policy, and MIME sniffing protection.
- No stack traces or raw provider errors in production responses.
- Dependency updates and vulnerability scanning in CI.
- Limit upload body size at the reverse proxy and application.

## Booking and workflow integrity

- Create slot holds in a transaction.
- Enforce non-overlap in PostgreSQL.
- Use server time, not device time, for expiry.
- Workers processing expiry or notification jobs are idempotent.
- Check current state when staff acts; do not trust a stale admin screen.
- Store who changed state, when, from what state, to what state, and why.

## Infrastructure

- TLS everywhere.
- PostgreSQL is not publicly exposed.
- Least-privilege database and object-storage credentials.
- Encrypted backups with tested restore.
- Production bucket versioning/lifecycle policy where appropriate.
- Centralized structured logs with access controls and retention.
- Error monitoring scrubs request bodies, cookies, auth headers, and sensitive fields.
- Separate web and worker processes but the same reviewed application image.
- Production admin access should be restricted by additional network controls if operationally feasible.

## Privacy and retention

Before launch, the client must approve:

- lawful basis/consent for each data category;
- privacy notice and purpose of processing;
- retention periods for abandoned, rejected, completed, and cancelled records;
- customer correction/deletion request process;
- staff confidentiality obligations;
- backup retention and deletion limitations;
- third-party processor list for hosting, storage, SMS, email, monitoring, and malware scanning.

Automated retention jobs should mark, delete from object storage, and retain only minimal audit evidence according to policy.

## Audit and incident readiness

Audit at minimum:

- sign-in risk events and account suspension;
- staff role/permission changes;
- sensitive document view/download/delete;
- payment instruction and review changes;
- booking/request transitions;
- data export;
- retention deletion.

Create an incident runbook before production covering credential rotation, account disablement, storage lockdown, log preservation, customer/client notification decisions, recovery, and post-incident review.

## Security release gate

Production is blocked until:

- access-control integration tests pass;
- cross-customer object access tests pass;
- upload validation and malware flow pass;
- booking concurrency tests pass;
- finance permission/idempotency tests pass;
- secrets scan is clean;
- backup restore is demonstrated;
- privacy/retention configuration is approved;
- staff 2FA is enabled.