ALTER TABLE "games" RENAME COLUMN "user _id" TO "user_id";--> statement-breakpoint
ALTER TABLE "leaderboards" RENAME COLUMN "game" TO "game_id";--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "games_user _id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;