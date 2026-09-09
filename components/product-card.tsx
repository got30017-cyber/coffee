'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { CoffeeProduct } from '@/lib/store-data';

export function ProductCard({ product }: { product: CoffeeProduct }) {
  const [favorite, setFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);
    window.dispatchEvent(new Event('cart:add'));
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className="product-card">
      <div className={`product-card__visual tone-${product.tone}`}>
        <Link
          href={`/product/${product.slug}`}
          aria-label={`Открыть товар ${product.name}`}
        >
          <Image
            src="/images/coffee-bag.png"
            alt={`Упаковка кофе ${product.name}`}
            width={360}
            height={360}
          />
          <span className="bag-label">
            <small>{product.country}</small>
            <strong>{product.shortName}</strong>
          </span>
        </Link>
        <button
          className={`favorite-button ${favorite ? 'is-active' : ''}`}
          onClick={() => setFavorite(!favorite)}
          aria-label={
            favorite ? 'Убрать из избранного' : 'Добавить в избранное'
          }
        >
          <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-card__body">
        <span className="product-card__method">{product.method}</span>
        <h3>
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.notes.join(' · ')}</p>
        <div className="product-card__meta">
          <span>250 г⌄</span>
        </div>
        <div className="product-card__footer">
          <strong>{product.price.toLocaleString('ru-RU')} ₽</strong>
          <button
            className="button button--dark button--small"
            onClick={addToCart}
            aria-live="polite"
          >
            <ShoppingBag size={16} />
            {added ? 'Добавлено' : 'В корзину'}
          </button>
        </div>
      </div>
    </article>
  );
}
