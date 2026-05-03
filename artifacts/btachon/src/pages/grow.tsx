import { useState } from "react";
import { Flame, Footprints, Sparkles } from "lucide-react";
import ChaiPage from "./chai";
import GeulahPage from "./geulah";
import MitzvahPage from "./mitzvah";

const SECTIONS = [
  { key: "mitzvah", label: "Mitzvah", icon: Sparkles },
  { key: "chai",    label: "613 Chai", icon: Flame },
  { key: "geulah",  label: "Geulah",   icon: Footprints },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

export default function Grow() {
  const [active, setActive] = useState<SectionKey>("mitzvah");

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex gap-0">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                  active === key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {active === "mitzvah" ? <MitzvahPage /> : active === "chai" ? <ChaiPage /> : <GeulahPage />}
      </div>
    </div>
  );
}
