ALTER TABLE "leaderboards" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."leaderboardStatus";--> statement-breakpoint
CREATE TYPE "public"."leaderboardStatus" AS ENUM('archived', 'active');--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."leaderboardStatus";--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "status" SET DATA TYPE "public"."leaderboardStatus" USING "status"::"public"."leaderboardStatus";