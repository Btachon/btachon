import { Router, type IRouter, type Request, type Response } from "express";
import { db, videosTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/videos", async (req: Request, res: Response) => {
  try {
    const { category, isShort } = req.query;

    let query = db.select().from(videosTable).orderBy(asc(videosTable.sortOrder), asc(videosTable.createdAt));

    const rows = await query;

    let filtered = rows;
    if (typeof category === "string" && category) {
      filtered = filtered.filter(v => v.category === category);
    }
    if (typeof isShort === "string") {
      const bool = isShort === "true";
      filtered = filtered.filter(v => v.isShort === bool);
    }

    res.json(filtered);
  } catch (err) {
    req.log.error({ err }, "Failed to list videos");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/videos", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { id, title, speaker, channel, duration, category, description, isShort, sortOrder } = req.body;

  if (!id || !title || !speaker || !channel || !duration || !category) {
    res.status(400).json({ error: "Missing required fields: id, title, speaker, channel, duration, category" });
    return;
  }

  try {
    const existing = await db.select().from(videosTable).where(eq(videosTable.id, String(id)));
    if (existing.length > 0) {
      const [updated] = await db
        .update(videosTable)
        .set({ title, speaker, channel, duration, category, description: description ?? "", isShort: isShort ?? true, sortOrder: sortOrder ?? 0 })
        .where(eq(videosTable.id, String(id)))
        .returning();
      res.json(updated);
      return;
    }

    const [video] = await db
      .insert(videosTable)
      .values({ id: String(id), title, speaker, channel, duration, category, description: description ?? "", isShort: isShort ?? true, sortOrder: sortOrder ?? 0 })
      .returning();
    res.json(video);
  } catch (err) {
    req.log.error({ err }, "Failed to create video");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/videos/:videoId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await db.delete(videosTable).where(eq(videosTable.id, String(req.params.videoId)));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete video");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
