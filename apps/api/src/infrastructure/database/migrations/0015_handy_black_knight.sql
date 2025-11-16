ALTER TABLE "api_key_logs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_key_logs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;