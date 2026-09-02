# Design system specification

Status: direction approved for Phase 0; brand assets and final Persian copy still required.

## Design intent

BoldTrip should feel calm, capable, and human. Immigration services already create anxiety; the interface must reduce uncertainty with clear next actions, visible status, and restrained visual emphasis.

The brand can use purple, lilac, and yellow without turning every screen into a gradient advertisement.

Principles:

1. Trust before decoration.
2. One obvious primary action per section.
3. Explain the next step and required information before asking for it.
4. Use real status language instead of internal codes.
5. Public pages may be expressive; forms, accounts, and admin screens remain quiet.
6. Mobile and RTL behavior are designed first, not patched later.

## Brand foundations

Final logo must be supplied as SVG with transparent background. Do not trace a low-resolution image or use a black-background logo asset in production.

### Color tokens

Proposed starting palette:

| Token | Value | Use |
|---|---|---|
| brand-950 | #24133F | Deep headings, footer |
| brand-800 | #3D226F | Strong brand surfaces |
| brand-700 | #4D2A96 | Hover/pressed |
| brand-600 | #5B34C4 | Primary actions with white text |
| brand-500 | #7048D7 | Illustration/detail |
| brand-100 | #EAE3FF | Selected/soft brand surface |
| brand-50 | #F7F4FF | Page tint |
| accent-500 | #F5B82E | Highlights, badges, illustration |
| accent-100 | #FFF2C9 | Soft accent surface |
| ink-950 | #17131F | Primary text |
| ink-700 | #4A4552 | Secondary text |
| ink-500 | #74707C | Muted text |
| border | #E5E1EA | Default border |
| surface | #FFFFFF | Cards, forms |
| canvas | #FBFAFD | App background |
| success | #18794E | Confirmed/success |
| warning | #A15C00 | Attention/pending |
| danger | #B42318 | Destructive/error |
| info | #175CD3 | Neutral information |

Rules:

- brand-600 plus white is the default primary button pairing.
- Yellow is an accent, not a body-text color and not the main submit button.
- Semantic colors always include icon/text, never color alone.
- Validate contrast in implementation; adjust tokens rather than weakening accessibility.
- Gradients are limited to hero/brand artwork and never sit behind long text or forms.

### Typography

Recommended licensed/open setup:

- Persian/Arabic: Vazirmatn, locally hosted, weights 400, 500, 600, 700.
- Latin/numbers fallback: Inter or system sans.
- Use tabular numerals for references, money, and dates where supported.

| Style | Mobile | Desktop | Weight | Line height |
|---|---:|---:|---:|---:|
| Display | 40px | 64px | 700 | 1.15 |
| H1 | 34px | 48px | 700 | 1.2 |
| H2 | 28px | 38px | 700 | 1.25 |
| H3 | 23px | 28px | 600 | 1.35 |
| Title | 19px | 21px | 600 | 1.45 |
| Body | 16px | 16px | 400 | 1.8 |
| Small | 14px | 14px | 400 | 1.7 |
| Label | 14px | 14px | 600 | 1.5 |

Persian body text needs generous line height. Do not shrink form text below 16px on mobile.

## Spatial system

- Base unit: 4px.
- Main spacing steps: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Content max width: 1200px.
- Reading column: 680–760px.
- Form column: 640–720px.
- Mobile gutters: 16px; tablet: 24px; desktop: 32px.
- Section spacing: 64px mobile, 96px desktop unless the information hierarchy needs less.

### Shape and elevation

- Input/control radius: 10px.
- Card radius: 16px.
- Feature/hero panel radius: 24px.
- Pills only for tags, filters, and compact statuses.
- Default shadow: subtle and low spread; borders define most form and account surfaces.
- Avoid glassmorphism in forms, tables, modal dialogs, and admin UI.

## Direction and layout

- HTML direction is RTL for Persian pages.
- Use CSS logical properties: margin-inline, padding-inline, inset-inline.
- Chevron, progress, and back/forward icons follow reading direction.
- Email, URLs, passport/reference values, and card/account numbers render LTR within an RTL context.
- Mixed-direction values must be tested, not visually guessed.
- Dates show the approved Persian/Gregorian format while storage remains UTC.

## Core components

### Navigation

- Desktop header with logo, six or fewer primary items, account action, and one main CTA.
- Mobile navigation uses a compact sheet/drawer, readable labels, and closes only after successful navigation.
- Breadcrumbs for country, visa, article, and service depth.
- Account navigation becomes a compact top section or drawer on small screens.

### Actions

Button variants:

- primary: high-emphasis next/submit action;
- secondary: outlined neutral action;
- quiet: low-emphasis inline action;
- danger: destructive action with confirmation where needed.

Loading disables repeated submission and keeps the action label understandable. Icon-only controls require an accessible name.

### Forms

- Label remains visible above every field.
- Help text appears before an error; error appears adjacent to the field.
- Required fields are explained at form start and marked consistently.
- Validate on blur/submit, not aggressively on every keystroke.
- Preserve valid input after server errors.
- Long flows use named steps, progress, save draft, and review.
- Before passport upload, explain accepted formats, size, privacy, and why it is needed.
- File upload shows filename, size, scan/review status, replace, and remove actions.
- A summary screen masks sensitive identifiers before final submission.

### Calendar and time selection

- Month and date navigation is keyboard accessible.
- Unavailable dates are disabled with an explanation.
- Time slots are separate tap targets with timezone stated.
- Selection is not confirmation; the UI explains temporary hold and expiry.
- If a server collision occurs, return the customer to refreshed availability with a clear message.

### Status

Use plain Persian labels with icon and semantic tone:

- action required;
- under review;
- awaiting receipt;
- receipt under review;
- confirmed;
- completed;
- rejected/cancelled.

Every status card also states the next action or what happens next.

### Cards and content

- Country card: name, concise service availability, optional flag/illustration, clear link.
- Service card: outcome, suitable audience, price or quotation label, duration if relevant.
- Trust card: verified statement only; no invented counters or testimonials.
- Article card: title, summary, reviewed/published date, topic.
- Requirement list: grouped as required, conditional, and later-stage.

### Feedback and overlays

- Toasts acknowledge lightweight actions but do not carry critical instructions.
- Inline banners explain payment rejection, missing documents, or expired holds.
- Dialogs are reserved for destructive or irreversible actions.
- Empty states explain why the page is empty and offer a valid next action.
- Skeletons match the actual layout; avoid decorative loading noise.

## Page patterns

### Home

1. Compact header.
2. Clear value proposition and two actions: explore services, book consultation.
3. Supported countries.
4. Main service paths.
5. How the process works.
6. Trust and privacy explanation.
7. Consultation CTA.
8. Useful articles/FAQ.
9. Footer with legal and verified contacts.

One restrained 3D/illustrated brand moment may appear in the hero. It must not delay the main content or cause layout shift.

### Country/visa detail

- breadcrumb and title;
- reviewed date and official source;
- summary and suitability;
- requirements;
- process/timeline;
- costs disclaimer;
- related services;
- FAQ;
- sticky mobile CTA where useful.

Do not imply guaranteed approval.

### Guided request

- step title and short purpose;
- progress indicator;
- one coherent group of fields per step;
- autosaved draft state;
- Back and Continue;
- review/consent before submission;
- reference and next step after submission.

### Customer account

The dashboard is action-first:

- items needing attention;
- upcoming booking;
- active requests;
- recent payment/document updates;
- support route.

Avoid vanity charts. The customer needs clarity, not a fake analytics dashboard.

### Admin

Use Payload defaults for predictable CRUD. Custom views should focus on queues: receipt review, missing documents, upcoming consultations, expired holds, and stale requests. Admin visuals prioritize density and status clarity over brand decoration.

## Motion

- Default duration: 160–240ms.
- Use opacity/transform for small transitions.
- Respect prefers-reduced-motion.
- Page transitions must not delay navigation.
- No scroll-jacking, continuous marquees, or heavy 3D on operational routes.
- Celebration is limited to meaningful completion and never blocks the next step.

## Accessibility baseline

- Target WCAG 2.2 AA.
- Keyboard access and visible focus for every interactive control.
- Correct headings, landmarks, labels, error summaries, and live regions.
- Minimum 44px mobile tap target where practical.
- Do not rely on placeholder text as a label.
- Announce upload, validation, hold expiry, and status changes.
- Test RTL with screen readers and keyboard navigation.
- Respect zoom and text scaling at 200%.

## Content voice

- Direct, calm, specific Persian.
- State what BoldTrip does and does not do.
- Replace legal/technical status codes with user language.
- Avoid guarantees, fear-based marketing, fake urgency, fake statistics, and generic AI copy.
- Every important instruction answers: what is needed, why, when, and what happens next.

## Design acceptance checklist

Before a screen is accepted:

- RTL and mixed-direction values are correct;
- mobile 360px and desktop layouts work;
- empty, loading, error, disabled, and success states exist;
- focus and keyboard order are correct;
- text contrast passes;
- no invented business copy/data remains;
- sensitive data is masked where appropriate;
- the primary next action is obvious;
- the screen uses approved tokens rather than one-off colors/spacing.