import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VehicleConfiguration, BASE_VEHICLE_PRICE } from '../types/automotive';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VehicleConfiguration;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Monaco Concierge');
  const [timeframe, setTimeframe] = useState('First Allocation Window (Q2 2027)');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const optionDelta = config.paint.price + config.wheel.price + config.interior.price;
  const totalPrice = BASE_VEHICLE_PRICE + optionDelta;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Valid email address is required';
    }
    if (!phone.trim()) errs.phone = 'Contact number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate unique allocation token
    const randomNum = Math.floor(10 + Math.random() * 89);
    const token = `VANTA-${randomNum}-VIP`;
    setReservationCode(token);
    setIsSubmitted(true);

    // Launch elegant minimal confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#f59e0b', '#3b82f6', '#c0c5cb'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0b0c11] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-1">
                Priority Allocation Request
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                Reserve Your Vanta
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Production is limited to 99 numbered chassis worldwide. Initial allocation requires concierge consultation.
              </p>
            </div>

            {/* Spec preview badge */}
            <div className="mb-6 p-3.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">Configured Spec</span>
                <span className="font-semibold text-white">{config.paint.name} · {config.wheel.name}</span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 text-[10px] uppercase font-mono-numbers block">Estimated Total</span>
                <span className="font-bold text-white font-mono-numbers">${totalPrice.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-black/50 border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition-all ${
                    errors.fullName ? 'border-red-500' : 'border-white/15'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-black/50 border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition-all ${
                      errors.email ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Telephone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-black/50 border text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition-all ${
                      errors.phone ? 'border-red-500' : 'border-white/15'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Preferred Concierge Center
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  >
                    <option value="Monaco Concierge">Monaco Concierge</option>
                    <option value="Geneva Private Lounge">Geneva Private Lounge</option>
                    <option value="London Mayfair Atelier">London Mayfair Atelier</option>
                    <option value="Los Angeles Beverly Hills">Los Angeles Beverly Hills</option>
                    <option value="Tokyo Ginza Studio">Tokyo Ginza Studio</option>
                    <option value="Dubai DIFC Suite">Dubai DIFC Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                    Commission Window
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  >
                    <option value="First Allocation Window (Q2 2027)">First Allocation Window (Q2 2027)</option>
                    <option value="Second Allocation Window (Q4 2027)">Second Allocation Window (Q4 2027)</option>
                    <option value="Custom Bespoke Track Commission (2028)">Custom Bespoke Track Commission (2028)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1">
                  Bespoke Requests / Commission Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special livery requests, personalized door sill plates, or track telemetry options..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-900" />
                  <span>Submit Allocation Request</span>
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 text-center tracking-wider font-mono-numbers">
                Zero deposit required at inquiry stage · Confidential client treatment
              </p>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-[11px] font-mono-numbers uppercase tracking-[0.25em] text-neutral-400 mb-1">
              VIP Allocation Dossier Created
            </div>
            <h3 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
              Allocation Received
            </h3>
            <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
              Thank you, {fullName}. Your priority allocation has been registered with the {region}. A dedicated private client advisor will contact you within 24 hours.
            </p>

            {/* Token Badge */}
            <div className="max-w-xs mx-auto p-4 rounded-xl bg-white/[0.04] border border-white/15 mb-6">
              <div className="text-[10px] uppercase font-mono-numbers tracking-widest text-neutral-400 mb-1">
                Your Priority Reference
              </div>
              <div className="text-2xl font-bold font-mono-numbers tracking-wider text-white">
                {reservationCode}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono-numbers transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Reference'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-[0.16em] hover:bg-neutral-200 transition-all cursor-pointer"
            >
              Return To Showroom
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
