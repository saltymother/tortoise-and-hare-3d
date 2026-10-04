/**
 * character_models.js - 3D Character Models & Animation Rigging (Three.js)
 * High-detail procedural stylized anime characters:
 * - Proud Energetic Hare (expressive ears, animated limbs, running dust, sleeping pose, shocked face)
 * - Determined Wise Tortoise (hexagonal patterned green shell, head bob, walking gait, victory wave)
 * - Clever Fox Referee (sleek coat, bushy tail, whistle, pointing paw)
 * - Forest Spectators (Cheering squirrels, bunnies, birds)
 */

class CharacterFactory {
  // --- BUILD THE HARE ---
  static createHare() {
    const group = new THREE.Group();
    group.name = 'hare_root';

    // Cel-shaded / vibrant materials
    const furBrown = new THREE.MeshToonMaterial({ color: 0xc4824e });
    const furCream = new THREE.MeshToonMaterial({ color: 0xfff0d6 });
    const earPink = new THREE.MeshToonMaterial({ color: 0xfba3b0 });
    const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyePupil = new THREE.MeshBasicMaterial({ color: 0x1f140e });
    const eyeShine = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const nosePink = new THREE.MeshToonMaterial({ color: 0xe57373 });
    const mouthDark = new THREE.MeshBasicMaterial({ color: 0x4a151b });

    // Main Torso (leans forward slightly)
    const bodyGeo = new THREE.SphereGeometry(0.85, 20, 20);
    bodyGeo.scale(0.9, 1.25, 0.95);
    const body = new THREE.Mesh(bodyGeo, furBrown);
    body.position.y = 1.3;
    body.castShadow = true;
    group.add(body);

    // Cream Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.72, 16, 16);
    bellyGeo.scale(0.7, 1.05, 0.5);
    const belly = new THREE.Mesh(bellyGeo, furCream);
    belly.position.set(0, -0.05, 0.45);
    body.add(belly);

    // Fluffy Pom-Pom Tail
    const tailGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const tail = new THREE.Mesh(tailGeo, furCream);
    tail.position.set(0, -0.3, -0.85);
    body.add(tail);

    // Head Pivot & Head
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.95, 0.2);
    body.add(headPivot);

    const headGeo = new THREE.SphereGeometry(0.68, 20, 20);
    headGeo.scale(1.0, 1.05, 1.0);
    const head = new THREE.Mesh(headGeo, furBrown);
    head.castShadow = true;
    headPivot.add(head);

    // Muzzle / Cheeks
    const muzzleGeo = new THREE.SphereGeometry(0.42, 16, 16);
    muzzleGeo.scale(0.9, 0.7, 0.85);
    const muzzle = new THREE.Mesh(muzzleGeo, furCream);
    muzzle.position.set(0, -0.15, 0.45);
    head.add(muzzle);

    // Cute Pink Nose
    const noseGeo = new THREE.ConeGeometry(0.1, 0.12, 8);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, nosePink);
    nose.position.set(0, 0.08, 0.38);
    muzzle.add(nose);

    // Anime Eyes (Left & Right)
    const createEye = (xDir) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xDir * 0.28, 0.16, 0.52);

      // White Sclera (oval)
      const whiteGeo = new THREE.SphereGeometry(0.18, 14, 14);
      whiteGeo.scale(0.85, 1.25, 0.4);
      const sclera = new THREE.Mesh(whiteGeo, eyeWhite);
      eyeGroup.add(sclera);

      // Dark Iris/Pupil
      const pupilGeo = new THREE.SphereGeometry(0.11, 12, 12);
      pupilGeo.scale(0.8, 1.2, 0.3);
      const pupil = new THREE.Mesh(pupilGeo, eyePupil);
      pupil.position.set(xDir * 0.02, 0, 0.08);
      sclera.add(pupil);

      // Anime Sparkle highlight
      const shineGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const shine = new THREE.Mesh(shineGeo, eyeShine);
      shine.position.set(xDir * -0.03, 0.045, 0.1);
      sclera.add(shine);

      return eyeGroup;
    };

    const eyeL = createEye(1);
    const eyeR = createEye(-1);
    head.add(eyeL);
    head.add(eyeR);

    // Animated Mouth (flaps open when talking or gasping)
    const mouthGeo = new THREE.SphereGeometry(0.15, 10, 10);
    mouthGeo.scale(1.0, 0.5, 0.5);
    const mouth = new THREE.Mesh(mouthGeo, mouthDark);
    mouth.position.set(0, -0.22, 0.42);
    mouth.scale.set(0.8, 0.2, 0.8);
    head.add(mouth);

    // Expressive Long Ears (Pivoted for dynamic rotation & emotion)
    const createEar = (xOffset) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(xOffset, 0.6, 0.05);

      const earGeo = new THREE.CylinderGeometry(0.12, 0.22, 1.45, 14);
      earGeo.scale(1.0, 1.0, 0.45);
      const earMesh = new THREE.Mesh(earGeo, furBrown);
      earMesh.position.y = 0.72;
      earMesh.castShadow = true;
      earPivot.add(earMesh);

      // Inner Pink Ear
      const innerGeo = new THREE.CylinderGeometry(0.07, 0.14, 1.2, 12);
      innerGeo.scale(0.85, 1.0, 0.2);
      const innerMesh = new THREE.Mesh(innerGeo, earPink);
      innerMesh.position.set(0, 0, 0.09);
      earMesh.add(innerMesh);

      return { earPivot, earMesh };
    };

    const earLeft = createEar(0.3);
    const earRight = createEar(-0.3);
    head.add(earLeft.earPivot);
    head.add(earRight.earPivot);

    // Powerful Hind Legs
    const createHindLeg = (xOffset) => {
      const hip = new THREE.Group();
      hip.position.set(xOffset, -0.4, -0.1);

      // Thigh muscle
      const thighGeo = new THREE.SphereGeometry(0.42, 14, 14);
      thighGeo.scale(0.8, 1.3, 1.1);
      const thigh = new THREE.Mesh(thighGeo, furBrown);
      thigh.position.y = -0.15;
      hip.add(thigh);

      // Lower leg & big running paw
      const pawGeo = new THREE.BoxGeometry(0.3, 0.18, 0.65);
      const paw = new THREE.Mesh(pawGeo, furCream);
      paw.position.set(0, -0.75, 0.2);
      hip.add(paw);

      return { hip, thigh, paw };
    };

    const legBackL = createHindLeg(0.55);
    const legBackR = createHindLeg(-0.55);
    body.add(legBackL.hip);
    body.add(legBackR.hip);

    // Agile Front Arms
    const createFrontArm = (xOffset) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(xOffset, 0.35, 0.4);

      const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 10);
      const arm = new THREE.Mesh(armGeo, furBrown);
      arm.position.y = -0.3;
      shoulder.add(arm);

      const pawGeo = new THREE.SphereGeometry(0.15, 10, 10);
      pawGeo.scale(1, 0.8, 1.3);
      const paw = new THREE.Mesh(pawGeo, furCream);
      paw.position.set(0, -0.35, 0.08);
      arm.add(paw);

      return { shoulder, arm, paw };
    };

    const armFrontL = createFrontArm(0.45);
    const armFrontR = createFrontArm(-0.45);
    body.add(armFrontL.shoulder);
    body.add(armFrontR.shoulder);

    // Sleep "Zzz" Bubble Container
    const zzzGroup = new THREE.Group();
    zzzGroup.position.set(0.6, 2.4, 0);
    zzzGroup.visible = false;
    group.add(zzzGroup);

    // Dynamic Dust Particles for running
    const dustParticles = [];
    const dustMat = new THREE.MeshBasicMaterial({ color: 0xe0cda9, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 8; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.15 + Math.random() * 0.15, 6, 6), dustMat);
      p.visible = false;
      group.add(p);
      dustParticles.push({ mesh: p, life: 0, vx: 0, vy: 0, vz: 0 });
    }

    // Return rigged character controller
    return {
      group,
      parts: {
        body,
        headPivot,
        head,
        mouth,
        earL: earLeft.earPivot,
        earR: earRight.earPivot,
        eyeL,
        eyeR,
        legBL: legBackL.hip,
        legBR: legBackR.hip,
        armFL: armFrontL.shoulder,
        armFR: armFrontR.shoulder,
        zzzGroup,
        dustParticles
      },
      state: 'idle', // idle, cocky, sprinting, sleeping, shocked, defeated, walking
      animTime: 0,
      isSpeaking: false,
      mouthOpen: 0,

      update(dt) {
        this.animTime += dt;

        // Mouth flap when speaking
        if (this.isSpeaking) {
          const flap = Math.sin(this.animTime * 18) * 0.5 + 0.5;
          mouth.scale.set(0.8 + flap * 0.4, 0.2 + flap * 0.8, 0.8);
        } else if (this.state !== 'shocked') {
          mouth.scale.set(0.8, 0.2, 0.8);
        }

        // Animation States
        if (this.state === 'cocky' || this.state === 'idle') {
          // Energetic bounce & confident ear wiggles
          body.position.y = 1.3 + Math.sin(this.animTime * 4) * 0.08;
          headPivot.rotation.z = Math.sin(this.animTime * 2) * 0.08;
          headPivot.rotation.x = -0.1;
          earLeft.earPivot.rotation.z = 0.1 + Math.sin(this.animTime * 5) * 0.1;
          earRight.earPivot.rotation.z = -0.15 + Math.cos(this.animTime * 4) * 0.08;
          earLeft.earPivot.rotation.x = -0.1;
          earRight.earPivot.rotation.x = 0.05;

          // Arms resting cockily
          armFrontL.shoulder.rotation.x = -0.6;
          armFrontL.shoulder.rotation.z = 0.4;
          armFrontR.shoulder.rotation.x = -0.6;
          armFrontR.shoulder.rotation.z = -0.4;

          zzzGroup.visible = false;
        } else if (this.state === 'sprinting' || this.state === 'panic_sprint') {
          const speed = this.state === 'panic_sprint' ? 24 : 18;
          // Torso leans deeply forward into the sprint
          body.position.y = 1.05 + Math.abs(Math.sin(this.animTime * speed)) * 0.25;
          body.rotation.x = 0.65;
          headPivot.rotation.x = -0.55;

          // Ears streaming directly backward in aerodynamic wind!
          earLeft.earPivot.rotation.x = 1.3 + Math.sin(this.animTime * speed) * 0.15;
          earRight.earPivot.rotation.x = 1.35 + Math.cos(this.animTime * speed) * 0.15;
          earLeft.earPivot.rotation.z = 0.05;
          earRight.earPivot.rotation.z = -0.05;

          // Leg sprint pumping cycles
          const legPhase = Math.sin(this.animTime * speed);
          legBackL.hip.rotation.x = legPhase * 1.1;
          legBackR.hip.rotation.x = -legPhase * 1.1;
          armFrontL.shoulder.rotation.x = -legPhase * 0.9;
          armFrontR.shoulder.rotation.x = legPhase * 0.9;

          // Emit dust puffs
          if (Math.random() < 0.4) {
            const dp = dustParticles.find(p => p.life <= 0);
            if (dp) {
              dp.life = 0.6;
              dp.mesh.visible = true;
              dp.mesh.position.set(
                (Math.random() - 0.5) * 0.5,
                0.2,
                -0.8 - Math.random() * 0.4
              );
              dp.mesh.scale.setScalar(0.4);
              dp.vx = (Math.random() - 0.5) * 0.6;
              dp.vy = 0.6 + Math.random() * 0.4;
              dp.vz = -1.2;
            }
          }
          zzzGroup.visible = false;
        } else if (this.state === 'sleeping') {
          // Curled up under tree, breathing chest movement
          body.position.y = 0.6;
          body.rotation.x = -0.3;
          body.rotation.z = 1.1; // Lying comfortably on side/ground
          headPivot.rotation.x = 0.2;
          headPivot.rotation.z = -0.4;

          // Ears drooped relaxed against the grass
          earLeft.earPivot.rotation.x = 0.4;
          earLeft.earPivot.rotation.z = -0.7;
          earRight.earPivot.rotation.x = 0.6;
          earRight.earPivot.rotation.z = -0.8;

          // Gentle breathing chest expansion
          const breath = Math.sin(this.animTime * 1.8) * 0.06;
          body.scale.set(1 + breath, 1 + breath, 1 + breath);

          // Paws curled in
          armFrontL.shoulder.rotation.x = -1.2;
          armFrontR.shoulder.rotation.x = -1.1;
          legBackL.hip.rotation.x = 0.5;
          legBackR.hip.rotation.x = 0.6;

          zzzGroup.visible = true;
          zzzGroup.position.set(0.4, 1.2 + Math.sin(this.animTime * 2) * 0.15, 0.2);
        } else if (this.state === 'shocked') {
          // Sudden anime jaw drop & ears popping straight up!
          body.position.y = 1.45;
          body.rotation.set(0, 0, 0);
          body.scale.set(1, 1, 1);
          headPivot.rotation.x = -0.35;

          // Ears fully alert / jittery
          earLeft.earPivot.rotation.x = -0.2 + (Math.random() - 0.5) * 0.08;
          earRight.earPivot.rotation.x = -0.2 + (Math.random() - 0.5) * 0.08;
          earLeft.earPivot.rotation.z = 0.2;
          earRight.earPivot.rotation.z = -0.2;

          // Giant wide open mouth in anime disbelief
          mouth.scale.set(1.4, 1.2, 1.2);

          // Paws clutching cheeks
          armFrontL.shoulder.rotation.x = -1.4;
          armFrontL.shoulder.rotation.z = -0.6;
          armFrontR.shoulder.rotation.x = -1.4;
          armFrontR.shoulder.rotation.z = 0.6;

          zzzGroup.visible = false;
        } else if (this.state === 'defeated') {
          // Post-race exhaustion and drooping ears
          body.position.y = 1.0;
          body.rotation.x = 0.25;
          headPivot.rotation.x = 0.45; // Head hung low in regret
          headPivot.rotation.z = 0;

          // Droopy ears hanging down the sides of the head
          earLeft.earPivot.rotation.x = 0.6;
          earLeft.earPivot.rotation.z = 0.95;
          earRight.earPivot.rotation.x = 0.6;
          earRight.earPivot.rotation.z = -0.95;

          mouth.scale.set(0.8, 0.2, 0.8);
          armFrontL.shoulder.rotation.x = 0.2;
          armFrontR.shoulder.rotation.x = 0.2;
          zzzGroup.visible = false;
        }

        // Update running dust particles
        dustParticles.forEach(dp => {
          if (dp.life > 0) {
            dp.life -= dt;
            dp.mesh.position.x += dp.vx * dt;
            dp.mesh.position.y += dp.vy * dt;
            dp.mesh.position.z += dp.vz * dt;
            dp.mesh.scale.multiplyScalar(1.03);
            if (dp.life <= 0) dp.mesh.visible = false;
          }
        });
      }
    };
  }

  // --- BUILD THE DETERMINED TORTOISE ---
  static createTortoise() {
    const group = new THREE.Group();
    group.name = 'tortoise_root';

    // Cel-shaded shell & skin materials
    const shellGreen = new THREE.MeshToonMaterial({ color: 0x2e7d32, roughness: 0.5 });
    const shellHexBorder = new THREE.MeshToonMaterial({ color: 0x1b5e20 });
    const shellGoldRim = new THREE.MeshToonMaterial({ color: 0x81c784 });
    const plastronCream = new THREE.MeshToonMaterial({ color: 0xdce775 });
    const skinGreen = new THREE.MeshToonMaterial({ color: 0x66bb6a });
    const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeBlack = new THREE.MeshBasicMaterial({ color: 0x1a2e1a });
    const eyeSparkle = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mouthLine = new THREE.MeshBasicMaterial({ color: 0x2e492f });

    // Carapace (Rounded Jade Green Dome Shell)
    const shellGeo = new THREE.SphereGeometry(1.0, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
    shellGeo.scale(1.0, 0.75, 1.25);
    const carapace = new THREE.Mesh(shellGeo, shellGreen);
    carapace.position.y = 0.65;
    carapace.castShadow = true;
    group.add(carapace);

    // Hexagonal Markings on Shell (Stylized polygonal plates)
    const hexPlateGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.06, 6);
    const hexPositions = [
      { x: 0, y: 0.72, z: 0 },
      { x: 0, y: 0.65, z: 0.5 },
      { x: 0, y: 0.65, z: -0.5 },
      { x: 0.42, y: 0.52, z: 0.25 },
      { x: -0.42, y: 0.52, z: 0.25 },
      { x: 0.42, y: 0.52, z: -0.25 },
      { x: -0.42, y: 0.52, z: -0.25 }
    ];

    hexPositions.forEach((pos) => {
      const hex = new THREE.Mesh(hexPlateGeo, shellHexBorder);
      hex.position.set(pos.x, pos.y, pos.z);
      hex.scale.set(0.9, 0.8, 0.9);
      carapace.add(hex);
    });

    // Shell Rim Trim (Scalloped edge band)
    const rimGeo = new THREE.TorusGeometry(1.02, 0.08, 10, 28);
    rimGeo.scale(1.0, 0.5, 1.25);
    rimGeo.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, shellGoldRim);
    rim.position.y = 0.05;
    carapace.add(rim);

    // Plastron (Flat Tan/Yellow Under-Belly)
    const plastronGeo = new THREE.BoxGeometry(1.4, 0.15, 2.0);
    const plastron = new THREE.Mesh(plastronGeo, plastronCream);
    plastron.position.y = 0.28;
    group.add(plastron);

    // Neck & Head Pivot (Extends from front of shell)
    const neckPivot = new THREE.Group();
    neckPivot.position.set(0, 0.45, 1.0);
    group.add(neckPivot);

    const neckGeo = new THREE.CylinderGeometry(0.2, 0.24, 0.5, 12);
    neckGeo.rotateX(Math.PI / 4);
    const neck = new THREE.Mesh(neckGeo, skinGreen);
    neck.position.set(0, 0.1, 0.15);
    neckPivot.add(neck);

    // Cute Friendly Wrinkled Head
    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    headGeo.scale(0.95, 0.85, 1.15);
    const head = new THREE.Mesh(headGeo, skinGreen);
    head.position.set(0, 0.25, 0.35);
    neckPivot.add(head);

    // Big Determined Anime Eyes
    const createTortoiseEye = (xDir) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xDir * 0.22, 0.08, 0.22);

      const scleraGeo = new THREE.SphereGeometry(0.12, 12, 12);
      scleraGeo.scale(0.8, 1.1, 0.4);
      const sclera = new THREE.Mesh(scleraGeo, eyeWhite);
      eyeGroup.add(sclera);

      const irisGeo = new THREE.SphereGeometry(0.08, 10, 10);
      irisGeo.scale(0.8, 1.0, 0.3);
      const iris = new THREE.Mesh(irisGeo, eyeBlack);
      iris.position.set(xDir * 0.01, 0, 0.06);
      sclera.add(iris);

      const shineGeo = new THREE.SphereGeometry(0.035, 6, 6);
      const shine = new THREE.Mesh(shineGeo, eyeSparkle);
      shine.position.set(xDir * -0.02, 0.03, 0.08);
      sclera.add(shine);

      return eyeGroup;
    };

    head.add(createTortoiseEye(1));
    head.add(createTortoiseEye(-1));

    // Mouth for speech flap
    const mouthGeo = new THREE.SphereGeometry(0.1, 8, 8);
    mouthGeo.scale(1.0, 0.3, 0.5);
    const mouth = new THREE.Mesh(mouthGeo, mouthLine);
    mouth.position.set(0, -0.16, 0.32);
    head.add(mouth);

    // 4 Sturdy Legs with Tiny Claws
    const createLeg = (x, z) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(x, 0.4, z);

      const legGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 12);
      const leg = new THREE.Mesh(legGeo, skinGreen);
      leg.position.y = -0.22;
      leg.castShadow = true;
      legPivot.add(leg);

      // Foot & Claws
      const footGeo = new THREE.SphereGeometry(0.22, 10, 10);
      footGeo.scale(1.1, 0.5, 1.3);
      const foot = new THREE.Mesh(footGeo, skinGreen);
      foot.position.set(0, -0.24, 0.05);
      leg.add(foot);

      return { legPivot, leg };
    };

    const legFL = createLeg(0.65, 0.7);
    const legFR = createLeg(-0.65, 0.7);
    const legBL = createLeg(0.65, -0.7);
    const legBR = createLeg(-0.65, -0.7);

    group.add(legFL.legPivot);
    group.add(legFR.legPivot);
    group.add(legBL.legPivot);
    group.add(legBR.legPivot);

    // Tiny Tail
    const tailGeo = new THREE.ConeGeometry(0.1, 0.3, 8);
    tailGeo.rotateX(-Math.PI / 3);
    const tail = new THREE.Mesh(tailGeo, skinGreen);
    tail.position.set(0, 0.35, -1.15);
    group.add(tail);

    return {
      group,
      parts: {
        carapace,
        neckPivot,
        head,
        mouth,
        legFL: legFL.legPivot,
        legFR: legFR.legPivot,
        legBL: legBL.legPivot,
        legBR: legBR.legPivot
      },
      state: 'walking', // idle, walking, obstacle, victory
      animTime: 0,
      isSpeaking: false,

      update(dt) {
        this.animTime += dt;

        // Mouth flap
        if (this.isSpeaking) {
          const flap = Math.sin(this.animTime * 14) * 0.5 + 0.5;
          mouth.scale.set(1.0 + flap * 0.4, 0.3 + flap * 0.8, 0.8);
        } else {
          mouth.scale.set(1.0, 0.3, 0.8);
        }

        if (this.state === 'walking') {
          // Slow, steady, relentless rhythmic gait (diagonal pairs)
          const walkSpeed = 3.6;
          const legSwing = 0.35;

          legFL.legPivot.rotation.x = Math.sin(this.animTime * walkSpeed) * legSwing;
          legBR.legPivot.rotation.x = Math.sin(this.animTime * walkSpeed) * legSwing;
          legFR.legPivot.rotation.x = -Math.sin(this.animTime * walkSpeed) * legSwing;
          legBL.legPivot.rotation.x = -Math.sin(this.animTime * walkSpeed) * legSwing;

          // Determined head bobbing forward and back
          neckPivot.position.z = 1.0 + Math.sin(this.animTime * walkSpeed) * 0.08;
          neckPivot.rotation.x = Math.sin(this.animTime * walkSpeed) * 0.05;

          // Gentle shell waddle
          carapace.rotation.z = Math.sin(this.animTime * walkSpeed) * 0.04;
        } else if (this.state === 'obstacle') {
          // Careful climbing over branch or stone
          const walkSpeed = 2.4;
          legFL.legPivot.rotation.x = Math.sin(this.animTime * walkSpeed) * 0.6;
          legFR.legPivot.rotation.x = -Math.sin(this.animTime * walkSpeed) * 0.6;
          neckPivot.rotation.x = 0.2; // Looking closely at path
          carapace.position.y = 0.75 + Math.abs(Math.sin(this.animTime * walkSpeed)) * 0.15;
        } else if (this.state === 'victory') {
          // Proudly raising right front leg in victory, smiling head raised high!
          neckPivot.rotation.x = -0.35; // Head pointed triumphantly high
          neckPivot.position.z = 1.15;
          legFR.legPivot.rotation.x = -1.2; // Front right leg raised up high!
          legFR.legPivot.rotation.z = -0.4;
          legFL.legPivot.rotation.x = 0.1;
          carapace.rotation.z = 0;
          carapace.position.y = 0.65;
        } else if (this.state === 'idle') {
          legFL.legPivot.rotation.x = 0;
          legFR.legPivot.rotation.x = 0;
          neckPivot.rotation.x = 0;
          neckPivot.position.z = 1.0;
        }
      }
    };
  }

  // --- BUILD THE CLEVER FOX REFEREE ---
  static createFox() {
    const group = new THREE.Group();
    group.name = 'fox_referee';

    const orangeFur = new THREE.MeshToonMaterial({ color: 0xe65100 });
    const whiteFur = new THREE.MeshToonMaterial({ color: 0xffffff });
    const blackFur = new THREE.MeshBasicMaterial({ color: 0x212121 });
    const silverWhistle = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.8, roughness: 0.2 });
    const refVest = new THREE.MeshToonMaterial({ color: 0x2979ff }); // Blue referee vest

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.55, 1.4, 14);
    const body = new THREE.Mesh(bodyGeo, orangeFur);
    body.position.y = 1.2;
    body.castShadow = true;
    group.add(body);

    // Blue Referee Vest
    const vestGeo = new THREE.CylinderGeometry(0.42, 0.57, 0.9, 14);
    const vest = new THREE.Mesh(vestGeo, refVest);
    vest.position.y = 0.05;
    body.add(vest);

    // White Chest Fur
    const chestGeo = new THREE.SphereGeometry(0.35, 12, 12);
    chestGeo.scale(0.8, 1.2, 0.5);
    const chest = new THREE.Mesh(chestGeo, whiteFur);
    chest.position.set(0, 0.25, 0.35);
    body.add(chest);

    // Head
    const headPivot = new THREE.Group();
    headPivot.position.set(0, 0.85, 0.15);
    body.add(headPivot);

    const headGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const head = new THREE.Mesh(headGeo, orangeFur);
    headPivot.add(head);

    // Fox Snout
    const snoutGeo = new THREE.ConeGeometry(0.24, 0.65, 10);
    snoutGeo.rotateX(Math.PI / 2);
    const snout = new THREE.Mesh(snoutGeo, orangeFur);
    snout.position.set(0, -0.1, 0.45);
    head.add(snout);

    // Snout Tip & Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const nose = new THREE.Mesh(noseGeo, blackFur);
    nose.position.set(0, 0, 0.32);
    snout.add(nose);

    // Clever Fox Ears
    const createFoxEar = (xDir) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(xDir * 0.3, 0.45, 0);

      const earGeo = new THREE.ConeGeometry(0.18, 0.45, 8);
      const ear = new THREE.Mesh(earGeo, orangeFur);
      ear.position.y = 0.2;
      earPivot.add(ear);

      const earTipGeo = new THREE.ConeGeometry(0.12, 0.2, 8);
      const earTip = new THREE.Mesh(earTipGeo, blackFur);
      earTip.position.y = 0.15;
      ear.add(earTip);

      return earPivot;
    };

    head.add(createFoxEar(1));
    head.add(createFoxEar(-1));

    // Referee Whistle
    const whistleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.22, 8);
    whistleGeo.rotateZ(Math.PI / 2);
    const whistle = new THREE.Mesh(whistleGeo, silverWhistle);
    whistle.position.set(0, 0.35, 0.5);
    body.add(whistle);

    // Bushy Fox Tail with White Tip
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, -0.4, -0.4);
    body.add(tailPivot);

    const tailGeo = new THREE.CylinderGeometry(0.1, 0.35, 1.2, 12);
    tailGeo.rotateX(-Math.PI / 4);
    const tail = new THREE.Mesh(tailGeo, orangeFur);
    tail.position.set(0, 0.2, -0.5);
    tailPivot.add(tail);

    const tailTipGeo = new THREE.ConeGeometry(0.25, 0.45, 10);
    tailTipGeo.rotateX(-Math.PI / 4);
    const tailTip = new THREE.Mesh(tailTipGeo, whiteFur);
    tailTip.position.set(0, 0.55, -0.9);
    tailPivot.add(tailTip);

    // Arms (Right Paw is rigged to point toward the finish line!)
    const armRPivot = new THREE.Group();
    armRPivot.position.set(0.55, 0.45, 0.2);
    body.add(armRPivot);

    const armRGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const armR = new THREE.Mesh(armRGeo, orangeFur);
    armR.position.y = -0.35;
    armRPivot.add(armR);

    // Fox Paw
    const pawGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const pawR = new THREE.Mesh(pawGeo, blackFur);
    pawR.position.y = -0.42;
    armR.add(pawR);

    return {
      group,
      parts: {
        body,
        headPivot,
        tailPivot,
        armR: armRPivot
      },
      pointing: false,
      isSpeaking: false,
      animTime: 0,

      update(dt) {
        this.animTime += dt;
        // Tail wagging
        tailPivot.rotation.y = Math.sin(this.animTime * 3) * 0.25;

        // Pointing paw animation
        if (this.pointing) {
          // Points paw straight out toward distant oak tree
          armRPivot.rotation.x = -Math.PI / 2;
          armRPivot.rotation.z = -0.3;
          headPivot.rotation.y = 0.2;
        } else {
          armRPivot.rotation.x = -0.2;
          armRPivot.rotation.z = 0;
          headPivot.rotation.y = Math.sin(this.animTime * 1.5) * 0.1;
        }
      }
    };
  }

  // --- FOREST SPECTATOR ANIMALS ---
  static createSpectatorSquirrel() {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color: 0xa0522d });
    const bellyMat = new THREE.MeshToonMaterial({ color: 0xffe4b5 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), mat);
    body.position.y = 0.45;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), mat);
    head.position.set(0, 0.35, 0.12);
    body.add(head);

    // Big bushy curved tail
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.2, -0.2),
      new THREE.Vector3(0, 0.3, -0.45),
      new THREE.Vector3(0, 0.65, -0.25),
      new THREE.Vector3(0, 0.8, -0.05)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 12, 0.16, 8, false);
    const tail = new THREE.Mesh(tailGeo, mat);
    body.add(tail);

    return {
      group,
      update(t) {
        body.position.y = 0.45 + Math.abs(Math.sin(t * 6)) * 0.15; // Cheering bounce
      }
    };
  }

  static createSpectatorBird() {
    const group = new THREE.Group();
    const blueMat = new THREE.MeshToonMaterial({ color: 0x42a5f5 });
    const beakMat = new THREE.MeshBasicMaterial({ color: 0xffb74d });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), blueMat);
    group.add(body);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 6), beakMat);
    beak.rotateX(Math.PI / 2);
    beak.position.set(0, 0, 0.22);
    body.add(beak);

    // Wings
    const wingGeo = new THREE.BoxGeometry(0.35, 0.04, 0.2);
    const wingL = new THREE.Mesh(wingGeo, blueMat);
    wingL.position.set(0.2, 0.05, 0);
    const wingR = new THREE.Mesh(wingGeo, blueMat);
    wingR.position.set(-0.2, 0.05, 0);
    body.add(wingL);
    body.add(wingR);

    return {
      group,
      update(t) {
        const flap = Math.sin(t * 15) * 0.4;
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;
      }
    };
  }
}

window.CharacterFactory = CharacterFactory;
