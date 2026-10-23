import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sliders, ShieldCheck } from 'lucide-react';
import { CameraViewId } from '../types/automotive';

interface StoryScrollSectionsProps {
  onCameraChange: (view: CameraViewId) => void;
  onOpenConfigurator: () => void;
  onOpenReserve: () => void;
  onActiveSectionChange: (sectionId: string) => void;
}

export const StoryScrollSections: React.FC<StoryScrollSectionsProps> = ({
  onCameraChange,
  onOpenConfigurator,
  onOpenReserve,
  onActiveSectionChange,
}) => {
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);
  const scene6Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.2,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          onActiveSectionChange(id);

          switch (id) {
            case 'silhouette':
              onCameraChange('side');
              break;
            case 'exterior':
              onCameraChange('three-quarter');
              break;
            case 'details':
              onCameraChange('front');
              break;
            case 'personalization':
              onCameraChange('cockpit');
              break;
            case 'performance':
              onCameraChange('three-quarter');
              break;
            case 'final-reveal':
              onCameraChange('rear');
              break;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const sections = [
      scene1Ref.current,
      scene2Ref.current,
      scene3Ref.current,
      scene4Ref.current,
      scene5Ref.current,
      scene6Ref.current,
    ];

    sections.forEach((sec) => {
      if (sec) observer.observe(sec);
    });

    return () => {
      sections.forEach((sec) => {
        if (sec) observer.unobserve(sec);
      });
    };
  }, [onCameraChange, onActiveSectionChange]);

  return (
    <div className="relative z-10 w-full pointer-events-none">
      {/* ============================================================== */}
      {/* SCENE 1: THE SILHOUETTE */}
      {/* ============================================================== */}
      <section
        id="silhouette"
        ref={scene1Ref}
        className="min-h-screen flex items-center justify-start px-6 sm:px-16 md:px-24 py-20"
      >
        <div className="max-w-xl pointer-events-auto bg-[#050507]/40 p-6 sm:p-8 rounded-lg border border-white/5 backdrop-blur-sm">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-3">
            01 · Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 text-balance">
            Form, Redefined.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            A low-drag silhouette carved from continuous dry carbon fiber. Every contour directs laminar airflow through internal vortex channels, negating the need for disruptive hydraulic flaps while generating 840 kg of high-speed downforce.
          </p>
          <div className="flex items-center gap-6 text-xs tracking-wider uppercase text-neutral-300 font-mono-numbers">
            <div>
              <span className="text-neutral-400 block text-[10px]">Drag Coeff</span>
              <span className="font-semibold text-white">0.218 Cd</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <span className="text-neutral-400 block text-[10px]">Curb Weight</span>
              <span className="font-semibold text-white">1,680 kg</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div>
              <span className="text-neutral-400 block text-[10px]">Downforce</span>
              <span className="font-semibold text-white">840 kg @ 250 km/h</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SCENE 2: THE EXTERIOR */}
      {/* ============================================================== */}
      <section
        id="exterior"
        ref={scene2Ref}
        className="min-h-screen flex items-center justify-end px-6 sm:px-16 md:px-24 py-20"
      >
        <div className="max-w-xl pointer-events-auto bg-[#050507]/40 p-6 sm:p-8 rounded-lg border border-white/5 backdrop-blur-sm">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-3">
            02 · Proportions
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 text-balance">
            Engineered To Move.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Mid-chassis battery distribution creates an optimal 44:56 weight bias. Wide dihedral doors rise forward to reveal a driver-centric monocoque cockpit, anchored by lightweight forged wheels and ceramic multi-piston brakes.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onCameraChange('front')}
              className="px-4 py-2 text-xs uppercase tracking-[0.16em] text-white bg-white/10 border border-white/15 rounded hover:bg-white/20 transition-all cursor-pointer"
            >
              Front Angle
            </button>
            <button
              onClick={() => onCameraChange('rear')}
              className="px-4 py-2 text-xs uppercase tracking-[0.16em] text-white bg-white/10 border border-white/15 rounded hover:bg-white/20 transition-all cursor-pointer"
            >
              Rear Aero
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SCENE 3: PRECISION DETAILS */}
      {/* ============================================================== */}
      <section
        id="details"
        ref={scene3Ref}
        className="min-h-screen flex items-center justify-start px-6 sm:px-16 md:px-24 py-20"
      >
        <div className="max-w-xl pointer-events-auto bg-[#050507]/40 p-6 sm:p-8 rounded-lg border border-white/5 backdrop-blur-sm">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-3">
            03 · Craftsmanship
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 text-balance">
            Crafted At The Limit.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Dual razor LED light signatures slice through atmospheric fog, paired with a continuous ruby rear aero blade inspired by aerodynamic wind tunnels. Micro-perforated carbon-ceramic rotors withstand track temperatures exceeding 1,000°C without brake fade.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono-numbers text-neutral-300 pt-2 border-t border-white/10">
            <div>
              <span className="text-neutral-400 text-[10px] block uppercase">Optics</span>
              Matrix Laser LED Projectors
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] block uppercase">Brake Package</span>
              420mm Carbon-Ceramic 6-Piston
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SCENE 4: PERSONALIZATION (CONFIGURATOR HOOK) */}
      {/* ============================================================== */}
      <section
        id="personalization"
        ref={scene4Ref}
        className="min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 text-center"
      >
        <div className="max-w-2xl pointer-events-auto bg-[#050507]/60 p-8 sm:p-12 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-3">
            04 · Bespoke Configuration
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 text-balance">
            Sculpted To Your Specification.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Tailor exterior lacquer finishes, forged turbine wheels, handcrafted cockpit upholstery, and curated studio lighting environments in real-time.
          </p>
          <button
            onClick={onOpenConfigurator}
            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase text-black bg-white rounded hover:bg-neutral-200 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-neutral-900" />
            <span>Launch Interactive 3D Configurator</span>
            <ArrowRight className="w-4 h-4 text-neutral-900" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SCENE 5: PERFORMANCE */}
      {/* ============================================================== */}
      <section
        id="performance"
        ref={scene5Ref}
        className="min-h-screen flex items-center justify-center px-6 sm:px-12 py-20"
      >
        <div className="w-full max-w-5xl pointer-events-auto bg-[#050507]/60 p-8 sm:p-12 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="text-center mb-10">
            <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-2">
              05 · Telemetry Benchmarks
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white text-balance">
              Instantaneous Propulsion.
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm uppercase tracking-widest mt-2">
              Concept Engineering Specifications · Verified Virtual Aerodynamic Telemetry
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pt-4 border-t border-white/10 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono-numbers">
                1.84<span className="text-base sm:text-xl text-neutral-400 font-normal">s</span>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2">
                0–100 km/h
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">With rollout allowance</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono-numbers">
                1,914<span className="text-base sm:text-xl text-neutral-400 font-normal">hp</span>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2">
                Peak Output
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Quad Permanent Magnet</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono-numbers">
                412<span className="text-base sm:text-xl text-neutral-400 font-normal">km/h</span>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2">
                Top Speed
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Electronically Governed</div>
            </div>

            <div className="p-4">
              <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono-numbers">
                520<span className="text-base sm:text-xl text-neutral-400 font-normal">km</span>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-400 mt-2">
                WLTP Range
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">98 kWh Solid-State Cell</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SCENE 6: FINAL REVEAL */}
      {/* ============================================================== */}
      <section
        id="final-reveal"
        ref={scene6Ref}
        className="min-h-screen flex items-center justify-center px-6 sm:px-12 py-20 text-center"
      >
        <div className="max-w-3xl pointer-events-auto bg-[#050507]/60 p-8 sm:p-14 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-3">
            06 · The Horizon
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white mb-6 text-balance">
            Your Drive. Your Signature.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Limited to 99 bespoke production chassis worldwide. Each allocation is individually tailored with bespoke concierge delivery and track commissioning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenConfigurator}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-black bg-white rounded hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-neutral-900" />
              <span>Configure Your Vanta</span>
            </button>

            <button
              onClick={onOpenReserve}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-white bg-white/10 border border-white/20 rounded hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
              <span>Request VIP Allocation</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
