import React, { useState } from 'react';
import { User, BankOption } from '../../types';
import { formatRupiah, maskBalance } from '../../utils/formatters';
import {
  ArrowLeftRight,
  Building2,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  Lock,
} from 'lucide-react';

interface TransferScreenProps {
  user: User;
  onTransferSuccess: (amount: number, title: string, recipient: string, category: 'transfer_out') => void;
}

const BANK_OPTIONS: BankOption[] = [
  { code: 'BCA', name: 'Bank Central Asia (BCA)', logoColor: 'bg-blue-600' },
  { code: 'MANDIRI', name: 'Bank Mandiri', logoColor: 'bg-blue-900' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)', logoColor: 'bg-sky-600' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)', logoColor: 'bg-teal-600' },
  { code: 'BSI', name: 'Bank Syariah Indonesia (BSI)', logoColor: 'bg-emerald-600' },
  { code: 'CIMB', name: 'CIMB Niaga', logoColor: 'bg-red-700' },
  { code: 'PERMATA', name: 'Bank Permata', logoColor: 'bg-emerald-700' },
];

export const TransferScreen: React.FC<TransferScreenProps> = ({
  user,
  onTransferSuccess,
}) => {
  const [transferType, setTransferType] = useState<'internal' | 'bank'>('internal');
  
  // Internal fields
  const [targetAccount, setTargetAccount] = useState('');
  
  // Bank fields
  const [selectedBank, setSelectedBank] = useState<BankOption>(BANK_OPTIONS[0]);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('Hendra Wijaya');
  
  // General
  const [amount, setAmount] = useState<number>(100000);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Confirmation & Receipt
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    amount: number;
    title: string;
    recipient: string;
    refNo: string;
    date: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const presets = [50000, 100000, 250000, 500000, 1000000];

  const handleStartTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (transferType === 'internal') {
      if (!targetAccount.trim() || targetAccount.trim().length !== 6 || !/^\d+$/.test(targetAccount)) {
        setError('Nomor Akun MyPertamina Pay harus berupa 6 digit angka.');
        return;
      }
      if (targetAccount === user.accountNumber) {
        setError('Tidak dapat mentransfer ke nomor akun sendiri.');
        return;
      }
    } else {
      if (!bankAccountNumber.trim() || bankAccountNumber.length < 5) {
        setError('Masukkan nomor rekening bank yang valid.');
        return;
      }
    }

    if (!amount || amount < 10000) {
      setError('Nominal transfer minimum adalah Rp 10.000.');
      return;
    }

    if (amount > user.saldoUtama) {
      setError('Saldo Utama tidak mencukupi untuk transfer ini.');
      return;
    }

    setShowPinModal(true);
  };

  const handleConfirmPin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPinModal(false);

      const refNo = `MPP-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
      const title =
        transferType === 'internal'
          ? `Transfer ke Akun ${targetAccount}`
          : `Transfer ke ${selectedBank.code} • ${recipientName}`;
      const recipient =
        transferType === 'internal'
          ? `MyPertamina Pay (${targetAccount})`
          : `${selectedBank.name} (${bankAccountNumber})`;

      onTransferSuccess(amount, title, recipient, 'transfer_out');

      setReceiptData({
        amount,
        title,
        recipient,
        refNo,
        date: new Date().toLocaleString('id-ID'),
      });
    }, 800);
  };

  const handleCopyRef = () => {
    if (receiptData) {
      navigator.clipboard.writeText(receiptData.refNo);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowLeftRight className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Transfer Dana
              </h2>
              <p className="text-[11px] text-slate-500">
                Pilih tujuan transfer MyPertamina Pay
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Saldo Utama</span>
            <span className="text-xs font-extrabold text-slate-900 tabular-nums">
              {formatRupiah(user.saldoUtama)}
            </span>
          </div>
        </div>

        {/* 2 Pilihan Transfer: Sesama Akun vs Bank */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setTransferType('internal');
              setError(null);
            }}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              transferType === 'internal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-red-600" />
            <span>Sesama Akun</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTransferType('bank');
              setError(null);
            }}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              transferType === 'bank'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Rekening Bank</span>
          </button>
        </div>
      </div>

      {/* Form Transfer */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartTransfer} className="space-y-4">
          {transferType === 'internal' ? (
            /* Formulir Sesama MyPertamina Pay */
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor Akun MyPertamina Pay Penerima (6 Digit)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 842193"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Masukkan 6 digit nomor akun unik penerima
              </p>
            </div>
          ) : (
            /* Formulir Rekening Bank */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Bank Tujuan
                </label>
                <select
                  value={selectedBank.code}
                  onChange={(e) => {
                    const b = BANK_OPTIONS.find((item) => item.code === e.target.value);
                    if (b) setSelectedBank(b);
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {BANK_OPTIONS.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="Contoh: 17800029102"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama pemilik rekening"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Nominal Transfer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nominal Transfer (Rp)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min={10000}
                step={5000}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-extrabold tabular-nums focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all shrink-0 ${
                    amount === p
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p / 1000}rb
                </button>
              ))}
            </div>
          </div>

          {/* Catatan Opsional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Pembayaran bensin bersama"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Biaya Transaksi */}
          <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between text-xs text-slate-600">
            <span>Biaya Layanan</span>
            <span className="font-bold text-emerald-600">Gratis (Rp 0)</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition-all"
          >
            Lanjutkan Transfer {formatRupiah(amount)}
          </button>
        </form>
      </div>

      {/* PIN Confirmation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Masukkan PIN Keamanan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Konfirmasi transfer sebesar {formatRupiah(amount)}
            </p>

            <div className="my-4">
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="******"
                className="w-36 mx-auto text-center tracking-widest text-lg font-bold py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-[10px] text-slate-400 mt-1.5">
                PIN pengujian default: 123456
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmPin}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
              >
                {isProcessing ? 'Memproses...' : 'Konfirmasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt / Bukti Transfer Modal */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 text-center">
              Transfer Berhasil
            </h3>
            <p className="text-2xl font-extrabold text-slate-900 text-center tabular-nums my-1">
              {formatRupiah(receiptData.amount)}
            </p>
            <p className="text-[11px] text-slate-400 text-center mb-4">
              {receiptData.date}
            </p>

            <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Penerima</span>
                <span className="font-semibold text-slate-900 text-right">
                  {receiptData.recipient}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sumber Dana</span>
                <span className="font-semibold text-slate-900">
                  Saldo Utama MyPertamina Pay
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/80 pt-2">
                <span className="text-slate-500">No. Referensi</span>
                <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                  <span>{receiptData.refNo}</span>
                  <button
                    onClick={handleCopyRef}
                    className="p-1 hover:text-red-600"
                    title="Salin Referensi"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setReceiptData(null)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
