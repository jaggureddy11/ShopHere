'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IOrder } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.info('Please sign in to track your order.');
        router.push('/login?redirect=/orders');
      } else {
        const fetchOrder = async () => {
          try {
            const res = await axiosInstance.get(`/orders/${id}`);
            if (res.data.success) {
              setOrder(res.data.order);
            }
          } catch (err: any) {
            console.error('Error fetching order details:', err);
            toast.error(err.response?.data?.message || 'Failed to load order details.');
          } finally {
            setLoading(false);
          }
        };
        fetchOrder();
      }
    }
  }, [mounted, isAuthenticated, id, router]);

  if (!mounted || authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white text-primary">
        <span className="material-symbols-outlined text-4xl mb-4">local_shipping</span>
        <h2 className="text-xl font-bold uppercase tracking-tighter">Order Not Found</h2>
        <button
          onClick={() => router.push('/orders')}
          className="mt-6 border border-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-none"
        >
          Return to Orders List
        </button>
      </div>
    );
  }

  // Determine active steps for the progress tracker timeline
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  const stepLabels = [
    { title: 'Order Placed', desc: 'We have received your order request' },
    { title: 'Processing', desc: 'Preparing items and inventory verification' },
    { title: 'Shipped', desc: 'Item package has been handed to courier' },
    { title: 'Delivered', desc: 'Order arrived at destination' }
  ];

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-outline-variant gap-4">
        <div>
          <Link
            href="/orders"
            className="text-xs font-bold uppercase text-outline hover:text-primary transition-colors flex items-center gap-1 mb-2"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Orders List
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Order Tracking</h1>
          <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
            Order ID: #{order._id} | Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-4">
          <span className="text-xs font-bold uppercase tracking-wider bg-surface-dim border border-outline-variant px-3 py-1.5">
            Pay method: {order.paymentMethod}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Order Items & Delivery Details */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Progress Tracker Timeline */}
          {order.orderStatus !== 'cancelled' ? (
            <div className="border border-outline-variant p-6 md:p-8 bg-surface-dim shadow-editorial">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Delivery Timeline</h3>
              <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 md:items-center">
                {/* Horizontal line for desktop */}
                <div className="absolute top-[21px] left-8 right-8 h-0.5 bg-outline-variant hidden md:block" />
                
                {stepLabels.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  return (
                    <div key={idx} className="relative z-10 flex md:flex-col items-start md:items-center gap-4 md:gap-2 flex-1">
                      {/* Circle Dot indicator */}
                      <div
                        className={`w-11 h-11 flex items-center justify-center border-2 font-bold text-xs ${
                          isCompleted
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-outline-variant text-outline'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="md:text-center">
                        <div className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-primary' : 'text-outline-variant'}`}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-outline font-semibold mt-0.5 max-w-[150px] leading-tight">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 font-semibold uppercase tracking-wider text-xs">
              This order has been cancelled.
            </div>
          )}

          {/* Ordered Products Table */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2">
              Items Purchased
            </h3>

            <div className="divide-y divide-outline-variant border border-outline-variant p-4">
              {order.items.map((item) => (
                <div key={item.product._id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <Link href={`/products/${item.product._id}`} className="w-16 aspect-[3/4] bg-surface-dim overflow-hidden shrink-0">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </Link>
                    <div>
                      <Link href={`/products/${item.product._id}`} className="text-sm font-semibold hover:opacity-85">
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-outline font-semibold uppercase tracking-wider mt-1">
                        Qty: {item.quantity} | Unit Price: ${item.price}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address and summary info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shipping address info */}
          <div className="border border-outline-variant p-6 shadow-editorial bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2 mb-4">
              Shipping Address
            </h3>
            <div className="text-xs font-semibold uppercase tracking-wider text-outline-variant leading-relaxed">
              <div className="font-bold text-primary">{user?.name}</div>
              <div>{order.shippingAddress.street}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </div>
              <div>{order.shippingAddress.country}</div>
              <div className="mt-4 border-t border-outline-variant pt-4 text-outline font-bold">
                Method: <span className="text-primary">{order.shippingMethod}</span>
              </div>
            </div>
          </div>

          {/* Pricing summary */}
          <div className="border border-outline-variant p-6 shadow-editorial bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-outline-variant pb-2 mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3 text-[10px] font-bold text-outline uppercase tracking-wider">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-primary font-bold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="text-primary truncate max-w-[140px]" title={order.transactionId}>
                  {order.transactionId || 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span
                  className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              <div className="border-t border-outline-variant pt-3 mt-3 flex justify-between text-xs font-bold text-primary">
                <span>Amount Paid</span>
                <span>${order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
