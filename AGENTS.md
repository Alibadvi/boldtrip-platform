# Working agreement

## Product

BoldTrip is an RTL-first service platform for visa information, consultation booking, embassy requests, private documents, customer accounts, and manual transfer receipt review.

Before changing behavior, read the relevant source:

- docs/PRODUCT.md for scope and flows;
- docs/ARCHITECTURE.md for module/data/security decisions;
- docs/DESIGN_SYSTEM.md for UI work;
- docs/ROADMAP.md for sequence and current state.

Do not reanalyse the entire repository for a focused task.

## Architecture

- One Next.js App Router application.
- Payload runs inside the same application and owns admin, collections, access control, and migrations.
- PostgreSQL stores business data and file metadata.
- Private S3-compatible storage will store customer documents.
- Business code is a pragmatic modular monolith under src/modules.
- Browsers never connect directly to PostgreSQL or receive storage credentials.

## Module rule

A module may contain domain, application, infrastructure, and presentation code when the feature needs those layers. Do not create empty layers for symmetry.

Presentation calls an application use case. Business decisions do not live in React components or Payload hooks alone. A module must not import another module's infrastructure implementation.

Avoid BaseRepository, BaseService, generic managers, and placeholder interfaces.

## Current boundaries

- identity
- catalog
- scheduling
- cases
- documents
- payments
- notifications
- content

Only identity exists in code today. Add another module when implementing its first real vertical slice.

## Engineering rules

- TypeScript strict mode.
- Validate external input on the server.
- Keep state transitions explicit and tested.
- Add PostgreSQL constraints for concurrency-critical invariants.
- Use Payload migrations for schema changes.
- Use Server Components by default and narrow Client Component boundaries.
- Use design tokens and shared UI primitives before adding one-off styles.
- Persian and RTL are default; isolate LTR identifiers explicitly.
- Customer files never enter public/, local production disk, logs, fixtures, screenshots, or prompts.
- Secrets belong in environment variables. .env.example contains placeholders only.
- Comments explain non-obvious decisions, not syntax.

## Verification

For the affected scope, run:

    pnpm typecheck
    pnpm lint
    pnpm test:unit
    pnpm build

Critical future flows also require integration and Playwright coverage.

## Task protocol

Every task states goal, relevant files, constraints, and done criteria. Implement one reviewable vertical slice at a time. Update docs/ROADMAP.md when the project state changes. Update the decision section in docs/ARCHITECTURE.md when an architectural choice changes.

Do not generate unrelated scaffolding or rewrite files outside the task.
