import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldAlert,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, Order, StoreStats, OrderStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onProductsChanged,
}) => {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // New Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('electronics');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdStock, setNewProdStock] = useState('15');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Edit stock inline
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
        fetch('/api/products'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order #${orderId} marked as ${newStatus}`);
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showToast('Name and price are required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          price: parseFloat(newProdPrice),
          brand: newProdBrand || 'Apex Studio',
          countInStock: parseInt(newProdStock, 10) || 10,
          image: newProdImage,
          description: newProdDesc,
        }),
      });

      if (res.ok) {
        showToast('Product published to store!');
        setIsAddingProduct(false);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdDesc('');
        fetchAdminData();
        onProductsChanged();
      }
    } catch (err) {
      showToast('Error creating product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from store?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Deleted "${name}"`);
        fetchAdminData();
        onProductsChanged();
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleSaveStock = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countInStock: stockInputValue,
          inStock: stockInputValue > 0,
        }),
      });

      if (res.ok) {
        showToast('Inventory stock updated');
        setEditingStockId(null);
        fetchAdminData();
        onProductsChanged();
      }
    } catch (err) {
      showToast('Failed to update stock', 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-auto flex flex-col max-h-[88vh]"
        >
          {/* Top Bar */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white leading-tight">
                  Store Management & Admin Panel
                </h3>
                <p className="text-xs text-zinc-400">
                  Full CRUD access to Database, Inventory & Fulfillment
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAdminData}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200 flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Analytics Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'orders'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Manage Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-1.5 px-3 rounded-lg transition-all ${
                activeTab === 'products'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Product Inventory ({products.length})
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[11px] font-bold uppercase">Total Revenue</span>
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-zinc-900">
                      ${stats.totalRevenue.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[11px] font-bold uppercase">Total Orders</span>
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-zinc-900">
                      {stats.totalOrders}
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[11px] font-bold uppercase">Active Products</span>
                      <ShieldAlert className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-zinc-900">
                      {stats.totalProducts}
                    </span>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                    <div className="flex items-center justify-between text-zinc-400 mb-1">
                      <span className="text-[11px] font-bold uppercase">Registered Users</span>
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-zinc-900">
                      {stats.totalUsers}
                    </span>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                {stats.lowStockProducts.length > 0 && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Low Stock Inventory Warning ({stats.lowStockProducts.length} items)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {stats.lowStockProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 bg-white rounded-xl border border-amber-200/60"
                        >
                          <span className="font-semibold text-zinc-800 line-clamp-1">{p.name}</span>
                          <span className="font-bold text-amber-700 ml-2">
                            {p.countInStock} remaining
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900">Live Customer Orders</h4>
                  <span className="text-zinc-500">{orders.length} total orders</span>
                </div>

                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold font-mono text-zinc-900">{o.id}</span>
                        <span className="text-zinc-400">&bull;</span>
                        <span className="text-zinc-600 font-semibold">{o.userName}</span>
                        <span className="text-zinc-400">({o.userEmail})</span>
                      </div>
                      <p className="text-zinc-500 text-[11px]">
                        {o.items.length} items &bull; Total: <strong className="text-zinc-900">${o.totalPrice.toFixed(2)}</strong> &bull;{' '}
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 font-medium">Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-xl font-bold text-zinc-900 focus:outline-none focus:border-zinc-900"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900">Product Catalog Management</h4>
                  <button
                    onClick={() => setIsAddingProduct(!isAddingProduct)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingProduct ? 'Cancel' : 'Add New Product'}</span>
                  </button>
                </div>

                {/* Add Product Form */}
                {isAddingProduct && (
                  <form
                    onSubmit={handleCreateProduct}
                    className="p-4 bg-zinc-50 rounded-2xl border border-zinc-300 space-y-3"
                  >
                    <h5 className="font-extrabold text-zinc-900">Publish New Product to Database</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-600 font-semibold mb-1">Product Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Ergonomic Studio Desk"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 font-semibold mb-1">Category</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        >
                          <option value="electronics">Electronics & Audio</option>
                          <option value="wearables">Wearables & Watches</option>
                          <option value="fashion">Fashion & Apparel</option>
                          <option value="home">Home & Workspace</option>
                          <option value="accessories">Accessories & EDC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-600 font-semibold mb-1">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="129.99"
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-600 font-semibold mb-1">Initial Stock Units</label>
                        <input
                          type="number"
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-zinc-600 font-semibold mb-1">Image URL (Unsplash)</label>
                        <input
                          type="url"
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-zinc-600 font-semibold mb-1">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Detailed product specifications and highlights..."
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors"
                    >
                      Save & Add to Catalog
                    </button>
                  </form>
                )}

                {/* Products Table */}
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white rounded-2xl border border-zinc-200 flex items-center justify-between gap-3 hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                          <p className="text-zinc-400 text-[11px]">
                            {p.brand} &bull; <span className="capitalize">{p.category}</span> &bull;{' '}
                            <strong className="text-zinc-900">${p.price.toFixed(2)}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Inline stock edit */}
                        {editingStockId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={stockInputValue}
                              onChange={(e) => setStockInputValue(parseInt(e.target.value, 10) || 0)}
                              className="w-16 px-2 py-1 border border-zinc-400 rounded-lg text-xs"
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(p.id);
                              setStockInputValue(p.countInStock);
                            }}
                            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-semibold text-zinc-800"
                            title="Edit Stock"
                          >
                            Stock: {p.countInStock}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
