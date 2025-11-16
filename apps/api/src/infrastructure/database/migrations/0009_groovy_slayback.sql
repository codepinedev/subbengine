ALTER TABLE "keystore" RENAME TO "apiKeys";--> statement-breakpoint
ALTER TABLE "apiKeys" DROP CONSTRAINT "keystore_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "apiKeys" ADD CONSTRAINT "apiKeys_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;