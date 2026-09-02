# Product

## Outcome

BoldTrip allows a Persian-speaking customer to:

1. read reviewed visa and embassy-service information;
2. create an account;
3. reserve a consultation from real availability;
4. submit an embassy or visa-service request;
5. upload private documents;
6. view manual transfer instructions and upload a receipt;
7. track bookings, requests, documents, and payment status.

Staff complete the corresponding work through Payload admin.

## MVP

| Area | Included |
|---|---|
| Public content | Home, countries, visa details, services, embassy information, articles, FAQ, about, contact, legal pages |
| Consultation | Types, availability, time selection, slot hold, manual payment, confirmation/cancellation |
| Requests | Guided service form, draft, document checklist, submission, staff review, status timeline |
| Customer account | Bookings, requests, documents, payments, profile, current actions |
| Payments | Transfer-detail snapshot, expected amount, private receipt upload, staff confirmation/rejection |
| Admin | Content, staff, availability, bookings, requests, documents, payments, settings |
| Operations | Notifications adapter, audit events, retention, backup/restore, error monitoring |

Primary service paths:

- consultation;
- embassy appointment request;
- visa service request.

## Not in the MVP

- payment gateway or bank verification;
- shopping cart;
- AI eligibility/legal advice;
- no-code workflow builder;
- native mobile app;
- B2B/CRM portal;
- live chat;
- automatic embassy-site booking;
- multilingual content unless separately approved;
- accounting integration.

## Routes

Public:

    /
    /countries
    /countries/[country]
    /countries/[country]/visas/[visa]
    /services
    /services/[service]
    /embassy-appointments
    /embassy-appointments/[country]
    /consultation
    /consultation/book
    /articles
    /articles/[slug]
    /faq
    /about
    /contact
    /privacy
    /terms
    /cancellation-policy

Customer:

    /auth/*
    /account
    /account/bookings
    /account/bookings/[reference]
    /account/requests
    /account/requests/new/[service]
    /account/requests/[reference]
    /account/documents
    /account/payments
    /account/payments/[reference]
    /account/profile
    /account/security

Staff use /admin.

## Main flows

### Consultation

Consultation type → sign in → server-generated availability → temporary slot hold → customer details → transfer instructions → receipt upload → finance review → confirmed booking.

If no receipt arrives before the configurable hold expiry, the slot is released. Browser availability is advisory; the database is authoritative.

### Embassy or visa request

Country/service → sign in → guided form → document upload → review and consent → submit → fixed price or quotation → transfer instructions → receipt review → processing → completed.

The platform manages the request. It does not automatically book against embassy websites.

### Document correction

Staff requests replacement with a reason → customer sees the next action → customer uploads a new version → staff reviews it. Old metadata remains auditable according to retention policy.

## Business rules

- Published visa information has an official source and last-reviewed date.
- Customers only see their own records and files.
- Transfer instructions and prices are admin-managed and snapshotted.
- Payment status means staff-confirmed receipt, not bank settlement.
- Active consultation bookings cannot overlap for one consultant.
- Important state changes record actor, time, old state, new state, and reason.
- Customer documents are private and deleted according to approved retention.
- The account dashboard prioritizes next actions, not vanity charts.

## Open client decisions

These must be answered before their feature begins:

1. Exact launch countries, visa categories, and services.
2. One or multiple consultants.
3. Customer authentication: mobile OTP is recommended; provider is unselected.
4. Consultation duration, working hours, timezone, holidays, hold time, cancellation, rescheduling, refund, and no-show rules.
5. Fixed-price versus quotation services.
6. Required fields and documents for each service.
7. Receipt review SLA and correction window.
8. Passport/document retention and deletion policy.
9. Hosting, storage, SMS, email, monitoring, and malware-scan providers.
10. Persian-only MVP confirmation.
11. Final SVG logo, licensed imagery/font, and approved Persian copy.
12. Staff roles and assignment rules.
13. Approved transfer/contact details supplied through configuration, never source code.
