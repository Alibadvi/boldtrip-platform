#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${DATABASE_URL:?Load DATABASE_URL securely}"
: "${BOLDTRIP_APP_ROOT:?Set the current absolute application directory}"
: "${BOLDTRIP_BACKUP_ROOT:?Set a private directory outside the application and public web root}"
[ "${BACKUP_QUIESCED:-false}" = true ] || { echo 'Stop the Node app and cron/job writers first, then set BACKUP_QUIESCED=true.' >&2; exit 1; }
app_root=$(realpath "$BOLDTRIP_APP_ROOT")
mkdir -p "$BOLDTRIP_BACKUP_ROOT"
backup_root=$(realpath "$BOLDTRIP_BACKUP_ROOT")
case "$backup_root/" in "$app_root/"*) echo 'Backup directory must be outside the application.' >&2; exit 1 ;; esac
backup_dir=$(mktemp -d "$backup_root/boldtrip-$(date -u +%Y%m%dT%H%M%SZ)-XXXXXX")
chmod 700 "$backup_dir"
pg_dump --dbname="$DATABASE_URL" --format=custom --no-owner --no-acl --file="$backup_dir/database.dump"
pg_restore --list "$backup_dir/database.dump" > "$backup_dir/database-contents.txt"
tar -czf "$backup_dir/application.tar.gz" -C "$app_root" .
tar -tzf "$backup_dir/application.tar.gz" >/dev/null
(cd "$backup_dir" && sha256sum database.dump application.tar.gz > SHA256SUMS && sha256sum -c SHA256SUMS)
echo "Backup saved to $backup_dir"
echo 'This includes environment secrets and local uploads. Keep private; copy off-host securely. Back up the private object bucket separately if S3 is enabled. Restore the dump into an isolated database before rollout.'
