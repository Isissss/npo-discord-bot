import { pgTable, serial,  varchar } from "drizzle-orm/pg-core";
import { db } from "../db/db.js";
import { eq } from "drizzle-orm";

export const hashes = pgTable('hashes', {
    id: serial('id').primaryKey(),
    hash: varchar('hash', { length: 256 }),
});

export const getAllHashes = async () => {
    const allHashes = await db.select().from(hashes)

    return allHashes
}

export const getHash = async (hash) => {
    const singleHash = await db.select().from(hashes).where(eq(hashes.hash, hash))

    return singleHash
}

export const insertHash = async (hash) => {
    const newHash = await db.insert(hashes).values({ hash }).returning()

    return newHash
}