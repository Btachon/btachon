import { useEffect, useState, useMemo } from "react";
import { useAuth, getStoredJwt } from "@workspace/replit-auth-web";
import { useGetProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useGrowth } from "@/hooks/useGrowth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { quotes } from "@/data/quotes";
import { getMitzvahForDate } from "@/data/mitzvos";
import { useShabbos } from "@/hooks/useShabbos";
import { useHebrewDate } from "@/hooks/useHebrewDate";
import { getLifeStage, type LifeStageId } from "@/data/lifeStages";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Clock, Flame, CheckCircle2, Circle, BookOpen,
  TrendingUp, ChevronRight, ShieldAlert, Star, Sparkles, Zap
} from "lucide-react";
import { toast } from "sonner";
import dashboardHero from "@/assets/dashboard-hero.png";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Shabbos"];

const TIER_DEFS = [
  { name: "Growing",    min: 0,   max: 15,  next: "Awakening", incentive: "Build a streak to keep climbing" },
  { name: "Awakening",  min: 15,  max: 25,  next: "Striving",  incentive: "25 pts unlocks weekly Pulse insights" },
  { name: "Striving",   min: 25,  max: 50,  next: "Steadfast", incentive: "50 pts earns your Connect badge" },
  { name: "Steadfast",  min: 50,  max: 100, next: "Elite",     incentive: "100 pts unlocks mentor status in Connect" },
  { name: "Elite",      min: 100, max: null, next: null,       incentive: "You are at the highest level. Lead others." },
];

function getTierDef(score: number) {
  return TIER_DEFS.find(t => score < (t.max ?? Infinity)) ?? TIER_DEFS[TIER_DEFS.length - 1];
}

function tierProgress(score: number, def: typeof TIER_DEFS[0]) {
  if (!def.max) return 1;
  return Math.min(1, (score - def.min) / (def.max - def.min));
}

function formatTime(totalMinutes: number) {
  if (totalMinutes < 60) return { value: String(Math.max(0, Math.round(totalMinutes))), unit: "min" };
  const hrs = (totalMinutes / 60).toFixed(1).replace(/\.0$/, "");
  return { value: hrs, unit: "hrs" };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useGetProfile({ query: { enabled: !!user, queryKey: getGetProfileQueryKey() } });
  const { totalMinutes, todayMinutes } = useTimeTracking();
  const { growthPoints, currentStreak, award } = useGrowth();
  const [lifeStageId] = useLocalStorage<LifeStageId | null>("btachon:lifeStage", null);
  const stage = getLifeStage(lifeStageId);

  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
    setQuoteIndex(day % quotes.length);
  }, []);
  const quote = quotes[quoteIndex] || quotes[0];

  const now = new Date();
  const dayIndex = now.getDay();
  const dayName = DAYS[dayIndex];
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const todayStr = now.toISOString().split("T")[0];

  const displayName = profile?.displayName || user?.firstName || "Friend";
  const { isShabbos } = useShabbos();
  const { hebrewDate, hebrewYear, parsha } = useHebrewDate();
  const todaysMitzvah = useMemo(() => getMitzvahForDate(new Date()), []);

  const tierScore = growthPoints;
  const tierDef = getTierDef(tierScore);
  const progress = tierProgress(tierScore, tierDef);
  const streak = currentStreak;

  const [mitzvahCompletions, setMitzvahCompletions] = useLocalStorage<{ mitzvahId: number; date: string }[]>("mitzvahCompletions", []);
  const mitzvahDoneToday = (Array.isArray(mitzvahCompletions) ? mitzvahCompletions : []).some(
    c => c.date === todayStr && c.mitzvahId === todaysMitzvah.id
  );
  const handleMitzvahDone = async () => {
    if (mitzvahDoneToday || isShabbos) return;
    setMitzvahCompletions(prev => [...(Array.isArray(prev) ? prev : []), { mitzvahId: todaysMitzvah.id, date: todayStr }]);
    const r = await award("daily_practice_mitzvah", `${todayStr}:${todaysMitzvah.id}`);
    toast.success("Mitzvah complete.", { description: r?.awarded ? `+${r.awarded} growth pts. Tizku l'mitzvos.` : "Tizku l'mitzvos." });
  };

  const [learnedDates, setLearnedDates] = useLocalStorage<string[]>("dailyLearnDone", []);
  const learnedToday = (Array.isArray(learnedDates) ? learnedDates : []).includes(todayStr);
  const handleLearnDone = async () => {
    if (learnedToday || isShabbos) return;
    setLearnedDates(prev => [...(Array.isArray(prev) ? prev : []), todayStr]);
    const r = await award("daily_practice_learn", todayStr);
    toast.success("Learning marked complete.", { description: r?.awarded ? `+${r.awarded} growth pts. Torah study is equal to all.` : "Torah study is equal to all." });
  };

  const [geulahDates, setGeulahDates] = useLocalStorage<string[]>("dailyGeulahDone", []);
  const geulahToday = (Array.isArray(geulahDates) ? geulahDates : []).includes(todayStr);
  const handleGeulahDone = async () => {
    if (geulahToday || isShabbos) return;
    setGeulahDates(prev => [...(Array.isArray(prev) ? prev : []), todayStr]);
    const r = await award("daily_practice_geulah", todayStr);
    toast.success("Geulah action complete.", { description: r?.awarded ? `+${r.awarded} growth pts.` : "Every step counts." });
  };

  const [chaiDates, setChaiDates] = useLocalStorage<string[]>("dailyChaiDone", []);
  const chaiToday = (Array.isArray(chaiDates) ? chaiDates : []).includes(todayStr);
  const handleChaiDone = async () => {
    if (chaiToday || isShabbos) return;
    setChaiDates(prev => [...(Array.isArray(prev) ? prev : []), todayStr]);
    const r = await award("daily_practice_chai", todayStr);
    toast.success("613 Chai habits complete.", { description: r?.awarded ? `+${r.awarded} growth pts. Keep building.` : "Keep building." });
  };

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const today = formatTime(todayMinutes);
  const total = formatTime(totalMinutes);

  const REMINDERS = [
    {
      label: "Learn something today",
      sublabel: stage ? stage.defaultHabits[2] ?? "Watch a shiur or study a source" : "Watch a shiur or study a source",
      done: learnedToday,
      onMark: handleLearnDone,
      href: "/learn",
    },
    {
      label: "613 Chai habits",
      sublabel: stage ? stage.defaultHabits[0] ?? "Complete your daily habit stack" : "Complete your daily habit stack",
      done: chaiToday,
      onMark: handleChaiDone,
      href: "/grow",
    },
    {
      label: "Geulah action",
      sublabel: stage ? stage.geulahLens.split(".")[0] + "." : "Take one step toward redemption",
      done: geulahToday,
      onMark: handleGeulahDone,
      href: "/grow",
    },
  ];

  const doneCount = REMINDERS.filter(r => r.done).length;

  const [progressShared, setProgressShared] = useState(false);
  const handleShareProgress = async () => {
    try {
      const BASE = import.meta.env.BASE_URL as string;
      const token = getStoredJwt();
      const res = await fetch(`${BASE}api/accountability-partner/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: "include",
        body: JSON.stringify({ completed: doneCount, total: REMINDERS.length }),
      });
      if (res.ok) {
        setProgressShared(true);
        toast.success("Progress shared with your partner!", { description: "They'll get a notification and email." });
      } else {
        const b = await res.json().catch(() => ({})) as { error?: string };
        if (b.error === "No accountability partner set") {
          toast("No partner set yet", { description: "Go to Connect to set an accountability partner." });
        } else {
          toast.error("Could not share progress");
        }
      }
    } catch {
      toast.error("Could not share progress");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">

      {/* Hero background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src={dashboardHero} alt="" className="w-full h-full object-cover object-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col gap-5 px-5 py-10 max-w-xl mx-auto w-full pb-28">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {dayName} · {dateStr}
          </p>
          {hebrewDate ? (
            <p className="text-xs font-semibold text-primary/80 tracking-wide">
              {hebrewDate}{hebrewYear ? ` · ${hebrewYear}` : ""}
            </p>
          ) : null}
          <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
            {greeting}, <span className="text-primary">{displayName}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
            {typeof streak === "number" && streak > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{streak} day streak</span>
              </div>
            )}
            {parsha && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5 text-primary/70" />
                <span className="font-medium">Parshat {parsha}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Growth Level Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm px-7 py-6 shadow-inner space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Your Level</p>
              <p className="text-4xl font-black tracking-tight text-foreground leading-none">{tierDef.name}</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{Math.round(tierScore)} pts total</p>
            </div>
            <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
          </div>

          {tierDef.next && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">{tierDef.name}</span>
                  <span className="text-primary">{tierDef.next}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(progress * 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{tierDef.incentive}</p>
            </>
          )}
          {!tierDef.next && (
            <p className="text-xs text-primary font-bold">{tierDef.incentive}</p>
          )}
        </motion.div>

        {/* Mitzvah of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          onClick={handleMitzvahDone}
          className={`rounded-2xl border px-5 py-5 cursor-pointer transition-all backdrop-blur-sm ${
            mitzvahDoneToday
              ? "bg-primary/10 border-primary/30"
              : "bg-card/60 border-border/40 hover:border-primary/30"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Mitzvah of the Day</p>
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-snug text-foreground">{todaysMitzvah.title}</p>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{todaysMitzvah.explanation}</p>
              {!mitzvahDoneToday && (
                <p className="text-[11px] text-primary font-semibold mt-2 italic">{todaysMitzvah.todayAction}</p>
              )}
            </div>
            <div className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
              mitzvahDoneToday
                ? "bg-primary border-primary"
                : "border-border bg-background/60"
            }`}>
              {mitzvahDoneToday
                ? <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                : <Circle className="w-5 h-5 text-muted-foreground" />
              }
            </div>
          </div>
        </motion.div>

        {/* Today's Practice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today's Practice</p>
              {stage && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-primary/80 bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" />
                  {stage.label}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-primary">{doneCount} / {REMINDERS.length} done</span>
          </div>

          {REMINDERS.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                r.done
                  ? "bg-primary/8 border-primary/25"
                  : "bg-card/60 border-border/40 hover:border-border"
              } backdrop-blur-sm`}
            >
              <button
                onClick={r.onMark}
                disabled={r.done || isShabbos}
                className="shrink-0 focus:outline-none"
              >
                {r.done
                  ? <CheckCircle2 className="w-5 h-5 text-primary" />
                  : <Circle className="w-5 h-5 text-muted-foreground/50" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug ${r.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {r.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{r.sublabel}</p>
              </div>
              {r.href && !r.done && (
                <Link href={r.href}>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              )}
            </div>
          ))}
        </motion.div>

        {/* Partner progress share */}
        {doneCount > 0 && !progressShared && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleShareProgress}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm cursor-pointer hover:border-primary/40 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Let your partner know</p>
              <p className="text-xs text-muted-foreground">{doneCount}/{REMINDERS.length} practices done — share with your accountability partner</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </motion.div>
        )}
        {progressShared && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm font-medium text-primary">Progress shared with your partner</p>
          </div>
        )}

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {today.value} <span className="text-xs font-normal text-muted-foreground">{today.unit}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm">
            <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {total.value} <span className="text-xs font-normal text-muted-foreground">{total.unit}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick actions row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="grid grid-cols-2 gap-3"
        >
          <Link href="/learn">
            <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer">
              <BookOpen className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">Learn</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </div>
          </Link>
          <Link href="/blocker">
            <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all cursor-pointer">
              <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">Blocker</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
            </div>
          </Link>
        </motion.div>

        {/* Thought of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
          className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm px-6 py-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Thought of the Day</p>
          {stage && (
            <p className="text-[10px] text-primary/70 font-semibold mb-2 uppercase tracking-widest">{stage.label} focus</p>
          )}
          <p className="text-sm leading-relaxed font-medium text-foreground">"{quote.text}"</p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">— {quote.source}</p>
          {stage && (
            <p className="text-xs text-primary/80 mt-3 font-medium italic border-t border-border/30 pt-3">{stage.chaiWelcome}</p>
          )}
        </motion.div>

        {/* Personalize CTA — shown only when no life stage is set */}
        {!stage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.44 }}
          >
            <Link href="/grow">
              <div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm px-5 py-4 cursor-pointer hover:border-primary/40 transition-all">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">Personalize your experience</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Pick your life stage in 613 Chai to tailor your daily habits and reminders.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          </motion.div>
        )}


      </div>
    </div>
  );
}
