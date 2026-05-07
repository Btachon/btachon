import { Router, type IRouter, type Request, type Response } from "express";
import { db, pulseCampaignsTable, pulseCommitmentsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.get("/pulse/campaigns", async (req: Request, res: Response) => {
  try {
    const campaigns = await db.select().from(pulseCampaignsTable).orderBy(pulseCampaignsTable.createdAt);

    const withCounts = await Promise.all(
      campaigns.map(async (c) => {
        const countRows = await db
          .select({ cycle: pulseCommitmentsTable.cycle, count: sql<number>`count(*)::int` })
          .from(pulseCommitmentsTable)
          .where(eq(pulseCommitmentsTable.campaignId, c.id))
          .groupBy(pulseCommitmentsTable.cycle);

        const maxCycle = countRows.length > 0 ? Math.max(...countRows.map(r => r.cycle)) : 1;
        const currentCycleRow = countRows.find(r => r.cycle === maxCycle);
        const claimedCount = currentCycleRow?.count ?? 0;
        const totalCycle = maxCycle + (claimedCount >= 150 ? 1 : 0);
        const activeCycle = claimedCount >= 150 ? maxCycle + 1 : maxCycle;
        const activeCount = claimedCount >= 150 ? 0 : claimedCount;

        return { ...c, claimedCount: activeCount, cycle: activeCycle, totalCommitments: countRows.reduce((s, r) => s + r.count, 0) };
      })
    );

    const sorted = withCounts.sort((a, b) => {
      if (a.claimedCount !== b.claimedCount) return a.claimedCount - b.claimedCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(sorted);
  } catch (err) {
    req.log.error({ err }, "Failed to list pulse campaigns");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/pulse/campaigns", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { title, personName, campaignType } = req.body;
  if (!title || !personName || !campaignType) {
    res.status(400).json({ error: "Missing required fields: title, personName, campaignType" });
    return;
  }

  const validTypes = ["refuah", "yahrzeit"];
  if (!validTypes.includes(campaignType)) {
    res.status(400).json({ error: "campaignType must be 'refuah' or 'yahrzeit'" });
    return;
  }

  try {
    const [campaign] = await db
      .insert(pulseCampaignsTable)
      .values({
        id: randomUUID(),
        title,
        personName,
        campaignType,
        createdBy: req.user?.id ?? null,
      })
      .returning();
    res.status(201).json(campaign);
  } catch (err) {
    req.log.error({ err }, "Failed to create pulse campaign");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/pulse/campaigns/:id/commitments", async (req: Request, res: Response) => {
  try {
    const commitments = await db
      .select()
      .from(pulseCommitmentsTable)
      .where(eq(pulseCommitmentsTable.campaignId, req.params.id as string))
      .orderBy(pulseCommitmentsTable.cycle, pulseCommitmentsTable.perekNumber);
    res.json(commitments);
  } catch (err) {
    req.log.error({ err }, "Failed to list commitments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/pulse/campaigns/:id/commit", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const campaignId = req.params.id as string;
  const userId = req.user!.id as string;
  const displayName = req.user?.firstName ?? req.user?.email ?? "Anonymous";

  try {
    const campaign = await db.select().from(pulseCampaignsTable).where(eq(pulseCampaignsTable.id, campaignId));
    if (campaign.length === 0) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const commitments = await db
      .select()
      .from(pulseCommitmentsTable)
      .where(eq(pulseCommitmentsTable.campaignId, campaignId))
      .orderBy(pulseCommitmentsTable.cycle, pulseCommitmentsTable.perekNumber);

    const maxCycle = commitments.length > 0 ? Math.max(...commitments.map(c => c.cycle)) : 1;
    const currentCycleCommitments = commitments.filter(c => c.cycle === maxCycle);
    const activeCycle = currentCycleCommitments.length >= 150 ? maxCycle + 1 : maxCycle;
    const activeCommitments = activeCycle === maxCycle ? currentCycleCommitments : [];

    const claimed = new Set(activeCommitments.map(c => c.perekNumber));
    let nextPerek: number | null = null;
    for (let i = 1; i <= 150; i++) {
      if (!claimed.has(i)) { nextPerek = i; break; }
    }

    if (nextPerek === null) {
      res.status(409).json({ error: "All perakim claimed for this cycle", cycle: activeCycle });
      return;
    }

    try {
      const [commitment] = await db
        .insert(pulseCommitmentsTable)
        .values({
          id: randomUUID(),
          campaignId,
          userId,
          displayName,
          perekNumber: nextPerek,
          cycle: activeCycle,
        })
        .returning();
      res.status(201).json({ ...commitment, bookComplete: nextPerek === 150 });
    } catch (insertErr: any) {
      if (insertErr?.code === "23505") {
        res.status(409).json({ error: "Perek already taken, please try again" });
        return;
      }
      throw insertErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to commit to perek");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
