'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Slider Content
  const slides = [
    {
      title: "Chic Essentials",
      subtitle: "Elevated Men's Apparel",
      tagline: "Crisp outlines, tailored comfort, and timeless designs for the modern wardrobe.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1600",
      link: "/products?category=mens-clothing"
    },
    {
      title: "Fluid Silhouettes",
      subtitle: "Contemporary Women's Style",
      tagline: "Sophisticated drapes, vibrant colorways, and lightweight silhouettes for any event.",
      image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1600",
      link: "/products?category=womens-clothing"
    },
    {
      title: "Performance Fit",
      subtitle: "Activewear & Athletic Gear",
      tagline: "Moisture-wicking, engineered fibers designed to move with you effortlessly.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600",
      link: "/products?category=sportswear"
    }
  ];

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
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

  // Circular categories
  const circularCategories = [
    { name: "Men", slug: "mens-clothing", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&fit=crop" },
    { name: "Women", slug: "womens-clothing", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { name: "Kids", slug: "kids", img: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150&h=150&fit=crop" },
    { name: "Shoes", slug: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop" },
    { name: "Accessories", slug: "accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" },
    { name: "Sportswear", slug: "sportswear", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&h=150&fit=crop" }
  ];

  return (
    <div className="w-full bg-white select-none overflow-x-hidden">
      
      {/* Circular Categories Bar (Myntra Inspired) */}
      <section className="py-6 border-b border-outline-variant bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex justify-around items-center gap-4 overflow-x-auto no-scrollbar">
          {circularCategories.map((cat, idx) => (
            <Link 
              key={idx} 
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-outline-variant p-0.5 group-hover:border-primary transition-all duration-300 transform group-hover:scale-105 shadow-sm">
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-primary group-hover:underline transition-all">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Hero Slider */}
      <section className="relative w-full h-[500px] md:h-[650px] bg-surface-dim overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full flex items-center px-6 md:px-16 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transform scale-100 transition-transform duration-[5500ms]"
              style={{ 
                backgroundImage: `url('${slide.image}')`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1.00)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full md:w-[60%] lg:w-[45%]" />
            <div className="absolute inset-0 bg-black/5" />

            {/* Slide Content */}
            <div className={`relative z-10 max-w-xl text-primary transition-all duration-700 transform ${
              index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <span className="text-xs font-bold uppercase tracking-widest text-[#fb56c1] mb-2 block font-mono">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none text-primary">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base text-primary/80 mb-8 max-w-sm leading-relaxed font-semibold">
                {slide.tagline}
              </p>
              <div>
                <Link
                  href={slide.link}
                  className="inline-block bg-primary text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md rounded-none"
                >
                  Explore Now
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-primary w-6' : 'bg-outline-variant hover:bg-outline'
              }`}
            />
          ))}
        </div>
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
