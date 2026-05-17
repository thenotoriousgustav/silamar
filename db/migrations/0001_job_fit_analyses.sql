CREATE TYPE "public"."job_fit_decision" AS ENUM('strong_fit', 'good_fit', 'stretch', 'poor_fit', 'not_fit');
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_fit_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"resume_id" text NOT NULL,
	"job_id" text,
	"job_title" text,
	"company" text,
	"job_description" text NOT NULL,
	"match_score" integer NOT NULL,
	"decision" "job_fit_decision" NOT NULL,
	"should_apply" boolean NOT NULL,
	"result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_fit_analyses" ADD CONSTRAINT "job_fit_analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_fit_analyses" ADD CONSTRAINT "job_fit_analyses_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_fit_analyses" ADD CONSTRAINT "job_fit_analyses_job_id_job_applications_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_applications"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_fit_analyses_user_id_idx" ON "job_fit_analyses" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_fit_analyses_resume_id_idx" ON "job_fit_analyses" ("resume_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_fit_analyses_job_id_idx" ON "job_fit_analyses" ("job_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_fit_analyses_created_at_idx" ON "job_fit_analyses" ("created_at" DESC);
