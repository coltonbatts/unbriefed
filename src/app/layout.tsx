import type { Metadata } from 'next';
import { GeistPixelSquare } from 'geist/font/pixel';
import './globals.css';

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
    <html lang="en" className={GeistPixelSquare.className}>
      <body>{children}</body>
    </html>
  );
}
