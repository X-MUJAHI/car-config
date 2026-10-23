import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Palette,
  Disc,
  Armchair,
  Sun,
  Eye,
  Check,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import {
  VehicleConfiguration,
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  INTERIOR_OPTIONS,
  LIGHTING_PRESETS,
  CAMERA_VIEWS,
  BASE_VEHICLE_PRICE,
  PaintOption,
  WheelOption,
  InteriorOption,
  LightingOption,
  CameraViewId,
} from '../types/automotive';

interface ConfiguratorDockProps {
  config: VehicleConfiguration;
  activeCameraView: CameraViewId;
  onUpdatePaint: (paint: PaintOption) => void;
  onUpdateWheel: (wheel: WheelOption) => void;
  onUpdateInterior: (interior: InteriorOption) => void;
  onUpdateLighting: (lighting: LightingOption) => void;
  onUpdateCameraView: (view: CameraViewId) => void;
  onOpenSaveModal: () => void;
  onOpenReserveModal: () => void;
}

type TabId = 'paint' | 'wheels' | 'interior' | 'lighting' | 'camera';

export const ConfiguratorDock: React.FC<ConfiguratorDockProps> = ({
  config,
  activeCameraView,
  onUpdatePaint,
  onUpdateWheel,
  onUpdateInterior,
  onUpdateLighting,
  onUpdateCameraView,
  onOpenSaveModal,
  onOpenReserveModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('paint');

  // Calculate total price: Base + Paint delta + Wheel delta + Interior delta
  const optionDelta = config.paint.price + config.wheel.price + config.interior.price;
  const totalPrice = BASE_VEHICLE_PRICE + optionDelta;

  const tabs = [
    { id: 'paint' as TabId, label: 'Finish', icon: Palette },
    { id: 'wheels' as TabId, label: 'Wheels', icon: Disc },
    { id: 'interior' as TabId, label: 'Interior', icon: Armchair },
    { id: 'lighting' as TabId, label: 'Studio', icon: Sun },
    { id: 'camera' as TabId, label: 'Angles', icon: Eye },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-none transition-transform duration-500 ease-out">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-2 pointer-events-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300 bg-[#0c0d12]/90 border border-white/10 rounded-full hover:bg-neutral-800 hover:text-white transition-all backdrop-blur-md shadow-lg cursor-pointer active:scale-95"
          title={isCollapsed ? 'Show Configurator Dock (H)' : 'Hide Controls for Full 3D View (H)'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
              <span>Show Configurator</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              <span>Cinema Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div
        className={`pointer-events-auto bg-[#0a0b10]/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
          isCollapsed ? 'translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Active Selection Badge */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono-numbers text-neutral-400">
            <span>{config.paint.name}</span>
            <span className="text-neutral-400">·</span>
            <span>{config.wheel.name}</span>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[76px] flex items-center justify-center">
          {/* 1. Paint Finishes */}
          {activeTab === 'paint' && (
            <div className="w-full flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {PAINT_OPTIONS.map((paint) => {
                  const isSelected = config.paint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      onClick={() => onUpdatePaint(paint)}
                      className={`group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-transform active:scale-95 cursor-pointer ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: paint.hex }}
                      title={`${paint.name} (${paint.price === 0 ? 'Standard' : `+$${paint.price.toLocaleString()}`})`}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${paint.id === 'pearl-white' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-right text-xs">
                <div className="font-semibold text-white tracking-wide">{config.paint.name}</div>
                <div className="text-neutral-400 font-mono-numbers">
                  {config.paint.price === 0 ? 'Included with Monocoque' : `+$${config.paint.price.toLocaleString()} USD`}
                </div>
              </div>
            </div>
          )}

          {/* 2. Wheels */}
          {activeTab === 'wheels' && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              {WHEEL_OPTIONS.map((wheel) => {
                const isSelected = config.wheel.id === wheel.id;
                return (
                  <button
                    key={wheel.id}
                    onClick={() => onUpdateWheel(wheel)}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 hover:border-white/25 text-neutral-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                      <span>{wheel.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{wheel.diameter}</div>
                    <div className="text-[11px] font-mono-numbers text-neutral-300 mt-1">
                      {wheel.price === 0 ? 'Standard Spec' : `+$${wheel.price.toLocaleString()} USD`}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Interior */}
          {activeTab === 'interior' && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INTERIOR_OPTIONS.map((trim) => {
                const isSelected = config.interior.id === trim.id;
                return (
                  <button
                    key={trim.id}
                    onClick={() => onUpdateInterior(trim)}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 hover:border-white/25 text-neutral-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: trim.colorHex }}
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold uppercase tracking-wider flex items-center justify-between">
                        <span>{trim.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white ml-1" />}
                      </div>
                      <div className="text-[11px] font-mono-numbers text-neutral-300">
                        {trim.price === 0 ? 'Standard Trim' : `+$${trim.price.toLocaleString()} USD`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 4. Studio Lighting Environments */}
          {activeTab === 'lighting' && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LIGHTING_PRESETS.map((light) => {
                const isSelected = config.lightingPreset.id === light.id;
                return (
                  <button
                    key={light.id}
                    onClick={() => onUpdateLighting(light)}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 hover:border-white/25 text-neutral-400 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                      <span>{light.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">{light.tagline}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Camera Viewpoints */}
          {activeTab === 'camera' && (
            <div className="w-full flex items-center justify-center flex-wrap gap-2">
              {CAMERA_VIEWS.map((cam) => {
                const isSelected = activeCameraView === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => onUpdateCameraView(cam.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                );
              })}
              <button
                onClick={() => onUpdateCameraView('free')}
                className={`px-3.5 py-2 rounded-lg text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                  activeCameraView === 'free'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Free 360° Orbit
              </button>
            </div>
          )}
        </div>

        {/* Pricing Summary & Action Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono-numbers">
              Est. Total Build
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono-numbers">
              ${totalPrice.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">USD</span>
            </div>
            {optionDelta > 0 && (
              <span className="text-[11px] text-neutral-400 font-mono-numbers hidden sm:inline">
                (+${optionDelta.toLocaleString()} options)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSaveModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-neutral-200 bg-white/5 border border-white/15 rounded hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
              <span>Save Spec</span>
            </button>

            <button
              onClick={onOpenReserveModal}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black bg-white rounded hover:bg-neutral-200 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
              <span>Request Build</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
