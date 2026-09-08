# Production handoff

This branch adds production integrations; it does not provision external accounts or certify a live deployment.

## Local development

Install with `pnpm install --no-frozen-lockfile`, then `pnpm generate:types`, `pnpm generate:importmap`, and `pnpm dev`. Local uploads remain supported. MFA is optional until enabled for a staff account; an enabled account always requires its authenticator or recovery code. Existing passwords still work at login; new/reset passwords require 12–128 characters.

## Server configuration

Use `.env.example` as the variable list. Keep real values outside Git. Production refuses startup without HTTPS, private S3 credentials, ClamAV, a verified Resend sender/API key, and enforced staff MFA with a separate random 32-byte hex encryption key. Back up the MFA key and Payload secret in a restricted secret manager; losing them can prevent recovery of sessions or authenticator secrets.

- Private S3: block public access, enable encryption and versioning, and restrict the app key to the configured bucket/prefixes. Use a separate off-site backup identity. The Payload S3 adapter authorizes file access before issuing a 60-second download URL. URLs are bearer credentials during that period.
- Existing local uploads must be copied into the bucket using matching `documents/` and `receipts/` prefixes before switching storage mode. Verify downloads on a staging copy first; changing the environment alone does not transfer existing files.
- ClamAV: set `CLAMD_HOST=clamav` with the supplied Compose file. Do not publish its port. Wait for signature initialization; unavailable or rejecting scanners fail uploads closed.
- Email: set `RESEND_API_KEY` and a domain-verified `EMAIL_FROM`. Send and open a real password-reset email in staging. Development logs do not expose reset tokens.
- MFA: generate `STAFF_MFA_ENCRYPTION_KEY` with `openssl rand -hex 32`. Run `pnpm staff:mfa --email=your-staff-address` from the trusted server terminal. Enter the displayed secret in an authenticator and confirm a code. Keep the one-use recovery codes offline. Enrollment invalidates existing staff sessions. First-admin creation or password recovery can use `BOOTSTRAP_STAFF_PASSWORD` supplied securely in the command environment. Never put it in shell history or Git. Staff password reset through the public API is disabled to avoid bypassing MFA.
- Set `STAFF_MFA_REQUIRED=true` before serving production traffic. Enroll all staff before enabling traffic.

## Database rollout

`src/migrations` now includes the operational tables and security fields that were missing from the old production migration history. For a new empty production database, use `pnpm payload migrate` before opening traffic. For a database previously managed with development schema push, **do not blindly apply these CREATE TABLE migrations**: restore a backup to staging and reconcile its migration history/schema first. Never reset the user's existing database to make migrations pass.

The migrations are generated but have not yet been applied to a database in this workspace. GitHub CI contains a disposable PostgreSQL integration job. A successful database migration and restoration drill remain launch gates.

## Hosting and operations

`deploy/compose.production.yml` provides the app, expiry worker, scanner and internal health monitoring. Supply a managed PostgreSQL URL; the file deliberately does not expose a database service. Put an HTTPS reverse proxy in front of localhost:3000, limit upload bodies to 11 MB, and rate-limit authentication/upload routes by client IP. The app also limits authentication attempts by account. Only trust forwarded client addresses from your own proxy.

Booking holds default to 60 minutes, capped at the session start. The worker expires unpaid holds every minute; receipts under review and paid reservations are retained. Expiry releases the unique slot reservation. Staff cancellations require a reason. Refunds are separate finance records: requested → approved → refunded, with a bank reference required for completion. Recording a refund does not move money. This version supports one full refund per receipt, not partial refunds.

`/health` checks application/database availability. Compose probes it; Prometheus evaluates availability/missing-monitor alerts. Connect Prometheus to your Alertmanager/notification receiver and add an external HTTPS monitor before launch. Alert delivery is **not configured** in the repository because no recipient/provider configuration was supplied. Request-error logs contain route templates and event IDs, not cookies, query strings or exception bodies. Database/storage/email/scanner dashboards and a real alert-delivery check are still needed.

## Backups and recovery

Install PostgreSQL client tools, restic and rclone on a restricted backup host. Initialize an encrypted off-site restic repository with a password file stored separately. Configure an rclone remote for the private bucket.

For a consistent snapshot, stop app and job writers while leaving PostgreSQL available, then run `bash scripts/ops/backup.sh` with DATABASE_URL, RESTIC_REPOSITORY, RESTIC_PASSWORD_FILE, BACKUP_S3_REMOTE and BACKUP_QUIESCED=true. The script dumps the database, copies objects, checksums the dump, creates an encrypted snapshot and checks the repository. Restart app/jobs afterward, even if backup fails. Schedule daily backups and alert on nonzero exit codes. No automatic pruning is included.

Restore a selected restic snapshot into an isolated directory. Create an empty database named `boldtrip_restore`; run `bash scripts/ops/restore-drill.sh` with RESTORE_DATABASE_URL and RESTORE_DIRECTORY pointing to the restored dump directory. The script refuses nonempty databases, checks the checksum, restores with errors fatal and reads core tables. Restore objects into a separate private bucket and verify customer/admin login, a sample authorized download and foreign-owner denial. Record the restoration time and result. No real backup/restore was performed in this workspace.

## Verification status

Payload types and import map were regenerated. TypeScript compilation, ESLint (zero errors) and all 15 unit tests passed locally; database integration tests are supplied for CI. Production build, live PostgreSQL concurrency, S3/scanner/email delivery, MFA enrollment, monitoring alerts and recoverable backups must pass before calling this production-ready. The current push is a review branch, not a live deployment.
