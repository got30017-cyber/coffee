import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CatalogClient } from '@/components/catalog-client';
import { StoryBanner } from '@/components/story-banner';
import { products } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Каталог кофе',
  description: 'Кофе свежей обжарки для фильтра, эспрессо и турки.',
};

export default function CatalogPage() {
  return (
    <main>
      <section className="catalog-hero">
        <div className="catalog-hero__media" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/catalog-hero-mobile.png"
            />
            <img
              src="/images/catalog-hero-desktop.png"
              alt=""
              width="2244"
              height="701"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="catalog-hero__wash" aria-hidden="true" />
        <p className="catalog-hero__handwritten" aria-hidden="true">
          Свежая
          <br />
          партия недели
        </p>
        <div className="container">
          <Breadcrumbs items={[{ label: 'Каталог' }, { label: 'Кофе' }]} />
          <p className="eyebrow">Свежая обжарка</p>
          <h1>Кофе</h1>
          <p>
            Отборные зёрна со всего мира. Чистый вкус. Больше хороших моментов.
          </p>
        </div>
      </section>
      <div className="container catalog-page">
        <CatalogClient products={products} />
        <StoryBanner />
      </div>
    </main>
  );
}
