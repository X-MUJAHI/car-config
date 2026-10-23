import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HypercarModel } from './HypercarModel';
import { StudioLighting } from './StudioLighting';
import { CameraViewId, LightingPresetId, WheelDesignId } from '../types/automotive';

// Pre-allocated math vectors for zero GC in render loop
const _targetVec = new THREE.Vector3();
const _posVec = new THREE.Vector3();

export interface SceneManagerOptions {
  container: HTMLDivElement;
  onCameraChange?: (view: CameraViewId) => void;
  onSceneReady?: () => void;
}

export class ThreeSceneManager {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private hypercar: HypercarModel;
  private lighting: StudioLighting;
  private frameId: number = 0;
  private isDisposed: boolean = false;
  private isSoftwareGl: boolean = false;

  // Camera Motion & Orbit State
  private targetCameraPos: THREE.Vector3 = new THREE.Vector3(4.4, 1.35, 4.4);
  private targetLookAt: THREE.Vector3 = new THREE.Vector3(0, 0.45, 0);
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 0.45, 0);
  private currentCameraView: CameraViewId = 'hero';

  // Interactive Orbit Variables (Manual dragging)
  private isDragging: boolean = false;
  private previousMousePosition = { x: 0, y: 0 };
  private spherical: THREE.Spherical = new THREE.Spherical(6.2, Math.PI / 2.8, Math.PI / 4);
  private targetSpherical: THREE.Spherical = new THREE.Spherical(6.2, Math.PI / 2.8, Math.PI / 4);
  private lastUserInteractionTime: number = Date.now();
  private autoRotateEnabled: boolean = true;

  // Options callbacks
  private onCameraChange?: (view: CameraViewId) => void;
  private onSceneReady?: () => void;

  constructor(options: SceneManagerOptions) {
    this.container = options.container;
    this.onCameraChange = options.onCameraChange;
    this.onSceneReady = options.onSceneReady;

    // 1. Detect Software WebGL
    this.isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // 3. Initialize Scene, Camera & Environment
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#050507');
    this.scene.fog = new THREE.FogExp2('#050507', 0.035);

    this.camera = new THREE.PerspectiveCamera(
      38,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      100
    );
    this.camera.position.copy(this.targetCameraPos);
    this.camera.lookAt(this.currentLookAt);

    // Procedural Studio Environment Map using RoomEnvironment & PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = envTexture;
    pmremGenerator.dispose();

    // 4. Assemble Studio Lighting Rig & Hypercar Model
    this.lighting = new StudioLighting();
    this.scene.add(this.lighting.group);

    this.hypercar = new HypercarModel();
    this.scene.add(this.hypercar.group);

    // 5. Setup Drag / Orbit Event Listeners
    this.setupInteractionListeners();

    // 6. Pre-warm shaders
    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    // 7. Start Render Loop
    this.startAnimationLoop();

    if (this.onSceneReady) {
      this.onSceneReady();
    }
  }

  /**
   * Interactive Orbit / Touch gesture controls
   */
  private setupInteractionListeners(): void {
    const el = this.renderer.domElement;

    const onPointerDown = (clientX: number, clientY: number) => {
      this.isDragging = true;
      this.lastUserInteractionTime = Date.now();
      this.previousMousePosition = { x: clientX, y: clientY };
      if (this.currentCameraView !== 'free') {
        this.currentCameraView = 'free';
        this.onCameraChange?.('free');
      }
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!this.isDragging) return;
      this.lastUserInteractionTime = Date.now();

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      // Adjust spherical coordinates
      const sensitivity = 0.005;
      this.targetSpherical.theta -= deltaX * sensitivity;
      this.targetSpherical.phi -= deltaY * sensitivity;

      // Constrain elevation angle (phi) so camera doesn't flip or plunge through floor
      this.targetSpherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, this.targetSpherical.phi));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    // Mouse events
    el.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    // Touch events
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

    // Wheel zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.lastUserInteractionTime = Date.now();
      const zoomFactor = e.deltaY * 0.0025;
      this.targetSpherical.radius = THREE.MathUtils.clamp(
        this.targetSpherical.radius + zoomFactor,
        2.8,
        9.5
      );
      if (this.currentCameraView !== 'free') {
        this.currentCameraView = 'free';
        this.onCameraChange?.('free');
      }
    }, { passive: false });

    // Window Resize
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    if (this.isDisposed || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  /**
   * Continuous Render Loop with silky smooth exponential damping
   */
  private startAnimationLoop(): void {
    let lastTime = performance.now();

    const tick = () => {
      if (this.isDisposed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Auto-rotation when idle for > 4 seconds
      const isIdle = Date.now() - this.lastUserInteractionTime > 4000;
      if (isIdle && this.autoRotateEnabled && !this.isDragging) {
        this.targetSpherical.theta += dt * 0.14;
      }

      // Smooth exponential damping on spherical coordinates (k = 8.0)
      const dampFactor = 1 - Math.exp(-8.0 * dt);
      this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * dampFactor;
      this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * dampFactor;
      this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * dampFactor;

      // In free orbit mode, convert spherical coords relative to target lookAt
      if (this.currentCameraView === 'free') {
        _posVec.setFromSpherical(this.spherical).add(this.currentLookAt);
        this.camera.position.lerp(_posVec, dampFactor);
      } else {
        // Preset camera transition
        this.camera.position.lerp(this.targetCameraPos, dampFactor);
        // Sync spherical target so switching to free orbit is seamless
        _posVec.subVectors(this.camera.position, this.targetLookAt);
        this.targetSpherical.setFromVector3(_posVec);
        this.spherical.copy(this.targetSpherical);
      }

      // Damped camera lookAt
      this.currentLookAt.lerp(this.targetLookAt, dampFactor);
      this.camera.lookAt(this.currentLookAt);

      // Render scene
      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  // ==========================================
  // Public Methods for App / Configurator
  // ==========================================

  public setCameraView(viewId: CameraViewId): void {
    this.currentCameraView = viewId;
    this.lastUserInteractionTime = Date.now();

    switch (viewId) {
      case 'hero':
      case 'three-quarter':
        this.targetCameraPos.set(4.4, 1.35, 4.4);
        this.targetLookAt.set(0, 0.45, 0);
        this.camera.fov = 38;
        break;
      case 'front':
        this.targetCameraPos.set(0, 0.95, 5.6);
        this.targetLookAt.set(0, 0.45, 0);
        this.camera.fov = 36;
        break;
      case 'side':
        this.targetCameraPos.set(6.4, 0.88, 0);
        this.targetLookAt.set(0, 0.45, 0);
        this.camera.fov = 34;
        break;
      case 'rear':
        this.targetCameraPos.set(-3.8, 1.25, -4.6);
        this.targetLookAt.set(0, 0.45, 0);
        this.camera.fov = 38;
        break;
      case 'cockpit':
        this.targetCameraPos.set(1.3, 1.18, 0.8);
        this.targetLookAt.set(0, 0.62, 0.1);
        this.camera.fov = 44;
        break;
      case 'free':
        // Keep current pos
        break;
    }
    this.camera.updateProjectionMatrix();
    this.onCameraChange?.(viewId);
  }

  /**
   * Set custom camera waypoint directly (used by scroll controller)
   */
  public setScrollCameraState(
    posX: number,
    posY: number,
    posZ: number,
    targetX: number,
    targetY: number,
    targetZ: number,
    fov: number = 38
  ): void {
    if (this.currentCameraView === 'free' && this.isDragging) return;
    this.targetCameraPos.set(posX, posY, posZ);
    this.targetLookAt.set(targetX, targetY, targetZ);
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
  }

  public setPaint(hex: string, roughness?: number, metalness?: number, clearcoat?: number): void {
    this.hypercar.setPaintColor(hex, roughness, metalness, clearcoat);
  }

  public setInterior(hex: string, accentHex?: string): void {
    this.hypercar.setInteriorColor(hex, accentHex);
  }

  public setWheelDesign(design: WheelDesignId): void {
    this.hypercar.setWheelDesign(design);
  }

  public setLightingPreset(presetId: LightingPresetId): void {
    this.lighting.setPreset(presetId);
    if (presetId === 'noir') {
      this.scene.background = new THREE.Color('#050507');
      this.scene.fog = new THREE.FogExp2('#050507', 0.035);
    } else if (presetId === 'silver') {
      this.scene.background = new THREE.Color('#0c0e12');
      this.scene.fog = new THREE.FogExp2('#0c0e12', 0.035);
    } else if (presetId === 'sunset') {
      this.scene.background = new THREE.Color('#090504');
      this.scene.fog = new THREE.FogExp2('#090504', 0.035);
    }
  }

  public setAutoRotate(enabled: boolean): void {
    this.autoRotateEnabled = enabled;
  }

  public dispose(): void {
    this.isDisposed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.handleResize);

    this.hypercar.dispose();
    this.lighting.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
