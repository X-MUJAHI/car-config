import React, { useState } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  perspective: string;
}

export const GallerySection: React.FC = () => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      src: '/assets/aistudio/Screenshot_20261023_080453_1447b090.jpg',
      title: 'Obsidian Stance',
      subtitle: 'Dynamic three-quarter profile under focused studio rim lighting',
      perspective: '3/4 Dynamic Angle',
    },
    {
      id: 'g2',
      src: '/assets/aistudio/Screenshot_20261023_080503_8f03b6b9.jpg',
      title: 'Aero Silhouette',
      subtitle: 'Sculpted carbon door channels and dihedral aerodynamic taper',
      perspective: 'Horizontal Side Profile',
    },
    {
      id: 'g3',
      src: '/assets/aistudio/Screenshot_20261023_080507_f3cb67d3.jpg',
      title: 'Aero Light Blade',
      subtitle: 'Continuous wind-tunnel inspired aerodynamic light loops',
      perspective: 'Rear Aerodynamic Diffuser',
    },
    {
      id: 'g4',
      src: '/assets/aistudio/Screenshot_20261023_080518_0e590076.jpg',
      title: 'Monza Flame Horizon',
      subtitle: 'Warm sunset atmosphere celebrating internal thermal harmony',
      perspective: 'Direct Front Stance',
    },
  ];

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % galleryItems.length);
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <section id="gallery" className="relative z-10 py-28 px-6 sm:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-2">
            Visual Anthology
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white text-balance">
            Editorial Perspectives.
          </h2>
        </div>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-md mt-4 md:mt-0 font-normal">
          Captured across calibrated high-contrast photography studios and wind-tunnel testing pavilions.
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxIndex(index)}
            className="group relative rounded-xl overflow-hidden bg-[#0c0d12] border border-white/10 cursor-pointer transition-all duration-300 hover:border-white/30"
          >
            <div className="aspect-[16/10] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Hover Caption Overlay */}
            <div className="p-5 flex items-center justify-between bg-[#08090d]/80 backdrop-blur-sm border-t border-white/5">
              <div>
                <div className="text-[10px] uppercase font-mono-numbers tracking-widest text-neutral-400">
                  {item.perspective}
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-white mt-0.5">
                  {item.title}
                </h3>
              </div>
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white text-neutral-400 group-hover:text-black transition-all">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-xl">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-numbers text-neutral-400">
              {galleryItems[activeLightboxIndex].perspective} · {activeLightboxIndex + 1} / {galleryItems.length}
            </div>
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={galleryItems[activeLightboxIndex].src}
              alt={galleryItems[activeLightboxIndex].title}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {/* Prev / Next controls */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-white hover:text-black transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Caption Footer */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400">
            <div>
              <span className="font-semibold text-white uppercase tracking-wider mr-2">
                {galleryItems[activeLightboxIndex].title}
              </span>
              <span>{galleryItems[activeLightboxIndex].subtitle}</span>
            </div>
            <div className="font-mono-numbers mt-2 sm:mt-0 text-[11px]">
              High-Resolution Photographic Archival Reference
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
