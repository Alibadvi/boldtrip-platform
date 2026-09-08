import type { MigrateUpArgs, MigrateDownArgs} from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_refunds_status" AS ENUM('requested', 'approved', 'rejected', 'refunded');
  CREATE TYPE "public"."enum_services_kind" AS ENUM('visa', 'embassyAppointment', 'consultation', 'documentReview');
  CREATE TYPE "public"."enum_services_pricing_mode" AS ENUM('fixed', 'quotation');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_kind" AS ENUM('visa', 'embassyAppointment', 'consultation', 'documentReview');
  CREATE TYPE "public"."enum__services_v_version_pricing_mode" AS ENUM('fixed', 'quotation');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_service_requests_request_type" AS ENUM('service', 'embassyAppointment');
  CREATE TYPE "public"."enum_service_requests_status" AS ENUM('submitted', 'needsDocuments', 'underReview', 'quoted', 'awaitingPayment', 'paymentReview', 'inProgress', 'completed', 'rejected', 'cancelled');
  CREATE TYPE "public"."enum_customer_documents_kind" AS ENUM('passport', 'identity', 'photo', 'financial', 'application', 'other');
  CREATE TYPE "public"."enum_customer_documents_status" AS ENUM('pending', 'accepted', 'rejected');
  CREATE TYPE "public"."enum_consultation_slots_delivery_method" AS ENUM('video', 'phone', 'inPerson');
  CREATE TYPE "public"."enum_consultation_bookings_status" AS ENUM('awaitingPayment', 'paymentReview', 'confirmed', 'cancelled', 'expired', 'completed');
  CREATE TYPE "public"."enum_payment_receipts_payable_type" AS ENUM('serviceRequest', 'consultation');
  CREATE TYPE "public"."enum_payment_receipts_status" AS ENUM('pending', 'approved', 'rejected');
  CREATE TYPE "public"."enum_consultation_page_delivery_method" AS ENUM('video', 'phone', 'inPerson');
  CREATE TABLE "refunds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"receipt_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"reason" varchar NOT NULL,
  	"status" "enum_refunds_status" DEFAULT 'requested' NOT NULL,
  	"bank_reference" varchar,
  	"refunded_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" varchar NOT NULL,
  	"target_collection" varchar NOT NULL,
  	"target_id" varchar NOT NULL,
  	"actor" varchar NOT NULL,
  	"from_status" varchar,
  	"to_status" varchar,
  	"changed_fields" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "auth_rate_limits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"hits" numeric NOT NULL,
  	"window_started_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "countries_embassy_appointment_required_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "countries_embassy_appointment_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "countries_embassy_appointment_important_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_countries_v_version_embassy_appointment_required_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_countries_v_version_embassy_appointment_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_countries_v_version_embassy_appointment_important_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"kind" "enum_services_kind",
  	"summary" varchar,
  	"description" varchar,
  	"pricing_mode" "enum_services_pricing_mode" DEFAULT 'quotation',
  	"price_amount" numeric,
  	"estimated_duration" varchar,
  	"slug" varchar,
  	"sort_order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v_version_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_kind" "enum__services_v_version_kind",
  	"version_summary" varchar,
  	"version_description" varchar,
  	"version_pricing_mode" "enum__services_v_version_pricing_mode" DEFAULT 'quotation',
  	"version_price_amount" numeric,
  	"version_estimated_duration" varchar,
  	"version_slug" varchar,
  	"version_sort_order" numeric DEFAULT 10,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "service_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"request_type" "enum_service_requests_request_type" NOT NULL,
  	"service_id" integer,
  	"country_id" integer,
  	"status" "enum_service_requests_status" DEFAULT 'submitted' NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"applicant_full_name" varchar NOT NULL,
  	"applicant_mobile" varchar NOT NULL,
  	"applicant_email" varchar NOT NULL,
  	"applicant_nationality" varchar NOT NULL,
  	"applicant_passport_number" varchar,
  	"applicant_applicants_count" numeric DEFAULT 1 NOT NULL,
  	"customer_message" varchar,
  	"quoted_amount" numeric,
  	"staff_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customer_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"service_request_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"kind" "enum_customer_documents_kind" DEFAULT 'other' NOT NULL,
  	"status" "enum_customer_documents_status" DEFAULT 'pending' NOT NULL,
  	"reviewer_note" varchar,
  	"prefix" varchar DEFAULT 'documents',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "consultation_slots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"duration_minutes" numeric DEFAULT 45 NOT NULL,
  	"delivery_method" "enum_consultation_slots_delivery_method" DEFAULT 'video' NOT NULL,
  	"price_amount" numeric NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultation_bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hold_expires_at" timestamp(3) with time zone,
  	"cancellation_reason" varchar,
  	"reference" varchar NOT NULL,
  	"customer_id" integer NOT NULL,
  	"slot_id" integer NOT NULL,
  	"reservation_key" varchar,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"duration_minutes" numeric NOT NULL,
  	"delivery_method" varchar NOT NULL,
  	"amount" numeric NOT NULL,
  	"topic" varchar NOT NULL,
  	"customer_note" varchar,
  	"status" "enum_consultation_bookings_status" DEFAULT 'awaitingPayment' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payment_receipts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer NOT NULL,
  	"payable_type" "enum_payment_receipts_payable_type" NOT NULL,
  	"service_request_id" integer,
  	"consultation_booking_id" integer,
  	"amount" numeric NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"note" varchar,
  	"status" "enum_payment_receipts_status" DEFAULT 'pending' NOT NULL,
  	"reviewer_note" varchar,
  	"prefix" varchar DEFAULT 'receipts',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "consultation_page_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "consultation_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "consultation_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_kicker" varchar DEFAULT 'مشاوره تخصصی BoldTrip' NOT NULL,
  	"hero_title" varchar DEFAULT 'با شناخت بهتر، مسیر درست‌تری انتخاب کنید' NOT NULL,
  	"hero_description" varchar DEFAULT 'در یک جلسه تخصصی، شرایط، هدف سفر و مسیرهای احتمالی شما بررسی می‌شود تا پیش از شروع پرونده تصمیم دقیق‌تری بگیرید.' NOT NULL,
  	"duration_minutes" numeric DEFAULT 45 NOT NULL,
  	"price_amount" numeric DEFAULT 0 NOT NULL,
  	"delivery_method" "enum_consultation_page_delivery_method" DEFAULT 'video' NOT NULL,
  	"documents_note" varchar DEFAULT 'برای جلسه مشاوره بارگذاری پاسپورت اجباری نیست. در صورت نیاز، مدارک بعد از ایجاد رزرو و از داخل حساب کاربری ارسال می‌شوند.' NOT NULL,
  	"payment_note" varchar DEFAULT 'پس از ثبت رزرو، شماره کارت و مبلغ دقیق نمایش داده می‌شود. رزرو فقط پس از بارگذاری و تأیید رسید قطعی خواهد شد.' NOT NULL,
  	"cancellation_policy" varchar DEFAULT 'قوانین لغو و جابه‌جایی جلسه باید پیش از فعال‌شدن رزرو توسط مدیریت BoldTrip مشخص شود.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payment_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"card_number" varchar,
  	"cardholder_name" varchar,
  	"bank_name" varchar,
  	"iban" varchar,
  	"instructions" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "staff" ADD COLUMN "mfa_enabled" boolean DEFAULT false;
  ALTER TABLE "staff" ADD COLUMN "mfa_secret" varchar;
  ALTER TABLE "staff" ADD COLUMN "mfa_last_step" numeric;
  ALTER TABLE "staff" ADD COLUMN "mfa_recovery_hashes" jsonb;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_enabled" boolean DEFAULT false;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_accepting_requests" boolean DEFAULT false;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_title" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_summary" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_introduction" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_estimated_time" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_fee_note" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_official_source_url" varchar;
  ALTER TABLE "countries" ADD COLUMN "embassy_appointment_last_reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_enabled" boolean DEFAULT false;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_accepting_requests" boolean DEFAULT false;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_title" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_summary" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_introduction" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_estimated_time" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_fee_note" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_official_source_url" varchar;
  ALTER TABLE "_countries_v" ADD COLUMN "version_embassy_appointment_last_reviewed_at" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "refunds_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audit_events_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "auth_rate_limits_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_requests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "customer_documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultation_slots_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultation_bookings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_receipts_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "customers_id" integer;
  ALTER TABLE "refunds" ADD CONSTRAINT "refunds_receipt_id_payment_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."payment_receipts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_sessions" ADD CONSTRAINT "customers_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_embassy_appointment_required_documents" ADD CONSTRAINT "countries_embassy_appointment_required_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_embassy_appointment_steps" ADD CONSTRAINT "countries_embassy_appointment_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "countries_embassy_appointment_important_notes" ADD CONSTRAINT "countries_embassy_appointment_important_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_countries_v_version_embassy_appointment_required_documents" ADD CONSTRAINT "_countries_v_version_embassy_appointment_required_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_countries_v_version_embassy_appointment_steps" ADD CONSTRAINT "_countries_v_version_embassy_appointment_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_countries_v_version_embassy_appointment_important_notes" ADD CONSTRAINT "_countries_v_version_embassy_appointment_important_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_countries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_steps" ADD CONSTRAINT "services_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_benefits" ADD CONSTRAINT "_services_v_version_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_steps" ADD CONSTRAINT "_services_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_bookings" ADD CONSTRAINT "consultation_bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_bookings" ADD CONSTRAINT "consultation_bookings_slot_id_consultation_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."consultation_slots"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_receipts" ADD CONSTRAINT "payment_receipts_consultation_booking_id_consultation_bookings_id_fk" FOREIGN KEY ("consultation_booking_id") REFERENCES "public"."consultation_bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultation_page_benefits" ADD CONSTRAINT "consultation_page_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultation_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultation_page_steps" ADD CONSTRAINT "consultation_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultation_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "refunds_receipt_idx" ON "refunds" USING btree ("receipt_id");
  CREATE INDEX "refunds_updated_at_idx" ON "refunds" USING btree ("updated_at");
  CREATE INDEX "refunds_created_at_idx" ON "refunds" USING btree ("created_at");
  CREATE INDEX "audit_events_target_collection_idx" ON "audit_events" USING btree ("target_collection");
  CREATE INDEX "audit_events_target_id_idx" ON "audit_events" USING btree ("target_id");
  CREATE INDEX "audit_events_updated_at_idx" ON "audit_events" USING btree ("updated_at");
  CREATE INDEX "audit_events_created_at_idx" ON "audit_events" USING btree ("created_at");
  CREATE UNIQUE INDEX "auth_rate_limits_key_idx" ON "auth_rate_limits" USING btree ("key");
  CREATE INDEX "auth_rate_limits_updated_at_idx" ON "auth_rate_limits" USING btree ("updated_at");
  CREATE INDEX "auth_rate_limits_created_at_idx" ON "auth_rate_limits" USING btree ("created_at");
  CREATE INDEX "customers_sessions_order_idx" ON "customers_sessions" USING btree ("_order");
  CREATE INDEX "customers_sessions_parent_id_idx" ON "customers_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "customers_mobile_idx" ON "customers" USING btree ("mobile");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");
  CREATE INDEX "countries_embassy_appointment_required_documents_order_idx" ON "countries_embassy_appointment_required_documents" USING btree ("_order");
  CREATE INDEX "countries_embassy_appointment_required_documents_parent_id_idx" ON "countries_embassy_appointment_required_documents" USING btree ("_parent_id");
  CREATE INDEX "countries_embassy_appointment_steps_order_idx" ON "countries_embassy_appointment_steps" USING btree ("_order");
  CREATE INDEX "countries_embassy_appointment_steps_parent_id_idx" ON "countries_embassy_appointment_steps" USING btree ("_parent_id");
  CREATE INDEX "countries_embassy_appointment_important_notes_order_idx" ON "countries_embassy_appointment_important_notes" USING btree ("_order");
  CREATE INDEX "countries_embassy_appointment_important_notes_parent_id_idx" ON "countries_embassy_appointment_important_notes" USING btree ("_parent_id");
  CREATE INDEX "_countries_v_version_embassy_appointment_required_documents_order_idx" ON "_countries_v_version_embassy_appointment_required_documents" USING btree ("_order");
  CREATE INDEX "_countries_v_version_embassy_appointment_required_documents_parent_id_idx" ON "_countries_v_version_embassy_appointment_required_documents" USING btree ("_parent_id");
  CREATE INDEX "_countries_v_version_embassy_appointment_steps_order_idx" ON "_countries_v_version_embassy_appointment_steps" USING btree ("_order");
  CREATE INDEX "_countries_v_version_embassy_appointment_steps_parent_id_idx" ON "_countries_v_version_embassy_appointment_steps" USING btree ("_parent_id");
  CREATE INDEX "_countries_v_version_embassy_appointment_important_notes_order_idx" ON "_countries_v_version_embassy_appointment_important_notes" USING btree ("_order");
  CREATE INDEX "_countries_v_version_embassy_appointment_important_notes_parent_id_idx" ON "_countries_v_version_embassy_appointment_important_notes" USING btree ("_parent_id");
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE INDEX "services_steps_order_idx" ON "services_steps" USING btree ("_order");
  CREATE INDEX "services_steps_parent_id_idx" ON "services_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_benefits_order_idx" ON "_services_v_version_benefits" USING btree ("_order");
  CREATE INDEX "_services_v_version_benefits_parent_id_idx" ON "_services_v_version_benefits" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_steps_order_idx" ON "_services_v_version_steps" USING btree ("_order");
  CREATE INDEX "_services_v_version_steps_parent_id_idx" ON "_services_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "service_requests_reference_idx" ON "service_requests" USING btree ("reference");
  CREATE INDEX "service_requests_customer_idx" ON "service_requests" USING btree ("customer_id");
  CREATE INDEX "service_requests_service_idx" ON "service_requests" USING btree ("service_id");
  CREATE INDEX "service_requests_country_idx" ON "service_requests" USING btree ("country_id");
  CREATE INDEX "service_requests_status_idx" ON "service_requests" USING btree ("status");
  CREATE INDEX "service_requests_updated_at_idx" ON "service_requests" USING btree ("updated_at");
  CREATE INDEX "service_requests_created_at_idx" ON "service_requests" USING btree ("created_at");
  CREATE INDEX "customer_documents_customer_idx" ON "customer_documents" USING btree ("customer_id");
  CREATE INDEX "customer_documents_service_request_idx" ON "customer_documents" USING btree ("service_request_id");
  CREATE INDEX "customer_documents_status_idx" ON "customer_documents" USING btree ("status");
  CREATE INDEX "customer_documents_updated_at_idx" ON "customer_documents" USING btree ("updated_at");
  CREATE INDEX "customer_documents_created_at_idx" ON "customer_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "customer_documents_filename_idx" ON "customer_documents" USING btree ("filename");
  CREATE UNIQUE INDEX "consultation_slots_starts_at_idx" ON "consultation_slots" USING btree ("starts_at");
  CREATE INDEX "consultation_slots_active_idx" ON "consultation_slots" USING btree ("active");
  CREATE INDEX "consultation_slots_updated_at_idx" ON "consultation_slots" USING btree ("updated_at");
  CREATE INDEX "consultation_slots_created_at_idx" ON "consultation_slots" USING btree ("created_at");
  CREATE INDEX "consultation_bookings_hold_expires_at_idx" ON "consultation_bookings" USING btree ("hold_expires_at");
  CREATE UNIQUE INDEX "consultation_bookings_reference_idx" ON "consultation_bookings" USING btree ("reference");
  CREATE INDEX "consultation_bookings_customer_idx" ON "consultation_bookings" USING btree ("customer_id");
  CREATE INDEX "consultation_bookings_slot_idx" ON "consultation_bookings" USING btree ("slot_id");
  CREATE UNIQUE INDEX "consultation_bookings_reservation_key_idx" ON "consultation_bookings" USING btree ("reservation_key");
  CREATE INDEX "consultation_bookings_updated_at_idx" ON "consultation_bookings" USING btree ("updated_at");
  CREATE INDEX "consultation_bookings_created_at_idx" ON "consultation_bookings" USING btree ("created_at");
  CREATE INDEX "payment_receipts_customer_idx" ON "payment_receipts" USING btree ("customer_id");
  CREATE INDEX "payment_receipts_service_request_idx" ON "payment_receipts" USING btree ("service_request_id");
  CREATE INDEX "payment_receipts_consultation_booking_idx" ON "payment_receipts" USING btree ("consultation_booking_id");
  CREATE INDEX "payment_receipts_updated_at_idx" ON "payment_receipts" USING btree ("updated_at");
  CREATE INDEX "payment_receipts_created_at_idx" ON "payment_receipts" USING btree ("created_at");
  CREATE UNIQUE INDEX "payment_receipts_filename_idx" ON "payment_receipts" USING btree ("filename");
  CREATE INDEX "consultation_page_benefits_order_idx" ON "consultation_page_benefits" USING btree ("_order");
  CREATE INDEX "consultation_page_benefits_parent_id_idx" ON "consultation_page_benefits" USING btree ("_parent_id");
  CREATE INDEX "consultation_page_steps_order_idx" ON "consultation_page_steps" USING btree ("_order");
  CREATE INDEX "consultation_page_steps_parent_id_idx" ON "consultation_page_steps" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_refunds_fk" FOREIGN KEY ("refunds_id") REFERENCES "public"."refunds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_events_fk" FOREIGN KEY ("audit_events_id") REFERENCES "public"."audit_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_auth_rate_limits_fk" FOREIGN KEY ("auth_rate_limits_id") REFERENCES "public"."auth_rate_limits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_requests_fk" FOREIGN KEY ("service_requests_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customer_documents_fk" FOREIGN KEY ("customer_documents_id") REFERENCES "public"."customer_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_slots_fk" FOREIGN KEY ("consultation_slots_id") REFERENCES "public"."consultation_slots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultation_bookings_fk" FOREIGN KEY ("consultation_bookings_id") REFERENCES "public"."consultation_bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_receipts_fk" FOREIGN KEY ("payment_receipts_id") REFERENCES "public"."payment_receipts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_refunds_id_idx" ON "payload_locked_documents_rels" USING btree ("refunds_id");
  CREATE INDEX "payload_locked_documents_rels_audit_events_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_events_id");
  CREATE INDEX "payload_locked_documents_rels_auth_rate_limits_id_idx" ON "payload_locked_documents_rels" USING btree ("auth_rate_limits_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_service_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("service_requests_id");
  CREATE INDEX "payload_locked_documents_rels_customer_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("customer_documents_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_slots_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_slots_id");
  CREATE INDEX "payload_locked_documents_rels_consultation_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("consultation_bookings_id");
  CREATE INDEX "payload_locked_documents_rels_payment_receipts_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_receipts_id");
  CREATE INDEX "payload_preferences_rels_customers_id_idx" ON "payload_preferences_rels" USING btree ("customers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "refunds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "audit_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "auth_rate_limits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries_embassy_appointment_required_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries_embassy_appointment_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "countries_embassy_appointment_important_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_countries_v_version_embassy_appointment_required_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_countries_v_version_embassy_appointment_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_countries_v_version_embassy_appointment_important_notes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "customer_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_slots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_bookings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_receipts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_page_benefits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_page_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "consultation_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "refunds" CASCADE;
  DROP TABLE "audit_events" CASCADE;
  DROP TABLE "auth_rate_limits" CASCADE;
  DROP TABLE "customers_sessions" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "countries_embassy_appointment_required_documents" CASCADE;
  DROP TABLE "countries_embassy_appointment_steps" CASCADE;
  DROP TABLE "countries_embassy_appointment_important_notes" CASCADE;
  DROP TABLE "_countries_v_version_embassy_appointment_required_documents" CASCADE;
  DROP TABLE "_countries_v_version_embassy_appointment_steps" CASCADE;
  DROP TABLE "_countries_v_version_embassy_appointment_important_notes" CASCADE;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_steps" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_benefits" CASCADE;
  DROP TABLE "_services_v_version_steps" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "service_requests" CASCADE;
  DROP TABLE "customer_documents" CASCADE;
  DROP TABLE "consultation_slots" CASCADE;
  DROP TABLE "consultation_bookings" CASCADE;
  DROP TABLE "payment_receipts" CASCADE;
  DROP TABLE "consultation_page_benefits" CASCADE;
  DROP TABLE "consultation_page_steps" CASCADE;
  DROP TABLE "consultation_page" CASCADE;
  DROP TABLE "payment_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_refunds_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audit_events_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_auth_rate_limits_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_requests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_customer_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultation_slots_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultation_bookings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_receipts_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_customers_fk";
  
  DROP INDEX "payload_locked_documents_rels_refunds_id_idx";
  DROP INDEX "payload_locked_documents_rels_audit_events_id_idx";
  DROP INDEX "payload_locked_documents_rels_auth_rate_limits_id_idx";
  DROP INDEX "payload_locked_documents_rels_customers_id_idx";
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_service_requests_id_idx";
  DROP INDEX "payload_locked_documents_rels_customer_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultation_slots_id_idx";
  DROP INDEX "payload_locked_documents_rels_consultation_bookings_id_idx";
  DROP INDEX "payload_locked_documents_rels_payment_receipts_id_idx";
  DROP INDEX "payload_preferences_rels_customers_id_idx";
  ALTER TABLE "staff" DROP COLUMN "mfa_enabled";
  ALTER TABLE "staff" DROP COLUMN "mfa_secret";
  ALTER TABLE "staff" DROP COLUMN "mfa_last_step";
  ALTER TABLE "staff" DROP COLUMN "mfa_recovery_hashes";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_enabled";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_accepting_requests";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_title";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_summary";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_introduction";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_estimated_time";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_fee_note";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_official_source_url";
  ALTER TABLE "countries" DROP COLUMN "embassy_appointment_last_reviewed_at";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_enabled";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_accepting_requests";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_title";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_summary";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_introduction";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_estimated_time";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_fee_note";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_official_source_url";
  ALTER TABLE "_countries_v" DROP COLUMN "version_embassy_appointment_last_reviewed_at";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "refunds_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audit_events_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "auth_rate_limits_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "customer_documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultation_slots_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultation_bookings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payment_receipts_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "customers_id";
  DROP TYPE "public"."enum_refunds_status";
  DROP TYPE "public"."enum_services_kind";
  DROP TYPE "public"."enum_services_pricing_mode";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_kind";
  DROP TYPE "public"."enum__services_v_version_pricing_mode";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_service_requests_request_type";
  DROP TYPE "public"."enum_service_requests_status";
  DROP TYPE "public"."enum_customer_documents_kind";
  DROP TYPE "public"."enum_customer_documents_status";
  DROP TYPE "public"."enum_consultation_slots_delivery_method";
  DROP TYPE "public"."enum_consultation_bookings_status";
  DROP TYPE "public"."enum_payment_receipts_payable_type";
  DROP TYPE "public"."enum_payment_receipts_status";
  DROP TYPE "public"."enum_consultation_page_delivery_method";`)
}
