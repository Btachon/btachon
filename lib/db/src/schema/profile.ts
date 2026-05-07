import { pgTable, varchar, boolean, timestamp, text, integer } from "drizzle-orm/pg-core";
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
  zoomLink: varchar("zoom_link"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const friendConnectionsTable = pgTable("friend_connections", {
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  friendUserId: varchar("friend_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const friendRequestsTable = pgTable("friend_requests", {
  id: varchar("id").primaryKey(),
  fromUserId: varchar("from_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  toUserId: varchar("to_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
  message: text("message"),
  status: varchar("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tutorsTable = pgTable("tutors", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  displayName: varchar("display_name").notNull(),
  bio: text("bio"),
  subjects: text("subjects").notNull(),
  languages: text("languages").notNull(),
  availability: text("availability").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notificationsTable = pgTable("notifications", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  body: text("body"),
  isRead: boolean("is_read").notNull().default(false),
  status: varchar("status").notNull().default("none"),
  fromUserId: varchar("from_user_id").references(() => usersTable.id, { onDelete: "set null" }),
  fromName: varchar("from_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const learnSessionsTable = pgTable("learn_sessions", {
  id: varchar("id").primaryKey(),
  hostUserId: varchar("host_user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  topic: varchar("topic"),
  level: varchar("level").notNull().default("All"),
  format: varchar("format").notNull().default("peer"),
  date: varchar("date"),
  time: varchar("time"),
  duration: varchar("duration"),
  capacity: integer("capacity").notNull().default(10),
  hostName: varchar("host_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type UpsertUserProfile = typeof userProfilesTable.$inferInsert;
