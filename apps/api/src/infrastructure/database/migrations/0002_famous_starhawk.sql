CREATE TYPE "public"."leaderboardStatus" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TABLE "api_key_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"recorded_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keystore" (
	"id" text PRIMARY KEY NOT NULL,
	"recorded_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leaderboards" ADD COLUMN "status" "leaderboardStatus" DEFAULT 'active';