/**
 * story_director.js - Master Cinematic Story & Animation Choreography
 * Orchestrates the full 8-scene narrative:
 * 1. Morning Clearing & Competitors Assemble
 * 2. The Mocking Challenge & "Ready, Set, GO!"
 * 3. The Explosive Dash
 * 4. The Overconfident Nap Under the Shady Tree
 * 5. Steady Steps & The Silent Overtake
 * 6. The Sudden Awakening & Panic Sprint
 * 7. The Finish Line Victory & Celebration
 * 8. Sunset & The Moral: Slow and Steady Wins the Race
 */

class StoryDirector {
  constructor(app) {
    this.app = app;
    this.sceneEnv = app.forestEnv;
    this.audio = window.animeAudioEngine;
    this.voice = window.animeVoiceNarrator;

    this.hare = app.hare;
    this.tortoise = app.tortoise;
    this.fox = app.fox;
    this.camera = app.camera;

    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.currentSceneIndex = 0;
    this.sceneTime = 0;
    this.totalStoryDuration = 120; // 2 minutes full cinematic run
    this.storyProgress = 0; // 0 to 1

    this.cameraMode = 'director'; // 'director', 'tortoise', 'hare', 'birds_eye', 'orbit'

    // Scene Chapter Definitions
    this.scenes = [
      {
        id: 0,
        title: "The Sunny Clearing",
        badge: "🌅 Scene 1",
        atmosphere: "morning",
        duration: 14.0,
        summary: "Golden sunlight streams through the trees as the competitors assemble."
      },
      {
        id: 1,
        title: "The Challenge & Start",
        badge: "🥊 Scene 2",
        atmosphere: "morning",
        duration: 18.0,
        summary: "The proud hare mocks the tortoise. The fox calls 'Ready, Set, GO!'"
      },
      {
        id: 2,
        title: "The Explosive Dash",
        badge: "💨 Scene 3",
        atmosphere: "morning",
        duration: 12.0,
        summary: "The hare rockets ahead in a cloud of dust. The tortoise steps steadily."
      },
      {
        id: 3,
        title: "The Overconfident Nap",
        badge: "💤 Scene 4",
        atmosphere: "midday",
        duration: 15.0,
        summary: "Feeling victory is assured, the hare curls up for a peaceful nap."
      },
      {
        id: 4,
        title: "The Silent Overtake",
        badge: "🧗 Scene 5",
        atmosphere: "midday",
        duration: 18.0,
        summary: "Overcoming roots, rocks, and mud, the tortoise quietly passes the hare."
      },
      {
        id: 5,
        title: "Panic Awakening!",
        badge: "⚡ Scene 6",
        atmosphere: "midday",
        duration: 15.0,
        summary: "The hare wakes up, gasps in terror, and sprints in desperate panic!"
      },
      {
        id: 6,
        title: "Finish Line Victory!",
        badge: "🏆 Scene 7",
        atmosphere: "midday",
        duration: 18.0,
        summary: "The tortoise crosses the finish line! Confetti erupts as cheers roar."
      },
      {
        id: 7,
        title: "Sunset & The Moral",
        badge: "🌅 Scene 8",
        atmosphere: "sunset",
        duration: 20.0,
        summary: "As twilight paints the sky, the wise moral is revealed: Slow and steady wins the race."
      }
    ];

    this.setupStoryDialogue();
    this.camTargetPos = new THREE.Vector3();
    this.camLookTarget = new THREE.Vector3();
  }

  setupStoryDialogue() {
    // Dialogue lines scheduled at relative scene times
    this.script = {
      0: [
        {
          t: 0.8,
          speaker: 'narrator',
          text: "It was a beautiful, sunny morning in a lush green forest. Golden sunlight streamed through the tall trees, casting long shadows across the dirt path."
        },
        {
          t: 7.2,
          speaker: 'narrator',
          text: "Near the center of the forest stood a small clearing where the animals had gathered to watch an exciting race."
        }
      ],
      1: [
        {
          t: 0.5,
          speaker: 'hare',
          text: "You're going to race against me? Look at those tiny legs! I'll reach the finish line before you even get halfway!",
          action: () => {
            this.hare.state = 'cocky';
          }
        },
        {
          t: 6.2,
          speaker: 'tortoise',
          text: "Perhaps... but I will keep moving until I reach the end.",
          action: () => {
            this.tortoise.state = 'walking';
          }
        },
        {
          t: 10.5,
          speaker: 'fox',
          text: "Competitors, take your positions! Toward the distant oak tree!",
          action: () => {
            this.fox.pointing = true;
          }
        },
        {
          t: 13.8,
          speaker: 'fox',
          text: "Ready!... Set!...",
          action: () => {
            this.hare.state = 'cocky';
          }
        },
        {
          t: 16.5,
          speaker: 'fox',
          text: "GO!!",
          action: () => {
            this.audio.playFoxWhistle();
            this.audio.playDashWhoosh();
            this.fox.pointing = false;
          }
        }
      ],
      2: [
        {
          t: 0.2,
          speaker: 'narrator',
          text: "The hare exploded forward like an arrow, kicking up clouds of dust as he raced down the winding forest path!",
          action: () => {
            this.hare.state = 'sprinting';
            this.tortoise.state = 'walking';
          }
        },
        {
          t: 5.8,
          speaker: 'narrator',
          text: "The tortoise, meanwhile, began his journey with slow, steady steps. One step. Then another. And another."
        }
      ],
      3: [
        {
          t: 0.5,
          speaker: 'hare',
          text: "Haha! This race is already over! That tortoise is so slow, I could take a nap and still win!",
          action: () => {
            this.hare.state = 'cocky';
          }
        },
        {
          t: 6.5,
          speaker: 'narrator',
          text: "Feeling confident that victory was guaranteed, the hare curled up beneath the large shady tree and drifted into a deep sleep.",
          action: () => {
            this.hare.state = 'sleeping';
            this.audio.playSnoreZzz();
          }
        }
      ],
      4: [
        {
          t: 0.6,
          speaker: 'narrator',
          text: "Meanwhile, the tortoise continued his journey. The path curved past bushes, over stones, and wound between enormous tree roots.",
          action: () => {
            this.tortoise.state = 'obstacle';
          }
        },
        {
          t: 8.0,
          speaker: 'narrator',
          text: "Every obstacle slowed him down, but none stopped him. Eventually, he came upon the sleeping hare beneath the tree.",
          action: () => {
            this.tortoise.state = 'walking';
          }
        },
        {
          t: 13.0,
          speaker: 'narrator',
          text: "Without making a sound, the tortoise continued walking, step by step, past the tree and around the next bend."
        }
      ],
      5: [
        {
          t: 0.5,
          speaker: 'hare',
          text: "Yaaawn! That was a wonderful nap! Now, where is that tortoise?",
          action: () => {
            this.hare.state = 'cocky';
          }
        },
        {
          t: 4.8,
          speaker: 'hare',
          text: "WHAT?! He's almost at the finish line?!",
          action: () => {
            this.hare.state = 'shocked';
            this.audio.playAnimeGasp();
          }
        },
        {
          t: 8.2,
          speaker: 'narrator',
          text: "The hare sprang into action, racing faster than ever before! Paws pounding against the earth, ears streaming backward in the wind!",
          action: () => {
            this.hare.state = 'panic_sprint';
            this.audio.playDashWhoosh();
          }
        }
      ],
      6: [
        {
          t: 0.5,
          speaker: 'animals',
          text: "Keep going, Tortoise! You're almost there! Run, run, run!",
          action: () => {
            this.tortoise.state = 'walking';
          }
        },
        {
          t: 5.5,
          speaker: 'narrator',
          text: "At last, the tortoise crossed the finish line! The forest clearing erupted with cheers!",
          action: () => {
            this.tortoise.state = 'victory';
            this.sceneEnv.triggerConfetti();
            this.audio.playVictoryFanfare();
          }
        },
        {
          t: 10.2,
          speaker: 'hare',
          text: "No way... How could I have lost?!",
          action: () => {
            this.hare.state = 'defeated';
            this.audio.playComedicSkid();
          }
        },
        {
          t: 13.5,
          speaker: 'tortoise',
          text: "Being fast is useful, but it doesn't help if you stop moving toward your goal."
        }
      ],
      7: [
        {
          t: 0.8,
          speaker: 'narrator',
          text: "The sun began to set behind the trees, painting the sky in shades of radiant orange and pink.",
          action: () => {
            this.sceneEnv.setAtmosphereTimeOfDay('sunset');
            this.audio.playSparkleChime();
          }
        },
        {
          t: 6.5,
          speaker: 'narrator',
          text: "From that day onward, the hare learned respect, and the tortoise became an inspiration to every animal in the forest."
        },
        {
          t: 12.0,
          speaker: 'narrator',
          text: "Moral of the story: Slow and steady wins the race.",
          action: () => {
            if (this.app.showMoralModal) {
              this.app.showMoralModal();
            }
          }
        }
      ]
    };
  }

  jumpToScene(sceneIndex) {
    if (sceneIndex < 0 || sceneIndex >= this.scenes.length) return;
    this.currentSceneIndex = sceneIndex;
    this.sceneTime = 0;

    const sc = this.scenes[sceneIndex];
    this.sceneEnv.setAtmosphereTimeOfDay(sc.atmosphere);
    this.audio.playMusicForScene(sceneIndex);

    // Reset Dialogue flags for this scene
    if (this.script[sceneIndex]) {
      this.script[sceneIndex].forEach(line => line._spoken = false);
    }

    this.positionCharactersForScene(sceneIndex, 0);

    // Update UI badge & buttons
    if (this.app.onSceneChange) {
      this.app.onSceneChange(sceneIndex);
    }
  }

  positionCharactersForScene(sceneIndex, progress) {
    const curve = this.sceneEnv.pathCurve;

    if (sceneIndex === 0) {
      // Scene 1: Start Clearing
      const startPt = curve.getPointAt(0.04);
      this.hare.group.position.set(startPt.x - 1, 0, startPt.z + 1.2);
      this.hare.group.rotation.y = Math.PI / 2;
      this.hare.state = 'cocky';

      this.tortoise.group.position.set(startPt.x - 1, 0, startPt.z - 1.2);
      this.tortoise.group.rotation.y = Math.PI / 2;
      this.tortoise.state = 'idle';

      this.fox.group.position.set(startPt.x + 2.5, 0, startPt.z - 3.2);
      this.fox.group.rotation.y = -Math.PI / 2.5;
    } else if (sceneIndex === 1) {
      // Scene 2: Face-off at Start Line
      const startPt = curve.getPointAt(0.05);
      this.hare.group.position.set(startPt.x, 0, startPt.z + 1.1);
      this.hare.group.rotation.y = Math.PI / 2;

      this.tortoise.group.position.set(startPt.x, 0, startPt.z - 1.1);
      this.tortoise.group.rotation.y = Math.PI / 2;

      this.fox.group.position.set(startPt.x + 3.0, 0, startPt.z - 2.8);
      this.fox.group.rotation.y = -Math.PI / 2.2;
    } else if (sceneIndex === 2) {
      // Scene 3: The Explosive Dash
      // Hare dashes rapidly from 0.08 to 0.48
      const hareU = 0.08 + progress * 0.40;
      const harePt = curve.getPointAt(hareU);
      const hareTangent = curve.getTangentAt(hareU);
      this.hare.group.position.set(harePt.x, 0, harePt.z + 0.8);
      this.hare.group.rotation.y = Math.atan2(hareTangent.x, hareTangent.z) - Math.PI / 2;
      this.hare.state = 'sprinting';

      // Tortoise steady crawl from 0.05 to 0.12
      const tortU = 0.05 + progress * 0.07;
      const tortPt = curve.getPointAt(tortU);
      const tortTangent = curve.getTangentAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z - 0.8);
      this.tortoise.group.rotation.y = Math.atan2(tortTangent.x, tortTangent.z) - Math.PI / 2;
      this.tortoise.state = 'walking';
    } else if (sceneIndex === 3) {
      // Scene 4: The Overconfident Nap
      // Hare is resting at the Shady Tree (U ~ 0.52)
      this.hare.group.position.set(0.6, 0, -4.2);
      this.hare.group.rotation.y = -0.6;
      this.hare.state = 'sleeping';

      // Tortoise walks from 0.12 to 0.32
      const tortU = 0.12 + progress * 0.20;
      const tortPt = curve.getPointAt(tortU);
      const tortTangent = curve.getTangentAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z);
      this.tortoise.group.rotation.y = Math.atan2(tortTangent.x, tortTangent.z) - Math.PI / 2;
      this.tortoise.state = 'walking';
    } else if (sceneIndex === 4) {
      // Scene 5: Steady Steps & Silent Overtake
      // Hare remains fast asleep under tree
      this.hare.group.position.set(0.6, 0, -4.2);
      this.hare.group.rotation.y = -0.6;
      this.hare.state = 'sleeping';

      // Tortoise steadily walks from 0.35 past the tree (0.52) to 0.68
      const tortU = 0.35 + progress * 0.33;
      const tortPt = curve.getPointAt(tortU);
      const tortTangent = curve.getTangentAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z);
      this.tortoise.group.rotation.y = Math.atan2(tortTangent.x, tortTangent.z) - Math.PI / 2;

      // Obstacle state when in the obstacle zone
      if (tortU > 0.58 && tortU < 0.65) {
        this.tortoise.state = 'obstacle';
      } else {
        this.tortoise.state = 'walking';
      }
    } else if (sceneIndex === 5) {
      // Scene 6: Awakening & Panic Chase!
      // Tortoise is near the distant oak tree (0.80 to 0.94)
      const tortU = 0.78 + progress * 0.16;
      const tortPt = curve.getPointAt(tortU);
      const tortTangent = curve.getTangentAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z);
      this.tortoise.group.rotation.y = Math.atan2(tortTangent.x, tortTangent.z) - Math.PI / 2;
      this.tortoise.state = 'walking';

      if (progress < 0.25) {
        // Hare yawning & wake up
        this.hare.group.position.set(0.6, 0, -4.2);
        this.hare.group.rotation.y = -0.6;
        this.hare.state = 'cocky';
      } else if (progress < 0.45) {
        // Hare gasps in shock!
        this.hare.group.position.set(0.6, 0, -3.8);
        this.hare.group.rotation.y = Math.PI / 2;
        this.hare.state = 'shocked';
      } else {
        // Hare panic sprints from 0.52 to 0.88!
        const hareU = 0.52 + ((progress - 0.45) / 0.55) * 0.36;
        const harePt = curve.getPointAt(hareU);
        const hareTangent = curve.getTangentAt(hareU);
        this.hare.group.position.set(harePt.x, 0, harePt.z + 0.6);
        this.hare.group.rotation.y = Math.atan2(hareTangent.x, hareTangent.z) - Math.PI / 2;
        this.hare.state = 'panic_sprint';
      }
    } else if (sceneIndex === 6) {
      // Scene 7: Finish Line Victory!
      // Tortoise crosses finish line (0.94 to 0.98)
      const tortU = Math.min(0.98, 0.94 + progress * 0.04);
      const tortPt = curve.getPointAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z);
      this.tortoise.group.rotation.y = Math.PI / 2;

      // Fox is at finish celebrating
      this.fox.group.position.set(67, 0, -2.5);
      this.fox.group.rotation.y = -Math.PI / 2.2;

      if (progress < 0.3) {
        // Hare arrives at high speed and skids
        const hareU = 0.88 + progress * 0.08;
        const harePt = curve.getPointAt(hareU);
        this.hare.group.position.set(harePt.x, 0, harePt.z + 1.2);
        this.hare.group.rotation.y = Math.PI / 2;
        this.hare.state = 'panic_sprint';
      } else {
        // Hare skids to halt beyond finish line
        this.hare.group.position.set(68.5, 0, 1.4);
        this.hare.group.rotation.y = -Math.PI / 2;
        this.hare.state = 'defeated';
      }
    } else if (sceneIndex === 7) {
      // Scene 8: Sunset & Moral
      // Tortoise slowly, peacefully continues walking into the sunset
      const tortU = Math.min(1.0, 0.97 + progress * 0.03);
      const tortPt = curve.getPointAt(tortU);
      this.tortoise.group.position.set(tortPt.x, 0, tortPt.z);
      this.tortoise.group.rotation.y = Math.PI / 2;
      this.tortoise.state = 'walking';

      this.hare.group.position.set(66, 0, 1.8);
      this.hare.group.rotation.y = -Math.PI / 2.5;
      this.hare.state = 'defeated';

      this.fox.group.position.set(66, 0, -2.8);
      this.fox.group.rotation.y = -Math.PI / 2.2;
    }
  }

  updateCamera(dt) {
    if (this.cameraMode === 'orbit') return;

    if (this.cameraMode === 'tortoise') {
      const tp = this.tortoise.group.position;
      this.camTargetPos.set(tp.x - 7.5, tp.y + 4.2, tp.z + 4.8);
      this.camLookTarget.set(tp.x + 2, tp.y + 1.8, tp.z);
    } else if (this.cameraMode === 'hare') {
      const hp = this.hare.group.position;
      this.camTargetPos.set(hp.x - 6.5, hp.y + 3.8, hp.z + 4.8);
      this.camLookTarget.set(hp.x + 2, hp.y + 1.8, hp.z);
    } else if (this.cameraMode === 'birds_eye') {
      this.camTargetPos.set(10, 52, 28);
      this.camLookTarget.set(10, 0, 0);
    } else {
      // Cinematic Director Camera: Tailored framing for each scene!
      const idx = this.currentSceneIndex;
      const hp = this.hare.group.position;
      const tp = this.tortoise.group.position;

      if (idx === 0) {
        // Wide establishing pan across morning forest
        const pan = Math.sin(this.sceneTime * 0.15) * 4;
        this.camTargetPos.set(-42 + pan, 7.8, 13);
        this.camLookTarget.set(-47, 2.0, 0);
      } else if (idx === 1) {
        // Dramatic low-angle close face-off elevated
        this.camTargetPos.set(-43.5, 3.2, 5.0);
        this.camLookTarget.set(-47, 1.8, 0);
      } else if (idx === 2) {
        // Dynamic side tracking shot of the explosion sprint
        this.camTargetPos.set(hp.x - 12, 4.8, hp.z + 9.5);
        this.camLookTarget.set(hp.x, 2.0, hp.z);
      } else if (idx === 3) {
        // Cozy orbit around the snoozing hare under weeping branches
        this.camTargetPos.set(hp.x + 4.5, 3.2, hp.z + 6.0);
        this.camLookTarget.set(hp.x, 1.6, hp.z);
      } else if (idx === 4) {
        // Hero shot of the steady tortoise overcoming obstacles & overtaking
        this.camTargetPos.set(tp.x - 5.5, 3.5, tp.z + 5.2);
        this.camLookTarget.set(tp.x + 1.5, 1.6, tp.z);
      } else if (idx === 5) {
        // Anime shock crash zoom & panic chase cam
        if (this.hare.state === 'shocked') {
          this.camTargetPos.set(hp.x + 2.5, 2.4, hp.z + 3.2);
          this.camLookTarget.set(hp.x, 1.8, hp.z);
        } else {
          this.camTargetPos.set(hp.x - 10, 4.8, hp.z + 8.5);
          this.camLookTarget.set(tp.x, 1.8, tp.z);
        }
      } else if (idx === 6) {
        // Finish line triumphal arch angle
        this.camTargetPos.set(59, 4.8, 9.5);
        this.camLookTarget.set(66, 2.2, 0);
      } else if (idx === 7) {
        // Sunset pull-back vista
        this.camTargetPos.set(50, 7.8, 15);
        this.camLookTarget.set(66, 2.0, 0);
      }
    }

    // Smooth camera damping
    this.camera.position.lerp(this.camTargetPos, dt * 3.5);
    this.app.controls.target.lerp(this.camLookTarget, dt * 3.5);
    this.app.controls.update();
  }

  update(dt) {
    if (!this.isPlaying) return;

    const scaledDt = dt * this.playbackSpeed;
    this.sceneTime += scaledDt;

    const currentScene = this.scenes[this.currentSceneIndex];
    const progress = Math.min(1.0, this.sceneTime / currentScene.duration);

    // Update character positions along path
    this.positionCharactersForScene(this.currentSceneIndex, progress);

    // Process Scene Dialogue
    const lines = this.script[this.currentSceneIndex];
    if (lines) {
      lines.forEach(line => {
        if (!line._spoken && this.sceneTime >= line.t) {
          line._spoken = true;
          if (line.action) line.action();
          this.voice.speak(line.text, line.speaker);
        }
      });
    }

    // Scene Transition
    if (this.sceneTime >= currentScene.duration) {
      if (this.currentSceneIndex < this.scenes.length - 1) {
        this.jumpToScene(this.currentSceneIndex + 1);
      } else {
        // Loop or pause at end
        this.isPlaying = false;
        if (this.app.onPlaybackStateChange) {
          this.app.onPlaybackStateChange(false);
        }
      }
    }

    // Update Story Scrubber Bar
    let cumulative = 0;
    for (let i = 0; i < this.currentSceneIndex; i++) {
      cumulative += this.scenes[i].duration;
    }
    cumulative += this.sceneTime;
    const totalStoryTime = this.scenes.reduce((sum, s) => sum + s.duration, 0);
    this.storyProgress = Math.min(1.0, cumulative / totalStoryTime);

    if (this.app.onProgressUpdate) {
      this.app.onProgressUpdate(this.storyProgress, cumulative, totalStoryTime);
    }

    // Camera follow update
    this.updateCamera(dt);
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audio.ensureContext();
      this.audio.playMusicForScene(this.currentSceneIndex);
    }
    return this.isPlaying;
  }

  setSpeed(speed) {
    this.playbackSpeed = speed;
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
  }
}

window.StoryDirector = StoryDirector;
