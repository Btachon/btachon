import { Router, type IRouter, type Request, type Response } from "express";
import { db, learnSessionsTable, userProfilesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

router.get("/learn-sessions", async (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;

  let query = db.select().from(learnSessionsTable).orderBy(desc(learnSessionsTable.createdAt));

  const rows = await query;
  const filtered = type ? rows.filter(r => r.type === type) : rows;

  res.json(filtered.map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  })));
});

router.post("/learn-sessions", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { type, title, description, topic, level, format, date, time, duration, capacity } = req.body as {
    type?: string;
    title?: string;
    description?: string;
    topic?: string;
    level?: string;
    format?: string;
    date?: string;
    time?: string;
    duration?: string;
    capacity?: number;
  };

  if (!type || !title || !["lishma", "study"].includes(type)) {
    res.status(400).json({ error: "type (lishma|study) and title are required" });
    return;
  }

  // Get display name for the host
  const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, req.user.id));
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  const hostName = profile?.displayName ?? user?.firstName ?? "Anonymous";

  const id = crypto.randomBytes(12).toString("hex");
  const [row] = await db
    .insert(learnSessionsTable)
    .values({
      id,
      hostUserId: req.user.id,
      type,
      title,
      description: description ?? null,
      topic: topic ?? null,
      level: level ?? "All",
      format: format ?? "peer",
      date: date ?? null,
      time: time ?? null,
      duration: duration ?? null,
      capacity: capacity ?? 10,
      hostName,
    })
    .returning();

  res.json({
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  });
});

export default router;
