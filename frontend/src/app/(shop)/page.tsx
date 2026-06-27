'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Set mounted flag to prevent SSR/hydration mismatch
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();

  // Transform scroll position into coordinates/opacity/scale for hero parallax
  const leftModelX = useTransform(scrollY, [0, 500], [0, -180]);
  const rightModelX = useTransform(scrollY, [0, 500], [0, 180]);
  const centerScale = useTransform(scrollY, [0, 450], [1, 0.94]);
  const centerOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  const leftX = isMobile ? 0 : leftModelX;
  const rightX = isMobile ? 0 : rightModelX;
  const logoScale = isMobile ? 1 : centerScale;
  const logoOpacity = isMobile ? 1 : centerOpacity;

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
              <Image 
                src="/model-female.png" 
                alt="Stitch Female Model" 
                fill
                className="object-contain select-none pointer-events-none"
                priority
              />
            </div>

            {/* Center Brand Container */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center text-center px-6 py-8 md:py-0">
              {/* Logo */}
              <Image 
                src="/logo.png" 
                alt="Shop Here Logo" 
                width={176} height={176}
                className="h-32 md:h-44 w-auto object-contain mix-blend-multiply" 
                priority
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
              <Image 
                src="/model.png" 
                alt="Stitch Male Model" 
                fill
                className="object-contain select-none pointer-events-none"
                priority
              />
            </div>

            {/* Mobile Layout for Models (stacked under center brand) */}
            <div className="flex md:hidden w-full px-6 gap-4 h-[250px] mt-6 justify-center">
              <div className="w-1/2 h-full flex items-center justify-center">
                <Image 
                  src="/model-female.png" 
                  alt="Stitch Female Model" 
                  fill
                  className="object-contain select-none pointer-events-none"
                />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <Image 
                  src="/model.png" 
                  alt="Stitch Male Model" 
                  fill
                  className="object-contain select-none pointer-events-none"
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
              <motion.div style={{ x: leftX }} className="relative h-full w-full">
                <Image 
                  src="/model-female.png" 
                  alt="Stitch Female Model" 
                  fill
                  className="object-contain select-none pointer-events-none"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Center Brand Container */}
            <motion.div 
              style={{ scale: logoScale, opacity: logoOpacity }}
              className="w-full md:w-[40%] flex flex-col items-center justify-center text-center px-6 py-8 md:py-0"
            >
              
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
                <Image 
                  src="/logo.png" 
                  alt="Shop Here Logo" 
                  width={176} height={176}
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
            </motion.div>

            {/* Right Model Container */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex md:w-[30%] h-full relative bg-white items-center justify-end pr-16 lg:pl-24"
            >
              <motion.div style={{ x: rightX }} className="h-full w-full">
                <Image 
                  src="/model.png" 
                  alt="Stitch Male Model" 
                  fill
                  className="object-contain select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>

            {/* Mobile Layout for Models (stacked under center brand) with animations */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
              className="flex md:hidden w-full px-6 gap-4 h-[250px] mt-6 justify-center"
            >
                <div className="w-1/2 h-full flex items-center justify-center relative">
                  <Image 
                    src="/model-female.png" 
                    alt="Stitch Female Model" 
                    fill
                    className="object-contain select-none pointer-events-none"
                  />
              </div>
                <div className="w-1/2 h-full flex items-center justify-center relative">
                  <Image 
                    src="/model.png" 
                    alt="Stitch Male Model" 
                    fill
                    className="object-contain select-none pointer-events-none"
                  />
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Premium Floating Editorial Cards (Zara/Prada Style Split) */}
      <section className="relative w-full bg-white select-none overflow-hidden border-t border-outline-variant/30">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center py-16 bg-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-outline mb-3">
            SEASONAL EDITORIALS
          </span>
          <h2 className="text-2xl md:text-3xl font-premium tracking-[0.15em] text-primary uppercase">
            The Campaigns
          </h2>
          <div className="w-12 h-[1px] bg-primary/30 mt-4" />
        </div>

        {/* 50/50 Split Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-outline-variant/20 border-b border-outline-variant/20 w-full">
          
          {/* Column 1: Women */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative h-[65vh] md:h-[80vh] overflow-hidden group bg-surface-dim"
          >
            <Link href="/products?category=womens-clothing" className="relative w-full h-full block cursor-pointer">
              <Image 
                src="/images/community/womens_campaign.jpg" 
                alt="Womenswear Campaign" 
                fill
                className="object-cover transition-transform duration-[2000ms] ease-[0.16,1,0.3,1] group-hover:scale-105"
                sizes="50vw"
              />
              {/* Subtle luxury ambient shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity duration-700" />
              
              {/* Minimal Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70 mb-3">
                  Vol. I
                </span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-[0.15em] uppercase leading-tight mb-6">
                  Womenswear
                </h3>
                
                {/* Text Slide-Up Transition */}
                <div className="overflow-hidden h-5 relative w-36">
                  <span className="absolute inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 border-b border-white/40 pb-0.5 transition-all duration-500 ease-[0.16,1,0.3,1] transform translate-y-0 group-hover:-translate-y-full opacity-100 group-hover:opacity-0">
                    Discover Vol. I
                  </span>
                  <span className="absolute inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#fb56c1] border-b border-[#fb56c1] pb-0.5 transition-all duration-500 ease-[0.16,1,0.3,1] transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    Explore Campaign
                    <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Column 2: Men */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative h-[65vh] md:h-[80vh] overflow-hidden group bg-surface-dim"
          >
            <Link href="/products?category=mens-clothing" className="relative w-full h-full block cursor-pointer">
              <Image 
                src="/images/community/mens_campaign.jpg" 
                alt="Menswear Campaign" 
                fill
                className="object-cover transition-transform duration-[2000ms] ease-[0.16,1,0.3,1] group-hover:scale-105"
                sizes="50vw"
              />
              {/* Subtle luxury ambient shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-opacity duration-700" />
              
              {/* Minimal Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 z-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/70 mb-3">
                  Vol. II
                </span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-[0.15em] uppercase leading-tight mb-6">
                  Menswear
                </h3>
                
                {/* Text Slide-Up Transition */}
                <div className="overflow-hidden h-5 relative w-36">
                  <span className="absolute inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90 border-b border-white/40 pb-0.5 transition-all duration-500 ease-[0.16,1,0.3,1] transform translate-y-0 group-hover:-translate-y-full opacity-100 group-hover:opacity-0">
                    Discover Vol. II
                  </span>
                  <span className="absolute inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ee5f73] border-b border-[#ee5f73] pb-0.5 transition-all duration-500 ease-[0.16,1,0.3,1] transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    Explore Campaign
                    <span className="material-symbols-outlined text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Premium Zara/Prada Style Stacked Editorial Lookbook */}
      <section className="relative w-full bg-white select-none overflow-visible">
        
        {/* Section Header */}
        <div className="py-16 bg-white flex flex-col items-center text-center border-t border-outline-variant/30">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-outline mb-3">
            EDITORIAL LOOKBOOK
          </span>
          <h2 className="text-2xl md:text-3xl font-premium tracking-[0.15em] text-primary uppercase">
            STITCH SILHOUETTES
          </h2>
          <div className="w-12 h-[1px] bg-primary/30 mt-4" />
        </div>

        {/* Stacked Cards Container */}
        <div className="relative w-full">
          
          {/* Slide 1 */}
          <div className="relative md:sticky top-0 h-auto md:h-screen w-full bg-white flex items-center overflow-hidden border-b border-outline-variant/10 py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full">
              {/* Text Container (Left) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white z-10 py-8 md:py-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#fb56c1] mb-4 block">LOOK 01 / THE MANIFESTO</span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-wide text-primary uppercase leading-tight mb-6">
                  Aesthetic <br /> Precision
                </h3>
                <p className="text-outline text-xs md:text-sm font-semibold uppercase tracking-wider mb-6 leading-relaxed max-w-sm">
                  Our design philosophy is rooted in architectural lines, performance fabrics, and absolute minimalism.
                </p>
                <p className="text-primary/70 text-xs leading-relaxed max-w-xs font-medium">
                  Stitch exists at the intersection of structure and flow. We believe that true luxury lies in the details that you do not see, the comfort that you feel, and the sustainability of apparel crafted to endure.
                </p>
              </div>
              
              {/* Image Container (Right) */}
              <div className="col-span-1 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-surface-dim">
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image src="/images/editorial/story1.png" alt="Look 01" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative md:sticky top-0 h-auto md:h-screen w-full bg-white flex items-center overflow-hidden border-b border-outline-variant/10 shadow-2xl py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full">
              {/* Text Container (Left) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white z-10 py-8 md:py-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0db89e] mb-4 block">LOOK 02 / GEOMETRY</span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-wide text-primary uppercase leading-tight mb-6">
                  Architectural <br /> Denim
                </h3>
                <p className="text-outline text-xs md:text-sm font-semibold uppercase tracking-wider mb-6 leading-relaxed max-w-sm">
                  Dramatic angles and heavy twill fabric create structured, modern streetwear forms.
                </p>
                <p className="text-primary/70 text-xs leading-relaxed max-w-xs font-medium">
                  Captured against clean building geometries, this denim-on-denim look celebrates raw structural symmetry and vertical scale designed for the modern metropolis.
                </p>
              </div>
              
              {/* Image Container (Right) */}
              <div className="col-span-1 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-surface-dim">
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image src="/images/editorial/story4.jpg" alt="Look 02" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="relative md:sticky top-0 h-auto md:h-screen w-full bg-white flex items-center overflow-hidden border-b border-outline-variant/10 shadow-2xl py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full">
              {/* Text Container (Left) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white z-10 py-8 md:py-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ee5f73] mb-4 block">LOOK 03 / MOVEMENT</span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-wide text-primary uppercase leading-tight mb-6">
                  Dynamic <br /> Silhouette
                </h3>
                <p className="text-outline text-xs md:text-sm font-semibold uppercase tracking-wider mb-6 leading-relaxed max-w-sm">
                  Tailored shapes engineered to move without constraints. High-fashion aesthetics meet extreme comfort.
                </p>
                <p className="text-primary/70 text-xs leading-relaxed max-w-xs font-medium">
                  Constructed from high-performance blends, our garments retain their flawless structure while flexing with the natural posture and dynamic motion of the body.
                </p>
              </div>
              
              {/* Image Container (Right) */}
              <div className="col-span-1 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-surface-dim">
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image src="/images/editorial/story2.jpg" alt="Look 03" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>

          {/* Slide 4 */}
          <div className="relative md:sticky top-0 h-auto md:h-screen w-full bg-white flex items-center overflow-hidden border-b border-outline-variant/10 shadow-2xl py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full">
              {/* Text Container (Left) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white z-10 py-8 md:py-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f59e0b] mb-4 block">LOOK 04 / DETAIL</span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-wide text-primary uppercase leading-tight mb-6">
                  Restrained <br /> Detail
                </h3>
                <p className="text-outline text-xs md:text-sm font-semibold uppercase tracking-wider mb-6 leading-relaxed max-w-sm">
                  Every seam, button, and stitch is calculated. Absolute restraint yields absolute perfection.
                </p>
                <p className="text-primary/70 text-xs leading-relaxed max-w-xs font-medium">
                  We eliminate noise. Stitch lookbooks represent a return to clarity, allowing the quality of fabric and precision of draping to define the modern silhouette.
                </p>
              </div>
              
              {/* Image Container (Right) */}
              <div className="col-span-1 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-surface-dim">
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image src="/images/editorial/story3.png" alt="Look 04" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>

          {/* Slide 5 */}
          <div className="relative md:sticky top-0 h-auto md:h-screen w-full bg-white flex items-center overflow-hidden border-b border-outline-variant/10 shadow-2xl py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-12 w-full h-full">
              {/* Text Container (Left) */}
              <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white z-10 py-8 md:py-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3b82f6] mb-4 block">LOOK 05 / CARRY</span>
                <h3 className="text-3xl md:text-5xl font-premium tracking-wide text-primary uppercase leading-tight mb-6">
                  Tactile <br /> Utility
                </h3>
                <p className="text-outline text-xs md:text-sm font-semibold uppercase tracking-wider mb-6 leading-relaxed max-w-sm">
                  Premium leather accessories that complement modern, architectural silhouettes.
                </p>
                <p className="text-primary/70 text-xs leading-relaxed max-w-xs font-medium">
                  Constructed from high-grade textured leather, our commuter accessories are designed for tactile luxury and effortless daily utility in cityscapes.
                </p>
              </div>
              
              {/* Image Container (Right) */}
              <div className="col-span-1 md:col-span-7 relative h-[50vh] md:h-full overflow-hidden bg-surface-dim">
                <motion.div
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image src="/images/editorial/story5.jpg" alt="Look 05" fill className="object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-black/5" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Listing */}
      <section className="py-16 px-6 md:px-16 bg-surface-dim border-t border-outline-variant">
        <div className="max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4"
          >
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
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
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
              <Image src="/images/community/c1.png" fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 1" />
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
              <Image src="/images/community/c2.png" fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 2" />
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
              <Image src="/images/community/c3.png" fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 3" />
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
              <Image src="/images/community/c4.png" fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 4" />
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
              <Image src="/images/community/c5.png" fill className="object-cover transition-transform duration-500 group-hover:scale-105" alt="Community 5" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-xs font-semibold tracking-wider uppercase">Casual Fit</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Values Banner */}
      <section className="py-12 bg-white border-t border-outline-variant px-6 md:px-16 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-[#ee5f73] text-4xl shrink-0">local_shipping</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Express Delivery</h3>
              <p className="text-xs text-outline font-medium">Free shipping on all catalog items over ₹5,000.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-[#fb56c1] text-4xl shrink-0">assignment_return</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Easy 14 Day Returns</h3>
              <p className="text-xs text-outline font-medium">Hassle-free size replacement and direct returns.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 p-4 border border-outline-variant shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-[#0db89e] text-4xl shrink-0">verified</span>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1">100% Genuine Brands</h3>
              <p className="text-xs text-outline font-medium">Original products sourced directly from premium designers.</p>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
