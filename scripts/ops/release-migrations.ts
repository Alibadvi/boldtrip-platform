import type { Migration } from 'payload'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { migrations as postgresMigrations } from '../../src/migrations'

// Payload's adapter-neutral Migration type accepts unknown; these are PostgreSQL migrations.
export const migrations: Migration[] = postgresMigrations.map((migration) => ({
  name: migration.name,
  up: (args: unknown) => migration.up(args as MigrateUpArgs),
  down: (args: unknown) => migration.down(args as MigrateDownArgs),
}))
