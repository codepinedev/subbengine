ALTER TABLE "api_key_logs" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "api_key_logs" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key_logs" DROP COLUMN "id";