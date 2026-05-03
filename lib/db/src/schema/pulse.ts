import { pgTable, varchar, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const pulseCampaignsTable = pgTable("pulse_campaigns", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  personName: varchar("person_name").notNull(),
  campaignType: varchar("campaign_type").notNull(),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pulseCommitmentsTable = pgTable("pulse_commitments", {
  id: varchar("id").primaryKey(),
  campaignId: varchar("campaign_id").notNull().references(() => pulseCampaignsTable.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  displayName: varchar("display_name").notNull(),
  perekNumber: integer("perek_number").notNull(),
  cycle: integer("cycle").notNull().default(1),
  committedAt: timestamp("committed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("unique_campaign_perek_cycle").on(t.campaignId, t.perekNumber, t.cycle),
]);

export type PulseCampaign = typeof pulseCampaignsTable.$inferSelect;
export type InsertPulseCampaign = typeof pulseCampaignsTable.$inferInsert;
export type PulseCommitment = typeof pulseCommitmentsTable.$inferSelect;
export type InsertPulseCommitment = typeof pulseCommitmentsTable.$inferInsert;
