#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${DATABASE_URL:?Set DATABASE_URL}"
: "${RESTIC_REPOSITORY:?Set an off-site RESTIC_REPOSITORY}"
: "${RESTIC_PASSWORD_FILE:?Set RESTIC_PASSWORD_FILE}"
: "${BACKUP_S3_REMOTE:?Set an rclone remote pointing to the private upload bucket}"
if [ "${BACKUP_QUIESCED:-false}" != true ]; then
  echo 'Stop app and job writers first; then set BACKUP_QUIESCED=true.' >&2
  exit 1
fi
backup_workdir=$(mktemp -d)
trap 'rm -rf "$backup_workdir"' EXIT
pg_dump --dbname="$DATABASE_URL" --format=custom --no-owner --no-acl --file="$backup_workdir/database.dump"
rclone copy "$BACKUP_S3_REMOTE" "$backup_workdir/objects" --quiet
(cd "$backup_workdir" && sha256sum database.dump > database.sha256)
restic backup "$backup_workdir" --tag boldtrip --host boldtrip --json
restic check
# No automatic prune: retain recovery points until a separate restore drill succeeds.
