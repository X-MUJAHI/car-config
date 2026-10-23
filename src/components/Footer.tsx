import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050507] py-16 px-6 sm:px-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-xl font-bold tracking-[0.3em] uppercase text-white mb-2">
            VANTA
          </div>
          <p className="max-w-md text-neutral-400 text-[11px] leading-relaxed">
            The high-performance electric automotive concept. Engineered at the intersection of computational fluid dynamics, carbon monocoque architecture, and minimalist automotive luxury.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-widest font-mono-numbers">
          <a href="#hero" className="hover:text-white transition-colors">Overview</a>
          <a href="#silhouette" className="hover:text-white transition-colors">Narrative</a>
          <a href="#performance" className="hover:text-white transition-colors">Telemetry</a>
          <a href="#gallery" className="hover:text-white transition-colors">Anthology</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-mono-numbers text-neutral-400">
        <div>
          © {new Date().getFullYear()} VANTA AUTOMOTIVE S.A. ALL RIGHTS RESERVED.
        </div>
        <div>
          CONCEPT SPECIFICATIONS · TRACK VERIFIED · FIA HOMOLOGATION PENDING
        </div>
      </div>
    </footer>
  );
};
