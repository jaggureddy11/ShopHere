'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const Navbar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user, logoutUser } = useAuthStore();
  const { fetchCart, getCartCount } = useCartStore();
  const { fetchWishlist, products: wishlistProducts } = useWishlistStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchCart();
    fetchWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/products');
    }
  };

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? wishlistProducts.length : 0;

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-16 py-4 bg-white border-b border-outline-variant transition-all duration-300">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black text-primary tracking-tighter uppercase">
          Shop Here
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/products" className="text-sm font-semibold uppercase text-primary hover:opacity-80 transition-opacity">
            Shop Catalog
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-sm font-semibold uppercase text-accent hover:opacity-80 transition-opacity">
              Admin Dashboard
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-surface-dim px-4 py-2">
          <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-48 p-0 outline-none"
            placeholder="Search products..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-5">
          {isAuthenticated ? (
            <div className="relative group">
              <button className="hover:opacity-80 transition-opacity flex items-center gap-1 active:scale-95">
                <span className="material-symbols-outlined text-[24px]">person</span>
                <span className="text-xs font-semibold uppercase tracking-wider hidden lg:inline max-w-[80px] truncate">
                  {user?.name.split(' ')[0]}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant p-2 hidden group-hover:block shadow-editorial">
                <Link href="/dashboard" className="block px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-dim">
                  My Profile
                </Link>
                <Link href="/orders" className="block px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-dim">
                  Order History
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    router.push('/');
                  }}
                  className="w-full text-left block px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-dim text-red-600 border-t border-outline-variant mt-1 pt-2"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hover:opacity-80 transition-opacity active:scale-95 flex items-center">
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-xs font-semibold uppercase tracking-wider ml-1 hidden lg:inline">Login</span>
            </Link>
          )}

          <Link href="/wishlist" className="hover:opacity-80 transition-opacity active:scale-95 relative">
            <span className="material-symbols-outlined text-[24px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="hover:opacity-80 transition-opacity active:scale-95 relative">
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[10px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
