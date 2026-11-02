import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_admin_notifications_status" AS ENUM('unread', 'read');
  CREATE TYPE "public"."enum_pricing_entries_action_type" AS ENUM('legacy', 'assessment', 'consultation', 'embassy', 'service');
  ALTER TYPE "public"."enum_service_requests_request_type" ADD VALUE 'freeAssessment';
  CREATE TABLE "admin_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"target_collection" varchar NOT NULL,
  	"target_id" varchar NOT NULL,
  	"status" "enum_admin_notifications_status" DEFAULT 'unread' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pricing_entries" ALTER COLUMN "action_href" DROP DEFAULT;
  ALTER TABLE "homepage" ALTER COLUMN "hero_primary_action_label" SET DEFAULT 'ارزیابی رایگان شرایط و مدارک';
  ALTER TABLE "homepage" ALTER COLUMN "hero_primary_action_href" SET DEFAULT '/assessment/apply';
  ALTER TABLE "homepage" ALTER COLUMN "hero_title" SET DEFAULT 'ویزای تو در یک قدمی توست؛';
  ALTER TABLE "homepage" ALTER COLUMN "hero_accent" SET DEFAULT 'رؤیایت را همین امروز شروع کن.';
  ALTER TABLE "homepage" ALTER COLUMN "hero_description" SET DEFAULT 'ارزیابی اولیه شرایط و مدارکت در بولدتریپ رایگان است.';
  ALTER TABLE "service_requests" ADD COLUMN "assessment" jsonb;
  ALTER TABLE "service_requests" ADD COLUMN "customer_reply" varchar;
  ALTER TABLE "pricing_entries" ADD COLUMN "action_type" "enum_pricing_entries_action_type" DEFAULT 'legacy';
  ALTER TABLE "pricing_entries" ADD COLUMN "target_service_id" integer;
  ALTER TABLE "pricing_entries" ADD COLUMN "target_country_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admin_notifications_id" integer;
  UPDATE "homepage" SET "hero_title" = 'ویزای تو در یک قدمی توست؛',
    "hero_accent" = 'رؤیایت را همین امروز شروع کن.',
    "hero_description" = 'ارزیابی اولیه شرایط و مدارکت در بولدتریپ رایگان است.',
    "hero_primary_action_label" = 'ارزیابی رایگان شرایط و مدارک', "hero_primary_action_href" = '/assessment/apply';
  CREATE INDEX "admin_notifications_target_collection_idx" ON "admin_notifications" USING btree ("target_collection");
  CREATE INDEX "admin_notifications_status_idx" ON "admin_notifications" USING btree ("status");
  CREATE INDEX "admin_notifications_updated_at_idx" ON "admin_notifications" USING btree ("updated_at");
  CREATE INDEX "admin_notifications_created_at_idx" ON "admin_notifications" USING btree ("created_at");
  ALTER TABLE "pricing_entries" ADD CONSTRAINT "pricing_entries_target_service_id_services_id_fk" FOREIGN KEY ("target_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pricing_entries" ADD CONSTRAINT "pricing_entries_target_country_id_countries_id_fk" FOREIGN KEY ("target_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_notifications_fk" FOREIGN KEY ("admin_notifications_id") REFERENCES "public"."admin_notifications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pricing_entries_target_service_idx" ON "pricing_entries" USING btree ("target_service_id");
  CREATE INDEX "pricing_entries_target_country_idx" ON "pricing_entries" USING btree ("target_country_id");
  CREATE INDEX "payload_locked_documents_rels_admin_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_notifications_id");`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error(
    'This migration is forward-only: preserve assessments, replies and notifications. Roll back the application release while retaining the additive schema; use a verified backup only for disaster recovery.',
  )
}
