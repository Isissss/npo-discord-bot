CREATE TABLE IF NOT EXISTS "hashes" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" varchar(256)
);
--> statement-breakpoint
DROP TABLE "tests";