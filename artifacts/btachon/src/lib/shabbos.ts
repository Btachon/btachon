import SunCalc from "suncalc";

export type ShabbosLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tz: string;
  region: string;
};

export const SHABBOS_LOCATIONS: ShabbosLocation[] = [
  // Israel
  { id: "jerusalem",   name: "Jerusalem",         lat: 31.7683,  lng: 35.2137,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "telaviv",     name: "Tel Aviv",           lat: 32.0853,  lng: 34.7818,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "bnei-brak",   name: "Bnei Brak",          lat: 32.0809,  lng: 34.8338,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "haifa",       name: "Haifa",              lat: 32.7940,  lng: 34.9896,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "tzfat",       name: "Tzfat",              lat: 32.9650,  lng: 35.4951,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "netanya",     name: "Netanya",            lat: 32.3215,  lng: 34.8532,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "beersheva",   name: "Beer Sheva",         lat: 31.2518,  lng: 34.7913,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "ashdod",      name: "Ashdod",             lat: 31.8044,  lng: 34.6553,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "raanana",     name: "Raanana",            lat: 32.1844,  lng: 34.8707,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "modiin",      name: "Modiin",             lat: 31.8969,  lng: 35.0095,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "petah-tikva", name: "Petah Tikva",        lat: 32.0841,  lng: 34.8878,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "rehovot",     name: "Rehovot",            lat: 31.8928,  lng: 34.8113,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "eilat",       name: "Eilat",              lat: 29.5577,  lng: 34.9519,   tz: "Asia/Jerusalem",        region: "Israel" },
  { id: "tiberias",    name: "Tiberias",           lat: 32.7957,  lng: 35.5310,   tz: "Asia/Jerusalem",        region: "Israel" },

  // USA — East
  { id: "brooklyn",    name: "Brooklyn, NY",       lat: 40.6782,  lng: -73.9442,  tz: "America/New_York",      region: "USA — East" },
  { id: "manhattan",   name: "Manhattan, NY",      lat: 40.7831,  lng: -73.9712,  tz: "America/New_York",      region: "USA — East" },
  { id: "queens",      name: "Queens / Kew Gardens Hills, NY", lat: 40.7282, lng: -73.7949, tz: "America/New_York", region: "USA — East" },
  { id: "williamsburg",name: "Williamsburg, NY",   lat: 40.7143,  lng: -73.9573,  tz: "America/New_York",      region: "USA — East" },
  { id: "crown-heights",name:"Crown Heights, NY",  lat: 40.6691,  lng: -73.9420,  tz: "America/New_York",      region: "USA — East" },
  { id: "monsey",      name: "Monsey, NY",         lat: 41.1115,  lng: -74.0682,  tz: "America/New_York",      region: "USA — East" },
  { id: "lakewood",    name: "Lakewood, NJ",       lat: 40.0979,  lng: -74.2179,  tz: "America/New_York",      region: "USA — East" },
  { id: "teaneck",     name: "Teaneck / Bergen County, NJ", lat: 40.8940, lng: -74.0124, tz: "America/New_York", region: "USA — East" },
  { id: "passaic",     name: "Passaic / Clifton, NJ", lat: 40.8568, lng: -74.1282, tz: "America/New_York",     region: "USA — East" },
  { id: "five-towns",  name: "Five Towns, NY",     lat: 40.6254,  lng: -73.7218,  tz: "America/New_York",      region: "USA — East" },
  { id: "far-rockaway",name: "Far Rockaway, NY",   lat: 40.6054,  lng: -73.7543,  tz: "America/New_York",      region: "USA — East" },
  { id: "spring-valley",name:"Spring Valley, NY",  lat: 41.1126,  lng: -74.0440,  tz: "America/New_York",      region: "USA — East" },
  { id: "baltimore",   name: "Baltimore, MD",      lat: 39.2904,  lng: -76.6122,  tz: "America/New_York",      region: "USA — East" },
  { id: "silver-spring",name:"Silver Spring, MD",  lat: 38.9907,  lng: -77.0261,  tz: "America/New_York",      region: "USA — East" },
  { id: "washington-dc",name:"Washington, DC",     lat: 38.9072,  lng: -77.0369,  tz: "America/New_York",      region: "USA — East" },
  { id: "boston",      name: "Boston, MA",         lat: 42.3601,  lng: -71.0589,  tz: "America/New_York",      region: "USA — East" },
  { id: "philadelphia",name: "Philadelphia, PA",   lat: 39.9526,  lng: -75.1652,  tz: "America/New_York",      region: "USA — East" },
  { id: "pittsburgh",  name: "Pittsburgh, PA",     lat: 40.4406,  lng: -79.9959,  tz: "America/New_York",      region: "USA — East" },
  { id: "cleveland",   name: "Cleveland, OH",      lat: 41.4993,  lng: -81.6944,  tz: "America/New_York",      region: "USA — East" },
  { id: "miami",       name: "Miami, FL",          lat: 25.7617,  lng: -80.1918,  tz: "America/New_York",      region: "USA — East" },
  { id: "boca-raton",  name: "Boca Raton, FL",     lat: 26.3683,  lng: -80.1289,  tz: "America/New_York",      region: "USA — East" },
  { id: "orlando",     name: "Orlando, FL",        lat: 28.5383,  lng: -81.3792,  tz: "America/New_York",      region: "USA — East" },
  { id: "atlanta",     name: "Atlanta, GA",        lat: 33.7490,  lng: -84.3880,  tz: "America/New_York",      region: "USA — East" },

  // USA — Central
  { id: "chicago",     name: "Chicago, IL",        lat: 41.8781,  lng: -87.6298,  tz: "America/Chicago",       region: "USA — Central" },
  { id: "detroit",     name: "Detroit / Oak Park, MI", lat: 42.4595, lng: -83.1821, tz: "America/Detroit",    region: "USA — Central" },
  { id: "dallas",      name: "Dallas, TX",         lat: 32.7767,  lng: -96.7970,  tz: "America/Chicago",       region: "USA — Central" },
  { id: "houston",     name: "Houston, TX",        lat: 29.7604,  lng: -95.3698,  tz: "America/Chicago",       region: "USA — Central" },
  { id: "st-louis",    name: "St. Louis, MO",      lat: 38.6270,  lng: -90.1994,  tz: "America/Chicago",       region: "USA — Central" },
  { id: "minneapolis", name: "Minneapolis, MN",    lat: 44.9778,  lng: -93.2650,  tz: "America/Chicago",       region: "USA — Central" },
  { id: "kansas-city", name: "Kansas City, MO",    lat: 39.0997,  lng: -94.5786,  tz: "America/Chicago",       region: "USA — Central" },

  // USA — West
  { id: "la",          name: "Los Angeles, CA",    lat: 34.0522,  lng: -118.2437, tz: "America/Los_Angeles",   region: "USA — West" },
  { id: "san-diego",   name: "San Diego, CA",      lat: 32.7157,  lng: -117.1611, tz: "America/Los_Angeles",   region: "USA — West" },
  { id: "san-francisco",name:"San Francisco, CA",  lat: 37.7749,  lng: -122.4194, tz: "America/Los_Angeles",   region: "USA — West" },
  { id: "seattle",     name: "Seattle, WA",        lat: 47.6062,  lng: -122.3321, tz: "America/Los_Angeles",   region: "USA — West" },
  { id: "portland",    name: "Portland, OR",       lat: 45.5051,  lng: -122.6750, tz: "America/Los_Angeles",   region: "USA — West" },
  { id: "denver",      name: "Denver, CO",         lat: 39.7392,  lng: -104.9903, tz: "America/Denver",        region: "USA — West" },
  { id: "phoenix",     name: "Phoenix, AZ",        lat: 33.4484,  lng: -112.0740, tz: "America/Phoenix",       region: "USA — West" },
  { id: "las-vegas",   name: "Las Vegas, NV",      lat: 36.1699,  lng: -115.1398, tz: "America/Los_Angeles",   region: "USA — West" },

  // Canada
  { id: "toronto",     name: "Toronto, ON",        lat: 43.6532,  lng: -79.3832,  tz: "America/Toronto",       region: "Canada" },
  { id: "montreal",    name: "Montreal, QC",       lat: 45.5017,  lng: -73.5673,  tz: "America/Toronto",       region: "Canada" },
  { id: "vancouver",   name: "Vancouver, BC",      lat: 49.2827,  lng: -123.1207, tz: "America/Vancouver",     region: "Canada" },
  { id: "ottawa",      name: "Ottawa, ON",         lat: 45.4215,  lng: -75.6919,  tz: "America/Toronto",       region: "Canada" },
  { id: "calgary",     name: "Calgary, AB",        lat: 51.0447,  lng: -114.0719, tz: "America/Edmonton",      region: "Canada" },

  // UK
  { id: "london",      name: "London",             lat: 51.5074,  lng: -0.1278,   tz: "Europe/London",         region: "UK" },
  { id: "manchester",  name: "Manchester",         lat: 53.4808,  lng: -2.2426,   tz: "Europe/London",         region: "UK" },
  { id: "gateshead",   name: "Gateshead",          lat: 54.9526,  lng: -1.6014,   tz: "Europe/London",         region: "UK" },
  { id: "leeds",       name: "Leeds",              lat: 53.8008,  lng: -1.5491,   tz: "Europe/London",         region: "UK" },
  { id: "glasgow",     name: "Glasgow",            lat: 55.8642,  lng: -4.2518,   tz: "Europe/London",         region: "UK" },

  // Europe
  { id: "paris",       name: "Paris",              lat: 48.8566,  lng: 2.3522,    tz: "Europe/Paris",          region: "Europe" },
  { id: "lyon",        name: "Lyon",               lat: 45.7640,  lng: 4.8357,    tz: "Europe/Paris",          region: "Europe" },
  { id: "marseille",   name: "Marseille",          lat: 43.2965,  lng: 5.3698,    tz: "Europe/Paris",          region: "Europe" },
  { id: "strasbourg",  name: "Strasbourg",         lat: 48.5734,  lng: 7.7521,    tz: "Europe/Paris",          region: "Europe" },
  { id: "nice",        name: "Nice",               lat: 43.7102,  lng: 7.2620,    tz: "Europe/Paris",          region: "Europe" },
  { id: "antwerp",     name: "Antwerp",            lat: 51.2194,  lng: 4.4025,    tz: "Europe/Brussels",       region: "Europe" },
  { id: "brussels",    name: "Brussels",           lat: 50.8503,  lng: 4.3517,    tz: "Europe/Brussels",       region: "Europe" },
  { id: "amsterdam",   name: "Amsterdam",          lat: 52.3676,  lng: 4.9041,    tz: "Europe/Amsterdam",      region: "Europe" },
  { id: "frankfurt",   name: "Frankfurt",          lat: 50.1109,  lng: 8.6821,    tz: "Europe/Berlin",         region: "Europe" },
  { id: "berlin",      name: "Berlin",             lat: 52.5200,  lng: 13.4050,   tz: "Europe/Berlin",         region: "Europe" },
  { id: "vienna",      name: "Vienna",             lat: 48.2082,  lng: 16.3738,   tz: "Europe/Vienna",         region: "Europe" },
  { id: "zurich",      name: "Zurich",             lat: 47.3769,  lng: 8.5417,    tz: "Europe/Zurich",         region: "Europe" },
  { id: "geneva",      name: "Geneva",             lat: 46.2044,  lng: 6.1432,    tz: "Europe/Zurich",         region: "Europe" },
  { id: "rome",        name: "Rome",               lat: 41.9028,  lng: 12.4964,   tz: "Europe/Rome",           region: "Europe" },
  { id: "milan",       name: "Milan",              lat: 45.4654,  lng: 9.1859,    tz: "Europe/Rome",           region: "Europe" },
  { id: "budapest",    name: "Budapest",           lat: 47.4979,  lng: 19.0402,   tz: "Europe/Budapest",       region: "Europe" },
  { id: "stockholm",   name: "Stockholm",          lat: 59.3293,  lng: 18.0686,   tz: "Europe/Stockholm",      region: "Europe" },
  { id: "madrid",      name: "Madrid",             lat: 40.4168,  lng: -3.7038,   tz: "Europe/Madrid",         region: "Europe" },
  { id: "barcelona",   name: "Barcelona",          lat: 41.3851,  lng: 2.1734,    tz: "Europe/Madrid",         region: "Europe" },

  // South America
  { id: "buenos-aires",name: "Buenos Aires",       lat: -34.6037, lng: -58.3816,  tz: "America/Argentina/Buenos_Aires", region: "South America" },
  { id: "sao-paulo",   name: "São Paulo",          lat: -23.5505, lng: -46.6333,  tz: "America/Sao_Paulo",     region: "South America" },
  { id: "mexico-city", name: "Mexico City",        lat: 19.4326,  lng: -99.1332,  tz: "America/Mexico_City",   region: "South America" },
  { id: "montevideo",  name: "Montevideo",         lat: -34.9011, lng: -56.1645,  tz: "America/Montevideo",    region: "South America" },

  // South Africa
  { id: "johannesburg",name: "Johannesburg",       lat: -26.2041, lng: 28.0473,   tz: "Africa/Johannesburg",   region: "South Africa" },
  { id: "cape-town",   name: "Cape Town",          lat: -33.9249, lng: 18.4241,   tz: "Africa/Johannesburg",   region: "South Africa" },

  // Australia & NZ
  { id: "melbourne",   name: "Melbourne",          lat: -37.8136, lng: 144.9631,  tz: "Australia/Melbourne",   region: "Australia & NZ" },
  { id: "sydney",      name: "Sydney",             lat: -33.8688, lng: 151.2093,  tz: "Australia/Sydney",      region: "Australia & NZ" },
  { id: "perth",       name: "Perth",              lat: -31.9505, lng: 115.8605,  tz: "Australia/Perth",       region: "Australia & NZ" },
  { id: "auckland",    name: "Auckland",           lat: -36.8485, lng: 174.7633,  tz: "Pacific/Auckland",      region: "Australia & NZ" },
];

export const LOCATION_REGIONS = Array.from(new Set(SHABBOS_LOCATIONS.map(l => l.region)));

export const DEFAULT_LOCATION_ID = "lakewood";

export function getLocationById(id: string): ShabbosLocation {
  return SHABBOS_LOCATIONS.find(l => l.id === id) ?? SHABBOS_LOCATIONS.find(l => l.id === DEFAULT_LOCATION_ID)!;
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
