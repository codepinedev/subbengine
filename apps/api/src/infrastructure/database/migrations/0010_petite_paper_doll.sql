ALTER TABLE "apiKeys" RENAME COLUMN "recorded_at" TO "expire_at";--> statement-breakpoint
ALTER TABLE "apiKeys" ADD COLUMN "last_used_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "apiKeys" ADD COLUMN "created_at" timestamp DEFAULT now();