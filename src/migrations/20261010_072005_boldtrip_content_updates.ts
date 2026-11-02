import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pricing_entries_kind" AS ENUM('visa', 'embassy', 'appeal', 'other');
  CREATE TYPE "public"."enum_country_questions_status" AS ENUM('pending', 'answered', 'published', 'rejected');
  CREATE TABLE "pricing_entries" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar,
    "price_label" varchar,
    "official_cost_note" varchar,
    "country_code" varchar,
    "kind" "enum_pricing_entries_kind" DEFAULT 'other' NOT NULL,
    "action_href" varchar DEFAULT '/sign-up?next=/countries',
    "sort_order" numeric DEFAULT 100,
    "published" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "articles" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "summary" varchar NOT NULL,
    "featured_image_url" varchar,
    "body" varchar NOT NULL,
    "category" varchar NOT NULL,
    "related_country_id" integer,
    "official_source_url" varchar,
    "last_reviewed_at" timestamp(3) with time zone,
    "meta_title" varchar,
    "meta_description" varchar,
    "published" boolean DEFAULT false,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "country_questions" (
    "id" serial PRIMARY KEY NOT NULL,
    "first_name" varchar NOT NULL,
    "contact" varchar NOT NULL,
    "question" varchar NOT NULL,
    "country_id" integer NOT NULL,
    "consent" boolean DEFAULT false NOT NULL,
    "status" "enum_country_questions_status" DEFAULT 'pending' NOT NULL,
    "answer" varchar,
    "answered_at" timestamp(3) with time zone,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "contact_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "instagram" varchar DEFAULT 'boldtrip.visa' NOT NULL,
    "phone" varchar DEFAULT '+989104787878' NOT NULL,
    "whatsapp" varchar DEFAULT '+989104787878' NOT NULL,
    "telegram" varchar DEFAULT 'boldtrip4444' NOT NULL,
    "email" varchar DEFAULT 'boldtrip4444@gmail.com' NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pricing_entries_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "articles_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "country_questions_id" integer;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_related_country_id_countries_id_fk" FOREIGN KEY ("related_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "country_questions" ADD CONSTRAINT "country_questions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pricing_entries_updated_at_idx" ON "pricing_entries" USING btree ("updated_at");
  CREATE INDEX "pricing_entries_created_at_idx" ON "pricing_entries" USING btree ("created_at");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_related_country_idx" ON "articles" USING btree ("related_country_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "country_questions_country_idx" ON "country_questions" USING btree ("country_id");
  CREATE INDEX "country_questions_updated_at_idx" ON "country_questions" USING btree ("updated_at");
  CREATE INDEX "country_questions_created_at_idx" ON "country_questions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_entries_fk" FOREIGN KEY ("pricing_entries_id") REFERENCES "public"."pricing_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_country_questions_fk" FOREIGN KEY ("country_questions_id") REFERENCES "public"."country_questions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pricing_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("pricing_entries_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_country_questions_id_idx" ON "payload_locked_documents_rels" USING btree ("country_questions_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pricing_entries_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_articles_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_country_questions_fk";

  DROP INDEX "payload_locked_documents_rels_pricing_entries_id_idx";
  DROP INDEX "payload_locked_documents_rels_articles_id_idx";
  DROP INDEX "payload_locked_documents_rels_country_questions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pricing_entries_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "articles_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "country_questions_id";
  DROP TABLE "pricing_entries" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "country_questions" CASCADE;
  DROP TABLE "contact_settings" CASCADE;
  DROP TYPE "public"."enum_pricing_entries_kind";
  DROP TYPE "public"."enum_country_questions_status";`)
}
