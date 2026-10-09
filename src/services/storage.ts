import { User, Transaction, ShopeeProduct, CartItem } from '../types';

import earbudsImg from '../assets/images/shopee_gadget_earbuds_1791569407813.jpg';
import jacketImg from '../assets/images/shopee_fashion_jacket_1791569418221.jpg';
import skincareImg from '../assets/images/shopee_beauty_skincare_1791569430045.jpg';
import promoBannerImg from '../assets/images/pertamina_promo_banner_1791569440468.jpg';
import shopeeCatalogData from '../data/shopeeCatalog.json';

export { promoBannerImg };

const STORAGE_KEYS = {
  CURRENT_USER: 'mpp_current_user',
  REGISTERED_USERS: 'mpp_users_registry',
  TRANSACTIONS: 'mpp_transactions',
  SHOPEE_PRODUCTS: 'mpp_shopee_products_v3',
  SHOPEE_CART: 'mpp_shopee_cart_v1',
  HAS_SEEN_SPLASH: 'mpp_splash_viewed',
};

// Initial default user matching screenshot (Rp 58.050.000 total = Rp 15.750.000 + Rp 42.300.000)
export const DEFAULT_USER: User = {
  id: 'usr_001',
  fullName: 'Bambang Pamungkas',
  nik: '3201234567890001',
  phone: '081298765432',
  accountNumber: '528190', // 6 digit account
  saldoUtama: 15750000,
  saldoTabungan: 42300000,
  tier: 'Platinum',
  poinMyPertamina: 1420,
  pin: '123456',
};

// Initial transactions matching screenshot exactly:
// 1. SPBU Pertamina - Bensin 92 (Hari ini, 08:23 • Berhasil) - Rp 150.000
// 2. Indomaret • Pembelian (Kemarin, 19:05 • Berhasil) - Rp 85.500
// 3. Transfer Masuk • dari BCA (Kemarin, 14:30 • Berhasil) + Rp 500.000
export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'debit',
    category: 'spbu',
    title: 'SPBU Pertamina - Bensin 92',
    description: 'Hari ini, 08:23 • Berhasil',
    amount: 150000,
    date: 'Hari ini',
    time: '08:23',
    timestamp: Date.now() - 3600000 * 2,
    status: 'Berhasil',
    referenceNo: 'SPBU-31129-98214',
    recipientOrMerchant: 'SPBU 31.129.02 Kuningan Barat',
  },
  {
    id: 'tx_002',
    type: 'debit',
    category: 'lainnya',
    title: 'Indomaret • Pembelian',
    description: 'Kemarin, 19:05 • Berhasil',
    amount: 85500,
    date: 'Kemarin',
    time: '19:05',
    timestamp: Date.now() - 3600000 * 24,
    status: 'Berhasil',
    referenceNo: 'IDM-QR-441290',
    recipientOrMerchant: 'Indomaret Point Stasiun Gambir',
  },
  {
    id: 'tx_003',
    type: 'kredit',
    category: 'transfer_in',
    title: 'Transfer Masuk • dari BCA',
    description: 'Kemarin, 14:30 • Berhasil',
    amount: 500000,
    date: 'Kemarin',
    time: '14:30',
    timestamp: Date.now() - 3600000 * 28,
    status: 'Berhasil',
    referenceNo: 'BCA-IN-778819',
    recipientOrMerchant: 'BCA - Hendra Wijaya',
  },
  {
    id: 'tx_004',
    type: 'debit',
    category: 'belanja_shopee',
    title: 'Shopee Official • Earbuds Pro',
    description: '3 hari lalu, 11:20 • Berhasil',
    amount: 299000,
    date: '3 hari lalu',
    time: '11:20',
    timestamp: Date.now() - 3600000 * 72,
    status: 'Berhasil',
    referenceNo: 'SHP-PAY-882194',
    recipientOrMerchant: 'Aurae Audio Official Shop',
  },
  {
    id: 'tx_005',
    type: 'debit',
    category: 'pln',
    title: 'PLN Prabayar • Token Listrik',
    description: '5 hari lalu, 20:10 • Berhasil',
    amount: 200000,
    date: '5 hari lalu',
    time: '20:10',
    timestamp: Date.now() - 3600000 * 120,
    status: 'Berhasil',
    referenceNo: 'PLN-PRE-551029',
    recipientOrMerchant: 'PLN No. Meter: 54129841029',
  },
];

// Curated 8-category catalog with 1,600 products
export const DEFAULT_SHOPEE_PRODUCTS: ShopeeProduct[] = shopeeCatalogData as ShopeeProduct[];

export const STORAGE = {
  // Current logged in user
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
      // Auto seed default demo user if registry empty
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // Also update in registered users registry
      STORAGE.updateUserInRegistry(user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getRegisteredUsers: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (data) return JSON.parse(data);
      const initial = [DEFAULT_USER];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(initial));
      return initial;
    } catch {
      return [DEFAULT_USER];
    }
  },

  updateUserInRegistry: (user: User) => {
    const list = STORAGE.getRegisteredUsers();
    const idx = list.findIndex(u => u.id === user.id || u.accountNumber === user.accountNumber);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(list));
  },

  // Generate unique 6-digit account number (e.g. 528190)
  generateUniqueAccountNumber: (): string => {
    const users = STORAGE.getRegisteredUsers();
    const existingAccounts = new Set(users.map(u => u.accountNumber));
    let account = '';
    let attempts = 0;
    do {
      // 6 digits: 100000 to 999999
      account = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
    } while (existingAccounts.has(account) && attempts < 100);
    return account;
  },

  registerUser: (formData: { fullName: string; nik: string; phone: string; pin?: string }): { success: boolean; user?: User; error?: string } => {
    const users = STORAGE.getRegisteredUsers();
    
    // Check duplicate NIK
    const duplicateNik = users.find(u => u.nik.trim() === formData.nik.trim());
    if (duplicateNik) {
      return { success: false, error: 'NIK ini sudah terdaftar dalam sistem MyPertamina Pay.' };
    }

    const newAccountNumber = STORAGE.generateUniqueAccountNumber();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: formData.fullName.trim(),
      nik: formData.nik.trim(),
      phone: formData.phone.trim(),
      accountNumber: newAccountNumber,
      saldoUtama: 500000, // Starter bonus saldo pengujian
      saldoTabungan: 0,
      tier: 'Silver',
      poinMyPertamina: 100,
      pin: formData.pin || '123456',
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    return { success: true, user: newUser };
  },

  loginUser: (accountOrPhone: string, _passwordOrPin: string): { success: boolean; user?: User; error?: string } => {
    const users = STORAGE.getRegisteredUsers();
    const cleanId = accountOrPhone.trim();
    
    const matched = users.find(u => 
      u.accountNumber === cleanId || 
      u.phone === cleanId || 
      u.nik === cleanId
    );

    if (!matched) {
      // If user entered default demo number or any test number
      if (cleanId === '528190' || cleanId === '081298765432') {
        STORAGE.setCurrentUser(DEFAULT_USER);
        return { success: true, user: DEFAULT_USER };
      }
      return { success: false, error: 'Nomor akun atau nomor HP tidak terdaftar. Periksa kembali atau silakan Registrasi.' };
    }

    STORAGE.setCurrentUser(matched);
    return { success: true, user: matched };
  },

  // Transactions
  getTransactions: (): Transaction[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  },

  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
    const list = STORAGE.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [newTx, ...list];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    return newTx;
  },

  // Products
  getShopeeProducts: (): ShopeeProduct[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPEE_PRODUCTS);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.SHOPEE_PRODUCTS, JSON.stringify(DEFAULT_SHOPEE_PRODUCTS));
      return DEFAULT_SHOPEE_PRODUCTS;
    } catch {
      return DEFAULT_SHOPEE_PRODUCTS;
    }
  },

  setShopeeProducts: (products: ShopeeProduct[]) => {
    localStorage.setItem(STORAGE_KEYS.SHOPEE_PRODUCTS, JSON.stringify(products));
  },

  resetShopeeProducts: () => {
    localStorage.setItem(STORAGE_KEYS.SHOPEE_PRODUCTS, JSON.stringify(DEFAULT_SHOPEE_PRODUCTS));
    return DEFAULT_SHOPEE_PRODUCTS;
  },

  clearShopeeProducts: () => {
    localStorage.setItem(STORAGE_KEYS.SHOPEE_PRODUCTS, JSON.stringify([]));
    return [];
  },

  // Cart Management
  getCart: (): CartItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPEE_CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart: (items: CartItem[]) => {
    localStorage.setItem(STORAGE_KEYS.SHOPEE_CART, JSON.stringify(items));
  },

  addToCart: (product: ShopeeProduct, quantity: number = 1): CartItem[] => {
    const current = STORAGE.getCart();
    const existingIndex = current.findIndex((item) => item.product.id === product.id);
    if (existingIndex >= 0) {
      current[existingIndex].quantity += quantity;
    } else {
      current.push({ product, quantity });
    }
    STORAGE.saveCart(current);
    return current;
  },

  clearCart: () => {
    localStorage.setItem(STORAGE_KEYS.SHOPEE_CART, JSON.stringify([]));
  },
};
