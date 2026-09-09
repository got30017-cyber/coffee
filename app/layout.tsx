import type { Metadata } from 'next';
import './globals.css';
import { StoreFooter } from '@/components/store-footer';
import { StoreHeader } from '@/components/store-header';

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
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <StoreHeader />
        {children}
        <StoreFooter />
      </body>
    </html>
  );
}
