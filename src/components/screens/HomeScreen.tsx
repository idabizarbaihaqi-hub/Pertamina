import React, { useState } from 'react';
import { User, Transaction } from '../../types';
import { formatRupiah, maskBalance } from '../../utils/formatters';
import { promoBannerImg } from '../../services/storage';
import {
  Eye,
  EyeOff,
  Lock,
  PiggyBank,
  Plus,
  ArrowLeftRight,
  FileText,
  Zap,
  QrCode,
  Smartphone,
  ShoppingBag,
  Clock,
  ChevronRight,
  Fuel,
  ShoppingCart,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import {
  TopUpModal,
  PlnModal,
  PulsaModal,
  QrPayModal,
} from '../modals/QuickServiceModals';

interface HomeScreenProps {
  user: User;
  transactions: Transaction[];
  onNavigateTab: (tab: 'transfer' | 'shopee' | 'riwayat' | 'profil') => void;
  onTransactionSuccess: (amount: number, title: string, category: 'topup' | 'pln' | 'pulsa' | 'spbu') => void;
  onSelectTransactionDetail?: (tx: Transaction) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  transactions,
  onNavigateTab,
  onTransactionSuccess,
  onSelectTransactionDetail,
}) => {
  const [isBalanceMasked, setIsBalanceMasked] = useState(false);
  const [modalState, setModalState] = useState<'topup' | 'pln' | 'pulsa' | 'qr' | null>(null);

  const totalAsset = user.saldoUtama + user.saldoTabungan;
  const recentTransactions = transactions.slice(0, 3);

  const getTransactionIcon = (tx: Transaction) => {
    switch (tx.category) {
      case 'spbu':
        return {
          icon: Fuel,
          bg: 'bg-red-50 text-red-600',
        };
      case 'transfer_in':
        return {
          icon: ArrowDownLeft,
          bg: 'bg-emerald-50 text-emerald-600',
        };
      case 'transfer_out':
        return {
          icon: ArrowUpRight,
          bg: 'bg-blue-50 text-blue-600',
        };
      case 'belanja_shopee':
        return {
          icon: ShoppingBag,
          bg: 'bg-orange-50 text-orange-600',
        };
      case 'pln':
        return {
          icon: Zap,
          bg: 'bg-amber-50 text-amber-600',
        };
      case 'pulsa':
        return {
          icon: Smartphone,
          bg: 'bg-pink-50 text-pink-600',
        };
      default:
        return {
          icon: ShoppingCart,
          bg: 'bg-blue-50 text-blue-600',
        };
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Sapaan Pengguna */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] text-slate-500 font-medium">Halo, selamat datang</span>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            {user.fullName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span>Akun {user.accountNumber}</span>
        </div>
      </div>

      {/* 1. KARTU SALDO UTAMA & TABUNGAN (IDENTIK DENGAN SCREENSHOT REFERENSI) */}
      <div className="relative rounded-3xl p-5 text-white overflow-hidden shadow-lg bg-gradient-to-br from-[#0c2461] via-[#103282] to-[#1e3799]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Total Aset Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-200 font-medium">Total Aset</span>
            <button
              onClick={() => setIsBalanceMasked(!isBalanceMasked)}
              className="p-1 text-blue-200 hover:text-white transition-colors"
              aria-label={isBalanceMasked ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            >
              {isBalanceMasked ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white">
              {maskBalance(totalAsset, isBalanceMasked)}
            </h1>
          </div>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-blue-200">
            <span className="flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              2.1% dari bulan lalu
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              ↑ 2.1%
            </span>
          </div>
        </div>

        {/* Sub-Cards: Saldo Utama & Saldo Tabungan */}
        <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
          {/* Card Saldo Utama */}
          <div className="bg-white rounded-2xl p-3 text-slate-900 shadow-sm transition-transform active:scale-[0.98]">
            <span className="text-[11px] font-medium text-slate-500 block">
              Saldo Utama
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 tabular-nums truncate">
              {maskBalance(user.saldoUtama, isBalanceMasked)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Tersedia</span>
            </div>
          </div>

          {/* Card Saldo Tabungan */}
          <div className="bg-white rounded-2xl p-3 text-slate-900 shadow-sm transition-transform active:scale-[0.98]">
            <span className="text-[11px] font-medium text-slate-500 block">
              Saldo Tabungan
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 tabular-nums truncate">
              {maskBalance(user.saldoTabungan, isBalanceMasked)}
            </p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-medium">
              <PiggyBank className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700 font-semibold">Bunga 3.5% p.a.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MENU CEPAT (QUICK ACTIONS - SESUAI SCREENSHOT + SYARAT SHOPEE & RIWAYAT) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Menu Cepat
          </h3>
          <button
            onClick={() => onNavigateTab('transfer')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* 8-Grid Menu Cepat */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          {/* 1. Top Up */}
          <button
            onClick={() => setModalState('topup')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all shadow-xs group-active:scale-95">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-blue-600">
              Top Up
            </span>
          </button>

          {/* 2. Transfer */}
          <button
            onClick={() => onNavigateTab('transfer')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-all shadow-xs group-active:scale-95">
              <ArrowLeftRight className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-emerald-600">
              Transfer
            </span>
          </button>

          {/* 3. Shopee (Wajib dari tahap awal) */}
          <button
            onClick={() => onNavigateTab('shopee')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-all shadow-xs group-active:scale-95 relative">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white" />
            </div>
            <span className="text-[11px] font-bold text-orange-600 mt-1.5 group-hover:text-orange-700">
              Shopee
            </span>
          </button>

          {/* 4. PLN */}
          <button
            onClick={() => setModalState('pln')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-all shadow-xs group-active:scale-95">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-amber-600">
              PLN
            </span>
          </button>

          {/* 5. QR Pay */}
          <button
            onClick={() => setModalState('qr')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-all shadow-xs group-active:scale-95">
              <QrCode className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-purple-600">
              QR Pay
            </span>
          </button>

          {/* 6. Pulsa & Paket */}
          <button
            onClick={() => setModalState('pulsa')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-all shadow-xs group-active:scale-95">
              <Smartphone className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-pink-600">
              Pulsa
            </span>
          </button>

          {/* 7. Bayar / Tagihan */}
          <button
            onClick={() => setModalState('pln')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-center text-amber-700 group-hover:bg-orange-100 transition-all shadow-xs group-active:scale-95">
              <FileText className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-amber-700">
              Bayar
            </span>
          </button>

          {/* 8. Riwayat */}
          <button
            onClick={() => onNavigateTab('riwayat')}
            className="flex flex-col items-center group focus:outline-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition-all shadow-xs group-active:scale-95">
              <Clock className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5 group-hover:text-rose-600">
              Riwayat
            </span>
          </button>
        </div>
      </div>

      {/* 3. PROMO BANNER RESMI PERTAMINA */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 group">
        <img
          src={promoBannerImg}
          alt="Pertamina Promo Banner"
          referrerPolicy="no-referrer"
          className="w-full h-32 object-cover object-center group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5 text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Penawaran Eksklusif MyPertamina
          </span>
          <p className="text-xs font-bold leading-tight mt-0.5">
            Dapatkan Cashback Poin hingga 15% setiap pembelian Pertamax Series
          </p>
        </div>
      </div>

      {/* 4. TRANSAKSI TERAKHIR (IDENTIK DENGAN SCREENSHOT REFERENSI) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Transaksi Terakhir
          </h3>
          <button
            onClick={() => onNavigateTab('riwayat')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-1">
          {recentTransactions.map((tx) => {
            const visual = getTransactionIcon(tx);
            const Icon = visual.icon;
            const isCredit = tx.type === 'kredit';

            return (
              <button
                key={tx.id}
                onClick={() => onSelectTransactionDetail && onSelectTransactionDetail(tx)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${visual.bg} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {tx.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {tx.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <p
                    className={`text-xs font-bold tabular-nums ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isCredit ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Service Modals */}
      <TopUpModal
        isOpen={modalState === 'topup'}
        onClose={() => setModalState(null)}
        onSuccess={onTransactionSuccess}
        saldoUtama={user.saldoUtama}
      />
      <PlnModal
        isOpen={modalState === 'pln'}
        onClose={() => setModalState(null)}
        onSuccess={onTransactionSuccess}
        saldoUtama={user.saldoUtama}
      />
      <PulsaModal
        isOpen={modalState === 'pulsa'}
        onClose={() => setModalState(null)}
        onSuccess={onTransactionSuccess}
        saldoUtama={user.saldoUtama}
      />
      <QrPayModal
        isOpen={modalState === 'qr'}
        onClose={() => setModalState(null)}
        onSuccess={onTransactionSuccess}
        saldoUtama={user.saldoUtama}
      />
    </div>
  );
};
