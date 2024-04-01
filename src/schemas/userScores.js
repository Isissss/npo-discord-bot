import { pgTable, integer, serial, varchar } from "drizzle-orm/pg-core";
import { db } from "../db/db.js";
import { eq, and } from "drizzle-orm";

export const userScores = pgTable('userScores', {
    id: serial('id').primaryKey(),
    userID: varchar('userID', { length: 256 }),
    guildID: varchar('guildID', { length: 256 }),
    score: integer('score'),
});

export const getGuildLeaderboard = async (guildID) => {
    const leaderboard = await db.select().from(userScores).where(eq(userScores.guildID, guildID)).orderBy(userScores.score, 'desc').limit(10)

    return leaderboard
}

export const getGuildUserScore = async (guildID, userID) => {
    const userScore = await db.select().from(userScores).where(and(eq(userScores.userID, userID), eq(userScores.guildID, guildID))) 

    return userScore[0]
}

export const increaseUserScore = async (guildID, userID, scoreIncrease = 1) => {
    const userScore = await getGuildUserScore(guildID, userID)  

    if (!userScore) {
        return await db.insert(userScores).values({ guildID: guildID, userID: userID, score: scoreIncrease }).returning({ score: userScores.score })
    }

    return await db.update(userScores).set({ score: userScore.score + scoreIncrease }).where(and(eq(userScores.userID, userID), eq(userScores.guildID, guildID))).returning({ score: userScores.score })
} 