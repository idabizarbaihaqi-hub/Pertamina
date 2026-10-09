import React, { useEffect, useState } from 'react';
import { PertaminaLogo } from '../common/PertaminaLogo';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress ticker over 2.4 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    const timeout = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-red-600 via-rose-600 to-white text-white p-6 select-none overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-red-800/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Brand Banner */}
      <div className="w-full pt-8 flex items-center justify-between z-10">
        <span className="text-xs uppercase tracking-widest text-red-100 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          Dompet Digital Terpercaya
        </span>
        <button
          onClick={onFinish}
          className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1 text-white"
        >
          Lewati <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Center Logo & Name */}
      <div className="flex flex-col items-center text-center my-auto z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="p-6 bg-white rounded-3xl shadow-2xl shadow-red-950/20 mb-6 ring-4 ring-white/30">
          <PertaminaLogo size="xl" showText={false} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center justify-center">
          MyPertamina <span className="ml-1.5 text-amber-200">Pay</span>
        </h1>
        <p className="text-sm text-red-100 mt-2 max-w-xs font-medium">
          Kemudahan Transaksi Energi & Pembayaran Harian Anda
        </p>

        {/* Loading Bar */}
        <div className="w-48 h-1.5 bg-red-400/40 rounded-full mt-8 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="w-full text-center pb-6 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 backdrop-blur-xs text-slate-700 text-xs font-medium">
          <span>PT Pertamina (Persero)</span>
          <span className="text-slate-400">·</span>
          <span>BUMN Hadir Untuk Negeri</span>
        </div>
      </div>
    </div>
  );
};
