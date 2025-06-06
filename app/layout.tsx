import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation'; // Make sure this import is correct
import ReactQueryProvider from '@/providers/ReactQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spenxo',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isExpanded = true; // Set your logic or state for sidebar expansion

  return (
    <html lang="en" data-theme="mytheme">
      <body className={inter.className}>
        <ReactQueryProvider>
          {/* <Navigation isExpanded={isExpanded} toggleSidebar={() => {}} /> */}
          <div className="flex h-screen mt-10">
            {/* <Sidebar isExpanded={isExpanded} /> */}
            <main className="flex-1">{children}</main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
