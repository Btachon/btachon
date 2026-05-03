import sessionGemara from "@/assets/session-gemara.png";
import sessionTorah from "@/assets/session-torah.png";
import sessionTehillim from "@/assets/session-tehillim.png";
import sessionMussar from "@/assets/session-mussar.png";

export const lishmaSessions = [
  {
    id: "ls1",
    title: "Intro to Daf Yomi",
    host: "Rabbi Y. Goldstein",
    hostAvatar: "YG",
    date: "Today, 6:00 AM",
    duration: "45 min",
    level: "Beginner",
    registered: 120,
    capacity: 500,
    image: sessionGemara,
    topic: "Gemara"
  },
  {
    id: "ls2",
    title: "Parshas Hashavua deep dive with Rav Mendel",
    host: "Rav Mendel",
    hostAvatar: "RM",
    date: "Thursday, 8:30 PM",
    duration: "60 min",
    level: "All",
    registered: 340,
    capacity: 1000,
    image: sessionTorah,
    topic: "Parsha"
  },
  {
    id: "ls3",
    title: "Tehillim — the Five Books of David",
    host: "Eliyahu Weiss",
    hostAvatar: "EW",
    date: "Sunday, 10:00 AM",
    duration: "30 min",
    level: "All",
    registered: 45,
    capacity: 100,
    image: sessionTehillim,
    topic: "Tehillim"
  },
  {
    id: "ls4",
    title: "Mussar — Mesilas Yesharim",
    host: "Moshe Klein",
    hostAvatar: "MK",
    date: "Tuesday, 9:00 PM",
    duration: "40 min",
    level: "Intermediate",
    registered: 85,
    capacity: 200,
    image: sessionMussar,
    topic: "Mussar"
  },
  {
    id: "ls5",
    title: "Hilchos Shabbos for Beginners",
    host: "Aryeh Friedman",
    hostAvatar: "AF",
    date: "Wednesday, 7:30 PM",
    duration: "45 min",
    level: "Beginner",
    registered: 150,
    capacity: 300,
    image: sessionTorah,
    topic: "Halacha"
  },
  {
    id: "ls6",
    title: "Pirkei Avos Chapter 1 series",
    host: "Meir Klein",
    hostAvatar: "MK",
    date: "Shabbos, 5:00 PM",
    duration: "30 min",
    level: "All",
    registered: 200,
    capacity: 500,
    image: sessionMussar,
    topic: "Hashkafa"
  },
  {
    id: "ls7",
    title: "Tanya — Likutei Amarim Chapter 1",
    host: "Shlomo Katz",
    hostAvatar: "SK",
    date: "Monday, 8:00 PM",
    duration: "50 min",
    level: "Intermediate",
    registered: 110,
    capacity: 250,
    image: sessionTehillim,
    topic: "Chassidus"
  },
  {
    id: "ls8",
    title: "Hebrew Reading Bootcamp",
    host: "Yaakov Rosenberg",
    hostAvatar: "YR",
    date: "Sunday, 11:00 AM",
    duration: "45 min",
    level: "Beginner",
    registered: 30,
    capacity: 50,
    image: sessionTorah,
    topic: "Language"
  }
];