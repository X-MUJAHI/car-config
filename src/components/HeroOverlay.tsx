import React, { useEffect, useState } from 'react';
import { ChevronDown, Sliders, ArrowUpRight } from 'lucide-react';

interface HeroOverlayProps {
  onExploreClick: () => void;
  onOpenConfigurator: () => void;
  onSkipIntro: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  onExploreClick,
  onOpenConfigurator,
  onSkipIntro,
}) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Stage 0: Initial black screen
    // Stage 1: Soft atmospheric sweep (500ms)
    // Stage 2: Vehicle lighting resolves (1200ms)
    // Stage 3: Editorial typography & CTAs appear (2200ms)
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleSkip = () => {
    setStage(3);
    onSkipIntro();
  };

  return (
    <div className="relative w-full h-screen pointer-events-none flex flex-col justify-between p-6 sm:p-12 z-20">
      {/* Intro Blackout Fade Curtain */}
      <div
        className={`fixed inset-0 bg-[#050507] transition-opacity duration-1000 pointer-events-none z-30 ${
          stage >= 1 ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Top status & Skip Intro */}
      <div className="flex items-center justify-between pt-14 sm:pt-16 pointer-events-auto">
        <div
          className={`transition-all duration-1000 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <span className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 font-mono-numbers">
            Concept Monocoque · Electric Gran Turismo
          </span>
        </div>

        {stage < 3 && (
          <button
            onClick={handleSkip}
            className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip Intro
          </button>
        )}
      </div>

      {/* Center Cinematic Editorial Headline & CTA */}
      <div className="my-auto max-w-4xl">
        <div
          className={`space-y-4 transition-all duration-1000 delay-200 ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">
            VANTA Flagship Specification
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.03em] uppercase text-white leading-tight text-balance">
            Beyond The Ordinary.
          </h1>
          <p className="max-w-xl text-neutral-400 text-sm sm:text-base leading-relaxed tracking-wide font-normal">
            Sculpted by aerodynamic necessity. Engineered with quad-motor electric propulsion delivering 1,914 horsepower inside a pure carbon monocoque.
          </p>

          {/* Understated CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4 pointer-events-auto">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-black bg-white rounded hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Explore The Vehicle</span>
              <ChevronDown className="w-4 h-4 text-neutral-900 animate-bounce" />
            </button>

            <button
              onClick={onOpenConfigurator}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-white bg-white/5 border border-white/15 rounded hover:bg-white/10 hover:border-white/30 transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-300" />
              <span>Launch 3D Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Minimal Scroll Indicator & Concept Tag */}
      <div
        className={`flex items-end justify-between transition-all duration-1000 delay-500 pb-2 ${
          stage >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-mono-numbers">
          01 / 06 · Genesis
        </div>

        <button
          onClick={onExploreClick}
          className="pointer-events-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <span>Scroll To Discover</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
