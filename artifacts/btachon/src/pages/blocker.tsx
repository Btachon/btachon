import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { perakim } from "@/data/perakim";
import { prayers } from "@/data/prayers";
import { mishnayos } from "@/data/mishnayos";
import { halachos } from "@/data/halachos";
import { getMitzvahForDate } from "@/data/mitzvos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Shield, ArrowRight, LockOpen, Dumbbell, BookOpen,
  Sparkles, Moon, Power, Check, X, ShieldAlert
} from "lucide-react";
import { useShabbos } from "@/hooks/useShabbos";
import { formatTimeInTz } from "@/lib/shabbos";
import { useLocation } from "wouter";
import blockerHero from "@/assets/blocker-hero.png";

const GATEWAY_OPTIONS = [
  "Perek 121", "Perek 23", "One Halacha", "One Mishna",
  "613 Chai", "Mitzvah of the Day", "Modeh Ani", "Shema", "10 Push-Ups"
];

const APP_OPTIONS = [
  { id: "instagram", name: "Instagram" },
  { id: "tiktok", name: "TikTok" },
  { id: "twitter", name: "Twitter / X" },
  { id: "youtube", name: "YouTube" },
  { id: "facebook", name: "Facebook" },
  { id: "reddit", name: "Reddit" },
];


export default function Blocker() {
  const [gateMode, setGateMode] = useState(false);
  const [gateways, setGateways] = useLocalStorage<string[]>("gateways", ["Perek 121", "613 Chai"]);
  const [blockedApps, setBlockedApps] = useLocalStorage<Record<string, boolean>>("blockedApps", { instagram: true, tiktok: true });
  const [blockerEnabled, setBlockerEnabled] = useLocalStorage("blockerEnabled", true);
  const [appGateways, setAppGateways] = useLocalStorage<Record<string, string>>("appGateways", {});
  const [, setCompletions] = useLocalStorage<number>("blockerCompletions", 0);

  const shabbos = useShabbos();

  const toggleGateway = (g: string) => {
    setGateways(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleApp = (id: string) => {
    setBlockedApps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setAppGateway = (id: string, gw: string) => {
    setAppGateways(prev => ({ ...prev, [id]: gw }));
  };

  if (gateMode) {
    return (
      <GateOverlay
        gateways={gateways}
        shabbos={shabbos}
        onClose={() => setGateMode(false)}
        onComplete={() => {
          setCompletions(prev => prev + 1);
          setGateMode(false);
          toast.success("Gateway complete. Use your time well.", { description: "15 minutes unlocked." });
        }}
      />
    );
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative h-52 w-full overflow-hidden mb-0">
        <img
          src={blockerHero}
          alt="Guard your mind"
          className="w-full h-full object-cover opacity-80 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">App Blocker</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Guard your mind.</h1>
          <p className="text-muted-foreground mt-1 text-sm">Do something that matters before you scroll.</p>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">

        {/* Blocker toggle + Enter */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <Card className={`flex-1 border-border border-l-4 ${blockerEnabled ? "border-l-primary" : "border-l-muted"}`}>
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Power className={`w-5 h-5 ${blockerEnabled ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-bold text-sm">{blockerEnabled ? "Blocker is On" : "Blocker is Off"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Complete a gateway to unlock any blocked app</p>
                </div>
              </div>
              <Switch checked={blockerEnabled} onCheckedChange={setBlockerEnabled} />
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="h-auto px-8 py-4 font-bold text-base rounded-xl shadow-sm"
            onClick={() => setGateMode(true)}
          >
            <Shield className="w-5 h-5 mr-2" />
            Enter Blocker Mode
          </Button>
        </div>

        {/* Which apps to block */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Apps to Block</p>
          <div className={`space-y-2 transition-opacity ${blockerEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            {APP_OPTIONS.map(app => {
              const isBlocked = !!blockedApps[app.id];
              const currentGw = appGateways[app.id] || "Any selected gateway";
              return (
                <div key={app.id} className="flex items-center justify-between gap-3 p-4 border border-border/50 rounded-xl bg-card hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Switch checked={isBlocked} onCheckedChange={() => toggleApp(app.id)} />
                    <span className="font-semibold text-sm">{app.name}</span>
                  </div>
                  {isBlocked && (
                    <Select value={currentGw} onValueChange={v => setAppGateway(app.id, v)}>
                      <SelectTrigger className="w-[180px] h-9 bg-secondary/30 border-border/50 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any selected gateway">Any gateway</SelectItem>
                        {GATEWAY_OPTIONS.map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gateway options */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Gateway Options</p>
          <p className="text-sm text-muted-foreground mb-4">Choose what you must complete before unlocking a blocked app.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GATEWAY_OPTIONS.map(opt => {
              const isSelected = gateways.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggleGateway(opt)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-secondary/30 hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <span className="font-bold text-sm leading-tight">{opt}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>
              );
            })}
          </div>
          {gateways.length === 0 && (
            <p className="text-sm text-destructive mt-3 font-medium">Select at least one gateway.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function GateOverlay({ gateways, shabbos, onClose, onComplete }: {
  gateways: string[];
  shabbos: ReturnType<typeof useShabbos>;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [activeGateway, setActiveGateway] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const available = gateways.length > 0 ? gateways : ["Perek 121", "613 Chai"];

  const handleGatewayComplete = () => {
    setIsDone(true);
    onComplete();
  };

  if (shabbos.isShabbos) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 border border-primary/30 p-8 rounded-full mb-8"
        >
          <Moon className="w-20 h-20 text-primary" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Shabbos.</h1>
        <p className="text-xl text-muted-foreground mb-2 max-w-md">Be present where you are.</p>
        <p className="text-sm text-muted-foreground/70 mb-12">
          Havdalah {formatTimeInTz(shabbos.window.havdalah, shabbos.location.tz)}
        </p>
        <Button variant="outline" onClick={onClose}>Back</Button>
      </div>
    );
  }

  if (activeGateway) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col">
        <header className="p-4 border-b border-border bg-card flex items-center h-16">
          <Button variant="ghost" onClick={() => setActiveGateway(null)} className="mr-4 text-muted-foreground">
            ← Back
          </Button>
          <h1 className="text-lg font-bold text-foreground">{activeGateway}</h1>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <GatewayView type={activeGateway} onComplete={handleGatewayComplete} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
          Before you scroll,{" "}
          <span className="text-muted-foreground">do something that matters.</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">Choose a gateway to proceed.</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full mt-8">
        {available.map((gateway, i) => (
          <motion.div
            key={gateway}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer border-border hover:border-primary/50 hover:bg-secondary/50 transition-all group bg-card shadow-sm"
              onClick={() => setActiveGateway(gateway)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-border/50">
                  <GatewayIcon type={gateway} />
                </div>
                <h3 className="font-bold text-sm leading-tight text-foreground">{gateway}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GatewayIcon({ type }: { type: string }) {
  if (type.includes("Push-Ups")) return <Dumbbell className="w-5 h-5" />;
  if (type.includes("Mitzvah")) return <Sparkles className="w-5 h-5" />;
  return <BookOpen className="w-5 h-5" />;
}

function GatewayView({ type, onComplete }: { type: string; onComplete: () => void }) {
  const [, setLocation] = useLocation();

  if (type === "Perek 121" || type === "Perek 23") {
    const p = type === "Perek 121" ? perakim[121] : perakim[23];
    return (
      <div className="space-y-8 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <div className="space-y-8 text-center md:text-right">
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground text-left">{p.title}</h2>
          <p className="text-2xl md:text-3xl leading-loose font-medium text-foreground" dir="rtl">{p.textHe}</p>
          <div className="w-12 h-1 bg-border mx-auto" />
          <p className="text-lg leading-relaxed text-muted-foreground text-left">{p.textEn}</p>
        </div>
        <Button size="lg" className="w-full h-14 text-base font-bold mt-8" onClick={onComplete}>Complete</Button>
      </div>
    );
  }

  if (type === "One Halacha") {
    const today = new Date().getDate();
    const h = halachos[today % halachos.length];
    return (
      <div className="space-y-8 text-center bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground">"{h.text}"</h2>
        <p className="text-muted-foreground font-semibold uppercase tracking-wider text-sm">— {h.source}</p>
        <Button size="lg" className="w-full h-14 text-base font-bold" onClick={onComplete}>Complete</Button>
      </div>
    );
  }

  if (type === "One Mishna") {
    const today = new Date().getDate();
    const m = mishnayos[today % mishnayos.length];
    return (
      <div className="space-y-8 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">{m.title}</h2>
          <p className="text-2xl leading-loose font-medium text-foreground" dir="rtl">{m.textHe}</p>
          <div className="w-12 h-1 bg-border" />
          <p className="text-lg leading-relaxed text-muted-foreground">{m.textEn}</p>
        </div>
        <Button size="lg" className="w-full h-14 text-base font-bold" onClick={onComplete}>Complete</Button>
      </div>
    );
  }

  if (type === "Modeh Ani" || type === "Shema") {
    const p = type === "Modeh Ani" ? prayers.modehAni : prayers.shema;
    return (
      <div className="space-y-8 text-center bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <h2 className="text-xl font-bold uppercase tracking-wider text-muted-foreground">{p.title}</h2>
        <p className="text-3xl md:text-4xl leading-loose font-medium text-foreground" dir="rtl">{p.textHe}</p>
        <div className="w-12 h-1 bg-border mx-auto" />
        <p className="text-lg leading-relaxed text-muted-foreground">{p.textEn}</p>
        <Button size="lg" className="w-full h-14 text-base font-bold" onClick={onComplete}>Complete</Button>
      </div>
    );
  }

  if (type === "10 Push-Ups") {
    const [count, setCount] = useState(0);
    const target = 10;
    return (
      <div className="text-center space-y-12 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-muted-foreground">10 Push-Ups</h2>
        <div className="relative w-64 h-64 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
              className="text-primary transition-all duration-300"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - count / target)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-6xl font-bold text-foreground tracking-tighter">{count}</span>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-2">/ {target}</span>
          </div>
        </div>
        {count < target ? (
          <Button size="lg" variant="secondary" className="w-full h-20 text-xl font-bold rounded-2xl" onClick={() => setCount(c => c + 1)}>
            TAP FOR PUSH-UP
          </Button>
        ) : (
          <Button size="lg" className="w-full h-20 text-xl font-bold rounded-2xl" onClick={onComplete}>
            Complete Gateway
          </Button>
        )}
      </div>
    );
  }

  if (type === "Mitzvah of the Day") {
    const m = getMitzvahForDate(new Date());
    return (
      <div className="space-y-6 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Sparkles className="w-3.5 h-3.5" /> Today's Mitzvah · {m.category}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{m.title}</h2>
        <p className="text-base md:text-lg leading-relaxed text-foreground">{m.explanation}</p>
        <div className="border-t border-border/50 pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Do it today</p>
          <p className="text-base md:text-lg leading-relaxed text-foreground italic">{m.todayAction}</p>
        </div>
        <Button size="lg" className="w-full h-14 text-base font-bold" onClick={onComplete}>I'll Do It — Complete</Button>
      </div>
    );
  }

  if (type === "613 Chai") {
    return (
      <div className="text-center space-y-8 bg-card p-8 md:p-12 rounded-2xl border border-border shadow-sm">
        <div className="w-20 h-20 rounded-full bg-secondary border border-border mx-auto flex items-center justify-center">
          <Shield className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-3">613 Chai Habits</h2>
          <p className="text-muted-foreground text-lg">Complete your daily habits to unlock the app.</p>
        </div>
        <Button size="lg" className="w-full h-14 text-base font-bold" onClick={() => setLocation("/grow")}>
          Go to 613 Chai
        </Button>
      </div>
    );
  }

  return <div>Unknown Gateway</div>;
}
