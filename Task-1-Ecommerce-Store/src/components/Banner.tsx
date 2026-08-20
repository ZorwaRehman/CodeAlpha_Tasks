import React from 'react';
import { Sparkles, Truck, ShieldCheck } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <div className="bg-zinc-900 text-zinc-200 text-xs py-2 px-4 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> PROMO
          </span>
          <span>Use coupon <strong className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded">WELCOME10</strong> for 10% off your entire order</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-zinc-300" /> Free Shipping on Orders $75+
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /> 30-Day Money-Back Guarantee
          </span>
        </div>
      </div>
    </div>
  );
};
