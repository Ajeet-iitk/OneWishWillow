/* ============================================================
   ONE WISH WILLOW — experience controller
   ============================================================ */

(function () {
  "use strict";

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  const body = document.body;
  const treeWrap = $("#treeWrap");
  const fallingLeaves = $("#fallingLeaves");
  const wishInput = $("#wishInput");
  const breakBtn = $("#breakBtn");
  const breakLabel = $("#breakLabel");
  const breakProgress = $("#breakProgress");
  const ritualWarn = $("#ritualWarn");
  const ritualCard = $(".ritual__card");
  const answer = $("#answer");
  const oracle = $("#oracle");
  const oracleLine = $("#oracleLine");
  const toastEl = $("#toast");
  const flash = $("#flash");
  const scrim = $("#scrim");
  const drawer = $("#hollowDrawer");
  const hollowList = $("#hollowList");
  const hollowMeta = $("#hollowMeta");
  const hollowCount = $("#hollowCount");
  const soundToggle = $("#soundToggle");
  const soundPanelBtn = $("#soundPanelBtn");
  const soundPanel = $("#soundPanel");
  const masterVolume = $("#masterVolume");
  const volumeValue = $("#volumeValue");
  const musicToggle = $("#musicToggle");
  const sfxToggle = $("#sfxToggle");
  const omenMeter = $("#omenMeter");
  const omenBar = $("#omenBar");
  const omenLabel = $("#omenLabel");
  const omenTrack = $("#omenTrack");
  const answerScroll = $(".answer__scroll");
  const answerSkip = $("#answerSkip");
  const answerProgress = $("#answerProgress");
  const answerRail = $("#answerRail");
  const timeBtn = $("#timeBtn");
  const timeIcon = $("#timeIcon");
  const timeLabel = $("#timeLabel");
  const metaTheme = $("#metaTheme");
  const saveBtn = $("#saveWish");
  const saveLabel = saveBtn.querySelector("span");

  const REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STORE_KEY = "oww.hollow.v1";
  const SOUND_KEY = "oww.sound.v1";
  const AUDIO_KEY = "oww.audio.v1";
  const LIGHT_KEY = "oww.light.v1";
  const MAX_HOLLOW = 40;
  const HOLD_MS = REDUCE ? 600 : 1250;
  const PHASES = ["night", "dawn", "day", "dusk"];
  const PHASE_INFO = {
    night: { label: "Night", icon: "moon", color: "#050a08", line: "The grove settles into night." },
    dawn: { label: "Dawn", icon: "dawn", color: "#1b2233", line: "The grove turns toward dawn." },
    day: { label: "Day", icon: "sun", color: "#c3cfc5", line: "Morning opens over the grove." },
    dusk: { label: "Dusk", icon: "dusk", color: "#2a1f2d", line: "Dusk gathers in the branches." }
  };

  let hollow = [];
  let memoryHollow = [];
  let currentRecord = null;
  let isArchiveView = false;
  let hasSnapped = false;
  let holding = false;
  let holdRAF = 0;
  let holdStart = 0;
  let holdProgress = 0;
  let typeTimer = 0;
  let oracleTimer = 0;
  let oracleLineTimer = 0;
  let autoSaveTimer = 0;
  let toastTimer = 0;
  let warnTimer = 0;
  let clearArmed = false;
  let clearArmTimer = 0;
  let soundOn = true;
  let timePhase = "night";
  let timeSwitching = false;
  let audioSettings = { volume: 0.72, music: true, sfx: true };
  let revealTimers = [];
  let revealDone = false;
  let lastOmenTier = 0;
  let railFrame = 0;

  /* ---------------- storage ---------------- */

  function readHollow() {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      const arr = JSON.parse(raw || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return memoryHollow.slice();
    }
  }

  function writeHollow() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(hollow.slice(0, MAX_HOLLOW)));
    } catch (e) {
      memoryHollow = hollow.slice();
    }
  }

  function isSaved(record) {
    if (!record) return false;
    return hollow.some(function (r) { return r.id === record.id; });
  }

  function updateHollowCount() {
    hollowCount.textContent = String(hollow.length);
    hollowCount.setAttribute("aria-label", hollow.length + " wishes in the Hollow");
  }

  /* ---------------- atmosphere ---------------- */

  function buildWorld() {
    const wide = window.innerWidth > 820;
    WillowArt.buildWillow($("#willowMount"));
    WillowArt.scatterStars($("#stars"), wide ? 100 : 48);
    WillowArt.scatterFireflies($("#fireflies"), wide ? 20 : 11);
    WillowArt.scatterPetals($("#petals"), wide ? 12 : 6);
    $("#stars").setAttribute("aria-hidden", "true");
  }

  function startCursor() {
    if (REDUCE) return;
    if (!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    const glow = $("#cursorGlow");
    body.classList.add("has-pointer");
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    (function loop() {
      cx += (tx - cx) * 0.11;
      cy += (ty - cy) * 0.11;
      glow.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      window.requestAnimationFrame(loop);
    })();
  }

  /* ---------------- sound ---------------- */

  function applySoundUI() {
    soundToggle.setAttribute("aria-pressed", soundOn ? "true" : "false");
    soundToggle.setAttribute("aria-label", soundOn ? "Mute sound" : "Enable sound");
    soundToggle.title = soundOn ? "Sound on" : "Sound off";
    if (masterVolume) masterVolume.value = String(Math.round(audioSettings.volume * 100));
    if (volumeValue) volumeValue.textContent = Math.round(audioSettings.volume * 100) + "%";
    if (musicToggle) musicToggle.checked = audioSettings.music;
    if (sfxToggle) sfxToggle.checked = audioSettings.sfx;
  }

  function saveAudioSettings() {
    try {
      window.localStorage.setItem(AUDIO_KEY, JSON.stringify({
        volume: audioSettings.volume,
        music: audioSettings.music,
        sfx: audioSettings.sfx
      }));
    } catch (e) {}
  }

  function initSoundPreference() {
    try {
      soundOn = window.localStorage.getItem(SOUND_KEY) !== "off";
    } catch (e) {
      soundOn = true;
    }
    try {
      const raw = window.localStorage.getItem(AUDIO_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved === "object") {
        if (isFinite(saved.volume)) audioSettings.volume = Math.max(0, Math.min(1, Number(saved.volume)));
        audioSettings.music = saved.music !== false;
        audioSettings.sfx = saved.sfx !== false;
      }
    } catch (e) {}

    if (window.WillowAudio) {
      const A = window.WillowAudio;
      A.enabled = soundOn;
      A.setVolume(audioSettings.volume);
      A.setMusicEnabled(audioSettings.music);
      A.setSfxEnabled(audioSettings.sfx);
    }
    applySoundUI();
  }

  soundToggle.addEventListener("click", function () {
    soundOn = !soundOn;
    try { window.localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off"); } catch (e) {}
    applySoundUI();
    if (window.WillowAudio) window.WillowAudio.setEnabled(soundOn);
    if (soundOn) toast("The grove is listening.");
  });

  function setSoundPanel(open) {
    if (!soundPanel || !soundPanelBtn) return;
    soundPanel.hidden = !open;
    soundPanel.classList.toggle("is-on", open);
    soundPanelBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && window.WillowAudio) window.WillowAudio.section(false);
  }

  if (soundPanelBtn) {
    soundPanelBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setSoundPanel(soundPanel.hidden);
    });
  }

  if (masterVolume) {
    masterVolume.addEventListener("input", function () {
      audioSettings.volume = Math.max(0, Math.min(1, Number(masterVolume.value) / 100));
      if (volumeValue) volumeValue.textContent = Math.round(audioSettings.volume * 100) + "%";
      if (window.WillowAudio) window.WillowAudio.setVolume(audioSettings.volume);
      saveAudioSettings();
    });
    masterVolume.addEventListener("change", function () {
      if (window.WillowAudio) window.WillowAudio.tick();
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("change", function () {
      audioSettings.music = musicToggle.checked;
      if (window.WillowAudio) window.WillowAudio.setMusicEnabled(audioSettings.music);
      saveAudioSettings();
    });
  }

  if (sfxToggle) {
    sfxToggle.addEventListener("change", function () {
      audioSettings.sfx = sfxToggle.checked;
      if (window.WillowAudio) window.WillowAudio.setSfxEnabled(audioSettings.sfx);
      saveAudioSettings();
    });
  }

  document.addEventListener("click", function (e) {
    if (soundPanel && !soundPanel.hidden && !e.target.closest(".sound-wrap")) setSoundPanel(false);
  });

  /* ---------------- hours / light ---------------- */

  function applyTimeUI(phase, announce) {
    const info = PHASE_INFO[phase] || PHASE_INFO.night;
    const next = PHASES[(PHASES.indexOf(phase) + 1) % PHASES.length];
    const nextInfo = PHASE_INFO[next];

    document.documentElement.setAttribute("data-time", phase);
    if (timeIcon) timeIcon.setAttribute("href", "#i-" + info.icon);
    if (timeLabel) timeLabel.textContent = info.label;
    if (timeBtn) {
      timeBtn.setAttribute("aria-label", "Change the light. It is " + info.label.toLowerCase() + "; next is " + nextInfo.label.toLowerCase() + ".");
      timeBtn.title = info.label + " · change to " + nextInfo.label;
    }
    if (metaTheme) metaTheme.setAttribute("content", info.color);
    if (announce) toast(info.line);
  }

  function initTimePreference() {
    let saved = "";
    try { saved = window.localStorage.getItem(LIGHT_KEY) || ""; } catch (e) {}
    timePhase = PHASES.indexOf(saved) !== -1 ? saved : "night";
    applyTimeUI(timePhase, false);
  }

  function cycleTime() {
    if (timeSwitching) return;
    timeSwitching = true;
    const next = PHASES[(PHASES.indexOf(timePhase) + 1) % PHASES.length];
    const world = $(".world");

    if (world) world.classList.add("is-time-shifting");
    if (window.WillowAudio && soundOn) window.WillowAudio.chime();

    setTimeout(function () {
      timePhase = next;
      applyTimeUI(timePhase, true);
      try { window.localStorage.setItem(LIGHT_KEY, timePhase); } catch (e) {}
      window.requestAnimationFrame(function () {
        if (world) world.classList.remove("is-time-shifting");
      });
      setTimeout(function () { timeSwitching = false; }, 340);
    }, 190);
  }

  timeBtn.addEventListener("click", cycleTime);

  /* ---------------- toast ---------------- */

  function toast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("is-on");
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-on");
    }, 3000);
  }

  function nudge(message) {
    clearTimeout(warnTimer);
    ritualWarn.textContent = message;
    ritualWarn.classList.add("is-on");
    ritualCard.classList.remove("is-refusing");
    void ritualCard.offsetWidth;
    ritualCard.classList.add("is-refusing");
    warnTimer = setTimeout(function () {
      ritualWarn.classList.remove("is-on");
    }, 3200);
  }

  /* ---------------- entering ---------------- */

  function enterGrove() {
    body.classList.remove("stage-hero");
    body.classList.add("stage-ritual");
    $("#hero").setAttribute("aria-hidden", "true");
    $("#ritual").setAttribute("aria-hidden", "false");
    if (window.WillowAudio && soundOn) {
      window.WillowAudio.start();
      window.WillowAudio.setDread(0.14);
      window.WillowAudio.section(false);
    }
    setTimeout(function () {
      if (window.innerWidth > 820) wishInput.focus({ preventScroll: true });
    }, 950);
  }

  $("#enterBtn").addEventListener("click", enterGrove);

  $("#brandHome").addEventListener("click", function (e) {
    e.preventDefault();
    hideOracle();
    closeDrawer();
    closeAnswer(false);
    resetRitual(true);
    body.classList.remove("stage-ritual", "stage-answer");
    body.classList.add("stage-hero");
    $("#hero").setAttribute("aria-hidden", "false");
    $("#ritual").setAttribute("aria-hidden", "true");
    window.scrollTo(0, 0);
  });

  /* ---------------- ritual input ---------------- */

  function omenScore(text) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (!clean) return 0;

    let score = Math.min(40, clean.length * 0.68);
    const detail = /\b(exactly|only|just|by|before|after|without|unless|until|no one|nobody|someone|everyone|forever|never|always|because|so that|in writing|witness|consent|full|entire|nothing|anything)\b/gi;
    const absolutes = /\b(forever|never|always|everything|anything|anyone|everyone|all|nothing)\b/gi;
    const hungers = /\b(and|also|plus|as well as)\b/gi;
    const numbers = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion)\b/gi;
    const feeling = /\b(love|happy|hate|afraid|scared|lonely|desperate|safe|free|rich|famous|beautiful|powerful|normal)\b/gi;

    score += ((clean.match(detail) || []).length) * 6;
    score += ((clean.match(numbers) || []).length) * 9;
    score += ((clean.match(feeling) || []).length) * 5;
    score += ((clean.match(absolutes) || []).length) * 8;
    score += Math.max(0, ((clean.match(hungers) || []).length) - 1) * 7;
    if (/\b(i wish|i want|i need|i hope|please|make me|let me)\b/i.test(clean)) score += 8;
    if (/\b(willow|branch|wish)\b/i.test(clean)) score += 5;
    if (/[?.!]/.test(clean)) score += 3;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function omenTier(score) {
    if (score >= 84) return 4;
    if (score >= 64) return 3;
    if (score >= 42) return 2;
    if (score >= 18) return 1;
    return 0;
  }

  const OMEN_LABELS = [
    "It has not looked up.",
    "A leaf turns toward you.",
    "The roots are listening.",
    "It is reading between the words.",
    "It has your scent now."
  ];

  function updateOmen() {
    if (!omenMeter) return;
    const score = omenScore(wishInput.value);
    const tier = omenTier(score);
    omenMeter.setAttribute("data-tier", String(tier));
    omenBar.style.width = score + "%";
    omenTrack.setAttribute("aria-valuenow", String(score));
    omenLabel.textContent = OMEN_LABELS[tier];
    if (tier > lastOmenTier && window.WillowAudio) window.WillowAudio.tick();
    lastOmenTier = tier;
  }

  function updateCount() {
    const len = wishInput.value.length;
    $("#charCount").textContent = String(len);
    const counter = $(".field__count");
    counter.classList.toggle("is-near", len > 145 && len < 180);
    counter.classList.toggle("is-full", len >= 180);
    updateOmen();
  }

  wishInput.addEventListener("input", updateCount);

  wishInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      autoBreak();
    }
  });

  $$("#chips button").forEach(function (chip) {
    chip.addEventListener("click", function () {
      wishInput.value = chip.getAttribute("data-wish") || "";
      updateCount();
      wishInput.focus();
      wishInput.setSelectionRange(wishInput.value.length, wishInput.value.length);
    });
  });

  function validWish() {
    const v = wishInput.value.trim();
    if (v.length < 3) {
      nudge(v.length ? "A little more. The willow is old, not psychic." : "Say something. Even a small hunger has weight.");
      wishInput.focus();
      return false;
    }
    return true;
  }

  /* ---------------- hold to break ---------------- */

  function setBend(value) {
    breakBtn.style.setProperty("--bend", String(value));
    breakProgress.style.width = (value * 100).toFixed(1) + "%";
  }

  function holdFrame() {
    if (!holding) return;
    const elapsed = performance.now() - holdStart;
    const p = Math.min(1, elapsed / HOLD_MS);
    holdProgress = p;
    setBend(p);

    if (p < 0.22) breakLabel.textContent = "Hold…";
    else if (p < 0.5) breakLabel.textContent = "It is bending…";
    else if (p < 0.8) breakLabel.textContent = "Almost…";
    else breakLabel.textContent = "Now.";

    if (p >= 1) {
      holding = false;
      completeBreak();
      return;
    }
    holdRAF = window.requestAnimationFrame(holdFrame);
  }

  function beginHold(e) {
    if (hasSnapped || holding) return;
    if (!validWish()) return;
    if (e && e.preventDefault) e.preventDefault();

    holding = true;
    holdStart = performance.now();
    holdProgress = 0;
    breakBtn.classList.add("is-holding");
    body.classList.add("is-holding");

    if (e && e.pointerId !== undefined && breakBtn.setPointerCapture) {
      try { breakBtn.setPointerCapture(e.pointerId); } catch (err) {}
    }
    if (window.WillowAudio && soundOn) window.WillowAudio.bendStart();
    if (navigator.vibrate) navigator.vibrate(8);
    holdFrame();
  }

  function cancelHold() {
    if (!holding) return;
    holding = false;
    window.cancelAnimationFrame(holdRAF);
    breakBtn.classList.remove("is-holding");
    body.classList.remove("is-holding");
    if (window.WillowAudio) window.WillowAudio.bendStop();
    setBend(0);
    breakLabel.textContent = "Hold to break the branch";
    if (holdProgress > 0.16) nudge("The branch remembers being whole.");
    holdProgress = 0;
  }

  breakBtn.addEventListener("pointerdown", beginHold);
  window.addEventListener("pointerup", cancelHold);
  window.addEventListener("pointercancel", cancelHold);
  breakBtn.addEventListener("contextmenu", function (e) { e.preventDefault(); });

  breakBtn.addEventListener("keydown", function (e) {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      beginHold(e);
    }
  });
  breakBtn.addEventListener("keyup", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      cancelHold();
    }
  });

  function autoBreak() {
    if (hasSnapped || !validWish()) return;
    holding = false;
    window.cancelAnimationFrame(holdRAF);
    setBend(1);
    breakLabel.textContent = "Now.";
    if (window.WillowAudio && soundOn) window.WillowAudio.bendStart();
    setTimeout(completeBreak, 260);
  }

  function completeBreak() {
    if (hasSnapped) return;
    hasSnapped = true;
    holding = false;
    cancelAnimationFrame(holdRAF);
    breakBtn.classList.remove("is-holding");
    body.classList.remove("is-holding");
    breakBtn.classList.add("is-snapped");
    breakBtn.disabled = true;
    setBend(1);
    breakLabel.textContent = "The branch is broken.";
    treeWrap.classList.add("is-awake");

    if (window.WillowAudio) {
      window.WillowAudio.bendStop();
      window.WillowAudio.snap();
    }
    if (navigator.vibrate) navigator.vibrate([12, 30, 45]);

    body.classList.add("is-struck");
    flash.classList.remove("is-on");
    void flash.offsetWidth;
    flash.classList.add("is-on");
    setTimeout(function () { body.classList.remove("is-struck"); }, 700);
    setTimeout(function () { flash.classList.remove("is-on"); }, 900);

    if (!REDUCE) {
      const rect = breakBtn.getBoundingClientRect();
      WillowArt.burstLeaves(fallingLeaves, 34, rect.left + rect.width / 2, rect.top + rect.height * 0.38);
    }

    setTimeout(showOracle, REDUCE ? 300 : 620);
  }

  /* ---------------- oracle ---------------- */

  const ORACLE_LINES = [
    "It has heard you.",
    "It is deciding what you meant.",
    "It is deciding what you deserve.",
    "The roots are moving."
  ];

  function hideOracle() {
    clearTimeout(oracleTimer);
    clearInterval(oracleLineTimer);
    oracle.classList.remove("is-on");
    oracle.setAttribute("aria-hidden", "true");
    oracleLine.classList.remove("is-fading");
  }

  function showOracle() {
    oracle.classList.add("is-on");
    oracle.setAttribute("aria-hidden", "false");
    oracleLine.classList.remove("is-fading");
    let index = 0;
    oracleLine.textContent = ORACLE_LINES[0];
    if (window.WillowAudio) window.WillowAudio.whisper();

    clearInterval(oracleLineTimer);
    if (!REDUCE) {
      oracleLineTimer = setInterval(function () {
        index += 1;
        if (index >= ORACLE_LINES.length) return;
        oracleLine.classList.add("is-fading");
        setTimeout(function () {
          oracleLine.textContent = ORACLE_LINES[index];
          oracleLine.classList.remove("is-fading");
        }, 260);
      }, 640);
    }

    clearTimeout(oracleTimer);
    oracleTimer = setTimeout(function () {
      clearInterval(oracleLineTimer);
      oracle.classList.remove("is-on");
      oracle.setAttribute("aria-hidden", "true");
      const record = window.WishEngine.generate(wishInput.value);
      showAnswer(record, { archive: false });
      if (window.WillowAudio) window.WillowAudio.reveal();
    }, REDUCE ? 900 : 2750);
  }

  /* ---------------- answer rendering ---------------- */

  function typeWish(text) {
    clearTimeout(typeTimer);
    const el = $("#answerWish");
    el.textContent = "";
    if (REDUCE) {
      el.textContent = text;
      return;
    }
    const caret = document.createElement("span");
    caret.className = "caret";
    el.appendChild(caret);
    let i = 0;
    (function step() {
      if (i >= text.length) {
        if (caret.parentNode) caret.parentNode.removeChild(caret);
        return;
      }
      const ch = text.charAt(i++);
      caret.insertAdjacentText("beforebegin", ch);
      typeTimer = setTimeout(step, ch === " " ? 12 : 24);
    })();
  }

  function setSectionLabel(section, text) {
    const span = section.querySelector(".section-label span");
    if (span) span.textContent = text;
  }

  function buildObservations(lines) {
    const list = $("#answerObservations");
    list.innerHTML = "";
    if (!lines || !lines.length) {
      list.style.display = "none";
      return;
    }
    list.style.display = "";
    lines.forEach(function (line, i) {
      const li = document.createElement("li");
      li.textContent = line;
      li.style.animationDelay = (0.5 + i * 0.35) + "s";
      list.appendChild(li);
    });
  }

  function buildSpiral(record) {
    const list = $("#spiralList");
    list.innerHTML = "";
    const colors = ["#d8a955", "#c9924e", "#b56b3f", "#8a3940", "#6f3a48"];

    record.twists.forEach(function (twist, i) {
      const li = document.createElement("li");
      li.className = "spiral__item";
      li.style.setProperty("--c", colors[i] || colors[colors.length - 1]);
      li.style.setProperty("--d", (0.15 + i * 0.16) + "s");

      const marker = document.createElement("div");
      marker.className = "spiral__marker";
      const num = document.createElement("span");
      num.textContent = String(i + 1).padStart(2, "0");
      marker.appendChild(num);

      const card = document.createElement("div");
      card.className = "spiral__card";

      const tag = document.createElement("p");
      tag.className = "spiral__tag";
      tag.textContent = twist.tag;

      const title = document.createElement("h3");
      title.textContent = twist.title;

      const text = document.createElement("p");
      text.textContent = twist.text;

      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(text);
      li.appendChild(marker);
      li.appendChild(card);
      list.appendChild(li);

      window.requestAnimationFrame(function () {
        li.classList.add("is-in");
      });
    });
  }

  function buildCascade(record) {
    const treeEl = $("#cascadeTree");
    treeEl.innerHTML = "";
    if (!window.WishExpansion) return;

    const colors = ["#d8a955", "#c9924e", "#b56b3f", "#8a3940"];
    const cascade = window.WishExpansion.cascadeFor(record) || [];

    cascade.forEach(function (branch, i) {
      const article = document.createElement("article");
      article.className = "cascade__branch";
      article.style.setProperty("--c", colors[i] || colors[colors.length - 1]);
      article.style.animationDelay = (0.1 + i * 0.12) + "s";

      const root = document.createElement("div");
      root.className = "cascade__root";

      const index = document.createElement("span");
      index.className = "cascade__index";
      index.textContent = String(i + 1).padStart(2, "0");

      const body = document.createElement("div");
      const tag = document.createElement("p");
      tag.className = "cascade__tag";
      tag.textContent = branch.tag;

      const title = document.createElement("h3");
      title.textContent = branch.title;

      const text = document.createElement("p");
      text.textContent = branch.text;

      body.appendChild(tag);
      body.appendChild(title);
      body.appendChild(text);
      root.appendChild(index);
      root.appendChild(body);
      article.appendChild(root);

      const children = document.createElement("ul");
      children.className = "cascade__children";
      branch.children.forEach(function (line, j) {
        const li = document.createElement("li");
        const splinter = document.createElement("b");
        splinter.textContent = "Splinter " + String(j + 1).padStart(2, "0");
        li.appendChild(splinter);
        li.appendChild(document.createTextNode(line));
        children.appendChild(li);
      });
      article.appendChild(children);
      treeEl.appendChild(article);
    });
  }

  function buildTimeline(record, cascade) {
    const list = $("#consequenceTimeline");
    list.innerHTML = "";
    if (!window.WishExpansion) return;

    const timeline = window.WishExpansion.buildTimeline(record, cascade);
    timeline.forEach(function (point) {
      const li = document.createElement("li");
      li.className = "timeline__item";
      li.setAttribute("data-mood", point.mood);

      const mark = document.createElement("div");
      mark.className = "timeline__mark";
      const num = document.createElement("span");
      num.textContent = point.mark;
      mark.appendChild(num);

      const body = document.createElement("div");
      body.className = "timeline__body";

      const when = document.createElement("p");
      when.className = "timeline__when";
      when.textContent = point.when;

      const title = document.createElement("h3");
      title.textContent = point.title;

      const text = document.createElement("p");
      text.textContent = point.text;

      body.appendChild(when);
      body.appendChild(title);
      body.appendChild(text);

      li.appendChild(mark);
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function buildGentle(record) {
    answer.classList.add("is-gentle");

    const granted = $("#grantedSection");
    setSectionLabel(granted, "A note from outside the story");
    const grantedText = $("#answerGranted");
    grantedText.textContent = record.note[0];
    grantedText.classList.add("gentle-note");

    const twin = $("#answerTwin");
    twin.textContent = record.note[1];
    twin.className = "granted__twin gentle-note";
    twin.style.display = "";

    let extra = document.getElementById("gentleExtra");
    if (!extra) {
      extra = document.createElement("p");
      extra.id = "gentleExtra";
      extra.className = "gentle-note";
      granted.appendChild(extra);
    }
    extra.textContent = record.note[2];
    extra.style.display = "";

    const spiral = $("#spiralSection");
    spiral.style.display = "";
    const head = spiral.querySelector(".section-head");
    head.querySelector("h2").textContent = "If this is you";
    head.querySelector("p").textContent = "Please reach out. These are real, and they are free.";

    const list = $("#spiralList");
    list.innerHTML = "";
    const li = document.createElement("li");
    const wrap = document.createElement("div");
    wrap.className = "resources";
    record.resources.forEach(function (r) {
      const a = document.createElement("a");
      a.href = r.href;
      if (/^https?:/.test(r.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      const name = document.createElement("b");
      name.textContent = r.name;
      const note = document.createElement("span");
      note.textContent = r.note;
      a.appendChild(name);
      a.appendChild(note);
      wrap.appendChild(a);
    });
    li.appendChild(wrap);
    list.appendChild(li);

    const price = $("#priceSection");
    price.style.display = "none";
    $("#inversionSection").style.display = "none";
    $("#cascadeSection").style.display = "none";
    $("#timelineSection").style.display = "none";
    $(".answer__rituals").style.display = "none";
    saveBtn.style.display = "none";

    const written = $("#answerWritten");
    written.style.display = "none";
    $("#answerObservations").style.display = "none";

    const disclaimer = $(".disclaimer");
    disclaimer.innerHTML = "You are more than a story. <span>If you are in immediate danger, please call your local emergency number.</span>";
  }

  /* ---------------- answer rail, progress, reveal ---------------- */

  function clearRevealTimers() {
    revealTimers.forEach(function (timer) { clearTimeout(timer); });
    revealTimers = [];
  }

  function scheduleReveal(el, delay, dark) {
    revealTimers.push(setTimeout(function () {
      if (el) el.classList.add("is-in");
      if (window.WillowAudio && soundOn) window.WillowAudio.section(!!dark);
    }, delay));
  }

  function setSkipDone() {
    if (!answerSkip) return;
    answerSkip.classList.add("is-done");
    answerSkip.setAttribute("aria-hidden", "true");
  }

  function finishReveal(instant) {
    clearTimeout(typeTimer);
    clearRevealTimers();
    if (instant && currentRecord) {
      const wishEl = $("#answerWish");
      if (wishEl) wishEl.textContent = currentRecord.wish;
    }
    ["grantedSection", "inversionSection", "spiralSection", "cascadeSection", "timelineSection", "priceSection"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el && el.style.display !== "none") el.classList.add("is-in");
    });
    revealDone = true;
    setSkipDone();
    if (instant && window.WillowAudio && soundOn) window.WillowAudio.click();
    updateAnswerProgress();
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el || el.style.display === "none") return;
    const top = el.getBoundingClientRect().top - answerScroll.getBoundingClientRect().top + answerScroll.scrollTop - 24;
    try {
      answerScroll.scrollTo({ top: Math.max(0, top), behavior: REDUCE ? "auto" : "smooth" });
    } catch (e) {
      answerScroll.scrollTop = Math.max(0, top);
    }
    if (window.WillowAudio && soundOn) window.WillowAudio.click();
  }

  function updateAnswerProgress() {
    if (!answerProgress || !answerRail) return;
    const max = answerScroll.scrollHeight - answerScroll.clientHeight;
    const pct = max > 20 ? Math.max(0, Math.min(100, (answerScroll.scrollTop / max) * 100)) : 0;
    answerProgress.style.width = pct + "%";

    const top = answerScroll.getBoundingClientRect().top;
    let active = "";
    $$("#answerRail button").forEach(function (btn) {
      const sec = document.getElementById(btn.getAttribute("data-target"));
      if (!sec || sec.style.display === "none") {
        btn.hidden = true;
        return;
      }
      btn.hidden = false;
      const rect = sec.getBoundingClientRect();
      if (rect.top - top <= 150) active = btn.getAttribute("data-target");
    });
    $$("#answerRail button").forEach(function (btn) {
      btn.classList.toggle("is-on", btn.getAttribute("data-target") === active);
    });
  }

  function onAnswerScroll() {
    if (railFrame) return;
    railFrame = window.requestAnimationFrame(function () {
      railFrame = 0;
      updateAnswerProgress();
    });
  }

  function bindAnswerChrome() {
    if (!answerRail || !answerScroll) return;
    $$("#answerRail button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        scrollToSection(btn.getAttribute("data-target"));
      });
    });
    answerScroll.addEventListener("scroll", onAnswerScroll, { passive: true });
    if (answerSkip) {
      answerSkip.addEventListener("click", function () {
        if (revealDone) return;
        finishReveal(true);
      });
    }
  }

  function renderAnswer(record, archive) {
    currentRecord = record;
    isArchiveView = !!archive;
    answer.classList.toggle("is-gentle", record.type === "gentle");
    answer.classList.add("is-on");
    answer.setAttribute("aria-hidden", "false");
    body.classList.add("stage-answer");
    answer.scrollTop = 0;
    answerScroll.scrollTop = 0;
    clearRevealTimers();
    revealDone = false;
    setSoundPanel(false);
    if (answerSkip) {
      answerSkip.classList.remove("is-done");
      answerSkip.removeAttribute("aria-hidden");
    }
    if (answerProgress) answerProgress.style.width = "0%";

    // reset conditional UI
    $("#grantedSection").style.display = "";
    $("#inversionSection").style.display = "";
    $("#spiralSection").style.display = "";
    $("#priceSection").style.display = "";
    $("#cascadeSection").style.display = "";
    $("#timelineSection").style.display = "";
    $(".answer__rituals").style.display = "";
    saveBtn.style.display = "";
    $("#answerGranted").className = "granted__text";
    $("#answerTwin").className = "granted__twin";
    $("#answerTwin").style.display = "";
    const oldExtra = document.getElementById("gentleExtra");
    if (oldExtra) oldExtra.parentNode.removeChild(oldExtra);
    $("#answerHeading").textContent = record.type === "gentle" ? "A different answer" : "The willow answers";
    $("#answerWritten").style.display = "";
    $("#answerObservations").style.display = "";
    $(".spiral__list").style.display = "";
    const spiralHead = $("#spiralSection .section-head");
    spiralHead.querySelector("h2").textContent = "The Spiral";
    spiralHead.querySelector("p").textContent = "Every wish has roots. These are the ones that will find you.";
    answer.querySelector(".disclaimer").innerHTML = "The willow is not real. The pattern is. <span>Written and performed in your browser · nothing leaves this device except what you choose to nominate.</span>";

    typeWish(record.wish);

    const written = $("#answerWritten");
    if (record.secondPerson) {
      written.innerHTML = "";
      const label = document.createElement("b");
      label.textContent = "The willow writes";
      written.appendChild(label);
      written.appendChild(document.createTextNode(record.secondPerson));
      written.classList.add("is-in");
      written.style.display = "";
    } else {
      written.style.display = "none";
      written.classList.remove("is-in");
    }

    buildObservations(record.observations);

    if (window.WillowAudio) {
      const A = window.WillowAudio;
      A.stopHeartbeat();
      A.stopHaunting();
      if (record.type === "wish") {
        const dread = Math.max(0.18, Math.min(1, (record.severity.debt || 70) / 100));
        A.setDread(dread);
        if (soundOn) {
          A.startHeartbeat(dread);
          A.startHaunting();
        }
      } else {
        A.setDread(0.08);
      }
    }

    if (record.type === "gentle") {
      buildGentle(record);
    } else {
      setSectionLabel($("#grantedSection"), "Granted");
      $("#answerGranted").textContent = record.granted;
      $("#answerTwin").textContent = record.twin || "";
      $("#answerTwin").style.display = record.twin ? "" : "none";

      $("#inversionSection").style.display = record.inversion ? "" : "none";
      $("#answerInversion").textContent = record.inversion || "";

      buildSpiral(record);
      buildCascade(record);
      buildTimeline(record);

      $("#answerPrice").textContent = record.price;
      $("#debtValue").textContent = record.severity.debt + "%";
      const pips = $("#debtPips");
      pips.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        const pip = document.createElement("i");
        if (i < record.severity.level) pip.className = "is-on";
        pips.appendChild(pip);
      }
      $("#debtNote").textContent = record.severity.label + " · " + record.severity.cost;

      const tags = $("#answerTags");
      tags.innerHTML = "";
      record.tags.forEach(function (tag) {
        const li = document.createElement("li");
        li.textContent = tag;
        tags.appendChild(li);
      });

      updateSaveButton();

      clearTimeout(autoSaveTimer);
      if (!isArchiveView) {
        autoSaveTimer = setTimeout(function () {
          saveCurrent(false);
        }, 2200);
      }
    }

    // reveal sections
    const granted = $("#grantedSection");
    const inversion = $("#inversionSection");
    const spiral = $("#spiralSection");
    const cascade = $("#cascadeSection");
    const timeline = $("#timelineSection");
    const price = $("#priceSection");
    [granted, inversion, spiral, cascade, timeline, price].forEach(function (el) {
      if (el) el.classList.remove("is-in");
    });

    scheduleReveal(granted, 120, false);
    scheduleReveal(inversion, 420, true);
    scheduleReveal(spiral, 760, true);
    scheduleReveal(cascade, 1080, true);
    scheduleReveal(timeline, 1380, true);
    scheduleReveal(price, 1680, true);
    revealTimers.push(setTimeout(function () {
      revealDone = true;
      setSkipDone();
      updateAnswerProgress();
    }, 2100));

    window.requestAnimationFrame(updateAnswerProgress);
    setTimeout(updateAnswerProgress, 260);

    setTimeout(function () {
      $("#answerClose").focus({ preventScroll: true });
    }, 800);
  }

  function showAnswer(record, opts) {
    if (!record) {
      toast("The willow found nothing to answer. Try again.");
      return;
    }
    renderAnswer(record, opts && opts.archive);
  }

  /* ---------------- saving ---------------- */

  function saveCurrent(announce) {
    if (!currentRecord || currentRecord.type !== "wish") return;
    if (isSaved(currentRecord)) {
      if (announce) toast("It is already hanging in the Hollow.");
      return;
    }
    hollow.unshift(currentRecord);
    if (hollow.length > MAX_HOLLOW) hollow.length = MAX_HOLLOW;
    writeHollow();
    updateHollowCount();
    updateSaveButton();
    if (announce) toast("Hung in the Hollow. It will keep.");
  }

  function updateSaveButton() {
    if (!currentRecord) return;
    if (isSaved(currentRecord)) {
      saveLabel.textContent = "Hung in the Hollow";
      saveBtn.classList.add("is-saved");
    } else {
      saveLabel.textContent = "Hang it in the Hollow";
      saveBtn.classList.remove("is-saved");
    }
  }

  saveBtn.addEventListener("click", function () {
    saveCurrent(true);
  });

  function testimonyText(record) {
    const base = window.WishEngine.toText(record);
    if (!record || record.type !== "wish" || !window.WishExpansion) return base;

    const lines = base.split("\n");
    let closing = "";
    if (lines.length && lines[lines.length - 1].indexOf("— the willow remembers") !== -1) {
      closing = lines.pop();
    }

    const cascade = window.WishExpansion.cascadeFor(record);
    const timeline = window.WishExpansion.buildTimeline(record, cascade);

    lines.push("", "THE CASCADE");
    cascade.forEach(function (branch, i) {
      lines.push("", (i + 1) + ". " + branch.tag + " — " + branch.title, branch.text);
      branch.children.forEach(function (child, j) {
        lines.push("   " + (j + 1) + ") " + child);
      });
    });

    lines.push("", "THE SLOW BURN");
    timeline.forEach(function (point) {
      lines.push("", point.when.toUpperCase() + " — " + point.title, point.text);
    });

    if (closing) lines.push("", closing);
    return lines.join("\n");
  }

  $("#copyWish").addEventListener("click", function () {
    if (!currentRecord) return;
    copyText(testimonyText(currentRecord));
  });

  function copyText(text) {
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      toast("Testimony copied. Keep it somewhere dark.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast("Testimony copied. Keep it somewhere dark.");
      }).catch(fallback);
    } else {
      fallback();
    }
  }

  /* ---------------- closing / resetting ---------------- */

  function closeAnswer(keepWish) {
    clearTimeout(typeTimer);
    clearTimeout(autoSaveTimer);
    clearRevealTimers();
    setSoundPanel(false);
    if (window.WillowAudio) {
      window.WillowAudio.stopHeartbeat();
      window.WillowAudio.stopHaunting();
      window.WillowAudio.setDread(0.12);
    }
    if (currentRecord && currentRecord.type === "wish" && !isArchiveView && !isSaved(currentRecord)) {
      saveCurrent(false);
    }
    answer.classList.remove("is-on");
    answer.setAttribute("aria-hidden", "true");
    body.classList.remove("stage-answer");
    $("#ritual").setAttribute("aria-hidden", body.classList.contains("stage-hero") ? "true" : "false");
    if (!keepWish) {
      // leave the wish in the field so it can be changed
    }
    if (hasSnapped) resetBreakState();
    currentRecord = null;
    isArchiveView = false;
  }

  function resetBreakState() {
    hasSnapped = false;
    holding = false;
    holdProgress = 0;
    cancelAnimationFrame(holdRAF);
    breakBtn.disabled = false;
    breakBtn.classList.remove("is-snapped", "is-holding");
    breakBtn.style.setProperty("--bend", "0");
    breakProgress.style.width = "0%";
    breakLabel.textContent = "Hold to break the branch";
    treeWrap.classList.remove("is-awake");
    body.classList.remove("is-holding");
  }

  function resetRitual(clearWish) {
    resetBreakState();
    if (clearWish) {
      wishInput.value = "";
      updateCount();
      lastOmenTier = 0;
      ritualWarn.classList.remove("is-on");
    }
  }

  $("#answerClose").addEventListener("click", function () { closeAnswer(true); });

  $("#againBtn").addEventListener("click", function () {
    closeAnswer(true);
    resetRitual(true);
    body.classList.remove("stage-answer");
    body.classList.add("stage-ritual");
    setTimeout(function () {
      wishInput.focus({ preventScroll: true });
    }, 500);
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (soundPanel && !soundPanel.hidden) {
        setSoundPanel(false);
      } else if (drawer.classList.contains("is-open")) {
        closeDrawer();
      } else if (answer.classList.contains("is-on")) {
        closeAnswer(true);
      }
    }
  });

  /* ---------------- hollow drawer ---------------- */

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function renderHollow() {
    hollowList.innerHTML = "";
    updateHollowCount();

    if (!hollow.length) {
      const empty = document.createElement("div");
      empty.className = "hollow-empty";
      empty.innerHTML = '<svg aria-hidden="true"><use href="#i-ribbon"/></svg><p>Nothing hangs here yet.<br>Break a branch. The willow will keep the receipt.</p>';
      hollowList.appendChild(empty);
      hollowMeta.textContent = "Nothing hung yet.";
      $("#clearHollow").style.display = "none";
      return;
    }

    $("#clearHollow").style.display = "";
    hollowMeta.textContent = hollow.length + (hollow.length === 1 ? " wish kept" : " wishes kept") + " · on this device";

    hollow.slice().forEach(function (record, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hollow-item";
      btn.style.animation = "none";

      const wish = document.createElement("span");
      wish.className = "hollow-item__wish";
      wish.textContent = record.wish;

      const meta = document.createElement("span");
      meta.className = "hollow-item__meta";
      const date = document.createElement("span");
      date.textContent = formatDate(record.createdAt);
      const sep1 = document.createElement("i");
      const label = document.createElement("b");
      label.textContent = record.label || "WISH";
      const sep2 = document.createElement("i");
      const debt = document.createElement("span");
      debt.textContent = record.severity ? record.severity.debt + "% debt" : "unpriced";

      meta.appendChild(date);
      meta.appendChild(sep1);
      meta.appendChild(label);
      meta.appendChild(sep2);
      meta.appendChild(debt);

      btn.appendChild(wish);
      btn.appendChild(meta);
      btn.addEventListener("click", function () {
        closeDrawer();
        setTimeout(function () {
          showAnswer(record, { archive: true });
          if (window.WillowAudio && soundOn) window.WillowAudio.chime();
        }, 260);
      });
      hollowList.appendChild(btn);
    });
  }

  function openDrawer() {
    renderHollow();
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    scrim.classList.add("is-on");
    $("#hollowBtn").setAttribute("aria-expanded", "true");
    body.classList.add("is-locked");
    setTimeout(function () { $("#hollowClose").focus({ preventScroll: true }); }, 500);
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.classList.remove("is-on");
    $("#hollowBtn").setAttribute("aria-expanded", "false");
    body.classList.remove("is-locked");
    if (!answer.classList.contains("is-on")) {
      $("#hollowBtn").focus({ preventScroll: true });
    }
  }

  $("#hollowBtn").addEventListener("click", openDrawer);
  $("#hollowClose").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);

  $("#clearHollow").addEventListener("click", function () {
    const btn = $("#clearHollow");
    if (!clearArmed) {
      clearArmed = true;
      btn.classList.add("is-armed");
      btn.textContent = "Tap again to forget";
      clearTimeout(clearArmTimer);
      clearArmTimer = setTimeout(function () {
        clearArmed = false;
        btn.classList.remove("is-armed");
        btn.textContent = "Forget them all";
      }, 3200);
      return;
    }
    clearTimeout(clearArmTimer);
    clearArmed = false;
    btn.classList.remove("is-armed");
    btn.textContent = "Forget them all";
    hollow = [];
    writeHollow();
    updateHollowCount();
    renderHollow();
    if (currentRecord) updateSaveButton();
    toast("The Hollow is empty. The willow remembers anyway.");
  });

  /* ---------------- boot ---------------- */

  function bindUiAudio() {
    document.addEventListener("pointerover", function (e) {
      if (!window.WillowAudio) return;
      const hit = e.target.closest && e.target.closest("button, a[href], input[type=range]");
      if (hit) window.WillowAudio.hover();
    }, { passive: true });

    document.addEventListener("click", function (e) {
      if (!window.WillowAudio) return;
      const hit = e.target.closest && e.target.closest("button, a[href]");
      if (hit) window.WillowAudio.click();
    });
  }

  window.WishWillow = {
    getRecord: function () { return currentRecord; },
    toast: toast,
    closeAnswer: closeAnswer
  };

  function boot() {
    buildWorld();
    startCursor();
    initSoundPreference();
    initTimePreference();
    bindAnswerChrome();
    bindUiAudio();

    hollow = readHollow().filter(function (r) {
      return r && typeof r.wish === "string";
    });
    if (!Array.isArray(hollow)) hollow = [];
    updateHollowCount();

    updateCount();
    $("#hollowBtn").setAttribute("aria-expanded", "false");

    // cinematic hint if someone tries to type before entering
    wishInput.addEventListener("focus", function () {
      if (body.classList.contains("stage-hero")) enterGrove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
