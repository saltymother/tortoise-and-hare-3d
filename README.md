# 🐢 The Tortoise and the Hare 3D — An Animated Anime Story Scene

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://saltymother.github.io/tortoise-and-hare-3d/)

> 🌐 **Live Website**: [https://saltymother.github.io/tortoise-and-hare-3d/](https://saltymother.github.io/tortoise-and-hare-3d/)
> 📂 **GitHub Repository**: [https://github.com/saltymother/tortoise-and-hare-3d](https://github.com/saltymother/tortoise-and-hare-3d)

A cinematic, interactive 3D web experience bringing the classic fable of **The Tortoise and the Hare: The Great Race Through the Forest** to life with vibrant anime aesthetics, English anime voice acting, procedural Ghibli-inspired music, and dynamic camera direction.

---

## 🌟 Highlights & Key Features

### 🎨 Vibrant Anime & Ghibli Aesthetics
- **Cel-Shaded Forest World**: Lush emerald green rolling hills, a winding sandy dirt trail, colorful blooming flowers (hibiscus, daisy, violet, marigold), and animated fluttering 3D butterflies.
- **Dynamic Sky & Day/Sunset Cycle**:
  - *Morning*: Radiant golden sunlight rays (`#fff3e0`), long morning tree shadows, cyan skies (`#81d4fa`).
  - *Midday*: Crisp high sun (`#ffffff`) as the hare snoozes in the shade of the weeping tree.
  - *Sunset Finale*: Warm Makoto Shinkai-style sunset (`#ff7043`, `#f06292`, `#7e57c2`) with long golden shadows as the moral is revealed.
- **Landmarks & Path Obstacles**:
  - Wooden **START** banner and spectator log bleachers.
  - The **Giant Shady Nap Tree** with sprawling roots and mossy resting knoll.
  - Path obstacles: giant tree roots, stepping stones, fallen mossy log, and a glossy muddy puddle.
  - Grand **Ancient Oak Tree Finish Line** with checkered archway, cheering forest creatures (squirrels, birds), and celebratory confetti explosions!

### 🐰🐢 Expressive 3D Animated Characters
- **The Energetic Hare**:
  - Soft warm brown fur with cream chest and pom-pom tail.
  - Big expressive anime eyes with white specular shines and animated mouth flap.
  - Articulated long ears that perk up when cocky, stream backward aerodynamically during sprints, droop relaxed during his nap, and droop down in humble defeat.
  - Animations: Confident idle, explosive sprint with dust puffs, cozy breathing sleep with floating 3D "Zzz" bubbles, anime shock gasp, and comedic skid halt.
- **The Determined Tortoise**:
  - Jade green dome carapace with dark hexagonal markings and golden scalloped rim.
  - Friendly wrinkled head with kind, focused anime eyes.
  - Realistic 4-legged walking gait with rhythmic head bob and shell sway.
  - Triumphant victory pose raising front leg high as cheers erupt!
- **The Clever Fox (Referee)**:
  - Sleek orange coat with white chest ruff, bushy tail, whistle, and pointing paw directing racers toward the oak tree.
- **Spectator Forest Critters**:
  - Bushy-tailed cheering squirrels and bluebirds perched on the oak tree.

### 🎙️ Anime Voice Acting in English
- **Web Speech Synthesis with Character Pitch & Cadence Shaping**:
  - **The Hare**: High-pitched, fast, cocky anime boy/rival voice (*"You're going to race against me? Look at those tiny legs!"*).
  - **The Tortoise**: Calm, grounded, wise anime hero voice (*"Perhaps... but I will keep moving until I reach the end."*).
  - **Fox Referee**: Charismatic, sharp, theatrical announcer voice (*"Ready!... Set!... GO!!"*).
  - **Anime Narrator**: Melodic, enchanting storybook storyteller.
  - **Forest Spectators**: High-spirited cheer crowd (*"Keep going, Tortoise! You're almost there!"*).
- **Interactive Voice Studio**:
  - Test individual character lines on the fly.
  - Choose between available English system voices.
- **Manga Dialogue Balloons & Subtitles**:
  - 2.5D speech bubbles anchored above character heads in 3D space with camera-culling.
  - Lower third anime cinematic subtitle banner with character avatars.

### 🎵 Procedural Web Audio Engine (100% Offline & Reliable)
- **6 Dynamic Anime BGM Themes**:
  1. *Morning in the Green Woods* (Gentle pentatonic harp & soft flute).
  2. *The Great Dash* (Upbeat 140 BPM racing brass groove).
  3. *Siesta Under the Tree* (Mellow Rhodes piano lullaby).
  4. *Panic Sprint!* (Rapid pulsing comic chase theme).
  5. *Slow & Steady Triumph* (Triumphant victory fanfare & crowd roar).
  6. *Sunset & Wisdom* (Warm nostalgic anime epilogue).
- **Authentic Anime SFX**:
  - Sonic dash whoosh, referee whistle trill, cartoon foot skid, snore whistle, sharp anime gasp stinger, footstep taps, and celebratory confetti fanfare.

### 🎬 Camera Director & Playback Controls
- **5 Camera Perspectives**:
  - `🎬 Director Cam`: Automatic cinematic cuts framing the dramatic action.
  - `🐢 Tortoise Cam`: Over-the-shoulder follow cam tracking the tortoise.
  - `🐰 Hare Cam`: High-speed action follow cam on the hare.
  - `🕊️ Bird's Eye`: Top-down panoramic vista of the forest path.
  - `🎮 Free Orbit`: Drag to rotate, pan, and zoom anywhere in the 3D world.
- **Interactive Scrubber & Chapters**:
  - Jump directly to any of the 8 story scenes.
  - Timeline progress bar showing elapsed time and race distance.
  - Playback speed controls (0.5x, 1x, 1.5x, 2x).

---

## 🚀 Quick Start Guide

### Option 1: Run with Python Server (Recommended)
From the project folder, simply run:
```bash
python3 server.py
```
Or use the launcher script:
```bash
./launch.sh
```
This automatically starts a local server on port `8088` and launches Google Chrome to `http://localhost:8088/index.html`.

### Option 2: Open Directly in Browser
You can also open `index.html` directly in any modern browser:
```bash
open index.html
```

---

## ⌨️ Keyboard Shortcuts
- **Spacebar**: Play / Pause Story
- **Right Arrow (`→`)**: Jump to Next Scene
- **Left Arrow (`←`)**: Jump to Previous Scene

---

## 📜 Story Scenes (Chapters)
1. **Scene 1: The Sunny Clearing** — Forest morning atmosphere, animals gather, competitors assemble.
2. **Scene 2: The Challenge & Start** — Hare's mocking laughter, Tortoise's serene response, Fox referee calls "Ready, Set, GO!"
3. **Scene 3: The Explosive Dash** — Hare rockets forward in dust, Tortoise begins steady rhythmic strides.
4. **Scene 4: The Overconfident Nap** — Hare relaxes under the giant shady tree and falls into deep slumber.
5. **Scene 5: Steady Steps & The Overtake** — Tortoise overcomes roots, rocks, and mud, quietly passing the sleeping hare.
6. **Scene 6: Panic Awakening!** — Hare wakes up, gasps in terror seeing the tortoise near the oak tree, sprints in panic!
7. **Scene 7: Finish Line Victory!** — Spectators cheer, Tortoise breaks the ribbon, confetti erupts, Fox raises Tortoise's leg!
8. **Scene 8: Sunset & The Moral** — Twilight sky turns orange-pink, wise words shared: *"Slow and steady wins the race."*
