import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = user?.role === 'admin' ? '/api/orders' : `/api/orders?userId=${user?.id || 'guest'}`;
      const res = await fetch(url, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        if (data.length > 0 && !expandedOrderId) {
          setExpandedOrderId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const getProgressStage = (status: OrderStatus) => {
    if (status === 'Cancelled') return 0;
    if (status === 'Processing') return 1;
    if (status === 'Confirmed') return 2;
    if (status === 'Shipped') return 3;
    if (status === 'Delivered') return 4;
    return 1;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-auto flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-900 text-white rounded-xl">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 leading-tight">
                  Orders & Live Package Tracking
                </h3>
                <p className="text-xs text-zinc-500">
                  {user ? `Logged in as ${user.name}` : 'Showing all recorded store orders'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
                title="Refresh Orders"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loading && orders.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-400" />
                Loading orders database...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 space-y-3">
                <Package className="w-12 h-12 mx-auto text-zinc-300 stroke-1" />
                <h4 className="font-bold text-zinc-800 text-base">No orders found</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  You haven't placed any orders yet. Add items to your cart and proceed through checkout to test the system!
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const stage = getProgressStage(order.status);

                return (
                  <div
                    key={order.id}
                    className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all hover:border-zinc-300"
                  >
                    {/* Order Summary Bar */}
                    <div
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-4 bg-zinc-50/70 hover:bg-zinc-50 flex items-center justify-between cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold font-mono text-zinc-900">{order.id}</span>
                        <span className="text-zinc-400">&bull;</span>
                        <span className="text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm text-zinc-900">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-zinc-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-zinc-200/80 space-y-5 bg-white">
                        {/* Progress Stepper Timeline */}
                        {order.status !== 'Cancelled' && (
                          <div className="py-2 px-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600 mb-2">
                              <span className={stage >= 1 ? 'text-zinc-900' : 'text-zinc-400'}>
                                Order Placed
                              </span>
                              <span className={stage >= 2 ? 'text-zinc-900' : 'text-zinc-400'}>
                                Confirmed
                              </span>
                              <span className={stage >= 3 ? 'text-zinc-900' : 'text-zinc-400'}>
                                In Transit (Shipped)
                              </span>
                              <span className={stage >= 4 ? 'text-emerald-700 font-extrabold' : 'text-zinc-400'}>
                                Delivered
                              </span>
                            </div>
                            <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  stage === 4 ? 'bg-emerald-500' : 'bg-zinc-900'
                                }`}
                                style={{ width: `${(stage / 4) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Items in this order */}
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                            Ordered Products ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </span>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 bg-zinc-50/50 rounded-xl border border-zinc-100 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-zinc-200/50"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-bold text-zinc-900 line-clamp-1">
                                    {item.product.name}
                                  </p>
                                  <p className="text-zinc-400 text-[11px]">
                                    Qty: {item.quantity} &bull; ${item.product.price.toFixed(2)} each
                                  </p>
                                </div>
                              </div>
                              <span className="font-extrabold text-zinc-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping & Payment Meta */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200/80">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-zinc-800 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                              <span>Delivery Address</span>
                            </div>
                            <p className="text-zinc-900 font-semibold">{order.shippingAddress.fullName}</p>
                            <p className="text-zinc-500">
                              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                              {order.shippingAddress.state} {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-zinc-500">{order.shippingAddress.phone}</p>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-zinc-800 mb-1">
                              <Truck className="w-3.5 h-3.5 text-zinc-600" />
                              <span>Dispatch & Payment</span>
                            </div>
                            <p className="text-zinc-700">
                              <strong className="text-zinc-900">Method:</strong> {order.shippingMethod?.name || 'Standard Shipping'}
                            </p>
                            <p className="text-zinc-700">
                              <strong className="text-zinc-900">Payment:</strong> {order.paymentMethod}
                            </p>
                            <p className="text-zinc-700">
                              <strong className="text-zinc-900">Customer:</strong> {order.userEmail}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
