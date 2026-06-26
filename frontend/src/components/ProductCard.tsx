'use client';

import React from 'react';
import Link from 'next/link';
import { IProduct } from '../types';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const activePrice = product.discountPrice || product.price;
  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product, 1);
    toast.success(`${product.name} added to cart!`, { autoClose: 1500 });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      await removeFromWishlist(product._id);
      toast.info(`Removed ${product.name} from wishlist.`, { autoClose: 1500 });
    } else {
      await addToWishlist(product);
      toast.success(`Added ${product.name} to wishlist!`, { autoClose: 1500 });
    }
  };

  // Helper to extract category name
  const categoryName = typeof product.category === 'object' ? product.category.name : 'Tech';

  return (
    <div className="group flex flex-col relative bg-white border border-transparent hover:border-outline-variant hover:shadow-editorial p-3 transition-all duration-300 animate-fade-in-up">
      <Link href={`/products/${product._id}`} className="block relative w-full aspect-[3/4] bg-surface-dim overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Toggle Button overlay */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-white/85 hover:bg-white text-primary p-2 transition-all duration-200 active:scale-90 z-10"
        >
          <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'text-red-600 font-variation-fill-1' : ''}`} style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}>
            favorite
          </span>
        </button>

        {/* Stock status overlay */}
        {product.stock <= 0 ? (
          <span className="absolute bottom-4 left-4 bg-primary text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
            Out of Stock
          </span>
        ) : product.discountPrice ? (
          <span className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
            Sale
          </span>
        ) : null}
      </Link>

      <div className="mt-4 flex flex-col items-start w-full">
        <span className="text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
          {categoryName}
        </span>
        <Link href={`/products/${product._id}`} className="text-sm font-semibold text-primary hover:text-accent transition-colors truncate w-full mb-1">
          {product.name}
        </Link>
        <div className="flex gap-2 items-center mb-4">
          <span className="text-sm font-bold text-primary">${activePrice}</span>
          {product.discountPrice && (
            <span className="text-xs text-outline line-through">${product.price}</span>
          )}
        </div>

        <button
          disabled={product.stock <= 0}
          onClick={handleAddToCart}
          className="w-full bg-primary disabled:bg-outline text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#fb56c1] hover:text-white active:scale-95 transition-all shadow-sm"
        >
          {product.stock <= 0 ? 'Out of stock' : 'Add to bag'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
