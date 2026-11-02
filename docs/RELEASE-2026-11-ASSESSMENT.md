# Assessment and request-flow release

## Goal and scope

Implement the five prioritised items: a real free assessment, private submission controls,
service/country-specific pricing links through signup/login, consistent noindex for private
routes, and the official homepage Organization data. Preserve the existing editorial branch
(`feat/boldtrip-client-updates`) and the production database.

Done means successful typecheck/lint/unit checks, fresh-database migration and workflow tests,
desktop/mobile browser tests, and a tested production build. Production rollout additionally
requires the actual production schema/history, a restored backup rehearsal, configured upload
infrastructure, reviewed CMS routing and a live smoke test. Source completion alone is not deployment.

## Changes

- `/assessment` explains the process; `/assessment/apply` requires the separate customer session.
  Login/signup preserves the form destination before sensitive information is entered.
- The form collects contact information, WhatsApp, age, marital status, education, occupation,
  travel/refusal history, destination, visa type, budget, circumstances, optional documents and consent.
- Free assessments are regular tracked cases with a dedicated type, strict server validation,
  an admin queue, a customer-visible reply and no payment transitions. Existing case ownership
  and private document access apply. Optional upload failures retain the already-created case.
- Notifications contain only event names and record IDs. Role-scoped unread counts and links
  appear in admin for registrations, requests/assessments, bookings, documents, receipts and questions.
  Read/unread is shared by the team, not a per-staff inbox. These are in-app notifications, not email/webhooks.
- Pricing entries gain explicit form type, service and country relationships. Direct legacy form
  links are unwrapped safely. Generic signup/country links are no longer presented as working
  request buttons: unmatched entries offer support until an editor maps them. Existing prices
  and pricing records are preserved. Configure each published entry in Payload; do not guess
  country/service mappings from its marketing title.
- Auth/account/admin/form pages have aligned noindex/nofollow metadata and response headers.
  The sitemap includes published public records only. Robots allows auth pages to be crawled
  so their noindex can be read. Authentication and collection access remain separate controls.
- Homepage Organization uses the current official logo and CMS contact fields. No invented
  registered address, licence, LinkedIn or corporate registration details. JSON-LD escapes HTML.
- Database schema push is explicitly opt-in outside production. Automatic production startup
  migrations are removed. Normal app startup does not run schema changes.
- Uploads enforce size/type/signature checks, random filenames, ownership and per-account limits.
  Real production uploads fail closed unless private S3 and ClamAV are configured. Existing local
  files are retained; transfer them to matching private storage prefixes and test access before
  changing storage mode. No staff MFA settings or existing credentials are changed.

## Database changes

`20261102_055330_assessment_request_flows.ts` adds a request enum value, nullable assessment/reply
fields, optional pricing relationships and a new notifications table. It updates only the requested
homepage hero copy. It does not delete or recreate existing customers, cases, documents, payments,
countries or prices. Its down migration deliberately refuses to discard submitted information.

The prerequisite editorial migration is `20261010_072005_boldtrip_content_updates` from the preserved
client branch. Some live installations may already contain its tables without matching migration
history. Do not re-run historical CREATE TABLE migrations against those installations or mark them
as applied without comparing every relevant schema element on a restored copy.

## User-led deployment sequence

1. Record the cPanel application root, startup file, Node version, installed commit/release,
   storage mode and running cron/jobs. Do not print `.env`, database passwords or MFA keys.
2. Run `bash scripts/ops/db-preflight.sh` with the server's existing `DATABASE_URL` loaded securely.
   It uses read-only transactions and reports schema/history and aggregate record counts only.
   A missing table/history is evidence to reconcile, not permission to reset anything.
3. Stop the application and job writers for a consistent backup. Use the cPanel full-account backup
   if available; also use `backup-cpanel.sh` with the current absolute app root, a private backup
   directory outside all public web roots, and `BACKUP_QUIESCED=true`. The script saves a custom
   PostgreSQL dump, full application archive including environment/local files, and checksums.
   If S3 is enabled, separately back up its private bucket/version history. Copy the backup off-host
   securely. Do not leave backups under `public_html` or expose them through a download URL.
4. Restart the old application while rehearsing. Restore the database into a NEW isolated database;
   restore/copy files into an isolated directory/bucket. Never point staging at production files.
   Verify counts, login and authorised/foreign-owner downloads. `pg_restore --list` and checksums
   alone are not a successful restoration test.
5. Compare the restored schema with migration history and reconcile any old schema-push drift.
   Apply only pending reviewed migrations on this restored database. Run the customer/admin flows.
   Use only the reviewed release commit and keep `PAYLOAD_DB_PUSH=false`.
6. Configure private S3 and ClamAV, preserve existing local documents and receipts, copy them with
   their existing metadata filenames/prefixes and verify downloads before switching storage.
   Do not disable existing MFA or replace its encryption key to make a deployment start.
7. Prepare the new runtime in a sibling release directory. Keep production `.env` and uploaded
   files separate; do not extract a tarball over the active app. A standalone Next.js artifact alone
   cannot run TypeScript migration commands; use the included bundled migration runner after its
   staging rehearsal, or the exact source release in a separate environment with dependencies.
8. During the final maintenance window, stop writers, take a fresh verified backup, apply the
   rehearsed pending migrations, switch the cPanel application root to the new release and restart.
   Preserve the old release directory and secrets. If SQL fails, stop and inspect; never use
   `migrate:fresh`, `migrate:reset`, `DROP SCHEMA`, a seed script or development schema push.
9. Map published pricing entries to the real approved form/service/country in admin. Test guest
   signup, guest login and an existing login with a France service/embassy/consultation selection
   at mobile and desktop widths. Submit one approved synthetic assessment, verify tracking,
   response, private upload/download, unread notification and staff permissions. Remove synthetic
   records through an approved cleanup process after recording the result.
10. Check live `/robots.txt`, `/sitemap.xml`, auth X-Robots-Tag and rendered robots meta tags,
    including any Apache/CDN headers. Run Google Rich Results Test against the deployed homepage;
    local JSON validation does not count as running Google's tool or guarantee a Google display.

For an application rollback, switch back to the old release and retain the additive schema and
new submissions. Do not roll the database back underneath new customer activity. A backup restore
is disaster recovery and must account for all writes made after that backup.

## Separate work

The larger lottery, multilingual Travel to Iran, read-only agent API/webhooks, GA4/Search Console/
Bing account connections and full portal expansion are separate releases. This pass does not claim
those are complete or connected. It also does not set undocumented live account credentials or
invent an approved document-retention policy.
