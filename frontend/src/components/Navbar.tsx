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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
    <>
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-16 py-4 bg-white border-b border-outline-variant transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-8">
          {/* Mobile Hamburger toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-1 text-primary hover:opacity-80 active:scale-95 transition-all"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <img src="/logo.png" alt="Shop Here Logo" className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:rotate-6" />
            <span className="text-xl sm:text-2xl font-premium text-primary tracking-tighter uppercase">
              Shop Here
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/products?category=mens-clothing" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#ee5f73] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Men
            </Link>
            <Link href="/products?category=womens-clothing" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#fb56c1] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Women
            </Link>
            <Link href="/products?category=kids" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#f26a10] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Kids
            </Link>
            <Link href="/products?category=shoes" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#0db89e] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Shoes
            </Link>
            <Link href="/products?category=accessories" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#f59e0b] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Accessories
            </Link>
            <Link href="/products?category=sportswear" className="relative py-2 text-xs font-black uppercase tracking-wider text-primary hover:text-black after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[3px] after:bg-[#3b82f6] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left transition-colors">
              Sportswear
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin/dashboard" className="text-xs font-bold uppercase text-accent hover:opacity-80 transition-opacity ml-2">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
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

          <div className="flex items-center gap-3 sm:gap-5">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:opacity-80 transition-opacity flex items-center gap-1 active:scale-95">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                  <span className="text-xs font-semibold uppercase tracking-wider hidden lg:inline max-w-[80px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-outline-variant p-2 hidden group-hover:block shadow-editorial">
                  <Link href="/profile" className="block px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-dim">
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

      {/* Mobile Menu Side Drawer */}
      {/* Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300 backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Drawer Container */}
      <div 
        className={`fixed top-0 left-0 h-full w-[290px] bg-white z-50 md:hidden shadow-2xl transition-transform duration-300 ease-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-4">
            <span className="text-lg font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">menu_open</span>
              Explore
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 hover:bg-surface-dim rounded-full transition-colors active:scale-95"
              aria-label="Close navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Search form in mobile drawer */}
          <form 
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setIsMobileMenuOpen(false);
            }} 
            className="flex items-center bg-surface-dim px-4 py-3 mb-6 border border-outline-variant rounded-lg"
          >
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 outline-none text-primary placeholder-outline font-semibold"
              placeholder="Search products..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Category Navigation Links */}
          <nav className="flex flex-col gap-4 overflow-y-auto pr-2">
            <Link 
              href="/products?category=mens-clothing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#ee5f73] transition-colors"
            >
              Men
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            <Link 
              href="/products?category=womens-clothing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#fb56c1] transition-colors"
            >
              Women
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            <Link 
              href="/products?category=kids" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#f26a10] transition-colors"
            >
              Kids
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            <Link 
              href="/products?category=shoes" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#0db89e] transition-colors"
            >
              Shoes
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            <Link 
              href="/products?category=accessories" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#f59e0b] transition-colors"
            >
              Accessories
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            <Link 
              href="/products?category=sportswear" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-between items-center text-sm font-semibold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-3 hover:text-[#3b82f6] transition-colors"
            >
              Sportswear
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </Link>
            {user?.role === 'admin' && (
              <Link 
                href="/admin/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-between items-center text-sm font-black uppercase text-accent border-b border-outline-variant/30 pb-3 hover:opacity-85 transition-opacity"
              >
                Admin Dashboard
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
