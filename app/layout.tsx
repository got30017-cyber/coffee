import type { Metadata } from 'next';
import { Caveat } from 'next/font/google';
import './globals.css';
import { StoreFooter } from '@/components/store-footer';
import { StoreHeader } from '@/components/store-header';

const caveat = Caveat({
  subsets: ['cyrillic', 'latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: {
    default: 'Светлый Кофе',
    template: '%s — Светлый Кофе',
  },
  description:
    'Свежая обжарка кофе для дома. Зёрна со всего мира и доставка по России.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={caveat.variable} data-scroll-behavior="smooth">
      <body>
        <StoreHeader />
        {children}
        <StoreFooter />
      </body>
    </html>
  );
}
