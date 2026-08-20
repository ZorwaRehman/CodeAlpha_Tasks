import React, { useState, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Star,
  ChevronRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Banner } from './components/Banner';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { OrdersModal } from './components/OrdersModal';
import { AdminDashboard } from './components/AdminDashboard';
import { InfoModal } from './components/InfoModal';
import { Product, Category, CartItem, Order } from './types';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  // Fetch Categories and Products
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice > 0) params.append('minPrice', minPrice.toString());
      if (maxPrice < 600) params.append('maxPrice', maxPrice.toString());
      if (sortBy) params.append('sort', sortBy);
      if (inStockOnly) params.append('inStockOnly', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        let data: Product[] = await res.json();
        if (minRating > 0) {
          data = data.filter((p) => p.rating >= minRating);
        }
        setProducts(data);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy, minPrice, maxPrice, inStockOnly, minRating]);

  const handleProductUpdated = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProduct(updated);
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    setSelectedProduct(null);
    setDirectBuyItem({ product, quantity });
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: Order) => {
    fetchProducts();
    fetchCategories();
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setMinPrice(0);
    setMaxPrice(600);
    setInStockOnly(false);
    setMinRating(0);
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minPrice > 0 || maxPrice < 600 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Announcements Banner */}
      <Banner />

      {/* Main Navbar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Hero Showcase Strip */}
      <section className="bg-white border-b border-zinc-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-zinc-100 text-zinc-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Express.js &bull; Node.js &bull; React Full-Stack
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-900">
                Curated Design & Tech Essentials
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
                Precision hardware, luxury accessories, and minimalist apparel with live database inventory and instant order processing.
              </p>
            </div>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.itemCount !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.slug
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {cat.itemCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Catalog & Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-6">
            <div className="p-5 bg-white rounded-2xl border border-zinc-200/90 shadow-2xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2 font-black text-sm text-zinc-900">
                  <SlidersHorizontal className="w-4 h-4 text-zinc-700" />
                  <span>Filter Products</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-zinc-500 hover:text-rose-600 font-semibold"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Category
                </span>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-zinc-900 text-white font-bold'
                          : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-2">
                  <span>Price Range</span>
                  <span className="text-zinc-900 font-mono">
                    ${minPrice} - ${maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="25"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-zinc-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                  <span>$0</span>
                  <span>$300</span>
                  <span>$600</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-3 border-t border-zinc-100">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">
                  Customer Rating
                </span>
                <div className="space-y-1">
                  {[0, 4.8, 4.5, 4.0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        minRating === rating
                          ? 'bg-zinc-100 text-zinc-900 font-bold'
                          : 'text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rating === 0 ? 'All Ratings' : `${rating} Stars & Up`}</span>
                      </div>
                      {minRating === rating && <Check className="w-3.5 h-3.5 text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Toggle */}
              <div className="pt-3 border-t border-zinc-100">
                <label className="flex items-center justify-between text-xs font-semibold text-zinc-700 cursor-pointer">
                  <span>In-Stock Items Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 accent-zinc-900 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT GRID & CONTROLS */}
          <div className="flex-1 space-y-6">
            
            {/* Sort & Mobile Filter Controls */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/90 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="text-xs font-bold text-zinc-700">
                Showing <span className="text-zinc-950 font-black">{products.length}</span>{' '}
                {products.length === 1 ? 'Product' : 'Products'}
                {searchQuery && (
                  <span className="text-zinc-500 font-normal ml-1">
                    for &ldquo;<strong className="text-zinc-800">{searchQuery}</strong>&rdquo;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-zinc-400 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border-none rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown Drawer/Panel */}
            {showMobileFilters && (
              <div className="lg:hidden p-4 bg-white rounded-2xl border border-zinc-200 space-y-4 text-xs animate-in fade-in duration-150">
                <div className="flex justify-between items-center font-bold">
                  <span>Mobile Filter Options</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-zinc-500 hover:text-rose-600 font-semibold"
                  >
                    Reset
                  </button>
                </div>

                <div>
                  <span className="font-semibold block mb-1">Category</span>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-2.5 py-1 rounded-lg font-semibold ${
                          selectedCategory === cat.slug
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold block mb-1">Max Price: ${maxPrice}</span>
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="25"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>

                <label className="flex items-center gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-zinc-900"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-3 animate-pulse"
                  >
                    <div className="aspect-square bg-zinc-200 rounded-xl" />
                    <div className="h-4 bg-zinc-200 rounded w-2/3" />
                    <div className="h-3 bg-zinc-100 rounded w-full" />
                    <div className="h-5 bg-zinc-200 rounded w-1/3 pt-2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-zinc-200/80 p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                  <Search className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">No matching products</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    Try adjusting your search terms, clearing active filters, or changing your price range.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Trust & Guarantee Perks Banner */}
      <section className="bg-white border-t border-zinc-200 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-900 text-white rounded-xl shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900">Express Tracked Delivery</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Free standard shipping on all orders over $75 with automated tracking and SMS dispatches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-900 text-white rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900">2-Year Official Warranty</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Complete hardware protection, instant product exchanges, and responsive technical support.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div className="p-3 bg-zinc-900 text-white rounded-xl shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900">30-Day Risk-Free Returns</h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Not totally delighted? Return your items for a 100% full refund within 30 days of arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 text-xs py-10 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black">
              AP
            </div>
            <div>
              <p className="font-bold text-white text-sm">Apex Store Full-Stack</p>
              <p className="text-zinc-500 text-[11px]">
                Built with Express.js backend, Node.js, and React 19
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <button onClick={() => setIsInfoOpen(true)} className="hover:text-white transition-colors">
              How to Run
            </button>
            <button onClick={() => setIsOrdersOpen(true)} className="hover:text-white transition-colors">
              Orders Tracking
            </button>
            <button
              onClick={() => {
                if (user?.role === 'admin') setIsAdminOpen(true);
                else setIsAuthOpen(true);
              }}
              className="hover:text-white transition-colors"
            >
              Admin Portal
            </button>
          </div>

          <p className="text-zinc-500 text-[11px]">
            &copy; 2026 Apex Store Inc. All rights reserved.
          </p>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductUpdated={handleProductUpdated}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        onProceedToCheckout={() => {
          setDirectBuyItem(null);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectBuyItem(null);
        }}
        onOrderPlaced={handleOrderPlaced}
        directBuyItem={directBuyItem}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductsChanged={() => {
          fetchProducts();
          fetchCategories();
        }}
      />

      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
