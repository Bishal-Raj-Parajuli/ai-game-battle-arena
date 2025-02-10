CREATE TABLE "player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"prompt" text NOT NULL,
	"model" text NOT NULL,
	CONSTRAINT "player_id_unique" UNIQUE("id"),
	CONSTRAINT "player_name_unique" UNIQUE("name")
);
