'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProduct } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get('/products?limit=4');
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[750px] bg-surface-dim overflow-hidden flex items-center px-6 md:px-16">
        <div className="z-10 max-w-2xl text-primary">
          <span className="text-xs font-bold uppercase tracking-widest text-outline mb-4 block">
            New Season 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
            The Future of Tech,<br />Delivered.
          </h1>
          <p className="text-base md:text-lg text-primary/70 mb-8 max-w-md leading-relaxed">
            Discover curated innovation designed for the modern professional. High-performance devices met with unparalleled aesthetic precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all text-center"
            >
              Shop Now
            </Link>
            <Link
              href="/products?category=headphones-audio"
              className="border border-primary text-primary px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white active:scale-95 transition-all text-center"
            >
              Explore Audio
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-dim to-transparent w-32" />
        </div>
      </section>

      {/* Brand Promises */}
      <section className="py-12 border-b border-outline-variant px-6 md:px-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-outline-variant last:border-0">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">local_shipping</span>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Free Shipping</h3>
            <p className="text-sm text-outline">On all orders over $150. Global delivery enabled.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 border-b md:border-b-0 md:border-r border-outline-variant last:border-0">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">verified_user</span>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">2-Year Warranty</h3>
            <p className="text-sm text-outline">Full protection for every piece of technology you own.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <span className="material-symbols-outlined text-primary text-4xl mb-4">support_agent</span>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">24/7 Support</h3>
            <p className="text-sm text-outline">Our concierge team is here to assist you at any time.</p>
          </div>
        </div>
      </section>

      {/* Featured Collections Bento Grid */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-primary">
              Featured Collections
            </h2>
            <p className="text-sm text-outline mt-1">
              Curated essentials for every aspect of your digital life.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase border-b-2 border-primary pb-1 hover:opacity-75 transition-opacity"
          >
            View All Collections
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Large Left Column Bento */}
          <div className="md:col-span-7 group relative overflow-hidden bg-surface-dim flex flex-col justify-end p-8 min-h-[300px] md:min-h-[500px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="relative z-10 text-white">
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Acoustic Immersion</h3>
              <p className="text-sm opacity-80 mb-4 max-w-sm">Premium wireless headphones and recording studio components.</p>
              <Link
                href="/products?category=headphones-audio"
                className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-85"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Right Bento Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Top Right Bento Box */}
            <div className="flex-1 group relative overflow-hidden bg-surface-dim flex flex-col justify-end p-8 min-h-[220px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-1">Precision Workstations</h3>
                <p className="text-xs opacity-80 mb-3">Keyboards, screens and trackpads engineered for productivity.</p>
                <Link
                  href="/products?category=workstations-inputs"
                  className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-85"
                >
                  Shop Desktop
                </Link>
              </div>
            </div>

            {/* Bottom Right Bento Box */}
            <div className="flex-1 group relative overflow-hidden bg-surface-dim flex flex-col justify-end p-8 min-h-[220px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="relative z-10 text-white">
                <h3 className="text-lg font-bold uppercase tracking-tight mb-1">Architectural Living</h3>
                <p className="text-xs opacity-80 mb-3">Ambient smart home lighting and connected appliances.</p>
                <Link
                  href="/products?category=smart-home-living"
                  className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:opacity-85"
                >
                  Shop Smart Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6 md:px-16 bg-surface-dim">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-primary">
            Featured Products
          </h2>
          <p className="text-sm text-outline mt-1">
            Curated selection of our highest-rated innovative gear.
          </p>
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
              Use <code className="bg-surface-dim px-2 py-1">npm run seed</code> in the backend folder to populate.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
