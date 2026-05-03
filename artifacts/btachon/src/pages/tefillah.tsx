import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Clock, ChevronDown, ChevronUp, BookOpen, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PRAYERS, type Prayer, type PrayerWord } from "@/data/prayers";
import { DAILY_FOCUSES, getDailyFocus, getFocusForDate } from "@/data/dailyTefillahFocus";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ─── Daily Focus ──────────────────────────────────────────────────────────────

function DailyFocusCard() {
  const [offset, setOffset] = useState(0); // 0 = today, -1 = yesterday, +1 = tomorrow
  const [practiced, setPracticed] = useLocalStorage<Record<string, boolean>>("btachon:tefillah:practiced", {});

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + offset);
  const focus = getFocusForDate(targetDate);

  const dateLabel = offset === 0 ? "Today" : offset === -1 ? "Yesterday" : offset === 1 ? "Tomorrow" : targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const dateKey = targetDate.toISOString().split("T")[0];
  const hasPracticed = practiced[dateKey];

  return (
    <div className="space-y-4">
      {/* Date nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Daily Focus</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOffset((o) => o - 1)}
            disabled={offset <= -30}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-muted-foreground w-20 text-center">{dateLabel}</span>
          <button
            onClick={() => setOffset((o) => o + 1)}
            disabled={offset >= 1}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={dateKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-primary/25 bg-gradient-to-br from-primary/8 to-transparent">
            <CardContent className="p-5 space-y-4">
              {/* Source badge + title */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-[10px] border-primary/40 text-primary/80 font-medium">
                    {focus.source}
                  </Badge>
                  <h3 className="text-base font-bold text-foreground">{focus.title}</h3>
                </div>
              </div>

              {/* Hebrew + transliteration */}
              <div className="rounded-xl bg-background/60 border border-border/50 p-4 text-center space-y-2">
                <div dir="rtl" className="text-2xl leading-loose text-primary font-bold">{focus.hebrew}</div>
                <div className="text-sm text-muted-foreground italic">{focus.transliteration}</div>
                <div className="text-xs text-muted-foreground/70 border-t border-border/40 pt-2">{focus.literal}</div>
              </div>

              {/* Deep meaning */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What it means</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{focus.deepMeaning}</p>
              </div>

              {/* Practice */}
              <div className="rounded-lg bg-secondary/40 border border-border/40 p-3 space-y-1">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Practice today</p>
                <p className="text-sm text-foreground leading-relaxed">{focus.practice}</p>
              </div>

              {/* Kavvanah */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kavvanah</p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">{focus.kavvanah}</p>
              </div>

              {/* Mark practiced */}
              {offset === 0 && (
                hasPracticed ? (
                  <div className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-medium text-center">
                    Practiced today
                  </div>
                ) : (
                  <button
                    onClick={() => setPracticed((p) => ({ ...p, [dateKey]: true }))}
                    className="w-full py-2.5 rounded-lg border border-primary/30 text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
                  >
                    Mark as practiced
                  </button>
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Upcoming strip */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Coming up</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[-1, 0, 1, 2, 3].map((d) => {
            const dt = new Date();
            dt.setDate(dt.getDate() + d);
            const f = getFocusForDate(dt);
            const isToday = d === 0;
            return (
              <button
                key={d}
                onClick={() => setOffset(d)}
                className={`flex-none px-3 py-2 rounded-lg text-left transition-colors min-w-[120px] border ${
                  offset === d
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-secondary/40 border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <div className="text-[10px] font-semibold mb-0.5">{isToday ? "Today" : dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                <div className="text-xs truncate font-medium">{f.source}</div>
                <div dir="rtl" className="text-sm font-bold mt-0.5 truncate">{f.hebrew.split(" ").slice(0, 2).join(" ")}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Prayer explorer ──────────────────────────────────────────────────────────

function WordChip({ word, isActive, onClick }: { word: PrayerWord; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-block px-2 py-1 mx-1 my-1 rounded-md text-xl font-hebrew leading-relaxed transition-all cursor-pointer select-none ${
        isActive
          ? "bg-primary text-primary-foreground shadow-md scale-105"
          : "bg-secondary/60 text-foreground hover:bg-primary/20 hover:text-primary"
      }`}
      dir="rtl"
    >
      {word.hebrew}
    </button>
  );
}

function WordDetail({ word }: { word: PrayerWord }) {
  return (
    <motion.div
      key={word.hebrew + word.transliteration}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div dir="rtl" className="text-3xl font-hebrew text-primary font-bold">{word.hebrew}</div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground tracking-wide">{word.transliteration}</div>
              <div className="text-xs text-primary/80 mt-0.5 italic">{word.literal}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
            {word.meaning}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PrayerSection({
  section,
  activeWord,
  onWordClick,
}: {
  section: Prayer["sections"][0];
  activeWord: PrayerWord | null;
  onWordClick: (w: PrayerWord) => void;
}) {
  const [kavvannahOpen, setKavvannahOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
        <div dir="rtl" className="text-center leading-loose flex flex-wrap justify-center">
          {section.words.map((word, i) => (
            <WordChip
              key={i}
              word={word}
              isActive={activeWord?.hebrew === word.hebrew && activeWord?.transliteration === word.transliteration}
              onClick={() => onWordClick(word)}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Tap any word to explore its meaning</p>
      </div>

      <AnimatePresence mode="wait">
        {activeWord && <WordDetail word={activeWord} />}
      </AnimatePresence>

      <div className="rounded-lg border border-border/50 overflow-hidden">
        <button
          onClick={() => setKavvannahOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Kavvanah — what to have in mind</span>
          </div>
          {kavvannahOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {kavvannahOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                {section.kavvanah}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PrayerView({ prayer }: { prayer: Prayer }) {
  const [activeWord, setActiveWord] = useState<PrayerWord | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const handleWordClick = (word: PrayerWord) => {
    setActiveWord((prev) =>
      prev?.hebrew === word.hebrew && prev?.transliteration === word.transliteration ? null : word
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div dir="rtl" className="text-2xl font-hebrew text-primary">{prayer.hebrewTitle}</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{prayer.title}</h2>
            <p className="text-sm text-primary/80">{prayer.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 mb-3">
          <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">{prayer.when}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{prayer.description}</p>
      </div>

      {prayer.sections.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {prayer.sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(i); setActiveWord(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSection === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Part {i + 1}
            </button>
          ))}
        </div>
      )}

      <PrayerSection
        key={prayer.sections[activeSection].id}
        section={prayer.sections[activeSection]}
        activeWord={activeWord}
        onWordClick={handleWordClick}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "focus" | "explorer";

export default function Tefillah() {
  const [tab, setTab] = useState<Tab>("focus");
  const [selectedId, setSelectedId] = useLocalStorage<string>("btachon:tefillah:selected", PRAYERS[0].id);
  const [davenedToday, setDavenedToday] = useLocalStorage<Record<string, string>>("btachon:tefillah:davened", {});

  const today = new Date().toISOString().split("T")[0];
  const selectedPrayer = PRAYERS.find((p) => p.id === selectedId) ?? PRAYERS[0];

  const markDavened = (prayerId: string) => {
    setDavenedToday((prev) => ({ ...prev, [prayerId]: today }));
  };

  const hasDavened = (prayerId: string) => davenedToday[prayerId] === today;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ScrollText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Tefillah</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          One prayer phrase every day. Tap words to explore their meaning.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("focus")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "focus" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Daily Focus
        </button>
        <button
          onClick={() => setTab("explorer")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "explorer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Prayer Explorer
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === "focus" ? (
          <motion.div
            key="focus"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18 }}
          >
            <DailyFocusCard />
          </motion.div>
        ) : (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              {/* Prayer list */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Prayers</p>
                {PRAYERS.map((prayer) => {
                  const done = hasDavened(prayer.id);
                  const isActive = selectedId === prayer.id;
                  return (
                    <button
                      key={prayer.id}
                      onClick={() => setSelectedId(prayer.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{prayer.title}</span>
                          {done && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/40 text-primary/70 shrink-0">
                              done
                            </Badge>
                          )}
                        </div>
                        <div dir="rtl" className="text-xs font-hebrew text-muted-foreground/70 truncate mt-0.5">
                          {prayer.hebrewTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prayer content */}
              <div className="space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPrayer.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PrayerView prayer={selectedPrayer} />
                  </motion.div>
                </AnimatePresence>

                {!hasDavened(selectedPrayer.id) ? (
                  <button
                    onClick={() => markDavened(selectedPrayer.id)}
                    className="w-full py-2.5 rounded-lg border border-primary/30 text-sm text-primary font-medium hover:bg-primary/10 transition-colors"
                  >
                    Mark as davened today
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-medium text-center">
                    Davened today
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
