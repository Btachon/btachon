import { Router, type IRouter, type Request, type Response } from "express";
import { db, learnSessionsTable, notificationsTable, userProfilesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { sendTutorOfferEmail } from "../lib/email";

const router: IRouter = Router();

router.get("/learn-sessions", async (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;
  const rows = await db.select().from(learnSessionsTable).orderBy(desc(learnSessionsTable.createdAt));
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

  if (!type || !title || !["lishma", "study", "request"].includes(type)) {
    res.status(400).json({ error: "type (lishma|study|request) and title are required" });
    return;
  }

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

// Tutor responds to a student's open learning request
router.post("/learn-sessions/:id/respond", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const sessionId = String(req.params.id);
  const { message } = req.body as { message?: string };

  const [session] = await db.select().from(learnSessionsTable).where(eq(learnSessionsTable.id, sessionId));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  if (session.hostUserId === req.user.id) { res.status(400).json({ error: "Cannot respond to your own request" }); return; }

  // Get tutor's display name
  const [tutorProfile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, req.user.id));
  const [tutorUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  const tutorName = tutorProfile?.displayName ?? tutorUser?.firstName ?? "A tutor";

  // Notify the student
  const notifId = crypto.randomBytes(10).toString("hex");
  const body = message?.trim()
    ? `"${message.slice(0, 200)}"`
    : `They can see your request for "${session.title}" and want to connect.`;

  await db.insert(notificationsTable).values({
    id: notifId,
    userId: session.hostUserId,
    type: "tutor_contact",
    title: `${tutorName} can help you learn!`,
    body,
    fromUserId: req.user.id,
    fromName: tutorName,
    status: "none",
  });

  // Send email to the student
  const [studentUser] = await db.select().from(usersTable).where(eq(usersTable.id, session.hostUserId));
  if (studentUser?.email) {
    sendTutorOfferEmail(
      studentUser.email,
      studentUser.firstName ?? null,
      tutorName,
      session.title,
      message?.trim() ?? null
    ).catch(() => {});
  }

  res.json({ success: true });
});

export default router;
