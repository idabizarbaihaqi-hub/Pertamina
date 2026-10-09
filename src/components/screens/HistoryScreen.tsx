import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Clock,
  Search,
  Fuel,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Smartphone,
  ShoppingCart,
  X,
  CheckCircle2,
  Share2,
  FileText,
  Filter,
} from 'lucide-react';

interface HistoryScreenProps {
  transactions: Transaction[];
  selectedTxDetail?: Transaction | null;
  onCloseDetail?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  transactions,
  selectedTxDetail: externalSelectedTx,
  onCloseDetail,
}) => {
  const [filterType, setFilterType] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalSelectedTx, setInternalSelectedTx] = useState<Transaction | null>(null);

  const activeTx = externalSelectedTx || internalSelectedTx;

  const handleCloseModal = () => {
    setInternalSelectedTx(null);
    if (onCloseDetail) onCloseDetail();
  };

  const filteredList = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      let matchType = true;
      if (filterType === 'debit') matchType = tx.type === 'debit';
      else if (filterType === 'kredit') matchType = tx.type === 'kredit';
      else if (filterType === 'spbu') matchType = tx.category === 'spbu';
      else if (filterType === 'shopee') matchType = tx.category === 'belanja_shopee';
      else if (filterType === 'transfer')
        matchType = tx.category === 'transfer_out' || tx.category === 'transfer_in';

      // Query match
      const q = searchQuery.toLowerCase();
      const matchQuery =
        tx.title.toLowerCase().includes(q) ||
        tx.referenceNo.toLowerCase().includes(q) ||
        (tx.recipientOrMerchant && tx.recipientOrMerchant.toLowerCase().includes(q));

      return matchType && matchQuery;
    });
  }, [transactions, filterType, searchQuery]);

  const getVisual = (tx: Transaction) => {
    switch (tx.category) {
      case 'spbu':
        return { icon: Fuel, bg: 'bg-red-50 text-red-600' };
      case 'transfer_in':
        return { icon: ArrowDownLeft, bg: 'bg-emerald-50 text-emerald-600' };
      case 'transfer_out':
        return { icon: ArrowUpRight, bg: 'bg-blue-50 text-blue-600' };
      case 'belanja_shopee':
        return { icon: ShoppingBag, bg: 'bg-orange-50 text-orange-600' };
      case 'pln':
        return { icon: Zap, bg: 'bg-amber-50 text-amber-600' };
      case 'pulsa':
        return { icon: Smartphone, bg: 'bg-pink-50 text-pink-600' };
      default:
        return { icon: ShoppingCart, bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-3.5">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Riwayat Transaksi
            </h2>
            <p className="text-[11px] text-slate-500">
              Catatan aktivitas finansial MyPertamina Pay
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi atau no. referensi..."
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'debit', label: 'Pengeluaran' },
            { id: 'kredit', label: 'Pemasukan' },
            { id: 'spbu', label: 'SPBU' },
            { id: 'shopee', label: 'Shopee' },
            { id: 'transfer', label: 'Transfer' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                filterType === f.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Transaksi */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-slate-100 space-y-1">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-10 h-10 mx-auto stroke-1" />
            <p className="text-xs font-semibold text-slate-600">
              Tidak ada transaksi ditemukan
            </p>
            <p className="text-[11px] text-slate-400">
              Coba ganti filter atau kata kunci pencarian
            </p>
          </div>
        ) : (
          filteredList.map((tx) => {
            const visual = getVisual(tx);
            const Icon = visual.icon;
            const isCredit = tx.type === 'kredit';

            return (
              <button
                key={tx.id}
                onClick={() => setInternalSelectedTx(tx)}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${visual.bg} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {tx.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span>{tx.time}</span>
                      <span>·</span>
                      <span className="text-emerald-600 font-semibold">{tx.status}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <p
                    className={`text-xs font-extrabold tabular-nums ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isCredit ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate max-w-[90px]">
                    {tx.referenceNo}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Modal Detail Transaksi */}
      {activeTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Rincian Transaksi</h3>
              <button onClick={handleCloseModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-center">
              <div
                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 ${
                  activeTx.type === 'kredit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {activeTx.type === 'kredit' ? (
                  <ArrowDownLeft className="w-6 h-6" />
                ) : (
                  <ArrowUpRight className="w-6 h-6" />
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{activeTx.title}</h4>
              <p
                className={`text-2xl font-extrabold tabular-nums my-1 ${
                  activeTx.type === 'kredit' ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {activeTx.type === 'kredit' ? `+ ${formatRupiah(activeTx.amount)}` : `- ${formatRupiah(activeTx.amount)}`}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Transaksi {activeTx.status}</span>
              </span>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Transaksi</span>
                <span className="font-semibold text-slate-900">{activeTx.date}, {activeTx.time}</span>
              </div>
              {activeTx.recipientOrMerchant && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant / Penerima</span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]">
                    {activeTx.recipientOrMerchant}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori</span>
                <span className="font-semibold text-slate-900 capitalize">{activeTx.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/80 pt-2 font-mono">
                <span className="text-slate-500 font-sans">No. Referensi</span>
                <span className="font-bold text-slate-800">{activeTx.referenceNo}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
