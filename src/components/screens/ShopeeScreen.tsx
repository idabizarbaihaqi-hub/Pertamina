import React, { useState, useMemo, useEffect } from 'react';
import { ShopeeProduct, ShopeeCategory, User, CartItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { STORAGE } from '../../services/storage';
import {
  Search,
  SlidersHorizontal,
  Upload,
  Download,
  Star,
  ShieldCheck,
  MapPin,
  X,
  CheckCircle2,
  PackageX,
  ShoppingBag,
  RotateCcw,
  Plus,
  Minus,
  AlertCircle,
  FileSpreadsheet,
  ShoppingCart,
  Trash2,
  ArrowUpDown,
  Check,
  Smartphone,
  Laptop,
} from 'lucide-react';

interface ShopeeScreenProps {
  user: User;
  onPaymentSuccess: (amount: number, title: string) => void;
}

const CATEGORIES: ShopeeCategory[] = [
  'Elektronik',
  'Fashion',
  'Kecantikan',
  'Makanan dan Minuman',
  'Rumah Tangga',
  'Kesehatan',
  'Aksesori',
  'Produk Lainnya',
];

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

export const ShopeeScreen: React.FC<ShopeeScreenProps> = ({
  user,
  onPaymentSuccess,
}) => {
  const [products, setProducts] = useState<ShopeeProduct[]>(() =>
    STORAGE.getShopeeProducts()
  );
  const [cart, setCart] = useState<CartItem[]>(() => STORAGE.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopeeCategory | 'Semua'>('Semua');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'popular'>('default');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  const [selectedProduct, setSelectedProduct] = useState<ShopeeProduct | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Pagination / Chunked rendering state for 1,600 products
  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedCategory, sortBy, brandFilter]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: products.length };
    CATEGORIES.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [products]);

  // Brands for Elektronik
  const phoneBrands = ['Samsung', 'iPhone', 'Xiaomi', 'OPPO', 'vivo', 'Infinix', 'TECNO', 'realme'];
  const laptopBrands = ['ASUS', 'Acer', 'Lenovo', 'HP', 'Dell', 'MSI', 'Axioo', 'Advan'];

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));

      let matchBrand = true;
      if (brandFilter !== 'all') {
        matchBrand = p.name.toLowerCase().includes(brandFilter.toLowerCase());
      }

      return matchCat && matchQuery && matchBrand;
    });

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list = [...list].sort((a, b) => b.soldCount - a.soldCount);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy, brandFilter]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Cart operations
  const cartTotalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (product: ShopeeProduct, qty: number = 1) => {
    const updated = STORAGE.addToCart(product, qty);
    setCart(updated);
    setToastMessage(`"${product.name.slice(0, 24)}..." ditambahkan ke keranjang.`);
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    let updated: CartItem[];
    if (newQty <= 0) {
      updated = cart.filter((item) => item.product.id !== productId);
    } else {
      updated = cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    }
    setCart(updated);
    STORAGE.saveCart(updated);
  };

  const handleClearCart = () => {
    STORAGE.clearCart();
    setCart([]);
  };

  // Direct checkout (single product or from cart)
  const [checkoutType, setCheckoutType] = useState<'single' | 'cart'>('single');

  const handleStartSingleCheckout = () => {
    if (!selectedProduct) return;
    setCheckoutType('single');
    setCheckoutError(null);
    setIsCheckoutModalOpen(true);
  };

  const handleStartCartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutType('cart');
    setCheckoutError(null);
    setIsCheckoutModalOpen(true);
  };

  const handleProcessCheckout = () => {
    const totalCost = checkoutType === 'single'
      ? (selectedProduct ? selectedProduct.price * quantity : 0)
      : cartTotalPrice;

    if (user.saldoUtama < totalCost) {
      setCheckoutError('Saldo Utama MyPertamina Pay tidak mencukupi untuk transaksi ini.');
      return;
    }

    setCheckoutSuccess(true);
    setTimeout(() => {
      const title = checkoutType === 'single' && selectedProduct
        ? `Shopee • ${selectedProduct.name}`
        : `Shopee • Belanja ${cartTotalItems} Barang`;

      onPaymentSuccess(totalCost, title);
      setCheckoutSuccess(false);
      setIsCheckoutModalOpen(false);

      if (checkoutType === 'cart') {
        handleClearCart();
        setIsCartOpen(false);
      } else {
        setSelectedProduct(null);
        setQuantity(1);
      }
    }, 1200);
  };

  // Import JSON with validation
  const handleImportJson = () => {
    setImportNotice(null);
    setImportError(null);

    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setImportError('Format JSON harus berupa array daftar produk yang tidak kosong (contoh: [{...}, {...}]).');
        return;
      }

      // Validate each item
      const seenIds = new Set<string>();
      const validated: ShopeeProduct[] = [];

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || typeof item !== 'object') {
          setImportError(`Item pada index ${i} bukan objek yang valid.`);
          return;
        }

        const id = item.id ? String(item.id).trim() : `shp_imp_${Date.now()}_${i}`;
        if (seenIds.has(id)) {
          setImportError(`Ditemukan ID produk duplikat "${id}" pada data impor.`);
          return;
        }
        seenIds.add(id);

        const name = item.name ? String(item.name).trim() : '';
        if (!name) {
          setImportError(`Item pada index ${i} wajib memiliki properti 'name'.`);
          return;
        }

        const price = Number(item.price);
        if (isNaN(price) || price <= 0) {
          setImportError(`Produk "${name}" memiliki harga yang tidak valid (${item.price}).`);
          return;
        }

        const category = CATEGORIES.includes(item.category)
          ? item.category
          : 'Produk Lainnya';

        validated.push({
          id,
          name,
          price,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          category,
          image: item.image ? String(item.image).trim() : FALLBACK_PRODUCT_IMAGE,
          description: item.description ? String(item.description).trim() : 'Deskripsi produk belum ditambahkan.',
          rating: Number(item.rating) || 0,
          reviewCount: Number(item.reviewCount) || 0,
          soldCount: Number(item.soldCount) || 0,
          stock: Number(item.stock) || 50,
          location: item.location ? String(item.location).trim() : 'Indonesia',
          specifications: (item.specifications && typeof item.specifications === 'object')
            ? item.specifications
            : { 'Status data': 'Terverifikasi Internal' },
        });
      }

      STORAGE.setShopeeProducts(validated);
      setProducts(validated);
      setImportNotice(`Berhasil memvalidasi dan mengimpor ${validated.length} produk ke dalam katalog!`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportNotice(null);
      }, 1500);
    } catch {
      setImportError('Format JSON tidak valid. Periksa kembali struktur tanda kurung dan tanda petik.');
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'katalog_shopee_mypertaminapay.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetCatalog = () => {
    const reset = STORAGE.resetShopeeProducts();
    setProducts(reset);
    setIsImportModalOpen(false);
    setToastMessage('Katalog resmi berhasil dipulihkan (1.600 produk).');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-md mx-auto space-y-3.5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Halaman Shopee dengan Keranjang */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-4 text-white shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">Shopee</h1>
              <p className="text-[11px] text-orange-100 font-medium">
                Mitra Resmi Pembayaran MyPertamina Pay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {cartTotalItems > 99 ? '99+' : cartTotalItems}
                </span>
              )}
            </button>

            {/* Import / Export Tool Trigger */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Kelola & Impor Katalog"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Kolom Pencarian Produk */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari HP, Laptop, Baju, Kopi..."
            className="w-full pl-10 pr-8 py-2.5 bg-white text-slate-900 rounded-2xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Delapan Kategori Produk (Horizontal Scroll Filter) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => {
            setSelectedCategory('Semua');
            setBrandFilter('all');
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'Semua'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          <span>Semua</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'Semua' ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {categoryCounts['Semua'] || 0}
          </span>
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setBrandFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat ? 'bg-orange-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {categoryCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Sub-kategori HP & Laptop jika Kategori Elektronik Terpilih */}
      {selectedCategory === 'Elektronik' && (
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1 text-slate-700">
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Merek HP & Laptop Populer:</span>
            </span>
            {brandFilter !== 'all' && (
              <button
                onClick={() => setBrandFilter('all')}
                className="text-orange-600 hover:underline"
              >
                Reset Filter Merek
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setBrandFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                brandFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Merek
            </button>
            {phoneBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  brandFilter === brand
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {brand}
              </button>
            ))}
            {laptopBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setBrandFilter(brand)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  brandFilter === brand
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sorting & Filter Bar */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="text-slate-500 font-medium">
          {Math.min(visibleCount, filteredProducts.length)} dari {filteredProducts.length.toLocaleString('id-ID')} produk
        </span>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-xs"
          >
            <option value="default">Urutan Standar</option>
            <option value="price_asc">Harga: Termurah</option>
            <option value="price_desc">Harga: Termahal</option>
            <option value="popular">Paling Populer</option>
          </select>
        </div>
      </div>

      {/* 4. TAMPILAN KATALOG KOSONG */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full mx-auto flex items-center justify-center">
            <PackageX className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Tidak ada produk yang cocok dengan pencarian &quot;{searchQuery}&quot;. Silakan ganti kata kunci atau pulihkan katalog terverifikasi.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
                setBrandFilter('all');
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset Filter
            </button>
            <button
              onClick={handleResetCatalog}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Muat Katalog 1.600 Produk</span>
            </button>
          </div>
        </div>
      ) : (
        /* 5. GRID KARTU PRODUK */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image Area with Fallback */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image || FALLBACK_PRODUCT_IMAGE}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-800 flex items-center gap-0.5 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating || '4.8'}</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 truncate font-semibold">
                      {product.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <p className="text-xs sm:text-sm font-extrabold text-red-600 tabular-nums">
                      {formatRupiah(product.price)}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <div className="flex items-center gap-0.5 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                        <span className="truncate">{product.location || 'Indonesia'}</span>
                      </div>
                      <span className="shrink-0">{product.soldCount > 0 ? `${product.soldCount} terjual` : 'Terbaru'}</span>
                    </div>

                    {/* Action Buttons: Detail & Tambah Keranjang */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                      <button
                        onClick={() => handleAddToCart(product, 1)}
                        className="col-span-1 p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center transition-colors"
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setQuantity(1);
                          setCheckoutError(null);
                        }}
                        className="col-span-3 py-1.5 px-2 bg-slate-900 hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center"
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Muat Lebih Banyak */}
          {visibleCount < filteredProducts.length && (
            <div className="pt-2 pb-2 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-700 rounded-2xl text-xs font-bold shadow-xs transition-all active:scale-[0.99]"
              >
                Muat Lebih Banyak ({visibleCount} dari {filteredProducts.length.toLocaleString('id-ID')} Produk)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95">
            {/* Header Image */}
            <div className="relative aspect-16/10 bg-slate-100">
              <img
                src={selectedProduct.image || FALLBACK_PRODUCT_IMAGE}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 backdrop-blur-xs"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {selectedProduct.verificationStatus ||
                    selectedProduct.specifications?.['Status data'] ||
                    'Terverifikasi Internal'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-orange-600">
                  {selectedProduct.category}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{selectedProduct.rating || '4.8'}</span>
                  </div>
                  <span>·</span>
                  <span>{selectedProduct.reviewCount || '150'} Penilaian</span>
                  <span>·</span>
                  <span>{selectedProduct.soldCount || '320'} Terjual</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-3.5 bg-orange-50/70 border border-orange-100 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-orange-700 font-semibold block">Harga Resmi</span>
                  <p className="text-xl font-extrabold text-red-600 tabular-nums">
                    {formatRupiah(selectedProduct.price)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Stok Tersedia</span>
                  <p className="text-xs font-bold text-slate-800">{selectedProduct.stock || 50} unit</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Deskripsi Produk
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Spesifikasi */}
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Spesifikasi Produk
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs">
                    {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                        <span className="text-slate-500">{key}</span>
                        <span className="font-medium text-slate-800 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-700">Jumlah Beli:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-slate-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, quantity);
                    setSelectedProduct(null);
                  }}
                  className="py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>
                <button
                  onClick={handleStartSingleCheckout}
                  className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DRAWER KERANJANG BELANJA */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-900 text-sm">Keranjang Belanja</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                  {cartTotalItems} Barang
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <ShoppingCart className="w-12 h-12 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-700">Keranjang Masih Kosong</p>
                  <p className="text-[11px] text-slate-400">Pilih produk dan masukkan ke keranjang</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl border border-slate-100 bg-white shadow-xs flex gap-3"
                  >
                    <img
                      src={item.product.image || FALLBACK_PRODUCT_IMAGE}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
                      }}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-extrabold text-red-600 tabular-nums mt-0.5">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleUpdateCartQuantity(item.product.id, 0)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(cartTotalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Ongkos Kirim</span>
                    <span className="font-bold text-emerald-600">Gratis (Promo)</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Total Pembayaran</span>
                    <span className="text-red-600 tabular-nums">{formatRupiah(cartTotalPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleClearCart}
                    className="py-3 px-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600"
                  >
                    Kosongkan
                  </button>
                  <button
                    onClick={handleStartCartCheckout}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
                  >
                    Checkout ({formatRupiah(cartTotalPrice)})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MODAL CHECKOUT SALDO UTAMA MYPERTAMINA PAY */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Konfirmasi Pembayaran</h3>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pembayaran Berhasil!</h4>
                <p className="text-xs text-slate-500">
                  Pesanan Shopee Anda telah berhasil dibayar melalui Saldo Utama MyPertamina Pay.
                </p>
              </div>
            ) : (
              <div className="py-3 space-y-3.5">
                {checkoutError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-2xl space-y-2 text-xs">
                  {checkoutType === 'single' && selectedProduct ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Produk</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                          {selectedProduct.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah</span>
                        <span className="font-semibold text-slate-900">{quantity} item</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-2 font-bold">
                        <span className="text-slate-700">Total Tagihan</span>
                        <span className="text-red-600 tabular-nums">
                          {formatRupiah(selectedProduct.price * quantity)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Barang</span>
                        <span className="font-semibold text-slate-900">{cartTotalItems} item ({cart.length} produk)</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200/80 pt-2 font-bold">
                        <span className="text-slate-700">Total Tagihan</span>
                        <span className="text-red-600 tabular-nums">
                          {formatRupiah(cartTotalPrice)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Sumber Dana */}
                <div className="p-3 rounded-2xl border border-red-100 bg-red-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-600">
                      Metode Pembayaran
                    </span>
                    <p className="font-bold text-slate-900">Saldo Utama MyPertamina Pay</p>
                    <p className="text-[11px] text-slate-500">
                      Sisa Saldo: {formatRupiah(user.saldoUtama)}
                    </p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-red-600" />
                </div>

                <button
                  onClick={handleProcessCheckout}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
                >
                  Bayar Sekarang ({formatRupiah(
                    checkoutType === 'single' && selectedProduct
                      ? selectedProduct.price * quantity
                      : cartTotalPrice
                  )})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. MODAL IMPOR & KELOLA KATALOG */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Kelola & Impor Katalog Shopee
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Impor katalog produk menggunakan array JSON terstruktur: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">id, name, price, category, image, description, specifications</code>.
              </p>

              {importNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importNotice}</span>
                </div>
              )}

              {importError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Input JSON */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Tempel Array JSON Katalog:
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='[&#10;  {&#10;    "id": "ELK-0999",&#10;    "name": "Samsung Galaxy S24 Ultra",&#10;    "price": 18999000,&#10;    "category": "Elektronik",&#10;    "description": "Flagship smartphone dengan S-Pen",&#10;    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"&#10;  }&#10;]'
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleImportJson}
                disabled={!importJsonText.trim()}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Validasi & Terapkan Impor</span>
              </button>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="font-bold text-slate-800 block">Pilihan Tindakan Katalog:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportJson}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor JSON ({products.length})</span>
                  </button>
                  <button
                    onClick={handleResetCatalog}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Muat 1.600 Produk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
