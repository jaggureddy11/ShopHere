'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IOrder } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        toast.info('Please sign in to view your orders.');
        router.push('/login?redirect=/orders');
      } else {
        const fetchOrders = async () => {
          try {
            const res = await axiosInstance.get('/orders');
            if (res.data.success) {
              setOrders(res.data.orders);
            }
          } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Failed to load order history.');
          } finally {
            setLoading(false);
          }
        };
        fetchOrders();
      }
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading order history...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-16 px-6 md:px-16 text-primary bg-white">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 border-b border-outline-variant pb-6">
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-surface-dim p-12 text-center border border-outline-variant shadow-editorial max-w-xl mx-auto">
          <span className="material-symbols-outlined text-outline text-4xl mb-4">local_shipping</span>
          <p className="text-sm text-outline font-semibold uppercase tracking-wider mb-6">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/products"
            className="bg-primary text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="hidden md:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-3">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Total Price</div>
            <div className="col-span-2 text-center">Payment Status</div>
            <div className="col-span-2 text-center">Tracking Status</div>
            <div className="col-span-1 text-right">Details</div>
          </div>

          <div className="divide-y divide-outline-variant border border-outline-variant shadow-editorial bg-white p-4 md:p-0">
            {orders.map((order) => (
              <div key={order._id} className="py-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                {/* ID */}
                <div className="col-span-12 md:col-span-3 text-xs font-bold uppercase tracking-wider text-accent truncate">
                  <span className="md:hidden text-outline-variant font-semibold">Order ID: </span>
                  <Link href={`/orders/${order._id}`} className="hover:underline">
                    #{order._id}
                  </Link>
                </div>

                {/* Date */}
                <div className="col-span-12 md:col-span-2 text-xs font-semibold text-outline uppercase tracking-wider">
                  <span className="md:hidden text-outline-variant">Date: </span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>

                {/* Total Price */}
                <div className="col-span-12 md:col-span-2 text-xs font-bold text-primary">
                  <span className="md:hidden text-outline-variant font-semibold">Total: </span>
                  ₹{order.totalPrice}
                </div>

                {/* Payment Status */}
                <div className="col-span-12 md:col-span-2 text-center flex items-center md:justify-center">
                  <span className="md:hidden text-outline-variant font-semibold text-xs uppercase tracking-wider mr-2">Payment: </span>
                  <span
                    className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Order Status */}
                <div className="col-span-12 md:col-span-2 text-center flex items-center md:justify-center">
                  <span className="md:hidden text-outline-variant font-semibold text-xs uppercase tracking-wider mr-2">Status: </span>
                  <span
                    className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Action details */}
                <div className="col-span-12 md:col-span-1 text-right mt-2 md:mt-0">
                  <Link
                    href={`/orders/${order._id}`}
                    className="text-xs font-bold uppercase text-accent hover:underline flex items-center justify-end gap-1"
                  >
                    View
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
