import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { geulahActions, getGeulahActionForDate, getGeulahTier, GEULAH_TIERS, type GeulahAction } from "@/data/geulahActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Footprints, Check, Flame, ArrowRight, Heart, MessageCircle, Eye, HandHelping, Hourglass, UserCheck, Sparkles, Moon } from "lucide-react";
import { useShabbos } from "@/hooks/useShabbos";
import { getLifeStage, type LifeStageId } from "@/data/lifeStages";
import { LifeStageSetup, LifeStageBadge } from "@/components/LifeStageSetup";

interface CompletionRecord {
  actionId: number;
  date: string;
}

const CATEGORY_ICON: Record<GeulahAction["category"], typeof Heart> = {
  Kindness: Heart,
  Patience: Hourglass,
  Speech: MessageCircle,
  Respect: UserCheck,
  Mindfulness: Eye,
  Helping: HandHelping,
};

export default function GeulahPage() {
  const today = new Date().toISOString().split("T")[0];
  const todaysAction = useMemo(() => getGeulahActionForDate(new Date()), []);
  const { isShabbos } = useShabbos();
  const [editingStage, setEditingStage] = useState(false);

  const [lifeStageId, setLifeStageId] = useLocalStorage<LifeStageId | null>("btachon:lifeStage", null);
  const [completions, setCompletions] = useLocalStorage<CompletionRecord[]>("geulahCompletions", []);
  const [streak, setStreak] = useLocalStorage("geulahStreak", 0);
  const [lastDate, setLastDate] = useLocalStorage("geulahLastDate", "");

  const stage = getLifeStage(lifeStageId);

  const isCompletedToday = completions.some(c => c.date === today);
  const totalSteps = completions.length;
  const { current: currentTier, next: nextTier } = getGeulahTier(totalSteps);
  const tierProgress = nextTier
    ? ((totalSteps - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const handleSelectStage = (id: LifeStageId) => {
    setLifeStageId(id);
    setEditingStage(false);
    toast.success("Profile updated!", { description: "Your Geulah steps are now personalized." });
  };

  const handleComplete = (actionId: number) => {
    if (completions.some(c => c.date === today && c.actionId === actionId)) return;
    const updated = [...completions, { actionId, date: today }];
    setCompletions(updated);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = streak;
    if (lastDate === today) {
    } else if (lastDate === yesterdayStr) {
      newStreak = streak + 1;
      setStreak(newStreak);
    } else {
      newStreak = 1;
      setStreak(1);
    }
    setLastDate(today);

    const newCount = updated.length;
    const newTier = getGeulahTier(newCount).current;
    if (newTier.name !== currentTier.name) {
      toast.success(`New Level: ${newTier.name}`, { description: newTier.description });
    } else {
      toast.success("One step closer.", { description: "Your action ripples outward. Tizku l'mitzvos." });
    }
  };

  const recent = [...completions].reverse().slice(0, 30);
  const byCategory = completions.reduce<Record<string, number>>((acc, c) => {
    const a = geulahActions.find(x => x.id === c.actionId);
    if (a) acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  const TodayIcon = CATEGORY_ICON[todaysAction.category];

  if (!lifeStageId || editingStage) {
    return (
      <div className="pb-24">
        <div className="relative border-b border-border/50 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <Footprints className="w-3.5 h-3.5" /> Step Closer to Geulah
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Small actions. A bigger world.</h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">
              Tell us who you are so your daily step speaks to your actual life.
            </p>
          </div>
        </div>
        <LifeStageSetup onSelect={handleSelectStage} />
      </div>
    );
  }

  const personaExample = stage?.geulahExamples[todaysAction.category];
  const geulahLens = stage?.geulahLens;

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative border-b border-border/50 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <Footprints className="w-full h-full text-primary" />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-6 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <Footprints className="w-3.5 h-3.5" /> Step Closer to Geulah
            </div>
            {stage && <LifeStageBadge stage={stage} onEdit={() => setEditingStage(true)} />}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Small actions. A bigger world.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            {geulahLens || "Every kind word, every held tongue, every patient breath — they are the bricks of the third Beis Hamikdash."}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Today's Action */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border-b border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                  <TodayIcon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="border-primary/30 text-primary">{todaysAction.category}</Badge>
                    <span className="text-xs text-muted-foreground font-medium">Today's step</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {todaysAction.title}
                  </h2>
                </div>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Do this today</p>
                <p className="text-base md:text-lg leading-relaxed text-foreground">
                  {todaysAction.action}
                </p>
              </div>

              {/* Persona-specific example */}
              {personaExample && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
                    For you as a {stage!.label}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {personaExample}
                  </p>
                </div>
              )}

              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Why it matters</p>
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground italic">
                  {todaysAction.why}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isCompletedToday ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">One step closer.</p>
                      <p className="text-sm text-muted-foreground">The world is a little better because of you today.</p>
                    </div>
                  </motion.div>
                ) : isShabbos ? (
                  <motion.div key="shabbos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-secondary/40 border border-border/50 rounded-xl">
                    <Moon className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">Shabbos Mode</p>
                      <p className="text-xs text-muted-foreground">Live the geulah today. Tap again Motzei Shabbos.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button size="lg" onClick={() => handleComplete(todaysAction.id)} className="w-full h-14 text-base font-bold">
                      <Check className="w-5 h-5 mr-2" /> I Did It Today
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold tracking-tight">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Footprints className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Steps Taken</p>
                <p className="text-2xl font-bold tracking-tight">{totalSteps}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Level</p>
                <p className="text-base font-bold tracking-tight leading-tight mt-0.5">{currentTier.name}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geulah Path */}
        <Card className="border-border shadow-sm overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-[0.04] pointer-events-none">
            <Footprints className="w-64 h-64 text-primary -mr-8 -mt-8" />
          </div>
          <CardHeader className="pb-4 relative">
            <CardTitle className="text-lg flex items-center gap-2">
              <Footprints className="w-5 h-5 text-primary" /> The Path
            </CardTitle>
            <CardDescription>{currentTier.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 relative">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium text-foreground">{currentTier.name}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {nextTier ? `${nextTier.min - totalSteps} steps to ${nextTier.name}` : "All levels reached"}
                </span>
              </div>
              <Progress value={Math.max(2, tierProgress)} className="h-2 bg-secondary" />
            </div>
            <div className="space-y-2 pt-2">
              {GEULAH_TIERS.map((tier, i) => {
                const reached = totalSteps >= tier.min;
                const isCurrent = tier.name === currentTier.name;
                return (
                  <div
                    key={tier.name}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      isCurrent ? "border-primary bg-primary/10" : reached ? "border-border/50 bg-secondary/30" : "border-border/30 bg-transparent opacity-60"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${reached ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 flex-wrap">
                        <p className={`font-bold text-sm ${isCurrent ? "text-primary" : reached ? "text-foreground" : "text-muted-foreground"}`}>{tier.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{tier.min}+ steps</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tier.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Browse / History / By Category */}
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="browse">All Steps</TabsTrigger>
            <TabsTrigger value="history">History ({completions.length})</TabsTrigger>
            <TabsTrigger value="categories">By Middah</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {geulahActions.map(a => {
                const done = completions.some(c => c.actionId === a.id);
                return <ActionCard key={a.id} action={a} done={done} onComplete={handleComplete} personaExample={stage?.geulahExamples[a.category]} stageName={stage?.label} />;
              })}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {recent.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <Footprints className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="font-semibold text-foreground">No steps yet</p>
                <p className="text-sm text-muted-foreground mt-1">Complete today's action to start your journey.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((c, i) => {
                  const a = geulahActions.find(x => x.id === c.actionId);
                  if (!a) return null;
                  const Icon = CATEGORY_ICON[a.category];
                  return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{c.date} · {a.category}</p>
                        </div>
                      </div>
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(CATEGORY_ICON) as Array<keyof typeof CATEGORY_ICON>).map(cat => {
                const Icon = CATEGORY_ICON[cat];
                const count = byCategory[cat] || 0;
                return (
                  <Card key={cat} className="border-border">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-bold text-sm">{cat}</p>
                      <p className="text-2xl font-bold tracking-tight mt-1">{count}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-0.5">steps</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ActionCard({ action, done, onComplete, personaExample, stageName }: {
  action: GeulahAction;
  done: boolean;
  onComplete: (id: number) => void;
  personaExample?: string;
  stageName?: string;
}) {
  const Icon = CATEGORY_ICON[action.category];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors cursor-pointer flex items-start gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] py-0 border-border/50">{action.category}</Badge>
              {done && <Check className="w-3.5 h-3.5 text-primary" />}
            </div>
            <p className="font-semibold text-sm">{action.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{action.action}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors mt-1.5 shrink-0" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <Badge variant="outline" className="border-primary/30 text-primary self-start mb-1">{action.category}</Badge>
          <DialogTitle className="text-2xl">{action.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Do this today</p>
            <p className="text-sm leading-relaxed">{action.action}</p>
          </div>
          {personaExample && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
                For you as a {stageName}
              </p>
              <p className="text-sm leading-relaxed">{personaExample}</p>
            </div>
          )}
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Why it matters</p>
            <p className="text-sm leading-relaxed italic">{action.why}</p>
          </div>
          <Button onClick={() => onComplete(action.id)} disabled={done} className="w-full">
            <Check className="w-4 h-4 mr-2" /> {done ? "Already Done" : "Mark Complete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
