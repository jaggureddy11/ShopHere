'use client';

import React, { useEffect, useState } from 'react';
import { IAnalytics, IOrder } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analyticsRes = await axiosInstance.get('/admin/dashboard');
        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data.analytics);
          setRecentOrders(analyticsRes.data.recentOrders);
        }

        const reportRes = await axiosInstance.get('/admin/reports');
        if (reportRes.data.success) {
          setSalesReport(reportRes.data.report);
        }
      } catch (err) {
        console.error('Error fetching admin details:', err);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading analytics metrics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Portal Overview</h1>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
          Store performance metrics and sales reports
        </p>
      </div>

      {/* KPI Cards Grid */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-outline-variant p-6 shadow-editorial">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
              Total Revenue
            </span>
            <span className="text-3xl font-black text-primary">${analytics.totalRevenue}</span>
          </div>

          <div className="bg-white border border-outline-variant p-6 shadow-editorial">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
              Orders Placed
            </span>
            <span className="text-3xl font-black text-primary">{analytics.totalOrders}</span>
          </div>

          <div className="bg-white border border-outline-variant p-6 shadow-editorial">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
              Catalog Items
            </span>
            <span className="text-3xl font-black text-primary">{analytics.totalProducts}</span>
          </div>

          <div className="bg-white border border-outline-variant p-6 shadow-editorial">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-2">
              Customer Accounts
            </span>
            <span className="text-3xl font-black text-primary">{analytics.totalUsers}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Recent Orders List Table */}
        <div className="xl:col-span-7 bg-white border border-outline-variant p-6 md:p-8 shadow-editorial">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-[10px] font-bold uppercase text-accent hover:underline"
            >
              Manage all orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs font-semibold text-outline uppercase tracking-wider py-4">
              No orders placed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-2">
                    <th className="py-2">Order ID</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Total</th>
                    <th className="py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-surface-dim transition-colors">
                      <td className="py-3 font-semibold text-accent uppercase">
                        <Link href={`/admin/orders?search=${ord._id}`}>#{ord._id.substr(-6)}</Link>
                      </td>
                      <td className="py-3">
                        {typeof ord.user === 'object' ? ord.user.name : 'Guest'}
                      </td>
                      <td className="py-3 font-bold">${ord.totalPrice}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Sales report column */}
        <div className="xl:col-span-5 bg-white border border-outline-variant p-6 md:p-8 shadow-editorial">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant">
            <h3 className="text-xs font-bold uppercase tracking-widest">Daily Sales (7 days)</h3>
          </div>

          {salesReport.length === 0 ? (
            <p className="text-xs font-semibold text-outline uppercase tracking-wider py-4">
              No completed transactions in the past week.
            </p>
          ) : (
            <div className="space-y-4">
              {salesReport.map((day) => (
                <div key={day._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                    <span>{day._id}</span>
                    <span className="font-bold text-primary">
                      ${day.revenue} ({day.orders} {day.orders === 1 ? 'order' : 'orders'})
                    </span>
                  </div>
                  {/* Custom CSS bar chart */}
                  <div className="w-full bg-surface-dim h-2">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (day.revenue / 2000) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
