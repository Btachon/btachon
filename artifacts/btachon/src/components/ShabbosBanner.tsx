import { useShabbos } from "@/hooks/useShabbos";
import { formatTimeInTz, formatRelative } from "@/lib/shabbos";
import { Moon, Sparkles } from "lucide-react";

export function ShabbosBanner() {
  const { isShabbos, window, location, minutesUntilCandleLighting, minutesUntilHavdalah, override } = useShabbos();

  if (isShabbos) {
    return (
      <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-primary/30">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Moon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">
              Shabbos Mode is on{override === "on" ? " (manual)" : ""}.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Streaks frozen. Nudges silenced. Havdalah {formatTimeInTz(window.havdalah, location.tz)} ({formatRelative(minutesUntilHavdalah)}).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (override === "auto" && minutesUntilCandleLighting > 0 && minutesUntilCandleLighting <= 360) {
    return (
      <div className="bg-secondary/40 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Candle lighting</span> {formatTimeInTz(window.candleLighting, location.tz)} · {formatRelative(minutesUntilCandleLighting)} · {location.name}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
