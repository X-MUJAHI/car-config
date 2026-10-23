import * as THREE from 'three';
import { WheelDesignId } from '../types/automotive';

/**
 * Procedural Composite Hypercar Model for VANTA
 * Built using high-precision Three.js composite geometries with PBR materials.
 */
export class HypercarModel {
  public group: THREE.Group;
  
  // Material references for real-time live configuration updates
  private bodyMaterial: THREE.MeshPhysicalMaterial;
  private carbonMaterial: THREE.MeshStandardMaterial;
  private glassMaterial: THREE.MeshPhysicalMaterial;
  private interiorMaterial: THREE.MeshStandardMaterial;
  private headlightMaterial: THREE.MeshStandardMaterial;
  private taillightMaterial: THREE.MeshStandardMaterial;
  private caliperMaterial: THREE.MeshStandardMaterial;
  private rimMaterials: THREE.MeshStandardMaterial[] = [];

  // Wheel groups for swappable designs and rotation animation
  private wheelGroups: THREE.Group[] = [];
  private currentWheelDesign: WheelDesignId = 'aeroblade';
  private wheelRimMeshes: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'VantaHypercar';

    // 1. Initialize PBR Materials
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0a0c'),
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });

    this.carbonMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141417'),
      roughness: 0.5,
      metalness: 0.25,
    });

    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0f1d'),
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72,
      transmission: 0.35,
      ior: 1.52,
      thickness: 1.2,
    });

    this.interiorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141416'),
      roughness: 0.65,
      metalness: 0.15,
    });

    this.headlightMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e0f2fe'),
      emissive: new THREE.Color('#7dd3fc'),
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.2,
    });

    this.taillightMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff0d25'),
      emissive: new THREE.Color('#ff1a2b'),
      emissiveIntensity: 3.4,
      roughness: 0.1,
      metalness: 0.2,
    });

    this.caliperMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f59e0b'),
      roughness: 0.3,
      metalness: 0.8,
    });

    // 2. Assemble Hierarchical Composite Subsystems
    this.buildChassisAndBody();
    this.buildAerodynamics();
    this.buildCockpitAndGlass();
    this.buildLightingSignatures();
    this.buildWheelAssemblies();
    this.buildContactGroundShadow();
  }

  /**
   * 1. Main Monocoque, Sculpted Fenders, and Wedge Silhouette
   */
  private buildChassisAndBody(): void {
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'BodyShell';

    // Lower Monocoque Hull (Length: ~4.6m, Width: ~2.0m, Height: ~0.42m)
    const lowerHullGeo = new THREE.BoxGeometry(1.88, 0.28, 4.3, 4, 2, 8);
    // Sculpt vertex positions for aerodynamic taper
    const pos = lowerHullGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const y = pos.getY(i);
      // Taper front nose down
      if (z > 1.2) {
        const factor = (z - 1.2) / 1.0;
        pos.setY(i, y - factor * 0.1);
      }
      // Sculpt rear diffuser clearance
      if (z < -1.2) {
        const factor = (-1.2 - z) / 1.0;
        pos.setY(i, y + factor * 0.08);
      }
    }
    lowerHullGeo.computeVertexNormals();
    const lowerHull = new THREE.Mesh(lowerHullGeo, this.carbonMaterial);
    lowerHull.position.set(0, 0.22, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    bodyGroup.add(lowerHull);

    // Sculpted Main Torso / Beltline
    const torsoGeo = new THREE.BoxGeometry(1.92, 0.36, 4.1, 4, 3, 8);
    const torsoPos = torsoGeo.attributes.position;
    for (let i = 0; i < torsoPos.count; i++) {
      const x = torsoPos.getX(i);
      const y = torsoPos.getY(i);
      const z = torsoPos.getZ(i);

      // Dihedral door waist pinch (sculpted side air scoop channels)
      if (Math.abs(z) < 0.8 && Math.abs(x) > 0.6) {
        torsoPos.setX(i, x * 0.86);
      }
      // Low aggressive sloping hood
      if (z > 0.8) {
        torsoPos.setY(i, y - (z - 0.8) * 0.16);
      }
      // Muscular rear haunches
      if (z < -0.3 && Math.abs(x) > 0.7) {
        torsoPos.setY(i, y + 0.06);
        torsoPos.setX(i, x * 1.04);
      }
    }
    torsoGeo.computeVertexNormals();
    const mainTorso = new THREE.Mesh(torsoGeo, this.bodyMaterial);
    mainTorso.position.set(0, 0.44, 0);
    mainTorso.castShadow = true;
    mainTorso.receiveShadow = true;
    bodyGroup.add(mainTorso);

    // Front Flared Fenders (Left & Right)
    const fenderGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.24, 16, 1, false, 0, Math.PI);
    fenderGeo.rotateZ(Math.PI / 2);

    const frontLeftFender = new THREE.Mesh(fenderGeo, this.bodyMaterial);
    frontLeftFender.position.set(0.92, 0.46, 1.45);
    frontLeftFender.castShadow = true;
    bodyGroup.add(frontLeftFender);

    const frontRightFender = new THREE.Mesh(fenderGeo, this.bodyMaterial);
    frontRightFender.position.set(-0.92, 0.46, 1.45);
    frontRightFender.castShadow = true;
    bodyGroup.add(frontRightFender);

    // Rear Muscular Quarter Fenders (Left & Right)
    const rearFenderGeo = new THREE.CylinderGeometry(0.52, 0.56, 0.26, 16, 1, false, 0, Math.PI);
    rearFenderGeo.rotateZ(Math.PI / 2);

    const rearLeftFender = new THREE.Mesh(rearFenderGeo, this.bodyMaterial);
    rearLeftFender.position.set(0.94, 0.52, -1.38);
    rearLeftFender.castShadow = true;
    bodyGroup.add(rearLeftFender);

    const rearRightFender = new THREE.Mesh(rearFenderGeo, this.bodyMaterial);
    rearRightFender.position.set(-0.94, 0.52, -1.38);
    rearRightFender.castShadow = true;
    bodyGroup.add(rearRightFender);

    // Front Nose Hood Scoop & Center Crest
    const crestGeo = new THREE.ConeGeometry(0.42, 1.2, 4);
    crestGeo.rotateX(Math.PI / 2);
    crestGeo.scale(1, 0.2, 1);
    const hoodCrest = new THREE.Mesh(crestGeo, this.bodyMaterial);
    hoodCrest.position.set(0, 0.55, 1.35);
    bodyGroup.add(hoodCrest);

    // Rear Motor Bay Deck with Engine Cooling Louvers
    const deckGeo = new THREE.BoxGeometry(1.4, 0.08, 1.3);
    const rearDeck = new THREE.Mesh(deckGeo, this.carbonMaterial);
    rearDeck.position.set(0, 0.66, -1.1);
    bodyGroup.add(rearDeck);

    // 4 Louver Slats across the rear deck
    for (let l = 0; l < 4; l++) {
      const louverGeo = new THREE.BoxGeometry(1.15, 0.02, 0.08);
      const louver = new THREE.Mesh(louverGeo, this.carbonMaterial);
      louver.rotation.x = 0.28;
      louver.position.set(0, 0.7 + l * 0.03, -0.7 - l * 0.25);
      bodyGroup.add(louver);
    }

    this.group.add(bodyGroup);
  }

  /**
   * 2. Aerodynamics: Carbon Splitter, Side Aero Skirts, Rear Diffuser, Active Wing
   */
  private buildAerodynamics(): void {
    const aeroGroup = new THREE.Group();
    aeroGroup.name = 'Aerodynamics';

    // Front Carbon Fiber Splitter
    const splitterShape = new THREE.Shape();
    splitterShape.moveTo(-1.02, 0);
    splitterShape.lineTo(1.02, 0);
    splitterShape.lineTo(0.92, 0.45);
    splitterShape.lineTo(0, 0.56);
    splitterShape.lineTo(-0.92, 0.45);
    splitterShape.closePath();

    const splitterExtrude = new THREE.ExtrudeGeometry(splitterShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    splitterExtrude.rotateX(Math.PI / 2);
    const frontSplitter = new THREE.Mesh(splitterExtrude, this.carbonMaterial);
    frontSplitter.position.set(0, 0.12, 1.88);
    frontSplitter.castShadow = true;
    aeroGroup.add(frontSplitter);

    // Front Aero Dive Canards (Left & Right)
    const canardGeo = new THREE.BoxGeometry(0.24, 0.03, 0.35);
    const leftCanard = new THREE.Mesh(canardGeo, this.carbonMaterial);
    leftCanard.position.set(0.98, 0.32, 1.85);
    leftCanard.rotation.set(0.1, -0.25, 0.2);
    aeroGroup.add(leftCanard);

    const rightCanard = new THREE.Mesh(canardGeo, this.carbonMaterial);
    rightCanard.position.set(-0.98, 0.32, 1.85);
    rightCanard.rotation.set(0.1, 0.25, -0.2);
    aeroGroup.add(rightCanard);

    // Sculpted Carbon Side Skirts (Left & Right)
    const sideSkirtGeo = new THREE.BoxGeometry(0.14, 0.08, 2.5);
    const leftSkirt = new THREE.Mesh(sideSkirtGeo, this.carbonMaterial);
    leftSkirt.position.set(0.98, 0.14, 0);
    aeroGroup.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(sideSkirtGeo, this.carbonMaterial);
    rightSkirt.position.set(-0.98, 0.14, 0);
    aeroGroup.add(rightSkirt);

    // Rear Underbody Diffuser with 6 Aero Strakes
    const diffuserBase = new THREE.BoxGeometry(1.68, 0.08, 0.7);
    const diffuserMesh = new THREE.Mesh(diffuserBase, this.carbonMaterial);
    diffuserMesh.position.set(0, 0.22, -2.05);
    diffuserMesh.rotation.x = -0.18;
    aeroGroup.add(diffuserMesh);

    for (let s = -2.5; s <= 2.5; s++) {
      const strakeGeo = new THREE.BoxGeometry(0.025, 0.16, 0.65);
      const strake = new THREE.Mesh(strakeGeo, this.carbonMaterial);
      strake.position.set(s * 0.28, 0.22, -2.05);
      strake.rotation.x = -0.18;
      aeroGroup.add(strake);
    }

    // Active Dual-Strut Elevated Carbon Fiber Rear Wing
    const wingBladeShape = new THREE.Shape();
    wingBladeShape.moveTo(-0.94, -0.1);
    wingBladeShape.lineTo(0.94, -0.1);
    wingBladeShape.quadraticCurveTo(0, 0.02, -0.94, -0.1);
    const wingBladeGeo = new THREE.BoxGeometry(1.82, 0.035, 0.36);
    const wingBlade = new THREE.Mesh(wingBladeGeo, this.carbonMaterial);
    wingBlade.position.set(0, 0.94, -1.94);
    wingBlade.rotation.x = 0.08;
    wingBlade.castShadow = true;
    aeroGroup.add(wingBlade);

    // Wing Struts (Pylons)
    const strutGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.32, 8);
    const leftStrut = new THREE.Mesh(strutGeo, this.carbonMaterial);
    leftStrut.position.set(0.46, 0.78, -1.92);
    leftStrut.rotation.z = -0.12;
    aeroGroup.add(leftStrut);

    const rightStrut = new THREE.Mesh(strutGeo, this.carbonMaterial);
    rightStrut.position.set(-0.46, 0.78, -1.92);
    rightStrut.rotation.z = 0.12;
    aeroGroup.add(rightStrut);

    // Aerodynamic Wing Endplates
    const endplateGeo = new THREE.BoxGeometry(0.02, 0.14, 0.42);
    const leftEndplate = new THREE.Mesh(endplateGeo, this.carbonMaterial);
    leftEndplate.position.set(0.92, 0.94, -1.94);
    aeroGroup.add(leftEndplate);

    const rightEndplate = new THREE.Mesh(endplateGeo, this.carbonMaterial);
    rightEndplate.position.set(-0.92, 0.94, -1.94);
    aeroGroup.add(rightEndplate);

    // Aerodynamic Side Mirrors (Left & Right)
    const mirrorStemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.16, 8);
    const mirrorHousingGeo = new THREE.BoxGeometry(0.18, 0.09, 0.12);

    const leftMirrorGroup = new THREE.Group();
    const leftStem = new THREE.Mesh(mirrorStemGeo, this.carbonMaterial);
    leftStem.rotation.z = -Math.PI / 4;
    leftMirrorGroup.add(leftStem);
    const leftHousing = new THREE.Mesh(mirrorHousingGeo, this.bodyMaterial);
    leftHousing.position.set(0.08, 0.08, 0);
    leftMirrorGroup.add(leftHousing);
    leftMirrorGroup.position.set(0.98, 0.68, 0.6);
    aeroGroup.add(leftMirrorGroup);

    const rightMirrorGroup = new THREE.Group();
    const rightStem = new THREE.Mesh(mirrorStemGeo, this.carbonMaterial);
    rightStem.rotation.z = Math.PI / 4;
    rightMirrorGroup.add(rightStem);
    const rightHousing = new THREE.Mesh(mirrorHousingGeo, this.bodyMaterial);
    rightHousing.position.set(-0.08, 0.08, 0);
    rightMirrorGroup.add(rightHousing);
    rightMirrorGroup.position.set(-0.98, 0.68, 0.6);
    aeroGroup.add(rightMirrorGroup);

    this.group.add(aeroGroup);
  }

  /**
   * 3. Cockpit Glass Canopy, Bucket Seats, Center Console, and Yoke Steering Wheel
   */
  private buildCockpitAndGlass(): void {
    const cockpitGroup = new THREE.Group();
    cockpitGroup.name = 'Cockpit';

    // Curved Greenhouse Glass Canopy
    const canopyGeo = new THREE.SphereGeometry(1.22, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.46);
    canopyGeo.scale(1.08, 0.58, 1.82);
    const canopyMesh = new THREE.Mesh(canopyGeo, this.glassMaterial);
    canopyMesh.position.set(0, 0.52, -0.05);
    canopyMesh.castShadow = true;
    canopyMesh.receiveShadow = true;
    cockpitGroup.add(canopyMesh);

    // Roof Center Carbon Spine / Halo Reinforcement
    const spineGeo = new THREE.BoxGeometry(0.12, 0.04, 1.6);
    const spine = new THREE.Mesh(spineGeo, this.carbonMaterial);
    spine.position.set(0, 0.98, -0.05);
    cockpitGroup.add(spine);

    // Interior Tub Floor
    const floorGeo = new THREE.BoxGeometry(1.3, 0.04, 1.5);
    const cockpitFloor = new THREE.Mesh(floorGeo, this.carbonMaterial);
    cockpitFloor.position.set(0, 0.36, 0.1);
    cockpitGroup.add(cockpitFloor);

    // Dual Lightweight Carbon Bucket Seats (Left Driver & Right Passenger)
    const seatBackGeo = new THREE.BoxGeometry(0.44, 0.55, 0.12);
    seatBackGeo.rotateX(-0.25);
    const seatBottomGeo = new THREE.BoxGeometry(0.44, 0.1, 0.42);

    // Left Driver Seat
    const driverSeatGroup = new THREE.Group();
    const driverBack = new THREE.Mesh(seatBackGeo, this.interiorMaterial);
    driverBack.position.set(0, 0.35, -0.15);
    const driverBottom = new THREE.Mesh(seatBottomGeo, this.interiorMaterial);
    driverBottom.position.set(0, 0.05, 0.08);
    driverSeatGroup.add(driverBack, driverBottom);
    driverSeatGroup.position.set(0.36, 0.38, 0.05);
    cockpitGroup.add(driverSeatGroup);

    // Right Passenger Seat
    const passSeatGroup = new THREE.Group();
    const passBack = new THREE.Mesh(seatBackGeo, this.interiorMaterial);
    passBack.position.set(0, 0.35, -0.15);
    const passBottom = new THREE.Mesh(seatBottomGeo, this.interiorMaterial);
    passBottom.position.set(0, 0.05, 0.08);
    passSeatGroup.add(passBack, passBottom);
    passSeatGroup.position.set(-0.36, 0.38, 0.05);
    cockpitGroup.add(passSeatGroup);

    // Center Console with Floating Display
    const consoleGeo = new THREE.BoxGeometry(0.18, 0.22, 1.1);
    const consoleMesh = new THREE.Mesh(consoleGeo, this.carbonMaterial);
    consoleMesh.position.set(0, 0.46, 0.15);
    cockpitGroup.add(consoleMesh);

    const screenGeo = new THREE.BoxGeometry(0.14, 0.22, 0.02);
    screenGeo.rotateX(-0.4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.62, 0.42);
    cockpitGroup.add(screenMesh);

    // Futuristic Yoke Steering Wheel (Driver side)
    const yokeGroup = new THREE.Group();
    const yokeBarGeo = new THREE.BoxGeometry(0.32, 0.05, 0.03);
    const yokeBar = new THREE.Mesh(yokeBarGeo, this.carbonMaterial);
    const leftHandleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);
    const leftHandle = new THREE.Mesh(leftHandleGeo, this.interiorMaterial);
    leftHandle.position.set(-0.15, 0, 0);
    const rightHandle = new THREE.Mesh(leftHandleGeo, this.interiorMaterial);
    rightHandle.position.set(0.15, 0, 0);
    yokeGroup.add(yokeBar, leftHandle, rightHandle);
    yokeGroup.position.set(0.36, 0.64, 0.48);
    yokeGroup.rotation.x = -0.35;
    cockpitGroup.add(yokeGroup);

    this.group.add(cockpitGroup);
  }

  /**
   * 4. Optical LED Lighting Signatures (Lotus Evija / McLaren inspired)
   */
  private buildLightingSignatures(): void {
    const lightGroup = new THREE.Group();
    lightGroup.name = 'LightingSignatures';

    // Front Headlights: Dual Horizontal Razor LED Blades
    const headlightBladeGeo = new THREE.BoxGeometry(0.42, 0.035, 0.18);
    headlightBladeGeo.rotateY(0.25);

    const leftHeadlight = new THREE.Mesh(headlightBladeGeo, this.headlightMaterial);
    leftHeadlight.position.set(0.68, 0.42, 1.82);
    lightGroup.add(leftHeadlight);

    const rightHeadlightBladeGeo = new THREE.BoxGeometry(0.42, 0.035, 0.18);
    rightHeadlightBladeGeo.rotateY(-0.25);
    const rightHeadlight = new THREE.Mesh(rightHeadlightBladeGeo, this.headlightMaterial);
    rightHeadlight.position.set(-0.68, 0.42, 1.82);
    lightGroup.add(rightHeadlight);

    // Front Lower DRL Accents
    const drlGeo = new THREE.BoxGeometry(0.24, 0.02, 0.06);
    const leftDrl = new THREE.Mesh(drlGeo, this.headlightMaterial);
    leftDrl.position.set(0.72, 0.28, 1.94);
    lightGroup.add(leftDrl);

    const rightDrl = new THREE.Mesh(drlGeo, this.headlightMaterial);
    rightDrl.position.set(-0.72, 0.28, 1.94);
    lightGroup.add(rightDrl);

    // Rear Taillights: Continuous Aerodynamic Light Loop (Inspired by Lotus Evija reference)
    // Left Loop
    const leftLoopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.58, -2.06),
      new THREE.Vector3(0.45, 0.62, -2.08),
      new THREE.Vector3(0.85, 0.58, -2.04),
      new THREE.Vector3(0.88, 0.48, -2.02),
      new THREE.Vector3(0.62, 0.44, -2.05),
      new THREE.Vector3(0.05, 0.48, -2.06),
    ]);
    const leftLoopGeo = new THREE.TubeGeometry(leftLoopCurve, 32, 0.022, 8, false);
    const leftTaillight = new THREE.Mesh(leftLoopGeo, this.taillightMaterial);
    lightGroup.add(leftTaillight);

    // Right Loop
    const rightLoopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 0.58, -2.06),
      new THREE.Vector3(-0.45, 0.62, -2.08),
      new THREE.Vector3(-0.85, 0.58, -2.04),
      new THREE.Vector3(-0.88, 0.48, -2.02),
      new THREE.Vector3(-0.62, 0.44, -2.05),
      new THREE.Vector3(-0.05, 0.48, -2.06),
    ]);
    const rightLoopGeo = new THREE.TubeGeometry(rightLoopCurve, 32, 0.022, 8, false);
    const rightTaillight = new THREE.Mesh(rightLoopGeo, this.taillightMaterial);
    lightGroup.add(rightTaillight);

    // Center illuminated VANTA rear emblem bar
    const emblemGeo = new THREE.BoxGeometry(0.34, 0.03, 0.02);
    const emblem = new THREE.Mesh(emblemGeo, this.headlightMaterial);
    emblem.position.set(0, 0.53, -2.07);
    lightGroup.add(emblem);

    this.group.add(lightGroup);
  }

  /**
   * 5. Detailed Configurable Wheel Assemblies & Carbon-Ceramic Brakes
   */
  private buildWheelAssemblies(): void {
    const wheelsGroup = new THREE.Group();
    wheelsGroup.name = 'WheelAssemblies';

    // Wheel positions: [x, y, z]
    const wheelPositions = [
      { x: 0.94, y: 0.35, z: 1.38, isFront: true, isLeft: true },   // Front-Left
      { x: -0.94, y: 0.35, z: 1.38, isFront: true, isLeft: false },  // Front-Right
      { x: 0.96, y: 0.38, z: -1.34, isFront: false, isLeft: true },  // Rear-Left
      { x: -0.96, y: 0.38, z: -1.34, isFront: false, isLeft: false }, // Rear-Right
    ];

    wheelPositions.forEach((pos, index) => {
      const assembly = new THREE.Group();
      assembly.name = `WheelAssembly_${index}`;
      assembly.position.set(pos.x, pos.y, pos.z);

      const radius = pos.isFront ? 0.35 : 0.38;
      const width = pos.isFront ? 0.24 : 0.30;

      // Tire (Rubber Material)
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tireMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#121214'),
        roughness: 0.82,
        metalness: 0.1,
      });
      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      tireMesh.castShadow = true;
      assembly.add(tireMesh);

      // Carbon Ceramic Drilled Brake Rotor
      const discRadius = radius * 0.72;
      const discGeo = new THREE.CylinderGeometry(discRadius, discRadius, 0.04, 20);
      discGeo.rotateZ(Math.PI / 2);
      const discMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4a4d55'),
        roughness: 0.35,
        metalness: 0.85,
      });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.x = pos.isLeft ? -0.04 : 0.04;
      assembly.add(discMesh);

      // High Performance Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.18, 0.12);
      const caliperMesh = new THREE.Mesh(caliperGeo, this.caliperMaterial);
      caliperMesh.position.set(pos.isLeft ? -0.05 : 0.05, 0.14, 0.06);
      assembly.add(caliperMesh);

      // Configurable Wheel Rim Group
      const rimGroup = new THREE.Group();
      rimGroup.name = `RimGroup_${index}`;
      rimGroup.position.x = pos.isLeft ? 0.04 : -0.04;

      this.populateRimDesign(rimGroup, radius * 0.88, width * 0.7, this.currentWheelDesign);
      assembly.add(rimGroup);

      this.wheelGroups.push(assembly);
      wheelsGroup.add(assembly);
    });

    this.group.add(wheelsGroup);
  }

  /**
   * Helper to construct procedural wheel rim geometry based on active design
   */
  private populateRimDesign(parent: THREE.Group, radius: number, width: number, design: WheelDesignId): void {
    // Clear previous rims
    while (parent.children.length > 0) {
      parent.remove(parent.children[0]);
    }

    const rimMat = new THREE.MeshStandardMaterial({
      color: design === 'carbon' ? new THREE.Color('#1c1d22') : (design === 'forged' ? new THREE.Color('#d1d5db') : new THREE.Color('#2d3139')),
      roughness: design === 'carbon' ? 0.45 : 0.18,
      metalness: design === 'carbon' ? 0.3 : 0.92,
    });
    this.rimMaterials.push(rimMat);

    // Rim Outer Lip / Barrel
    const barrelGeo = new THREE.CylinderGeometry(radius, radius * 0.95, width, 24, 1, true);
    barrelGeo.rotateZ(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, rimMat);
    parent.add(barrel);

    // Center Lock Hub
    const hubGeo = new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, width * 1.05, 16);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, rimMat);
    parent.add(hub);

    // Spokes according to design
    if (design === 'aeroblade') {
      // 5 Aerodynamic Turbine Blades
      const bladeCount = 5;
      for (let i = 0; i < bladeCount; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.02, radius * 0.72, 0.12);
        bladeGeo.rotateY(0.4);
        const blade = new THREE.Mesh(bladeGeo, rimMat);
        blade.position.y = (radius * 0.72) / 2;
        const bladeGroup = new THREE.Group();
        bladeGroup.rotation.x = (i * (Math.PI * 2)) / bladeCount;
        bladeGroup.add(blade);
        parent.add(bladeGroup);
      }
    } else if (design === 'forged') {
      // Split 10-Spoke Lightweight Design
      const spokePairs = 5;
      for (let i = 0; i < spokePairs; i++) {
        const angle = (i * (Math.PI * 2)) / spokePairs;
        [-0.08, 0.08].forEach((offsetAngle) => {
          const spokeGeo = new THREE.CylinderGeometry(0.014, 0.018, radius * 0.8, 8);
          const spoke = new THREE.Mesh(spokeGeo, rimMat);
          spoke.position.y = (radius * 0.8) / 2;
          const spokeGroup = new THREE.Group();
          spokeGroup.rotation.x = angle + offsetAngle;
          spokeGroup.add(spoke);
          parent.add(spokeGroup);
        });
      }
    } else {
      // Carbon Ultralight: 6 Twin Woven Carbon Spokes
      const spokeCount = 6;
      for (let i = 0; i < spokeCount; i++) {
        const spokeGeo = new THREE.BoxGeometry(0.022, radius * 0.78, 0.05);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.position.y = (radius * 0.78) / 2;
        const spokeGroup = new THREE.Group();
        spokeGroup.rotation.x = (i * (Math.PI * 2)) / spokeCount;
        spokeGroup.add(spoke);
        parent.add(spokeGroup);
      }
    }
  }

  /**
   * 6. Contact Ground Shadow (Soft radial contact gradient underneath chassis)
   */
  private buildContactGroundShadow(): void {
    // Generate soft procedural radial shadow map onto a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(canvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowPlaneGeo = new THREE.PlaneGeometry(2.6, 5.2);
    shadowPlaneGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
    shadowPlane.position.set(0, 0.015, 0); // Grounded just above floor
    this.group.add(shadowPlane);
  }

  // ==========================================
  // Public API for Configurator & Interactivity
  // ==========================================

  public setPaintColor(hex: string, roughness?: number, metalness?: number, clearcoat?: number): void {
    this.bodyMaterial.color.set(hex);
    if (roughness !== undefined) this.bodyMaterial.roughness = roughness;
    if (metalness !== undefined) this.bodyMaterial.metalness = metalness;
    if (clearcoat !== undefined) this.bodyMaterial.clearcoat = clearcoat;
  }

  public setInteriorColor(hex: string, accentHex?: string): void {
    this.interiorMaterial.color.set(hex);
  }

  public setWheelDesign(design: WheelDesignId): void {
    if (this.currentWheelDesign === design) return;
    this.currentWheelDesign = design;

    // Update all 4 rim assemblies
    this.wheelGroups.forEach((assembly, index) => {
      const rimGroup = assembly.getObjectByName(`RimGroup_${index}`) as THREE.Group;
      if (rimGroup) {
        const isFront = index < 2;
        const radius = (isFront ? 0.35 : 0.38) * 0.88;
        const width = (isFront ? 0.24 : 0.30) * 0.7;
        this.populateRimDesign(rimGroup, radius, width, design);
      }
    });
  }

  public rotateWheels(delta: number): void {
    this.wheelGroups.forEach((assembly) => {
      assembly.rotation.x += delta;
    });
  }

  public setHeadlightGlow(intensity: number): void {
    this.headlightMaterial.emissiveIntensity = intensity;
  }

  public setTaillightGlow(intensity: number): void {
    this.taillightMaterial.emissiveIntensity = intensity;
  }

  public dispose(): void {
    this.bodyMaterial.dispose();
    this.carbonMaterial.dispose();
    this.glassMaterial.dispose();
    this.interiorMaterial.dispose();
    this.headlightMaterial.dispose();
    this.taillightMaterial.dispose();
    this.caliperMaterial.dispose();
    this.rimMaterials.forEach((mat) => mat.dispose());
  }
}
