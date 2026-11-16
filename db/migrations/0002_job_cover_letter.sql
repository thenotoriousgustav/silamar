ALTER TABLE "job_applications" ADD COLUMN "cover_letter_id" text;
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cover_letter_id_cover_letters_id_fk" FOREIGN KEY ("cover_letter_id") REFERENCES "public"."cover_letters"("id") ON DELETE set null ON UPDATE no action;
