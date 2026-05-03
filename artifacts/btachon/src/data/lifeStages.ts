export type LifeStageId =
  | "preteen"
  | "teen"
  | "young_adult"
  | "married_woman"
  | "married_man"
  | "working_pro"
  | "parent"
  | "senior";

export interface LifeStage {
  id: LifeStageId;
  label: string;
  tagline: string;
  icon: string;
  chaiWelcome: string;
  defaultHabits: string[];
  geulahLens: string;
  geulahExamples: Record<string, string>;
}

export const LIFE_STAGES: LifeStage[] = [
  {
    id: "preteen",
    label: "Pre-Teen",
    tagline: "8–12 · Growing, learning, becoming",
    icon: "⟡",
    chaiWelcome: "Every small good thing you do matters more than you know. You're just getting started.",
    defaultHabits: [
      "Say Modeh Ani when you wake up",
      "Say a bracha before eating — out loud, slowly",
      "Do one kind thing for a sibling or friend today",
      "Help at home without being asked",
    ],
    geulahLens: "You're still young, but your actions are real. Every kind thing you do helps build a better world — that's not a small thing.",
    geulahExamples: {
      Kindness: "Share something — a snack, a turn, a compliment — with someone around you.",
      Patience: "When something doesn't go your way, take a deep breath before reacting.",
      Speech: "Say something nice about a classmate. Don't join in when others are making fun of someone.",
      Respect: "Say good morning to a teacher or parent first — don't wait for them to greet you.",
      Mindfulness: "Before you pick up a screen, think: is there something better I could do right now?",
      Helping: "Help a younger kid or sibling with something they're struggling with.",
    },
  },
  {
    id: "teen",
    label: "Teen",
    tagline: "13–18 · School, growth, finding yourself",
    icon: "⟡",
    chaiWelcome: "Small wins build big character. You're at the beginning of something real.",
    defaultHabits: [
      "Put your phone away 30 min before bed",
      "Say something kind to a classmate",
      "Learn one halacha or Torah thought today",
      "Help at home without being asked",
    ],
    geulahLens: "As a teen, your influence on peers is huge. Every kind word and act of respect builds something real.",
    geulahExamples: {
      Kindness: "Let a friend go first. Compliment someone sincerely — not sarcastically.",
      Patience: "When a parent or teacher corrects you, take a breath before reacting.",
      Speech: "Don't talk about a classmate behind their back today, even if it's 'just a joke'.",
      Respect: "Greet a teacher or rabbi first — show them you see them.",
      Mindfulness: "Before you open social media, pause for 10 seconds and ask: do I need this right now?",
      Helping: "Offer to help a younger sibling or someone who looks overwhelmed.",
    },
  },
  {
    id: "young_adult",
    label: "Young Adult",
    tagline: "18–25 · College, dating, building a life",
    icon: "⟡",
    chaiWelcome: "This is your foundation era. The habits you build now are the ones you'll have forever.",
    defaultHabits: [
      "20 minutes of Torah learning (any sefer you love)",
      "Daven Shacharis before your day starts",
      "Reach out to a parent or mentor today",
      "No social media before davening",
    ],
    geulahLens: "You're forming your identity right now. Every step you take toward kindness is shaping who you'll be for life.",
    geulahExamples: {
      Kindness: "Treat the barista, Uber driver, or store clerk like a person — make eye contact, say thank you.",
      Patience: "When plans fall through, don't spiral. Accept it gracefully.",
      Speech: "In a group chat, don't pile on when someone is being mocked.",
      Respect: "Respond to messages from older relatives — they think about you more than you know.",
      Mindfulness: "Eat one meal today without your phone.",
      Helping: "Help a friend with something they're stressed about, even if it's boring for you.",
    },
  },
  {
    id: "married_woman",
    label: "Married Woman",
    tagline: "Shalom bayis, motherhood, growth, presence",
    icon: "⟡",
    chaiWelcome: "The home you build is the most sacred space in the world. You make it what it is.",
    defaultHabits: [
      "Say one genuinely kind thing to your husband",
      "10 minutes of personal tefillah or journaling",
      "Speak gently in one hard parenting moment",
      "Light Shabbos candles (or prepare for it) with kavana",
    ],
    geulahLens: "The home is where geulah begins. Your patience, warmth, and speech literally shape the people around you.",
    geulahExamples: {
      Kindness: "Do something thoughtful for your husband that he didn't ask for.",
      Patience: "When the kids are loud and chaotic, take one deep breath before responding.",
      Speech: "Don't vent about your spouse to a friend today — even justified. Protect the bayis.",
      Respect: "Acknowledge your mother-in-law or a family elder today.",
      Mindfulness: "Put your phone in a drawer for one hour and just be present with your family.",
      Helping: "Help another mother — a meal, a ride, a listening ear.",
    },
  },
  {
    id: "married_man",
    label: "Married Man",
    tagline: "Torah, parnassah, husband, father",
    icon: "⟡",
    chaiWelcome: "You carry multiple worlds. Each one matters. Build consistency, not perfection.",
    defaultHabits: [
      "30 minutes of Torah learning (shiur, daf, anything)",
      "Daven with a minyan",
      "Help your wife with one task without being asked",
      "Come home on time and be present when you do",
    ],
    geulahLens: "As a husband and father, your middos set the tone for your entire household. The geulah starts at your Shabbos table.",
    geulahExamples: {
      Kindness: "Bring home something small for your wife — a coffee, her favorite snack — just because.",
      Patience: "When a child acts out, respond with firmness and warmth, not frustration.",
      Speech: "Don't complain about work or stress in front of your children. They absorb it.",
      Respect: "Tell your wife something specific you appreciate about her today.",
      Mindfulness: "Be fully present for Shabbos — not half-checking your phone.",
      Helping: "Handle one thing at home that you usually let slide.",
    },
  },
  {
    id: "working_pro",
    label: "Working Professional",
    tagline: "Career, ethics, time, purpose",
    icon: "⟡",
    chaiWelcome: "Kedushah doesn't stop at the office door. You can be a kiddush Hashem every single day.",
    defaultHabits: [
      "Set a learning alarm for lunch — even 10 minutes counts",
      "Say Mincha no matter how busy it gets",
      "One act of complete honesty in business today",
      "Recite Asher Yatzar with intention",
    ],
    geulahLens: "Your workplace is your arena. The way you treat colleagues, speak about competitors, and handle pressure is mamash geulah work.",
    geulahExamples: {
      Kindness: "Say something encouraging to a stressed coworker. Actually mean it.",
      Patience: "When a meeting runs long or someone is slow, hold your frustration.",
      Speech: "Don't badmouth a competitor, difficult client, or colleague — even off the record.",
      Respect: "Acknowledge the cleaning staff, admin, or junior team member today.",
      Mindfulness: "Take 5 minutes at midday to step away from your screen and breathe.",
      Helping: "Help a colleague finish something — even if it's not your job.",
    },
  },
  {
    id: "parent",
    label: "Parent",
    tagline: "Raising the next generation — the ultimate chinuch",
    icon: "⟡",
    chaiWelcome: "Every patient moment, every lesson, every hug — you're building future Jews. That's the whole job.",
    defaultHabits: [
      "Tell a child something specific you love about them",
      "Learn something together with a child (any level)",
      "React to one meltdown with full patience",
      "Model something you want them to become",
    ],
    geulahLens: "Chinuch is geulah work. Every moment of patience, every kind word at the Shabbos table — your children are watching and absorbing all of it.",
    geulahExamples: {
      Kindness: "Let a child pick what's for dinner or what game to play — give them real autonomy.",
      Patience: "When a child makes a mess or breaks something, respond warmly. They need to see how you handle failure.",
      Speech: "Speak about other people — teachers, relatives — with respect in front of your kids.",
      Respect: "Apologize to a child when you get it wrong. It teaches more than any lecture.",
      Mindfulness: "Put your phone face down at the dinner table tonight.",
      Helping: "Help another parent who's overwhelmed — watch their kid, bring food, check in.",
    },
  },
  {
    id: "senior",
    label: "Senior",
    tagline: "Wisdom, legacy, presence, simchas hachaim",
    icon: "⟡",
    chaiWelcome: "You've built so much. Now is the time to share it, live it, and enjoy every moment you've earned.",
    defaultHabits: [
      "Call or message a grandchild or younger person",
      "Share a Torah thought or story with someone today",
      "Take a walk and say a few kapitlach of Tehillim",
      "Do one act of chesed — it only gets easier with practice",
    ],
    geulahLens: "Your wisdom, your stories, your presence — they are irreplaceable. You carry living Torah. Every connection you make is geulah.",
    geulahExamples: {
      Kindness: "Write or call someone who might not expect to hear from you. It will mean the world.",
      Patience: "When technology frustrates you or plans change, let it go gracefully.",
      Speech: "Share a memory or teaching with a grandchild or young person.",
      Respect: "Acknowledge the work of people who care for or assist you.",
      Mindfulness: "Sit outside for a few minutes and take in the world Hashem made.",
      Helping: "Offer your experience to someone navigating a challenge you've already been through.",
    },
  },
];

export function getLifeStage(id: LifeStageId | null): LifeStage | null {
  if (!id) return null;
  return LIFE_STAGES.find(s => s.id === id) ?? null;
}
