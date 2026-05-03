import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Activity,
  ScrollText,
  TrendingUp,
  BookOpen,
  ShieldAlert,
  Users,
  ChevronRight,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    hebrew: "בֵּן אָדָם לַמָּקוֹם",
    term: "Ben Adam LaMakom",
    meaning: "Between you and Hashem",
    detail: "Tefillah, mitzvos, avodah — your relationship with the Source of everything.",
  },
  {
    hebrew: "בֵּן אָדָם לַחֲבֵרוֹ",
    term: "Ben Adam LaChavero",
    meaning: "Between you and others",
    detail: "Kindness, honesty, chevre — how you show up for the people around you.",
  },
  {
    hebrew: "בֵּן אָדָם לְעַצְמוֹ",
    term: "Ben Adam LeAtzmo",
    meaning: "Between you and yourself",
    detail: "Discipline, growth, knowing who you are and who you want to become.",
  },
];

const FEATURES = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    why: "Your daily picture in one place — habits, tefillah focus, Hebrew date, and your growth at a glance.",
  },
  {
    icon: Activity,
    name: "Pulse",
    why: "Join or run community accountability campaigns. Real growth happens when others are growing alongside you.",
  },
  {
    icon: ScrollText,
    name: "Tefillah",
    why: "Explore every word of the major tefillos and rotate through a 31-day daily focus with meaning and kavvanah.",
  },
  {
    icon: TrendingUp,
    name: "Grow",
    why: "Track your 613 Chai mitzvos, log Torah learning, and follow the Geulah journey as it unfolds.",
  },
  {
    icon: BookOpen,
    name: "Learn",
    why: "Log every learning session — parsha, halacha, mussar, Gemara — and watch your consistency build.",
  },
  {
    icon: ShieldAlert,
    name: "Blocker",
    why: "Name the spiritual obstacle holding you back. Naming it is the first step to overcoming it.",
  },
  {
    icon: Users,
    name: "Chevre",
    why: "Your accountability network. Growth is exponential when you have the right people in your corner.",
  },
];

// ─── Slide variants ────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Step 0: Pillars ────────────────────────────────────────────────────────────

function StepPillars() {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <div className="text-2xl font-bold text-foreground tracking-tight">Why Btachon exists</div>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          The Torah gives us three dimensions of who we are called to be.
        </p>
      </div>

      <div className="w-full space-y-0">
        {PILLARS.map((pillar, i) => (
          <div key={pillar.term}>
            {i > 0 && (
              <div className="flex justify-center">
                <div className="w-px h-5 bg-border/50" />
              </div>
            )}
            <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-6 py-4">
              <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary/60" />
              <div dir="rtl" className="text-lg font-bold text-primary mb-0.5 leading-relaxed">
                {pillar.hebrew}
              </div>
              <div className="text-sm font-semibold text-foreground">{pillar.term}</div>
              <div className="text-xs text-primary/70 font-medium mt-0.5">{pillar.meaning}</div>
              <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{pillar.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-7 text-base font-semibold text-foreground text-center">
        Here, we build all three.
      </p>
    </div>
  );
}

// ─── Step 1: Features ────────────────────────────────────────────────────────────

function StepFeatures() {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-foreground tracking-tight">Your tools for growth</div>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          Every section is built around a real practice — nothing is filler.
        </p>
      </div>

      <div className="w-full space-y-2.5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.name}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3.5"
            >
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{f.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.why}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Begin ────────────────────────────────────────────────────────────

function StepBegin({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto h-full min-h-[60vh]">
      <div className="mb-6">
        <div className="text-3xl font-bold text-foreground tracking-tight">Ready?</div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs mx-auto">
          Every day is a new opportunity to grow — in tefillah, in how you treat others, and in who you are.
        </p>
        <p className="text-sm text-primary font-medium mt-2">
          Let's make it count.
        </p>
      </div>

      <div className="w-16 h-px bg-border/40 my-6" />

      <blockquote className="text-xs text-muted-foreground italic max-w-xs leading-relaxed">
        "A person is obligated to say: The world was created for my sake."
        <br />
        <span className="not-italic font-medium text-muted-foreground/70 mt-1 block">Sanhedrin 37a</span>
      </blockquote>

      <button
        onClick={onEnter}
        className="mt-10 px-12 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
      >
        Begin
      </button>

      <p className="mt-4 text-xs text-muted-foreground/40">You won't see this again</p>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

const STEPS = 3;

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [leaving, setLeaving] = useState(false);

  const goNext = () => {
    if (step < STEPS - 1) {
      setDir(1);
      setStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      setDir(-1);
      setStep((s) => s - 1);
    }
  };

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 500);
  };

  const isLast = step === STEPS - 1;

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="welcome-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 pt-8 pb-4 px-6 text-center">
            <div className="text-xl font-bold text-foreground tracking-tight">Btachon</div>
            <div className="text-[10px] text-muted-foreground/50 tracking-widest uppercase mt-0.5">
              Jewish Personal Growth
            </div>
          </div>

          {/* Step dots */}
          <div className="flex-shrink-0 flex justify-center gap-2 pb-4">
            {Array.from({ length: STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDir(i > step ? 1 : -1);
                  setStep(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Scrollable slide content */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 0 && <StepPillars />}
                {step === 1 && <StepFeatures />}
                {step === 2 && <StepBegin onEnter={handleEnter} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          {!isLast && (
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-t border-border/30">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="text-sm text-muted-foreground disabled:opacity-0 transition-opacity"
              >
                Back
              </button>

              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
