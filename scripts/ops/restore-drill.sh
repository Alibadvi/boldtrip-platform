#!/usr/bin/env bash
set -euo pipefail
: "${RESTORE_DATABASE_URL:?Set URL of a NEW isolated recovery database}"
: "${RESTORE_DIRECTORY:?Set directory containing database.dump and database.sha256}"
case "$RESTORE_DATABASE_URL" in
  */boldtrip_restore|*/boldtrip_ci_restore) ;;
  *) echo 'Use a new database named boldtrip_restore or boldtrip_ci_restore.' >&2; exit 1 ;;
esac
(cd "$RESTORE_DIRECTORY" && sha256sum -c database.sha256)
existing=$(psql "$RESTORE_DATABASE_URL" -Atc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")
[ "$existing" = 0 ] || { echo 'Recovery database is not empty; refusing overwrite.' >&2; exit 1; }
pg_restore --dbname="$RESTORE_DATABASE_URL" --no-owner --no-acl --exit-on-error "$RESTORE_DIRECTORY/database.dump"
psql "$RESTORE_DATABASE_URL" -v ON_ERROR_STOP=1 -c 'SELECT count(*) FROM staff; SELECT count(*) FROM service_requests; SELECT count(*) FROM audit_events;'
echo 'Database restored. Restore objects to a separate private bucket and verify sample authorized downloads before approving the recovery point.'
