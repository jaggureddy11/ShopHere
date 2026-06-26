'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8 px-4 md:px-16 border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Shop Here Logo" className="h-10 w-auto object-contain invert mix-blend-screen" />
            <h2 className="text-2xl font-premium tracking-tighter uppercase">Shop Here</h2>
          </div>
          <p className="text-sm text-outline-variant max-w-xs leading-relaxed mb-6">
            Discover curated innovations designed for the modern professional. High-performance devices met with unparalleled aesthetic precision.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-75 transition-opacity"><span className="material-symbols-outlined text-[20px]">public</span></a>
            <a href="#" className="hover:opacity-75 transition-opacity"><span className="material-symbols-outlined text-[20px]">forum</span></a>
            <a href="#" className="hover:opacity-75 transition-opacity"><span className="material-symbols-outlined text-[20px]">alternate_email</span></a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline-variant mb-6">Shop</h3>
          <ul className="space-y-3 text-sm font-semibold">
            <li><Link href="/products" className="hover:text-outline-variant transition-colors">All Products</Link></li>
            <li><Link href="/products?category=phones-mobile" className="hover:text-outline-variant transition-colors">Phones & Mobile</Link></li>
            <li><Link href="/products?category=headphones-audio" className="hover:text-outline-variant transition-colors">Headphones & Audio</Link></li>
            <li><Link href="/products?category=workstations-inputs" className="hover:text-outline-variant transition-colors">Workstations</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline-variant mb-6">Support</h3>
          <ul className="space-y-3 text-sm font-semibold">
            <li><Link href="/orders" className="hover:text-outline-variant transition-colors">Track Order</Link></li>
            <li><a href="#" className="hover:text-outline-variant transition-colors">Return Policy</a></li>
            <li><a href="#" className="hover:text-outline-variant transition-colors">Concierge Care</a></li>
            <li><a href="#" className="hover:text-outline-variant transition-colors">Warranty Info</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-outline-variant mb-6">Newsletter</h3>
          <p className="text-sm text-outline-variant mb-4 leading-relaxed">
            Subscribe to receive advanced release notices and curated tech editorials.
          </p>
          {submitted ? (
            <p className="text-xs font-bold uppercase tracking-widest text-accent bg-white/10 p-3">
              Thank you for subscribing.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                className="w-full bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white rounded-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white text-primary hover:opacity-95 transition-opacity px-4 py-3 font-semibold text-xs uppercase tracking-widest rounded-none"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-outline-variant">
        <p>© {new Date().getFullYear()} Shop Here Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
