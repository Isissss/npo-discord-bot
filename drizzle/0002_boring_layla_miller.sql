CREATE TABLE IF NOT EXISTS "guildSettings" (
	"id" serial PRIMARY KEY NOT NULL,
	"guildId" varchar(256),
	"webhookURL" varchar(512)
);
