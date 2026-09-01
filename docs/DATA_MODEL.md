# Data model

This is the logical MVP model. Payload collection names and final SQL details are created during the foundation phase. All records use UUID-style IDs plus created_at and updated_at unless a stronger reason exists.

## Identity

### users

Payload auth collection for customers and staff.

Important fields:

- kind: customer or staff;
- mobile, email, verification timestamps;
- display_name;
- roles: consultant, case_operator, finance_operator, content_editor, admin;
- account_status: invited, active, suspended, closed;
- last_login_at.

Rules:

- mobile/email uniqueness is normalized;
- a customer cannot grant themselves staff roles;
- staff role changes are audited;
- sensitive auth data is never copied into domain collections.

### customer_profiles

- user_id, legal_name, preferred_name;
- mobile, email;
- locale and notification preferences;
- privacy_consent_version and accepted_at.

Do not collect passport fields globally unless multiple services actually need them. Case-specific identity belongs to the request/applicant.

## Catalog and content

### countries

- name_fa, name_en, slug, ISO code;
- summary, hero_media;
- publish_status, sort_order;
- official_source_url, last_reviewed_at, reviewed_by.

### visa_options

- country_id, name, slug, summary;
- audience/eligibility summary;
- requirements and process content;
- official_source_url, last_reviewed_at;
- publish_status.

Unique: country_id plus slug.

### services

- service_type: consultation, embassy_appointment, visa_service;
- country_id and visa_option_id when relevant;
- name, slug, summary, process content;
- pricing_mode: fixed or quotation;
- fixed_amount and currency when fixed;
- active_form_version_id;
- publish_status and sort_order.

### service_form_versions

- service_id, version;
- field schema and document requirement schema;
- status: draft, active, retired;
- activated_at, created_by.

This is versioned configuration for known forms, not a universal no-code workflow builder. A submitted request snapshots the version.

### consultation_types

- name, description;
- duration_minutes;
- amount and currency;
- cancellation_policy reference;
- active.

### articles, faqs, pages, media

Payload-managed editorial collections with publish workflow, SEO fields, author/reviewer metadata, and relationships to countries/services. Public and private media must use separate policies.

## Scheduling

### consultant_profiles

- staff_user_id;
- display_name and public bio;
- timezone;
- active.

### availability_rules

- consultant_id;
- weekday;
- local start/end time;
- effective date range;
- slot interval;
- active.

### availability_exceptions

- consultant_id;
- date/time range;
- type: unavailable or extra_availability;
- reason.

### bookings

- reference_number;
- customer_id, consultant_id, consultation_type_id;
- starts_at_utc, ends_at_utc;
- status;
- hold_expires_at;
- topic and customer note;
- amount_snapshot and policy_snapshot;
- confirmed_at, cancelled_at, cancellation_reason;
- completed_at;
- version for optimistic locking if required.

Critical database rule: active bookings for one consultant must not overlap. Implement with the appropriate PostgreSQL exclusion or partial constraint in a migration and use a transaction when creating a hold.

Indexes:

- consultant_id plus starts_at_utc;
- customer_id plus created_at;
- status plus hold_expires_at;
- unique reference_number.

## Cases

### service_requests

- reference_number;
- customer_id, service_id;
- service_type, country_id, visa_option_id snapshots/relations;
- form_version_id and form_schema_snapshot;
- status;
- pricing_mode;
- quoted_amount and currency;
- submitted_at, completed_at, cancelled_at;
- current_action and assigned_staff_id.

### request_applicants

- request_id;
- relationship: primary or dependent;
- legal names, birth date, nationality;
- passport fields required by the service;
- contact fields when different from account holder.

Passport numbers and similarly sensitive values should be encrypted at application level. If lookup is required, use a separate normalized keyed hash rather than plaintext search.

### request_answers

- request_id;
- form_version_id;
- validated answer payload;
- updated_at, submitted_at.

Answers are validated against the active service schema. After submission, changes happen through a defined correction/reopen flow and are audited.

### case_actions

- request_id;
- type: information_required, document_required, customer_response, internal_note;
- public_message and optional private_note;
- due_at;
- status: open, satisfied, cancelled;
- created_by and resolved_by.

### status_history

- entity_type and entity_id;
- from_status, to_status;
- actor_id, actor_type;
- reason;
- created_at.

Use for user-visible timelines where appropriate. Security audit events remain separate.

## Documents

### document_records

- customer_id;
- request_id or booking_id or payment_id;
- category and requirement_key;
- version;
- original_filename for display only;
- storage_key;
- detected_mime_type, size_bytes, checksum;
- scan_status: pending, clean, rejected, failed;
- review_status: pending, accepted, replacement_required;
- review_reason, reviewed_by, reviewed_at;
- supersedes_document_id;
- uploaded_at, deleted_at, retention_until.

Constraints:

- exactly one valid business purpose relation;
- storage_key unique;
- active version unique per requirement where the workflow requires one;
- deleted records cannot produce download links.

## Manual payments

### payment_instruction_sets

Admin-managed current transfer details:

- safe display label;
- card/account/IBAN fields approved for display;
- cardholder/account holder;
- support contact;
- active_from, active_to;
- created_by.

Changing current instructions never changes an existing payment.

### manual_payments

- reference_number;
- customer_id;
- booking_id or request_id;
- amount and currency;
- instruction_snapshot;
- status: pending_receipt, receipt_submitted, confirmed, rejected, expired;
- receipt_document_id;
- receipt_submitted_at;
- reviewed_by, reviewed_at, rejection_reason;
- correction_deadline;
- expires_at.

Constraints:

- exactly one payable relation: booking or request;
- one current payment attempt per payable unless a new attempt is explicitly created;
- amount becomes immutable after receipt submission;
- unique reference_number.

If multiple receipt attempts are required, use document versions and payment review history instead of overwriting the old receipt.

## Notifications and operations

### notification_outbox

- event_key, recipient_user_id;
- channel, template_key, locale;
- safe template variables;
- status, attempts, next_attempt_at;
- provider_message_id;
- idempotency_key;
- last_error_code.

Never place passport values, document URLs, or receipt images in notification payloads.

### audit_events

- actor_id and actor_type;
- action;
- resource_type and resource_id;
- result;
- request/correlation ID;
- safe metadata;
- IP/user-agent where legally approved;
- created_at.

Audit events cover access to sensitive documents, staff role changes, payment decisions, state transitions, exports, and deletion.

### system_settings

Use small, typed globals/collections for:

- business timezone;
- slot-hold duration;
- receipt correction window;
- transfer instruction selection;
- support contacts;
- upload size/type policy;
- retention periods;
- notification provider configuration references.

Secrets themselves remain environment-managed.

## Relationship summary

~~~mermaid
erDiagram
    USER ||--o{ BOOKING : creates
    USER ||--o{ SERVICE_REQUEST : submits
    SERVICE ||--o{ SERVICE_REQUEST : defines
    SERVICE_REQUEST ||--o{ DOCUMENT_RECORD : contains
    BOOKING ||--o| MANUAL_PAYMENT : requires
    SERVICE_REQUEST ||--o{ MANUAL_PAYMENT : requires
    MANUAL_PAYMENT ||--o{ DOCUMENT_RECORD : receives
~~~

## Migration and integrity policy

- Payload migrations are committed and reviewed.
- Database constraints back concurrency and ownership invariants.
- Destructive changes require a backup and explicit data migration.
- Status values are changed through application use cases.
- Production data is never used in tests, screenshots, fixtures, or AI prompts.