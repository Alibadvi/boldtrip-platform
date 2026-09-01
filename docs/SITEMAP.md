# Sitemap and route plan

Routes are proposed implementation paths. Persian labels are content-managed. The default customer-facing locale is RTL.

## Public website

| Route | Purpose | Main content owner |
|---|---|---|
| / | Positioning, featured countries/services, consultation CTA, trust content | Content editor |
| /countries | Search and filter published countries | Content editor |
| /countries/[country] | Country overview, visa options, official sources, reviewed date | Content editor |
| /countries/[country]/visas/[visa] | Eligibility summary, requirements, process, fees disclaimer, related service CTA | Content editor |
| /services | Service categories and comparison | Content editor |
| /services/[service] | Service details, requirements, process, price/quotation mode, start CTA | Content editor |
| /embassy-appointments | Supported countries and service explanation | Content editor |
| /embassy-appointments/[country] | Country-specific appointment process and request CTA | Content editor |
| /consultation | Consultation types, duration, price, policy, start CTA | Content editor / consultant |
| /consultation/book | Availability and booking wizard | Scheduling |
| /articles | Searchable article index | Content editor |
| /articles/[slug] | Article, author/reviewer, reviewed date, related services | Content editor |
| /faq | Categorized questions | Content editor |
| /about | Company and team information | Content editor |
| /contact | Verified contact channels and office details | Administrator |
| /privacy | Privacy and document-processing notice | Administrator |
| /terms | Terms of service | Administrator |
| /cancellation-policy | Booking cancellation/rescheduling policy | Administrator |

## Authentication

| Route | Purpose |
|---|---|
| /auth/sign-in | Customer sign-in |
| /auth/sign-up | Customer registration |
| /auth/verify | OTP or email verification |
| /auth/recover | Account recovery |
| /auth/sign-out | Server-side session termination |

Authentication route details depend on the final OTP/email decision.

## Customer account

| Route | Purpose |
|---|---|
| /account | Action-oriented overview |
| /account/bookings | Consultation bookings |
| /account/bookings/[reference] | Booking status, time, payment, policy, actions |
| /account/requests | Visa and embassy service requests |
| /account/requests/new/[service] | Guided request wizard |
| /account/requests/[reference] | Timeline, requirements, documents, payment, next action |
| /account/documents | Customer-owned document inventory and usage |
| /account/payments | Manual payment records |
| /account/payments/[reference] | Transfer instructions, amount, receipt upload, review status |
| /account/profile | Identity and contact details |
| /account/security | Sessions and account security |

Sensitive pages require an authenticated customer and resource-level ownership checks.

## Admin

Payload provides /admin. Collections and custom admin views cover:

- dashboard and action queues;
- countries, visas, services, articles, FAQ, pages, and SEO;
- customers and staff roles;
- consultants, availability rules, exceptions, and bookings;
- service requests, applicants, requirements, and status history;
- documents and document review;
- manual payments and receipt review;
- notifications and delivery failures;
- system settings and audit events.

Custom admin screens should be added only when standard Payload collection views cannot support the operational task efficiently.

## Navigation

Primary navigation:

- Countries
- Visa services
- Embassy appointments
- Consultation
- Articles
- About

Persistent actions:

- Start a request
- Book consultation
- Customer account

The mobile navigation must preserve the same information hierarchy rather than exposing every route.

## SEO and publishing rules

- Public content uses stable slugs, canonical URLs, metadata, and structured breadcrumbs.
- Draft or archived records never render publicly.
- Country and visa pages show last reviewed date and official source.
- Customer, admin, authentication, request, payment, and document routes are noindex.
- Deleting published content should normally create a redirect or archive state.