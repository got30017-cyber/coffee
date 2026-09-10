'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Coffee,
  Check,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import type { CoffeeProduct } from '@/lib/store-data';
import { useFavorite } from '@/lib/use-favorite';

const tabs = ['Описание', 'Характеристики', 'Отзывы (12)'];

export function ProductDetail({ product }: { product: CoffeeProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [weight, setWeight] = useState(250);
  const [grind, setGrind] = useState('В зёрнах');
  const [quantity, setQuantity] = useState(1);
  const { favorite, toggleFavorite } = useFavorite(product.slug);
  const [activeTab, setActiveTab] = useState(0);
  const [added, setAdded] = useState(false);

  const gallery = [
    { src: '/images/coffee-bag.png', alt: `Упаковка кофе ${product.name}` },
    { src: '/images/hero-coffee.png', alt: 'Кофе в утреннем интерьере' },
    { src: '/images/coffee-farm.png', alt: 'Кофейная плантация' },
  ];
  const price =
    weight === 1000 ? Math.round(product.price * 3.45) : product.price;

  const addToCart = () => {
    setAdded(true);
    window.dispatchEvent(new CustomEvent('cart:add', { detail: { quantity } }));
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div className="product-detail">
        <section className="product-gallery" aria-label="Галерея товара">
          <div className="product-thumbs">
            {gallery.map((image, index) => (
              <button
                key={image.src}
                className={activeImage === index ? 'is-active' : ''}
                onClick={() => setActiveImage(index)}
                aria-label={`Показать изображение ${index + 1}`}
              >
                <Image src={image.src} alt="" fill sizes="90px" />
              </button>
            ))}
          </div>
          <div
            className={`product-main-image tone-${product.tone} image-${activeImage}`}
          >
            <Image
              src={gallery[activeImage].src}
              alt={gallery[activeImage].alt}
              fill
              priority
              loading="eager"
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            {activeImage === 0 && (
              <span className="bag-label product-main-label">
                <small>{product.country}</small>
                <strong>{product.shortName}</strong>
              </span>
            )}
          </div>
        </section>

        <section className="product-info">
          <span className="product-info__method">{product.method}</span>
          <h1>{product.name}</h1>
          <p className="product-info__notes">{product.notes.join(' · ')}</p>
          <p className="product-info__description">{product.description}</p>
          <div className="product-info__price-row">
            <strong>{price.toLocaleString('ru-RU')} ₽</strong>
            <button
              className={`favorite-button favorite-button--detail ${favorite ? 'is-active' : ''}`}
              onClick={toggleFavorite}
              aria-pressed={favorite}
              aria-label={
                favorite ? 'Убрать из избранного' : 'Добавить в избранное'
              }
            >
              <Heart size={25} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="roast-row">
            <span>Степень обжарки</span>
            <div aria-label={`Обжарка: ${product.roast} из 4`}>
              {[1, 2, 3, 4].map((level) => (
                <i
                  key={level}
                  className={level <= product.roast ? 'is-active' : ''}
                />
              ))}
            </div>
            <small>{product.roast <= 2 ? 'Светлая' : 'Средняя'}</small>
          </div>

          <OptionRow label="Вес">
            {[250, 1000].map((value) => (
              <button
                key={value}
                className={weight === value ? 'is-active' : ''}
                onClick={() => setWeight(value)}
              >
                {value === 250 ? '250 г' : '1 кг'}
              </button>
            ))}
          </OptionRow>

          <OptionRow label="Помол">
            {['В зёрнах', 'Под фильтр'].map((value) => (
              <button
                key={value}
                className={grind === value ? 'is-active' : ''}
                onClick={() => setGrind(value)}
              >
                {value}
              </button>
            ))}
          </OptionRow>

          <div className="product-buy-row">
            <span className="product-buy-row__label">Количество</span>
            <div className="quantity-control">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Уменьшить количество"
              >
                <Minus size={18} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Увеличить количество"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              className={`button button--dark product-add-button ${added ? 'is-added' : ''}`}
              onClick={addToCart}
              aria-live="polite"
            >
              {added ? <Check size={20} /> : <ShoppingBag size={20} />}
              {added ? 'Добавлено' : 'В корзину'}
            </button>
          </div>

          <div className="product-benefits">
            <span>
              <Coffee size={26} />
              Свежая
              <br />
              обжарка
            </span>
            <span>
              <Truck size={27} />
              Доставка
              <br />
              от 2 500 ₽
            </span>
            <span>
              <PackageCheck size={27} />
              100% арабика
              <br />
              без добавок
            </span>
          </div>
        </section>
      </div>

      <section className="product-tabs">
        <div className="product-tabs__nav" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={activeTab === index ? 'is-active' : ''}
              onClick={() => setActiveTab(index)}
              role="tab"
              aria-selected={activeTab === index}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="product-tabs__content" role="tabpanel">
          {activeTab === 0 && (
            <>
              <p>
                {product.description} Кофе хорошо раскрывается в воронке,
                аэропрессe и капельной кофеварке.
              </p>
              <dl>
                <div>
                  <dt>Регион</dt>
                  <dd>{product.country}</dd>
                </div>
                <div>
                  <dt>Разновидность</dt>
                  <dd>Катурра, Бурбон</dd>
                </div>
                <div>
                  <dt>Обработка</dt>
                  <dd>Мытая</dd>
                </div>
                <div>
                  <dt>Высота</dt>
                  <dd>1 700–2 100 м</dd>
                </div>
              </dl>
            </>
          )}
          {activeTab === 1 && (
            <p>
              Арабика, урожай 2026 года. Рекомендуемая температура воды — 92–94
              °C. Дата обжарки указана на упаковке.
            </p>
          )}
          {activeTab === 2 && (
            <p>
              Покупатели отмечают чистую чашку, выразительный аромат и
              стабильный результат при заваривании.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function OptionRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="option-row">
      <span>{label}</span>
      <div>{children}</div>
    </div>
  );
}
