import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RFID Tracker',
  description: 'Real-time RFID tag tracking dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <nav className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center gap-6">
            <span className="font-semibold text-gray-900">
              <span className="mr-2 text-indigo-600">◉</span>RFID Tracker
            </span>
            <a
              href="/tags"
              className="text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              Tags
            </a>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
