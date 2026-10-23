import React, { useState } from 'react';
import { Sliders, Sparkles, Menu, X } from 'lucide-react';

interface TopNavProps {
  onOpenConfigurator: () => void;
  onOpenReserve: () => void;
  activeSection: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenConfigurator,
  onOpenReserve,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '#hero' },
    { label: 'Narrative', href: '#silhouette' },
    { label: 'Design', href: '#details' },
    { label: 'Telemetry', href: '#performance' },
    { label: 'Gallery', href: '#gallery' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 transition-all duration-300 bg-gradient-to-b from-[#050507]/90 via-[#050507]/40 to-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Clean single-element display text) */}
        <a
          href="#hero"
          className="text-xl sm:text-2xl font-bold tracking-[0.28em] text-white uppercase hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0"
        >
          VANTA
        </a>

        {/* Zone 2: Navigation Links (Clean single-line text links with hover underline) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-[0.16em] uppercase font-medium text-neutral-400">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`hover:text-white transition-colors relative py-1 ${
                activeSection === item.href.replace('#', '') ? 'text-white' : ''
              }`}
            >
              {item.label}
              {activeSection === item.href.replace('#', '') && (
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
              )}
            </a>
          ))}
          <button
            onClick={onOpenConfigurator}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors py-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span>3D Studio</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReserve}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase text-black bg-white rounded hover:bg-neutral-200 transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-neutral-900" />
            <span>VIP Allocation</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-5 rounded-lg bg-[#0b0c10] border border-white/10 flex flex-col gap-4 text-sm tracking-widest uppercase">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-300 hover:text-white py-1"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConfigurator();
            }}
            className="flex items-center gap-2 text-neutral-200 hover:text-white py-1 cursor-pointer text-left"
          >
            <Sliders className="w-4 h-4" />
            <span>3D Studio Configurator</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReserve();
            }}
            className="mt-2 w-full py-2.5 text-xs font-semibold uppercase tracking-widest text-black bg-white rounded cursor-pointer"
          >
            VIP Allocation
          </button>
        </div>
      )}
    </header>
  );
};
