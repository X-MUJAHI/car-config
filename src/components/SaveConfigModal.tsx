import React, { useState } from 'react';
import { X, Check, Copy, Download, Share2 } from 'lucide-react';
import { VehicleConfiguration, BASE_VEHICLE_PRICE } from '../types/automotive';

interface SaveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VehicleConfiguration;
  onProceedToReserve: () => void;
}

export const SaveConfigModal: React.FC<SaveConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onProceedToReserve,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const optionDelta = config.paint.price + config.wheel.price + config.interior.price;
  const totalPrice = BASE_VEHICLE_PRICE + optionDelta;
  const specId = `VANTA-SPEC-${config.paint.id.slice(0, 3).toUpperCase()}-${config.wheel.id.slice(0, 3).toUpperCase()}`;

  const specText = `VANTA HYPERCAR — BESPOKE SPECIFICATION DOSSIER
Reference: ${specId}
---------------------------------------------------------
Base Vehicle:       VANTA Electric Monocoque Gran Turismo ($${BASE_VEHICLE_PRICE.toLocaleString()} USD)
Exterior Finish:    ${config.paint.name} ($${config.paint.price.toLocaleString()} USD)
Wheel Architecture: ${config.wheel.name} - ${config.wheel.diameter} ($${config.wheel.price.toLocaleString()} USD)
Cockpit Interior:   ${config.interior.name} ($${config.interior.price.toLocaleString()} USD)
Studio Environment: ${config.lightingPreset.name}
---------------------------------------------------------
Total Estimate:     $${totalPrice.toLocaleString()} USD
Propulsion:         Quad Permanent Magnet Motors (1,914 HP)
0-100 km/h:         1.84 seconds
Top Speed:          412 km/h (Governed)
Battery:            98 kWh Solid-State Cell (520 km WLTP)
---------------------------------------------------------
Official Client Configuration Sheet`;

  const handleCopy = () => {
    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([specText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VANTA_Spec_${specId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0b0c11] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-1">
          Bespoke Commission Dossier
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-1">
          Saved Specification
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm mb-6">
          Your tailored build configuration has been compiled into an official client reference dossier.
        </p>

        {/* Specification Dossier Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 font-mono-numbers text-xs mb-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
            <span className="text-neutral-400 uppercase tracking-wider">Spec Dossier Code</span>
            <span className="font-bold text-white tracking-widest">{specId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Exterior Finish:</span>
            <span className="text-white font-medium">{config.paint.name} (+${config.paint.price.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Wheel Package:</span>
            <span className="text-white font-medium">{config.wheel.name} (+${config.wheel.price.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Interior Upholstery:</span>
            <span className="text-white font-medium">{config.interior.name} (+${config.interior.price.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Atmosphere Rig:</span>
            <span className="text-white font-medium">{config.lightingPreset.name}</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-baseline justify-between text-sm">
            <span className="text-neutral-300 font-semibold uppercase tracking-wider">Total Commission</span>
            <span className="text-xl font-bold text-white">${totalPrice.toLocaleString()} USD</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
            <span>{copied ? 'Copied' : 'Copy Spec'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-neutral-400" />
            <span>Download Spec</span>
          </button>
        </div>

        <button
          onClick={() => {
            onClose();
            onProceedToReserve();
          }}
          className="w-full py-3 px-6 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Proceed To VIP Allocation
        </button>
      </div>
    </div>
  );
};
