import React, { useState } from 'react';
import { PertaminaLogo } from '../common/PertaminaLogo';
import { STORAGE } from '../../services/storage';
import { User } from '../../types';
import { Eye, EyeOff, Lock, User as UserIcon, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateRegister,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Masukkan nomor akun 6 digit atau nomor HP Anda.');
      return;
    }

    if (!password.trim()) {
      setError('Masukkan kata sandi atau PIN Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = STORAGE.loginUser(identifier, password);
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Gagal masuk. Periksa kembali kredensial Anda.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setIdentifier('528190');
    setPassword('123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Graphic Header */}
      <div className="w-full max-w-md mx-auto pt-4 sm:pt-8">
        <div className="flex justify-center mb-6">
          <PertaminaLogo size="lg" />
        </div>

        {/* Prototype Environment Notice */}
        <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Mode Pengujian:</strong> Sistem prototipe client-side aktif. Gunakan akun uji atau nomor pengujian. Jangan gunakan kata sandi perbankan asli.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Masuk ke akun MyPertamina Pay untuk melanjutkan transaksi
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Akun (6 Digit) atau Nomor HP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: 528190 atau 0812xxxx"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi / PIN"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Gunakan Akun Pengujian (Akun: 528190)</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            Belum memiliki akun MyPertamina Pay?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-red-600 hover:text-red-700 hover:underline ml-1"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-4 text-[11px] text-slate-400">
        © 2026 PT Pertamina (Persero) · Layanan Pelanggan Pertamina Call 135
      </div>
    </div>
  );
};
