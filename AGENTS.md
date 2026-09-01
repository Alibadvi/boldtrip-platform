# Working agreement

## Product

BoldTrip is an RTL-first service platform for visa information, consultation booking, embassy appointment requests, private document intake, and manual bank-transfer verification.

The product truth lives in docs/. Read only the documents relevant to the current task. Do not reinterpret the whole product on every change.

## Architecture

- One deployable Next.js App Router application.
- Payload CMS runs inside the same application and owns the admin panel, authentication, collections, access control, and migrations.
- PostgreSQL stores business data and file metadata.
- Private S3-compatible object storage stores customer documents and payment receipts.
- Business logic is organized as a pragmatic modular monolith under src/modules.
- Server Components render read-heavy pages. Mutations go through Server Actions or route handlers into application use cases.
- Browsers never connect directly to PostgreSQL or receive storage credentials.

## Module boundaries

Primary modules are catalog, scheduling, cases, documents, payments, identity, notifications, and content.

A module may depend on shared primitives and explicit ports. It must not import another module's infrastructure implementation. Cross-module work happens through an application service or a small published contract.

Use domain abstractions only where a business rule exists. Do not add BaseRepository, BaseService, generic managers, or placeholder layers.

## Expected source shape

    src/
      app/
      modules/
        <module>/
          domain/
          application/
          infrastructure/
          presentation/
      shared/
        domain/
        infrastructure/
        ui/
        validation/
      payload.config.ts
    tests/
      integration/
      e2e/

Not every folder must exist on day one. Add structure when working code needs it.

## Product rules

- Persian and RTL are the default for customer-facing screens.
- Customer accounts include bookings, service requests, documents, and manual payments.
- Manual payment means displaying admin-managed transfer instructions, accepting a receipt, and requiring staff confirmation.
- Customer documents are private. Never place them in public/, commit samples containing personal data, or expose permanent storage URLs.
- Visa information must support an official source URL and last-reviewed date.
- A booking slot cannot be active for two customers at the same time.
- State changes affecting bookings, requests, payments, documents, or access must be auditable.

## Engineering rules

- TypeScript strict mode.
- Validate external input on the server with Zod or Payload validation.
- Keep domain state transitions explicit and tested.
- Prefer small, domain-named components over generic configuration-driven UI.
- Do not put business decisions in React components.
- Do not bypass Payload access control for convenience.
- Add database constraints for invariants that must survive concurrent requests.
- Use migrations for schema changes; never edit production data manually.
- Keep secrets in environment variables and provide only safe placeholders in .env.example.
- Comments explain non-obvious decisions, not syntax.

## Verification

Each feature change must include the narrowest useful checks:

- unit tests for domain rules;
- integration tests for persistence, access control, and state transitions;
- Playwright tests for critical customer and staff journeys;
- lint, typecheck, and build before merge.

Exact commands will be added when the application foundation is created.

## Task protocol

Each task must state goal, relevant files, constraints, and done criteria. Work on one vertical slice at a time. Update docs/STATUS.md after meaningful progress and docs/DECISIONS.md when an architectural choice changes. Do not generate large unrelated scaffolds or rewrite files outside the task.