import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Address, CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
  directBuyItem?: CartItem | null;
}

const SHIPPING_METHODS = [
  {
    id: 'ship-std',
    name: 'Standard Insured Delivery',
    price: 0,
    estimatedDays: '3-5 Business Days',
    description: 'Tracked ground transit with package insurance',
  },
  {
    id: 'ship-exp',
    name: 'Express Air Courier',
    price: 15.0,
    estimatedDays: '1-2 Business Days',
    description: 'Priority flight dispatch & signature upon delivery',
  },
  {
    id: 'ship-pri',
    name: 'Priority Next-Day AM',
    price: 28.0,
    estimatedDays: 'Guaranteed Tomorrow by 10:30 AM',
    description: 'White-glove priority rush dispatch',
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderPlaced,
  directBuyItem,
}) => {
  const { items: cartItems, itemsPrice: cartItemsPrice, discountPrice: cartDiscountPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Form State
  const [address, setAddress] = useState<Address>({
    fullName: user?.name || 'Alex Morgan',
    email: user?.email || 'alex@example.com',
    phone: '+1 (555) 349-8201',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
  });

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'cod'>('credit_card');

  // Simulated Card Info
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4532 •••• •••• 8842',
    cardHolder: user?.name || 'Alex Morgan',
    expiry: '08/29',
    cvv: '842',
  });

  if (!isOpen) return null;

  // Compute items to checkout (either direct buy or full cart)
  const itemsToCheckout = directBuyItem ? [directBuyItem] : cartItems;
  const itemsSubtotal = directBuyItem
    ? directBuyItem.product.price * directBuyItem.quantity
    : cartItemsPrice;
  const discountTotal = directBuyItem ? 0 : cartDiscountPrice;
  const baseShippingCost = selectedShippingMethod.price;
  const taxableAmount = Math.max(0, itemsSubtotal - discountTotal);
  const taxCost = Number((taxableAmount * 0.08).toFixed(2));
  const finalGrandTotal = Number((taxableAmount + baseShippingCost + taxCost).toFixed(2));

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePlaceOrder = async () => {
    if (itemsToCheckout.length === 0) {
      showToast('No items to checkout', 'error');
      return;
    }

    try {
      setIsProcessing(true);

      const orderPayload = {
        items: itemsToCheckout,
        shippingAddress: address,
        shippingMethod: selectedShippingMethod,
        paymentMethod:
          paymentMethod === 'credit_card'
            ? `Credit Card (${cardInfo.cardNumber.slice(-9)})`
            : paymentMethod === 'paypal'
            ? 'PayPal Express Checkout'
            : 'Cash on Delivery',
        itemsPrice: itemsSubtotal,
        discountPrice: discountTotal,
        taxPrice: taxCost,
        shippingPrice: baseShippingCost,
        totalPrice: finalGrandTotal,
        userId: user ? user.id : 'guest',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process order');
      }

      const createdOrder: Order = await res.json();
      setCompletedOrder(createdOrder);
      if (!directBuyItem) {
        clearCart();
      }
      onOrderPlaced(createdOrder);
      setStep(5);
      triggerCelebration();
      showToast(`Order #${createdOrder.id} placed successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Payment or order processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
      showToast('Order ID copied to clipboard');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-auto"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-zinc-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-zinc-800 rounded-lg text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white">
                  Secure Checkout
                </h3>
                <span className="text-[11px] text-zinc-400">
                  256-Bit Encrypted &bull; Instant Processing
                </span>
              </div>
            </div>

            {step !== 5 && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Header (Steps 1 to 4) */}
          {step < 5 && (
            <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between text-xs font-semibold text-zinc-500 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  1
                </span>
                <span className={step === 1 ? 'text-zinc-900 font-bold' : ''}>Shipping Address</span>
              </div>
              <span className="text-zinc-300 mx-2">&rarr;</span>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  2
                </span>
                <span className={step === 2 ? 'text-zinc-900 font-bold' : ''}>Delivery Option</span>
              </div>
              <span className="text-zinc-300 mx-2">&rarr;</span>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 3 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  3
                </span>
                <span className={step === 3 ? 'text-zinc-900 font-bold' : ''}>Payment</span>
              </div>
              <span className="text-zinc-300 mx-2">&rarr;</span>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 4 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  4
                </span>
                <span className={step === 4 ? 'text-zinc-900 font-bold' : ''}>Review</span>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* STEP 1: Shipping Address */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-zinc-900">Where should we deliver your order?</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setAddress({
                        fullName: 'Alex Morgan',
                        email: 'alex@example.com',
                        phone: '+1 (555) 349-8201',
                        street: '742 Evergreen Terrace, Apt 4B',
                        city: 'Seattle',
                        state: 'WA',
                        postalCode: '98101',
                        country: 'United States',
                      });
                      showToast('Autofilled sample shipping address');
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    Use Sample Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-700 font-medium mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-medium mb-1">Email Address for Updates</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-700 font-medium mb-1">Street Address & Apartment/Suite</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-700 font-medium mb-1">State / Province</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-700 font-medium mb-1">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-medium mb-1">Phone Number for Delivery SMS</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-xl focus:border-zinc-900 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Method */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-900 mb-2">Choose your delivery speed</h4>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = selectedShippingMethod.id === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShippingMethod(method)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-zinc-900' : 'border-zinc-300'
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{method.name}</p>
                            <p className="text-[11px] text-zinc-500">{method.description}</p>
                            <span className="text-[11px] font-semibold text-emerald-700">
                              Estimated: {method.estimatedDays}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-zinc-900">
                          {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-900 mb-2">Select payment option</h4>
                
                {/* Method selector pills */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                      paymentMethod === 'credit_card'
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                      paymentMethod === 'paypal'
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                      paymentMethod === 'cod'
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                {/* Card Fields Simulator */}
                {paymentMethod === 'credit_card' && (
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-700 font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-700 font-medium mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardInfo.cardHolder}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-zinc-700 font-medium mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardInfo.expiry}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-700 font-medium mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900">
                    <p className="font-bold">PayPal Sandbox Simulation Active</p>
                    <p className="mt-1 text-blue-700">
                      You will be authenticated via PayPal One-Touch upon confirming the order.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900">
                    <p className="font-bold">Pay Upon Delivery</p>
                    <p className="mt-1 text-amber-800">
                      Please have exact cash ready when courier delivers your package.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Review & Summary */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-zinc-900 mb-2">Review your order</h4>

                {/* Items preview */}
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {itemsToCheckout.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-zinc-500 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-zinc-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address & Method Summary */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs">
                  <div>
                    <span className="text-zinc-400 font-bold uppercase text-[10px] block mb-0.5">
                      Shipping To
                    </span>
                    <p className="font-bold text-zinc-900">{address.fullName}</p>
                    <p className="text-zinc-600 line-clamp-1">{address.street}, {address.city}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-bold uppercase text-[10px] block mb-0.5">
                      Shipping & Payment
                    </span>
                    <p className="font-bold text-zinc-900">{selectedShippingMethod.name}</p>
                    <p className="text-zinc-600 capitalize">{paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-zinc-900">${itemsSubtotal.toFixed(2)}</span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount</span>
                      <span>-${discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-zinc-900">
                      {baseShippingCost === 0 ? 'FREE' : `$${baseShippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-semibold text-zinc-900">${taxCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-zinc-900 pt-2 border-t border-zinc-200">
                    <span>Total Amount</span>
                    <span>${finalGrandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Success Screen */}
            {step === 5 && completedOrder && (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                    Order Confirmed & Processed
                  </span>
                  <h3 className="text-2xl font-black text-zinc-900">Thank you for your order!</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                    We’ve received your order and sent a receipt confirmation to{' '}
                    <strong className="text-zinc-800">{completedOrder.userEmail}</strong>.
                  </p>
                </div>

                {/* Order Details Card */}
                <div className="max-w-md mx-auto p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-left text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold block">Order Number</span>
                      <span className="font-extrabold text-sm font-mono text-zinc-900">{completedOrder.id}</span>
                    </div>
                    <button
                      onClick={handleCopyId}
                      className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 font-semibold p-1"
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedOrderId ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-zinc-600">
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold block">Status</span>
                      <span className="text-emerald-700 font-bold">{completedOrder.status}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold block">Total Paid</span>
                      <span className="font-extrabold text-zinc-900">${completedOrder.totalPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold block">Estimated Arrival</span>
                      <span className="font-semibold text-zinc-800">{completedOrder.shippingMethod.estimatedDays}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] uppercase font-bold block">Payment</span>
                      <span className="font-semibold text-zinc-800">{completedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      setStep(1);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold shadow-md transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Controls */}
          {step < 5 && (
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2 text-zinc-700 hover:bg-zinc-200/70 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && (!address.fullName || !address.street || !address.city)) {
                      showToast('Please complete required shipping fields', 'error');
                      return;
                    }
                    setStep((s) => (s + 1) as any);
                  }}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-lg active:scale-98 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isProcessing ? 'Processing Order...' : `Pay $${finalGrandTotal.toFixed(2)}`}</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
