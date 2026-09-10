import type { Metadata } from 'next';
import { ArticlesClient } from '@/components/articles-client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { articles } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Статьи',
  description: 'Полезные материалы о кофе, вкусах и домашних ритуалах.',
};

export default function ArticlesPage() {
  return (
    <main className="container articles-page">
      <Breadcrumbs items={[{ label: 'Статьи' }]} />
      <ArticlesClient articles={articles} />
    </main>
  );
}
