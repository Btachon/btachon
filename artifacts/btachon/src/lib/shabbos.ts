import SunCalc from "suncalc";

export type ShabbosLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tz: string;
};

export const SHABBOS_LOCATIONS: ShabbosLocation[] = [
  { id: "jerusalem", name: "Jerusalem", lat: 31.7683, lng: 35.2137, tz: "Asia/Jerusalem" },
  { id: "telaviv", name: "Tel Aviv", lat: 32.0853, lng: 34.7818, tz: "Asia/Jerusalem" },
  { id: "bnei-brak", name: "Bnei Brak", lat: 32.0809, lng: 34.8338, tz: "Asia/Jerusalem" },
  { id: "tzfat", name: "Tzfat", lat: 32.9650, lng: 35.4951, tz: "Asia/Jerusalem" },
  { id: "lakewood", name: "Lakewood, NJ", lat: 40.0979, lng: -74.2179, tz: "America/New_York" },
  { id: "brooklyn", name: "Brooklyn, NY", lat: 40.6782, lng: -73.9442, tz: "America/New_York" },
  { id: "monsey", name: "Monsey, NY", lat: 41.1115, lng: -74.0682, tz: "America/New_York" },
  { id: "miami", name: "Miami, FL", lat: 25.7617, lng: -80.1918, tz: "America/New_York" },
  { id: "la", name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
  { id: "chicago", name: "Chicago, IL", lat: 41.8781, lng: -87.6298, tz: "America/Chicago" },
  { id: "toronto", name: "Toronto, ON", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
  { id: "london", name: "London, UK", lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { id: "manchester", name: "Manchester, UK", lat: 53.4808, lng: -2.2426, tz: "Europe/London" },
  { id: "antwerp", name: "Antwerp, BE", lat: 51.2194, lng: 4.4025, tz: "Europe/Brussels" },
  { id: "paris", name: "Paris, FR", lat: 48.8566, lng: 2.3522, tz: "Europe/Paris" },
  { id: "melbourne", name: "Melbourne, AU", lat: -37.8136, lng: 144.9631, tz: "Australia/Melbourne" },
];

export const DEFAULT_LOCATION_ID = "lakewood";

export function getLocationById(id: string): ShabbosLocation {
  return SHABBOS_LOCATIONS.find(l => l.id === id) ?? SHABBOS_LOCATIONS[4];
}

function getDayOfWeekInTz(date: Date, tz: string): number {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" });
  const wd = fmt.format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

function startOfDayInTz(date: Date, tz: string): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  const isoDate = `${get("year")}-${get("month")}-${get("day")}T12:00:00`;
  return new Date(isoDate + getTzOffsetString(tz, date));
}

function getTzOffsetString(tz: string, date: Date): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  });
  const parts = fmt.formatToParts(date);
  const off = parts.find(p => p.type === "timeZoneName")?.value ?? "GMT+0";
  const m = off.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
  if (!m) return "+00:00";
  const sign = m[1];
  const hh = m[2].padStart(2, "0");
  const mm = (m[3] ?? "00").padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

export type ShabbosWindow = {
  candleLighting: Date;
  havdalah: Date;
};

export function getNearestShabbosWindow(now: Date, loc: ShabbosLocation): ShabbosWindow {
  const dow = getDayOfWeekInTz(now, loc.tz);
  const daysUntilFriday = dow <= 5 ? 5 - dow : 6;
  const fridayNoon = new Date(startOfDayInTz(now, loc.tz).getTime() + daysUntilFriday * 86400000);
  const saturdayNoon = new Date(fridayNoon.getTime() + 86400000);

  const friSun = SunCalc.getTimes(fridayNoon, loc.lat, loc.lng);
  const satSun = SunCalc.getTimes(saturdayNoon, loc.lat, loc.lng);

  const candleLighting = new Date(friSun.sunset.getTime() - 18 * 60 * 1000);
  const havdalah = new Date(satSun.sunset.getTime() + 50 * 60 * 1000);

  if (now.getTime() > havdalah.getTime()) {
    const nextFri = new Date(fridayNoon.getTime() + 7 * 86400000);
    const nextSat = new Date(nextFri.getTime() + 86400000);
    const fs = SunCalc.getTimes(nextFri, loc.lat, loc.lng);
    const ss = SunCalc.getTimes(nextSat, loc.lat, loc.lng);
    return {
      candleLighting: new Date(fs.sunset.getTime() - 18 * 60 * 1000),
      havdalah: new Date(ss.sunset.getTime() + 50 * 60 * 1000),
    };
  }

  return { candleLighting, havdalah };
}

export type ShabbosState = {
  isShabbos: boolean;
  window: ShabbosWindow;
  location: ShabbosLocation;
  minutesUntilCandleLighting: number;
  minutesUntilHavdalah: number;
};

export function computeShabbosState(
  now: Date,
  loc: ShabbosLocation,
  manualOverride: "auto" | "on" | "off"
): ShabbosState {
  const window = getNearestShabbosWindow(now, loc);
  const autoIsShabbos =
    now.getTime() >= window.candleLighting.getTime() &&
    now.getTime() <= window.havdalah.getTime();

  const isShabbos = manualOverride === "auto" ? autoIsShabbos : manualOverride === "on";

  return {
    isShabbos,
    window,
    location: loc,
    minutesUntilCandleLighting: Math.round((window.candleLighting.getTime() - now.getTime()) / 60000),
    minutesUntilHavdalah: Math.round((window.havdalah.getTime() - now.getTime()) / 60000),
  };
}

export function formatTimeInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatRelative(minutes: number): string {
  if (minutes < 0) return "now";
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
  const days = Math.floor(hours / 24);
  const remH = hours % 24;
  return remH > 0 ? `in ${days}d ${remH}h` : `in ${days}d`;
}
