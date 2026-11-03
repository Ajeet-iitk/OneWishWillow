/* ============================================================
   ONE WISH WILLOW — procedural sound
   Wind, a low drone, chimes, splintering wood, whispers.
   No audio files. Everything is made from oscillators and noise.
   ============================================================ */

(function () {
  "use strict";

  const NOTES = [146.83, 174.61, 196.0, 220.0, 261.63, 293.66, 349.23, 392.0];

  const A = {
    ctx: null,
    master: null,
    fxOut: null,
    musicBus: null,
    reverb: null,
    wet: null,
    musicReverb: null,
    musicWet: null,
    noiseBuffer: null,
    enabled: true,
    started: false,
    musicEnabled: true,
    sfxEnabled: true,
    _volume: 0.72,
    _chimeTimer: null,
    _droneBus: null,
    _holdNodes: null,
    _musicFilter: null,
    _voices: [],
    _chordTimer: null,
    _scoreTimer: null,
    _hauntTimer: null,
    _heartTimer: null,
    _dread: 0,
    _lastHover: 0,

    init: function () {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        this.ctx = new AC();
      } catch (e) {
        return false;
      }

      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(ctx.destination);

      this.fxOut = ctx.createGain();
      this.fxOut.gain.value = this.sfxEnabled ? 1 : 0.0001;
      this.fxOut.connect(this.master);

      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = this.musicEnabled ? 1 : 0.0001;
      this.musicBus.connect(this.master);

      const impulse = this.makeImpulse(3.2, 2.4);

      this.reverb = ctx.createConvolver();
      this.reverb.buffer = impulse;
      this.wet = ctx.createGain();
      this.wet.gain.value = 0.5;
      this.reverb.connect(this.wet);
      this.wet.connect(this.master);

      this.musicReverb = ctx.createConvolver();
      this.musicReverb.buffer = impulse;
      this.musicWet = ctx.createGain();
      this.musicWet.gain.value = 0.55;
      this.musicReverb.connect(this.musicWet);
      this.musicWet.connect(this.musicBus);

      this.noiseBuffer = this.makeNoise(4);
      this.buildWind();
      this.buildDrone();
      this.buildScore();
      return true;
    },

    makeNoise: function (seconds) {
      const ctx = this.ctx;
      const len = Math.floor(ctx.sampleRate * seconds);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      return buf;
    },

    makeImpulse: function (seconds, decay) {
      const ctx = this.ctx;
      const len = Math.floor(ctx.sampleRate * seconds);
      const buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
        }
      }
      return buf;
    },

    send: function (node, amount) {
      if (!this.reverb) return;
      const g = this.ctx.createGain();
      g.gain.value = amount;
      node.connect(g);
      g.connect(this.reverb);
    },

    sendMusic: function (node, amount) {
      if (!this.musicReverb) return;
      const g = this.ctx.createGain();
      g.gain.value = amount;
      node.connect(g);
      g.connect(this.musicReverb);
    },

    ensure: function () {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(function () {});
      }
      return !!this.ctx;
    },

    start: function () {
      if (!this.ensure()) return;
      if (!this.started) {
        this.started = true;
        const now = this.ctx.currentTime;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
        this.master.gain.linearRampToValueAtTime(this.enabled ? this._volume : 0.0001, now + 2.2);
        this.scheduleChime();
        setTimeout(function () { A.chime(); }, 900);
      } else if (this.enabled) {
        this.master.gain.linearRampToValueAtTime(this._volume, this.ctx.currentTime + 0.6);
      }
    },

    setEnabled: function (on) {
      this.enabled = !!on;
      if (!this.ctx) {
        if (this.enabled) this.start();
        return;
      }
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
      this.master.gain.linearRampToValueAtTime(this.enabled ? this._volume : 0.0001, now + 0.5);
      if (this.enabled && !this.started) this.start();
    },

    setVolume: function (value) {
      const v = Math.max(0, Math.min(1, Number(value)));
      this._volume = v;
      if (!this.ctx) return;
      if (!this.enabled) return;
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
      this.master.gain.linearRampToValueAtTime(Math.max(0.0001, v), now + 0.25);
    },

    setMusicEnabled: function (on) {
      this.musicEnabled = !!on;
      if (!this.ctx || !this.musicBus) return;
      const now = this.ctx.currentTime;
      this.musicBus.gain.cancelScheduledValues(now);
      this.musicBus.gain.setValueAtTime(Math.max(this.musicBus.gain.value, 0.0001), now);
      this.musicBus.gain.linearRampToValueAtTime(this.musicEnabled ? 1 : 0.0001, now + 0.6);
    },

    setSfxEnabled: function (on) {
      this.sfxEnabled = !!on;
      if (!this.ctx || !this.fxOut) return;
      const now = this.ctx.currentTime;
      this.fxOut.gain.cancelScheduledValues(now);
      this.fxOut.gain.setValueAtTime(Math.max(this.fxOut.gain.value, 0.0001), now);
      this.fxOut.gain.linearRampToValueAtTime(this.sfxEnabled ? 1 : 0.0001, now + 0.3);
    },

    out: function () {
      return this.fxOut || this.master;
    },

    buildWind: function () {
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 430;
      bp.Q.value = 0.7;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1050;
      lp.Q.value = 0.4;

      const g = ctx.createGain();
      g.gain.value = 0.055;

      src.connect(bp);
      bp.connect(lp);
      lp.connect(g);
      g.connect(this.musicBus);
      this.sendMusic(g, 0.18);
      src.start();

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.055;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 170;
      lfo.connect(lfoGain);
      lfoGain.connect(bp.frequency);
      lfo.start();

      const lfo2 = ctx.createOscillator();
      lfo2.type = "sine";
      lfo2.frequency.value = 0.07;
      const lfo2Gain = ctx.createGain();
      lfo2Gain.gain.value = 0.02;
      lfo2.connect(lfo2Gain);
      lfo2Gain.connect(g.gain);
      lfo2.start();
    },

    buildDrone: function () {
      const ctx = this.ctx;
      const bus = ctx.createGain();
      bus.gain.value = 0.7;
      bus.connect(this.musicBus);
      this.sendMusic(bus, 0.3);
      this._droneBus = bus;

      const freqs = [
        { f: 55, type: "sine", g: 0.022, detune: 0 },
        { f: 82.41, type: "sine", g: 0.011, detune: 4 },
        { f: 110, type: "triangle", g: 0.006, detune: -6 },
        { f: 164.81, type: "sine", g: 0.0035, detune: 7 }
      ];

      freqs.forEach(function (spec) {
        const o = ctx.createOscillator();
        o.type = spec.type;
        o.frequency.value = spec.f;
        o.detune.value = spec.detune;
        const g = ctx.createGain();
        g.gain.value = spec.g;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 420;
        o.connect(g);
        g.connect(lp);
        lp.connect(bus);
        o.start();
      });

      const trem = ctx.createOscillator();
      trem.type = "sine";
      trem.frequency.value = 0.06;
      const tremGain = ctx.createGain();
      tremGain.gain.value = 0.13;
      trem.connect(tremGain);
      tremGain.connect(bus.gain);
      trem.start();
    },

    buildScore: function () {
      const ctx = this.ctx;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 980;
      filter.Q.value = 0.8;
      filter.connect(this.musicBus);
      this._musicFilter = filter;

      const chords = [
        [73.42, 110.0, 146.83, 174.61],
        [58.27, 87.31, 116.54, 146.83],
        [49.0, 73.42, 98.0, 146.83],
        [55.0, 82.41, 110.0, 164.81]
      ];
      const self = this;
      this._voices = chords[0].map(function (freq, i) {
        const o = ctx.createOscillator();
        o.type = i < 2 ? "triangle" : "sine";
        o.frequency.value = freq;
        o.detune.value = [-7, 4, -3, 6][i];
        const g = ctx.createGain();
        g.gain.value = [0.025, 0.02, 0.012, 0.008][i];
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.035 + i * 0.011;
        const lg = ctx.createGain();
        lg.gain.value = [0.008, 0.006, 0.004, 0.003][i];
        lfo.connect(lg);
        lg.connect(g.gain);
        o.connect(g);
        g.connect(filter);
        o.start();
        lfo.start();
        return { o: o, g: g };
      });

      let chord = 0;
      this._chordTimer = setInterval(function () {
        if (!self.ctx || !self.started) return;
        chord = (chord + 1) % chords.length;
        const now = ctx.currentTime;
        chords[chord].forEach(function (freq, i) {
          const voice = self._voices[i];
          if (!voice) return;
          voice.o.frequency.cancelScheduledValues(now);
          voice.o.frequency.setValueAtTime(voice.o.frequency.value, now);
          voice.o.frequency.linearRampToValueAtTime(freq, now + 5.5);
        });
      }, 15000);
    },

    scoreNote: function () {
      if (!this.ctx || !this.enabled || !this.musicEnabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.02;
      const scale = [293.66, 311.13, 349.23, 392.0, 440.0, 523.25, 587.33];
      const f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() < 0.22 ? 0.5 : 1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.023, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 5.2);
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) pan.pan.value = Math.random() * 1.6 - 0.8;
      [1, 2.004].forEach(function (mult, i) {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f * mult;
        const og = ctx.createGain();
        og.gain.value = i ? 0.16 : 0.8;
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + 5.4);
      });
      if (pan) {
        g.connect(pan);
        pan.connect(this.musicBus);
        this.sendMusic(pan, 0.55);
      } else {
        g.connect(this.musicBus);
        this.sendMusic(g, 0.55);
      }
    },

    setDread: function (level) {
      const v = Math.max(0, Math.min(1, Number(level) || 0));
      this._dread = v;
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      if (this._musicFilter) {
        this._musicFilter.frequency.cancelScheduledValues(now);
        this._musicFilter.frequency.setValueAtTime(this._musicFilter.frequency.value, now);
        this._musicFilter.frequency.linearRampToValueAtTime(1080 - v * 620, now + 0.8);
      }
      if (this._droneBus) {
        this._droneBus.gain.cancelScheduledValues(now);
        this._droneBus.gain.setValueAtTime(this._droneBus.gain.value, now);
        this._droneBus.gain.linearRampToValueAtTime(0.66 + v * 0.42, now + 0.8);
      }
    },

    heartbeat: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.01;
      [0, 0.17].forEach(function (offset, i) {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.setValueAtTime(62, t + offset);
        o.frequency.exponentialRampToValueAtTime(33, t + offset + 0.19);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t + offset);
        g.gain.linearRampToValueAtTime(i ? 0.045 : 0.075, t + offset + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.28);
        o.connect(g);
        g.connect(A.out());
        A.send(g, 0.2);
        o.start(t + offset);
        o.stop(t + offset + 0.34);
      });
    },

    startHeartbeat: function (level) {
      this.stopHeartbeat();
      if (!this.ctx) return;
      this.setDread(level == null ? this._dread : level);
      const self = this;
      (function beat() {
        if (!self.ctx || !self.enabled) return;
        self.heartbeat();
        const gap = 1450 - self._dread * 580;
        self._heartTimer = setTimeout(beat, gap);
      })();
    },

    stopHeartbeat: function () {
      clearTimeout(this._heartTimer);
      this._heartTimer = null;
    },

    startHaunting: function () {
      if (!this.ctx || this._hauntTimer) return;
      const self = this;
      (function haunt() {
        if (!self.ctx || !self.enabled) return;
        if (Math.random() < 0.62) self.whisper();
        else self.creak();
        self._hauntTimer = setTimeout(haunt, 9000 + Math.random() * 13000);
      })();
    },

    stopHaunting: function () {
      clearTimeout(this._hauntTimer);
      this._hauntTimer = null;
    },

    riser: function (seconds) {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const ctx = this.ctx;
      const dur = Math.max(0.8, seconds || 2.2);
      const t = ctx.currentTime + 0.01;

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(180, t);
      bp.frequency.exponentialRampToValueAtTime(3200, t + dur);
      bp.Q.value = 1.4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.09, t + dur * 0.86);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.out());
      this.send(g, 0.7);
      src.start(t);
      src.stop(t + dur + 0.1);

      const sub = ctx.createOscillator();
      sub.type = "sine";
      sub.frequency.setValueAtTime(34, t);
      sub.frequency.exponentialRampToValueAtTime(58, t + dur);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t);
      sg.gain.linearRampToValueAtTime(0.055, t + dur * 0.8);
      sg.gain.linearRampToValueAtTime(0.0001, t + dur);
      sub.connect(sg);
      sg.connect(this.out());
      sub.start(t);
      sub.stop(t + dur + 0.1);
    },

    click: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.005;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(440, t);
      o.frequency.exponentialRampToValueAtTime(280, t + 0.045);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.032, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      o.connect(g);
      g.connect(this.out());
      o.start(t);
      o.stop(t + 0.08);
    },

    hover: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const now = this.ctx.currentTime;
      if (now - this._lastHover < 0.09) return;
      this._lastHover = now;
      const t = now + 0.005;
      const o = this.ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(1180, t);
      o.frequency.exponentialRampToValueAtTime(900, t + 0.035);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.009, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g);
      g.connect(this.out());
      o.start(t);
      o.stop(t + 0.06);
    },

    tick: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const t = this.ctx.currentTime + 0.005;
      const o = this.ctx.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(1320, t);
      o.frequency.exponentialRampToValueAtTime(980, t + 0.03);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      o.connect(g);
      g.connect(this.out());
      o.start(t);
      o.stop(t + 0.07);
    },

    splinter: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const t = this.ctx.currentTime + 0.005;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(2600, t);
      bp.frequency.exponentialRampToValueAtTime(900, t + 0.06);
      bp.Q.value = 2.4;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.out());
      this.send(g, 0.3);
      src.start(t);
      src.stop(t + 0.1);
    },

    section: function (dark) {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const t = this.ctx.currentTime + 0.01;
      const f = dark ? 98 : 146.83;
      [1, 1.5, 2.01].forEach(function (mult, i) {
        const o = A.ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f * mult;
        const g = A.ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime([0.035, 0.016, 0.008][i], t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
        o.connect(g);
        g.connect(A.out());
        A.send(g, 0.6);
        o.start(t);
        o.stop(t + 3);
      });
    },

    verdict: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.01;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(92, t);
      o.frequency.exponentialRampToValueAtTime(28, t + 1.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.24, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      o.connect(g);
      g.connect(this.out());
      this.send(g, 0.5);
      o.start(t);
      o.stop(t + 1.6);
      this.section(true);
    },

    error: function () {
      if (!this.ctx || !this.enabled || !this.sfxEnabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.01;
      [80, 84.5].forEach(function (f) {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.023, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
        o.connect(g);
        g.connect(A.out());
        o.start(t);
        o.stop(t + 0.36);
      });
    },

    scheduleChime: function () {
      const self = this;
      clearTimeout(this._chimeTimer);
      const wait = 8000 + Math.random() * 10000;
      this._chimeTimer = setTimeout(function () {
        if (self.enabled) self.scoreNote();
        self.scheduleChime();
      }, wait);
    },

    chime: function (hard) {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.02;
      const f = NOTES[Math.floor(Math.random() * NOTES.length)] * (hard ? 0.5 : 1);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(hard ? 0.16 : 0.075, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (hard ? 6 : 4));

      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) pan.pan.value = Math.random() * 1.4 - 0.7;

      [1, 2.005, 3.01].forEach(function (mult, i) {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = f * mult;
        const og = ctx.createGain();
        og.gain.value = [0.7, 0.22, 0.08][i];
        o.connect(og);
        og.connect(g);
        o.start(t);
        o.stop(t + 7);
      });

      if (pan) {
        g.connect(pan);
        pan.connect(this.out());
        this.send(pan, 0.7);
      } else {
        g.connect(this.out());
        this.send(g, 0.7);
      }
    },

    snapshot: null,

    snap: function () {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.01;

      // low thud
      const thud = ctx.createOscillator();
      thud.type = "sine";
      thud.frequency.setValueAtTime(155, t);
      thud.frequency.exponentialRampToValueAtTime(38, t + 0.52);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0.0001, t);
      tg.gain.linearRampToValueAtTime(0.42, t + 0.006);
      tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
      thud.connect(tg);
      tg.connect(this.out());
      this.send(tg, 0.4);
      thud.start(t);
      thud.stop(t + 0.7);

      // wooden crack
      for (let i = 0; i < 3; i++) {
        const dt = t + i * 0.045 + Math.random() * 0.02;
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(3000 - i * 500, dt);
        bp.frequency.exponentialRampToValueAtTime(700, dt + 0.12);
        bp.Q.value = 1.1;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.0001, dt);
        ng.gain.linearRampToValueAtTime(0.5 - i * 0.1, dt + 0.004);
        ng.gain.exponentialRampToValueAtTime(0.0001, dt + 0.16);
        src.connect(bp);
        bp.connect(ng);
        ng.connect(this.out());
        this.send(ng, 0.45);
        src.start(dt);
        src.stop(dt + 0.2);
      }

      // splinter click
      const click = ctx.createOscillator();
      click.type = "square";
      click.frequency.setValueAtTime(3400, t);
      click.frequency.exponentialRampToValueAtTime(900, t + 0.04);
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t);
      cg.gain.linearRampToValueAtTime(0.07, t + 0.002);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      click.connect(cg);
      cg.connect(this.out());
      click.start(t);
      click.stop(t + 0.07);

      // falling leaves of sound
      const self = this;
      setTimeout(function () {
        if (self.enabled) self.chime();
      }, 420);
    },

    whisper: function () {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.02;

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      src.loop = true;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(700, t);
      bp.frequency.linearRampToValueAtTime(1700, t + 0.9);
      bp.frequency.linearRampToValueAtTime(600, t + 2.2);
      bp.Q.value = 3.2;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      // irregular syllable-like pulses
      let at = t + 0.1;
      while (at < t + 2.2) {
        const amp = 0.03 + Math.random() * 0.05;
        g.gain.linearRampToValueAtTime(amp, at + 0.04);
        g.gain.linearRampToValueAtTime(0.004, at + 0.09 + Math.random() * 0.1);
        at += 0.14 + Math.random() * 0.16;
      }
      g.gain.linearRampToValueAtTime(0.0001, t + 2.45);

      src.connect(bp);
      bp.connect(g);
      g.connect(this.out());
      this.send(g, 0.9);
      src.start(t);
      src.stop(t + 2.6);
    },

    reveal: function () {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime + 0.02;

      // reverse swell
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(500, t);
      bp.frequency.exponentialRampToValueAtTime(2600, t + 1.3);
      bp.Q.value = 1.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.055, t + 1.25);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.34);
      src.connect(bp);
      bp.connect(g);
      g.connect(this.out());
      this.send(g, 0.6);
      src.start(t);
      src.stop(t + 1.4);

      this.chime(true);
    },

    creak: function () {
      if (!this.ctx || !this.enabled) return;
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(62, t);
      o.frequency.linearRampToValueAtTime(94, t + 0.35);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 320;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.02, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(lp);
      lp.connect(g);
      g.connect(this.out());
      this.send(g, 0.5);
      o.start(t);
      o.stop(t + 0.45);
    },

    bendStart: function () {
      if (!this.ensure() || this._holdNodes) return;
      const ctx = this.ctx;
      const t = ctx.currentTime;

      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(54, t);
      o.frequency.linearRampToValueAtTime(76, t + 1.1);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 260;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.018, t + 0.4);

      o.connect(lp);
      lp.connect(g);
      g.connect(this.out());
      this.send(g, 0.4);
      o.start(t);
      this._holdNodes = { o: o, g: g };
    },

    bendStop: function (snapped) {
      if (!this._holdNodes) return;
      const ctx = this.ctx;
      const t = ctx.currentTime;
      const nodes = this._holdNodes;
      this._holdNodes = null;
      try {
        nodes.g.gain.cancelScheduledValues(t);
        nodes.g.gain.setValueAtTime(Math.max(nodes.g.gain.value, 0.0001), t);
        nodes.g.gain.exponentialRampToValueAtTime(0.0001, t + (snapped ? 0.06 : 0.3));
        nodes.o.stop(t + (snapped ? 0.1 : 0.35));
      } catch (e) {}
      if (snapped) this.snap();
    }
  };

  window.WillowAudio = A;
})();
