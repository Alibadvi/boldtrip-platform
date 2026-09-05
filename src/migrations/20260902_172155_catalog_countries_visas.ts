import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_staff_roles" AS ENUM('admin', 'consultant', 'caseOperator', 'financeOperator', 'contentEditor');
  CREATE TYPE "public"."enum_staff_account_status" AS ENUM('active', 'suspended');
  CREATE TYPE "public"."enum_countries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__countries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_visas_requirements_kind" AS ENUM('required', 'conditional', 'later');
  CREATE TYPE "public"."enum_visas_category" AS ENUM('visitor', 'study', 'work', 'family', 'transit', 'other');
  CREATE TYPE "public"."enum_visas_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visas_v_version_requirements_kind" AS ENUM('required', 'conditional', 'later');
  CREATE TYPE "public"."enum__visas_v_version_category" AS ENUM('visitor', 'study', 'work', 'family', 'transit', 'other');
  CREATE TYPE "public"."enum__visas_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homepage_faqs_category" AS ENUM('visa-services', 'documents', 'consultation-payment');
  CREATE TABLE "staff_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_staff_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "staff_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"account_status" "enum_staff_account_status" DEFAULT 'active' NOT NULL,
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
  
  CREATE TABLE "countries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"flag" varchar,
  	"summary" varchar,
  	"introduction" varchar,
  	"slug" varchar,
  	"code" varchar,
  	"featured_on_homepage" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_countries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_countries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_flag" varchar,
  	"version_summary" varchar,
  	"version_introduction" varchar,
  	"version_slug" varchar,
  	"version_code" varchar,
  	"version_featured_on_homepage" boolean DEFAULT false,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__countries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "visas_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_visas_requirements_kind" DEFAULT 'required',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "visas_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "visas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"country_id" integer,
  	"title" varchar,
  	"category" "enum_visas_category",
  	"summary" varchar,
  	"suitable_for" varchar,
  	"processing_time" varchar,
  	"validity" varchar,
  	"stay_length" varchar,
  	"fee_note" varchar,
  	"official_source_label" varchar DEFAULT 'وب‌سایت رسمی دولت یا سفارت',
  	"official_source_url" varchar,
  	"last_reviewed_at" timestamp(3) with time zone,
  	"disclaimer" varchar DEFAULT 'شرایط ممکن است تغییر کند و تصمیم نهایی درباره صدور ویزا با مرجع رسمی است.',
  	"slug" varchar,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_visas_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_visas_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__visas_v_version_requirements_kind" DEFAULT 'required',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_visas_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_visas_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_country_id" integer,
  	"version_title" varchar,
  	"version_category" "enum__visas_v_version_category",
  	"version_summary" varchar,
  	"version_suitable_for" varchar,
  	"version_processing_time" varchar,
  	"version_validity" varchar,
  	"version_stay_length" varchar,
  	"version_fee_note" varchar,
  	"version_official_source_label" varchar DEFAULT 'وب‌سایت رسمی دولت یا سفارت',
  	"version_official_source_url" varchar,
  	"version_last_reviewed_at" timestamp(3) with time zone,
  	"version_disclaimer" varchar DEFAULT 'شرایط ممکن است تغییر کند و تصمیم نهایی درباره صدور ویزا با مرجع رسمی است.',
  	"version_slug" varchar,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__visas_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"staff_id" integer,
  	"countries_id" integer,
  	"visas_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"staff_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "homepage_hero_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"index" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"action_label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_homepage_faqs_category" NOT NULL,
  	"show_on_homepage" boolean DEFAULT false
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_kicker" varchar DEFAULT 'مسیر روشن خدمات ویزا' NOT NULL,
  	"hero_title" varchar DEFAULT 'برای ویزا و وقت سفارت،' NOT NULL,
  	"hero_accent" varchar DEFAULT 'سردرگم شروع نکنید.' NOT NULL,
  	"hero_description" varchar DEFAULT 'شرایط کانادا و شینگن را بررسی کنید، خدمت مناسب را انتخاب کنید و ادامه مسیر را مرحله‌به‌مرحله در حساب خود پیگیری کنید.' NOT NULL,
  	"hero_primary_action_label" varchar DEFAULT 'مشاهده ویزاها' NOT NULL,
  	"hero_primary_action_href" varchar DEFAULT '/countries' NOT NULL,
  	"hero_secondary_action_label" varchar DEFAULT 'رزرو مشاوره' NOT NULL,
  	"hero_secondary_action_href" varchar DEFAULT '/consultation/book' NOT NULL,
  	"destination_intro_kicker" varchar DEFAULT 'مقصدهای شروع' NOT NULL,
  	"destination_intro_title" varchar DEFAULT 'شرایط مقصد را قبل از اقدام بشناسید' NOT NULL,
  	"destination_intro_description" varchar DEFAULT 'توضیحات هر مقصد، مدارک پایه، مراحل اقدام و خدمات مرتبط را در یک صفحه ببینید.' NOT NULL,
  	"service_intro_kicker" varchar DEFAULT 'چه کاری برای شما انجام می‌دهیم؟' NOT NULL,
  	"service_intro_title" varchar DEFAULT 'از اطلاعات اولیه تا اقدام واقعی' NOT NULL,
  	"service_intro_description" varchar DEFAULT 'هر خدمت، مسیر مشخص خودش را دارد؛ بدون فرم‌های پراکنده و پیگیری نامعلوم.' NOT NULL,
  	"process_kicker" varchar DEFAULT 'روند کار' NOT NULL,
  	"process_title" varchar DEFAULT 'بدانید الان کجای مسیر هستید' NOT NULL,
  	"process_description" varchar DEFAULT 'از اولین بررسی تا پایان خدمت، وضعیت پرونده و اقدام بعدی برای شما مشخص می‌ماند.' NOT NULL,
  	"trust_kicker" varchar DEFAULT 'اطلاعات حساس، مسیر مسئولانه' NOT NULL,
  	"trust_title" varchar DEFAULT 'قبل از ارسال مدرک، دلیل نیاز به آن را می‌بینید' NOT NULL,
  	"trust_description" varchar DEFAULT 'گذرنامه و مدارک مالی فایل عادی نیستند. در هر درخواست، فهرست مدارک همان خدمت نمایش داده می‌شود و فایل‌های اصلاحی نیز داخل همان پرونده باقی می‌مانند.' NOT NULL,
  	"trust_action_label" varchar DEFAULT 'سیاست حریم خصوصی و مدارک' NOT NULL,
  	"trust_action_href" varchar DEFAULT '/privacy' NOT NULL,
  	"consultation_kicker" varchar DEFAULT 'اگر هنوز مطمئن نیستید' NOT NULL,
  	"consultation_title" varchar DEFAULT 'قبل از شروع پرونده، مسیر مناسب را مشخص کنید.' NOT NULL,
  	"consultation_description" varchar DEFAULT 'موضوع جلسه را انتخاب کنید و یکی از زمان‌های آزاد مشاوره را رزرو کنید.' NOT NULL,
  	"consultation_action_label" varchar DEFAULT 'مشاهده زمان‌های آزاد' NOT NULL,
  	"consultation_action_href" varchar DEFAULT '/consultation/book' NOT NULL,
  	"faq_intro_kicker" varchar DEFAULT 'پاسخ‌های کوتاه و روشن' NOT NULL,
  	"faq_intro_title" varchar DEFAULT 'سوالات متداول' NOT NULL,
  	"faq_intro_description" varchar DEFAULT 'پیش از ثبت درخواست، پاسخ مهم‌ترین سوال‌ها را اینجا بخوانید.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "staff_roles" ADD CONSTRAINT "staff_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_sessions" ADD CONSTRAINT "staff_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_countries_v" ADD CONSTRAINT "_countries_v_parent_id_countries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "visas_requirements" ADD CONSTRAINT "visas_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."visas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visas_steps" ADD CONSTRAINT "visas_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."visas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visas" ADD CONSTRAINT "visas_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_visas_v_version_requirements" ADD CONSTRAINT "_visas_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_visas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visas_v_version_steps" ADD CONSTRAINT "_visas_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_visas_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visas_v" ADD CONSTRAINT "_visas_v_parent_id_visas_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_visas_v" ADD CONSTRAINT "_visas_v_version_country_id_countries_id_fk" FOREIGN KEY ("version_country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visas_fk" FOREIGN KEY ("visas_id") REFERENCES "public"."visas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_highlights" ADD CONSTRAINT "homepage_hero_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_services" ADD CONSTRAINT "homepage_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_process_steps" ADD CONSTRAINT "homepage_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_faqs" ADD CONSTRAINT "homepage_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "staff_roles_order_idx" ON "staff_roles" USING btree ("order");
  CREATE INDEX "staff_roles_parent_idx" ON "staff_roles" USING btree ("parent_id");
  CREATE INDEX "staff_sessions_order_idx" ON "staff_sessions" USING btree ("_order");
  CREATE INDEX "staff_sessions_parent_id_idx" ON "staff_sessions" USING btree ("_parent_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE UNIQUE INDEX "staff_email_idx" ON "staff" USING btree ("email");
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE UNIQUE INDEX "countries_code_idx" ON "countries" USING btree ("code");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE INDEX "countries__status_idx" ON "countries" USING btree ("_status");
  CREATE INDEX "_countries_v_parent_idx" ON "_countries_v" USING btree ("parent_id");
  CREATE INDEX "_countries_v_version_version_slug_idx" ON "_countries_v" USING btree ("version_slug");
  CREATE INDEX "_countries_v_version_version_code_idx" ON "_countries_v" USING btree ("version_code");
  CREATE INDEX "_countries_v_version_version_updated_at_idx" ON "_countries_v" USING btree ("version_updated_at");
  CREATE INDEX "_countries_v_version_version_created_at_idx" ON "_countries_v" USING btree ("version_created_at");
  CREATE INDEX "_countries_v_version_version__status_idx" ON "_countries_v" USING btree ("version__status");
  CREATE INDEX "_countries_v_created_at_idx" ON "_countries_v" USING btree ("created_at");
  CREATE INDEX "_countries_v_updated_at_idx" ON "_countries_v" USING btree ("updated_at");
  CREATE INDEX "_countries_v_latest_idx" ON "_countries_v" USING btree ("latest");
  CREATE INDEX "visas_requirements_order_idx" ON "visas_requirements" USING btree ("_order");
  CREATE INDEX "visas_requirements_parent_id_idx" ON "visas_requirements" USING btree ("_parent_id");
  CREATE INDEX "visas_steps_order_idx" ON "visas_steps" USING btree ("_order");
  CREATE INDEX "visas_steps_parent_id_idx" ON "visas_steps" USING btree ("_parent_id");
  CREATE INDEX "visas_country_idx" ON "visas" USING btree ("country_id");
  CREATE UNIQUE INDEX "visas_slug_idx" ON "visas" USING btree ("slug");
  CREATE INDEX "visas_updated_at_idx" ON "visas" USING btree ("updated_at");
  CREATE INDEX "visas_created_at_idx" ON "visas" USING btree ("created_at");
  CREATE INDEX "visas__status_idx" ON "visas" USING btree ("_status");
  CREATE INDEX "_visas_v_version_requirements_order_idx" ON "_visas_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_visas_v_version_requirements_parent_id_idx" ON "_visas_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_visas_v_version_steps_order_idx" ON "_visas_v_version_steps" USING btree ("_order");
  CREATE INDEX "_visas_v_version_steps_parent_id_idx" ON "_visas_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_visas_v_parent_idx" ON "_visas_v" USING btree ("parent_id");
  CREATE INDEX "_visas_v_version_version_country_idx" ON "_visas_v" USING btree ("version_country_id");
  CREATE INDEX "_visas_v_version_version_slug_idx" ON "_visas_v" USING btree ("version_slug");
  CREATE INDEX "_visas_v_version_version_updated_at_idx" ON "_visas_v" USING btree ("version_updated_at");
  CREATE INDEX "_visas_v_version_version_created_at_idx" ON "_visas_v" USING btree ("version_created_at");
  CREATE INDEX "_visas_v_version_version__status_idx" ON "_visas_v" USING btree ("version__status");
  CREATE INDEX "_visas_v_created_at_idx" ON "_visas_v" USING btree ("created_at");
  CREATE INDEX "_visas_v_updated_at_idx" ON "_visas_v" USING btree ("updated_at");
  CREATE INDEX "_visas_v_latest_idx" ON "_visas_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
  CREATE INDEX "payload_locked_documents_rels_visas_id_idx" ON "payload_locked_documents_rels" USING btree ("visas_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_staff_id_idx" ON "payload_preferences_rels" USING btree ("staff_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_hero_highlights_order_idx" ON "homepage_hero_highlights" USING btree ("_order");
  CREATE INDEX "homepage_hero_highlights_parent_id_idx" ON "homepage_hero_highlights" USING btree ("_parent_id");
  CREATE INDEX "homepage_services_order_idx" ON "homepage_services" USING btree ("_order");
  CREATE INDEX "homepage_services_parent_id_idx" ON "homepage_services" USING btree ("_parent_id");
  CREATE INDEX "homepage_process_steps_order_idx" ON "homepage_process_steps" USING btree ("_order");
  CREATE INDEX "homepage_process_steps_parent_id_idx" ON "homepage_process_steps" USING btree ("_parent_id");
  CREATE INDEX "homepage_faqs_order_idx" ON "homepage_faqs" USING btree ("_order");
  CREATE INDEX "homepage_faqs_parent_id_idx" ON "homepage_faqs" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "staff_roles" CASCADE;
  DROP TABLE "staff_sessions" CASCADE;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "countries" CASCADE;
  DROP TABLE "_countries_v" CASCADE;
  DROP TABLE "visas_requirements" CASCADE;
  DROP TABLE "visas_steps" CASCADE;
  DROP TABLE "visas" CASCADE;
  DROP TABLE "_visas_v_version_requirements" CASCADE;
  DROP TABLE "_visas_v_version_steps" CASCADE;
  DROP TABLE "_visas_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_hero_highlights" CASCADE;
  DROP TABLE "homepage_services" CASCADE;
  DROP TABLE "homepage_process_steps" CASCADE;
  DROP TABLE "homepage_faqs" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TYPE "public"."enum_staff_roles";
  DROP TYPE "public"."enum_staff_account_status";
  DROP TYPE "public"."enum_countries_status";
  DROP TYPE "public"."enum__countries_v_version_status";
  DROP TYPE "public"."enum_visas_requirements_kind";
  DROP TYPE "public"."enum_visas_category";
  DROP TYPE "public"."enum_visas_status";
  DROP TYPE "public"."enum__visas_v_version_requirements_kind";
  DROP TYPE "public"."enum__visas_v_version_category";
  DROP TYPE "public"."enum__visas_v_version_status";
  DROP TYPE "public"."enum_homepage_faqs_category";`)
}
