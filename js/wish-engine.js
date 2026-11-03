/* ============================================================
   ONE WISH WILLOW — wish engine
   Reads a wish, finds its hunger, grows the roots.
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.WISH_DATA;
  const DOMAINS = DATA.domains;

  const CRISIS_RE = /(suicid|kill myself|end (my life|it all)|want to die|wish i (was|were) dead|better off dead|self[-\s]?harm|hurt myself|cut myself|no reason to live|don'?t want to live|can'?t go on living)/i;

  /* ---------------- small utilities ---------------- */

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

  function pick(rand, arr) {
    return arr[Math.floor(rand() * arr.length)] || arr[0];
  }

  function normalize(raw) {
    return String(raw || "")
      .replace(/\s+/g, " ")
      .replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, "")
      .trim()
      .slice(0, 220);
  }

  function secondPerson(text) {
    if (!/^(i|we)\s+(wish|want|need|hope|desire|would\s+like|'d\s+like|am\s+wishing)/i.test(text)) {
      return null;
    }
    let t = text
      .replace(/\bI\s+was\b/gi, "you were")
      .replace(/\bI\s+am\b/gi, "you are")
      .replace(/\bI'm\b/gi, "you're")
      .replace(/\bI've\b/gi, "you've")
      .replace(/\bI'll\b/gi, "you'll")
      .replace(/\bI'd\b/gi, "you'd")
      .replace(/\bI\b/g, "you")
      .replace(/\bme\b/gi, "you")
      .replace(/\bmy\b/gi, "your")
      .replace(/\bmine\b/gi, "yours")
      .replace(/\bmyself\b/gi, "yourself")
      .replace(/\bwe\b/gi, "you")
      .replace(/\bour\b/gi, "your")
      .replace(/\bus\b/gi, "you");
    t = t.charAt(0).toUpperCase() + t.slice(1);
    return t;
  }

  /* ---------------- detection ---------------- */

  function scoreDomains(text) {
    const scores = {};
    let bestId = "default";
    let bestScore = 0;

    Object.keys(DOMAINS).forEach(function (id) {
      if (id === "default") return;
      const d = DOMAINS[id];
      let score = 0;
      (d.keywords || []).forEach(function (re) {
        if (re.test(text)) score += 1;
      });
      (d.strong || []).forEach(function (re) {
        if (re.test(text)) score += 2;
      });
      scores[id] = score;
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    });

    return { id: bestId, score: bestScore, scores: scores };
  }

  function observationsFor(text, rand) {
    const found = [];
    const seen = {};

    DATA.observationRules.forEach(function (rule) {
      if (rule.re.test(text) && !seen[rule.line]) {
        seen[rule.line] = true;
        found.push(rule.line);
      }
    });

    const andCount = (text.match(/\band\b/gi) || []).length;
    if (andCount >= 2 || /\b(and also|plus|as well as)\b/i.test(text)) {
      found.unshift("You named more than one hunger. The willow will feed the loudest and bill you for the rest.");
    }

    if (/\b(he|she|they|him|her|them)\b/i.test(text) &&
        /\b(my|our)\b/i.test(text) &&
        /\b(mom|mother|dad|father|sister|brother|son|daughter|wife|husband|friend|partner|ex|crush|family)\b/i.test(text)) {
      found.unshift("You asked on behalf of someone else. The willow finds this noble, or convenient. It has not decided.");
    }

    if (/\b(die|dead|death|kill)\b/i.test(text) && !CRISIS_RE.test(text)) {
      found.unshift("You spoke of death in the same breath as wanting. The willow heard both and is deciding which was the wish.");
    }

    // never leave the reading bare
    const fallbacks = (DATA.fallbackObservations || []).slice();
    while (found.length < 2 && fallbacks.length) {
      const idx = Math.floor(rand() * fallbacks.length);
      const line = fallbacks.splice(idx, 1)[0];
      if (found.indexOf(line) === -1) found.push(line);
    }

    // shuffle lightly, keep two
    for (let i = found.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = found[i];
      found[i] = found[j];
      found[j] = tmp;
    }
    return found.slice(0, 2);
  }

  /* ---------------- the gentle answer ---------------- */

  function gentleWish(wish) {
    return {
      v: 1,
      id: "wish_gentle_" + Date.now().toString(36),
      type: "gentle",
      wish: wish,
      label: "A DIFFERENT ANSWER",
      note: [
        "The willow has heard this wish before. It will not grant it — not because it cannot, but because it has seen what happens to the branch that carries it.",
        "This is a story about wishes that go wrong. Some wishes are too heavy for a story. If you are carrying one of those, the willow has nothing to sell you and no clever ending to give you.",
        "Please speak to a person who can actually help. You deserve a real answer, not a beautiful one."
      ],
      resources: [
        { name: "988 Suicide & Crisis Lifeline", note: "United States · call or text 988", href: "tel:988" },
        { name: "findahelpline.com", note: "A helpline in your country", href: "https://findahelpline.com" },
        { name: "Local emergency services", note: "If you are in immediate danger", href: "tel:112" }
      ],
      createdAt: new Date().toISOString()
    };
  }

  /* ---------------- generate ---------------- */

  function generate(rawWish) {
    const wish = normalize(rawWish);
    if (!wish) return null;

    if (CRISIS_RE.test(wish)) return gentleWish(wish);

    const detection = scoreDomains(wish);
    const domainId = detection.id;
    const domain = DOMAINS[domainId] || DOMAINS.default;

    const seed = (hash(wish) ^ (Date.now() & 0xFFFFFFFF) ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0;
    const rand = mulberry32(seed);

    const opener = pick(rand, DATA.openers);
    let grantedBody = pick(rand, domain.granted);
    if (/^The willow/.test(opener) && /^The willow/.test(grantedBody)) {
      grantedBody = "It" + grantedBody.slice(10);
    }
    const granted = opener + " " + grantedBody;

    const first = domain.twists[0];
    const fourth = domain.twists[3];
    const middle = pick(rand, [domain.twists[1], domain.twists[2]]);

    const severityLevel = 3 + Math.floor(rand() * 3);
    const debt = Math.min(98, 48 + severityLevel * 9 + Math.floor(rand() * 8));

    const coda = pick(rand, DATA.codas);
    const codaTitle = pick(rand, DATA.codaTitles);
    const inversion = pick(rand, domain.inversions || DATA.inversions || []);

    const tags = [];
    [domain.label, pick(rand, DATA.tags), domain.cost].forEach(function (t) {
      if (t && tags.indexOf(t) === -1) tags.push(t);
    });

    // hidden second hunger
    let twin = "";
    let secondId = null;
    let secondScore = 0;
    Object.keys(detection.scores).forEach(function (id) {
      if (id !== domainId && detection.scores[id] > secondScore) {
        secondScore = detection.scores[id];
        secondId = id;
      }
    });
    if (secondId && secondScore >= 2 && secondScore >= detection.score * 0.65) {
      twin = pick(rand, DATA.twinLines);
    }

    return {
      v: 1,
      id: "wish_" + seed.toString(36) + "_" + Date.now().toString(36),
      type: "wish",
      wish: wish,
      domain: domainId,
      label: domain.label,
      secondPerson: secondPerson(wish),
      observations: observationsFor(wish, rand),
      granted: granted,
      inversion: inversion,
      twin: twin,
      twists: [
        { tag: "THE FIRST CRACK", title: first.title, text: first.text },
        { tag: "THE SECOND CRACK", title: middle.title, text: middle.text },
        { tag: "THE THIRD CRACK", title: fourth.title, text: fourth.text },
        { tag: "THE LAST TURN", title: codaTitle, text: coda }
      ],
      price: pick(rand, domain.prices),
      severity: {
        level: severityLevel,
        debt: debt,
        label: DATA.severity[severityLevel - 1] || DATA.severity[4],
        cost: domain.cost
      },
      tags: tags,
      createdAt: new Date().toISOString(),
      seed: seed
    };
  }

  /* ---------------- copy ---------------- */

  function toText(record) {
    if (!record) return "";
    if (record.type === "gentle") {
      return [
        "ONE WISH WILLOW",
        "",
        "“" + record.wish + "”",
        "",
        record.note.join("\n\n"),
        "",
        record.resources.map(function (r) { return r.name + " — " + r.note; }).join("\n"),
        "",
        "— the willow has no clever ending for this one"
      ].join("\n");
    }
    const lines = [
      "ONE WISH WILLOW",
      "— a testimony —",
      "",
      "“" + record.wish + "”",
      "",
      "GRANTED",
      record.granted,
      ""
    ];
    if (record.inversion) {
      lines.push("THE OPPOSITE", record.inversion, "");
    }
    if (record.twin) lines.push(record.twin, "");
    lines.push("THE SPIRAL");
    record.twists.forEach(function (t, i) {
      lines.push((i + 1) + ". " + t.title.toUpperCase() + " — " + t.text);
    });
    lines.push("", "THE PRICE", record.price);
    lines.push("", "The debt: " + record.severity.debt + "% · " + record.severity.label);
    lines.push("", "— the willow remembers");
    return lines.join("\n");
  }

  window.WishEngine = {
    generate: generate,
    toText: toText,
    normalize: normalize,
    scoreDomains: scoreDomains,
    isCrisis: function (text) { return CRISIS_RE.test(text); }
  };
})();
