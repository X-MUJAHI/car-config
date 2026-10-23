/**
 * Types and configuration constants for VANTA Automotive Experience
 */

export type PaintFinishId = 
  | 'obsidian-black'
  | 'titanium-silver'
  | 'pearl-white'
  | 'racing-red'
  | 'midnight-blue'
  | 'emerald-signature';

export interface PaintOption {
  id: PaintFinishId;
  name: string;
  hex: string;
  finish: 'metallic' | 'gloss' | 'matte';
  price: number;
  description: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
}

export type WheelDesignId = 'aeroblade' | 'forged' | 'carbon';

export interface WheelOption {
  id: WheelDesignId;
  name: string;
  description: string;
  diameter: string;
  material: string;
  price: number;
}

export type InteriorTrimId = 'obsidian-leather' | 'ivory-minimalist' | 'crimson-sport';

export interface InteriorOption {
  id: InteriorTrimId;
  name: string;
  colorHex: string;
  accentHex: string;
  price: number;
  description: string;
}

export type LightingPresetId = 'noir' | 'silver' | 'sunset';

export interface LightingOption {
  id: LightingPresetId;
  name: string;
  tagline: string;
  backgroundHex: string;
  floorRoughness: number;
  accentGlow: string;
}

export type CameraViewId = 
  | 'hero'
  | 'three-quarter'
  | 'front'
  | 'side'
  | 'rear'
  | 'cockpit'
  | 'free';

export interface CameraViewConfig {
  id: CameraViewId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface VehicleConfiguration {
  paint: PaintOption;
  wheel: WheelOption;
  interior: InteriorOption;
  caliperColor: string;
  lightingPreset: LightingOption;
}

export const PAINT_OPTIONS: PaintOption[] = [
  {
    id: 'obsidian-black',
    name: 'Obsidian Black',
    hex: '#0a0a0c',
    finish: 'metallic',
    price: 0,
    description: 'Deep multi-stage black with diamond pearl flake and ultra-gloss clearcoat.',
    roughness: 0.18,
    metalness: 0.9,
    clearcoat: 1.0,
  },
  {
    id: 'titanium-silver',
    name: 'Titanium Silver',
    hex: '#c0c5cb',
    finish: 'metallic',
    price: 18000,
    description: 'Liquid titanium finish reflecting ambient studio lighting with razor highlights.',
    roughness: 0.15,
    metalness: 0.95,
    clearcoat: 1.0,
  },
  {
    id: 'pearl-white',
    name: 'Ghost White',
    hex: '#f0f3f6',
    finish: 'metallic',
    price: 14000,
    description: 'Triple-layer satin pearl with subtle cool ceramic undertones.',
    roughness: 0.22,
    metalness: 0.82,
    clearcoat: 0.9,
  },
  {
    id: 'racing-red',
    name: 'Monza Crimson',
    hex: '#960d16',
    finish: 'metallic',
    price: 24000,
    description: 'Electrifying deep candy red with intense sunlight luster and dark shadows.',
    roughness: 0.17,
    metalness: 0.88,
    clearcoat: 1.0,
  },
  {
    id: 'midnight-blue',
    name: 'Abyssal Cobalt',
    hex: '#0b1b36',
    finish: 'metallic',
    price: 22000,
    description: 'High-density nautical blue shifting from inky black to vivid cobalt under light.',
    roughness: 0.16,
    metalness: 0.92,
    clearcoat: 1.0,
  },
  {
    id: 'emerald-signature',
    name: 'Vanta Signature Emerald',
    hex: '#0c2e22',
    finish: 'metallic',
    price: 36000,
    description: 'Exclusive heritage deep racing emerald infused with micro-gold specks.',
    roughness: 0.15,
    metalness: 0.94,
    clearcoat: 1.0,
  },
];

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: 'aeroblade',
    name: 'AeroBlade 21"',
    description: 'Turbine aero forged blades engineered for laminar drag reduction.',
    diameter: '21" Front / 22" Rear',
    material: 'Forged Monoblock Alloy',
    price: 0,
  },
  {
    id: 'forged',
    name: 'Forged Split-10',
    description: 'Aggressive skeletal ten-spoke architecture showcasing carbon ceramic discs.',
    diameter: '21" Front / 22" Rear',
    material: 'Aerospace Grade 6061-T6',
    price: 28000,
  },
  {
    id: 'carbon',
    name: 'Carbon Ultralight',
    description: 'Full woven carbon-fiber barrel with titanium center-lock fastening.',
    diameter: '20" Front / 21" Rear',
    material: 'Full Dry Carbon Fiber',
    price: 48000,
  },
];

export const INTERIOR_OPTIONS: InteriorOption[] = [
  {
    id: 'obsidian-leather',
    name: 'Obsidian Noir',
    colorHex: '#141416',
    accentHex: '#f59e0b',
    price: 0,
    description: 'Semi-aniline Italian leather with exposed carbon fiber and amber micro-stitch.',
  },
  {
    id: 'ivory-minimalist',
    name: 'Nordic Ivory',
    colorHex: '#e8e6df',
    accentHex: '#71717a',
    price: 16000,
    description: 'Architectural pale ivory vegan leather with brushed platinum accents.',
  },
  {
    id: 'crimson-sport',
    name: 'Crimson Rosso',
    colorHex: '#800c14',
    accentHex: '#ffffff',
    price: 26000,
    description: 'Alcantara race cockpit in rich scarlet with contrasting white titanium piping.',
  },
];

export const LIGHTING_PRESETS: LightingOption[] = [
  {
    id: 'noir',
    name: 'Obsidian Studio',
    tagline: 'Dark cinematic showroom with electric blue floor reflections',
    backgroundHex: '#050507',
    floorRoughness: 0.16,
    accentGlow: '#0066ff',
  },
  {
    id: 'silver',
    name: 'Soft Silver',
    tagline: 'High-key photographic daylight pavilion with balanced neutral rim',
    backgroundHex: '#0c0e12',
    floorRoughness: 0.22,
    accentGlow: '#e2e8f0',
  },
  {
    id: 'sunset',
    name: 'Sunset Horizon',
    tagline: 'Dramatic amber backlighting with warm flame-tinted silhouette',
    backgroundHex: '#090504',
    floorRoughness: 0.14,
    accentGlow: '#f97316',
  },
];

export const CAMERA_VIEWS: CameraViewConfig[] = [
  {
    id: 'three-quarter',
    label: '3/4 Dynamic',
    position: [4.4, 1.35, 4.4],
    target: [0, 0.45, 0],
    fov: 38,
  },
  {
    id: 'front',
    label: 'Front Stance',
    position: [0, 0.95, 5.8],
    target: [0, 0.45, 0],
    fov: 36,
  },
  {
    id: 'side',
    label: 'Side Profile',
    position: [6.4, 0.9, 0],
    target: [0, 0.45, 0],
    fov: 34,
  },
  {
    id: 'rear',
    label: 'Rear Aero',
    position: [-3.8, 1.25, -4.6],
    target: [0, 0.45, 0],
    fov: 38,
  },
  {
    id: 'cockpit',
    label: 'Cockpit View',
    position: [1.3, 1.2, 0.8],
    target: [0, 0.65, 0.1],
    fov: 44,
  },
];

export const BASE_VEHICLE_PRICE = 2850000; // USD
