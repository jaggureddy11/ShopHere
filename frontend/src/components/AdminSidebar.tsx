'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLink {
  name: string;
  href: string;
  icon: string;
}

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links: SidebarLink[] = [
    {
      name: 'Overview Dashboard',
      href: '/admin/dashboard',
      icon: 'dashboard'
    },
    {
      name: 'Manage Products',
      href: '/admin/products',
      icon: 'inventory_2'
    },
    {
      name: 'Manage Orders',
      href: '/admin/orders',
      icon: 'local_shipping'
    },
    {
      name: 'Manage Users',
      href: '/admin/users',
      icon: 'group'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-primary text-white flex flex-col min-h-screen border-r border-white/10 shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="text-xl font-black uppercase tracking-tighter block hover:opacity-85 transition-opacity text-white">
          Shop Here
        </Link>
        <span className="text-[10px] font-bold tracking-widest text-outline-variant uppercase mt-1 block">
          Admin Portal
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                isActive
                  ? 'bg-white text-primary'
                  : 'text-outline-variant hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-outline-variant hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">store</span>
          Return to Shop
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
