import React from 'react';
import { X, CheckCircle, Bell, Tag, ArrowUpRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif_1',
      type: 'promo',
      icon: Tag,
      iconColor: 'bg-red-50 text-red-600',
      title: 'Cashback Pertamax 8% Spesial Hari Ini',
      time: '15 menit yang lalu',
      desc: 'Beli Pertamax minimal Rp 100.000 dengan MyPertamina Pay dan nikmati bonus poin reward ganda.',
      read: false,
    },
    {
      id: 'notif_2',
      type: 'trx',
      icon: CheckCircle,
      iconColor: 'bg-emerald-50 text-emerald-600',
      title: 'Transaksi SPBU Berhasil',
      time: 'Hari ini, 08:23',
      desc: 'Pembayaran bensin SPBU 31.129.02 sebesar Rp 150.000 telah sukses diproses.',
      read: false,
    },
    {
      id: 'notif_3',
      type: 'system',
      icon: ArrowUpRight,
      iconColor: 'bg-blue-50 text-blue-600',
      title: 'Transfer Masuk Berhasil',
      time: 'Kemarin, 14:30',
      desc: 'Dana Rp 500.000 dari rekening BCA Hendra Wijaya telah masuk ke Saldo Utama Anda.',
      read: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            <h2 className="font-bold text-slate-900">Notifikasi</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
              2 Baru
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  !n.read
                    ? 'bg-red-50/40 border-red-100 shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
