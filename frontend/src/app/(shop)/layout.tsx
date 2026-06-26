import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-[73px] bg-white border-b border-outline-variant w-full" />}>
        <Navbar />
      </Suspense>
      <main className="flex-grow bg-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}
