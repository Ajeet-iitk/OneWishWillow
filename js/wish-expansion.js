/* ============================================================
   ONE WISH WILLOW — the deeper roots
   Cascade children, the long timeline, negotiation scoring,
   and the arithmetic of the Three Wish Challenge.
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- deterministic helpers ---------------- */

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rand) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = copy[i];
      copy[i] = copy[j];
      copy[j] = t;
    }
    return copy;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  /* ---------------- domain-flavoured children ---------------- */

  const CHILDREN = {
    love: [
      "The person you wanted becomes a mirror you cannot put down.",
      "You catch them rehearsing affection when they think you are asleep.",
      "Every anniversary starts arriving with evidence attached.",
      "You begin to love the proof more than the person.",
      "One day they ask for their life back, politely."
    ],
    money: [
      "The money begins arriving with strings tied to people you love.",
      "You buy silence and discover it has a monthly fee.",
      "A stranger's bankruptcy clears your account by morning.",
      "You can no longer tell generosity from strategy.",
      "The vault is full. The house is not."
    ],
    fame: [
      "A crowd learns your name before you learn its price.",
      "You are photographed in a life you did not choose.",
      "The algorithm finds your worst day and makes it your brand.",
      "Someone impersonates you better than you do.",
      "Applause starts arriving in place of sleep."
    ],
    beauty: [
      "The mirror becomes a manager. It gives notes.",
      "People stop asking how you are and start asking what you use.",
      "You avoid daylight that might disagree with the wish.",
      "A scar appears where no one can see it, and it is the only thing you feel.",
      "You are beautiful in every photograph and absent from all of them."
    ],
    power: [
      "Obedience arrives faster than trust ever did.",
      "You can no longer hear a room without hearing what it wants.",
      "Someone obeys you before you finish the thought, and you flinch.",
      "The throne grows roots through the floor.",
      "You win every argument and lose the argument."
    ],
    revenge: [
      "The person who hurt you is fine. The wish needs someone else.",
      "Your enemy's life improves in every way but one, and you cannot stop watching.",
      "You get the apology. It is read from a card.",
      "The grudge outlives the injury and takes over the house.",
      "Someone new inherits the role of the person you hated."
    ],
    death: [
      "You stop aging. Everyone else keeps the appointment.",
      "The world becomes a waiting room you cannot leave.",
      "You bury the same friends in different decades.",
      "Your name becomes a threat to the people who love you.",
      "Death files a complaint. You are served."
    ],
    time: [
      "You get the hour back. It arrives at 3 a.m., alone.",
      "The day repeats until you get it right, and you never do.",
      "You are early for everything and present for nothing.",
      "The clock starts charging interest.",
      "You save time and lose the ability to spend it."
    ],
    health: [
      "The body heals. The fear stays and brings friends.",
      "You are cured in a way no doctor can explain or reverse.",
      "Every symptom becomes a rumor you cannot disprove.",
      "You live longer than the people who would have cared for you.",
      "The illness leaves. It sublets."
    ],
    family: [
      "The family becomes happy in a photograph you are not in.",
      "You get the closeness. Everyone forgets why they wanted it.",
      "A relative starts paying for your wish without knowing.",
      "The house is full and no one speaks first.",
      "You become the ancestor everyone argues about."
    ],
    memory: [
      "You forget the thing. You keep the shape of the forgetting.",
      "A stranger remembers your life better than you do.",
      "The memory returns in the voice of someone you no longer trust.",
      "You lose the argument with your own history.",
      "Every happy day develops a hole exactly your size."
    ],
    knowledge: [
      "You know the answer. You also know what it costs to say it.",
      "The truth arrives without an off switch.",
      "You learn what people think of you, in their own words, forever.",
      "Every secret becomes a room you cannot leave.",
      "You are right so often that no one stays to listen."
    ],
    freedom: [
      "The door opens. The world outside was also built by the wish.",
      "You get out. The key does not.",
      "Every choice becomes evidence of the one that was made for you.",
      "You are free in a way that requires permission.",
      "The open road ends at the same tree."
    ],
    luck: [
      "You win small, often, and cannot stop noticing.",
      "Someone near you starts losing what you win.",
      "The coin lands your way until it becomes the only way you can move.",
      "You survive everything and trust nothing.",
      "Luck begins selecting your enemies for you."
    ],
    career: [
      "The job is yours. So is every version of you that wanted it.",
      "You are promoted beyond the person you used to be.",
      "Your name is on the work; your life is in the archive.",
      "A colleague becomes the cautionary tale that keeps you employed.",
      "The corner office has a very good view of what you traded."
    ],
    superpower: [
      "The power works. The world starts working around it.",
      "You save everyone once and become responsible for every next time.",
      "Your secret gets a publicist.",
      "The power develops a preference for being used.",
      "You can do anything except stop."
    ],
    world: [
      "The world improves. A small number of people are billed for it.",
      "Peace arrives with a list of who must be quiet.",
      "You get the better world. You do not get to live in the part you imagined.",
      "The change is real. The memory of the old world is not.",
      "Every border moves, and someone is standing on the line."
    ],
    belonging: [
      "You are welcome everywhere. You belong nowhere.",
      "The group makes room, then makes rules.",
      "You are loved by the room and unknown to everyone in it.",
      "The door is always open. So is the draft.",
      "You find your people. They are already leaving."
    ],
    joy: [
      "Happiness arrives on schedule and refuses to be spontaneous.",
      "You are happy. You cannot remember choosing it.",
      "The good days become a performance with no audience.",
      "You start protecting the joy from the people who gave it to you.",
      "One morning the joy is still there, and you are not."
    ],
    pets: [
      "The animal understands the wish before you do.",
      "You get the years back. They are not the same years.",
      "The house is never empty and never quite yours.",
      "A small life becomes collateral.",
      "The leash is longer. So is the shadow."
    ],
    default: []
  };

  const UNIVERSAL = [
    "The people closest to you learn to flinch at good news.",
    "A stranger inherits the life you would have had.",
    "You start keeping a list of things you no longer mention.",
    "The wish begins correcting your memories to fit.",
    "Every favour now arrives with an invoice you cannot read.",
    "Someone you love is punished for your good fortune.",
    "You get exactly what you asked for in front of the wrong witness.",
    "The version of you that wanted this is no longer invited.",
    "A small detail becomes the only thing you can think about.",
    "The world adjusts around the wish, and you are the seam.",
    "You meet someone who got the same wish and paid less.",
    "The branch grows back. It remembers your hand.",
    "What you gained begins to arrive without you.",
    "You become the cautionary tale in someone else's wish.",
    "The price is paid by someone who never met you.",
    "You start measuring other people by what they cost.",
    "The wish works better than you can survive.",
    "A door closes softly in a room you did not know you had.",
    "The person you were before the wish starts appearing in mirrors, asking to be let back in.",
    "You get the opposite in installments, and each one is presented as a kindness.",
    "One morning you wake up without the hunger. That is when you understand what the hunger was holding up.",
    "The people who love you begin to speak about you in the past tense while you are still in the room.",
    "You find a list in your own handwriting of everything you agreed to. You do not remember writing it.",
    "Every good thing now arrives with a small delay, like a sentence being translated.",
    "The willow does not take the wish back. It takes back the person who made it.",
    "You are given exactly what you wanted, and the world is rearranged so that it means nothing.",
    "A kind of quiet enters your life and starts removing the furniture one piece at a time.",
    "You keep waiting for the catch. The catch is that there is no catch; this is simply your life now.",
    "One day the wish stops working, and you realize you have built nothing that runs without it."
  ];

  /* ---------------- cascade ---------------- */

  function cascadeFor(record) {
    if (!record || !record.twists) return [];
    const seed = (record.seed || hash(record.wish || "")) ^ 0x9e3779b9;
    const rand = mulberry32(seed >>> 0);
    const pool = shuffle((CHILDREN[record.domain] || CHILDREN.default).concat(UNIVERSAL), rand);
    let cursor = 0;
    const used = {};

    return record.twists.map(function (twist, index) {
      const children = [];
      let guard = 0;
      while (children.length < 5 && guard < pool.length * 2) {
        const line = pool[cursor % pool.length];
        cursor += 1;
        guard += 1;
        if (used[line] && guard < pool.length) continue;
        used[line] = true;
        children.push(line);
      }
      return {
        index: index,
        tag: twist.tag,
        title: twist.title,
        text: twist.text,
        children: children
      };
    });
  }

  /* ---------------- timeline ---------------- */

  function buildTimeline(record, cascade) {
    if (!record) return [];
    const tree = cascade || cascadeFor(record);
    const pick = function (branchIndex, childIndex, fallback) {
      const branch = tree[branchIndex];
      return branch && branch.children[childIndex] ? branch.children[childIndex] : fallback;
    };

    return [
      {
        when: "One week",
        mark: "01",
        title: "Small mercies",
        text: "Nothing feels wrong yet. That is the first mercy, and the last. The wish has begun editing the timing of things — a green light, a returned message, a bill that arrives a day late. " + pick(0, 0, "You call this luck."),
        mood: "still"
      },
      {
        when: "One month",
        mark: "02",
        title: "The workaround",
        text: "You have started building a life around the part you did not ask for. " + pick(1, 2, "It is not a problem yet.") + " You call it a habit. The people who notice have begun to say your name a little more carefully.",
        mood: "uneasy"
      },
      {
        when: "One year",
        mark: "03",
        title: "The new normal",
        text: pick(2, 1, "You have stopped explaining it to new people.") + " The people who knew you before have quietly stopped asking. You tell yourself this is peace. It is closer to a room with the furniture removed.",
        mood: "wrong"
      },
      {
        when: "Ten years",
        mark: "04",
        title: "The invoice",
        text: record.price + " " + pick(3, 3, "By now the price has a face.") + " By now the price has a face, and the face is patient, and it knows exactly which version of you to ask for.",
        mood: "paid"
      }
    ];
  }

  /* ---------------- negotiation ---------------- */

  const RESIDUALS = [
    "You defined the wish. You did not define the word \"granted.\"",
    "You closed the exits. It built a window and called it ventilation.",
    "You named everyone it cannot harm. It found someone whose name you do not know yet.",
    "You gave it a deadline. It gave the deadline a detour.",
    "You asked for consent. It asked for a signature you have already given.",
    "You specified the amount. It specified the currency.",
    "You wrote a witness into the clause. The witness is the willow.",
    "You made the wish reversible. You did not make the remembering reversible.",
    "You said no one else would pay. It has decided you are no one else.",
    "You asked for the opposite of harm. It has arranged an absence so complete that you will beg for the harm.",
    "You closed every door in the sentence. It is standing in the room the sentence did not mention.",
    "You made the wish safe. The willow has never granted a safe thing without making someone pay for the safety."
  ];

  function scoreLoopholes(raw) {
    const text = String(raw || "").replace(/\s+/g, " ").trim();
    const lower = text.toLowerCase();
    const numberWords = "\\d[\\d,.]*|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|once";
    const amountUnit = "seconds?|minutes?|hours?|days?|weeks?|months?|years?|percent|%|dollars?|pounds?|euros?|cents?|times?|people|persons?|miles?|kilomet(?:er|re)s?|kilos?|monday|tuesday|wednesday|thursday|friday|saturday|sunday|mornings?|evenings?|nights?";
    const numbers = /\bonce\b/i.test(text) || new RegExp(
      "\\b(?:" + numberWords + ")(?:[\\s-]+(?:hundred|thousand|million|billion|and|more|additional|ordinary))*\\s*(?:" + amountUnit + ")\\b",
      "i"
    ).test(text);
    const deadline = /\b(by|before|until|no later than)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|noon|midnight|the end of|\d)/i.test(text);
    const exit = /\b(until|unless|revocable|reversible|can be undone|undo|return(s|ed)? to|stop(s|ped)? at|end(s|ed)? (at|when)|no longer than|only while|expires?|expiration|effective (immediately|now|from)|permanently|from this moment|cancel(lable|led)?|void(able)?|at any (time|point)|on demand)\b/i.test(text);
    const shield = /\b(without (harm|harming|affecting|changing|taking|hurting|injury|loss)|no (harm|harming|injury|damage|collateral|loss)|no one else|nobody else|no other person|not at the expense|with (their|his|her|its) consent|consenting|of their own (free )?will|no collateral|nothing bad (would|will|happens?))\b/i.test(text);
    const define = /\b(meaning|defined as|specifically|exactly|solely|literally|in the amount of|for a period of|in full|full knowledge|specified|precisely|only (for|me|this|once)|effective (immediately|now))\b/i.test(text);
    const witness = /\b(witness|witnessed|witnesses|written|in writing|recorded|signed|signature|contract|clause|notar(y|ized)|on paper)\b/i.test(text);
    const boundary = /\b(except|excluding|but not|other than|nothing else|only me|only for|only this|alone|no more than|not one|not a cent|nothing more|in full)\b/i.test(text);
    const absolutes = (text.match(/\b(forever|always|never|everything|anything|anyone|everyone|all|anything at all)\b/gi) || []).length;
    const vague = (text.match(/\b(happy|happiness|love|rich|success|successful|better|perfect|peace|powerful|beautiful|free)\b/gi) || []).length;
    const andCount = (text.match(/\band\b/gi) || []).length;
    const willow = /\bwillow\b/i.test(text);
    const length = text.length;

    let score = 26;
    if (numbers) score += 15;
    if (deadline) score += 8;
    if (exit) score += 15;
    if (shield) score += 15;
    if (define) score += 11;
    if (witness) score += 7;
    if (boundary) score += 9;
    if (length >= 70) score += 4;
    if (length >= 120) score += 3;
    if (willow) score += 3;
    score -= Math.min(20, absolutes * 6);
    score -= Math.min(12, vague * 3);
    score -= Math.min(12, Math.max(0, andCount - 1) * 5);
    if (length < 32) score -= 9;
    score = clamp(Math.round(score), 6, 97);

    const factors = [
      { label: "A number or deadline", hit: numbers || deadline, note: numbers || deadline ? "The willow has to count something." : "No quantity. No clock. No edge." },
      { label: "An exit clause", hit: exit, note: exit ? "You left yourself a door." : "Nothing in the wording can be taken back." },
      { label: "No collateral", hit: shield, note: shield ? "You named who must not pay." : "Someone unnamed is already paying." },
      { label: "A definition", hit: define, note: define ? "You defined your terms. It defines its own." : "\"Granted\" is doing unexamined work." },
      { label: "A witness", hit: witness, note: witness ? "Paper makes the willow polite." : "No witness. No record. No appeal." },
      { label: "No absolutes", hit: absolutes === 0, note: absolutes ? "Forever is a door with no handle." : "You avoided the oldest trap." },
      { label: "One hunger", hit: andCount <= 1, note: andCount > 1 ? "You asked for more than one thing." : "One wish. One appetite." },
      { label: "Enough words", hit: length >= 70, note: length >= 70 ? "The clause has room to breathe." : "Short wishes leave room for roots." }
    ];

    let grade = "An open door";
    if (score >= 93) grade = "Almost airtight";
    else if (score >= 80) grade = "Lawyerly";
    else if (score >= 65) grade = "Careful";
    else if (score >= 45) grade = "Hopeful";

    return {
      score: score,
      grade: grade,
      factors: factors,
      positives: factors.filter(function (f) { return f.hit; }).length,
      absolutes: absolutes,
      length: length
    };
  }

  function negotiate(record, raw, attempt) {
    const text = String(raw || "").replace(/\s+/g, " ").trim();
    const analysis = scoreLoopholes(text);
    const score = analysis.score;
    const visible = score >= 92 ? 2 : score >= 78 ? 3 : 4;
    const baseDebt = record && record.severity ? record.severity.debt : 90;
    const debt = clamp(Math.round(baseDebt - score * 0.55), 18, 96);
    const residual = RESIDUALS[(Math.floor(score / 7) + (attempt || 0)) % RESIDUALS.length];

    let verdict = "You have not negotiated. You have only taught the surrender a nicer vocabulary.";
    if (score >= 93) verdict = "You closed every door you could see. The willow is already standing behind the one you did not, holding the opposite of your wish.";
    else if (score >= 80) verdict = "A serious revision. The visible cracks narrow. The price moves somewhere less visible, and it takes a name with it.";
    else if (score >= 65) verdict = "Better. But \"better\" is not a word the willow honours. It has kept the difference as a tip.";
    else if (score >= 45) verdict = "The wording is tighter. The hunger is still showing through, and the hunger is the only part it wanted.";

    return {
      score: score,
      grade: analysis.grade,
      factors: analysis.factors,
      verdict: verdict,
      visible: visible,
      hidden: 4 - visible,
      debt: debt,
      residual: residual,
      text: text
    };
  }

  /* ---------------- three wish challenge ---------------- */

  function corruptionAfter(current, record, step) {
    const debt = record && record.severity ? record.severity.debt : 82;
    const delta = Math.max(7, Math.round(debt * 0.3) + (step > 1 ? 4 : 0));
    return clamp(current + delta, 0, 99);
  }

  function challengeVerdict(score) {
    if (score >= 92) return { label: "SIGNED", text: "The willow has your signature. It always did. Somewhere, a third branch is still growing through the hand that wrote the wish." };
    if (score >= 78) return { label: "COMPOUNDING", text: "You fixed two things and made a third worse. The willow calls this a good year, and it has already begun the next one." };
    if (score >= 60) return { label: "NEGOTIABLE", text: "The damage is legible. That is not the same as repaired. The willow is willing to discuss terms, which is how it prefers to be paid." };
    return { label: "STILL STANDING", text: "The corruption is low. Do not celebrate yet. The willow is only waiting for the interest to accrue, and it has all the time there is." };
  }

  /* ---------------- public ---------------- */

  window.WishExpansion = {
    cascadeFor: cascadeFor,
    buildTimeline: buildTimeline,
    scoreLoopholes: scoreLoopholes,
    negotiate: negotiate,
    corruptionAfter: corruptionAfter,
    challengeVerdict: challengeVerdict,
    childrenFor: function (domain) {
      return (CHILDREN[domain] || []).slice();
    }
  };
})();
