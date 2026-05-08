import { Router, type IRouter, type Request, type Response } from "express";
import { db, notificationsTable, userProfilesTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { sendTutorAcceptEmail, sendTutorDeclineEmail } from "../lib/email";

const router: IRouter = Router();

router.get("/notifications", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.user.id))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);

  // For tutor_accepted notifications, look up the tutor's current Zoom link
  // so it always reflects the latest saved value, even if saved after acceptance.
  const tutorAccepted = rows.filter(r => r.type === "tutor_accepted" && r.fromUserId);
  const zoomMap: Record<string, string | null> = {};
  if (tutorAccepted.length > 0) {
    const tutorIds = [...new Set(tutorAccepted.map(r => r.fromUserId as string))];
    const profiles = await Promise.all(
      tutorIds.map(id => db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, id)).then(r => r[0]))
    );
    for (const p of profiles) {
      if (p) zoomMap[p.userId] = p.zoomLink ?? null;
    }
  }

  res.json(rows.map(r => {
    const base = { ...r, createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt };
    if (r.type === "tutor_accepted" && r.fromUserId) {
      const zoomLink = zoomMap[r.fromUserId] ?? null;
      // Rebuild the body with the current zoom link
      const tutorName = r.fromName ?? "Your tutor";
      const bodyParts = [`${tutorName} accepted your request.`];
      if (zoomLink) bodyParts.push(`Join here: ${zoomLink}`);
      else bodyParts.push("They will be in touch with session details.");
      return { ...base, body: bodyParts.join(" ") };
    }
    return base;
  }));
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

    // Send email to requester
    const [requesterUser] = await db.select().from(usersTable).where(eq(usersTable.id, notif.fromUserId));
    if (requesterUser?.email) {
      sendTutorDeclineEmail(requesterUser.email, requesterUser.firstName ?? null, tutorName).catch(() => {});
    }
  }

  res.json({ success: true });
});

export default router;
