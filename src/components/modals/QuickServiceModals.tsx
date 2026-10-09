import React, { useState } from 'react';
import { X, Zap, Phone, QrCode, PlusCircle, CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, title: string, category: 'topup' | 'pln' | 'pulsa' | 'spbu') => void;
  saldoUtama: number;
}

// 1. TOP UP MODAL
export const TopUpModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(100000);
  const [method, setMethod] = useState<'bca' | 'mandiri' | 'bri' | 'spbu'>('bca');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = [50000, 100000, 250000, 500000, 1000000];

  const handleProcess = () => {
    setSuccess(true);
    setTimeout(() => {
      onSuccess(amount, `Top Up Saldo via ${method.toUpperCase()}`, 'topup');
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Top Up Saldo Utama</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Top Up Berhasil!</h4>
            <p className="text-xs text-slate-500">Saldo {formatRupiah(amount)} telah ditambahkan.</p>
          </div>
        ) : (
          <div className="py-3 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Pilih Nominal</label>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${
                      amount === p
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {formatRupiah(p).replace('Rp ', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Metode Pembayaran</label>
              <div className="space-y-1.5">
                {[
                  { id: 'bca', name: 'Virtual Account BCA' },
                  { id: 'mandiri', name: 'Livin Mandiri VA' },
                  { id: 'bri', name: 'BRIVA Bank BRI' },
                  { id: 'spbu', name: 'Kasir SPBU Pertamina' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      method === m.id
                        ? 'border-red-500 bg-red-50/50 font-bold text-slate-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{m.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProcess}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
            >
              Lanjutkan Top Up {formatRupiah(amount)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. PLN TOKEN / BILL MODAL
export const PlnModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, saldoUtama }) => {
  const [meterNo, setMeterNo] = useState('54129841029');
  const [tokenAmount, setTokenAmount] = useState(100000);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    if (saldoUtama < tokenAmount) {
      setError('Saldo Utama tidak mencukupi.');
      return;
    }
    onSuccess(tokenAmount, `PLN Prabayar Token • ${meterNo}`, 'pln');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Token Listrik PLN</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-3 space-y-3.5">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor Meter / ID Pelanggan</label>
            <input
              type="text"
              value={meterNo}
              onChange={(e) => setMeterNo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">Pilih Nominal Token</label>
            <div className="grid grid-cols-3 gap-2">
              {[50000, 100000, 200000, 500000].map((nominal) => (
                <button
                  key={nominal}
                  onClick={() => setTokenAmount(nominal)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    tokenAmount === nominal
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {formatRupiah(nominal).replace('Rp ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 flex justify-between">
            <span>Biaya Admin</span>
            <span className="font-semibold text-emerald-600">Gratis (Promo)</span>
          </div>

          <button
            onClick={handlePay}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
          >
            Bayar {formatRupiah(tokenAmount)}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. PULSA & PAKET DATA MODAL
export const PulsaModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, saldoUtama }) => {
  const [phoneNumber, setPhoneNumber] = useState('081298765432');
  const [amount, setAmount] = useState(50000);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePay = () => {
    if (saldoUtama < amount) {
      setError('Saldo Utama tidak mencukupi.');
      return;
    }
    onSuccess(amount, `Pulsa Telkomsel • ${phoneNumber}`, 'pulsa');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pulsa & Paket Data</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-3 space-y-3.5">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nomor Ponsel</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">Pilihan Pulsa</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Pulsa 25rb', price: 25000 },
                { label: 'Pulsa 50rb', price: 50000 },
                { label: 'Pulsa 100rb', price: 100000 },
                { label: 'Data 15GB 30 Hari', price: 75000 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setAmount(item.price)}
                  className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                    amount === item.price
                      ? 'border-red-500 bg-red-50 font-bold text-red-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{formatRupiah(item.price)}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePay}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
          >
            Beli Sekarang {formatRupiah(amount)}
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. SCAN QR PAY MODAL
export const QrPayModal: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess, saldoUtama }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'myqr'>('scan');
  const [spbuNominal, setSpbuNominal] = useState(150000);
  const [selectedBbm, setSelectedBbm] = useState('Pertamax 92');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    if (saldoUtama < spbuNominal) {
      alert('Saldo Utama tidak mencukupi untuk pembayaran ini.');
      return;
    }
    onSuccess(spbuNominal, `SPBU Pertamina - ${selectedBbm}`, 'spbu');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">QRIS & Scan QR Pay</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Scan vs QR Saya */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl my-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'scan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Scan QR SPBU
          </button>
          <button
            onClick={() => setActiveTab('myqr')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'myqr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tampilkan QR Saya
          </button>
        </div>

        {activeTab === 'scan' ? (
          <div className="space-y-3">
            {/* Camera viewport simulation with animated laser line */}
            <div className="relative w-full h-44 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-red-500">
              <div className="w-32 h-32 border-2 border-white/70 rounded-xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500" />
                <div className="w-full h-0.5 bg-red-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-white/80 mt-2 font-medium">Arahkan ke QRIS di Mesin EDC SPBU</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Jenis BBM:</span>
                <select
                  value={selectedBbm}
                  onChange={(e) => setSelectedBbm(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                >
                  <option value="Pertamax 92">Pertamax 92</option>
                  <option value="Pertamax Turbo 98">Pertamax Turbo 98</option>
                  <option value="Pertamina Dex">Pertamina Dex</option>
                  <option value="Pertalite 90">Pertalite 90</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Nominal:</span>
                <div className="flex gap-1">
                  {[50000, 100000, 150000, 200000].map((nom) => (
                    <button
                      key={nom}
                      onClick={() => setSpbuNominal(nom)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${
                        spbuNominal === nom
                          ? 'border-red-600 bg-red-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {nom / 1000}k
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulasi Sukses Bayar di SPBU ({formatRupiah(spbuNominal)})</span>
            </button>
          </div>
        ) : (
          <div className="py-4 text-center space-y-3">
            <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl inline-block shadow-xs">
              {/* QR Code SVG */}
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#fff" />
                <path d="M10 10h30v30h-30zM15 15h20v20h-20zM20 20h10v10h-10z" fill="#000" />
                <path d="M60 10h30v30h-30zM65 15h20v20h-20zM70 20h10v10h-10z" fill="#000" />
                <path d="M10 60h30v30h-30zM15 65h20v20h-20zM20 70h10v10h-10z" fill="#000" />
                <rect x="45" y="15" width="8" height="8" fill="#E11D48" />
                <rect x="45" y="35" width="8" height="8" fill="#000" />
                <rect x="60" y="55" width="12" height="12" fill="#000" />
                <rect x="75" y="70" width="15" height="15" fill="#E11D48" />
                <rect x="45" y="70" width="10" height="10" fill="#000" />
              </svg>
            </div>
            <div className="text-xs text-slate-600">
              <p className="font-bold text-slate-900">QRIS MyPertamina Pay Dinamis</p>
              <p className="text-[11px] text-slate-400">Tunjukkan ke kasir untuk menerima saldo</p>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dilindungi Enkripsi Standar ASPI</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
