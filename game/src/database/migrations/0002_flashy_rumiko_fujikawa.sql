ALTER TABLE "player" ADD COLUMN "letta_id" text;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_letta_id_unique" UNIQUE("letta_id");