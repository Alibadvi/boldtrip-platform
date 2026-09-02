# BoldTrip Platform

RTL-first platform for visa information, consultation booking, embassy appointment requests, private document intake, and manual transfer receipt review.

## Stack

- Next.js App Router and TypeScript
- Payload CMS in the same application
- PostgreSQL
- Tailwind CSS with BoldTrip design tokens
- Vitest
- pnpm and Docker Compose

## Local setup

Requirements: Node.js 24.15+, pnpm 11, and Docker.

    cp .env.example .env
    docker compose up -d
    corepack enable
    pnpm install
    pnpm dev

Open:

- Website foundation: http://localhost:3000
- Payload administration: http://localhost:3000/admin

The first staff account created through Payload becomes the initial administrator.

## Project references

- docs/PRODUCT.md — MVP, routes, flows, and unresolved client questions
- docs/ARCHITECTURE.md — frontend/backend, DDD boundaries, data, and security
- docs/DESIGN_SYSTEM.md — visual and interaction system
- docs/ROADMAP.md — implementation sequence and current state
- AGENTS.md — coding and task rules

Never commit real customer documents, transfer details, credentials, or production data.
