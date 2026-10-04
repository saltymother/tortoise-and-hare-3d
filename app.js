/**
 * app.js - Main Application Orchestrator
 * Integrates Three.js 3D WebGL renderer, OrbitControls, Character rigs,
 * Forest Environment, Anime Voice & Sound Engine, and Story Director.
 */

class TortoiseHareApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.clock = new THREE.Clock();

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.forestEnv = null;
    this.hare = null;
    this.tortoise = null;
    this.fox = null;
    this.director = null;

    this.activeSpeaker = null;
    this.bubbleTimeout = null;

    this.initThree();
    this.initCharacters();
    this.initEnvironment();
    this.initDirector();
    this.initUI();
    this.initAudioIntegration();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x81d4fa);
    this.scene.fog = new THREE.FogExp2(0xb3e5fc, 0.007);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.5,
      300
    );
    this.camera.position.set(-42, 7.8, 13);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera under ground
    this.controls.minDistance = 3;
    this.controls.maxDistance = 100;
    this.controls.target.set(-47, 2.0, 0);
    this.controls.update();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initEnvironment() {
    this.forestEnv = new ForestEnvironment(this.scene);
  }

  initCharacters() {
    // 1. The Energetic Hare
    this.hare = CharacterFactory.createHare();
    this.scene.add(this.hare.group);

    // 2. The Determined Tortoise
    this.tortoise = CharacterFactory.createTortoise();
    this.scene.add(this.tortoise.group);

    // 3. The Clever Fox Referee
    this.fox = CharacterFactory.createFox();
    this.scene.add(this.fox.group);

    // 4. Cheering Forest Spectators
    this.spectatorSquirrel = CharacterFactory.createSpectatorSquirrel();
    this.spectatorSquirrel.group.position.set(-47, 0, 4.5);
    this.spectatorSquirrel.group.rotation.y = -0.4;
    this.scene.add(this.spectatorSquirrel.group);

    this.spectatorBird = CharacterFactory.createSpectatorBird();
    this.spectatorBird.group.position.set(67, 3.8, -3.2); // Perched at oak finish line
    this.scene.add(this.spectatorBird.group);
  }

  initDirector() {
    this.director = new StoryDirector(this);
    // Initial scene setup
    this.director.jumpToScene(0);
  }

  initAudioIntegration() {
    const voice = window.animeVoiceNarrator;
    const audio = window.animeAudioEngine;

    // Lip-Sync Callback
    voice.onCharacterSpeak = (speaker, isSpeaking) => {
      if (this.hare) this.hare.isSpeaking = (speaker === 'hare' && isSpeaking);
      if (this.tortoise) this.tortoise.isSpeaking = (speaker === 'tortoise' && isSpeaking);
      if (this.fox) this.fox.isSpeaking = (speaker === 'fox' && isSpeaking);
      this.activeSpeaker = isSpeaking ? speaker : null;

      if (!isSpeaking) {
        this.hideSpeechBubble();
      }
    };

    // Subtitle & Speech Bubble Dispatch
    voice.onSubtitleUpdate = (text, speaker) => {
      this.updateSubtitles(text, speaker);
      if (speaker === 'hare' || speaker === 'tortoise' || speaker === 'fox') {
        this.showSpeechBubble(text, speaker);
      } else {
        this.hideSpeechBubble();
      }
    };

    // Setup Voice selector in modal
    voice.onVoicesReady = (voices) => {
      const select = document.getElementById('voice-select');
      if (!select) return;
      select.innerHTML = '';
      const enVoices = voices.filter(v => v.lang.startsWith('en'));
      (enVoices.length ? enVoices : voices).forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang})`;
        if (voice.selectedVoice && voice.selectedVoice.voiceURI === v.voiceURI) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    };
  }

  initUI() {
    // Splash Screen Start
    const splash = document.getElementById('splash-overlay');
    const startBtn = document.getElementById('btn-start-experience');
    if (startBtn && splash) {
      startBtn.addEventListener('click', () => {
        splash.classList.add('hidden');
        window.animeAudioEngine.ensureContext();
        if (!this.director.isPlaying) {
          this.director.togglePlayPause();
          const playIcon = document.getElementById('play-icon');
          const playText = document.getElementById('play-text');
          if (playIcon) playIcon.textContent = '⏸️';
          if (playText) playText.textContent = 'Pause';
        }
      });
    }

    // Play/Pause Button
    const playBtn = document.getElementById('btn-play');
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');

    playBtn.addEventListener('click', () => {
      const playing = this.director.togglePlayPause();
      playIcon.textContent = playing ? '⏸️' : '▶️';
      playText.textContent = playing ? 'Pause' : 'Play Story';
    });

    this.onPlaybackStateChange = (playing) => {
      playIcon.textContent = playing ? '⏸️' : '▶️';
      playText.textContent = playing ? 'Pause' : 'Play Story';
    };

    // Restart Button
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.director.jumpToScene(0);
      if (!this.director.isPlaying) {
        this.director.togglePlayPause();
      }
    });

    // Next / Prev Scene Buttons
    document.getElementById('btn-prev-scene').addEventListener('click', () => {
      const prev = Math.max(0, this.director.currentSceneIndex - 1);
      this.director.jumpToScene(prev);
    });

    document.getElementById('btn-next-scene').addEventListener('click', () => {
      const next = Math.min(this.director.scenes.length - 1, this.director.currentSceneIndex + 1);
      this.director.jumpToScene(next);
    });

    // Chapter Pill Buttons
    const pillsRow = document.getElementById('chapter-pills-row');
    pillsRow.innerHTML = '';
    this.director.scenes.forEach((sc, idx) => {
      const btn = document.createElement('button');
      btn.className = `chapter-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = `${sc.badge}: ${sc.title}`;
      btn.addEventListener('click', () => {
        this.director.jumpToScene(idx);
      });
      pillsRow.appendChild(btn);
    });

    this.onSceneChange = (sceneIndex) => {
      const btns = pillsRow.querySelectorAll('.chapter-btn');
      btns.forEach((b, i) => b.classList.toggle('active', i === sceneIndex));
    };

    // Timeline Scrubber Click
    const scrubberTrack = document.getElementById('scrubber-track');
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetScene = Math.min(
        this.director.scenes.length - 1,
        Math.floor(clickRatio * this.director.scenes.length)
      );
      this.director.jumpToScene(targetScene);
    });

    // Progress updates
    const scrubberFill = document.getElementById('scrubber-fill');
    const timeDisplay = document.getElementById('time-display');
    this.onProgressUpdate = (progress, currentSec, totalSec) => {
      scrubberFill.style.width = `${progress * 100}%`;
      const curMin = Math.floor(currentSec / 60);
      const curS = Math.floor(currentSec % 60);
      const totMin = Math.floor(totalSec / 60);
      const totS = Math.floor(totalSec % 60);
      timeDisplay.textContent = `${curMin}:${curS < 10 ? '0' : ''}${curS} / ${totMin}:${totS < 10 ? '0' : ''}${totS}`;
    };

    // Camera Mode Selectors
    const camBtns = document.querySelectorAll('.cam-btn');
    camBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        camBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.cam;
        this.director.setCameraMode(mode);
      });
    });

    // Speed Buttons
    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const spd = parseFloat(btn.dataset.speed);
        this.director.setSpeed(spd);
      });
    });

    // Audio Toggles
    const btnVoice = document.getElementById('btn-toggle-voice');
    btnVoice.addEventListener('click', () => {
      const on = window.animeVoiceNarrator.toggleMute();
      btnVoice.classList.toggle('active', on);
      btnVoice.querySelector('.btn-text').textContent = on ? 'Anime Voice: ON' : 'Anime Voice: OFF';
    });

    const btnBgm = document.getElementById('btn-toggle-bgm');
    btnBgm.addEventListener('click', () => {
      const on = window.animeAudioEngine.toggleMusic();
      btnBgm.classList.toggle('active', on);
      btnBgm.querySelector('.btn-text').textContent = on ? 'BGM: ON' : 'BGM: OFF';
    });

    const btnSfx = document.getElementById('btn-toggle-sfx');
    btnSfx.addEventListener('click', () => {
      const on = window.animeAudioEngine.toggleSfx();
      btnSfx.classList.toggle('active', on);
      btnSfx.querySelector('.btn-text').textContent = on ? 'SFX: ON' : 'SFX: OFF';
    });

    // Voice Modal Open/Close
    const voiceModal = document.getElementById('voice-modal');
    document.getElementById('btn-voice-settings').addEventListener('click', () => {
      voiceModal.classList.add('show');
    });
    document.getElementById('btn-close-voice-modal').addEventListener('click', () => {
      voiceModal.classList.remove('show');
    });

    document.getElementById('voice-select').addEventListener('change', (e) => {
      window.animeVoiceNarrator.setVoice(e.target.value);
    });

    // Voice Test Buttons
    const testBtns = document.querySelectorAll('.char-test-btn');
    testBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const char = btn.dataset.char;
        window.animeAudioEngine.ensureContext();
        window.animeVoiceNarrator.testCharacterVoice(char);
      });
    });

    // Moral Modal
    const moralModal = document.getElementById('moral-modal');
    this.showMoralModal = () => {
      moralModal.classList.add('show');
    };
    document.getElementById('btn-replay-story').addEventListener('click', () => {
      moralModal.classList.remove('show');
      this.director.jumpToScene(0);
      if (!this.director.isPlaying) this.director.togglePlayPause();
    });
    document.getElementById('btn-close-moral').addEventListener('click', () => {
      moralModal.classList.remove('show');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
      } else if (e.code === 'ArrowRight') {
        document.getElementById('btn-next-scene').click();
      } else if (e.code === 'ArrowLeft') {
        document.getElementById('btn-prev-scene').click();
      }
    });
  }

  updateSubtitles(text, speaker) {
    const avatarEl = document.getElementById('subtitle-avatar');
    const nameEl = document.getElementById('subtitle-speaker');
    const lineEl = document.getElementById('subtitle-line');

    const avatars = {
      narrator: '📖',
      hare: '🐰',
      tortoise: '🐢',
      fox: '🦊',
      animals: '🐿️'
    };

    const names = {
      narrator: 'Anime Narrator',
      hare: 'Proud Energetic Hare',
      tortoise: 'Determined Tortoise',
      fox: 'Clever Fox Referee',
      animals: 'Forest Spectators'
    };

    avatarEl.textContent = avatars[speaker] || '📖';
    avatarEl.className = `speaker-avatar ${speaker}`;
    nameEl.textContent = names[speaker] || 'Narrator';
    lineEl.textContent = text;
  }

  showSpeechBubble(text, speaker) {
    const bubble = document.getElementById('manga-bubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.className = `manga-speech-bubble visible ${speaker}`;

    clearTimeout(this.bubbleTimeout);
    this.bubbleTimeout = setTimeout(() => {
      this.hideSpeechBubble();
    }, 4500);
  }

  hideSpeechBubble() {
    const bubble = document.getElementById('manga-bubble');
    if (bubble) {
      bubble.classList.remove('visible');
    }
  }

  updateSpeechBubblePosition() {
    const bubble = document.getElementById('manga-bubble');
    if (!bubble || !bubble.classList.contains('visible') || !this.activeSpeaker) return;

    let targetObj = null;
    let heightOffset = 2.4;

    if (this.activeSpeaker === 'hare') {
      targetObj = this.hare.group;
      heightOffset = (this.hare.state === 'sleeping' ? 1.4 : 2.5);
    } else if (this.activeSpeaker === 'tortoise') {
      targetObj = this.tortoise.group;
      heightOffset = 1.6;
    } else if (this.activeSpeaker === 'fox') {
      targetObj = this.fox.group;
      heightOffset = 2.4;
    }

    if (!targetObj) return;

    const worldPos = new THREE.Vector3();
    targetObj.getWorldPosition(worldPos);
    worldPos.y += heightOffset;

    // Camera view check: hide if behind camera lens
    const toTarget = new THREE.Vector3().subVectors(worldPos, this.camera.position);
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    if (toTarget.dot(camDir) <= 0.1) {
      bubble.style.display = 'none';
      return;
    }

    const v = worldPos.clone().project(this.camera);
    if (v.z > 1.0) {
      bubble.style.display = 'none';
      return;
    }
    bubble.style.display = 'block';

    const screenX = (v.x * 0.5 + 0.5) * window.innerWidth;
    const screenY = (-(v.y * 0.5) + 0.5) * window.innerHeight;

    bubble.style.left = `${screenX}px`;
    bubble.style.top = `${screenY}px`;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate);

    const dt = Math.min(0.1, this.clock.getDelta());

    // Update Environment (butterflies, flowers, clouds, confetti)
    if (this.forestEnv) {
      this.forestEnv.update(dt);
    }

    // Update Characters
    if (this.hare) this.hare.update(dt);
    if (this.tortoise) this.tortoise.update(dt);
    if (this.fox) this.fox.update(dt);
    if (this.spectatorSquirrel) this.spectatorSquirrel.update(this.clock.getElapsedTime());
    if (this.spectatorBird) this.spectatorBird.update(this.clock.getElapsedTime());

    // Update Story Director (story progression, camera track, dialogue)
    if (this.director) {
      this.director.update(dt);
    }

    // Update 3D Speech Bubble screen projection
    this.updateSpeechBubblePosition();

    // Render WebGL frame
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new TortoiseHareApp();
});
