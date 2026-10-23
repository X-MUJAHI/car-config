import * as THREE from 'three';
import { LightingPresetId } from '../types/automotive';

/**
 * Cinematic Studio Lighting Rig & Environment Management for VANTA
 * Features 3-point studio lighting, high-contrast rim backlights, and reflective studio ground.
 */
export class StudioLighting {
  public group: THREE.Group;
  public floorMesh: THREE.Mesh;
  public floorMaterial: THREE.MeshStandardMaterial;

  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.HemisphereLight;
  private rimLightLeft: THREE.SpotLight;
  private rimLightRight: THREE.SpotLight;
  private underglowLight: THREE.PointLight;
  private topSoftbox: THREE.DirectionalLight;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'StudioLightingRig';

    // 1. Studio Reflective Floor (Infinite circular disc or large plane)
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    floorGeo.rotateX(-Math.PI / 2);

    this.floorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#07080b'),
      roughness: 0.16,
      metalness: 0.88,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, this.floorMaterial);
    this.floorMesh.position.y = 0;
    this.floorMesh.receiveShadow = true;
    this.group.add(this.floorMesh);

    // 2. Key Light (Main soft shadow caster)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    this.keyLight.position.set(4, 7, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -4;
    this.keyLight.shadow.camera.right = 4;
    this.keyLight.shadow.camera.top = 4;
    this.keyLight.shadow.camera.bottom = -4;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.02;
    this.group.add(this.keyLight);

    // 3. Hemisphere Fill Light (Cool sky / warm ground contrast)
    this.fillLight = new THREE.HemisphereLight(0x232d3f, 0x07080b, 1.4);
    this.group.add(this.fillLight);

    // 4. Dual Rim Backlights (Grazing angle rim light for silhouette separation)
    this.rimLightLeft = new THREE.SpotLight(0x93c5fd, 7.5);
    this.rimLightLeft.position.set(5.5, 2.2, -6.5);
    this.rimLightLeft.angle = Math.PI / 4;
    this.rimLightLeft.penumbra = 0.8;
    this.group.add(this.rimLightLeft);

    this.rimLightRight = new THREE.SpotLight(0x93c5fd, 7.5);
    this.rimLightRight.position.set(-5.5, 2.2, -6.5);
    this.rimLightRight.angle = Math.PI / 4;
    this.rimLightRight.penumbra = 0.8;
    this.group.add(this.rimLightRight);

    // 5. Overhead Softbox Light (Subtle overhead car roof reflection)
    this.topSoftbox = new THREE.DirectionalLight(0xe2e8f0, 1.2);
    this.topSoftbox.position.set(0, 10, 0);
    this.group.add(this.topSoftbox);

    // 6. Underbody Floor Ambient Glow (Signature showroom effect)
    this.underglowLight = new THREE.PointLight(0x0077ff, 2.0, 6.0);
    this.underglowLight.position.set(0, 0.08, 0);
    this.group.add(this.underglowLight);
  }

  /**
   * Smoothly switch between curated studio lighting environments
   */
  public setPreset(preset: LightingPresetId): void {
    if (preset === 'noir') {
      // Obsidian Noir: Deep contrast, cool rim, cyan-tinted floor reflection
      this.keyLight.color.set('#ffffff');
      this.keyLight.intensity = 2.6;
      this.fillLight.color.set('#1e293b');
      this.fillLight.groundColor.set('#050507');
      this.fillLight.intensity = 1.2;

      this.rimLightLeft.color.set('#60a5fa');
      this.rimLightLeft.intensity = 7.0;
      this.rimLightRight.color.set('#60a5fa');
      this.rimLightRight.intensity = 7.0;

      this.underglowLight.color.set('#0066ff');
      this.underglowLight.intensity = 2.2;

      this.floorMaterial.color.set('#050508');
      this.floorMaterial.roughness = 0.16;
    } else if (preset === 'silver') {
      // Soft Silver: High-key photography studio, crisp neutral reflections
      this.keyLight.color.set('#f8fafc');
      this.keyLight.intensity = 3.8;
      this.fillLight.color.set('#cbd5e1');
      this.fillLight.groundColor.set('#1e2025');
      this.fillLight.intensity = 2.2;

      this.rimLightLeft.color.set('#ffffff');
      this.rimLightLeft.intensity = 5.0;
      this.rimLightRight.color.set('#ffffff');
      this.rimLightRight.intensity = 5.0;

      this.underglowLight.color.set('#e2e8f0');
      this.underglowLight.intensity = 1.2;

      this.floorMaterial.color.set('#14171d');
      this.floorMaterial.roughness = 0.22;
    } else if (preset === 'sunset') {
      // Sunset Horizon: Warm amber, flame backlighting inspired by SLS AMG reference
      this.keyLight.color.set('#fed7aa');
      this.keyLight.intensity = 2.8;
      this.fillLight.color.set('#ea580c');
      this.fillLight.groundColor.set('#1c0d06');
      this.fillLight.intensity = 1.6;

      this.rimLightLeft.color.set('#f97316');
      this.rimLightLeft.intensity = 10.0;
      this.rimLightRight.color.set('#fbbf24');
      this.rimLightRight.intensity = 10.0;

      this.underglowLight.color.set('#f97316');
      this.underglowLight.intensity = 3.0;

      this.floorMaterial.color.set('#0d0705');
      this.floorMaterial.roughness = 0.14;
    }
  }

  public dispose(): void {
    this.floorMaterial.dispose();
  }
}
