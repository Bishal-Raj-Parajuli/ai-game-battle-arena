import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const player = pgTable("player", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  name: text("name").notNull().unique(),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
});
