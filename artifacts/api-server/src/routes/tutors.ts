import { Router, type IRouter, type Request, type Response } from "express";
import { db, tutorsTable, notificationsTable, userProfilesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { sendTutorContactEmail } from "../lib/email";

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

router.post("/tutors/:tutorId/contact", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const tutorId = String(req.params.tutorId);
  const { message } = req.body as { message?: string };

  if (!message?.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const [tutor] = await db.select().from(tutorsTable).where(eq(tutorsTable.id, tutorId));
  if (!tutor) { res.status(404).json({ error: "Tutor not found" }); return; }

  // Get sender's display name
  const [senderProfile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, req.user.id));
  const [senderUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  const senderName = senderProfile?.displayName ?? senderUser?.firstName ?? req.user.email ?? "A user";

  // Create in-app notification for the tutor if they have an account
  if (tutor.userId) {
    const notifId = crypto.randomBytes(10).toString("hex");
    await db.insert(notificationsTable).values({
      id: notifId,
      userId: tutor.userId,
      type: "tutor_contact",
      title: `${senderName} wants to learn with you`,
      body: message.slice(0, 300),
      fromUserId: req.user.id,
      fromName: senderName,
    });

    // Send email notification if the tutor has an email
    const [tutorUser] = await db.select().from(usersTable).where(eq(usersTable.id, tutor.userId));
    if (tutorUser?.email) {
      sendTutorContactEmail(tutorUser.email, tutorUser.firstName ?? null, senderName, message).catch(() => {});
    }
  }

  res.json({ success: true });
});

export default router;
