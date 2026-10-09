import React, { useState, useEffect } from 'react';
import { User, Transaction } from './types';
import { STORAGE } from './services/storage';
import { SplashScreen } from './components/screens/SplashScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ShopeeScreen } from './components/screens/ShopeeScreen';
import { TransferScreen } from './components/screens/TransferScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  
  // Auth & Navigation State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');

  // Shared Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);

  // Phone Frame Emulator for Desktop Reviewers
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Initial Boot
  useEffect(() => {
    const user = STORAGE.getCurrentUser();
    setCurrentUser(user);
    setTransactions(STORAGE.getTransactions());
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('beranda');
  };

  const handleRegisterSuccess = (user: User) => {
    STORAGE.setCurrentUser(user);
    setCurrentUser(user);
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    STORAGE.setCurrentUser(null);
    setCurrentUser(null);
    setAuthScreen('login');
    setActiveTab('beranda');
  };

  // Balance & Transaction Handlers
  const handleTransferSuccess = (
    amount: number,
    title: string,
    recipient: string,
    category: 'transfer_out'
  ) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      saldoUtama: currentUser.saldoUtama - amount,
    };
    setCurrentUser(updatedUser);
    STORAGE.setCurrentUser(updatedUser);

    const now = new Date();
    const newTx = STORAGE.addTransaction({
      type: 'debit',
      category,
      title,
      description: `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} • Berhasil`,
      amount,
      date: 'Hari ini',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      status: 'Berhasil',
      referenceNo: `MPP-TRF-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientOrMerchant: recipient,
    });

    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleShopeePayment = (amount: number, title: string) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      saldoUtama: currentUser.saldoUtama - amount,
      poinMyPertamina: currentUser.poinMyPertamina + Math.floor(amount / 10000), // Bonus point
    };
    setCurrentUser(updatedUser);
    STORAGE.setCurrentUser(updatedUser);

    const now = new Date();
    const newTx = STORAGE.addTransaction({
      type: 'debit',
      category: 'belanja_shopee',
      title,
      description: `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} • Berhasil`,
      amount,
      date: 'Hari ini',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      status: 'Berhasil',
      referenceNo: `SHP-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientOrMerchant: 'Shopee Official Partner',
    });

    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleQuickTransaction = (
    amount: number,
    title: string,
    category: 'topup' | 'pln' | 'pulsa' | 'spbu'
  ) => {
    if (!currentUser) return;

    const isTopUp = category === 'topup';
    const updatedUser: User = {
      ...currentUser,
      saldoUtama: isTopUp
        ? currentUser.saldoUtama + amount
        : currentUser.saldoUtama - amount,
    };
    setCurrentUser(updatedUser);
    STORAGE.setCurrentUser(updatedUser);

    const now = new Date();
    const newTx = STORAGE.addTransaction({
      type: isTopUp ? 'kredit' : 'debit',
      category,
      title,
      description: `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} • Berhasil`,
      amount,
      date: 'Hari ini',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      status: 'Berhasil',
      referenceNo: `MPP-${category.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientOrMerchant: isTopUp ? 'Top Up Saldo Masuk' : title,
    });

    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleTransferSavings = (
    amount: number,
    direction: 'to_savings' | 'to_main'
  ) => {
    if (!currentUser) return;

    let newUtama = currentUser.saldoUtama;
    let newTabungan = currentUser.saldoTabungan;

    if (direction === 'to_savings') {
      newUtama -= amount;
      newTabungan += amount;
    } else {
      newUtama += amount;
      newTabungan -= amount;
    }

    const updatedUser: User = {
      ...currentUser,
      saldoUtama: newUtama,
      saldoTabungan: newTabungan,
    };
    setCurrentUser(updatedUser);
    STORAGE.setCurrentUser(updatedUser);
  };

  const handleUpdateUser = (partial: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...partial };
    setCurrentUser(updated);
    STORAGE.setCurrentUser(updated);
  };

  // 1. SPLASH SCREEN (Shown only once on startup)
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // 2. AUTHENTICATION FLOW (If no user logged in)
  if (!currentUser) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateLogin={() => setAuthScreen('login')}
        />
      );
    }
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => setAuthScreen('register')}
      />
    );
  }

  // 3. MAIN APPLICATION SCREEN (Authenticated)
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'transfer':
        return 'Transfer Saldo';
      case 'shopee':
        return 'Shopee Official';
      case 'riwayat':
        return 'Riwayat Transaksi';
      case 'profil':
        return 'Profil Pengguna';
      default:
        return undefined; // Show Pertamina Logo
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/5 sm:bg-slate-200/60 flex justify-center items-start selection:bg-red-500 selection:text-white">
      {/* Android Phone Frame or Full Container */}
      <div
        className={`w-full min-h-screen bg-slate-50 flex flex-col relative transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md sm:my-4 sm:rounded-4xl sm:shadow-2xl sm:border-[6px] sm:border-slate-800/90 sm:overflow-hidden'
            : 'max-w-xl'
        }`}
      >
        {/* Android simulated status bar when frame mode active on desktop */}
        {isPhoneFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-white text-[11px] font-semibold text-slate-800 select-none border-b border-slate-100">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Top Header */}
        <Header
          title={getHeaderTitle()}
          showBack={activeTab !== 'beranda'}
          onBack={() => setActiveTab('beranda')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setActiveTab('profil')}
          unreadCount={2}
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* Active Screen Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'beranda' && (
            <HomeScreen
              user={currentUser}
              transactions={transactions}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onTransactionSuccess={handleQuickTransaction}
              onSelectTransactionDetail={(tx) => {
                setSelectedTxDetail(tx);
                setActiveTab('riwayat');
              }}
            />
          )}

          {activeTab === 'transfer' && (
            <TransferScreen
              user={currentUser}
              onTransferSuccess={handleTransferSuccess}
            />
          )}

          {activeTab === 'shopee' && (
            <ShopeeScreen
              user={currentUser}
              onPaymentSuccess={handleShopeePayment}
            />
          )}

          {activeTab === 'riwayat' && (
            <HistoryScreen
              transactions={transactions}
              selectedTxDetail={selectedTxDetail}
              onCloseDetail={() => setSelectedTxDetail(null)}
            />
          )}

          {activeTab === 'profil' && (
            <ProfileScreen
              user={currentUser}
              onLogout={handleLogout}
              onTransferSavings={handleTransferSavings}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>

        {/* 5-Item Bottom Navigation for Android HP */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedTxDetail(null);
            setActiveTab(tab);
          }}
        />

        {/* Notification Drawer */}
        <NotificationDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>
    </div>
  );
}
