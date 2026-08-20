import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Package,
  ShieldAlert,
  LogOut,
  HelpCircle,
  X,
  Menu,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Category } from '../types';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  onOpenInfo,
}) => {
  const { user, logout, loginAsDemo } = useAuth();
  const { totalItemsCount, openCart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectCategory('all')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold tracking-wider shadow-sm group-hover:bg-zinc-800 transition-colors">
                AP
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-zinc-900 block leading-tight">
                  APEX<span className="text-zinc-500 font-medium ml-1">STORE</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase block">
                  Express &bull; Node &bull; React
                </span>
              </div>
            </button>

            {/* Desktop Category Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-4">
              {categories.slice(0, 5).map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search premium headphones, apparel, watches, decor..."
                className="w-full pl-9 pr-9 py-2 bg-zinc-100/80 hover:bg-zinc-100 focus:bg-white text-zinc-900 text-sm rounded-xl border border-transparent focus:border-zinc-300 focus:outline-none transition-all placeholder:text-zinc-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Guide & Setup Info Button */}
            <button
              onClick={onOpenInfo}
              title="How to Run & Architecture"
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            >
              <HelpCircle className="w-4 h-4 text-zinc-500" />
              <span className="hidden xl:inline">Run Guide</span>
            </button>

            {/* Admin Panel Button */}
            {user?.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* Orders Button */}
            <button
              onClick={onOpenOrders}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="My Orders & Tracking"
            >
              <Package className="w-4 h-4 text-zinc-500" />
              <span className="hidden sm:inline">Orders</span>
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-xs font-semibold text-zinc-800"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-lg bg-zinc-200 object-cover"
                  />
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-zinc-600" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserMenu && user && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2.5 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      Role: {user.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenOrders();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                  >
                    <Package className="w-3.5 h-3.5 text-zinc-500" />
                    My Orders & Tracking
                  </button>

                  {user.role === 'admin' ? (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Store Admin Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        loginAsDemo('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Switch to Admin Account
                    </button>
                  )}

                  <div className="border-t border-zinc-100 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="ml-0.5 bg-amber-400 text-zinc-950 font-bold text-[11px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 bg-zinc-100 text-zinc-900 text-sm rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Categories Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-100 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {cat.name} ({cat.itemCount})
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
