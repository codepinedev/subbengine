CREATE TYPE "public"."apiKeyStatus" AS ENUM('enabled', 'revoked');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" text PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"user _id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leaderboard_snapshots" ALTER COLUMN "leaderboard_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "keystore" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "keystore" ADD COLUMN "status" "apiKeyStatus" DEFAULT 'enabled';--> statement-breakpoint
ALTER TABLE "keystore" ADD COLUMN "game_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user _id_user_id_fk" FOREIGN KEY ("user _id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keystore" ADD CONSTRAINT "keystore_game_id_applications_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_snapshots" ADD CONSTRAINT "leaderboard_snapshots_leaderboard_id_leaderboards_id_fk" FOREIGN KEY ("leaderboard_id") REFERENCES "public"."leaderboards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
