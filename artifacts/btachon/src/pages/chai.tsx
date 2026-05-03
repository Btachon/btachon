import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Flame, Plus, Trash2, BellRing, Target, RefreshCw, Trophy } from "lucide-react";
import { LIFE_STAGES, getLifeStage, type LifeStageId } from "@/data/lifeStages";
import { LifeStageSetup, LifeStageBadge } from "@/components/LifeStageSetup";
import chaiHero from "@/assets/chai-hero.png";

const CHAI_CYCLE_TIERS = [
  { name: "Awakening", cycles: 0, label: "Beginning the journey" },
  { name: "Chai", cycles: 1, label: "One full 18-day cycle" },
  { name: "Silver", cycles: 3, label: "Three cycles of dedication" },
  { name: "Gold", cycles: 8, label: "Eight cycles — real commitment" },
  { name: "Platinum", cycles: 18, label: "Eighteen cycles — life-transforming" },
  { name: "Taryag", cycles: 36, label: "Thirty-six cycles — extraordinary" },
] as const;

function getCycleTier(cycles: number) {
  let current: typeof CHAI_CYCLE_TIERS[number] = CHAI_CYCLE_TIERS[0];
  for (const tier of CHAI_CYCLE_TIERS) {
    if (cycles >= tier.cycles) current = tier;
  }
  const next = CHAI_CYCLE_TIERS.find(t => t.cycles > cycles);
  return { current, next };
}

export default function Chai() {
  const [partnerName] = useLocalStorage("partnerName", "");
  const [streak, setStreak] = useLocalStorage("chaiStreak", 0);
  const [peakStreak, setPeakStreak] = useLocalStorage("chaiPeakStreak", 0);
  const [lifeStageId, setLifeStageId] = useLocalStorage<LifeStageId | null>("btachon:lifeStage", null);
  const [editingStage, setEditingStage] = useState(false);

  const completedCycles = Math.floor(peakStreak / 18);
  const { current: cycleTier, next: nextCycleTier } = getCycleTier(completedCycles);
  const daysIntoCurrentCycle = peakStreak % 18;
  const cycleProgressPercent = nextCycleTier
    ? ((completedCycles - cycleTier.cycles) / (nextCycleTier.cycles - cycleTier.cycles)) * 100
    : 100;

  const stage = getLifeStage(lifeStageId);
  const today = new Date().toISOString().split("T")[0];

  const buildDefaultHabits = (s: typeof stage) => {
    if (!s) return [
      { id: "h1", text: "Say a perek of Tehillim before bed", completed: false },
      { id: "h2", text: "Learn something today", completed: false },
      { id: "h3", text: "Remember Negel Vasser", completed: false },
    ];
    return s.defaultHabits.map((text, i) => ({ id: `h${i}`, text, completed: false }));
  };

  const [habits, setHabits] = useLocalStorage(`btachon:habits:${lifeStageId ?? "default"}:${today}`, buildDefaultHabits(stage));
  const [newHabit, setNewHabit] = useState("");
  const [completedToday, setCompletedToday] = useLocalStorage(`btachon:completed:${today}`, false);

  const safeHabits = Array.isArray(habits) ? habits : buildDefaultHabits(stage);

  const handleToggle = (id: string) => {
    setHabits(prev => {
      const arr = Array.isArray(prev) ? prev : buildDefaultHabits(stage);
      return arr.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
    });
  };

  useEffect(() => {
    const allDone = safeHabits.length > 0 && safeHabits.every(h => h.completed);
    if (allDone && !completedToday) {
      setCompletedToday(true);
      setStreak(prev => {
        const newStreak = prev + 1;
        setPeakStreak(peak => {
          const newPeak = Math.max(peak, newStreak);
          const prevCycles = Math.floor(peak / 18);
          const newCycles = Math.floor(newPeak / 18);
          if (newCycles > prevCycles) {
            const { current: newTier } = getCycleTier(newCycles);
            toast.success(`Cycle ${newCycles} complete — ${newTier.name}!`, {
              description: newTier.label,
            });
          } else {
            toast.success("All habits complete!", { description: "Your streak grows. Keep going." });
          }
          return newPeak;
        });
        return newStreak;
      });
    } else if (!allDone && completedToday) {
      setCompletedToday(false);
      setStreak(s => Math.max(0, s - 1));
    }
  }, [habits, completedToday, setCompletedToday, setStreak, setPeakStreak]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits(prev => {
      const arr = Array.isArray(prev) ? prev : buildDefaultHabits(stage);
      return [...arr, { id: `h${Date.now()}`, text: newHabit.trim(), completed: false }];
    });
    setNewHabit("");
  };

  const handleRemoveHabit = (id: string) => {
    setHabits(prev => {
      const arr = Array.isArray(prev) ? prev : buildDefaultHabits(stage);
      return arr.filter(h => h.id !== id);
    });
  };

  const handleSelectStage = (id: LifeStageId) => {
    setLifeStageId(id);
    setEditingStage(false);
    toast.success("Profile updated!", { description: "Your habits are now personalized for you." });
  };

  const handleResetToDefaults = () => {
    setHabits(buildDefaultHabits(stage));
    toast.success("Habits reset to your personalized defaults.");
  };

  const completedCount = safeHabits.filter(h => h.completed).length;
  const completionPercent = safeHabits.length ? (completedCount / safeHabits.length) * 100 : 0;

  if (!lifeStageId || editingStage) {
    return (
      <div className="pb-24">
        <div className="relative h-36 w-full overflow-hidden border-b border-border/50">
          <img src={chaiHero} alt="613 Chai" className="w-full h-full object-cover opacity-50 object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">613 Chai</h1>
            <p className="text-muted-foreground mt-1 text-sm">Daily habits built for your life.</p>
          </div>
        </div>
        <LifeStageSetup onSelect={handleSelectStage} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="relative h-44 w-full overflow-hidden border-b border-border/50">
        <img src={chaiHero} alt="613 Chai" className="w-full h-full object-cover opacity-50 object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex items-end justify-between">
          <div>
            <div className="mb-2">
              <LifeStageBadge stage={stage!} onEdit={() => setEditingStage(true)} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">613 Chai</h1>
            <p className="text-muted-foreground mt-1 text-sm">{stage!.chaiWelcome}</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-2 text-muted-foreground">{streak} Day Streak</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">

            {/* Progress bar */}
            {safeHabits.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Today's Progress</span>
                  <span>{completedCount}/{safeHabits.length} done</span>
                </div>
                <Progress value={completionPercent} className="h-2 bg-secondary" />
              </div>
            )}

            <Card className="shadow-sm border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" /> Today's Habits
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground gap-1.5 h-8"
                    onClick={handleResetToDefaults}
                  >
                    <RefreshCw className="w-3 h-3" /> Reset to defaults
                  </Button>
                </div>
                <CardDescription>Check these off to maintain your streak.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {safeHabits.map(habit => (
                    <motion.div
                      key={habit.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative shrink-0">
                          <Checkbox
                            id={habit.id}
                            checked={habit.completed}
                            onCheckedChange={() => handleToggle(habit.id)}
                            className="w-5 h-5 rounded-[4px] border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                          />
                          <AnimatePresence>
                            {habit.completed && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-primary rounded-[4px] pointer-events-none"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                        <label
                          htmlFor={habit.id}
                          className={`text-sm font-medium leading-snug cursor-pointer select-none transition-colors ${habit.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {habit.text}
                        </label>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHabit(habit.id)}
                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all shrink-0 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}

                  {safeHabits.length === 0 && (
                    <div className="p-6 text-center border border-dashed border-border rounded-xl">
                      <p className="text-sm text-muted-foreground">No habits yet. Add one below or reset to defaults.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddHabit} className="flex gap-2 pt-4 mt-4 border-t border-border/50">
                  <Input
                    value={newHabit}
                    onChange={e => setNewHabit(e.target.value)}
                    placeholder="Add your own habit..."
                    className="flex-1 bg-secondary/20 border-border/50"
                  />
                  <Button type="submit" variant="secondary" className="px-5">
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Accountability partner */}
            {partnerName ? (
              <Card className="shadow-sm border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Accountability Partner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-foreground text-lg">
                      {partnerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{partnerName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Your chevrusa</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => toast("Partner Nudged", { description: `${partnerName} will receive a reminder.` })}
                  >
                    <BellRing className="w-4 h-4 mr-2" /> Nudge Partner
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-sm border-border border-dashed">
                <CardContent className="p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Accountability Partner</p>
                  <p className="text-sm text-muted-foreground">Set one in Settings to add a chevrusa.</p>
                </CardContent>
              </Card>
            )}

            {/* Cycle Tier */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Cycle Tier
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary px-2.5">
                    {cycleTier.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{completedCycles} cycle{completedCycles !== 1 ? "s" : ""} complete</span>
                    <span>{nextCycleTier ? `${nextCycleTier.cycles - completedCycles} to ${nextCycleTier.name}` : "All tiers reached"}</span>
                  </div>
                  <Progress value={Math.max(2, cycleProgressPercent)} className="h-1.5 bg-secondary" />
                </div>

                <div className="space-y-1.5">
                  {CHAI_CYCLE_TIERS.map(tier => {
                    const reached = completedCycles >= tier.cycles;
                    const isCurrent = tier.name === cycleTier.name;
                    return (
                      <div
                        key={tier.name}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-colors ${
                          isCurrent
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : reached
                            ? "border-border/40 bg-secondary/40 text-foreground"
                            : "border-transparent bg-transparent text-muted-foreground/40"
                        }`}
                      >
                        <span className="font-bold">{tier.name}</span>
                        <span className="font-medium">{tier.cycles === 0 ? "Start" : `${tier.cycles} cycle${tier.cycles !== 1 ? "s" : ""}`}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                  Each 18 consecutive days = 1 cycle.{" "}
                  {completedCycles === 0
                    ? `${18 - daysIntoCurrentCycle} days until your first cycle.`
                    : daysIntoCurrentCycle === 0
                    ? "Keep the streak alive — you're at the start of a new cycle."
                    : `${18 - daysIntoCurrentCycle} days into the next cycle.`}
                </p>
              </CardContent>
            </Card>

            {/* All life stages quick switch */}
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold tracking-wider uppercase text-muted-foreground">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {LIFE_STAGES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStage(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        s.id === lifeStageId
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
