import { Router, type IRouter, type Request, type Response } from "express";
import { db, userProfilesTable, growthEventsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const POINTS: Record<string, number> = {
  daily_practice_mitzvah: 10,
  daily_practice_learn: 5,
  daily_practice_geulah: 5,
  daily_practice_chai: 5,
  tefillah_davened: 5,
  tehillim_chapter: 2,
  learn_session_complete: 15,
};

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime();
  return Math.round(ms / 86400000);
}

router.post("/growth/award", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { kind, key } = req.body as { kind?: string; key?: string };
  if (!kind || !key || typeof kind !== "string" || typeof key !== "string") {
    res.status(400).json({ error: "kind and key required" });
    return;
  }
  const points = POINTS[kind];
  if (!points) {
    res.status(400).json({ error: "Unknown kind" });
    return;
  }

  const userId = req.user.id;
  try {
    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(growthEventsTable)
        .values({ id: crypto.randomUUID(), userId, kind, dedupKey: key, points })
        .onConflictDoNothing()
        .returning();

      if (inserted.length === 0) {
        const [profile] = await tx.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId));
        return {
          awarded: 0,
          growthPoints: profile?.growthPoints ?? 0,
          currentStreak: profile?.currentStreak ?? 0,
          longestStreak: profile?.longestStreak ?? 0,
          duplicate: true,
        };
      }

      const today = todayIso();
      const [existing] = await tx
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.userId, userId))
        .for("update");
      let newStreak = existing?.currentStreak ?? 0;
      let newLongest = existing?.longestStreak ?? 0;
      const last = existing?.lastActivityDate ? String(existing.lastActivityDate) : null;
      if (last === today) {
        // already counted today; streak unchanged
      } else if (last && daysBetween(last, today) === 1) {
        newStreak = newStreak + 1;
      } else {
        newStreak = 1;
      }
      if (newStreak > newLongest) newLongest = newStreak;

      const [updated] = await tx
        .update(userProfilesTable)
        .set({
          growthPoints: sql`${userProfilesTable.growthPoints} + ${points}`,
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActivityDate: today,
        })
        .where(eq(userProfilesTable.userId, userId))
        .returning();

      return {
        awarded: points,
        growthPoints: updated?.growthPoints ?? 0,
        currentStreak: updated?.currentStreak ?? 0,
        longestStreak: updated?.longestStreak ?? 0,
      };
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to award growth points");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
