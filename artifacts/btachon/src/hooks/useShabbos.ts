import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  computeShabbosState,
  DEFAULT_LOCATION_ID,
  getLocationById,
  ShabbosState,
} from "@/lib/shabbos";

export type ShabbosOverride = "auto" | "on" | "off";

export function useShabbos(): ShabbosState & {
  locationId: string;
  setLocationId: (id: string) => void;
  override: ShabbosOverride;
  setOverride: (o: ShabbosOverride) => void;
} {
  const [locationId, setLocationId] = useLocalStorage<string>("shabbosLocation", DEFAULT_LOCATION_ID);
  const [override, setOverride] = useLocalStorage<ShabbosOverride>("shabbosOverride", "auto");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const state = useMemo(() => {
    const loc = getLocationById(locationId);
    return computeShabbosState(now, loc, override);
  }, [now, locationId, override]);

  return { ...state, locationId, setLocationId, override, setOverride };
}
