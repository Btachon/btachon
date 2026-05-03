import { pgTable, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const videosTable = pgTable("videos", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  speaker: varchar("speaker").notNull(),
  channel: varchar("channel").notNull(),
  duration: varchar("duration").notNull(),
  category: varchar("category").notNull(),
  description: text("description").notNull().default(""),
  isShort: boolean("is_short").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Video = typeof videosTable.$inferSelect;
export type InsertVideo = typeof videosTable.$inferInsert;
