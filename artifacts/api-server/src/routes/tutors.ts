import { Router, type IRouter, type Request, type Response } from "express";
import { db, tutorsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

router.get("/tutors", async (req: Request, res: Response) => {
  const rows = await db
    .select()
    .from(tutorsTable)
    .orderBy(tutorsTable.isFeatured, tutorsTable.createdAt);
  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    }))
  );
});

router.post("/tutors", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { displayName, bio, subjects, languages, availability } = req.body as {
    displayName?: string;
    bio?: string;
    subjects?: string;
    languages?: string;
    availability?: string;
  };

  if (!displayName || !subjects || !languages || !availability) {
    res.status(400).json({ error: "displayName, subjects, languages, and availability are required" });
    return;
  }

  // Upsert — one listing per user
  const existing = await db.select().from(tutorsTable).where(eq(tutorsTable.userId, req.user.id));

  let row;
  if (existing.length > 0) {
    [row] = await db
      .update(tutorsTable)
      .set({ displayName, bio: bio ?? null, subjects, languages, availability, isAvailable: true })
      .where(eq(tutorsTable.userId, req.user.id))
      .returning();
  } else {
    const id = crypto.randomBytes(10).toString("hex");
    [row] = await db
      .insert(tutorsTable)
      .values({ id, userId: req.user.id, displayName, bio: bio ?? null, subjects, languages, availability })
      .returning();
  }

  res.json({ ...row, createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt });
});

router.delete("/tutors/me", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  await db.delete(tutorsTable).where(eq(tutorsTable.userId, req.user.id));
  res.json({ success: true });
});

export default router;
