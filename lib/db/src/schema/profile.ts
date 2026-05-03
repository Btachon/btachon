import { pgTable, varchar, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const userProfilesTable = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  displayName: varchar("display_name"),
  shabbosCity: varchar("shabbos_city"),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  shareCode: varchar("share_code").notNull().unique(),
  bio: text("bio"),
  hobbies: text("hobbies"),
  growthGoals: text("growth_goals"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const friendConnectionsTable = pgTable("friend_connections", {
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  friendUserId: varchar("friend_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type UpsertUserProfile = typeof userProfilesTable.$inferInsert;
