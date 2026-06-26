'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'react-toastify';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getCartSubtotal, isLoading } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading shopping cart...
        </div>
      </div>
    );
  }

  const subtotal = getCartSubtotal();
  const shippingThreshold = 5000;
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 150;
  const estimatedTax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = Number((subtotal + shippingFee + estimatedTax).toFixed(2));

  const handleUpdateQty = async (productId: string, currentQty: number, newQty: number, maxStock: number) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      toast.error(`Only ${maxStock} units available in stock.`, { autoClose: 1500 });
      return;
    }
    await updateQuantity(productId, newQty);
  };

  const handleRemove = async (productId: string, name: string) => {
    await removeItem(productId);
    toast.info(`${name} removed from bag.`, { autoClose: 1500 });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-primary px-4 text-center">
        <span className="material-symbols-outlined text-4xl mb-4 text-outline">shopping_bag</span>
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Your Bag is Empty</h2>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-8 max-w-xs leading-relaxed">
          Looks like you haven&apos;t added any tech innovations to your setup yet.
        </p>
        <Link
          href="/products"
          className="bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-outline-variant pb-6">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="hidden md:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-3 mb-4">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total Price</div>
          </div>

          <div className="divide-y divide-outline-variant">
            {items.map((item) => {
              const activePrice = item.product.discountPrice || item.product.price;
              const itemTotal = activePrice * item.quantity;
              return (
                <div key={item.product._id} className="py-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Info and Image */}
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <Link href={`/products/${item.product._id}`} className="w-20 aspect-[3/4] bg-surface-dim shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div className="flex flex-col justify-start">
                      <Link href={`/products/${item.product._id}`} className="text-sm font-semibold hover:opacity-85 transition-opacity line-clamp-2">
                        {item.product.name}
                      </Link>
                      <span className="text-[10px] font-bold uppercase text-outline mt-1">
                        Stock: {item.product.stock}
                      </span>
                      <button
                        onClick={() => handleRemove(item.product._id, item.product.name)}
                        className="text-[10px] font-bold uppercase text-red-600 mt-4 text-left hover:underline flex items-center gap-1 focus:outline-none"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="col-span-12 md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-outline-variant">
                      <button
                        onClick={() => handleUpdateQty(item.product._id, item.quantity, item.quantity - 1, item.product.stock)}
                        className="px-3 py-1 hover:bg-surface-dim transition-colors text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.product._id, item.quantity, item.quantity + 1, item.product.stock)}
                        className="px-3 py-1 hover:bg-surface-dim transition-colors text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className="col-span-6 md:col-span-2 text-left md:text-right text-sm">
                    <span className="md:hidden text-xs text-outline font-semibold uppercase tracking-wider block mb-1">
                      Price:
                    </span>
                    ₹{activePrice}
                  </div>

                  {/* Total price */}
                  <div className="col-span-6 md:col-span-2 text-right text-sm font-bold">
                    <span className="md:hidden text-xs text-outline font-semibold uppercase tracking-wider block mb-1">
                      Total:
                    </span>
                    ₹{itemTotal}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-outline-variant pt-6 flex justify-between">
            <Link
              href="/products"
              className="text-xs font-bold uppercase border-b-2 border-primary pb-1 hover:opacity-75"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => {
                clearCart();
                toast.info('Bag cleared.');
              }}
              className="text-xs font-bold uppercase text-red-600 hover:underline"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Summary side bar */}
        <div className="lg:col-span-4 border border-outline-variant p-6 md:p-8 shadow-editorial bg-white">
          <h3 className="text-md font-bold uppercase tracking-widest mb-6 border-b border-outline-variant pb-3">
            Order Summary
          </h3>

          <div className="space-y-4 text-xs font-semibold text-outline uppercase tracking-wider">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-primary font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-primary font-bold">
                {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
              </span>
            </div>
            {shippingFee > 0 && (
              <p className="text-[9px] text-accent font-bold normal-case text-right">
                Spend ₹{shippingThreshold - subtotal} more for free shipping
              </p>
            )}
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="text-primary font-bold">₹{estimatedTax}</span>
            </div>

            <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between text-sm font-bold text-primary">
              <span>Total Price</span>
              <span>₹{orderTotal}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-primary text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-95 transition-all mt-8 rounded-none text-center block"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
