import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { mitzvos, getMitzvahForDate, getMitzvahAction, getTierForCount, TIER_THRESHOLDS, type Mitzvah } from "@/data/mitzvos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles, Check, Bookmark, BookmarkCheck, Flame, Trophy, Calendar, ArrowRight, Award, Moon } from "lucide-react";
import mitzvahHero from "@/assets/mitzvah-hero.png";
import { useShabbos } from "@/hooks/useShabbos";

interface CompletionRecord {
  mitzvahId: number;
  date: string;
}

export default function MitzvahPage() {
  const today = new Date().toISOString().split("T")[0];
  const todaysMitzvah = useMemo(() => getMitzvahForDate(new Date()), []);
  const profileType = useMemo(() => localStorage.getItem("btachon:profileType") || "", []);
  const { isShabbos } = useShabbos();

  const [completions, setCompletions] = useLocalStorage<CompletionRecord[]>("mitzvahCompletions", []);
  const [saved, setSaved] = useLocalStorage<number[]>("savedMitzvos", []);
  const [streak, setStreak] = useLocalStorage("mitzvahStreak", 0);
  const [lastCompletedDate, setLastCompletedDate] = useLocalStorage("mitzvahLastDate", "");

  const isCompletedToday = completions.some(c => c.date === today);
  const totalCompletions = completions.length;
  const uniqueMitzvosDone = new Set(completions.map(c => c.mitzvahId)).size;
  const { current: currentTier, next: nextTier } = getTierForCount(uniqueMitzvosDone);

  const tierProgressPercent = nextTier
    ? ((uniqueMitzvosDone - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const handleComplete = (mitzvahId: number) => {
    const alreadyToday = completions.some(c => c.date === today && c.mitzvahId === mitzvahId);
    if (alreadyToday) return;

    setCompletions(prev => [...prev, { mitzvahId, date: today }]);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastCompletedDate === yesterdayStr || lastCompletedDate === today) {
      if (lastCompletedDate !== today) setStreak(s => s + 1);
    } else {
      setStreak(1);
    }
    setLastCompletedDate(today);

    const newTotal = uniqueMitzvosDone + (completions.some(c => c.mitzvahId === mitzvahId) ? 0 : 1);
    const newTier = getTierForCount(newTotal).current;
    if (newTier.name !== currentTier.name) {
      toast.success(`New Tier: ${newTier.name}`, {
        description: `You've completed ${newTotal} unique mitzvos. Keep climbing.`,
      });
    } else {
      toast.success("Mitzvah complete.", {
        description: "Your streak grows. Tizku l'mitzvos.",
      });
    }
  };

  const toggleSaved = (id: number) => {
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const recentCompletions = [...completions].reverse().slice(0, 30);
  const savedMitzvos = mitzvos.filter(m => saved.includes(m.id));

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-48 w-full overflow-hidden mb-8 border-b border-border/50">
        <img 
          src={mitzvahHero} 
          alt="Mitzvah of the Day" 
          className="w-full h-full object-cover opacity-60 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-5xl mx-auto flex items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Mitzvah of the Day
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              One mitzvah today. One step closer.
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Small. Doable. Real. Build a lifetime of mitzvos one day at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-6 pt-0">
        {/* Today's Mitzvah Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8 border-b border-border/50">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-primary/30 text-primary">{todaysMitzvah.category}</Badge>
                    <span className="text-xs text-muted-foreground font-medium">Today</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {todaysMitzvah.title}
                  </h2>
                  {todaysMitzvah.source && (
                    <p className="text-xs text-muted-foreground mt-2 font-medium">{todaysMitzvah.source}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSaved(todaysMitzvah.id)}
                  className="text-muted-foreground hover:text-primary shrink-0"
                  aria-label="Save"
                >
                  {saved.includes(todaysMitzvah.id) ? <BookmarkCheck className="w-5 h-5 text-primary" /> : <Bookmark className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">In one minute</p>
                <p className="text-base md:text-lg leading-relaxed text-foreground">
                  {todaysMitzvah.explanation}
                </p>
              </div>

              <div className="border-t border-border/50 pt-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Do it today</p>
                <p className="text-base md:text-lg leading-relaxed text-foreground italic">
                  {getMitzvahAction(todaysMitzvah, profileType)}
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
                      <p className="font-bold text-foreground">Done for today.</p>
                      <p className="text-sm text-muted-foreground">Come back tomorrow for the next one.</p>
                    </div>
                  </motion.div>
                ) : isShabbos ? (
                  <motion.div key="shabbos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 bg-secondary/40 border border-border/50 rounded-xl">
                    <Moon className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground text-sm">Shabbos Mode</p>
                      <p className="text-xs text-muted-foreground">Streak frozen. Reflect, don't tap.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button
                      size="lg"
                      onClick={() => handleComplete(todaysMitzvah.id)}
                      className="w-full h-14 text-base font-bold"
                    >
                      <Check className="w-5 h-5 mr-2" /> Mark Complete
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
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
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Done</p>
                <p className="text-2xl font-bold tracking-tight">{totalCompletions}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unique Mitzvos</p>
                <p className="text-2xl font-bold tracking-tight">{uniqueMitzvosDone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Progression */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" /> The Long Journey
                </CardTitle>
                <CardDescription>613 mitzvos is a lifetime. Each tier is a milestone — not a finish line.</CardDescription>
              </div>
              <Badge variant="outline" className="text-base font-bold px-4 py-1.5 border-primary/30 text-primary">
                {currentTier.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium text-foreground">{currentTier.name}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {nextTier ? `${nextTier.min - uniqueMitzvosDone} to ${nextTier.name}` : "All tiers reached"}
                </span>
              </div>
              <Progress value={Math.max(2, tierProgressPercent)} className="h-2 bg-secondary" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 pt-2">
              {TIER_THRESHOLDS.map(tier => {
                const reached = uniqueMitzvosDone >= tier.min;
                const isCurrent = tier.name === currentTier.name;
                return (
                  <div
                    key={tier.name}
                    className={`p-2.5 rounded-lg text-center border transition-colors ${
                      isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : reached
                        ? "border-border/50 bg-secondary/50 text-foreground"
                        : "border-border/30 bg-transparent text-muted-foreground/50"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider truncate">{tier.name}</p>
                    <p className="text-xs font-semibold mt-0.5">{tier.min}+</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Browse / History / Saved */}
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="history">History ({totalCompletions})</TabsTrigger>
            <TabsTrigger value="saved">Saved ({saved.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mitzvos.map(m => {
                const done = completions.some(c => c.mitzvahId === m.id);
                return <MitzvahListItem key={m.id} mitzvah={m} done={done} saved={saved.includes(m.id)} onToggleSaved={toggleSaved} onComplete={handleComplete} />;
              })}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {recentCompletions.length === 0 ? (
              <EmptyState icon={Calendar} title="No completions yet" subtitle="Complete today's mitzvah to start your journey." />
            ) : (
              <div className="space-y-2">
                {recentCompletions.map((c, i) => {
                  const m = mitzvos.find(x => x.id === c.mitzvahId);
                  if (!m) return null;
                  return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{c.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">{m.category}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            {savedMitzvos.length === 0 ? (
              <EmptyState icon={Bookmark} title="Nothing saved yet" subtitle="Tap the bookmark on any mitzvah to save it for later." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedMitzvos.map(m => {
                  const done = completions.some(c => c.mitzvahId === m.id);
                  return <MitzvahListItem key={m.id} mitzvah={m} done={done} saved onToggleSaved={toggleSaved} onComplete={handleComplete} />;
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MitzvahListItem({ mitzvah, done, saved, onToggleSaved, onComplete }: { mitzvah: Mitzvah; done: boolean; saved: boolean; onToggleSaved: (id: number) => void; onComplete: (id: number) => void; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors cursor-pointer flex items-start justify-between gap-3 group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-[10px] py-0 border-border/50">{mitzvah.category}</Badge>
              {done && <Check className="w-3.5 h-3.5 text-primary" />}
            </div>
            <p className="font-semibold text-sm text-foreground truncate">{mitzvah.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{mitzvah.explanation}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors mt-1 shrink-0" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-primary/30 text-primary">{mitzvah.category}</Badge>
          </div>
          <DialogTitle className="text-2xl">{mitzvah.title}</DialogTitle>
          {mitzvah.source && <DialogDescription className="text-xs">{mitzvah.source}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">In one minute</p>
            <p className="text-sm leading-relaxed">{mitzvah.explanation}</p>
          </div>
          <div className="border-t border-border/50 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Do it today</p>
            <p className="text-sm leading-relaxed italic">{getMitzvahAction(mitzvah, localStorage.getItem("btachon:profileType") || "")}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => onComplete(mitzvah.id)} disabled={done} className="flex-1">
              <Check className="w-4 h-4 mr-2" /> {done ? "Already Done" : "Mark Complete"}
            </Button>
            <Button variant="outline" size="icon" onClick={() => onToggleSaved(mitzvah.id)}>
              {saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof Calendar; title: string; subtitle: string }) {
  return (
    <div className="border border-dashed border-border rounded-xl p-12 text-center">
      <Icon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}
