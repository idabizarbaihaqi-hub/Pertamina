import React, { useState } from 'react';
import { User } from '../../types';
import { formatRupiah, maskNik, maskPhone } from '../../utils/formatters';
import {
  User as UserIcon,
  Shield,
  CreditCard,
  PiggyBank,
  PhoneCall,
  Lock,
  LogOut,
  ChevronRight,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRightLeft,
  Info,
} from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onTransferSavings: (amount: number, direction: 'to_savings' | 'to_main') => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onTransferSavings,
  onUpdateUser,
}) => {
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState<number>(500000);
  const [savingsDirection, setSavingsDirection] = useState<'to_savings' | 'to_main'>('to_savings');
  const [savingsError, setSavingsError] = useState<string | null>(null);
  const [savingsSuccess, setSavingsSuccess] = useState(false);

  // Security modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState(false);

  // Help modal
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSavingsSubmit = () => {
    setSavingsError(null);
    if (!savingsAmount || savingsAmount < 10000) {
      setSavingsError('Nominal minimum pemindahan adalah Rp 10.000.');
      return;
    }

    if (savingsDirection === 'to_savings') {
      if (user.saldoUtama < savingsAmount) {
        setSavingsError('Saldo Utama tidak mencukupi untuk disimpan ke Tabungan.');
        return;
      }
    } else {
      if (user.saldoTabungan < savingsAmount) {
        setSavingsError('Saldo Tabungan tidak mencukupi untuk ditarik ke Saldo Utama.');
        return;
      }
    }

    onTransferSavings(savingsAmount, savingsDirection);
    setSavingsSuccess(true);
    setTimeout(() => {
      setSavingsSuccess(false);
      setIsSavingsModalOpen(false);
    }, 1200);
  };

  const handleSavePin = () => {
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      alert('PIN harus berupa 6 digit angka.');
      return;
    }
    onUpdateUser({ pin: newPin });
    setSecuritySuccess(true);
    setTimeout(() => {
      setSecuritySuccess(false);
      setIsSecurityModalOpen(false);
      setNewPin('');
    }, 1200);
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* 1. KARTU PROFIL UTAMA & NOMOR AKUN */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold backdrop-blur-md">
            {user.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-bold">{user.fullName}</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs flex items-center gap-0.5">
                <Award className="w-3 h-3" />
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-red-100 font-medium mt-0.5">{maskPhone(user.phone)}</p>
          </div>
        </div>

        {/* 6-Digit Account Number Card */}
        <div className="mt-4 p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-red-200 block uppercase font-semibold tracking-wider">
              Nomor Akun MyPertamina Pay
            </span>
            <span className="text-lg font-mono font-extrabold tracking-widest text-white">
              {user.accountNumber}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-red-200 block">Poin Reward</span>
            <span className="text-xs font-bold text-amber-300">
              {user.poinMyPertamina} Poin
            </span>
          </div>
        </div>
      </div>

      {/* 2. MANAJEMEN SALDO TABUNGAN (BUNGA 3.5% P.A.) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Kelola Saldo Tabungan</h3>
              <p className="text-[10px] text-slate-500">Bunga simpanan 3.5% per tahun</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSavingsDirection('to_savings');
              setIsSavingsModalOpen(true);
            }}
            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Pindah Dana</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-500 block">Saldo Utama</span>
            <span className="font-extrabold text-slate-900 tabular-nums">
              {formatRupiah(user.saldoUtama)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-500 block">Saldo Tabungan</span>
            <span className="font-extrabold text-blue-700 tabular-nums">
              {formatRupiah(user.saldoTabungan)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MENU PENGATURAN & KEAMANAN */}
      <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 divide-y divide-slate-100">
        {/* NIK Info (Masked) */}
        <div className="p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">NIK Terdaftar</span>
              <span className="text-[11px] text-slate-400 font-mono">{maskNik(user.nik)}</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
            Terverifikasi
          </span>
        </div>

        {/* Keamanan & PIN */}
        <button
          onClick={() => setIsSecurityModalOpen(true)}
          className="w-full p-3 flex items-center justify-between text-xs hover:bg-slate-50 rounded-2xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Keamanan & PIN Transaksi</span>
              <span className="text-[11px] text-slate-400">Ubah kode PIN 6 digit</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Layanan Pelanggan Call 135 */}
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="w-full p-3 flex items-center justify-between text-xs hover:bg-slate-50 rounded-2xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Bantuan Pertamina Contact Center</span>
              <span className="text-[11px] text-slate-400">Call 135 & Layanan Informasi</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* 4. TOMBOL KELUAR (LOGOUT) */}
      <button
        onClick={onLogout}
        className="w-full py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-2xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Keluar dari Akun</span>
      </button>

      {/* MODAL PINDAH SALDO TABUNGAN */}
      {isSavingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pindah Saldo Tabungan</h3>
              <button
                onClick={() => setIsSavingsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savingsSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Pemindahan Saldo Berhasil!</h4>
              </div>
            ) : (
              <div className="py-3 space-y-3.5">
                {savingsError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl">{savingsError}</p>
                )}

                {/* Arah Pemindahan */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setSavingsDirection('to_savings')}
                    className={`py-1.5 rounded-lg transition-all ${
                      savingsDirection === 'to_savings'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Simpan ke Tabungan
                  </button>
                  <button
                    onClick={() => setSavingsDirection('to_main')}
                    className={`py-1.5 rounded-lg transition-all ${
                      savingsDirection === 'to_main'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    Tarik ke Saldo Utama
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nominal Pemindahan (Rp)
                  </label>
                  <input
                    type="number"
                    step={50000}
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold"
                  />
                </div>

                <button
                  onClick={handleSavingsSubmit}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Konfirmasi Pindah Dana
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL GANTI PIN */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Ganti PIN Transaksi</h3>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {securitySuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">PIN Berhasil Diperbarui!</h4>
              </div>
            ) : (
              <div className="py-3 space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PIN Baru (6 Digit Angka)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="******"
                    className="w-full text-center tracking-widest text-lg font-bold py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <button
                  onClick={handleSavePin}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
                >
                  Simpan PIN Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL BANTUAN CALL 135 */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pertamina Contact Center</h3>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-extrabold text-sm">
                135
              </div>
              <div>
                <p className="text-xs font-bold text-red-950">Pertamina Call 135</p>
                <p className="text-[11px] text-red-700">Layanan Pelanggan Resmi 24 Jam Bebas Pulsa</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <p>Email: <strong>pcc135@pertamina.com</strong></p>
              <p>Website: <strong>https://mypertamina.id</strong></p>
              <p className="text-[11px] text-slate-400 pt-2">
                Untuk kendala transaksi pembayaran SPBU, Shopee, atau transfer dana, cantumkan nomor akun MyPertamina Pay 6 digit Anda.
              </p>
            </div>

            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
