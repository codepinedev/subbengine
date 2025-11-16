ALTER TABLE "api_key_logs" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key_logs" DROP COLUMN "uuid";