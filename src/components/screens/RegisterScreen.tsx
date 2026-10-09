import React, { useState } from 'react';
import { PertaminaLogo } from '../common/PertaminaLogo';
import { STORAGE } from '../../services/storage';
import { User } from '../../types';
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldAlert, Copy, Check } from 'lucide-react';

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateLogin,
}) => {
  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Nama lengkap wajib diisi sesuai kartu identitas.');
      return;
    }

    if (!nik.trim() || nik.trim().length !== 16 || !/^\d+$/.test(nik.trim())) {
      setError('NIK harus berupa 16 digit angka pengujian.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setError('Nomor HP minimal 10 digit.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Kata sandi / PIN minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const res = STORAGE.registerUser({
      fullName,
      nik,
      phone,
      pin: password,
    });

    if (res.success && res.user) {
      setCreatedUser(res.user);
    } else {
      setError(res.error || 'Pendaftaran gagal.');
    }
  };

  const handleCopyAccount = () => {
    if (createdUser) {
      navigator.clipboard.writeText(createdUser.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto pt-2 sm:pt-4">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Login</span>
          </button>
          <PertaminaLogo size="sm" showText={false} />
        </div>

        {/* Prototype Warning Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Peringatan Pengujian:</strong> Prototipe ini menggunakan penyimpanan lokal perangkat. Jangan gunakan NIK asli atau data sensitif pribadi. Gunakan 16 digit angka acak untuk simulasi (misal: 3201000000000001).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Pendaftaran Akun Baru
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Daftar untuk mendapatkan Nomor Akun 6 digit MyPertamina Pay
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Dita Femalia"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK Pengujian (16 Digit)
              </label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Contoh: 3201000000000001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 placeholder:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor HP (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi / PIN
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 digit"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Sandi
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi sandi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal Showing 6-Digit Account Number */}
      {createdUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Registrasi Berhasil!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Nomor Akun MyPertamina Pay unik 6 digit Anda telah diterbitkan secara otomatis:
            </p>

            {/* Generated 6-digit box */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                  Nomor Akun MyPertamina Pay
                </span>
                <p className="text-2xl font-extrabold text-slate-900 tracking-widest font-mono">
                  {createdUser.accountNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="p-2 rounded-xl bg-white border border-red-200 text-slate-700 hover:bg-red-50 transition-colors shadow-xs"
                title="Salin Nomor Akun"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-5">
              Simpan nomor akun ini untuk login dan menerima transfer saldo. Saldo uji awal sebesar Rp 500.000 telah ditambahkan.
            </p>

            <button
              type="button"
              onClick={() => onRegisterSuccess(createdUser)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-colors"
            >
              Masuk ke Beranda
            </button>
          </div>
        </div>
      )}

      <div className="w-full text-center py-4 text-[11px] text-slate-400">
        © 2026 PT Pertamina (Persero) · Layanan Pelanggan Pertamina Call 135
      </div>
    </div>
  );
};
