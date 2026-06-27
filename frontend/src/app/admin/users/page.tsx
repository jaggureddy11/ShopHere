'use client';

import React, { useEffect, useState } from 'react';
import { IUser } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Error fetching admin users:', err);
        toast.error('Failed to load user directories.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-12 bg-white border border-outline-variant p-6 md:p-8 shadow-editorial text-primary">
      {/* Header */}
      <div className="border-b border-outline-variant pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Registered Customers</h1>
        <p className="text-xs font-semibold text-outline uppercase tracking-wider mt-1">
          Review credentials, profile roles, and active accounts
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading users directory...
        </div>
      ) : users.length === 0 ? (
        <p className="text-center py-12 text-xs text-outline font-semibold uppercase tracking-widest bg-surface-dim">
          No registered user profiles found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-outline border-b border-outline-variant pb-2">
                <th className="py-2">User Name</th>
                <th className="py-2">Email Address</th>
                <th className="py-2">Phone</th>
                <th className="py-2 text-center">Account Role</th>
                <th className="py-2 text-center">Default Shipping Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((u) => {
                const defaultAddr = u.addresses?.find((a) => a.isDefault) || u.addresses?.[0];
                return (
                  <tr key={u.id || (u as any)._id} className="hover:bg-surface-dim transition-colors">
                    {/* Name */}
                    <td className="py-4 font-bold text-primary">
                      {u.name}
                    </td>

                    {/* Email */}
                    <td className="py-4 font-semibold text-outline">
                      {u.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 text-outline font-semibold">
                      {u.phone || 'None'}
                    </td>

                    {/* Role */}
                    <td className="py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Default Country */}
                    <td className="py-4 text-center text-outline font-semibold">
                      {defaultAddr ? defaultAddr.country : 'None'}
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
