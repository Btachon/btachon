import { Router, type IRouter, type Request, type Response } from "express";
import { db, userProfilesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { UpsertProfileBody } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function generateShareCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

async function ensureProfile(userId: string) {
  const [existing] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId));
  if (existing) return existing;

  let shareCode = generateShareCode();
  let attempts = 0;
  while (attempts < 5) {
    const [conflict] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.shareCode, shareCode));
    if (!conflict) break;
    shareCode = generateShareCode();
    attempts++;
  }

  const [profile] = await db
    .insert(userProfilesTable)
    .values({ userId, shareCode, onboardingComplete: false })
    .returning();
  return profile;
}

router.get("/profile", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const profile = await ensureProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = UpsertProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    await ensureProfile(req.user.id);

    const [updated] = await db
      .update(userProfilesTable)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.userId, req.user.id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
