'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading credentials...
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-dim text-primary">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
