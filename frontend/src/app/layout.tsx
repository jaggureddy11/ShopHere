import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import SplashScreen from '@/components/SplashScreen';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopHere — Premium Fashion Store',
  description: 'Discover premium fashion for Men, Women & Kids. Shop the latest trends in clothing, footwear, and accessories at ShopHere.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'),
    icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
    openGraph: {
    title: 'ShopHere — Premium Fashion Store',
    description: 'Discover premium fashion for Men, Women & Kids.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.show-splash body {
                overflow: hidden;
              }
              #splash-overlay {
                display: none;
              }
              html.show-splash #splash-overlay {
                display: flex !important;
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!sessionStorage.getItem('splash-played')) {
                document.documentElement.classList.add('show-splash');
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <SplashScreen />
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
