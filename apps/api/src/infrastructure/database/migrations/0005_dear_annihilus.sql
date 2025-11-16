ALTER TABLE "applications" RENAME TO "games";--> statement-breakpoint
ALTER TABLE "keystore" DROP CONSTRAINT "keystore_game_id_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "applications_user _id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "keystore" ADD CONSTRAINT "keystore_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user _id_user_id_fk" FOREIGN KEY ("user _id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;