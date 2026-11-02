#!/usr/bin/env bash
set -euo pipefail
umask 077
: "${DATABASE_URL:?Load DATABASE_URL from the existing server environment without printing it}"
export PGOPTIONS="${PGOPTIONS:-} -c default_transaction_read_only=on -c statement_timeout=15000"
psql --no-psqlrc "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
BEGIN READ ONLY;
SELECT version();
SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
SELECT table_name, column_name, data_type FROM information_schema.columns
WHERE table_schema='public' AND table_name IN ('staff','customers','service_requests','customer_documents','payment_receipts','pricing_entries','admin_notifications','payload_migrations') ORDER BY table_name,ordinal_position;
SELECT name, batch FROM payload_migrations ORDER BY id;
SELECT 'staff' AS collection, count(*) AS records FROM staff
UNION ALL SELECT 'customers', count(*) FROM customers
UNION ALL SELECT 'service_requests', count(*) FROM service_requests
UNION ALL SELECT 'customer_documents', count(*) FROM customer_documents
UNION ALL SELECT 'payment_receipts', count(*) FROM payment_receipts;
COMMIT;
SQL
