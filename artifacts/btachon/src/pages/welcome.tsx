import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface WelcomeProps {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: WelcomeProps) {
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 600);
  };

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-6"
        >
          {/* Top wordmark */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="text-3xl font-bold tracking-tight text-foreground">Btachon</div>
            <div className="text-xs text-muted-foreground/60 tracking-widest uppercase mt-1">Jewish Personal Growth</div>
          </motion.div>

          {/* Pillars */}
          <div className="w-full max-w-md space-y-0">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.term}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.22, duration: 0.55, ease: "easeOut" }}
              >
                {/* Connector line above (except first) */}
                {i > 0 && (
                  <div className="flex justify-center">
                    <div className="w-px h-6 bg-border/50" />
                  </div>
                )}

                <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm px-6 py-5">
                  {/* Amber left accent */}
                  <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-primary/60" />

                  <div dir="rtl" className="text-xl font-bold text-primary mb-1 leading-relaxed">
                    {pillar.hebrew}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{pillar.term}</div>
                  <div className="text-xs text-primary/70 font-medium mt-0.5">{pillar.meaning}</div>
                  <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{pillar.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
            className="mt-10 text-center"
          >
            <p className="text-lg font-semibold text-foreground tracking-wide">
              Here, we build all three.
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
              Every feature in this app is built around one of these pillars. None of them is optional. All of them are you.
            </p>
          </motion.div>

          {/* Enter button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.65, duration: 0.5 }}
            className="mt-10"
          >
            <button
              onClick={handleEnter}
              className="px-10 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm tracking-wide hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Begin
            </button>
          </motion.div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="mt-6 text-xs text-muted-foreground/40"
          >
            You won't see this again
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
