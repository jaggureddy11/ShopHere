'use client';

import React, { useEffect, useState } from 'react';
import { IOrder } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AdminOrderManagementPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
        setFilteredOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      toast.error('Failed to load global orders registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by search query and status filter
  useEffect(() => {
    let result = [...orders];

    if (search.trim()) {
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(search.toLowerCase()) ||
          (typeof o.user === 'object' && o.user.name.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    setFilteredOrders(result);
  }, [search, statusFilter, orders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await axiosInstance.put(`/admin/orders/${orderId}`, {
        orderStatus: newStatus
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}.`);
        // Refresh local orders list
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  return (
    <div className="space-y-12 bg-white border border-outline-variant p-6 md:p-8 shadow-editorial text-primary">
      {/* Header */}
      <div className="border-b border-outline-variant pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Global Orders</h1>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
          Monitor shipping, adjust statuses, and review invoices
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Search */}
        <div className="flex gap-2 w-full md:max-w-md bg-surface-dim p-2">
          <span className="material-symbols-outlined text-outline text-[20px] self-center ml-1">search</span>
          <input
            type="text"
            placeholder="Search by Order ID or User name..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-2 py-1 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Category Dropdown */}
        <div className="flex gap-3 items-center w-full md:w-auto justify-end">
          <label htmlFor="status" className="text-xs font-bold uppercase tracking-widest">
            Filter Status:
          </label>
          <select
            id="status"
            className="border border-outline-variant p-2 text-xs font-semibold uppercase bg-white outline-none rounded-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading order details...
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center py-12 text-xs text-outline font-semibold uppercase tracking-widest bg-surface-dim">
          No orders match your filter parameters.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-2">
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer Info</th>
                <th className="py-2">Date Placed</th>
                <th className="py-2 text-right">Amount Paid</th>
                <th className="py-2 text-center">Payment Status</th>
                <th className="py-2 text-center">Shipping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredOrders.map((ord) => {
                const customer = typeof ord.user === 'object' ? ord.user : null;
                return (
                  <tr key={ord._id} className="hover:bg-surface-dim transition-colors">
                    {/* ID */}
                    <td className="py-4 font-semibold text-accent uppercase tracking-wider">
                      <Link href={`/orders/${ord._id}`}>#{ord._id}</Link>
                    </td>

                    {/* Customer */}
                    <td className="py-4">
                      {customer ? (
                        <div>
                          <div className="font-bold text-primary">{customer.name}</div>
                          <div className="text-[10px] text-outline">{customer.email}</div>
                        </div>
                      ) : (
                        <div className="text-outline">Deleted User</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 text-outline font-semibold">
                      {new Date(ord.createdAt).toLocaleDateString()}{' '}
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Price */}
                    <td className="py-4 text-right font-bold text-primary">
                      ${ord.totalPrice}
                    </td>

                    {/* Payment status */}
                    <td className="py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${
                          ord.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* Shipping Status Dropdown */}
                    <td className="py-4 text-center">
                      <select
                        className={`border border-outline-variant p-1 text-[10px] font-bold uppercase tracking-wider bg-white outline-none rounded-none cursor-pointer ${
                          ord.orderStatus === 'delivered'
                            ? 'text-green-700'
                            : ord.orderStatus === 'cancelled'
                            ? 'text-red-600'
                            : 'text-primary'
                        }`}
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
