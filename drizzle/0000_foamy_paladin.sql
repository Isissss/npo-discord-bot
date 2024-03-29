CREATE TABLE IF NOT EXISTS "guildSettings" (
	"guildId" varchar(256) PRIMARY KEY NOT NULL,
	"webhookURL" varchar(512),
	"newsChannelID" varchar(256),
	"rolesChannelID" varchar(256),
	"announcementsChannelID" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hashes" (
	"id" serial PRIMARY KEY NOT NULL,
	"hash" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userScores" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" varchar(256),
	"guildID" varchar(256),
	"score" integer
);
