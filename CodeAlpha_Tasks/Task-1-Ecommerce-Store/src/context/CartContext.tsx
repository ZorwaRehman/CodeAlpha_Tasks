import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

const PROMO_CODES: Record<string, PromoCode> = {
  WELCOME10: { code: 'WELCOME10', discountPercentage: 10, description: '10% New Customer Discount' },
  SAVE20: { code: 'SAVE20', discountPercentage: 20, description: '20% Summer Savings Discount' },
  FREESHIP: { code: 'FREESHIP', discountPercentage: 5, description: '$5 Extra Discount' },
};

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  appliedPromo: PromoCode | null;
  promoError: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  totalItemsCount: number;
  itemsPrice: number;
  discountPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('apex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('apex_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        // Cap by stock
        const maxStock = product.countInStock || 99;
        next[existingIdx].quantity = Math.min(newQty, maxStock);
        return next;
      }
      return [...prev, { product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.countInStock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      setAppliedPromo(PROMO_CODES[cleanCode]);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid promo code. Try WELCOME10 or SAVE20');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const itemsPrice = Number(
    items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toFixed(2)
  );

  const discountPrice = appliedPromo
    ? Number(((itemsPrice * appliedPromo.discountPercentage) / 100).toFixed(2))
    : 0;

  // Free shipping over $75, otherwise $9.99
  const shippingPrice = itemsPrice === 0 || (itemsPrice - discountPrice) >= 75 ? 0 : 9.99;

  // 8% estimated sales tax on discounted item price
  const taxableAmount = Math.max(0, itemsPrice - discountPrice);
  const taxPrice = Number((taxableAmount * 0.08).toFixed(2));

  const totalPrice = Number((taxableAmount + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        appliedPromo,
        promoError,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        totalItemsCount,
        itemsPrice,
        discountPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
