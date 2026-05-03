export type ProfileType =
  | "teen_male"
  | "teen_female"
  | "single_male"
  | "single_female"
  | "married_male"
  | "married_female";

export interface Mitzvah {
  id: number;
  title: string;
  category: "Bein Adam L'Makom" | "Bein Adam L'Chavero" | "Mussar & Middos";
  explanation: string;
  todayAction: string;
  todayActions?: Partial<Record<ProfileType | "male" | "female" | "teen", string>>;
  source?: string;
}

export function getMitzvahAction(mitzvah: Mitzvah, profileType?: string): string {
  const acts = mitzvah.todayActions;
  if (!acts || !profileType) return mitzvah.todayAction;
  if (acts[profileType as ProfileType]) return acts[profileType as ProfileType]!;
  const isTeen = profileType.includes("teen");
  const isMale = profileType.includes("male");
  const isFemale = profileType.includes("female");
  if (isTeen && acts.teen) return acts.teen!;
  if (isMale && acts.male) return acts.male!;
  if (isFemale && acts.female) return acts.female!;
  return mitzvah.todayAction;
}

export const mitzvos: Mitzvah[] = [
  {
    id: 1, title: "Modeh Ani", category: "Bein Adam L'Makom",
    explanation: "The first words a Yid says upon waking — thanking Hashem for restoring the soul. Sets the entire day with gratitude.",
    todayAction: "Before getting out of bed tomorrow, say Modeh Ani slowly. Let the words sink in.",
    source: "Shulchan Aruch OC 1"
  },
  {
    id: 2, title: "Negel Vasser", category: "Bein Adam L'Makom",
    explanation: "Washing hands three times alternately upon waking — removing the spiritual residue of sleep before engaging the world.",
    todayAction: "Keep a cup and basin by your bed tonight. Wash 3x right when you wake up.",
    source: "Shulchan Aruch OC 4"
  },
  {
    id: 3, title: "Ahavas Yisroel", category: "Bein Adam L'Chavero",
    explanation: "Loving every Yid as yourself — Rabbi Akiva called this 'a great principle of the Torah.'",
    todayAction: "Reach out to one person today and tell them something you genuinely appreciate about them.",
    source: "Vayikra 19:18"
  },
  {
    id: 4, title: "Shema Yisroel", category: "Bein Adam L'Makom",
    explanation: "Declaring the unity of Hashem twice daily — the foundational statement of emunah for every Yid.",
    todayAction: "Say the first pasuk of Shema with full kavanah, covering your eyes, before bed tonight.",
    source: "Devarim 6:4"
  },
  {
    id: 5, title: "Birchas HaMazon", category: "Bein Adam L'Makom",
    explanation: "Bentching after eating bread — the only blessing the Torah explicitly commands, thanking Hashem for sustenance.",
    todayAction: "Bentch from a bentcher today, not by heart. Read every word.",
    source: "Devarim 8:10"
  },
  {
    id: 6, title: "Honoring Parents", category: "Bein Adam L'Chavero",
    explanation: "Kibbud Av V'Em — one of the Aseres HaDibros. Includes how you speak to them, sit in their presence, and care for their needs.",
    todayAction: "Call a parent today just to ask how they are. No agenda.",
    todayActions: {
      teen: "The next time a parent asks you to do something today, do it right away — no sighing, no eye rolls. That is Kibbud Av V'Em.",
      teen_male: "The next time a parent asks you to do something today, do it immediately and cheerfully. That is the mitzvah.",
      teen_female: "The next time a parent asks you to do something today, do it immediately and cheerfully. That is the mitzvah.",
    },
    source: "Shemos 20:12"
  },
  {
    id: 7, title: "Tzedakah", category: "Bein Adam L'Chavero",
    explanation: "Giving charity isn't optional — it's a chiyuv. Even the poor must give. Tzedakah saves from harsh decrees.",
    todayAction: "Put a coin in a pushka before davening today. Even one coin counts.",
    todayActions: {
      teen: "Put whatever coins you have in a pushka today. The amount doesn't matter — the habit does.",
      teen_male: "Put whatever coins you have in a pushka today. Even one coin before learning.",
      teen_female: "Put whatever coins you have in a pushka today. Even a small amount builds the middah.",
    },
    source: "Devarim 15:7-8"
  },
  {
    id: 8, title: "Bikur Cholim", category: "Bein Adam L'Chavero",
    explanation: "Visiting the sick — Hashem Himself does this mitzvah. Visiting takes 1/60th of the illness from them.",
    todayAction: "Send a real check-in message to someone who's been unwell. Not just 'how are you?' — ask something specific.",
    source: "Bereishis 18:1"
  },
  {
    id: 9, title: "Loshon Hara — Refraining", category: "Bein Adam L'Chavero",
    explanation: "Speaking negatively about another Yid even if true is forbidden. The Chofetz Chaim taught us this is the spiritual cancer of our generation.",
    todayAction: "For one full hour today, catch yourself before saying anything negative about anyone.",
    todayActions: {
      teen: "In school or with friends today, notice every time you're about to say something negative about someone. Pause. Change the subject.",
      teen_male: "In yeshiva or with friends today, notice every time you start speaking negatively. Pause. Change the subject.",
      teen_female: "In school or with friends today, notice every time you're about to say something negative. Pause. That pause is the mitzvah.",
    },
    source: "Vayikra 19:16"
  },
  {
    id: 10, title: "Shabbos Candles", category: "Bein Adam L'Makom",
    explanation: "Lighting candles brings peace into the home before Shabbos. The light represents shalom bayis and the shechinah resting in your home.",
    todayAction: "If it's Erev Shabbos, light on time. If not, prepare the candles and matches now so you don't scramble.",
    todayActions: {
      male: "Make sure your home is fully set before your wife lights — dishes, table, atmosphere.",
      married_male: "Help your wife prepare for Shabbos today. Set the table. Handle the kids. Let her light in peace.",
      teen_male: "Help your family prepare for Shabbos. Offer to set the table or clean up without being asked.",
      teen_female: "Learn the exact candle lighting time for your city this week and the bracha by heart.",
      single_female: "If you light candles, do it this week on time with the proper bracha. Look up the time now.",
      married_female: "Light on time this week with full kavanah. Daven for your family during those moments.",
    },
    source: "Shabbos 25b"
  },
  {
    id: 11, title: "Asher Yatzar", category: "Bein Adam L'Makom",
    explanation: "The bracha after using the bathroom — thanking Hashem for the body's openings and chambers working properly. A mussar lesson on appreciating what we ignore.",
    todayAction: "Print Asher Yatzar and tape it next to a sink in your home. Say it with kavanah today.",
    source: "Berachos 60b"
  },
  {
    id: 12, title: "Hachnasas Orchim", category: "Bein Adam L'Chavero",
    explanation: "Welcoming guests — Avraham Avinu's signature mitzvah. Greater than receiving the Shechinah.",
    todayAction: "Invite someone for a Shabbos meal — even just dessert. Reach out today.",
    todayActions: {
      teen: "Invite a friend who might be lonely to hang out this week. That's hachnasas orchim for your stage of life.",
      teen_male: "Invite a friend or classmate who might be by himself to join your Shabbos table or meal.",
      teen_female: "Invite a friend who might be lonely or new to come over or join your Shabbos.",
    },
    source: "Bereishis 18"
  },
  {
    id: 13, title: "Talmud Torah", category: "Bein Adam L'Makom",
    explanation: "Learning Torah is k'neged kulam — equal to all other mitzvos combined. Even one pasuk, one halacha, one mishna.",
    todayAction: "Open a sefer right now and learn for 5 minutes. Anything counts.",
    todayActions: {
      teen_male: "Open a Gemara or Chumash right now — even for 5 minutes. What you learn today you carry forever.",
      teen_female: "Open a sefer — Pirkei Avos, a parsha sheet, anything Torah — and learn one thing today that you can share at dinner.",
    },
    source: "Mishna Peah 1:1"
  },
  {
    id: 14, title: "Tefillin", category: "Bein Adam L'Makom",
    explanation: "Binding Hashem's words on your arm and head — aligning action and thought to His will every weekday morning.",
    todayAction: "Put on tefillin today with kavanah. Read the parshiyos inside at least once this week.",
    todayActions: {
      male: "Put on tefillin today with kavanah. Read the parshiyos inside at least once this week.",
      female: "Learn today what is written inside the tefillin parshiyos and what each one means.",
      teen_male: "Put on tefillin with kavanah today. Say at least Shema while wearing them before rushing through.",
      teen_female: "Look up what the four parshiyos of tefillin say — they are beautiful. That's your learning today.",
      single_female: "Learn about the mitzvah of tefillin today — what the scrolls contain and what wearing them represents.",
      married_female: "Learn about the mitzvah of tefillin today — what the scrolls contain and what wearing them represents.",
    },
    source: "Devarim 6:8"
  },
  {
    id: 15, title: "Mezuzah", category: "Bein Adam L'Makom",
    explanation: "Hashem's name guards your doorway. Touching the mezuzah reminds you Whose home you're entering and leaving.",
    todayAction: "Touch every mezuzah you pass today and say a kavanah — even silently.",
    source: "Devarim 6:9"
  },
  {
    id: 16, title: "Tzitzis", category: "Bein Adam L'Makom",
    explanation: "The four corners remind us of all 613 mitzvos. The blue of techeiles points to the heavens.",
    todayAction: "Look at your tzitzis during Shema today and remember what they're for.",
    todayActions: {
      male: "Look at your tzitzis during Shema today and think about what they represent.",
      female: "Think about a physical reminder you have in your life that points you toward Hashem — a piece of jewelry, a mezuzah, a siddur. Use it today.",
      teen_male: "Look at your tzitzis during Shema today and actually think about the 613 mitzvos they represent.",
      teen_female: "Think of one thing you wear or carry that could remind you of Hashem today. Assign it that meaning.",
    },
    source: "Bamidbar 15:38-39"
  },
  {
    id: 17, title: "Kashrus", category: "Bein Adam L'Makom",
    explanation: "What enters the body shapes the neshama. Kashrus isn't dietary law — it's spiritual hygiene.",
    todayAction: "Check the hechsher on something in your kitchen you've never checked before.",
    source: "Vayikra 11"
  },
  {
    id: 18, title: "Chai — Living Mitzvos", category: "Mussar & Middos",
    explanation: "Chai (18) means life. Every mitzvah is a unit of life. The numerical value reminds us mitzvos aren't burdens — they're aliveness.",
    todayAction: "Give $18 (or any amount) to tzedakah today.",
    todayActions: {
      teen: "Give whatever you have — even $1.80 — to tzedakah today. Chai is about intention, not amount.",
    },
    source: "Mishna Avos 4:2"
  },
  {
    id: 19, title: "Kavod HaBriyos", category: "Bein Adam L'Chavero",
    explanation: "The dignity of every human being created b'tzelem Elokim. So great that it can override rabbinic law in certain cases.",
    todayAction: "Open a door, hold an elevator, or thank a worker by name today. Treat someone invisible like a person.",
    source: "Berachos 19b"
  },
  {
    id: 20, title: "Emunah", category: "Mussar & Middos",
    explanation: "Believing Hashem runs the world — every detail, every breath, every situation you're in is from Him. The foundation under everything.",
    todayAction: "Next time something doesn't go your way today, pause and say 'Gam zu l'tovah.' Mean it.",
    source: "Berachos 60b"
  },
  {
    id: 21, title: "Bitachon", category: "Mussar & Middos",
    explanation: "Trust in Hashem isn't passive — it's the active confidence that He's got you. Btachon is the application of emunah.",
    todayAction: "Identify one thing you're worrying about. Hand it to Hashem in your own words today.",
    todayActions: {
      teen: "What are you stressed about with school, friends, or your future? Write it down and then write: 'Hashem, I'm handing this to You.'",
    },
    source: "Tehillim 37:3"
  },
  {
    id: 22, title: "Hakaras HaTov", category: "Mussar & Middos",
    explanation: "Recognizing the good. The starting point of all middos — you can't grow if you don't see what you've been given.",
    todayAction: "Write down 3 specific things from today you're grateful for. Be specific — not 'family' but 'the way she laughed at dinner.'",
    source: "Devarim 8"
  },
  {
    id: 23, title: "Anavah", category: "Mussar & Middos",
    explanation: "Humility isn't thinking less of yourself — it's thinking of yourself less. Moshe Rabbeinu's defining trait.",
    todayAction: "In your next conversation today, ask 2 questions before you share anything about yourself.",
    source: "Bamidbar 12:3"
  },
  {
    id: 24, title: "Shemiras HaLashon", category: "Bein Adam L'Chavero",
    explanation: "Guarding your speech actively — not just avoiding loshon hara, but speaking words that build instead of break.",
    todayAction: "Give one specific compliment today that you'd normally just think.",
    source: "Tehillim 34:14"
  },
  {
    id: 25, title: "Mincha", category: "Bein Adam L'Makom",
    explanation: "The middle prayer — the hardest to remember and the most precious. Eliyahu was answered specifically at Mincha.",
    todayAction: "Set an alarm for Mincha today. Say at least Ashrei and Shemoneh Esrei.",
    todayActions: {
      male: "Set an alarm for Mincha today. Get to a minyan if you can, or daven alone — but do it.",
      female: "At Mincha time today, take 2 minutes to speak to Hashem in your own words. You don't need the nusach — He hears everything.",
      teen_male: "Set an alarm for Mincha. Even if you're busy — step aside and daven those few minutes.",
      teen_female: "At some point during the afternoon today, stop and say a few words to Hashem. Tell Him what's on your mind.",
    },
    source: "Berachos 6b"
  },
  {
    id: 26, title: "Chesed", category: "Bein Adam L'Chavero",
    explanation: "Acts of kindness — the world stands on three things, and chesed is one of them. No mitzvah expands the soul faster.",
    todayAction: "Do one anonymous chesed today. No credit, no thank you needed.",
    source: "Pirkei Avos 1:2"
  },
  {
    id: 27, title: "Krias Shema Al HaMita", category: "Bein Adam L'Makom",
    explanation: "Saying Shema before sleep — entrusting your neshama to Hashem for the night. A protection and a tikkun.",
    todayAction: "Say at least the first paragraph of Shema in bed tonight before falling asleep.",
    source: "Berachos 5a"
  },
  {
    id: 28, title: "Brachos on Food", category: "Bein Adam L'Makom",
    explanation: "Saying a bracha turns eating from animal consumption into a holy act. Every bite is a meeting with the Creator.",
    todayAction: "Say one bracha today out loud, slowly, with the meaning in mind. Don't rush.",
    source: "Berachos 35a"
  },
  {
    id: 29, title: "Tefillah B'Tzibbur", category: "Bein Adam L'Makom",
    explanation: "Praying with a minyan — your tefillos are amplified, accepted differently, and you build the spiritual fabric of klal Yisroel.",
    todayAction: "Daven at least one tefillah in shul this week. If today is possible, go.",
    todayActions: {
      male: "Daven at least one tefillah in shul today. Make the effort — the minyan needs you and you need the minyan.",
      teen_male: "Get to shul for at least one tefillah today. Even if it's hard — especially if it's hard.",
      female: "Daven Shacharis today with real focus — even at home. Dedicate your tefillah to someone who needs a yeshua.",
      teen_female: "Daven Shacharis today with focus — even just Shema and Shemoneh Esrei. Hashem is listening.",
      single_female: "Daven Shacharis today with intention. Even at home — dedicate it to someone who needs a yeshua.",
      married_female: "Daven today with focus — even briefly. Dedicate it to your family's health and the klal.",
    },
    source: "Berachos 8a"
  },
  {
    id: 30, title: "Lo Sikom V'Lo Sitor", category: "Bein Adam L'Chavero",
    explanation: "Don't take revenge, don't bear a grudge. The Torah commands us to release the resentment in our hearts.",
    todayAction: "Think of one person you're holding something against. Let it go today — even just internally.",
    source: "Vayikra 19:18"
  },
  {
    id: 31, title: "Kiddush Levana", category: "Bein Adam L'Makom",
    explanation: "Sanctifying the new moon — a monthly mitzvah connecting us to Klal Yisroel's renewal. Like greeting the Shechinah.",
    todayAction: "Check when the next Kiddush Levana window opens. Add it to your calendar.",
    source: "Sanhedrin 42a"
  },
  {
    id: 32, title: "Hidur Mitzvah", category: "Bein Adam L'Makom",
    explanation: "Beautifying the mitzvah — going beyond the minimum. A nicer esrog, a more careful tefillah, a sweeter Shabbos zemer.",
    todayAction: "Pick one mitzvah you'll do today and add one element of beauty to it.",
    source: "Shabbos 133b"
  },
  {
    id: 33, title: "Hashavas Aveida", category: "Bein Adam L'Chavero",
    explanation: "Returning lost items — caring about another Yid's property as much as your own.",
    todayAction: "If you've been holding onto something that isn't yours, return it today.",
    source: "Devarim 22:1-3"
  },
  {
    id: 34, title: "V'Halachta B'Drachav", category: "Mussar & Middos",
    explanation: "Walking in Hashem's ways — being merciful as He is merciful, patient as He is patient. Imitation is the deepest avodah.",
    todayAction: "When you'd normally react harshly today, pause and ask 'how would Hashem respond to me right now?'",
    source: "Devarim 28:9"
  },
  {
    id: 35, title: "Yiras Shamayim", category: "Mussar & Middos",
    explanation: "Awe of Heaven — not fear of punishment, but the felt awareness that Hashem is here, watching, present.",
    todayAction: "Pick one moment today (during a meal, in the car, at work) and say to yourself 'Hashem is here.'",
    todayActions: {
      teen: "Pick one moment today — in school, at home, with friends — and say silently: 'Hashem is here right now.'",
    },
    source: "Devarim 10:12"
  },
  {
    id: 36, title: "Hochiach Tochiach", category: "Bein Adam L'Chavero",
    explanation: "Gentle rebuke — when done with love, can save a person. When done wrong, destroys. The mitzvah is to care enough to speak.",
    todayAction: "If there's something you've meant to address with someone you love, prepare to say it kindly.",
    source: "Vayikra 19:17"
  },
  {
    id: 37, title: "Lo Sa'amod Al Dam Re'echa", category: "Bein Adam L'Chavero",
    explanation: "Don't stand by your brother's blood — when a Yid is in danger, physical or spiritual, you must act.",
    todayAction: "If you know someone struggling, reach out today. Even a short message.",
    source: "Vayikra 19:16"
  },
  {
    id: 38, title: "Tznius", category: "Mussar & Middos",
    explanation: "Modesty in dress, speech, behavior. Not about hiding — about preserving what's holy for where it belongs.",
    todayAction: "Choose one thing today you'd normally share publicly and keep it just for yourself.",
    todayActions: {
      male: "Guard your eyes today. In every interaction, carry yourself with dignity — in dress, speech, and how you look at others.",
      female: "Choose one item in your wardrobe today and ask honestly: does this represent who I want to be?",
      teen_male: "Guard your eyes today. In every interaction, carry yourself with dignity. That's your avodah right now.",
      teen_female: "Think about how you present yourself to the world — in dress, in speech, on social media. Choose one area to elevate today.",
      single_male: "Guard your eyes and speech today. Tznius for men is about dignity in how you carry yourself, not just what you wear.",
      single_female: "Think about one area of tznius — dress, speech, or digital life — and strengthen it today.",
      married_male: "Guard your eyes and speech today. Tznius in a man expresses itself in how he conducts himself publicly.",
      married_female: "Think about tznius in the home today — the atmosphere you create, the way you speak to your husband and children.",
    },
    source: "Micha 6:8"
  },
  {
    id: 39, title: "Shabbos — Shamor", category: "Bein Adam L'Makom",
    explanation: "Guarding Shabbos by refraining from melacha. The day Hashem invites us to stop and remember Who runs the world.",
    todayAction: "Decide before Shabbos which one thing you'll be extra careful about this week.",
    source: "Devarim 5:12"
  },
  {
    id: 40, title: "Shabbos — Zachor", category: "Bein Adam L'Makom",
    explanation: "Remembering Shabbos — not just on the day, but throughout the week. Building toward it, anticipating it.",
    todayAction: "Buy or set aside something today specifically for this Shabbos.",
    source: "Shemos 20:8"
  },
  {
    id: 41, title: "Pidyon Shvuyim", category: "Bein Adam L'Chavero",
    explanation: "Redeeming captives — among the highest mitzvos. Today: helping any Yid stuck in difficult circumstances.",
    todayAction: "Donate to an organization that helps Yidden in crisis. Any amount.",
    source: "Bava Basra 8b"
  },
  {
    id: 42, title: "Nichum Aveilim", category: "Bein Adam L'Chavero",
    explanation: "Comforting mourners — being present in another's grief. You don't need to say much. Just being there is the mitzvah.",
    todayAction: "Reach out to someone who lost a loved one — even years ago. Their loss doesn't expire.",
    source: "Bereishis 25:11"
  },
  {
    id: 43, title: "Hachnasas Kallah", category: "Bein Adam L'Chavero",
    explanation: "Helping a kallah marry — gladdening a chassan and kallah. Bringing simcha to a couple is a personal mitzvah.",
    todayAction: "If you know someone getting married, write them a heartfelt note this week.",
    todayActions: {
      teen: "If anyone in your community is getting married soon, send a warm mazal tov. Show up with simcha.",
      teen_male: "If anyone in your circle is getting engaged or married, send a real mazal tov today — not just a reaction.",
      teen_female: "If anyone in your circle is getting engaged or married, send a real mazal tov today — and mean it.",
    },
    source: "Kesubos 17a"
  },
  {
    id: 44, title: "Levayas HaMes", category: "Bein Adam L'Chavero",
    explanation: "Accompanying the deceased — escorting a Yid to their final rest. The ultimate chesed shel emes — kindness with no return.",
    todayAction: "If a levaya is happening in your community, attend even briefly.",
    source: "Bereishis 50:7"
  },
  {
    id: 45, title: "Limud HaMussar", category: "Mussar & Middos",
    explanation: "Daily mussar study — even five minutes — keeps the soul awake. Mesilas Yesharim, Chovos Halevavos, Pirkei Avos.",
    todayAction: "Read one paragraph of any mussar sefer today. One paragraph.",
    todayActions: {
      teen: "Read one paragraph of Pirkei Avos today. Just one. Look up what it means.",
      teen_male: "Read one mishna of Pirkei Avos today — really think about what it's telling you.",
      teen_female: "Read one paragraph of Pirkei Avos or any mussar book. One paragraph can change how you see the whole day.",
    },
    source: "Mesilas Yesharim Intro"
  },
  {
    id: 46, title: "Daven for Others", category: "Bein Adam L'Chavero",
    explanation: "Praying for someone else's needs before your own — the one who prays for his friend is answered first.",
    todayAction: "Say a perek of Tehillim today specifically for someone you know who needs it.",
    source: "Bava Kamma 92a"
  },
  {
    id: 47, title: "Smiling at Another", category: "Bein Adam L'Chavero",
    explanation: "Showing a friendly face — Shammai taught: greet every person with a sever panim yafos. Costs nothing, gives everything.",
    todayAction: "Smile genuinely at every person you encounter today.",
    source: "Pirkei Avos 1:15"
  },
  {
    id: 48, title: "Erev Shabbos Prep", category: "Bein Adam L'Makom",
    explanation: "Preparing for Shabbos with simcha — bathing, dressing well, setting the table. The whole week feeds into this.",
    todayAction: "On Friday, do one extra thing to honor Shabbos beyond your usual routine.",
    todayActions: {
      male: "On Friday, do something to actively help prepare for Shabbos — set the table, bathe the kids, do the shopping.",
      married_male: "On Friday, take something off your wife's plate to help prepare for Shabbos — without being asked.",
      female: "On Friday, prepare one thing for Shabbos with intention — cook a dish, set a beautiful table, prepare yourself.",
      married_female: "On Friday, do one thing you don't usually do to honor the Shabbos table — even one extra dish or a special centerpiece.",
      teen_male: "On Erev Shabbos, do something to help at home without being asked. Set the table, clean up, run an errand.",
      teen_female: "On Erev Shabbos, do something to help your mother prepare — without being asked. That's the mitzvah.",
    },
    source: "Shabbos 25b"
  },
  {
    id: 49, title: "Vidui", category: "Bein Adam L'Makom",
    explanation: "Confession — naming what you did wrong out loud. The first step of teshuva. Hashem is waiting to forgive.",
    todayAction: "In your own words tonight, name one thing to Hashem you'd like to do better tomorrow.",
    source: "Bamidbar 5:7"
  },
  {
    id: 50, title: "Simcha Shel Mitzvah", category: "Mussar & Middos",
    explanation: "Joy in doing a mitzvah — not duty, not obligation, but the genuine simcha of getting to serve Hashem.",
    todayAction: "Do your next mitzvah today with a smile. Notice the difference.",
    source: "Devarim 28:47"
  },
];

export const TIER_THRESHOLDS = [
  { name: "Beginning", min: 0, label: "Just starting out" },
  { name: "Rising", min: 10, label: "Building momentum" },
  { name: "Chai", min: 18, label: "18 mitzvos — life itself" },
  { name: "Devoted", min: 50, label: "Deeply committed" },
  { name: "Tzaddik", min: 100, label: "A righteous foundation" },
  { name: "Kadosh", min: 200, label: "Set apart for kedushah" },
  { name: "Taryag", min: 613, label: "The full 613 — a lifetime of growth" },
] as const;

export function getTierForCount(count: number) {
  let current: typeof TIER_THRESHOLDS[number] = TIER_THRESHOLDS[0];
  for (const tier of TIER_THRESHOLDS) {
    if (count >= tier.min) current = tier;
  }
  const nextTier = TIER_THRESHOLDS.find(t => t.min > count);
  return { current, next: nextTier };
}

export function getMitzvahForDate(date: Date): Mitzvah {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return mitzvos[day % mitzvos.length];
}
