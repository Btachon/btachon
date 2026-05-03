import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Clock, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { PRAYERS, type Prayer, type PrayerWord } from "@/data/prayers";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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
      key={word.hebrew}
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
      {/* Hebrew text — clickable words */}
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

      {/* Word detail panel */}
      <AnimatePresence mode="wait">
        {activeWord && <WordDetail word={activeWord} />}
      </AnimatePresence>

      {/* Kavvanah */}
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
    <div className="space-y-6">
      {/* Prayer header */}
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

      {/* Section tabs if multiple */}
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

      {/* Active section */}
      <PrayerSection
        key={prayer.sections[activeSection].id}
        section={prayer.sections[activeSection]}
        activeWord={activeWord}
        onWordClick={handleWordClick}
      />
    </div>
  );
}

export default function Tefillah() {
  const [selectedId, setSelectedId] = useLocalStorage<string>("btachon:tefillah:selected", PRAYERS[0].id);
  const [davenedToday, setDavenedToday] = useLocalStorage<Record<string, string>>("btachon:tefillah:davened", {});

  const today = new Date().toISOString().split("T")[0];
  const selectedPrayer = PRAYERS.find((p) => p.id === selectedId) ?? PRAYERS[0];

  const markDavened = (prayerId: string) => {
    setDavenedToday((prev) => ({ ...prev, [prayerId]: today }));
  };

  const hasDavened = (prayerId: string) => davenedToday[prayerId] === today;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ScrollText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Tefillah</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Understand the words you say every day. Tap any Hebrew word to learn what it really means.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Prayer list */}
        <div className="space-y-1.5">
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
        <div className="space-y-6">
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

          {/* Mark as davened */}
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
    </div>
  );
}
