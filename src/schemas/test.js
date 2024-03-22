import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const tests = pgTable('tests', {
    id: serial('id').primaryKey(),
    hallo: text('hallo'),
    world: text('world'),
});