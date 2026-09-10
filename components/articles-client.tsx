'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EditorialCard } from '@/components/editorial-card';

type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
};

const topics = ['Все', 'Заваривание', 'Зерно', 'Советы'];

export function ArticlesClient({ articles }: { articles: Article[] }) {
  const [selectedTopic, setSelectedTopic] = useState('Все');
  const filteredArticles = useMemo(
    () =>
      selectedTopic === 'Все'
        ? articles.slice(1)
        : articles
            .slice(1)
            .filter((article) => article.category === selectedTopic),
    [articles, selectedTopic],
  );

  return (
    <>
      <header className="articles-header">
        <h1>Статьи</h1>
        <p>
          Полезные материалы о кофе, вкусах и маленьких ритуалах, которые делают
          каждый день лучше.
        </p>
        <div className="article-filters" aria-label="Темы статей">
          {topics.map((topic) => {
            const selected = selectedTopic === topic;
            return (
              <button
                type="button"
                className={selected ? 'is-active' : ''}
                aria-pressed={selected}
                aria-controls="articles-grid"
                key={topic}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </header>

      <section className="featured-article" data-reveal>
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
            Хорошие истории
            <br />
            начинаются с кофе
          </p>
        </div>
      </section>

      <section
        className="articles-grid"
        id="articles-grid"
        aria-label={`Статьи: ${selectedTopic.toLowerCase()}`}
        aria-live="polite"
      >
        {filteredArticles.map((article) => (
          <EditorialCard
            key={article.slug}
            title={article.title}
            category={article.category}
            excerpt={article.excerpt}
            image={article.image}
          />
        ))}
      </section>
    </>
  );
}
