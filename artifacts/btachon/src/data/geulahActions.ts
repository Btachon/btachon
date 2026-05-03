export interface GeulahAction {
  id: number;
  category: "Kindness" | "Patience" | "Speech" | "Respect" | "Mindfulness" | "Helping";
  title: string;
  action: string;
  why: string;
}

export const geulahActions: GeulahAction[] = [
  { id: 1, category: "Kindness", title: "A word to a stranger", action: "Say something genuinely kind to someone you don't usually talk to today — a coworker, a neighbor, a cashier.", why: "Every kind word repairs a fragment of the broken world. Geulah comes from the spaces between people." },
  { id: 2, category: "Speech", title: "Hold back one word", action: "Catch yourself before saying one negative thing today — about anyone. Notice the urge. Don't say it.", why: "The Beis Hamikdash was destroyed by sinas chinam. Holding your tongue rebuilds what was lost." },
  { id: 3, category: "Helping", title: "Help unasked", action: "Do something helpful for someone today before they ask — clear a table, hold a door, carry a bag.", why: "Anticipating another's need is what Avraham Avinu modeled. Geulah is built on noticing." },
  { id: 4, category: "Patience", title: "Pause before reacting", action: "When something frustrating happens today (and it will), take three breaths before you respond.", why: "Reactivity is exile. The space you create is where Hashem enters." },
  { id: 5, category: "Respect", title: "Honor someone older", action: "Give your full attention to someone older than you today. Listen without interrupting.", why: "Hadras p'nei zaken — rising before the elderly is one of the Torah's quiet revolutions." },
  { id: 6, category: "Mindfulness", title: "One mindful tefillah", action: "Pick one bracha or one line of davening today. Say it slowly enough that the words actually mean something to you.", why: "Geulah isn't far away — it's hidden in the moments we usually rush through." },
  { id: 7, category: "Kindness", title: "A real compliment", action: "Give one specific, sincere compliment to someone close to you today. Not generic — something only you would notice.", why: "Being seen is one of the deepest human needs. You can give it for free." },
  { id: 8, category: "Speech", title: "Listen fully", action: "In your next conversation, don't think about what you'll say next. Just listen until they're done.", why: "Most people aren't heard. To truly listen is to give a piece of redemption." },
  { id: 9, category: "Patience", title: "Forgive in your heart", action: "Think of someone who hurt you. In your own words, release the grudge — even just to yourself.", why: "Carrying resentment delays Mashiach for you personally. Letting go is the greatest power." },
  { id: 10, category: "Helping", title: "Reach out first", action: "Message someone you've been meaning to check in on. Don't wait for them to reach out.", why: "Initiative is the ingredient most missing from our generation. Be the one who moves first." },
  { id: 11, category: "Respect", title: "Use someone's name", action: "Use the name of every service worker you encounter today — barista, driver, cashier. Notice them.", why: "A person's name is their dignity. Geulah is dignity restored to every Yid and every human." },
  { id: 12, category: "Mindfulness", title: "Phone-free meal", action: "Eat one meal today without your phone in sight. Be fully where you are.", why: "Presence is the discipline of bringing the Shechinah into the room you're in." },
  { id: 13, category: "Kindness", title: "Anonymous good", action: "Do one act of chesed today and tell no one. Not even your spouse. Not even later.", why: "Chesed shel emes — kindness without a return — moves the world more than anyone realizes." },
  { id: 14, category: "Speech", title: "No complaining for one hour", action: "For one full hour today, don't complain about anything — out loud or in your head.", why: "Complaining shrinks your world. Gratitude expands it. Geulah is the world made whole." },
  { id: 15, category: "Helping", title: "Open the door", action: "Hold the door for someone today — not just for one second, but actually wait.", why: "Small dignities, multiplied across a generation, build the world we're davening for." },
  { id: 16, category: "Patience", title: "Let someone finish", action: "Don't interrupt anyone today. Not your kids, not your spouse, not your coworkers. Let every sentence land.", why: "Interrupting is a small violence. Letting someone finish is a small redemption." },
  { id: 17, category: "Respect", title: "Apologize without explaining", action: "If you owe someone an apology, give it today — without a 'but' attached.", why: "An apology with conditions isn't an apology. The pure 'I'm sorry' is a vessel for shalom." },
  { id: 18, category: "Mindfulness", title: "Bracha with eyes closed", action: "Say one bracha today with your eyes closed. Block out the world for ten seconds.", why: "Closing your eyes opens the soul. The smallest pause changes the davening." },
  { id: 19, category: "Kindness", title: "A note that lasts", action: "Write a real note (paper or text) telling someone what they mean to you. Not a thank-you — an appreciation.", why: "Words written down are words that can be read again. They become a chizuk in someone's hardest moment." },
  { id: 20, category: "Speech", title: "Defend in your head", action: "When you think a critical thought about someone today, find one defense for them — even a weak one.", why: "Dan l'kaf zechus — judging favorably — quietly transforms how you see Klal Yisroel." },
  { id: 21, category: "Helping", title: "Give a ride", action: "Offer to drive someone somewhere today, or pick something up for someone on your way.", why: "Inconvenience for another is the currency of Geulah. Spending it makes the world richer." },
  { id: 22, category: "Patience", title: "Slow down on purpose", action: "Walk slower today. Drive slower. Eat slower. Notice the difference in how you feel.", why: "Speed is the language of galus. Slowness is the rhythm of presence." },
  { id: 23, category: "Respect", title: "Honor your spouse publicly", action: "Say something positive about your spouse to another person today — in their absence or presence.", why: "Shalom bayis is a building block of Geulah. Speaking well of your partner builds it." },
  { id: 24, category: "Mindfulness", title: "Look up", action: "Look at the sky for thirty seconds today. Just look. Notice what you usually miss.", why: "The shamayim are always there, declaring Hashem's glory. Most days we forget to look." },
  { id: 25, category: "Kindness", title: "Buy someone coffee", action: "Pay for the person behind you in line today. Or send a coffee to a friend you haven't seen in a while.", why: "A small unexpected gift is a small unexpected redemption. The world remembers these things." },
  { id: 26, category: "Speech", title: "Say only what builds", action: "For one conversation today, only say things that build the other person up. Nothing else.", why: "Words have weight. Used carefully, they become bricks of the third Beis Hamikdash." },
  { id: 27, category: "Helping", title: "Volunteer your time", action: "Find one organization or shul that could use an hour of your help this week. Sign up.", why: "Klal Yisroel runs on volunteers. Becoming one of them is becoming part of the geulah." },
  { id: 28, category: "Patience", title: "Wait without checking", action: "When you're waiting today (in line, at a light, on hold), don't pull out your phone. Just be.", why: "We've forgotten how to wait. Recovering this skill is a quiet act of liberation." },
  { id: 29, category: "Respect", title: "Yield in traffic", action: "Let three drivers in front of you today. Don't honk. Don't sigh. Just let them in.", why: "The road is where many of us lose our middos. Reclaiming it is a daily Geulah." },
  { id: 30, category: "Mindfulness", title: "Ask 'how are you' and mean it", action: "Ask one person today how they really are — and then actually listen to the answer.", why: "Most 'how are yous' are noise. The one that's real lands like sunlight." },
  { id: 31, category: "Kindness", title: "Tip generously", action: "If you tip today, give a little more than you usually would. Notice how it changes the moment.", why: "Generosity is contagious. So is gratitude. Both rebuild the world." },
  { id: 32, category: "Speech", title: "Praise behind their back", action: "Say something genuinely good about someone today when they're not in the room.", why: "Speaking well of others when they can't hear you trains your soul to see the good first." },
  { id: 33, category: "Helping", title: "Carry it for them", action: "If someone is carrying something heavy today — bags, a stroller, a load — offer to take part of it.", why: "Sharing weight is the most basic chesed. It's also the foundation of community." },
  { id: 34, category: "Patience", title: "Don't argue back", action: "If someone says something you disagree with today, just nod and let it go. Save the argument.", why: "Not every hill is yours to die on. Choosing peace is choosing Geulah." },
  { id: 35, category: "Respect", title: "Thank someone for showing up", action: "Thank someone today not for what they did, but for who they are or for being there.", why: "Most thank-yous are transactional. The deeper one is rare and precious." },
  { id: 36, category: "Mindfulness", title: "Eat one bite slowly", action: "Take one bite of food today and chew it for thirty seconds. Taste it. Bracha first.", why: "Even eating can be avodah. Slowness turns physical into spiritual." },
  { id: 37, category: "Kindness", title: "Smile at strangers", action: "Smile at every stranger you make eye contact with today. Sever panim yafos — a friendly face.", why: "Shammai taught this 2000 years ago and it's still the cheapest, deepest mitzvah." },
  { id: 38, category: "Speech", title: "End the conversation well", action: "Today, end every conversation with something warm — not just 'bye.' A blessing, a thank-you, a kind word.", why: "How you leave a conversation is how the other person carries you forward." },
  { id: 39, category: "Helping", title: "Be the bridge", action: "If you know two people who would benefit from meeting each other, introduce them today.", why: "Connecting people is a high form of chesed. You become a vehicle for someone else's good." },
  { id: 40, category: "Patience", title: "Don't finish their sentence", action: "Resist the urge today to finish someone's sentence — even your spouse's, even your kid's.", why: "Finishing someone's sentence steals their voice. Letting them speak is a small Geulah." },
  { id: 41, category: "Respect", title: "Address children as people", action: "Speak to a child today the way you'd want to be spoken to. Eye level. Real attention.", why: "The neshamos of children are full and present. Treating them as such shapes the next dor." },
  { id: 42, category: "Mindfulness", title: "Notice three things", action: "Stop once today and name three things you can see, hear, and feel right now. Be where you are.", why: "Presence is the antidote to the spiritual numbness of galus." },
  { id: 43, category: "Kindness", title: "Forgive a small slight", action: "Pick one small thing someone did that bothered you. Decide today to drop it completely.", why: "Letting go of small things makes room for big simchas. Resentment is a spiritual leak." },
  { id: 44, category: "Speech", title: "Say the chizuk first", action: "Before you give feedback or criticism today, say something appreciative first. Then maybe.", why: "Build before you correct. People grow from being seen, not from being shrunk." },
  { id: 45, category: "Helping", title: "Show up for the small thing", action: "Go to that thing today you'd usually skip — the small siyum, the engagement party, the levaya.", why: "Showing up matters more than knowing what to say. Just be there." },
  { id: 46, category: "Patience", title: "Don't rush them", action: "If someone is slower than you today — explaining, walking, deciding — match their pace. Don't rush them.", why: "Slowing down for someone else is a small act of kavod. The world needs more of it." },
  { id: 47, category: "Respect", title: "Knock before entering", action: "Knock today even where you don't have to — your kid's room, your spouse's space. Honor their privacy.", why: "Tznius is a way of seeing other people as worthy of dignity. It starts at home." },
  { id: 48, category: "Mindfulness", title: "Check in with yourself", action: "Stop once today and ask: how am I really feeling right now? Don't fix it. Just notice.", why: "Self-awareness is the start of every middah. You can't change what you don't see." },
  { id: 49, category: "Kindness", title: "Send a memory", action: "Text someone today about a specific memory you have with them. Make them smile out of nowhere.", why: "Reminding someone they mattered to you is one of life's quiet redemptions." },
  { id: 50, category: "Helping", title: "Pray for someone by name", action: "Add one new name to your tefillos today — someone going through something hard. Hold them in mind during Shemoneh Esrei.", why: "Tefillah for another is the highest chesed. You become a partner in their geulah." },
];

export const GEULAH_TIERS = [
  { name: "First Steps", min: 0, description: "Every great journey starts with one small action." },
  { name: "Ba'al Chesed", min: 10, description: "You're building a habit of kindness." },
  { name: "Builder", min: 25, description: "You're actively rebuilding the world." },
  { name: "Pillar of the Generation", min: 50, description: "Your consistency is shaping those around you." },
  { name: "Light to the Nations", min: 100, description: "You're carrying the weight of klal Yisroel forward." },
  { name: "Architect of Geulah", min: 250, description: "You've made middos a way of life." },
  { name: "Mashiach's Companion", min: 500, description: "You've spent yourself in service. The world is closer because of you." },
] as const;

export function getGeulahTier(count: number) {
  let current: typeof GEULAH_TIERS[number] = GEULAH_TIERS[0];
  for (const t of GEULAH_TIERS) {
    if (count >= t.min) current = t;
  }
  const next = GEULAH_TIERS.find(t => t.min > count);
  return { current, next };
}

export function getGeulahActionForDate(date: Date): GeulahAction {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return geulahActions[day % geulahActions.length];
}
