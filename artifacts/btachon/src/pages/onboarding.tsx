import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SHABBOS_LOCATIONS } from "@/lib/shabbos";
import { MapPin, User, Heart, ChevronRight, CheckCircle, Users } from "lucide-react";

interface OnboardingProps {
  onComplete: (data: {
    displayName: string;
    shabbosCity: string;
    bio: string;
    hobbies: string;
    growthGoals: string;
    profileType: string;
  }) => void;
}

const PROFILE_OPTIONS = [
  { value: "teen_male",     label: "Teen — Boy",       sub: "Ages 13–17" },
  { value: "teen_female",   label: "Teen — Girl",      sub: "Ages 13–17" },
  { value: "single_male",   label: "Single Man",       sub: "Bachur / Young Adult" },
  { value: "single_female", label: "Single Woman",     sub: "Young Adult" },
  { value: "married_male",  label: "Married Man",      sub: "Husband / Father" },
  { value: "married_female",label: "Married Woman",    sub: "Wife / Mother" },
];

const steps = [
  { id: "name",     label: "About You",    icon: User },
  { id: "profile",  label: "Who You Are",  icon: Users },
  { id: "location", label: "Shabbos",      icon: MapPin },
  { id: "growth",   label: "Goals",        icon: Heart },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [profileType, setProfileType] = useState("");
  const [shabbosCity, setShabbosCity] = useState("lakewood");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [growthGoals, setGrowthGoals] = useState("");

  const handleFinish = () => {
    onComplete({ displayName, shabbosCity, bio, hobbies, growthGoals, profileType });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="text-4xl font-bold tracking-tight text-foreground mb-2">Btachon</div>
          <p className="text-muted-foreground">Let's set up your personal growth space</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 mb-10 flex-wrap">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-px transition-colors duration-300 ${i < step ? "bg-primary/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 0: Name */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-xl"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">What should we call you?</h2>
                <p className="text-muted-foreground text-sm">This is the name that appears to your chevra</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Moshe, Rivka, R' Yosef..."
                    className="h-12 text-lg"
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && displayName.trim() && setStep(1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Bio <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="A little about yourself and your learning background..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <Button
                className="w-full mt-6 h-12 text-base"
                disabled={!displayName.trim()}
                onClick={() => setStep(1)}
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 1: Profile Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-xl"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Which best describes you?</h2>
                <p className="text-muted-foreground text-sm">This personalizes your daily mitzvah actions to your life stage</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PROFILE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setProfileType(opt.value)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      profileType === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-secondary/20 hover:bg-secondary/40 text-foreground"
                    }`}
                  >
                    <p className="font-bold text-sm leading-tight">{opt.label}</p>
                    <p className={`text-[11px] mt-0.5 ${profileType === opt.value ? "text-primary/70" : "text-muted-foreground"}`}>
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>

              {!profileType && (
                <p className="text-xs text-muted-foreground mt-3 text-center">Select one to continue</p>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="h-12" onClick={() => setStep(0)}>Back</Button>
                <Button className="flex-1 h-12 text-base" disabled={!profileType} onClick={() => setStep(2)}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-xl"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Where do you light Shabbos candles?</h2>
                <p className="text-muted-foreground text-sm">We'll show you accurate candle lighting and havdalah times</p>
              </div>
              <div className="space-y-2">
                <Label>Your City</Label>
                <Select value={shabbosCity} onValueChange={setShabbosCity}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHABBOS_LOCATIONS.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-1">You can change this anytime in Settings</p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="h-12" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1 h-12 text-base" onClick={() => setStep(3)}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Growth Goals */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-xl"
            >
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-1">What are you working on?</h2>
                <p className="text-muted-foreground text-sm">Your personal growth focus and interests — totally private to you</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Hobbies & Interests <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Textarea
                    value={hobbies}
                    onChange={e => setHobbies(e.target.value)}
                    placeholder="e.g. Learning guitar, hiking, cooking Shabbos food..."
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Growth Goals <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Textarea
                    value={growthGoals}
                    onChange={e => setGrowthGoals(e.target.value)}
                    placeholder="e.g. Daven with more kavana, finish Mishnayos this year, strengthen Emuna..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="h-12" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1 h-12 text-base" onClick={handleFinish}>
                  Enter Btachon
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-6">
          All your data stays private and secure
        </p>
      </motion.div>
    </div>
  );
}
