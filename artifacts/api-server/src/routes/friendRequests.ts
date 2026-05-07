import { Router, type IRouter, type Request, type Response } from "express";
import { db, friendRequestsTable, userProfilesTable, usersTable, friendConnectionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

async function getPersonInfo(userId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const [profile] = await db.select().from(userProfilesTable).where(eq(userProfilesTable.userId, userId));
  return {
    displayName: profile?.displayName ?? null,
    firstName: user?.firstName ?? null,
    profileImageUrl: user?.profileImageUrl ?? null,
  };
}

function formatEntry(row: any, from: any, to: any) {
  return {
    id: row.id,
    fromUserId: row.fromUserId,
    toUserId: row.toUserId,
    type: row.type,
    message: row.message ?? null,
    status: row.status,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    fromDisplayName: from.displayName,
    fromFirstName: from.firstName,
    fromProfileImageUrl: from.profileImageUrl,
    toDisplayName: to.displayName,
    toFirstName: to.firstName,
    toProfileImageUrl: to.profileImageUrl,
  };
}

router.post("/friend-requests", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { toUserId, type, message } = req.body as { toUserId?: string; type?: string; message?: string };

  if (!toUserId || !type || !["challenge", "tehillim"].includes(type)) {
    res.status(400).json({ error: "toUserId and type (challenge|tehillim) are required" });
    return;
  }

  if (toUserId === req.user.id) {
    res.status(400).json({ error: "Cannot send a request to yourself" });
    return;
  }

  const [areFriends] = await db
    .select()
    .from(friendConnectionsTable)
    .where(and(eq(friendConnectionsTable.userId, req.user.id), eq(friendConnectionsTable.friendUserId, toUserId)));

  if (!areFriends) {
    res.status(400).json({ error: "You can only send requests to friends" });
    return;
  }

  const id = crypto.randomBytes(12).toString("hex");
  const [row] = await db
    .insert(friendRequestsTable)
    .values({ id, fromUserId: req.user.id, toUserId, type, message: message ?? null, status: "pending" })
    .returning();

  const [from, to] = await Promise.all([getPersonInfo(req.user.id), getPersonInfo(toUserId)]);
  res.json(formatEntry(row, from, to));
});

router.get("/friend-requests/incoming", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(friendRequestsTable)
    .where(and(eq(friendRequestsTable.toUserId, req.user.id), eq(friendRequestsTable.status, "pending")));

  const entries = await Promise.all(
    rows.map(async (row) => {
      const [from, to] = await Promise.all([getPersonInfo(row.fromUserId), getPersonInfo(row.toUserId)]);
      return formatEntry(row, from, to);
    })
  );

  res.json(entries);
});

router.get("/friend-requests/outgoing", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const rows = await db
    .select()
    .from(friendRequestsTable)
    .where(eq(friendRequestsTable.fromUserId, req.user.id));

  const entries = await Promise.all(
    rows.map(async (row) => {
      const [from, to] = await Promise.all([getPersonInfo(row.fromUserId), getPersonInfo(row.toUserId)]);
      return formatEntry(row, from, to);
    })
  );

  res.json(entries);
});

router.patch("/friend-requests/:requestId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { status } = req.body as { status?: string };
  if (!status || !["accepted", "declined"].includes(status)) {
    res.status(400).json({ error: "status must be accepted or declined" });
    return;
  }

  const [existing] = await db
    .select()
    .from(friendRequestsTable)
    .where(and(eq(friendRequestsTable.id, req.params.requestId), eq(friendRequestsTable.toUserId, req.user.id)));

  if (!existing) { res.status(404).json({ error: "Request not found" }); return; }

  const [row] = await db
    .update(friendRequestsTable)
    .set({ status })
    .where(eq(friendRequestsTable.id, req.params.requestId))
    .returning();

  const [from, to] = await Promise.all([getPersonInfo(row.fromUserId), getPersonInfo(row.toUserId)]);
  res.json(formatEntry(row, from, to));
});

export default router;
