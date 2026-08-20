import React from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addItem, items } = useCart();
  const { showToast } = useToast();

  const cartItem = items.find((i) => i.product.id === product.id);
  const inCartCount = cartItem ? cartItem.quantity : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock || product.countInStock <= 0) {
      showToast('Sorry, this item is out of stock', 'error');
      return;
    }
    addItem(product, 1);
    showToast(`Added "${product.name}" to cart`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const isOutOfStock = !product.inStock || product.countInStock <= 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-zinc-900 font-bold text-xs px-3 py-1.5 rounded-lg shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2.5 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Only {product.countInStock} Left
          </span>
        ) : null}

        {/* Quick Add Overlay Button on desktop */}
        {!isOutOfStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/95 text-zinc-900 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-zinc-950 hover:text-white hover:scale-110 active:scale-95"
            title="Quick Add to Cart"
          >
            {inCartCount > 0 ? (
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold">{inCartCount}</span>
              </div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-500">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-zinc-700 font-bold text-xs">{product.rating}</span>
            <span className="text-zinc-400 text-[11px]">({product.numReviews})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-zinc-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-zinc-700 transition-colors">
          {product.name}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-zinc-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : inCartCount > 0
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-900'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : inCartCount > 0 ? `In Cart (${inCartCount})` : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
