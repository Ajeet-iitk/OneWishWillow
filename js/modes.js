/* ============================================================
   ONE WISH WILLOW — modes
   Negotiation, the Three Wish Challenge, and the GitHub-backed
   Hall of Fame. The willow loses nothing.
   ============================================================ */

(function () {
  "use strict";

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  const REPO = "Ajeet-iitk/OneWishWillow";
  const API = "https://api.github.com/repos/" + REPO + "/issues?state=open&labels=hall-of-fame&per_page=50";
  const ISSUE_BASE = "https://github.com/" + REPO + "/issues/new";
  const HALL_CACHE = "oww.hall.cache.v1";
  const REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MODES = ["negotiation", "challenge", "hall"];

  let activeMode = null;
  let lastFocus = null;

  /* ---------------- shared helpers ---------------- */

  function toast(message) {
    if (window.WishWillow && window.WishWillow.toast) {
      window.WishWillow.toast(message);
      return;
    }
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { el.classList.remove("is-on"); }, 3000);
  }

  function chime(hard) {
    if (window.WillowAudio) window.WillowAudio.chime(hard);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentRecord() {
    if (window.WishWillow && window.WishWillow.getRecord) return window.WishWillow.getRecord();
    return null;
  }

  function isCrisis(text) {
    return !!(window.WishEngine && window.WishEngine.isCrisis && window.WishEngine.isCrisis(text));
  }

  function scrollToEl(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
    } catch (e) {
      el.scrollIntoView();
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function setStatus(text, isError, html) {
    const el = $("#hallStatus");
    if (!el) return;
    el.classList.toggle("is-error", !!isError);
    if (html) el.innerHTML = text;
    else el.textContent = text;
  }

  /* ---------------- mode shell ---------------- */

  function openMode(name, trigger) {
    const el = $("#" + name + "Mode");
    if (!el) return;

    if (activeMode && activeMode !== name) closeMode(true);
    lastFocus = trigger || document.activeElement;

    MODES.forEach(function (id) {
      const other = $("#" + id + "Mode");
      if (other && id !== name) {
        other.classList.remove("is-on");
        other.setAttribute("aria-hidden", "true");
      }
    });

    el.classList.add("is-on");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-mode-open");
    activeMode = name;

    if (name === "negotiation") seedNegotiation();
    if (name === "challenge") renderChallenge();
    if (name === "hall") {
      if (!hall.loaded) loadHall(false);
      else renderHall();
    }

    setTimeout(function () {
      const close = el.querySelector("[data-close-mode]");
      if (close) close.focus({ preventScroll: true });
    }, 460);
  }

  function closeMode(silent) {
    if (!activeMode) return;
    const el = $("#" + activeMode + "Mode");
    if (el) {
      el.classList.remove("is-on");
      el.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("is-mode-open");
    const previous = lastFocus;
    activeMode = null;
    lastFocus = null;
    if (!silent && previous && previous.focus) {
      try { previous.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  /* ---------------- negotiation ---------------- */

  const negotiation = {
    input: null,
    count: null,
    score: null,
    bar: null,
    grade: null,
    factors: null,
    hint: null,
    submit: null,
    result: null,
    attempt: 0,
    sourceId: null,
    last: null
  };

  function seedNegotiation() {
    const rec = currentRecord();
    if (rec && rec.type === "wish" && rec.id !== negotiation.sourceId) {
      negotiation.input.value = rec.wish;
      negotiation.sourceId = rec.id;
      negotiation.result.hidden = true;
      negotiation.last = null;
    }
    refreshNegotiation();
  }

  function refreshNegotiation() {
    const text = negotiation.input.value;
    const clean = text.replace(/\s+/g, " ").trim();
    negotiation.count.textContent = String(text.length);

    if (!clean) {
      negotiation.score.textContent = "—";
      negotiation.bar.style.width = "0%";
      negotiation.grade.textContent = "The ink is still wet.";
      negotiation.factors.innerHTML = "";
      negotiation.hint.classList.remove("is-gentle");
      negotiation.hint.textContent = "Specifics cost the willow more than poetry. Give it a number, a limit, a witness.";
      negotiation.submit.disabled = true;
      return;
    }

    if (isCrisis(clean)) {
      negotiation.score.textContent = "—";
      negotiation.bar.style.width = "0%";
      negotiation.grade.textContent = "The willow will not price this.";
      negotiation.factors.innerHTML = "";
      negotiation.hint.classList.add("is-gentle");
      negotiation.hint.textContent = "Some wishes are too heavy for a bargain. Please speak to a person who can help: findahelpline.com — or call your local emergency number if you are in immediate danger.";
      negotiation.submit.disabled = true;
      return;
    }

    const analysis = window.WishExpansion.scoreLoopholes(clean);
    negotiation.score.textContent = String(analysis.score);
    negotiation.bar.style.width = analysis.score + "%";
    negotiation.grade.textContent = analysis.grade;
    negotiation.hint.classList.remove("is-gentle");
    negotiation.hint.textContent = analysis.score >= 90
      ? "It looks tight. Look again. There is always a seam."
      : analysis.score >= 70
        ? "Closer. The willow is reading the spaces between your words."
        : "Specifics cost the willow more than poetry. Give it a number, a limit, a witness.";
    negotiation.submit.disabled = false;

    negotiation.factors.innerHTML = analysis.factors.map(function (factor) {
      return '<li class="' + (factor.hit ? "is-hit" : "") + '">' +
        '<span class="factor-dot" aria-hidden="true"></span>' +
        '<div><b>' + escapeHtml(factor.label) + '</b><span>' + escapeHtml(factor.note) + '</span></div>' +
        '</li>';
    }).join("");
  }

  function submitNegotiation() {
    const text = negotiation.input.value.replace(/\s+/g, " ").trim();
    if (text.length < 8) {
      negotiation.hint.classList.remove("is-gentle");
      negotiation.hint.textContent = "Give the willow something to argue with. A few more words.";
      negotiation.input.focus();
      return;
    }
    if (isCrisis(text)) {
      refreshNegotiation();
      return;
    }

    const rec = currentRecord();
    const result = window.WishExpansion.negotiate(rec, text, negotiation.attempt++);
    negotiation.last = { text: text, result: result };

    $("#resultScore").textContent = String(result.score);
    $("#resultCracks").textContent = result.visible + " visible · " + result.hidden + " hidden";
    $("#resultDebt").textContent = result.debt + "%";
    $("#negotiationVerdict").textContent = result.verdict;
    $("#resultResidual").textContent = result.residual;

    negotiation.result.classList.remove("is-gentle");
    negotiation.result.hidden = false;
    chime(result.score >= 80);
    scrollToEl(negotiation.result);
  }

  function nominateNegotiation() {
    if (!negotiation.last) return;
    nominateWish(negotiation.last.text, negotiation.last.result.score, {
      source: "Negotiated wording",
      grade: negotiation.last.result.grade,
      debt: negotiation.last.result.debt,
      note: negotiation.last.result.residual
    });
  }

  /* ---------------- three wish challenge ---------------- */

  const challenge = {
    step: 1,
    corruption: 0,
    records: [],
    selected: null,
    done: false,
    gentle: false
  };

  function resetChallenge() {
    challenge.step = 1;
    challenge.corruption = 0;
    challenge.records = [];
    challenge.selected = null;
    challenge.done = false;
    challenge.gentle = false;

    const input = $("#challengeInput");
    input.value = "";
    $("#challengeCount").textContent = "0";
    $("#challengeResult").hidden = true;
    $("#challengeResult").innerHTML = "";
    $("#challengeGentle").hidden = true;
    $("#challengeGentle").innerHTML = "";
    $("#challengeWarning").textContent = "";
    $("#challengeForm").hidden = false;
    renderChallenge();
    renderChallengeHistory();
  }

  function renderChallenge() {
    const steps = $$("#challengeSteps li");
    steps.forEach(function (li, i) {
      const stepNumber = i + 1;
      li.classList.toggle("is-on", !challenge.done && stepNumber === challenge.step);
      li.classList.toggle("is-done", challenge.done || stepNumber < challenge.step);
    });

    $("#challengeScore").textContent = challenge.corruption + "%";
    $("#challengeBar").style.width = challenge.corruption + "%";

    const label = $("#challengeLabel");
    const prompt = $("#challengePrompt");
    const submit = $("#challengeSubmit span");
    const input = $("#challengeInput");
    const form = $("#challengeForm");

    form.hidden = challenge.done || challenge.gentle;

    if (challenge.done) {
      label.textContent = "The challenge is closed";
      prompt.innerHTML = "<strong>Three wishes.</strong> Three repairs. The willow has the ledger now. Start again if you want a different ending.";
      submit.textContent = "The branch is spent";
      return;
    }

    if (challenge.step === 1) {
      label.textContent = "Wish one";
      input.placeholder = "I wish…";
      submit.textContent = "Break the branch";
      prompt.innerHTML = "<strong>The first wish.</strong> Make it plainly. The willow does not need help finding the wound in it.";
      return;
    }

    const previous = challenge.records[challenge.records.length - 1];
    if (!previous) return;
    const record = previous.record;

    label.textContent = "Wish " + (challenge.step === 2 ? "two" : "three") + " — undo a crack";
    input.placeholder = "I wish the…";
    submit.textContent = challenge.step === 3 ? "Break the final branch" : "Break the branch";

    const cracks = record.twists.map(function (twist, i) {
      const on = challenge.selected === i ? " is-on" : "";
      return '<button class="challenge__crack' + on + '" type="button" data-crack-index="' + i + '">' +
        "<b>" + escapeHtml(twist.tag) + "</b>" + escapeHtml(twist.title) + "</button>";
    }).join("");

    prompt.innerHTML =
      '<p><strong>Your last wish:</strong> “' + escapeHtml(record.wish) + '”</p>' +
      '<p style="margin-top:8px">Choose the crack you intend to undo. The willow will decide what the repair costs.</p>' +
      '<div class="challenge__cracks" role="group" aria-label="Drawbacks from your last wish">' + cracks + "</div>";
  }

  function selectCrack(index) {
    if (challenge.step < 2 || challenge.done) return;
    challenge.selected = index;
    $$("#challengePrompt .challenge__crack").forEach(function (btn) {
      btn.classList.toggle("is-on", Number(btn.getAttribute("data-crack-index")) === index);
    });
    $("#challengeWarning").textContent = "";
    $("#challengeInput").focus();
  }

  function renderChallengeHistory() {
    const list = $("#challengeHistory");
    list.innerHTML = challenge.records.map(function (entry, i) {
      const undo = entry.undo
        ? " · undid “" + escapeHtml(entry.undo.title) + "”"
        : "";
      return '<div class="challenge__history-item">' +
        "<span>0" + (i + 1) + "</span>" +
        "<div><b>“" + escapeHtml(entry.record.wish) + "”</b>" +
        "<em>+" + entry.delta + "% corruption" + undo + "</em></div>" +
        "</div>";
    }).join("");
  }

  function renderChallengeResult(entry, stepIndex) {
    const record = entry.record;
    const final = stepIndex === 3;
    const verdict = window.WishExpansion.challengeVerdict(challenge.corruption);
    const undo = entry.undo
      ? '<div class="challenge__undo"><b>The crack you tried to undo</b>“' + escapeHtml(entry.undo.title) + '” — ' + escapeHtml(entry.undo.text) + "</div>"
      : "";

    const finalBlock = final
      ? '<div class="challenge__verdict"><b>Final verdict · ' + escapeHtml(verdict.label) + "</b><p>" + escapeHtml(verdict.text) + "</p></div>" +
        '<div class="challenge__restart">' +
          '<button class="ghost-btn ghost-btn--bordered" type="button" data-challenge-restart><span>Run the challenge again</span></button>' +
          '<button class="ghost-btn ghost-btn--bordered" type="button" data-challenge-nominate><svg class="icon" aria-hidden="true"><use href="#i-ribbon"/></svg><span>Nominate your best wording</span></button>' +
        "</div>"
      : "";

    const box = $("#challengeResult");
    box.className = "challenge__result" + (final ? " challenge__result--final" : "");
    box.innerHTML =
      "<h3><span>Wish 0" + stepIndex + " · answered</span>“" + escapeHtml(record.wish) + "”</h3>" +
      "<p>" + escapeHtml(record.twists[0].text) + "</p>" +
      undo +
      '<div class="challenge__delta">+' + entry.delta + "% corruption · now " + challenge.corruption + "%</div>" +
      finalBlock;
    box.hidden = false;
    scrollToEl(box);
  }

  function showChallengeGentle(record) {
    challenge.gentle = true;
    challenge.done = true;
    $("#challengeForm").hidden = true;
    $("#challengeWarning").textContent = "";
    $("#challengePrompt").innerHTML = "<strong>The willow has put the branch down.</strong> Some wishes are not for bargaining.";
    $("#challengeLabel").textContent = "The challenge is closed";

    const box = $("#challengeGentle");
    box.hidden = false;
    box.innerHTML =
      "<h3>A different answer</h3>" +
      record.note.map(function (line) { return "<p>" + escapeHtml(line) + "</p>"; }).join("") +
      '<div class="resources">' + record.resources.map(function (r) {
        return '<a href="' + escapeHtml(r.href) + '"' + (/^https?:/.test(r.href) ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
          "<b>" + escapeHtml(r.name) + "</b><span>" + escapeHtml(r.note) + "</span></a>";
      }).join("") + "</div>";
    scrollToEl(box);
  }

  function submitChallenge(event) {
    if (event) event.preventDefault();
    if (challenge.done) return;

    const input = $("#challengeInput");
    const text = input.value.replace(/\s+/g, " ").trim();
    const warning = $("#challengeWarning");

    if (text.length < 8) {
      warning.textContent = "The willow needs a whole sentence. Try again.";
      input.focus();
      return;
    }

    if (isCrisis(text)) {
      const gentle = window.WishEngine.generate(text);
      showChallengeGentle(gentle);
      return;
    }

    if (challenge.step > 1 && challenge.selected == null) {
      warning.textContent = "Choose one crack from the last wish before you write the repair.";
      return;
    }

    const stepIndex = challenge.step;
    const record = window.WishEngine.generate(text);
    if (!record || record.type !== "wish") {
      if (record && record.type === "gentle") showChallengeGentle(record);
      return;
    }

    const previous = challenge.records[challenge.records.length - 1];
    const undo = stepIndex > 1 && previous ? previous.record.twists[challenge.selected] : null;
    const before = challenge.corruption;
    let after;

    if (stepIndex === 1) {
      after = Math.min(99, Math.max(16, Math.round(record.severity.debt * 0.52)));
    } else {
      after = window.WishExpansion.corruptionAfter(before, record, stepIndex);
    }

    const entry = {
      record: record,
      undo: undo,
      delta: Math.max(0, after - before),
      corruption: after
    };

    challenge.corruption = after;
    challenge.records.push(entry);
    challenge.step = stepIndex + 1;
    challenge.selected = null;
    challenge.done = stepIndex === 3;

    input.value = "";
    $("#challengeCount").textContent = "0";
    warning.textContent = "";

    renderChallengeHistory();
    renderChallengeResult(entry, stepIndex);
    renderChallenge();
    chime(stepIndex === 3 || challenge.corruption >= 75);

    if (!challenge.done) {
      setTimeout(function () { input.focus({ preventScroll: true }); }, 400);
    }
  }

  function nominateChallenge() {
    if (!challenge.records.length) return;
    let best = challenge.records[0];
    let bestScore = -1;
    challenge.records.forEach(function (entry) {
      const score = window.WishExpansion.scoreLoopholes(entry.record.wish).score;
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });
    nominateWish(best.record.wish, bestScore, {
      source: "Three Wish Challenge",
      grade: "Corruption " + challenge.corruption + "%",
      note: "One of three wishes made in a single run."
    });
  }

  /* ---------------- hall of fame ---------------- */

  const hall = {
    entries: [],
    loaded: false,
    loading: false,
    sort: "score"
  };

  const EXHIBITS = [
    {
      wish: "I wish for exactly enough money to pay every debt I know about, in full, by Friday at noon, and not one cent more.",
      author: "The Accountant",
      note: "Closed the amount. Left the currency."
    },
    {
      wish: "I wish to be forgotten by everyone who has ever wished me harm, without harm coming to any of them, effective immediately and permanently.",
      author: "The Witness",
      note: "Named the harm. Forgot the memory of it."
    },
    {
      wish: "I wish for one more ordinary Tuesday with my father, in his own kitchen, with no one else present, and for both of us to remember it exactly as it was.",
      author: "The Archivist",
      note: "Specified the room. Did not specify the year."
    },
    {
      wish: "I wish to be able to undo any wish I make, once, at any point, with full knowledge of what undoing it will cost.",
      author: "The Understudy",
      note: "The willow respects the clause. It has already signed it."
    }
  ];

  function cacheHall(entries) {
    try {
      window.sessionStorage.setItem(HALL_CACHE, JSON.stringify({ at: Date.now(), entries: entries }));
    } catch (e) {}
  }

  function readHallCache() {
    try {
      const raw = window.sessionStorage.getItem(HALL_CACHE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && Array.isArray(parsed.entries) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function parseIssue(issue) {
    if (!issue || issue.pull_request) return null;
    const body = issue.body || "";
    let wish = "";

    const exact = body.match(/\*\*Wish:\*\*\s*[“"]([\s\S]*?)[”"]\s*(?:\n|$)/);
    if (exact) wish = exact[1].trim();

    if (!wish) {
      wish = String(issue.title || "")
        .replace(/^\[[^\]]*\]\s*/, "")
        .replace(/^Wish:\s*/i, "")
        .replace(/^[“"]/, "")
        .replace(/[”"]$/, "")
        .trim();
    }
    if (!wish) return null;

    let score = NaN;
    const scoreMatch = body.match(/\*\*Willow score:\*\*\s*(\d{1,3})/i);
    if (scoreMatch) score = parseInt(scoreMatch[1], 10);
    if (!isFinite(score) && window.WishExpansion) score = window.WishExpansion.scoreLoopholes(wish).score;
    if (!isFinite(score)) score = 0;

    const reactions = issue.reactions || {};
    const votes = (reactions["+1"] || 0) + (reactions.heart || 0) +
      (reactions.hooray || 0) + (reactions.rocket || 0) + (reactions.eyes || 0);

    return {
      number: issue.number,
      wish: wish,
      score: Math.max(0, Math.min(100, score)),
      votes: votes,
      user: (issue.user && issue.user.login) || "anonymous",
      created: issue.created_at,
      url: issue.html_url
    };
  }

  function loadHall(force) {
    if (hall.loading) return;
    if (hall.loaded && !force) {
      renderHall();
      return;
    }

    hall.loading = true;
    setStatus("Opening the Hall…");

    fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub returned " + res.status);
        return res.json();
      })
      .then(function (issues) {
        hall.entries = issues.map(parseIssue).filter(Boolean);
        hall.loaded = true;
        hall.loading = false;
        cacheHall(hall.entries);
        renderHall();
        setStatus(hall.entries.length
          ? hall.entries.length + (hall.entries.length === 1 ? " nomination" : " nominations") + " in the Hall. Votes are the reactions on each issue — open one and react to vote."
          : "No community nominations yet. The house exhibits are below — or add the first name to the glass.");
      })
      .catch(function (err) {
        hall.loading = false;
        const cached = readHallCache();
        if (cached && cached.entries.length) {
          hall.entries = cached.entries;
          hall.loaded = true;
          renderHall();
          setStatus("GitHub could not be reached just now (" + err.message + "). Showing the last copy of the Hall. Nominations still open GitHub in a new tab.", true);
        } else {
          hall.entries = [];
          hall.loaded = true;
          renderHall();
          setStatus("The Hall could not reach GitHub (" + err.message + "). The house exhibits are still here, and nominations still open GitHub in a new tab.", true);
        }
      });
  }

  function hallCard(entry, index) {
    const podium = index < 3 ? " hall-card--podium" : "";
    const date = formatDate(entry.created);
    return '<li class="hall-card' + podium + '">' +
      '<div class="hall-card__rank">' + String(index + 1).padStart(2, "0") + "</div>" +
      '<div class="hall-card__body">' +
        '<p class="hall-card__wish">“' + escapeHtml(entry.wish) + "”</p>" +
        '<div class="hall-card__meta">' +
          "<span>@" + escapeHtml(entry.user) + "</span><i></i>" +
          (date ? "<span>" + escapeHtml(date) + "</span><i></i>" : "") +
          "<b>#" + escapeHtml(entry.number) + "</b>" +
        "</div>" +
        '<div class="hall-card__score">' +
          '<span class="hall-card__bar" aria-hidden="true"><i style="width:' + entry.score + '%"></i></span>' +
          "<b>" + entry.score + "</b><span>loophole-proof</span>" +
        "</div>" +
      "</div>" +
      '<a class="hall-card__vote" href="' + escapeHtml(entry.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Vote for this wish on GitHub — ' + entry.votes + ' reactions so far">' +
        '<svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg>' +
        "<b>" + entry.votes + "</b><span>Vote</span>" +
      "</a>" +
      "</li>";
  }

  function renderHall() {
    const list = $("#hallList");
    if (!list) return;

    const sorted = hall.entries.slice().sort(function (a, b) {
      if (hall.sort === "votes") {
        return (b.votes - a.votes) || (b.score - a.score);
      }
      return (b.score - a.score) || (b.votes - a.votes);
    });

    list.innerHTML = sorted.map(hallCard).join("");

    $("#hallExhibits").innerHTML = EXHIBITS.map(function (exhibit) {
      const score = window.WishExpansion ? window.WishExpansion.scoreLoopholes(exhibit.wish).score : 0;
      return '<li class="hall-exhibit">' +
        '<p class="hall-exhibit__wish">“' + escapeHtml(exhibit.wish) + "”</p>" +
        '<div class="hall-exhibit__meta"><b>' + escapeHtml(exhibit.author) + "</b><span>" + score + "/100</span></div>" +
        '<p class="hall-exhibit__score">' + escapeHtml(exhibit.note) + "</p>" +
        "</li>";
    }).join("");

    $$("#hallMode [data-hall-sort]").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-hall-sort") === hall.sort);
    });
  }

  function hallRefreshNomination() {
    const input = $("#hallWish");
    const text = input.value.replace(/\s+/g, " ").trim();
    $("#hallCount").textContent = String(input.value.length);

    const scoreEl = $("#hallScore");
    const gradeEl = $("#hallGrade");
    const submit = $("#hallForm button[type=submit]");

    if (!text) {
      scoreEl.textContent = "—";
      gradeEl.textContent = "Write the wish to be scored.";
      submit.disabled = true;
      return;
    }

    if (isCrisis(text)) {
      scoreEl.textContent = "—";
      gradeEl.textContent = "The willow has no score for this. Please speak to someone who can help.";
      submit.disabled = true;
      return;
    }

    const analysis = window.WishExpansion.scoreLoopholes(text);
    scoreEl.textContent = String(analysis.score);
    gradeEl.textContent = analysis.grade;
    submit.disabled = false;
  }

  function nominateWish(wish, score, extra) {
    const clean = String(wish || "").replace(/\s+/g, " ").trim();
    if (!clean) return;
    if (isCrisis(clean)) {
      toast("The willow will not put this in the Hall. Please reach out to a real person.");
      return;
    }

    const short = clean.length > 68 ? clean.slice(0, 65).trim() + "…" : clean;
    const meta = extra || {};
    const rawLines = [
      "**Wish:** “" + clean + "”",
      "",
      "**Willow score:** " + score + "/100",
      meta.grade ? "**Grade:** " + meta.grade : "",
      meta.debt != null ? "**Debt after negotiation:** " + meta.debt + "%" : "",
      meta.source ? "**Made in:** " + meta.source : "",
      meta.note ? "**The residual loophole:** " + meta.note : "",
      "",
      "---",
      "",
      "Nominated from [One Wish Willow](https://ajeet-iitk.github.io/OneWishWillow/).",
      "Vote by adding a reaction to this issue. The reaction count is the community vote.",
      "<!-- oww:hall-of-fame -->"
    ];
    const lines = rawLines.filter(function (line, i) {
      return !(line === "" && rawLines[i - 1] === "");
    });

    const url = ISSUE_BASE +
      "?labels=" + encodeURIComponent("hall-of-fame") +
      "&title=" + encodeURIComponent('[Hall of Fame] “' + short + '”') +
      "&body=" + encodeURIComponent(lines.join("\n"));

    window.open(url, "_blank", "noopener");
    toast("GitHub opened in a new tab. Submit the issue to enter the Hall.");
  }

  function submitHall(event) {
    event.preventDefault();
    const text = $("#hallWish").value.replace(/\s+/g, " ").trim();
    if (text.length < 8) {
      toast("A few more words. The Hall keeps whole wishes.");
      return;
    }
    if (isCrisis(text)) {
      toast("The willow will not put this in the Hall. Please reach out to a real person.");
      return;
    }
    const analysis = window.WishExpansion.scoreLoopholes(text);
    nominateWish(text, analysis.score, { source: "Hall nomination", grade: analysis.grade });
  }

  /* ---------------- wiring ---------------- */

  function bind() {
    negotiation.input = $("#negotiationInput");
    negotiation.count = $("#negotiationCount");
    negotiation.score = $("#negotiationScore");
    negotiation.bar = $("#negotiationBar");
    negotiation.grade = $("#negotiationGrade");
    negotiation.factors = $("#negotiationFactors");
    negotiation.hint = $("#negotiationHint");
    negotiation.submit = $("#negotiationSubmit");
    negotiation.result = $("#negotiationResult");

    negotiation.input.addEventListener("input", refreshNegotiation);
    negotiation.submit.addEventListener("click", submitNegotiation);
    $("#negotiationNominate").addEventListener("click", nominateNegotiation);
    $("#negotiationAgain").addEventListener("click", function () {
      negotiation.result.hidden = true;
      negotiation.input.focus();
    });

    const challengeInput = $("#challengeInput");
    $("#challengeForm").addEventListener("submit", submitChallenge);
    challengeInput.addEventListener("input", function () {
      $("#challengeCount").textContent = String(challengeInput.value.length);
      $("#challengeWarning").textContent = "";
    });
    $("#challengePrompt").addEventListener("click", function (e) {
      const crack = e.target.closest("[data-crack-index]");
      if (crack) selectCrack(Number(crack.getAttribute("data-crack-index")));
    });
    $("#challengeResult").addEventListener("click", function (e) {
      if (e.target.closest("[data-challenge-restart]")) resetChallenge();
      if (e.target.closest("[data-challenge-nominate]")) nominateChallenge();
    });

    $("#hallWish").addEventListener("input", hallRefreshNomination);
    $("#hallForm").addEventListener("submit", submitHall);
    $("#hallRefresh").addEventListener("click", function () {
      hall.loaded = false;
      loadHall(true);
    });
    $$("#hallMode [data-hall-sort]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        hall.sort = btn.getAttribute("data-hall-sort") === "votes" ? "votes" : "score";
        renderHall();
      });
    });

    document.addEventListener("click", function (e) {
      const opener = e.target.closest("[data-open-mode]");
      if (opener) {
        e.preventDefault();
        openMode(opener.getAttribute("data-open-mode"), opener);
        return;
      }
      if (e.target.closest("[data-close-mode]")) {
        e.preventDefault();
        closeMode(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && activeMode) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeMode(false);
      }
    }, true);

    const brand = $("#brandHome");
    if (brand) {
      brand.addEventListener("click", function () {
        if (activeMode) closeMode(true);
      }, true);
    }

    hallRefreshNomination();
    renderChallenge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
