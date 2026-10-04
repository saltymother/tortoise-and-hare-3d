/**
 * audio_engine.js - Procedural Web Audio API Sound & Music Synthesizer
 * Provides authentic anime sound effects and adaptive background music:
 * - Cheerful Ghibli-esque forest morning theme
 * - Fast energetic sprint theme
 * - Gentle whimsical nap lullaby
 * - Frantic panic anime chase music
 * - Triumphant victory fanfare & sunset epilogue
 * - Anime SFX: dash whoosh, comedic skid, whistle trill, snore whistle, cheers, footstep taps, magic sparkles
 */

class AnimeAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    this.currentTrack = null;
    this.musicInterval = null;
    this.bgmVolume = 0.35;
    this.sfxVolume = 0.5;

    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Set Master Volume
  setVolume(val) {
    if (!this.masterGain) return;
    this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
  }

  setMusicVolume(val) {
    this.bgmVolume = val;
    if (this.musicGain && this.musicEnabled) {
      this.musicGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = val;
    if (this.sfxGain && this.sfxEnabled) {
      this.sfxGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
    return this.musicEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
    return this.sfxEnabled;
  }

  // --- SOUND EFFECTS ---
  playDashWhoosh() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // Filtered white noise sweep + pitch sine
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.38);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.4);
  }

  playFoxWhistle() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, t);
    osc.frequency.exponentialRampToValueAtTime(2600, t + 0.1);
    osc.frequency.exponentialRampToValueAtTime(2350, t + 0.35);

    mod.frequency.setValueAtTime(30, t); // rapid trill vibrato
    modGain.gain.setValueAtTime(150, t);
    mod.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.4);
    osc.stop(t + 0.4);
  }

  playComedicSkid() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.45);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.45);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  playSnoreZzz() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(440, t + 0.5);
    osc.frequency.linearRampToValueAtTime(280, t + 1.1);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 1.2);
  }

  playTortoiseStep() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  playHareStep() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380 + Math.random() * 60, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.06);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  playAnimeGasp() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // Sharp dramatic stinger chord: E minor high chords
    [659.25, 783.99, 987.77, 1318.51].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, t + 0.1);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.42);
    });
  }

  playVictoryFanfare() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // Royal Anime Victory motif: G4 -> C5 -> E5 -> G5 -> C6!
    const notes = [
      { f: 392.0, delay: 0.0, dur: 0.18 },
      { f: 523.25, delay: 0.18, dur: 0.18 },
      { f: 659.25, delay: 0.36, dur: 0.18 },
      { f: 783.99, delay: 0.54, dur: 0.45 },
      { f: 1046.5, delay: 1.0, dur: 1.2 }
    ];

    notes.forEach((n) => {
      const start = t + n.delay;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(n.f, start);
      osc2.frequency.setValueAtTime(n.f * 1.002, start);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, start);

      gain.gain.setValueAtTime(0.01, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + n.dur + 0.05);
      osc2.stop(start + n.dur + 0.05);
    });

    this.playCrowdCheer();
  }

  playCrowdCheer() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(1.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 2.5);
  }

  playSparkleChime() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const arpeggio = [1046.5, 1318.5, 1567.98, 2093.0];
    arpeggio.forEach((freq, idx) => {
      const start = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(start);
      osc.stop(start + 0.55);
    });
  }

  playBirdChirp() {
    if (!this.sfxEnabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, t);
    osc.frequency.linearRampToValueAtTime(3600, t + 0.04);
    osc.frequency.linearRampToValueAtTime(3100, t + 0.08);
    osc.frequency.linearRampToValueAtTime(3900, t + 0.12);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.09, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  // --- PROCEDURAL ANIME BGM TRACKS ---
  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentTrack = null;
  }

  playMusicForScene(sceneIndex) {
    if (!this.ctx) this.init();
    this.ensureContext();

    let targetTrack = 'morning';
    if (sceneIndex === 0 || sceneIndex === 1) {
      targetTrack = 'morning'; // Peaceful sunny forest & preparation
    } else if (sceneIndex === 2) {
      targetTrack = 'sprint'; // Energetic start dash
    } else if (sceneIndex === 3 || sceneIndex === 4) {
      targetTrack = 'nap'; // Cozy slumber & calm steady journey
    } else if (sceneIndex === 5) {
      targetTrack = 'panic'; // Dramatic awakening & sprint!
    } else if (sceneIndex === 6) {
      targetTrack = 'victory'; // Finish celebration!
    } else if (sceneIndex === 7) {
      targetTrack = 'sunset'; // Nostalgic anime ending & moral
    }

    if (this.currentTrack === targetTrack) return;
    this.stopMusic();
    this.currentTrack = targetTrack;

    if (!this.musicEnabled) return;

    if (targetTrack === 'morning') this._startMorningTheme();
    else if (targetTrack === 'sprint') this._startSprintTheme();
    else if (targetTrack === 'nap') this._startNapLullaby();
    else if (targetTrack === 'panic') this._startPanicTheme();
    else if (targetTrack === 'victory') this._startVictoryTheme();
    else if (targetTrack === 'sunset') this._startSunsetEpilogue();
  }

  _playTone(freq, dur, type = 'triangle', offset = 0, vol = 0.12) {
    if (!this.ctx || !this.musicEnabled) return;
    const t = this.ctx.currentTime + offset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  _startMorningTheme() {
    // Warm G-Major pentatonic Ghibli meadow arpeggio
    // G3, B3, D4, E4, G4, B4, D5
    const scale = [196, 246.94, 293.66, 329.63, 392, 493.88, 587.33, 659.25];
    const bass = [98, 110, 123.47, 146.83];
    let step = 0;

    const playBar = () => {
      if (this.currentTrack !== 'morning') return;
      const root = bass[step % bass.length];
      this._playTone(root, 1.8, 'sine', 0, 0.18); // Gentle bass warmth

      // Melody arpeggios
      const pattern = [0, 2, 4, 3, 5, 4, 2, 1];
      pattern.forEach((pIdx, i) => {
        const f = scale[pIdx % scale.length];
        this._playTone(f, 0.45, 'triangle', i * 0.28, 0.09);
      });

      // Occasional flute chime
      if (step % 2 === 0) {
        this._playTone(scale[5] * 2, 0.8, 'sine', 0.6, 0.05);
      }

      step++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, 2240);
  }

  _startSprintTheme() {
    // Energetic uptempo 140 BPM racing groove in D major
    const dMinor = [146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0];
    let step = 0;

    const playBar = () => {
      if (this.currentTrack !== 'sprint') return;
      // Driving bass line
      const bassRoots = [73.42, 73.42, 87.31, 98.0];
      const r = bassRoots[step % bassRoots.length];
      for (let i = 0; i < 4; i++) {
        this._playTone(r, 0.2, 'sawtooth', i * 0.25, 0.12);
      }

      // Synth brass lead
      const melodyNotes = [
        [293.66, 329.63, 392.0, 440.0],
        [440.0, 392.0, 329.63, 293.66],
        [329.63, 392.0, 440.0, 523.25],
        [587.33, 440.0, 392.0, 293.66]
      ];
      const m = melodyNotes[step % melodyNotes.length];
      m.forEach((note, i) => {
        this._playTone(note, 0.22, 'triangle', i * 0.25, 0.14);
      });

      step++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, 1000);
  }

  _startNapLullaby() {
    // Dreamy, peaceful, slow relaxing tones with warm intervals
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C maj7
      [220.0, 261.63, 329.63, 440.0],  // A min7
      [174.61, 220.0, 261.63, 349.23], // F maj7
      [196.0, 246.94, 293.66, 392.0]   // G7
    ];
    let step = 0;

    const playBar = () => {
      if (this.currentTrack !== 'nap') return;
      const c = chords[step % chords.length];
      c.forEach((f, idx) => {
        this._playTone(f, 2.6, 'sine', idx * 0.35, 0.08);
      });
      step++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, 2800);
  }

  _startPanicTheme() {
    // Frantic anime comic panic! Rising chromatic chords, rapid pulsing 160 BPM
    let step = 0;
    const playBar = () => {
      if (this.currentTrack !== 'panic') return;
      const baseFreq = 220 * Math.pow(1.05946, (step % 6) * 2);
      for (let i = 0; i < 8; i++) {
        const f = i % 2 === 0 ? baseFreq : baseFreq * 1.5;
        this._playTone(f, 0.09, 'sawtooth', i * 0.11, 0.16);
      }
      step++;
    };
    playBar();
    this.musicInterval = setInterval(playBar, 880);
  }

  _startVictoryTheme() {
    // Jubilant celebration theme
    const chords = [
      [261.63, 329.63, 392.0], // C
      [293.66, 369.99, 440.0], // D
      [329.63, 415.3, 493.88], // E
      [392.0, 493.88, 587.33]  // G
    ];
    let step = 0;

    const playBar = () => {
      if (this.currentTrack !== 'victory') return;
      const ch = chords[step % chords.length];
      ch.forEach((f) => {
        this._playTone(f, 0.6, 'triangle', 0, 0.14);
      });
      this._playTone(ch[2] * 2, 0.4, 'sine', 0.2, 0.1);
      step++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, 1200);
  }

  _startSunsetEpilogue() {
    // Deeply moving, nostalgic anime sunset theme (warm Rhodes piano style)
    const prog = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
      [164.81, 196.0, 246.94, 329.63], // Emin7
      [220.0, 261.63, 329.63, 392.0]   // Amin7
    ];
    let step = 0;

    const playBar = () => {
      if (this.currentTrack !== 'sunset') return;
      const c = prog[step % prog.length];
      this._playTone(c[0] / 2, 3.2, 'sine', 0, 0.15); // Warm deep bass
      c.forEach((note, i) => {
        this._playTone(note, 1.6, 'triangle', i * 0.35, 0.08);
      });
      step++;
    };

    playBar();
    this.musicInterval = setInterval(playBar, 3000);
  }
}

window.animeAudioEngine = new AnimeAudioEngine();
