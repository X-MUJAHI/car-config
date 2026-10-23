/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ThreeSceneManager } from './three/ThreeSceneManager';
import { TopNav } from './components/TopNav';
import { HeroOverlay } from './components/HeroOverlay';
import { StoryScrollSections } from './components/StoryScrollSections';
import { ConfiguratorDock } from './components/ConfiguratorDock';
import { GallerySection } from './components/GallerySection';
import { ReservationModal } from './components/ReservationModal';
import { SaveConfigModal } from './components/SaveConfigModal';
import { Footer } from './components/Footer';
import {
  VehicleConfiguration,
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  INTERIOR_OPTIONS,
  LIGHTING_PRESETS,
  CameraViewId,
  PaintOption,
  WheelOption,
  InteriorOption,
  LightingOption,
} from './types/automotive';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<ThreeSceneManager | null>(null);

  // Active Vehicle Configuration State
  const [config, setConfig] = useState<VehicleConfiguration>({
    paint: PAINT_OPTIONS[0], // Obsidian Black
    wheel: WHEEL_OPTIONS[0], // Aeroblade
    interior: INTERIOR_OPTIONS[0], // Obsidian Noir
    caliperColor: '#f59e0b',
    lightingPreset: LIGHTING_PRESETS[0], // Obsidian Studio
  });

  const [activeCameraView, setActiveCameraView] = useState<CameraViewId>('three-quarter');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [showConfigurator, setShowConfigurator] = useState<boolean>(true);

  // 1. Initialize Three.js WebGL Scene Once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const manager = new ThreeSceneManager({
      container: canvasMountRef.current,
      onCameraChange: (view) => {
        setActiveCameraView(view);
      },
    });

    sceneManagerRef.current = manager;

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // 2. Configuration Handlers
  const handleUpdatePaint = (paint: PaintOption) => {
    setConfig((prev) => ({ ...prev, paint }));
    sceneManagerRef.current?.setPaint(paint.hex, paint.roughness, paint.metalness, paint.clearcoat);
  };

  const handleUpdateWheel = (wheel: WheelOption) => {
    setConfig((prev) => ({ ...prev, wheel }));
    sceneManagerRef.current?.setWheelDesign(wheel.id);
  };

  const handleUpdateInterior = (interior: InteriorOption) => {
    setConfig((prev) => ({ ...prev, interior }));
    sceneManagerRef.current?.setInterior(interior.colorHex, interior.accentHex);
  };

  const handleUpdateLighting = (lightingPreset: LightingOption) => {
    setConfig((prev) => ({ ...prev, lightingPreset }));
    sceneManagerRef.current?.setLightingPreset(lightingPreset.id);
  };

  const handleUpdateCameraView = (view: CameraViewId) => {
    setActiveCameraView(view);
    sceneManagerRef.current?.setCameraView(view);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      {/* 3D WebGL Canvas Layer (Fixed Background) */}
      <div
        ref={canvasMountRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-auto"
        aria-hidden="true"
      />

      {/* Top Header Navigation */}
      <TopNav
        activeSection={activeSection}
        onOpenConfigurator={() => {
          setShowConfigurator(true);
          scrollToSection('personalization');
        }}
        onOpenReserve={() => setIsReserveModalOpen(true)}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen z-10">
        <HeroOverlay
          onExploreClick={() => scrollToSection('silhouette')}
          onOpenConfigurator={() => {
            setShowConfigurator(true);
            scrollToSection('personalization');
          }}
          onSkipIntro={() => {
            scrollToSection('silhouette');
          }}
        />
      </section>

      {/* Cinematic Scroll Storytelling Sections */}
      <StoryScrollSections
        onCameraChange={handleUpdateCameraView}
        onOpenConfigurator={() => {
          setShowConfigurator(true);
          scrollToSection('personalization');
        }}
        onOpenReserve={() => setIsReserveModalOpen(true)}
        onActiveSectionChange={(section) => setActiveSection(section)}
      />

      {/* Photographic & Architectural Editorial Gallery */}
      <GallerySection />

      {/* Luxury Brand Footer */}
      <Footer />

      {/* Interactive 3D Configurator Dock (Collapsible Bottom Dock) */}
      {showConfigurator && (
        <ConfiguratorDock
          config={config}
          activeCameraView={activeCameraView}
          onUpdatePaint={handleUpdatePaint}
          onUpdateWheel={handleUpdateWheel}
          onUpdateInterior={handleUpdateInterior}
          onUpdateLighting={handleUpdateLighting}
          onUpdateCameraView={handleUpdateCameraView}
          onOpenSaveModal={() => setIsSaveModalOpen(true)}
          onOpenReserveModal={() => setIsReserveModalOpen(true)}
        />
      )}

      {/* Reservation Inquiry Modal */}
      <ReservationModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        config={config}
      />

      {/* Save Configuration Build Sheet Modal */}
      <SaveConfigModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        config={config}
        onProceedToReserve={() => setIsReserveModalOpen(true)}
      />
    </div>
  );
}
