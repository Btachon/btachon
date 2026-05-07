import { Router, type IRouter, type Request, type Response } from "express";
import { db, notificationsTable, userProfilesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { sendTutorAcceptEmail } from "../lib/email";

const router: IRouter = Router();

router.get("/notifications", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.user.id))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);

  res.json(rows.map(r => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  })));
});

router.post("/notifications/read-all", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, req.user.id));

  res.json({ success: true });
});

router.post("/notifications/:id/accept", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const notifId = String(req.params.id);
  const [notif] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, notifId));

  if (!notif || notif.userId !== req.user.id) {
    res.status(404).json({ error: "Notification not found" }); return;
  }

  // Mark as accepted
  await db.update(notificationsTable).set({ status: "accepted", isRead: true }).where(eq(notificationsTable.id, notifId));

  // Get tutor's (current user's) profile for Zoom link + display name
  const [tutorProfile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, req.user.id));
  const [tutorUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
  const tutorName = tutorProfile?.displayName ?? tutorUser?.firstName ?? "Your tutor";
  const zoomLink = tutorProfile?.zoomLink ?? null;

  // Send in-app notification to the person who requested
  if (notif.fromUserId) {
    const replyId = crypto.randomBytes(10).toString("hex");
    const bodyParts: string[] = [`${tutorName} accepted your request.`];
    if (zoomLink) bodyParts.push(`Join here: ${zoomLink}`);
    else bodyParts.push("They will be in touch with session details.");

    await db.insert(notificationsTable).values({
      id: replyId,
      userId: notif.fromUserId,
      type: "tutor_accepted",
      title: `${tutorName} accepted your learning request`,
      body: bodyParts.join(" "),
      fromUserId: req.user.id,
      fromName: tutorName,
      status: "none",
    });

    // Send email to requester
    const [requesterUser] = await db.select().from(usersTable).where(eq(usersTable.id, notif.fromUserId));
    if (requesterUser?.email) {
      sendTutorAcceptEmail(requesterUser.email, requesterUser.firstName ?? null, tutorName, zoomLink).catch(() => {});
    }
  }

  res.json({ success: true });
});

router.post("/notifications/:id/decline", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const notifId = String(req.params.id);
  const [notif] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, notifId));

  if (!notif || notif.userId !== req.user.id) {
    res.status(404).json({ error: "Notification not found" }); return;
  }

  await db.update(notificationsTable).set({ status: "declined", isRead: true }).where(eq(notificationsTable.id, notifId));

  // Notify the requester
  if (notif.fromUserId) {
    const [tutorProfile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, req.user.id));
    const [tutorUser] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.id));
    const tutorName = tutorProfile?.displayName ?? tutorUser?.firstName ?? "The tutor";

    const replyId = crypto.randomBytes(10).toString("hex");
    await db.insert(notificationsTable).values({
      id: replyId,
      userId: notif.fromUserId,
      type: "tutor_declined",
      title: `${tutorName} is not available right now`,
      body: "They may be at capacity. Try reaching out to another tutor.",
      fromUserId: req.user.id,
      fromName: tutorName,
      status: "none",
    });
  }

  res.json({ success: true });
});

export default router;
