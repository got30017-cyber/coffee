import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { EditorialCard } from '@/components/editorial-card';
import { articles } from '@/lib/store-data';

export const metadata: Metadata = {
  title: 'Статьи',
  description: 'Полезные материалы о кофе, вкусах и домашних ритуалах.',
};

export default function ArticlesPage() {
  return (
    <main className="container articles-page">
      <Breadcrumbs items={[{ label: 'Статьи' }]} />
      <header className="articles-header">
        <h1>Статьи</h1>
        <p>
          Полезные материалы о кофе, вкусах и маленьких ритуалах, которые делают
          каждый день лучше.
        </p>
        <div className="article-filters" aria-label="Темы статей">
          <button className="is-active">Все</button>
          <button>Заваривание</button>
          <button>Зерно</button>
          <button>Советы</button>
        </div>
      </header>

      <section className="featured-article">
        <div className="featured-article__content">
          <span>Советы</span>
          <h2>
            Как выбрать кофе
            <br />
            под свой вкус
          </h2>
          <p>
            Разбираем, на что обратить внимание: страну происхождения, обжарку,
            способ обработки и вкусовой профиль.
          </p>
          <Link href="#articles-grid">
            Читать <ArrowRight size={18} />
          </Link>
        </div>
        <div className="featured-article__image">
          <Image
            className="featured-article__ambient"
            src="/images/hero-coffee.png"
            alt="Упаковка кофе и чашка на светлой кухне"
            fill
            preload
            sizes="(max-width: 767px) 100vw, 58vw"
          />
          <div className="featured-article__product" aria-hidden="true">
            <Image
              src="/images/coffee-bag.png"
              alt=""
              width={1254}
              height={1254}
              loading="eager"
            />
          </div>
          <p className="featured-article__handwritten" aria-hidden="true">
            Хорошие
            <br />
            истории начинаются
            <br />
            с кофе
          </p>
        </div>
      </section>

      <section className="articles-grid" id="articles-grid">
        {articles.slice(1).map((article) => (
          <EditorialCard
            key={article.slug}
            title={article.title}
            category={article.category}
            excerpt={article.excerpt}
            image={article.image}
          />
        ))}
      </section>
    </main>
  );
}
