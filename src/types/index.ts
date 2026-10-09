export interface User {
  id: string;
  fullName: string;
  nik: string;
  phone: string;
  accountNumber: string; // 6-digit unique number e.g. "528190"
  saldoUtama: number;
  saldoTabungan: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  poinMyPertamina: number;
  avatarUrl?: string;
  pin: string;
}

export type TransactionCategory =
  | 'spbu'
  | 'belanja_shopee'
  | 'transfer_out'
  | 'transfer_in'
  | 'topup'
  | 'pln'
  | 'pulsa'
  | 'lainnya';

export interface Transaction {
  id: string;
  type: 'debit' | 'kredit';
  category: TransactionCategory;
  title: string;
  description: string;
  amount: number;
  date: string;
  time: string;
  timestamp: number;
  status: 'Berhasil' | 'Menunggu' | 'Gagal';
  referenceNo: string;
  recipientOrMerchant?: string;
}

export type ShopeeCategory =
  | 'Elektronik'
  | 'Fashion'
  | 'Kecantikan'
  | 'Makanan dan Minuman'
  | 'Rumah Tangga'
  | 'Kesehatan'
  | 'Aksesori'
  | 'Produk Lainnya';

export interface ShopeeProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ShopeeCategory;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  verificationStatus?: string;
  stock: number;
  location: string;
  specifications: Record<string, string>;
}

export interface BankOption {
  code: string;
  name: string;
  logoColor: string;
}

export interface CartItem {
  product: ShopeeProduct;
  quantity: number;
}

