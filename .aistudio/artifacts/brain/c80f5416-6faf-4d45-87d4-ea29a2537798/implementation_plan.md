# VANTA — A Cinematic 3D Automotive Experience

An ultra-premium, dark, cinematic automotive web platform showcasing VANTA, a visionary mid-engine electric hypercar. The experience seamlessly merges real-time Three.js 3D rendering, physically based lighting, scroll-choreographed cinematic reveals, and a dedicated interactive vehicle configurator with real-time paint, wheel, interior, and studio lighting customization.

> [!IMPORTANT]
> **Confirmed Design & Architecture Decisions:**
> - **Vehicle Archetype**: Mid-engine electric hypercar with dramatic dihedral lines, sculpted side aero channels, front splitters, and an active rear aerodynamic diffuser.
> - **Lighting Rig**: Obsidian Noir studio preset as default (razor-thin cinematic rim lighting and specular wet floor reflections) alongside switchable Soft Silver and Warm Sunset lighting environments.
> - **Interaction Pattern**: Seamless hybrid architecture where the cinematic scroll storytelling guides the visitor through choreographed vehicle angles, and seamlessly transitions into an unconstrained 3D Studio Configurator with an ergonomic, non-occluding collapsible bottom dock.

---

## 1. Overview & Core Concept

- **What It Does**: VANTA delivers an immersive digital showroom experience. Visitors experience an art-directed cinematic reveal of the hypercar, journey through a scroll-driven visual narrative highlighting form, aerodynamic details, and track performance, and take total control in an interactive 3D configurator to customize paint finishes, wheel designs, interior upholstery, and studio lighting presets.
- **Target Audience / Persona**: Automotive connoisseurs, hypercar collectors, luxury design enthusiasts, and experimental web design admirers expecting AAA-tier visual execution, responsive 60fps interaction, and zero fluff.
- **Key Value**: Replaces conventional flat automotive product grids with a bespoke real-time 3D interactive showcase built to the standard of high-end automotive launch commercials.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Cinematic Hero Reveal**:
   - The page begins in near-total darkness.
   - A soft atmospheric sweep and razor-thin rim light trace the silhouette of the car.
   - The camera glides into a low-angle three-quarter stance while the VANTA wordmark and "BEYOND THE ORDINARY" headline resolve.
   - Visitors can immediately interact with the 3D model, scroll to begin the narrative journey, click "Explore the Vehicle", or toggle "Skip Intro".

2. **Scroll-Driven Storytelling Sequence**:
   - **Scene 1 (Silhouette)**: Side profile emerges from deep graphite shadows (*"FORM, REDEFINED."*).
   - **Scene 2 (Exterior)**: Camera orbits around the vehicle to showcase proportional stance and dihedral aero ducts (*"ENGINEERED TO MOVE."*).
   - **Scene 3 (Precision Details)**: Close-up focus on front LED optics, forged wheels, and rear active aero wing (*"CRAFTED AT THE LIMIT."*).
   - **Scene 4 (Interactive Configurator)**: Camera moves to a 3/4 studio angle; the interactive customization dock expands smoothly.
   - **Scene 5 (Performance Benchmark)**: High-speed concept specifications with animated telemetry reveals (0–100 km/h in 1.84s, 1,914 HP, 412 km/h top speed, 520 km range).
   - **Scene 6 (Final Climax & Reservation)**: Grand wide angle reveal (*"YOUR DRIVE. YOUR SIGNATURE."*) with CTAs to configure or request VIP allocation.

3. **Interactive Configurator Studio**:
   - **Paint Swatches**: Obsidian Black, Titanium Silver, Pearl White, Racing Red, Midnight Blue, and Signature Emerald. Real-time shader updates with metallic clearcoat reflections.
   - **Wheel Options**: Aeroblade Turbines, Forged Multi-spoke, Carbon Ultralight.
   - **Interior Trims**: Carbon Obsidian, Ivory Minimalist, Crimson Sport.
   - **Lighting Presets**: Obsidian Noir, Soft Silver Photographic, Sunset Horizon.
   - **Camera Presets**: Front, 3/4 Perspective, Side, Rear Aero, Cockpit/Detail.
   - **Free Orbit & Zoom**: Smooth mouse/touch drag with exponential damping.
   - **Live Pricing Calculation & Save Sheet**: Updates total configuration estimate and exports a branded build summary.

### Visual Identity & Theme

- **Palette**:
  - Deep Canvas: `#050507` (Obsidian Base), `#0C0D11` (Graphite Surface)
  - Structural Borders: `rgba(255, 255, 255, 0.08)` (Hairline precision)
  - Typography: Pure White `#FFFFFF`, Muted Silver `#8E929E`
  - High-Intent Accents: Electric Amber `#F59E0B` (Calipers / Indicator accents), Titanium Chrome `#E2E8F0`
- **Typography**:
  - Display / Hero: Refined Geometric Sans (`Plus Jakarta Sans` / `Outfit` in wide tracking and balanced line lengths)
  - Technical / Specs: Tabular Monospace (`JetBrains Mono` / `Space Mono`, `tabular-nums`)
  - Body: Modern legible sans (`Plus Jakarta Sans` 400/500)
- **Component Styling & Layout**:
  - Full-bleed 3D viewport canvas.
  - Collapsible horizontal bottom dock (maximum 15% viewport height, zero side-panel occlusion) allowing 100% unobstructed appreciation of the 3D vehicle.
  - Strict Top Bar Contract: 3 distinct zones (Wordmark, single-line nav links, VIP Allocation CTA).

---

## 3. Key Product Decisions & Trade-Offs

- **Procedural 3D Composite Model vs. Remote Assets**:
  - *Chosen Approach*: Build a rich, multi-part procedural hypercar model using Three.js composite geometries (extruded body silhouette, aerodynamic fenders, sculpted cockpit canopy, high-gloss windshield, functional multi-spoke wheel assemblies with calipers, active rear wing, LED headlight and taillight optics).
  - *Why*: Eliminates 404 dependencies, broken external CDNs, and long asset download times while guaranteeing instant, reliable, 60fps load times across all devices.
- **Single Canvas Render Pipeline with Coalesced Render on Demand**:
  - *Chosen Approach*: One central Three.js canvas managed via a persistent ref container. The animation loop uses exponential damping (`1 - Math.exp(-k * dt)`) and software WebGL guards (`isSoftwareGl` detection) for silky smooth interaction on all hardware.
  - *Why*: Prevents canvas rebuilds, WebGL context loss, and memory leaks during React state changes or tab navigation.
- **ScrollTrigger + Live Camera Lerping**:
  - *Chosen Approach*: Use smooth programmatic interpolation between cinematic scroll waypoints and allow direct user intervention when entering Free Orbit or Configurator modes.
  - *Why*: Ensures visitor scroll controls feel natural without locking the screen or feeling disjointed.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             VANTA App Root                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Top Bar (Wordmark  —  Explore · Specs · Gallery · Studio  —  VIP Reserve)  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        Three.js Scene Canvas (Fixed)                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ • Procedural Hypercar (Group: Body, Aero, Glass, Wheels, Lighting)  │   │
│   │ • Studio Lighting Rig (Key Light, Hemisphere Fill, Rim Spotlights) │   │
│   │ • Reflective Floor & Contact Ground Shadow                          │   │
│   │ • Camera Controller (Smooth Damped Orbit + Cinematic Waypoints)     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                    Scroll Storytelling Narrative Layers                     │
│   [Scene 1: Silhouette] ➔ [Scene 2: Exterior] ➔ [Scene 3: Precision]        │
│   ➔ [Scene 4: Configurator Hook] ➔ [Scene 5: Telemetry] ➔ [Scene 6: Climax] │
├─────────────────────────────────────────────────────────────────────────────┤
│             Interactive Configurator Overlay (Collapsible Dock)              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Swatches (Paint) │ Wheel Styles │ Interior Trim │ Studio Environments│  │
│   │ Camera Angle Presets │ Pricing Calculator │ Save Build Summary Modal │  │
│   └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Secondary Editorial Modules: Gallery Lightbox, Concept Telemetry, Reserve  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Management & Interactions

- **`ConfiguratorState`**:
  - `paintColor`: Current body finish hex, clearcoat roughness, and metalness.
  - `wheelDesign`: Active wheel geometry variant and rim finish.
  - `interiorStyle`: Cockpit upholstery and accent stitching color.
  - `lightingPreset`: Active studio lighting environment (Noir, Silver, Sunset).
  - `cameraView`: Active perspective (`three-quarter`, `front`, `side`, `rear`, `cockpit`, `free`).
  - `mode`: Navigation mode (`story` vs. `studio`).
  - `basePrice`: $2,850,000 USD + calculated dynamic options delta.
- **Event Handling**:
  - Pointer/Touch drag on 3D canvas triggers smooth orbit and automatically pauses auto-rotation.
  - Color swatch clicks initiate smooth material lerping.
  - Camera view buttons smoothly glide the camera to target coordinates without jarring cuts.
  - Reservation form provides immediate inline validation, allocation tier assignment, and a printable VIP confirmation pass.
