import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getStoredJwt } from "@workspace/replit-auth-web";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, Heart, HeartPulse, Flame, Users, BookOpen, HandHeart, CheckCircle2, RefreshCw } from "lucide-react";
import pulseHero from "@/assets/session-tehillim.png";

const BASE = import.meta.env.BASE_URL;

interface Campaign {
  id: string;
  title: string;
  personName: string;
  campaignType: "refuah" | "yahrzeit";
  claimedCount: number;
  cycle: number;
  totalCommitments: number;
  createdAt: string;
}

interface CommitResult {
  id: string;
  campaignId: string;
  userId: string;
  displayName: string;
  perekNumber: number;
  cycle: number;
  bookComplete: boolean;
}

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${BASE}api/pulse/campaigns`);
  if (!res.ok) throw new Error("Failed to load campaigns");
  const data: Campaign[] = await res.json();
  return data.sort((a, b) => {
    if (a.claimedCount !== b.claimedCount) return a.claimedCount - b.claimedCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getStoredJwt();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function createCampaign(body: { title: string; personName: string; campaignType: string }) {
  const res = await fetch(`${BASE}api/pulse/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function commitToPerek(campaignId: string): Promise<CommitResult> {
  const res = await fetch(`${BASE}api/pulse/campaigns/${campaignId}/commit`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
  });
  if (res.status === 409) {
    const data = await res.json();
    if (data.perekNumber) {
      return { ...data, bookComplete: false, alreadyCommitted: true } as any;
    }
    throw new Error(data.error ?? "Conflict");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Failed to commit (${res.status})`);
  }
  return res.json();
}

function PerekProgress({ claimed, cycle }: { claimed: number; cycle: number }) {
  const pct = Math.min(100, Math.round((claimed / 150) * 100));
  const complete = claimed >= 150;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-muted-foreground">Cycle {cycle} — Perakim</span>
        <span className={complete ? "text-primary" : "text-foreground"}>{claimed}/150</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${complete ? "bg-primary" : "bg-primary/70"}`}
        />
      </div>
      {complete && (
        <p className="text-[11px] font-bold text-primary">Book Completed — Cycle {cycle + 1} begins!</p>
      )}
    </div>
  );
}

function CampaignTypeIcon({ type }: { type: string }) {
  if (type === "yahrzeit") {
    return <Flame className="w-5 h-5 text-amber-400" />;
  }
  return <HeartPulse className="w-5 h-5 text-rose-400" />;
}

function CampaignTypeLabel({ type }: { type: string }) {
  if (type === "yahrzeit") {
    return <span className="text-amber-400">Yahrzeit / L'iluy Nishmas</span>;
  }
  return <span className="text-rose-400">Refuah Sheleimah</span>;
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [myPerakim, setMyPerakim] = useState<number[]>([]);

  const commit = useMutation({
    mutationFn: () => commitToPerek(campaign.id),
    onSuccess: (data: any) => {
      setMyPerakim((prev) => [...prev, data.perekNumber]);
      if (data.bookComplete) {
        toast.success("Seyag l'Torah! The whole Sefer Tehillim is covered.", {
          description: "Cycle 2 begins. Keep going!",
        });
      } else {
        toast.success(`You received Perek ${data.perekNumber}.`, {
          description: "May your learning be a merit.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["pulse-campaigns"] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const isYahrzeit = campaign.campaignType === "yahrzeit";
  const borderClass = isYahrzeit ? "hover:border-amber-400/40" : "hover:border-rose-400/40";
  const activeBorder = isYahrzeit ? "border-amber-400/30 bg-amber-400/5" : "border-rose-400/30 bg-rose-400/5";
  const hasCommitted = myPerakim.length > 0;

  return (
    <Card className={`border-border shadow-sm transition-colors ${hasCommitted ? activeBorder : `bg-card ${borderClass}`}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <CampaignTypeIcon type={campaign.campaignType} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                <CampaignTypeLabel type={campaign.campaignType} />
              </span>
            </div>
            <CardTitle className="text-lg leading-tight font-bold">{campaign.personName}</CardTitle>
            <CardDescription className="text-xs">{campaign.title}</CardDescription>
          </div>
          <div className="bg-secondary rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-foreground border border-border/50 shrink-0">
            <Users className="w-3.5 h-3.5 text-muted-foreground" /> {campaign.totalCommitments}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <PerekProgress claimed={campaign.claimedCount} cycle={campaign.cycle} />
        {hasCommitted && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 text-sm font-semibold bg-secondary/40 border border-border/50 rounded-lg px-3 py-2"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Your perakim:{" "}
                <span className="text-primary">
                  {myPerakim.sort((a, b) => a - b).join(", ")}
                </span>
              </span>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full font-semibold"
          variant={hasCommitted ? "secondary" : "default"}
          disabled={!user || commit.isPending}
          onClick={() => commit.mutate()}
        >
          {commit.isPending ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Assigning...</>
          ) : hasCommitted ? (
            <><BookOpen className="w-4 h-4 mr-2" /> Take Another Perek</>
          ) : (
            <><BookOpen className="w-4 h-4 mr-2" /> Commit — Get My Perek</>
          )}
        </Button>
        {hasCommitted && (
          <div className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> Tizku l'mitzvos
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Pulse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["pulse-campaigns"],
    queryFn: fetchCampaigns,
    refetchInterval: 30000,
  });

  const createMut = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-campaigns"] });
      setDialogOpen(false);
      toast.success("Campaign created. The chevra is with you.");
    },
    onError: () => toast.error("Could not create campaign."),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createMut.mutate({
      title: fd.get("title") as string,
      personName: fd.get("personName") as string,
      campaignType: fd.get("campaignType") as string,
    });
  };

  const totalParticipants = campaigns.reduce((s, c) => s + c.totalCommitments, 0);

  return (
    <div className="pb-24">
      <div className="relative h-48 w-full overflow-hidden mb-8 border-b border-border/50">
        <img
          src={pulseHero}
          alt="Community Pulse"
          className="w-full h-full object-cover opacity-60 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-5xl mx-auto flex items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Community Pulse</h1>
            <p className="text-muted-foreground mt-1">The power of the many. See what the chevra needs right now.</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-10 max-w-5xl mx-auto pt-0">

        {/* Ticker */}
        <div className="bg-secondary/30 border border-border/50 rounded-2xl p-6 md:p-8 flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total Perakim committed across all campaigns
            </p>
            <motion.div
              key={totalParticipants}
              initial={{ scale: 1.08, color: "hsl(var(--primary))" }}
              animate={{ scale: 1, color: "hsl(var(--foreground))" }}
              className="text-5xl md:text-6xl font-bold tracking-tighter mt-2"
            >
              {totalParticipants.toLocaleString()}
            </motion.div>
          </div>
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center border border-border shrink-0">
            <Activity className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Type legend */}
        <div className="flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5"><HeartPulse className="w-4 h-4 text-rose-400" /> Refuah Sheleimah</span>
          <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-400" /> Yahrzeit / L'iluy Nishmas</span>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-border/50 pb-4">
            <h2 className="text-xl font-bold tracking-tight">Active Campaigns</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" disabled={!user}>
                  <HandHeart className="w-4 h-4 mr-2" /> Open a Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Open a Community Campaign</DialogTitle>
                  <DialogDescription>
                    Ask the chevra to cover the whole Sefer Tehillim for someone who needs it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="personName">Person's Name</Label>
                    <Input id="personName" name="personName" required placeholder="e.g. Chana bas Rivka" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Additional context (optional)</Label>
                    <Input id="title" name="title" placeholder="e.g. For a speedy recovery" defaultValue="" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaignType">Campaign Type</Label>
                    <Select name="campaignType" required defaultValue="refuah">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refuah">
                          <span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-400" /> Refuah Sheleimah (Healing)</span>
                        </SelectItem>
                        <SelectItem value="yahrzeit">
                          <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-amber-400" /> Yahrzeit / L'iluy Nishmas (Memorial)</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createMut.isPending}>
                      {createMut.isPending ? "Submitting..." : "Open Campaign"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading && (
            <div className="text-center py-16 text-muted-foreground text-sm">Loading campaigns...</div>
          )}

          {!isLoading && campaigns.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <HandHeart className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
              <p className="font-bold text-lg">No active campaigns</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                {user ? "Be the first to open a campaign for the community." : "Log in to open a campaign."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
