import Link from 'next/link';
import {
  ArrowRight,
  Candy,
  Cherry,
  Citrus,
  Coffee,
  Nut,
  PackageOpen,
  Sparkles,
} from 'lucide-react';
import { EditorialCard } from '@/components/editorial-card';
import { ProductCard } from '@/components/product-card';
import { StoryBanner } from '@/components/story-banner';
import { products } from '@/lib/store-data';

const categories = [
  { title: 'Для фильтра', note: 'Чистый и яркий вкус', icon: Coffee },
  { title: 'Для эспрессо', note: 'Плотный и шоколадный', icon: Sparkles },
  { title: 'Дрип-пакеты', note: 'Кофе в любом месте', icon: PackageOpen },
];

const tastes = [
  { title: 'Шоколадный', icon: Candy },
  { title: 'Ягодный', icon: Cherry },
  { title: 'Цитрусовый', icon: Citrus },
  { title: 'Ореховый', icon: Nut },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__ambient" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/hero-mobile.png"
            />
            <img
              src="/images/hero-desktop.png"
              alt=""
              width="2172"
              height="724"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="hero__wash" aria-hidden="true" />
        <p className="hero__handwritten" aria-hidden="true">
          Хороший день
          <br />
          начинается здесь
        </p>
        <div className="container hero__content">
          <p className="eyebrow">Свежая обжарка</p>
          <h1 id="hero-title">
            Кофе
            <br />
            на каждый день
          </h1>
          <p className="hero__lead">Чистый вкус. Больше хороших моментов.</p>
          <Link className="button button--dark" href="/catalog">
            В каталог <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <div className="container">
        <section className="category-strip" aria-label="Категории кофе">
          {categories.map(({ title, note, icon: Icon }) => (
            <Link className="category-card" href="/catalog" key={title}>
              <span>
                <strong>{title}</strong>
                <small>{note}</small>
              </span>
              <Icon aria-hidden="true" size={36} strokeWidth={1.35} />
              <ArrowRight
                className="category-card__arrow"
                aria-hidden="true"
                size={17}
              />
            </Link>
          ))}
          <Link className="category-card category-card--image" href="/catalog">
            <span>
              <strong>Аксессуары</strong>
              <small>Для точного заваривания</small>
            </span>
            <ArrowRight
              className="category-card__arrow"
              aria-hidden="true"
              size={17}
            />
          </Link>
        </section>

        <section className="section-block" aria-labelledby="popular-title">
          <div className="section-heading">
            <h2 id="popular-title">Популярный кофе</h2>
            <Link href="/catalog">
              Смотреть весь каталог <ArrowRight size={17} />
            </Link>
          </div>
          <div className="product-row">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <StoryBanner />

        <section
          className="section-block section-block--compact"
          aria-labelledby="taste-title"
        >
          <div className="section-heading">
            <h2 id="taste-title">Подобрать по вкусу</h2>
          </div>
          <div className="taste-grid">
            {tastes.map(({ title, icon: Icon }) => (
              <Link href="/catalog" className="taste-card" key={title}>
                <span className="taste-card__icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.45} />
                </span>
                <strong>{title}</strong>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>

        <section
          className="section-block section-block--compact"
          aria-labelledby="articles-title"
        >
          <div className="section-heading">
            <h2 id="articles-title">Статьи</h2>
            <Link href="/articles">
              Все статьи <ArrowRight size={17} />
            </Link>
          </div>
          <div className="editorial-row">
            <EditorialCard
              title="Фильтр: с чего начать"
              category="Как заваривать"
              image="/images/article-pourover.jpg"
            />
            <EditorialCard
              title="Как растёт кофе"
              category="Знания"
              image="/images/coffee-farm.png"
            />
            <EditorialCard
              title="Кофе и повседневные ритуалы"
              category="Вдохновение"
              image="/images/article-ritual.jpg"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
