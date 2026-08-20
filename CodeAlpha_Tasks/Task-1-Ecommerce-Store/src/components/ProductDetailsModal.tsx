import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onProductUpdated: (updated: Product) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onProductUpdated,
  onBuyNow,
}) => {
  if (!product) return null;

  const { addItem, items } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedImg, setSelectedImg] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(user?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const images = [product.image, ...(product.additionalImages || [])];
  const cartItem = items.find((i) => i.product.id === product.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const maxAvailable = Math.max(0, product.countInStock - currentInCart);

  const handleAddToCart = () => {
    if (!product.inStock || product.countInStock <= 0) {
      showToast('Item is out of stock', 'error');
      return;
    }
    addItem(product, quantity);
    showToast(`Added ${quantity} × "${product.name}" to cart`);
  };

  const handleInstantBuy = () => {
    if (!product.inStock || product.countInStock <= 0) {
      showToast('Item is out of stock', 'error');
      return;
    }
    onBuyNow(product, quantity);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review comment', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          userName: reviewerName.trim() || user?.name || 'Verified Buyer',
          userId: user?.id || 'anon',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to post review');
      }

      const updatedProduct = await res.json();
      onProductUpdated(updatedProduct);
      setReviewComment('');
      showToast('Thank you! Your review has been published.');
    } catch (err: any) {
      showToast(err.message || 'Error submitting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-zinc-100/90 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
            {/* Left Column: Image Gallery */}
            <div className="p-6 sm:p-8 bg-zinc-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200">
              <div className="space-y-4">
                {/* Main Large Image */}
                <div className="aspect-square rounded-2xl bg-white overflow-hidden border border-zinc-200/80 shadow-sm relative group">
                  <img
                    src={selectedImg || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-zinc-950 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImg(img)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          selectedImg === img
                            ? 'border-zinc-900 shadow-md scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 pt-6 border-t border-zinc-200 grid grid-cols-3 gap-2 text-center text-zinc-600">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-zinc-800" />
                  <span className="text-[11px] font-semibold text-zinc-800">Fast 2-3 Day</span>
                  <span className="text-[10px] text-zinc-400">Insured delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-zinc-800" />
                  <span className="text-[11px] font-semibold text-zinc-800">2-Year Warranty</span>
                  <span className="text-[10px] text-zinc-400">Full replacement</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-zinc-800" />
                  <span className="text-[11px] font-semibold text-zinc-800">Free Returns</span>
                  <span className="text-[10px] text-zinc-400">30-day window</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Brand & Category */}
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <span className="font-bold uppercase tracking-wider text-zinc-600">
                    {product.brand}
                  </span>
                  <span className="bg-zinc-100 text-zinc-700 font-semibold px-2.5 py-0.5 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-200 fill-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{product.rating}</span>
                  <span className="text-xs text-zinc-400">
                    &bull; {product.numReviews} customer reviews
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 mb-5">
                  <span className="text-3xl font-black text-zinc-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-zinc-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                      Save ${(product.originalPrice! - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status Indicator */}
                <div className="mb-5 flex items-center gap-2 text-xs font-semibold">
                  {product.inStock && product.countInStock > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>In Stock ({product.countInStock} units available)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/60">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Currently Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-zinc-200 gap-6 mb-4 text-sm font-semibold">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-all border-b-2 ${
                      activeTab === 'details'
                        ? 'border-zinc-900 text-zinc-900'
                        : 'border-transparent text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    Description
                  </button>
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <button
                      onClick={() => setActiveTab('specs')}
                      className={`pb-2 transition-all border-b-2 ${
                        activeTab === 'specs'
                          ? 'border-zinc-900 text-zinc-900'
                          : 'border-transparent text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      Specifications
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-all border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'reviews'
                        ? 'border-zinc-900 text-zinc-900'
                        : 'border-transparent text-zinc-400 hover:text-zinc-700'
                    }`}
                  >
                    <span>Reviews</span>
                    <span className="text-[11px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded-full">
                      {product.reviews?.length || 0}
                    </span>
                  </button>
                </div>

                {/* Tab 1: Description */}
                {activeTab === 'details' && (
                  <div className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6 space-y-3">
                    <p>{product.description}</p>
                  </div>
                )}

                {/* Tab 2: Specs */}
                {activeTab === 'specs' && product.specs && (
                  <div className="mb-6 rounded-xl border border-zinc-100 overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val], idx) => (
                          <tr
                            key={key}
                            className={idx % 2 === 0 ? 'bg-zinc-50/70' : 'bg-white'}
                          >
                            <td className="py-2 px-3 font-semibold text-zinc-700 w-1/3 border-b border-zinc-100">
                              {key}
                            </td>
                            <td className="py-2 px-3 text-zinc-600 border-b border-zinc-100">
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === 'reviews' && (
                  <div className="mb-6 space-y-4 max-h-56 overflow-y-auto pr-1">
                    {/* Add Review Form */}
                    <form onSubmit={handleSubmitReview} className="bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                      <p className="text-xs font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                        Write a Customer Review
                      </p>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-[11px] text-zinc-500 mr-2">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-0.5 focus:outline-none"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= reviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {!user && (
                        <input
                          type="text"
                          placeholder="Your Name (e.g. Jordan)"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full mb-2 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs"
                        />
                      )}

                      <textarea
                        rows={2}
                        placeholder="Share your experience with this item..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                        required
                      />

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>

                    {/* Reviews List */}
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-white rounded-xl border border-zinc-100 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-zinc-900">{rev.userName}</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-zinc-600">{rev.comment}</p>
                          <span className="text-[10px] text-zinc-400 mt-1 block">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-400 italic">No reviews yet. Be the first to leave one!</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-4 border-t border-zinc-200 space-y-3">
                {product.inStock && product.countInStock > 0 ? (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-1">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-extrabold text-sm text-zinc-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                          className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-2xl font-bold text-sm transition-all active:scale-98"
                      >
                        <ShoppingBag className="w-4 h-4 text-zinc-700" />
                        <span>Add to Cart &bull; ${(product.price * quantity).toFixed(2)}</span>
                      </button>
                    </div>

                    {/* Buy Now Button */}
                    <button
                      onClick={handleInstantBuy}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-98"
                    >
                      <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>Buy Now with 1-Click</span>
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full py-3.5 bg-zinc-100 text-zinc-400 font-bold rounded-2xl text-sm cursor-not-allowed"
                  >
                    Sold Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
