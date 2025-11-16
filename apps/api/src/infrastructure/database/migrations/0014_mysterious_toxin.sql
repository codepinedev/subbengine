ALTER TABLE "api_key_logs" ADD COLUMN "api_key_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "endpoint" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "method" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "statusCode" integer DEFAULT 200;--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "responseTime" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "ip_address" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "user_agent" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD COLUMN "error_message" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "api_key_logs" ADD CONSTRAINT "api_key_logs_api_key_id_apiKeys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."apiKeys"("id") ON DELETE cascade ON UPDATE no action;