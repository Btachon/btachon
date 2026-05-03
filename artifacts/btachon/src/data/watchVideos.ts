export type VideoCategory = "Emunah" | "Mussar" | "Hashkafa" | "Chassidus" | "Halacha" | "Tefillah";

export interface WatchVideo {
  id: string;
  title: string;
  speaker: string;
  channel: string;
  duration: string;
  category: VideoCategory;
  description: string;
  isShort: boolean;
}

export const WATCH_VIDEOS: WatchVideo[] = [
  {
    id: "NkVmhe0hLXc",
    title: "What Is Bitachon — Trust in G-d?",
    speaker: "Rabbi Manis Friedman",
    channel: "Rabbi Manis Friedman",
    duration: "5:14",
    category: "Emunah",
    description: "A concise and powerful explanation of what real trust in Hashem looks like in daily life.",
    isShort: true,
  },
  {
    id: "4LfJSWFBHu8",
    title: "The Secret of Jewish Happiness",
    speaker: "Rabbi Manis Friedman",
    channel: "Rabbi Manis Friedman",
    duration: "7:02",
    category: "Hashkafa",
    description: "Why simcha is not about circumstances — and how to find it regardless.",
    isShort: true,
  },
  {
    id: "r7DaFKGBFZE",
    title: "One Good Deed Changes Everything",
    speaker: "Rabbi YY Jacobson",
    channel: "TheYeshiva.net",
    duration: "6:30",
    category: "Mussar",
    description: "The power of a single mitzvah to shift the trajectory of your life.",
    isShort: true,
  },
  {
    id: "8xoEHpTy7Ik",
    title: "How to Daven — Making Tefillah Real",
    speaker: "Rabbi Akiva Tatz",
    channel: "TorahAnytime",
    duration: "4:55",
    category: "Tefillah",
    description: "Practical insight into transforming rote prayer into genuine conversation with Hashem.",
    isShort: true,
  },
  {
    id: "EQMgHWvq8m0",
    title: "The Baal Shem Tov on Emunah",
    speaker: "Rabbi YY Jacobson",
    channel: "TheYeshiva.net",
    duration: "8:44",
    category: "Chassidus",
    description: "Core Chassidic teachings on faith, presence, and the Divine spark within.",
    isShort: true,
  },
  {
    id: "wUpbIBMzGDc",
    title: "Why Bad Things Happen — An Honest Answer",
    speaker: "Rabbi Lawrence Kelemen",
    channel: "TorahAnytime",
    duration: "9:12",
    category: "Emunah",
    description: "A serious, honest approach to one of life's hardest questions.",
    isShort: true,
  },
  {
    id: "s7RcCCcv3p8",
    title: "Anger: The Mussar Approach",
    speaker: "Rabbi Shlomo Wolbe",
    channel: "TorahAnytime",
    duration: "6:01",
    category: "Mussar",
    description: "How the mussar masters understood anger and how to uproot it.",
    isShort: true,
  },
  {
    id: "1HoHMGFxBKQ",
    title: "Understanding the Shema",
    speaker: "Rabbi Jonathan Sacks",
    channel: "Rabbi Sacks",
    duration: "7:28",
    category: "Tefillah",
    description: "A profound look into the deepest words of Jewish faith.",
    isShort: true,
  },
  {
    id: "R5RKXRK3Hq0",
    title: "The Purpose of Creation — A Deep Dive",
    speaker: "Rabbi Akiva Tatz",
    channel: "TorahAnytime",
    duration: "48:22",
    category: "Hashkafa",
    description: "A comprehensive shiur on why we are here and what Hashem wants from us.",
    isShort: false,
  },
  {
    id: "QHvnIdtGZR8",
    title: "Free Will, Fate & Divine Providence",
    speaker: "Rabbi YY Jacobson",
    channel: "TheYeshiva.net",
    duration: "55:10",
    category: "Emunah",
    description: "How can we have free will if Hashem knows everything? A complete framework.",
    isShort: false,
  },
  {
    id: "Y3s3wGS0XBU",
    title: "The 48 Ways to Wisdom — Overview",
    speaker: "Rabbi Noah Weinberg",
    channel: "Aish HaTorah",
    duration: "42:00",
    category: "Mussar",
    description: "The foundational framework of the 48 ways to acquire Torah from Pirkei Avos.",
    isShort: false,
  },
  {
    id: "kUJU1-9VXes",
    title: "Tanya for Everyone — Class 1",
    speaker: "Rabbi Manis Friedman",
    channel: "Rabbi Manis Friedman",
    duration: "38:45",
    category: "Chassidus",
    description: "Starting from the very beginning — what the Alter Rebbe was teaching and why it matters now.",
    isShort: false,
  },
  {
    id: "fHkDmlkPKWA",
    title: "Halacha in Daily Life — Introduction",
    speaker: "Rabbi Hershel Schachter",
    channel: "TorahAnytime",
    duration: "51:30",
    category: "Halacha",
    description: "How halacha shapes every moment of a Jew's day — and why that's beautiful.",
    isShort: false,
  },
  {
    id: "dNJHWAOLJIQ",
    title: "Teshuva — Return, Not Guilt",
    speaker: "Rabbi Jonathan Sacks",
    channel: "Rabbi Sacks",
    duration: "34:18",
    category: "Hashkafa",
    description: "Reframing repentance as coming home rather than punishment.",
    isShort: false,
  },
];

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Emunah",
  "Mussar",
  "Hashkafa",
  "Chassidus",
  "Halacha",
  "Tefillah",
];
