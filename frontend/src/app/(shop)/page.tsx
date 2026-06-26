'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag to prevent SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Featured Products (8 products limit)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get('/products?limit=8');
        if (res.data.success && res.data.products.length > 0) {
          setFeaturedProducts(res.data.products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);


  return (
    <div className="w-full bg-white select-none overflow-x-hidden">


      {/* Premium Minimalist Logo Canvas Hero Section */}
      <section className="relative w-full h-auto md:h-[600px] bg-white border-b border-outline-variant flex flex-col items-center overflow-hidden py-12 md:py-0">
        {!mounted ? (
          // Static Server-Render / Initial Client-Render Placeholder
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-between">
            {/* Left Model Container */}
            <div className="hidden md:flex md:w-[30%] h-full relative bg-white items-center justify-start pl-16 lg:pl-24">
              <img 
                src="/model-female.png?v=2" 
                alt="Stitch Female Model" 
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </div>

            {/* Center Brand Container */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center text-center px-6 py-8 md:py-0">
              {/* Logo */}
              <img 
                src="/logo.png" 
                alt="Shop Here Logo" 
                className="h-32 md:h-44 w-auto object-contain mix-blend-multiply" 
              />
              
              {/* Brand Title */}
              <h1 className="font-premium text-3xl md:text-5xl font-black uppercase text-primary mt-6 tracking-[0.25em]">
                Shop Here
              </h1>

              {/* Accent divider line */}
              <div className="w-20 h-[1px] bg-primary/20 my-6" />

              {/* CTA Button */}
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-primary text-white border border-primary px-10 py-4 text-xs font-black uppercase tracking-[0.25em]"
              >
                Shop Now
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </Link>
            </div>
            
            {/* Right Model Container */}
            <div className="hidden md:flex md:w-[30%] h-full relative bg-white items-center justify-end pr-16 lg:pr-24">
              <img 
                src="/model.png?v=2" 
                alt="Stitch Male Model" 
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </div>

            {/* Mobile Layout for Models (stacked under center brand) */}
            <div className="flex md:hidden w-full px-6 gap-4 h-[250px] mt-6 justify-center">
              <div className="w-1/2 h-full flex items-center justify-center">
                <img 
                  src="/model-female.png?v=2" 
                  alt="Stitch Female Model" 
                  className="h-full w-auto object-contain select-none pointer-events-none"
                />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <img 
                  src="/model.png?v=2" 
                  alt="Stitch Male Model" 
                  className="h-full w-auto object-contain select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        ) : (
          // Framer Motion Animated Version (hydrated client)
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-between">
            {/* Left Model Container */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex md:w-[30%] h-full relative bg-white items-center justify-start pl-16 lg:pl-24"
            >
              <img 
                src="/model-female.png?v=2" 
                alt="Stitch Female Model" 
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </motion.div>

            {/* Center Brand Container */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center text-center px-6 py-8 md:py-0">
              
              {/* Animated Logo Image */}
              <motion.div
                initial={{ scale: 0.85, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 70, 
                  damping: 14, 
                  delay: 0.15 
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300, damping: 10 } 
                }}
                className="cursor-pointer select-none"
              >
                <img 
                  src="/logo.png" 
                  alt="Shop Here Logo" 
                  className="h-32 md:h-44 w-auto object-contain mix-blend-multiply" 
                />
              </motion.div>
              
              {/* Animated Brand Title with Letter-Spacing Expansion */}
              <motion.h1
                initial={{ opacity: 0, y: 15, letterSpacing: "0.1em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-premium text-3xl md:text-5xl font-black uppercase text-primary mt-6 select-none"
              >
                Shop Here
              </motion.h1>

              {/* Animated Thin Accent Line */}
              <div className="w-20 h-[1px] bg-primary/20 my-6 relative overflow-hidden">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "0%" }}
                  transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 bg-primary/50"
                />
              </div>

              {/* Animated CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 bg-primary text-white border border-primary px-10 py-4 text-xs font-black uppercase tracking-[0.25em] hover:bg-white hover:text-primary transition-all duration-500 shadow-md group/btn"
                >
                  Shop Now
                  <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">
                    arrow_right_alt
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Right Model Container */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex md:w-[30%] h-full relative bg-white items-center justify-end pr-16 lg:pr-24"
            >
              <img 
                src="/model.png?v=2" 
                alt="Stitch Male Model" 
                className="h-full w-auto object-contain select-none pointer-events-none"
              />
            </motion.div>

            {/* Mobile Layout for Models (stacked under center brand) with animations */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
              className="flex md:hidden w-full px-6 gap-4 h-[250px] mt-6 justify-center"
            >
              <div className="w-1/2 h-full flex items-center justify-center">
                <img 
                  src="/model-female.png?v=2" 
                  alt="Stitch Female Model" 
                  className="h-full w-auto object-contain select-none pointer-events-none"
                />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <img 
                  src="/model.png?v=2" 
                  alt="Stitch Male Model" 
                  className="h-full w-auto object-contain select-none pointer-events-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Promotional Offer Banners Grid */}
      <section className="py-16 px-6 md:px-16 bg-white max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-primary">
            Grand Offers to Explore
          </h2>
          <div className="w-16 h-1 bg-[#fb56c1] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1 */}
          <Link 
            href="/products?category=shoes"
            className="group relative h-[250px] overflow-hidden flex flex-col justify-end p-6 border border-outline-variant shadow-sm bg-surface-dim"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ee5f73] block mb-1">Sneaker Head</span>
              <h3 className="text-lg font-black uppercase tracking-tight mb-1">Flat 20% Off</h3>
              <p className="text-xs text-white/80 font-medium uppercase tracking-wider mb-2">Selected Athletic Footwear</p>
              <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Shop Shoes</span>
            </div>
          </Link>

          {/* Banner 2 */}
          <Link 
            href="/products?category=womens-clothing"
            className="group relative h-[250px] overflow-hidden flex flex-col justify-end p-6 border border-outline-variant shadow-sm bg-surface-dim"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595777707802-51b4c3a5aeef?w=600')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#fb56c1] block mb-1">Dresses & Tops</span>
              <h3 className="text-lg font-black uppercase tracking-tight mb-1">Under $49</h3>
              <p className="text-xs text-white/80 font-medium uppercase tracking-wider mb-2">Breezy & elegant coordinates</p>
              <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Shop Women</span>
            </div>
          </Link>

          {/* Banner 3 */}
          <Link 
            href="/products?category=accessories"
            className="group relative h-[250px] overflow-hidden flex flex-col justify-end p-6 border border-outline-variant shadow-sm bg-surface-dim"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] block mb-1">Watches & Belts</span>
              <h3 className="text-lg font-black uppercase tracking-tight mb-1">30% - 50% Off</h3>
              <p className="text-xs text-white/80 font-medium uppercase tracking-wider mb-2">Elevate your overall outfit</p>
              <span className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4">Shop Accessories</span>
            </div>
          </Link>

        </div>
      </section>

      {/* Featured Products Listing */}
      <section className="py-16 px-6 md:px-16 bg-surface-dim border-t border-outline-variant">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-primary">
                Featured Trends
              </h2>
              <p className="text-sm text-outline mt-1 font-semibold uppercase tracking-wider">
                Curated selection of our highest-rated apparel and accessories.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-black uppercase border-b-2 border-primary pb-1 hover:opacity-75 transition-opacity tracking-widest"
            >
              See All Products
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white p-4 h-[350px] flex flex-col justify-between">
                  <div className="bg-surface-high w-full h-[220px]" />
                  <div className="space-y-2 mt-4">
                    <div className="bg-surface-high h-3 w-1/3" />
                    <div className="bg-surface-high h-4 w-3/4" />
                    <div className="bg-surface-high h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center border border-outline-variant">
              <span className="material-symbols-outlined text-outline text-4xl mb-4">inventory</span>
              <p className="text-sm text-outline font-semibold uppercase tracking-wider">
                No products found. Please seed the database first!
              </p>
              <div className="mt-4 text-xs text-outline">
                Use <code className="bg-surface-dim px-2 py-1">npm run seed</code> in the root folder to populate.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Community / Modern Silhouettes Section */}
      <section className="w-full bg-[#f8f9fa] py-24 overflow-hidden flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center px-6 max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-outline-variant mb-6"
          >
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span className="text-xs font-semibold">Stay connected</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-[3.5rem] font-medium text-[#1a1a1a] tracking-tight leading-[1.1] mb-6"
          >
            See our community <br /> in modern silhouettes
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-outline text-sm md:text-base mb-8 max-w-lg leading-relaxed"
          >
            Connect with us on social media for a daily dose of fresh style, featuring exclusive looks from our community.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/products" className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg">
              See collections
            </Link>
            <Link href="#" className="bg-white text-[#1a1a1a] px-8 py-4 rounded-full text-sm font-semibold border border-outline-variant hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 shadow-sm">
              Contact us
            </Link>
          </motion.div>
        </div>

        {/* 3D Gallery */}
        <div className="relative w-full max-w-[1600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto flex justify-center items-center overflow-visible" style={{ perspective: '1500px' }}>
          <div className="relative w-full h-full flex justify-center items-center">
            
            {/* Card 0 (Far Left) */}
            <div 
              className="absolute w-[140px] h-[210px] sm:w-[200px] sm:h-[300px] md:w-[260px] md:h-[390px] lg:w-[300px] lg:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 ease-out origin-center cursor-pointer group hover:!translate-x-[-210%] hover:!scale-110 hover:!rotate-0 hover:!z-50 hover:opacity-100 opacity-60"
              style={{
                left: '50%',
                transform: 'translateX(-210%) rotateY(38deg) scale(0.82)',
                zIndex: 10,
                boxShadow: '-15px 15px 25px rgba(0,0,0,0.2)',
              }}
            >
              <img src="/images/community/c1.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Urban Style</p>
              </div>
            </div>

            {/* Card 1 (Left) */}
            <div 
              className="absolute w-[140px] h-[210px] sm:w-[200px] sm:h-[300px] md:w-[260px] md:h-[390px] lg:w-[300px] lg:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ease-out origin-center cursor-pointer group hover:!translate-x-[-135%] hover:!scale-110 hover:!rotate-0 hover:!z-50 hover:opacity-100 opacity-85"
              style={{
                left: '50%',
                transform: 'translateX(-135%) rotateY(20deg) scale(0.95)',
                zIndex: 20,
                boxShadow: '-10px 10px 20px rgba(0,0,0,0.25)',
              }}
            >
              <img src="/images/community/c2.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Streetwear</p>
              </div>
            </div>

            {/* Card 2 (Center) */}
            <div 
              className="absolute w-[140px] h-[210px] sm:w-[200px] sm:h-[300px] md:w-[260px] md:h-[390px] lg:w-[300px] lg:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ease-out origin-center cursor-pointer group hover:!translate-x-[-50%] hover:!scale-120 hover:!rotate-0 hover:!z-50 z-30"
              style={{
                left: '50%',
                transform: 'translateX(-50%) rotateY(0deg) scale(1.1)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              }}
            >
              <img src="/images/community/c3.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 3" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">Community Core</p>
              </div>
            </div>

            {/* Card 3 (Right) */}
            <div 
              className="absolute w-[140px] h-[210px] sm:w-[200px] sm:h-[300px] md:w-[260px] md:h-[390px] lg:w-[300px] lg:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 ease-out origin-center cursor-pointer group hover:!translate-x-[35%] hover:!scale-110 hover:!rotate-0 hover:!z-50 hover:opacity-100 opacity-85"
              style={{
                left: '50%',
                transform: 'translateX(35%) rotateY(-20deg) scale(0.95)',
                zIndex: 20,
                boxShadow: '10px 10px 20px rgba(0,0,0,0.25)',
              }}
            >
              <img src="/images/community/c4.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Minimalist</p>
              </div>
            </div>

            {/* Card 4 (Far Right) */}
            <div 
              className="absolute w-[140px] h-[210px] sm:w-[200px] sm:h-[300px] md:w-[260px] md:h-[390px] lg:w-[300px] lg:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 ease-out origin-center cursor-pointer group hover:!translate-x-[110%] hover:!scale-110 hover:!rotate-0 hover:!z-50 hover:opacity-100 opacity-60"
              style={{
                left: '50%',
                transform: 'translateX(110%) rotateY(-38deg) scale(0.82)',
                zIndex: 10,
                boxShadow: '15px 15px 25px rgba(0,0,0,0.2)',
              }}
            >
              <img src="/images/community/c5.png" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 5" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Casual Fit</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Values Banner */}
      <section className="py-12 bg-white border-t border-outline-variant px-6 md:px-16 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <span className="material-symbols-outlined text-[#ee5f73] text-4xl shrink-0">local_shipping</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Express Delivery</h3>
              <p className="text-xs text-outline font-medium">Free shipping on all catalog items over $150.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <span className="material-symbols-outlined text-[#fb56c1] text-4xl shrink-0">assignment_return</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Easy 14 Day Returns</h3>
              <p className="text-xs text-outline font-medium">Hassle-free size replacement and direct returns.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1">
            <span className="material-symbols-outlined text-[#0db89e] text-4xl shrink-0">verified</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">100% Genuine Brands</h3>
              <p className="text-xs text-outline font-medium">Original products sourced directly from premium designers.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
