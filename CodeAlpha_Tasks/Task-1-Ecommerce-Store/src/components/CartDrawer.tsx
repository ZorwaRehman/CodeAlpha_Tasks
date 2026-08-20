import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    itemsPrice,
    discountPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      showToast(`Promo code "${promoInput.toUpperCase()}" applied!`);
      setPromoInput('');
    }
  };

  const freeShippingThreshold = 75;
  const currentEligible = itemsPrice - discountPrice;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - currentEligible);
  const freeShippingProgress = Math.min(100, Math.round((currentEligible / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs flex justify-end">
        {/* Overlay background click to close */}
        <div className="absolute inset-0" onClick={closeCart} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-900 text-white rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-zinc-900 leading-tight">Your Cart</h2>
                <p className="text-xs text-zinc-500">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in basket
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-400 hover:text-rose-600 transition-colors p-1"
                  title="Clear Cart"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-zinc-100/70 border-b border-zinc-200/80 text-xs">
              <div className="flex items-center justify-between mb-1.5 font-semibold text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-800" />
                  {amountToFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-zinc-950">${amountToFreeShipping.toFixed(2)}</strong> for FREE Shipping
                    </span>
                  ) : (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> You unlocked FREE Shipping!
                    </span>
                  )}
                </div>
                <span>{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800 text-base">Your shopping bag is empty</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Discover high-performance electronics, apparel, and design essentials from our catalog.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-zinc-200/90 bg-white hover:border-zinc-300 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-zinc-900 line-clamp-1 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                        {item.product.brand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-sm text-zinc-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:bg-white rounded-l transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-zinc-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:bg-white rounded-r transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Calculations */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/80 space-y-4">
              {/* Promo Code Input / Applied Badge */}
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {appliedPromo.code} (-{appliedPromo.discountPercentage}%)
                    </span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-rose-600 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Promo code (try WELCOME10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-zinc-400 uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoError && <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">${itemsPrice.toFixed(2)}</span>
                </div>
                {discountPrice > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-${discountPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `$${shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-semibold text-zinc-900">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCart();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <span>Checkout Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
