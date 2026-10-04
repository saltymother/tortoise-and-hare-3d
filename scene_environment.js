/**
 * scene_environment.js - 3D Lush Anime Forest Environment (Three.js)
 * Implements:
 * - Winding dirt trail via CatmullRomCurve3 spline
 * - Start line clearing with wooden banners and spectator stands
 * - Grand Ancient Oak Tree finish line with victory ribbons
 * - The Giant Shady Nap Tree with cool shade
 * - Path obstacles: giant tree roots, round stepping stones, fallen branch, muddy puddle
 * - Vibrant stylized trees, swaying flowers, fluttering 3D butterflies, sunbeams, clouds
 * - Dynamic lighting system (Golden Morning -> Bright Midday -> Radiant Sunset)
 * - Confetti celebration particle system
 */

class ForestEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.butterflies = [];
    this.flowers = [];
    this.confettiParticles = [];
    this.confettiActive = false;
    this.time = 0;

    this.sunLight = null;
    this.hemiLight = null;
    this.sunbeams = null;

    // Define the Winding Forest Path Spline (70 units long)
    this.pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-55, 0, 0),      // 0.00: Start Clearing
      new THREE.Vector3(-45, 0, -2),     // 0.14: Past Start Line
      new THREE.Vector3(-30, 0, 5),      // 0.35: Flower Meadow
      new THREE.Vector3(-10, 0, -5),     // 0.50: Approaching Shady Tree
      new THREE.Vector3(0, 0, -4),       // 0.58: The Shady Nap Tree
      new THREE.Vector3(15, 0, 6),       // 0.68: Obstacle Zone (roots, branch, puddle)
      new THREE.Vector3(35, 0, -3),      // 0.82: Climbing Forest Slope
      new THREE.Vector3(50, 0, 2),       // 0.90: Approaching Finish
      new THREE.Vector3(65, 0, 0),       // 0.98: Finish Line at Grand Oak
      new THREE.Vector3(72, 0, 0)        // 1.00: Beyond Finish
    ]);

    this.napSpotPosition = new THREE.Vector3(0, 0, -4);
    this.finishLinePosition = new THREE.Vector3(65, 0, 0);
    this.startLinePosition = new THREE.Vector3(-48, 0, -1);

    this.buildWorld();
  }

  buildWorld() {
    this.setupLighting();
    this.createTerrainAndPath();
    this.createStartLine();
    this.createFinishLine();
    this.createShadyNapTree();
    this.createObstacles();
    this.populateForestTrees();
    this.populateFlowersAndFlora();
    this.createButterflies();
    this.createClouds();
    this.createConfettiSystem();
  }

  // --- DYNAMIC LIGHTING & SUNBEAMS ---
  setupLighting() {
    // Hemisphere light for vibrant anime ambient bounce
    this.hemiLight = new THREE.HemisphereLight(0x90caf9, 0x4caf50, 0.75);
    this.hemiLight.position.set(0, 50, 0);
    this.scene.add(this.hemiLight);

    // Directional Golden Sun
    this.sunLight = new THREE.DirectionalLight(0xfff3e0, 1.3);
    this.sunLight.position.set(-30, 45, 25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 160;
    this.sunLight.shadow.camera.left = -60;
    this.sunLight.shadow.camera.right = 70;
    this.sunLight.shadow.camera.top = 40;
    this.sunLight.shadow.camera.bottom = -40;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);

    // Soft Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Volumetric anime sunbeam cylinders
    this.createSunbeams();
  }

  createSunbeams() {
    const beamGeo = new THREE.CylinderGeometry(0.8, 3.5, 30, 12, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfff9c4,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sunbeams = new THREE.Group();
    const beamPositions = [
      new THREE.Vector3(-45, 14, -5),
      new THREE.Vector3(-25, 14, 8),
      new THREE.Vector3(2, 14, -8),
      new THREE.Vector3(30, 14, -6),
      new THREE.Vector3(60, 14, 6)
    ];

    beamPositions.forEach((pos) => {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos);
      beam.rotation.z = -0.4;
      beam.rotation.x = 0.25;
      this.sunbeams.add(beam);
    });

    this.scene.add(this.sunbeams);
  }

  setAtmosphereTimeOfDay(stage) {
    // stage: 'morning', 'midday', 'sunset'
    if (stage === 'morning') {
      this.scene.background = new THREE.Color(0x81d4fa); // Sunny morning blue
      this.scene.fog = new THREE.FogExp2(0xb3e5fc, 0.007);
      this.sunLight.color.setHex(0xfff3e0);
      this.sunLight.intensity = 1.35;
      this.sunLight.position.set(-30, 40, 25);
      this.hemiLight.color.setHex(0xbbdefb);
      this.hemiLight.groundColor.setHex(0x4caf50);
      if (this.sunbeams) this.sunbeams.visible = true;
    } else if (stage === 'midday') {
      this.scene.background = new THREE.Color(0x4fc3f7); // Crisp bright midday sky
      this.scene.fog = new THREE.FogExp2(0x81d4fa, 0.006);
      this.sunLight.color.setHex(0xffffff);
      this.sunLight.intensity = 1.5;
      this.sunLight.position.set(10, 55, 10);
      this.hemiLight.color.setHex(0xe1f5fe);
      this.hemiLight.groundColor.setHex(0x66bb6a);
      if (this.sunbeams) this.sunbeams.visible = true;
    } else if (stage === 'sunset') {
      // Magnificent Anime Sunset (Makoto Shinkai / Ghibli style)
      this.scene.background = new THREE.Color(0xff8a65); // Warm orange-pink
      this.scene.fog = new THREE.FogExp2(0xf06292, 0.008);
      this.sunLight.color.setHex(0xff7043);
      this.sunLight.intensity = 1.6;
      this.sunLight.position.set(65, 18, -35); // Low sunset angle
      this.hemiLight.color.setHex(0xffb74d);
      this.hemiLight.groundColor.setHex(0x6a1b9a); // Purple shadowed ground bounce
      if (this.sunbeams) this.sunbeams.visible = false;
    }
  }

  // --- TERRAIN & WINDING DIRT TRAIL ---
  createTerrainAndPath() {
    // Lush Green Ground
    const groundGeo = new THREE.PlaneGeometry(170, 100, 64, 48);
    groundGeo.rotateX(-Math.PI / 2);

    // Add gentle rolling hill elevations
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Distance to trail
      const t = Math.max(0, Math.min(1, (x + 55) / 125));
      const ptOnCurve = this.pathCurve.getPointAt(t);
      const distToPath = Math.hypot(x - ptOnCurve.x, z - ptOnCurve.z);

      let elevation = 0;
      // Flatter along path, undulating rolling hills further out
      if (distToPath > 6) {
        elevation = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.2 +
                    Math.sin(x * 0.03 + z * 0.05) * 3.5;
      }
      posAttr.setY(i, elevation);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshToonMaterial({
      color: 0x43a047,
      roughness: 0.8
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Winding Dirt Trail Mesh
    const points = this.pathCurve.getPoints(120);
    const pathShape = new THREE.Shape();
    pathShape.moveTo(-2.2, 0);
    pathShape.lineTo(2.2, 0);
    pathShape.lineTo(2.2, 0.08);
    pathShape.lineTo(-2.2, 0.08);
    pathShape.closePath();

    // Custom Extruded Flat Trail Ribbon
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = [];
    const trailUvs = [];

    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const nextPt = points[Math.min(points.length - 1, i + 1)];
      const tangent = new THREE.Vector3().subVectors(nextPt, pt).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const width = 2.4;
      const left = new THREE.Vector3().addVectors(pt, normal.clone().multiplyScalar(width));
      const right = new THREE.Vector3().addVectors(pt, normal.clone().multiplyScalar(-width));

      trailPositions.push(left.x, 0.04, left.z);
      trailPositions.push(right.x, 0.04, right.z);

      const u = i / (points.length - 1);
      trailUvs.push(u, 0);
      trailUvs.push(u, 1);
    }

    const trailIndices = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      trailIndices.push(a, b, c);
      trailIndices.push(b, d, c);
    }

    trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('uv', new THREE.Float32BufferAttribute(trailUvs, 2));
    trailGeo.setIndex(trailIndices);
    trailGeo.computeVertexNormals();

    const trailMat = new THREE.MeshToonMaterial({
      color: 0xd7ccc8, // Warm sandy dirt path
      roughness: 0.9
    });

    const trailMesh = new THREE.Mesh(trailGeo, trailMat);
    trailMesh.receiveShadow = true;
    this.scene.add(trailMesh);
  }

  // --- START LINE CLEARING ---
  createStartLine() {
    const startGroup = new THREE.Group();
    startGroup.position.set(-48, 0, -1);

    const woodMat = new THREE.MeshToonMaterial({ color: 0x8d6e63 });
    const bannerMat = new THREE.MeshBasicMaterial({ color: 0xef5350 });
    const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Wooden Posts on each side of the path
    const postGeo = new THREE.CylinderGeometry(0.2, 0.25, 4.5, 8);
    const postL = new THREE.Mesh(postGeo, woodMat);
    postL.position.set(0, 2.2, 3.2);
    postL.castShadow = true;
    startGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, woodMat);
    postR.position.set(0, 2.2, -3.2);
    postR.castShadow = true;
    startGroup.add(postR);

    // Crossbeam
    const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.8, 8);
    beamGeo.rotateX(Math.PI / 2);
    const beam = new THREE.Mesh(beamGeo, woodMat);
    beam.position.set(0, 4.2, 0);
    startGroup.add(beam);

    // START Banner Flag
    const bannerGeo = new THREE.PlaneGeometry(4.8, 1.2);
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 3.5, 0);
    banner.rotation.y = Math.PI / 2;
    startGroup.add(banner);

    // Start Line chalk marking on ground
    const lineGeo = new THREE.PlaneGeometry(0.4, 5.8);
    lineGeo.rotateX(-Math.PI / 2);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.set(0, 0.06, 0);
    startGroup.add(line);

    // Spectator Logs & Stands
    const logGeo = new THREE.CylinderGeometry(0.35, 0.35, 4.5, 8);
    logGeo.rotateZ(Math.PI / 2);
    const logL = new THREE.Mesh(logGeo, woodMat);
    logL.position.set(-2, 0.3, 5.5);
    logL.rotation.y = 0.2;
    startGroup.add(logL);

    const logR = new THREE.Mesh(logGeo, woodMat);
    logR.position.set(-2, 0.3, -5.5);
    logR.rotation.y = -0.2;
    startGroup.add(logR);

    this.scene.add(startGroup);
  }

  // --- FINISH LINE & GRAND OAK TREE ---
  createFinishLine() {
    const finishGroup = new THREE.Group();
    finishGroup.position.set(65, 0, 0);

    const woodMat = new THREE.MeshToonMaterial({ color: 0x5d4037 });
    const ribbonGold = new THREE.MeshBasicMaterial({ color: 0xffd54f });
    const checkMat = new THREE.MeshBasicMaterial({ color: 0x263238 });

    // The Grand Ancient Oak Tree (Marks the Finish Line!)
    const oakGroup = new THREE.Group();
    oakGroup.position.set(4, 0, -4);

    // Massive gnarly oak trunk
    const trunkGeo = new THREE.CylinderGeometry(1.6, 2.8, 9, 14);
    const trunk = new THREE.Mesh(trunkGeo, woodMat);
    trunk.position.y = 4.5;
    trunk.castShadow = true;
    oakGroup.add(trunk);

    // Spreading Oak Foliage Canopies (fluffy layered spheres)
    const foliageMat = new THREE.MeshToonMaterial({ color: 0x2e7d32, roughness: 0.6 });
    const foliagePositions = [
      new THREE.Vector3(0, 8.5, 0),
      new THREE.Vector3(-2.5, 7.5, 1.8),
      new THREE.Vector3(2.8, 8.0, -1.5),
      new THREE.Vector3(-1.8, 9.2, -2.0),
      new THREE.Vector3(2.2, 9.5, 1.6),
      new THREE.Vector3(0, 11.0, 0)
    ];

    foliagePositions.forEach((pos, idx) => {
      const geo = new THREE.SphereGeometry(3.2 - idx * 0.2, 12, 12);
      const leaf = new THREE.Mesh(geo, foliageMat);
      leaf.position.copy(pos);
      leaf.castShadow = true;
      oakGroup.add(leaf);
    });

    finishGroup.add(oakGroup);

    // Checkered Finish Gate Arch
    const postGeo = new THREE.CylinderGeometry(0.25, 0.3, 5.5, 8);
    const postL = new THREE.Mesh(postGeo, woodMat);
    postL.position.set(0, 2.7, 3.2);
    postL.castShadow = true;
    finishGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, woodMat);
    postR.position.set(0, 2.7, -3.2);
    postR.castShadow = true;
    finishGroup.add(postR);

    // Finish Ribbon Banner
    const ribbonGeo = new THREE.PlaneGeometry(6.4, 0.9);
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonGold);
    ribbon.position.set(0, 4.4, 0);
    ribbon.rotation.y = Math.PI / 2;
    finishGroup.add(ribbon);

    // Checkered ground strip
    const checkGeo = new THREE.PlaneGeometry(0.8, 6.2);
    checkGeo.rotateX(-Math.PI / 2);
    const checkMesh = new THREE.Mesh(checkGeo, checkMat);
    checkMesh.position.set(0, 0.06, 0);
    finishGroup.add(checkMesh);

    this.scene.add(finishGroup);
  }

  // --- THE GIANT SHADY NAP TREE ---
  createShadyNapTree() {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, 0, -8); // Just off the path bend

    const trunkMat = new THREE.MeshToonMaterial({ color: 0x6d4c41 });
    const leafMat = new THREE.MeshToonMaterial({ color: 0x388e3c });
    const mossMat = new THREE.MeshToonMaterial({ color: 0x7cb342 });

    // Spreading Trunk
    const trunkGeo = new THREE.CylinderGeometry(1.2, 1.9, 7.5, 12);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 3.75;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Big spreading roots where the hare leans comfortably
    const rootGeo = new THREE.CylinderGeometry(0.35, 0.6, 3.2, 8);
    rootGeo.rotateZ(Math.PI / 2.8);
    const root1 = new THREE.Mesh(rootGeo, trunkMat);
    root1.position.set(0.6, 0.4, 1.8);
    treeGroup.add(root1);

    // Soft mossy nap knoll
    const knollGeo = new THREE.SphereGeometry(1.8, 14, 14);
    knollGeo.scale(1.2, 0.4, 1.0);
    const knoll = new THREE.Mesh(knollGeo, mossMat);
    knoll.position.set(0.3, 0.2, 3.8);
    treeGroup.add(knoll);

    // Wide Cool Shady Canopy
    const canopies = [
      { x: 0, y: 7.2, z: 0, r: 3.8 },
      { x: -2, y: 6.8, z: 2, r: 3.2 },
      { x: 2.2, y: 7.0, z: 1.5, r: 3.4 },
      { x: 0, y: 9.0, z: 0.5, r: 2.8 }
    ];

    canopies.forEach(c => {
      const geo = new THREE.SphereGeometry(c.r, 12, 12);
      const leaves = new THREE.Mesh(geo, leafMat);
      leaves.position.set(c.x, c.y, c.z);
      leaves.castShadow = true;
      treeGroup.add(leaves);
    });

    this.scene.add(treeGroup);
  }

  // --- PATH OBSTACLES (ROOTS, STONES, FALLEN BRANCH, MUD) ---
  createObstacles() {
    const obsGroup = new THREE.Group();
    obsGroup.position.set(15, 0, 6);

    const woodMat = new THREE.MeshToonMaterial({ color: 0x5d4037 });
    const stoneMat = new THREE.MeshToonMaterial({ color: 0x90a4ae });
    const mudMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.2, metalness: 0.1 });

    // Shiny Muddy Puddle patch on trail
    const puddleGeo = new THREE.CircleGeometry(1.6, 16);
    puddleGeo.rotateX(-Math.PI / 2);
    const puddle = new THREE.Mesh(puddleGeo, mudMat);
    puddle.position.set(-1.2, 0.05, 0.5);
    obsGroup.add(puddle);

    // Fallen Mossy Branch / Log across trail edge
    const logGeo = new THREE.CylinderGeometry(0.2, 0.26, 3.8, 8);
    logGeo.rotateZ(Math.PI / 2);
    logGeo.rotateY(0.4);
    const log = new THREE.Mesh(logGeo, woodMat);
    log.position.set(1.5, 0.22, -0.6);
    log.castShadow = true;
    obsGroup.add(log);

    // Round Stepping Stones
    const stonePositions = [
      { x: -0.6, z: 1.2, r: 0.4 },
      { x: 0.5, z: 0.8, r: 0.45 },
      { x: 0.1, z: -1.0, r: 0.38 },
      { x: 2.2, z: 0.9, r: 0.5 }
    ];

    stonePositions.forEach(sp => {
      const stoneGeo = new THREE.SphereGeometry(sp.r, 8, 8);
      stoneGeo.scale(1.2, 0.5, 1.0);
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(sp.x, 0.15, sp.z);
      stone.castShadow = true;
      obsGroup.add(stone);
    });

    this.scene.add(obsGroup);
  }

  // --- FOREST TREES & FOLIAGE ---
  populateForestTrees() {
    const trunkMat = new THREE.MeshToonMaterial({ color: 0x5d4037 });
    const foliageColors = [0x2e7d32, 0x388e3c, 0x43a047, 0x1b5e20, 0x81c784];

    // Place trees on both sides of the trail
    for (let x = -60; x <= 75; x += 7) {
      for (let side = -1; side <= 1; side += 2) {
        const zOffset = (8 + Math.random() * 18) * side;
        const ptT = Math.max(0, Math.min(1, (x + 55) / 130));
        const pathPt = this.pathCurve.getPointAt(ptT);
        const treeZ = pathPt.z + zOffset;

        const treeGroup = new THREE.Group();
        treeGroup.position.set(x + (Math.random() - 0.5) * 3, 0, treeZ);

        const h = 4.5 + Math.random() * 3.5;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, h, 8), trunkMat);
        trunk.position.y = h / 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const col = foliageColors[Math.floor(Math.random() * foliageColors.length)];
        const folMat = new THREE.MeshToonMaterial({ color: col, roughness: 0.7 });

        // Anime stylized layered canopy
        const layers = 2 + Math.floor(Math.random() * 2);
        for (let l = 0; l < layers; l++) {
          const r = 2.4 - l * 0.45;
          const canopy = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), folMat);
          canopy.position.y = h + l * 1.5;
          canopy.castShadow = true;
          treeGroup.add(canopy);
        }

        this.scene.add(treeGroup);
      }
    }
  }

  // --- BLOOMING FLOWERS & VIBRANT FLORA ---
  populateFlowersAndFlora() {
    const flowerColors = [0xff1744, 0xffeb3b, 0xab47bc, 0x00e676, 0xff9100, 0xffffff];
    const stemMat = new THREE.MeshBasicMaterial({ color: 0x2e7d32 });

    for (let i = 0; i < 90; i++) {
      const u = Math.random();
      const pt = this.pathCurve.getPointAt(u);
      const side = Math.random() > 0.5 ? 1 : -1;
      const dist = 2.6 + Math.random() * 3.2;

      const fGroup = new THREE.Group();
      fGroup.position.set(
        pt.x + (Math.random() - 0.5) * 2,
        0,
        pt.z + side * dist
      );

      // Stem
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6), stemMat);
      stem.position.y = 0.25;
      fGroup.add(stem);

      // Colorful blossom petals
      const col = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      const petalMat = new THREE.MeshBasicMaterial({ color: col });
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), petalMat);
      bloom.position.y = 0.52;
      bloom.scale.set(1.2, 0.6, 1.2);
      fGroup.add(bloom);

      this.scene.add(fGroup);
      this.flowers.push({ group: fGroup, baseRotZ: fGroup.rotation.z, speed: 2 + Math.random() * 2 });
    }
  }

  // --- FLUTTERING 3D BUTTERFLIES ---
  createButterflies() {
    const butterflyColors = [0x29b6f6, 0xffca28, 0xec407a, 0xab47bc];

    for (let i = 0; i < 7; i++) {
      const bGroup = new THREE.Group();
      const col = butterflyColors[i % butterflyColors.length];
      const wingMat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });

      // Left wing
      const wingLGeo = new THREE.PlaneGeometry(0.35, 0.45);
      wingLGeo.translate(0.18, 0, 0);
      const wingL = new THREE.Mesh(wingLGeo, wingMat);
      bGroup.add(wingL);

      // Right wing
      const wingRGeo = new THREE.PlaneGeometry(0.35, 0.45);
      wingRGeo.translate(-0.18, 0, 0);
      const wingR = new THREE.Mesh(wingRGeo, wingMat);
      bGroup.add(wingR);

      const uStart = 0.1 + (i / 7) * 0.75;
      const basePos = this.pathCurve.getPointAt(uStart);

      bGroup.position.set(basePos.x, 1.5 + Math.random() * 1.5, basePos.z + (Math.random() - 0.5) * 6);
      this.scene.add(bGroup);

      this.butterflies.push({
        group: bGroup,
        wingL,
        wingR,
        center: bGroup.position.clone(),
        flightSpeed: 1.2 + Math.random() * 0.8,
        flapSpeed: 16 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  // --- BLUE SKY & DRIFTING CLOUDS ---
  createClouds() {
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    this.clouds = [];

    for (let i = 0; i < 10; i++) {
      const cGroup = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 3);
      for (let p = 0; p < numPuffs; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(3.5 + Math.random() * 2.5, 10, 10),
          cloudMat
        );
        puff.position.set(
          (p - numPuffs / 2) * 3.2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2.0
        );
        cGroup.add(puff);
      }

      cGroup.position.set(
        -60 + (i / 10) * 140,
        32 + Math.random() * 10,
        -30 + (Math.random() - 0.5) * 40
      );
      this.scene.add(cGroup);
      this.clouds.push(cGroup);
    }
  }

  // --- CONFETTI CELEBRATION SYSTEM ---
  createConfettiSystem() {
    this.confettiGroup = new THREE.Group();
    this.confettiGroup.position.set(65, 3.5, 0);
    this.scene.add(this.confettiGroup);

    const colors = [0xff1744, 0xffeb3b, 0x00e676, 0x2979ff, 0xff9100, 0xd500f9];
    const confGeo = new THREE.PlaneGeometry(0.25, 0.25);

    for (let i = 0; i < 140; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(confGeo, mat);
      mesh.visible = false;
      this.confettiGroup.add(mesh);

      this.confettiParticles.push({
        mesh,
        vx: (Math.random() - 0.5) * 8,
        vy: 4 + Math.random() * 6,
        vz: (Math.random() - 0.5) * 8,
        rotSpeedX: Math.random() * 8,
        rotSpeedY: Math.random() * 8,
        life: 0
      });
    }
  }

  triggerConfetti() {
    this.confettiActive = true;
    this.confettiParticles.forEach(p => {
      p.mesh.visible = true;
      p.mesh.position.set(0, 0, 0);
      p.vx = (Math.random() - 0.5) * 9;
      p.vy = 5 + Math.random() * 7;
      p.vz = (Math.random() - 0.5) * 9;
      p.life = 4.0;
    });
  }

  update(dt) {
    this.time += dt;

    // Flutter Butterflies
    this.butterflies.forEach(b => {
      const flap = Math.sin(this.time * b.flapSpeed) * 0.8;
      b.wingL.rotation.y = flap;
      b.wingR.rotation.y = -flap;

      b.group.position.x = b.center.x + Math.sin(this.time * b.flightSpeed + b.phase) * 2.8;
      b.group.position.z = b.center.z + Math.cos(this.time * b.flightSpeed * 0.8 + b.phase) * 2.5;
      b.group.position.y = b.center.y + Math.sin(this.time * 3 + b.phase) * 0.45;
    });

    // Gentle Breeze swaying flowers
    this.flowers.forEach(f => {
      f.group.rotation.z = Math.sin(this.time * f.speed) * 0.08;
    });

    // Drifting clouds
    if (this.clouds) {
      this.clouds.forEach(c => {
        c.position.x += dt * 0.7;
        if (c.position.x > 85) c.position.x = -75;
      });
    }

    // Update Confetti
    if (this.confettiActive) {
      let anyAlive = false;
      this.confettiParticles.forEach(p => {
        if (p.life > 0) {
          anyAlive = true;
          p.life -= dt;
          p.mesh.position.x += p.vx * dt;
          p.mesh.position.y += p.vy * dt;
          p.mesh.position.z += p.vz * dt;
          p.vy -= 9.8 * 0.6 * dt; // gravity

          p.mesh.rotation.x += p.rotSpeedX * dt;
          p.mesh.rotation.y += p.rotSpeedY * dt;

          if (p.mesh.position.y < -3.2 || p.life <= 0) {
            p.mesh.visible = false;
          }
        }
      });
      if (!anyAlive) this.confettiActive = false;
    }
  }
}

window.ForestEnvironment = ForestEnvironment;
