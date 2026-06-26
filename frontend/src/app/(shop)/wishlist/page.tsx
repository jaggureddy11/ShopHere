'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { products, fetchWishlist, isLoading } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchWishlist();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading wishlist...
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-primary px-4 text-center">
        <span className="material-symbols-outlined text-4xl mb-4 text-outline">favorite_border</span>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-8 max-w-xs leading-relaxed">
          Mark your favorite devices and innovation lookbooks to access them here.
        </p>
        <Link
          href="/products"
          className="bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-outline-variant pb-6">
        Your Wishlist ({products.length})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
