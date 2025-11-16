ALTER TABLE "leaderboard_snapshots" ALTER COLUMN "leaderboard_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "leaderboards" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "leaderboard_id" SET DATA TYPE uuid;