ALTER TABLE "players" DROP CONSTRAINT "players_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;