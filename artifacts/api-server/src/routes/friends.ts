import { Router, type IRouter, type Request, type Response } from "express";
import { db, userProfilesTable, usersTable, friendConnectionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddFriendByCodeBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/friends", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const connections = await db
      .select()
      .from(friendConnectionsTable)
      .where(eq(friendConnectionsTable.userId, req.user.id));

    const friendIds = connections.map((c) => c.friendUserId);

    if (friendIds.length === 0) {
      res.json([]);
      return;
    }

    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, friendId));
        const [profile] = await db
          .select()
          .from(userProfilesTable)
          .where(eq(userProfilesTable.userId, friendId));
        return {
          userId: friendId,
          displayName: profile?.displayName ?? null,
          firstName: user?.firstName ?? null,
          lastName: user?.lastName ?? null,
          profileImageUrl: user?.profileImageUrl ?? null,
          shareCode: profile?.shareCode ?? "",
        };
      })
    );

    res.json(friends);
  } catch (err) {
    req.log.error({ err }, "Failed to get friends");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/friends/add", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = AddFriendByCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [targetProfile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.shareCode, parsed.data.shareCode.toUpperCase()));

    if (!targetProfile) {
      res.status(400).json({ error: "No user found with that code" });
      return;
    }

    if (targetProfile.userId === req.user.id) {
      res.status(400).json({ error: "Cannot add yourself as a friend" });
      return;
    }

    const [existing] = await db
      .select()
      .from(friendConnectionsTable)
      .where(
        and(
          eq(friendConnectionsTable.userId, req.user.id),
          eq(friendConnectionsTable.friendUserId, targetProfile.userId)
        )
      );

    if (existing) {
      res.status(400).json({ error: "Already friends" });
      return;
    }

    await db.insert(friendConnectionsTable).values({
      userId: req.user.id,
      friendUserId: targetProfile.userId,
    });

    await db.insert(friendConnectionsTable).values({
      userId: targetProfile.userId,
      friendUserId: req.user.id,
    });

    const [targetUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, targetProfile.userId));

    res.json({
      userId: targetProfile.userId,
      displayName: targetProfile.displayName ?? null,
      firstName: targetUser?.firstName ?? null,
      lastName: targetUser?.lastName ?? null,
      profileImageUrl: targetUser?.profileImageUrl ?? null,
      shareCode: targetProfile.shareCode,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to add friend");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/friends/:friendUserId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const friendId = String(req.params.friendUserId);

    await db
      .delete(friendConnectionsTable)
      .where(
        and(
          eq(friendConnectionsTable.userId, req.user.id),
          eq(friendConnectionsTable.friendUserId, friendId)
        )
      );

    await db
      .delete(friendConnectionsTable)
      .where(
        and(
          eq(friendConnectionsTable.userId, friendId),
          eq(friendConnectionsTable.friendUserId, req.user.id)
        )
      );

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to remove friend");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
