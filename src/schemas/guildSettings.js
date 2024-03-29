import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { db } from "../db/db.js";
import { eq } from "drizzle-orm";

export const guildSettings = pgTable('guildSettings', { 
    guildId: varchar('guildId', { length: 256 }).primaryKey(),
    webhookURL: varchar('webhookURL', { length: 512 }),
    newsChannelID: varchar('newsChannelID', { length: 256 }),
    rolesChannelID: varchar('rolesChannelID', { length: 256 }),
    announcementsChannelID: varchar('announcementsChannelID', { length: 256 }),
}); 

export const getGuildSettings = async (guildID) => {
    const res = await db.select().from(guildSettings).where(eq(guildSettings.guildId, guildID))
    return res[0]
}

export const createGuildSettings = async (guildID, webhookURL) => {
    return await db.insert(guildSettings).values({ guildId: guildID, webhookURL: webhookURL }).returning()
}

export const getGuildWebhookURL = async (guildID) => {
    const webhookURL = await db.select().from(guildSettings).where(eq(guildSettings.guildId, guildID))
    return webhookURL[0].webhookURL
}

export const createOrUpdateGuildSettings = async (newSettings) => {
    return await db.insert(guildSettings).values(newSettings).onConflictDoUpdate({ target: guildSettings.guildId, set: newSettings }).returning()
}
