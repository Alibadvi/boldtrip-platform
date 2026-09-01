# Product scope

Status: proposed for client confirmation  
Phase: MVP / first production release  
Default language: Persian, RTL

## Product outcome

BoldTrip lets a customer understand visa and embassy services, reserve a consultation from real availability, submit a service request and private documents, receive manual transfer instructions, upload a receipt, and track the result from an account. Staff manage content and operational work from one admin application.

This is not a payment-gateway product and it is not a full immigration CRM.

## Users

| Persona | Primary need |
|---|---|
| Visitor | Compare countries, visa options, requirements, and services |
| Customer | Book, submit information, upload documents, pay manually, and track progress |
| Consultant | Manage availability and consultation bookings |
| Case operator | Review requests, request corrections, manage documents, and update status |
| Finance operator | Review transfer receipts and confirm or reject payment |
| Content editor | Maintain countries, visas, services, articles, FAQ, and SEO |
| Administrator | Configure staff access, business settings, and audit records |

One staff member may hold several roles in a small team.

## MVP capabilities

| Area | Included |
|---|---|
| Public content | Home, country list, country/visa details, services, embassy appointment information, articles, FAQ, about, contact, legal pages |
| Consultation | Consultation types, admin-managed availability, date/time selection, temporary slot hold, customer details, manual payment, receipt review, confirmation/cancellation |
| Service requests | Country/service selection, service-specific guided form, draft saving, document checklist, submission, manual payment, progress tracking |
| Customer account | Profile, bookings, requests, documents, payments, notifications, sign-out |
| Documents | Private upload, type and size validation, ownership checks, staff review, replacement request, short-lived download links |
| Manual payments | Admin-managed card/account instructions, exact expected amount, receipt upload, staff confirmation/rejection, status history |
| Admin | Payload admin for content, customers, availability, bookings, requests, documents, payments, staff roles, and settings |
| Notifications | Transactional email or SMS through an adapter for verification, submission, payment review, booking confirmation, and required corrections |
| Operations | Audit trail, structured logs, error reporting, backup and restore procedure |

## Primary service types

1. Consultation booking.
2. Embassy appointment request.
3. Visa service request.

The data model supports more service categories later, but the MVP should implement and test these three paths rather than a universal workflow builder.

## Explicitly out of scope

- Online payment gateway, callback verification, wallets, or installment payments.
- Shopping cart and multi-service checkout.
- AI eligibility decisions or legal advice generation.
- A fully dynamic no-code form builder.
- Native mobile applications.
- B2B partner portal.
- Advanced CRM, sales pipeline, or call-center tooling.
- Live chat and internal messaging.
- Automatic embassy appointment booking against third-party websites.
- Multiple languages unless separately approved.
- Automated visa rule updates.
- Accounting integration or tax invoice automation.
- Marketing automation beyond transactional notifications.

## Business rules

- Published visa content includes an official source link and last-reviewed date.
- Prices and transfer instructions are controlled by authorized staff, not hard-coded in the UI.
- A customer sees only their own requests, bookings, documents, and payments.
- A slot hold expires after a configurable period when no receipt is submitted.
- Once a receipt is submitted before expiry, the booking/request waits for staff review without losing its place.
- Payment confirmation is manual and does not claim bank verification.
- Rejected receipts include a reason and a defined correction window.
- Booking collisions are prevented by a database constraint and transaction, not frontend checks.
- Request and payment state transitions are append-only in history even when the current status changes.
- Files are never public and are deleted according to the approved retention policy.

## Definition of MVP complete

The MVP is complete when a Persian-speaking customer can:

1. find a country and read current visa/service information;
2. create and verify an account;
3. reserve an available consultation without double booking;
4. submit an embassy or visa service request with required documents;
5. view transfer instructions and upload a receipt;
6. see payment and case status in their account;
7. respond to a document correction request;

and authorized staff can complete every corresponding operation from the admin panel with an audit record.

## Assumptions awaiting client confirmation

- Exact launch countries and visa categories.
- One or multiple consultants.
- Customer authentication method: recommended mobile OTP; email remains a recovery/notification channel.
- Consultation duration, price, working hours, holidays, cancellation, rescheduling, refund, and no-show rules.
- Which services have fixed prices and which require staff quotation.
- Whether documents are collected before or after an initial staff review.
- Required fields and document checklist for each service.
- Receipt review SLA and rejected-receipt correction window.
- Retention period for rejected, completed, and abandoned cases.
- SMS/email providers, hosting provider, and object storage provider.
- Final legal text, privacy consent, and authorization to process passport data.
- Final brand assets, licensed fonts, and approved Persian copy.

Until these are confirmed, implementation must use configuration and safe placeholders, not invented business facts.