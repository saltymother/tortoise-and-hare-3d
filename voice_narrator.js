/**
 * voice_narrator.js - Anime English Voice Synthesis & Speech Controller
 * Delivers distinct anime-style voice acting in English using Web Speech Synthesis:
 * - Hare: Energetic, cocky, high-pitched anime rival voice
 * - Tortoise: Calm, patient, gentle anime hero voice
 * - Fox: Charismatic, theatrical anime announcer voice
 * - Narrator: Expressive, enchanting anime storybook voice
 * Integrates character mouth-flapping in 3D and real-time subtitle delivery.
 */

class AnimeVoiceNarrator {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.selectedVoice = null;
    this.isMuted = false;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.onCharacterSpeak = null; // callback (speaker, isSpeaking)
    this.onSubtitleUpdate = null; // callback (text, speaker)

    // Character voice profiles with pitch, rate, and volume tuning
    this.profiles = {
      narrator: {
        pitch: 1.06,
        rate: 0.98,
        volume: 1.0,
        name: 'Anime Narrator',
        tag: '📖 Storyteller'
      },
      hare: {
        pitch: 1.42, // High, cocky anime boy/rival pitch
        rate: 1.16, // Fast, energetic cadence
        volume: 1.0,
        name: 'Energetic Hare',
        tag: '🐰 Swift & Proud'
      },
      tortoise: {
        pitch: 0.90, // Calm, grounded, warm
        rate: 0.82, // Deliberate, steady pace
        volume: 1.0,
        name: 'Wise Tortoise',
        tag: '🐢 Calm & Steady'
      },
      fox: {
        pitch: 1.18, // Charismatic theatrical referee
        rate: 1.05,
        volume: 1.0,
        name: 'Fox Referee',
        tag: '🦊 Forest Referee'
      },
      animals: {
        pitch: 1.30,
        rate: 1.10,
        volume: 1.0,
        name: 'Cheering Forest Animals',
        tag: '🐿️ Forest Friends'
      }
    };

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    const updateVoices = () => {
      this.voices = this.synth.getVoices();
      // Filter for English voices
      const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
      
      // Preferred quality voices for anime narration
      const preferred = englishVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        v.name.includes('Victoria') ||
        v.name.includes('Karen') ||
        v.name.includes('Daniel')
      );

      this.selectedVoice = preferred || englishVoices[0] || this.voices[0];
      
      if (this.onVoicesReady) {
        this.onVoicesReady(this.voices);
      }
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  setVoice(voiceURI) {
    const found = this.voices.find(v => v.voiceURI === voiceURI);
    if (found) {
      this.selectedVoice = found;
    }
  }

  speak(text, speaker = 'narrator', onComplete = null) {
    if (!text) {
      if (onComplete) onComplete();
      return;
    }

    // Cancel any current utterance
    this.cancel();

    // Trigger Subtitle
    if (this.onSubtitleUpdate) {
      this.onSubtitleUpdate(text, speaker);
    }

    if (this.isMuted || !this.synth) {
      // If voice is muted or unavailable, still run dialogue animation duration
      const simulatedDuration = Math.max(1200, text.length * 55);
      if (this.onCharacterSpeak) this.onCharacterSpeak(speaker, true);
      setTimeout(() => {
        if (this.onCharacterSpeak) this.onCharacterSpeak(speaker, false);
        if (onComplete) onComplete();
      }, simulatedDuration);
      return;
    }

    // Clean up markdown / quotes for smooth natural speech
    const cleanText = text
      .replace(/[*_#]/g, '')
      .replace(/—/g, ', ')
      .replace(/"/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const profile = this.profiles[speaker] || this.profiles.narrator;

    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = profile.volume;
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    this.isSpeaking = true;
    this.currentUtterance = utterance;

    // Start 3D Character Lip-Sync
    if (this.onCharacterSpeak) {
      this.onCharacterSpeak(speaker, true);
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onCharacterSpeak) {
        this.onCharacterSpeak(speaker, false);
      }
      if (onComplete) onComplete();
    };

    utterance.onerror = (err) => {
      console.warn('Speech error:', err);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.onCharacterSpeak) {
        this.onCharacterSpeak(speaker, false);
      }
      if (onComplete) onComplete();
    };

    // Speak with small safeguard for Chrome SpeechSynthesis timeout bug on long lines
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis speak failed:', e);
      if (onComplete) onComplete();
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    if (this.onCharacterSpeak) {
      this.onCharacterSpeak(null, false);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.cancel();
    }
    return !this.isMuted;
  }

  // Interactive Test Line for Each Character
  testCharacterVoice(speaker) {
    const testLines = {
      hare: "Haha! You really think you can beat me? Look at my speed!",
      tortoise: "Patience and steady steps will always lead to the goal.",
      fox: "Racers, take your positions! Three, two, one, GO!",
      narrator: "Once upon a time in a lush green forest, an unforgettable race began.",
      animals: "Go Tortoise! You can do it! Keep moving forward!"
    };
    this.speak(testLines[speaker] || testLines.narrator, speaker);
  }
}

window.animeVoiceNarrator = new AnimeVoiceNarrator();
