import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const player = pgTable("player", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  name: text("name").notNull().unique(),
  prompt: text("prompt").notNull(),
  model: text("model").notNull(),
});

export const chatHistory = pgTable("chat_history", {
  id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
