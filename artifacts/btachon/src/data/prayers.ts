export interface PrayerWord {
  hebrew: string;
  transliteration: string;
  literal: string;
  meaning: string;
}

export interface PrayerSection {
  id: string;
  title: string;
  words: PrayerWord[];
  kavvanah: string;
}

export interface Prayer {
  id: string;
  title: string;
  hebrewTitle: string;
  subtitle: string;
  when: string;
  description: string;
  sections: PrayerSection[];
}

export const PRAYERS: Prayer[] = [
  {
    id: "modeh-ani",
    title: "Modeh Ani",
    hebrewTitle: "מוֹדֶה אֲנִי",
    subtitle: "Morning Thanks",
    when: "Upon waking, before getting out of bed",
    description: "The very first thing said each morning. Before moving, before thinking about the day — gratitude. Six words that set the entire tone of who you are when you wake up.",
    sections: [
      {
        id: "modeh-ani-main",
        title: "מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה, רַבָּה אֱמוּנָתֶךָ.",
        words: [
          { hebrew: "מוֹדֶה", transliteration: "modeh", literal: "I give thanks / I acknowledge", meaning: "The root הוֹדָאָה (hodaa) means both gratitude and acknowledgment. Starting with modeh — not 'I' but 'I-thank' — makes gratitude the very first act of consciousness each day." },
          { hebrew: "אֲנִי", transliteration: "ani", literal: "I", meaning: "The self. But notice: 'I' comes second. The prayer begins with thanks, not with the self. That ordering is intentional — it shapes your whole perspective." },
          { hebrew: "לְפָנֶיךָ", transliteration: "lefanecha", literal: "before You", meaning: "Literally 'to Your face.' This is intimate language — not thanking a distant force, but standing directly before Hashem. You're in His presence the moment you open your eyes." },
          { hebrew: "מֶלֶךְ", transliteration: "melech", literal: "King", meaning: "The first description of Hashem in your day: King. Not just a powerful force — a King has a relationship with His people. You are a subject, but also a beloved one." },
          { hebrew: "חַי", transliteration: "chai", literal: "living", meaning: "Hashem is alive — not a static concept or philosophical idea. The Living God is actively present in your life right now, at this moment." },
          { hebrew: "וְקַיָּם", transliteration: "v'kayam", literal: "and everlasting / enduring", meaning: "Permanent, unchanging, eternal. Unlike everything else in life that shifts and ends, Hashem endures. This gives you something solid to stand on every morning." },
          { hebrew: "שֶׁהֶחֱזַרְתָּ", transliteration: "shehechezarta", literal: "that You returned", meaning: "Sleep is understood as 1/60th of death — your soul partially departs. Hashem actively returned it. This isn't just waking up; it's a conscious gift given back to you." },
          { hebrew: "בִּי", transliteration: "bi", literal: "within me", meaning: "Inside me — my soul returned to me specifically, personally. Not a generic renewal, but yours." },
          { hebrew: "נִשְׁמָתִי", transliteration: "nishmati", literal: "my soul", meaning: "The neshamah is pure — a piece of the Divine. The Talmud says: just as Hashem fills the world, the soul fills the body. Your first act is thanking Hashem for returning this divine piece back to you." },
          { hebrew: "בְּחֶמְלָה", transliteration: "b'chemla", literal: "with compassion", meaning: "Chemla is a deep, tender compassion — the kind a parent has for a child. Your soul wasn't returned because you earned it. It was returned with love and mercy." },
          { hebrew: "רַבָּה", transliteration: "rabbah", literal: "great", meaning: "Great, abundant, immense. Your faithfulness isn't just present — it is great. The word stands alone to give it weight." },
          { hebrew: "אֱמוּנָתֶךָ", transliteration: "emunatecha", literal: "Your faithfulness", meaning: "Emunah — faithfulness, trust, reliability. Hashem trusted you with your soul again. Every morning is a renewal of that trust. He believes in you enough to give you another day." },
        ],
        kavvanah: "Before saying anything else, even before getting up — feel the weight of having just been given your life back. You went to sleep, your soul was partially gone. Now it's returned. Say these words slowly, and actually mean: 'I know this is from You, and I'm grateful.'",
      },
    ],
  },
  {
    id: "shema",
    title: "Shema",
    hebrewTitle: "שְׁמַע",
    subtitle: "Declaration of Faith",
    when: "Morning and evening tefillah — the central declaration of Jewish faith",
    description: "The cornerstone of Jewish belief, said twice daily. Six words that Jews have lived and died for. Every word carries worlds of meaning. The Shema is not just a statement — it is a declaration of who you are and what you stand for.",
    sections: [
      {
        id: "shema-first-line",
        title: "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד",
        words: [
          { hebrew: "שְׁמַע", transliteration: "shema", literal: "Hear / Listen", meaning: "Not just 'hear' with ears — shema means to hear and internalize, to understand and take to heart. It's a command to truly listen, to let it in." },
          { hebrew: "יִשְׂרָאֵל", transliteration: "yisrael", literal: "Israel", meaning: "Addressed to every Jew in every generation. But also — Yaakov was renamed Yisrael after his struggle. This is said to people who wrestle, who struggle, who fight to hold on. It's meant for you." },
          { hebrew: "יְהוָה", transliteration: "Hashem", literal: "The LORD", meaning: "The four-letter Name — the Tetragrammaton. This Name expresses Hashem's eternal existence: was, is, and will be. It is His most essential Name — existence itself." },
          { hebrew: "אֱלֹהֵינוּ", transliteration: "eloheinu", literal: "our God", meaning: "Not just 'God' in the abstract — our God. This Name (Elokim) reflects power and judgment, but it's ours. He is personally connected to us as a people." },
          { hebrew: "יְהוָה", transliteration: "Hashem", literal: "The LORD", meaning: "The Name appears again. The two appearances of Hashem's essential Name frame Elokim — His mercy surrounds His judgment. This is the structure of the universe." },
          { hebrew: "אֶחָד", transliteration: "echad", literal: "One", meaning: "Echad is drawn out for the length of a breath — the dalet held long. One: not just that there's one God, but that everything — the four corners of the world, heaven and earth — is all one unified reality under Hashem. There is nothing outside of Him." },
        ],
        kavvanah: "Close your eyes. Take the word echad — One — and hold it. While you say it, have in mind that Hashem fills all four directions (extend the dalet in your mind), above and below. Nothing is separate from Him. When you feel that, the Shema is being said the way it's meant to be said.",
      },
      {
        id: "shema-baruch",
        title: "בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד",
        words: [
          { hebrew: "בָּרוּךְ", transliteration: "baruch", literal: "Blessed", meaning: "Baruch comes from the root בְּרֵכָה — a pool, a wellspring. To bless Hashem is to draw from the infinite wellspring of Divine goodness and acknowledge it." },
          { hebrew: "שֵׁם", transliteration: "shem", literal: "Name", meaning: "The Name represents His essence. We bless the revelation of who Hashem is — as much as we can perceive of Him in this world." },
          { hebrew: "כְּבוֹד", transliteration: "kevod", literal: "glory / honor", meaning: "Kavod — the weighty presence of honor. Not superficial fame, but the deep, substantial truth of His greatness, felt and acknowledged." },
          { hebrew: "מַלְכוּתוֹ", transliteration: "malchuto", literal: "His kingdom / His kingship", meaning: "Hashem's kingship is not political — it is the reality that everything exists only because He wills it. To say this is to acknowledge that reality." },
          { hebrew: "לְעוֹלָם", transliteration: "l'olam", literal: "forever / for all worlds", meaning: "L'olam comes from עוֹלָם — world, but also forever. Both meanings apply: across all worlds and throughout all time." },
          { hebrew: "וָעֶד", transliteration: "va'ed", literal: "and ever", meaning: "Together with l'olam: forever and ever, without end. His glory is not temporary. It endures beyond any limit we can conceive." },
        ],
        kavvanah: "This line is whispered because it wasn't originally part of the Torah text — it comes from the angels. When you say it quietly, feel yourself joining a chorus of unseen voices declaring the same truth.",
      },
    ],
  },
  {
    id: "ashrei",
    title: "Ashrei",
    hebrewTitle: "אַשְׁרֵי",
    subtitle: "Song of Happiness",
    when: "Said three times daily — twice in Shacharit, once in Mincha",
    description: "Psalm 145, introduced by two verses from other Psalms. The Talmud says: whoever says Ashrei three times a day is guaranteed a place in the World to Come. It is a complete alphabetical praise — every letter of the Hebrew alphabet, every aspect of existence, praises Hashem.",
    sections: [
      {
        id: "ashrei-intro",
        title: "אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה",
        words: [
          { hebrew: "אַשְׁרֵי", transliteration: "ashrei", literal: "Happy / Praiseworthy", meaning: "Not one-time happiness — ashrei is a state of being, a way of existing. The person called ashrei has found a stable, enduring joy that doesn't depend on circumstances." },
          { hebrew: "יוֹשְׁבֵי", transliteration: "yoshvei", literal: "those who dwell / sit", meaning: "Not visiting — dwelling. Those who make the house of Hashem their home, their natural place, their default space." },
          { hebrew: "בֵיתֶךָ", transliteration: "veitecha", literal: "Your house", meaning: "The shul, the beit midrash — but also any place where Hashem is truly present. The 'house' is wherever you make space for Him." },
          { hebrew: "עוֹד", transliteration: "od", literal: "still / again", meaning: "They will still praise You — even after everything, even after difficulty, they return to praise. The word 'still' acknowledges that life is hard, and yet — still." },
          { hebrew: "יְהַלְלוּךָ", transliteration: "y'hallelucha", literal: "they will praise You", meaning: "Hallel — pure praise, celebration, joy. Those who dwell in Your house will continuously burst into praise." },
          { hebrew: "סֶּלָה", transliteration: "selah", literal: "forever / lift up", meaning: "Selah appears throughout Tehillim. It may mean 'forever,' or it may be a musical instruction to lift the voice. Either way — it signals: this truth carries special weight. Pause and feel it." },
        ],
        kavvanah: "Before starting Ashrei, pause and think: what does it mean to 'dwell' in Hashem's house? Not just visit once in a while, but actually live there — making His presence your comfortable home. That's who this prayer is talking about.",
      },
      {
        id: "ashrei-aleph",
        title: "תְּהִלָּה לְדָוִד — אֲרוֹמִמְךָ אֱלוֹהַי הַמֶּלֶךְ",
        words: [
          { hebrew: "תְּהִלָּה", transliteration: "tehillah", literal: "praise / song of praise", meaning: "The word for the entire book of Psalms. This single psalm is called A Song of Praise — it contains the essence of all praise." },
          { hebrew: "לְדָוִד", transliteration: "l'David", literal: "of David / to David", meaning: "King David — the man of deep emotion, great sin, and even greater return. His praise carries the weight of someone who fell far and climbed back." },
          { hebrew: "אֲרוֹמִמְךָ", transliteration: "aromimcha", literal: "I will exalt You", meaning: "Romem — to raise up. Not that we raise Hashem (He is already infinitely high), but that we raise our own perception and acknowledgment of Him. We lift ourselves toward Him." },
          { hebrew: "אֱלוֹהַי", transliteration: "elohai", literal: "my God", meaning: "My God — not just 'God' in theory. David says: mine. Personal, intimate, real. The God of the universe is also David's God." },
          { hebrew: "הַמֶּלֶךְ", transliteration: "hamelech", literal: "the King", meaning: "David was himself a king. Yet he calls Hashem 'the King' — acknowledging that his own kingship was entirely borrowed and dependent. True royalty belongs only to Hashem." },
        ],
        kavvanah: "Say Ashrei slowly enough to notice the words. The Talmud says people rush through it — don't. Let at least one line reach you each time. One word that you actually feel. That's enough.",
      },
    ],
  },
  {
    id: "amidah-avos",
    title: "Avos",
    hebrewTitle: "אָבוֹת",
    subtitle: "First Bracha of the Amidah",
    when: "The opening of every Amidah — three times daily",
    description: "The first blessing of the Shemoneh Esreh — the foundational standing prayer. We open by invoking our ancestors: Avraham, Yitzchak, and Yaakov. This bracha establishes who we are and who we're talking to before we ask for anything.",
    sections: [
      {
        id: "avos-opening",
        title: "בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ",
        words: [
          { hebrew: "בָּרוּךְ", transliteration: "baruch", literal: "Blessed", meaning: "We begin every bracha with this word. But who is blessing whom? We bless Hashem — we acknowledge and draw out the Divine goodness into our awareness. The act of blessing is an act of consciousness." },
          { hebrew: "אַתָּה", transliteration: "atah", literal: "You", meaning: "Second person — direct address. Not 'He who is blessed' but 'You.' In the middle of the Amidah we speak directly to Hashem. This is conversation, not recitation." },
          { hebrew: "יְהוָה", transliteration: "Hashem", literal: "The LORD", meaning: "The essential Name — eternal existence. He was, is, and always will be. Standing before this Name means standing before ultimate reality." },
          { hebrew: "אֱלֹהֵינוּ", transliteration: "eloheinu", literal: "our God", meaning: "Our God — collective. You don't stand alone in the Amidah. Even when praying privately, you're speaking on behalf of all of Israel, past and present." },
          { hebrew: "וֵאלֹהֵי", transliteration: "v'elohei", literal: "and God of", meaning: "The connection extends backward through time. His relationship with us didn't start today — it goes back to the beginning of our people." },
          { hebrew: "אֲבוֹתֵינוּ", transliteration: "avoteinu", literal: "our fathers / our ancestors", meaning: "Not abstract ancestors — Avraham who discovered Hashem alone, Yitzchak who laid his life on the altar, Yaakov who wrestled through the night. We invoke their merit and their relationship with Hashem." },
        ],
        kavvanah: "When you say 'and God of our fathers' — actually picture Avraham, Yitzchak, and Yaakov. These were real people who had a real relationship with Hashem. You are their descendant. That relationship is your inheritance.",
      },
      {
        id: "avos-patriarchs",
        title: "אֱלֹהֵי אַבְרָהָם אֱלֹהֵי יִצְחָק וֵאלֹהֵי יַעֲקֹב",
        words: [
          { hebrew: "אֱלֹהֵי", transliteration: "elohei", literal: "God of", meaning: "Each patriarch gets his own 'God of' — not one shared mention. This teaches that each one had a unique, personal relationship with Hashem. Yours can be unique too." },
          { hebrew: "אַבְרָהָם", transliteration: "Avraham", literal: "Abraham", meaning: "The man who saw Hashem in a world of idols, who left everything to follow a Voice, who welcomed strangers and argued with Hashem on behalf of sinners. His attribute: chesed — boundless love and generosity." },
          { hebrew: "אֱלֹהֵי", transliteration: "elohei", literal: "God of", meaning: "Again, separately — Yitzchak had his own path, not just his father's." },
          { hebrew: "יִצְחָק", transliteration: "Yitzchak", literal: "Isaac", meaning: "The man who lay on the altar and gave everything. His entire existence was a willingness to give himself fully. His attribute: gevurah — inner strength, discipline, boundaries." },
          { hebrew: "וֵאלֹהֵי", transliteration: "v'elohei", literal: "and God of", meaning: "The 'and' before Yaakov's name (but not the others) hints that Yaakov's path was different — he earned his connection through struggle, not through linear inheritance." },
          { hebrew: "יַעֲקֹב", transliteration: "Yaakov", literal: "Jacob", meaning: "The man who wrestled through the night with an angel and refused to let go until he was blessed. Renamed Yisrael — the name all Jews carry. His attribute: tiferet — truth, beauty, balance between chesed and gevurah." },
        ],
        kavvanah: "Each patriarch represents a different way of connecting to Hashem. Ask yourself: which one do you relate to most right now? Are you in an Avraham moment (reaching outward with love), a Yitzchak moment (needing inner strength), or a Yaakov moment (wrestling, fighting to hold on)?",
      },
    ],
  },
  {
    id: "aleinu",
    title: "Aleinu",
    hebrewTitle: "עָלֵינוּ",
    subtitle: "Closing Prayer",
    when: "At the end of every tefillah",
    description: "Said at the close of every prayer service, Aleinu moves in two parts: first, a recognition of the particular mission of the Jewish people; then, a vision of the world as it will one day be — fully repaired, fully one. It is both humble and expansive.",
    sections: [
      {
        id: "aleinu-first",
        title: "עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל",
        words: [
          { hebrew: "עָלֵינוּ", transliteration: "aleinu", literal: "it is upon us / our duty", meaning: "Not 'we choose to' — it is upon us. This is not an option or a hobby. It is a responsibility, a calling, something placed on us. The word carries weight." },
          { hebrew: "לְשַׁבֵּחַ", transliteration: "l'shabeiach", literal: "to praise", meaning: "Shevach — specific praise, the kind that details and highlights. Not vague gratitude but clear, articulated acknowledgment of what is good and true." },
          { hebrew: "לַאֲדוֹן", transliteration: "la'adon", literal: "to the Master / Lord", meaning: "Adon — Master. Not just King (political) or God (abstract) — Master means the one who owns and oversees everything. The practical sovereign of all reality." },
          { hebrew: "הַכֹּל", transliteration: "hakol", literal: "everything / all", meaning: "Not 'of most things' or 'of the big things' — of everything. The Master of the smallest detail and the largest force equally. Nothing is outside His domain." },
        ],
        kavvanah: "Aleinu is easy to rush because it comes at the end when you're tired and ready to leave. Resist that. These words are the frame for everything you've prayed. Take one breath before starting it.",
      },
      {
        id: "aleinu-second",
        title: "לְתַקֵּן עוֹלָם בְּמַלְכוּת שַׁדַּי",
        words: [
          { hebrew: "לְתַקֵּן", transliteration: "letakein", literal: "to repair / to fix", meaning: "This is the origin of the phrase Tikkun Olam. Takein means to set right, to correct what is broken, to restore to proper form. The world is not finished — it needs work." },
          { hebrew: "עוֹלָם", transliteration: "olam", literal: "the world", meaning: "The entire world — not just the Jewish world, not just the spiritual world. The physical, social, and moral world we live in every day." },
          { hebrew: "בְּמַלְכוּת", transliteration: "b'malchut", literal: "in the kingdom / through the kingship", meaning: "The repair happens through recognizing Hashem's kingship — when the world acknowledges Who is truly in charge, it begins to heal." },
          { hebrew: "שַׁדַּי", transliteration: "Shaddai", literal: "the Almighty", meaning: "Shaddai — the Name associated with limits and sufficiency, often translated as Almighty. The Name that says: enough, it is sufficient. When His kingship is recognized, the world reaches its proper fullness." },
        ],
        kavvanah: "The vision of Aleinu is enormous — the repair of the entire world. But every small thing you do with intention is part of that repair. When you say these words, connect your day — your actions, your choices — to this larger vision.",
      },
    ],
  },
];
