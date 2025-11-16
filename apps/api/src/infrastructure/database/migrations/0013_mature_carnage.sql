ALTER TABLE "api_key_logs" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "api_key_logs" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();