import type { Metadata } from 'next';
import { GeistPixelLine } from 'geist/font/pixel';
import { UnifrakturMaguntia } from 'next/font/google';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

const unifraktur = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-unifraktur',
});

export const metadata: Metadata = {
  title: 'UNBRIEFED — 90-Day Board',
  description: 'Interactive Space for 90 Days of Spec Ads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistPixelLine.className} ${unifraktur.variable}`}>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
