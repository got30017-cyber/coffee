'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import type { CoffeeProduct } from '@/lib/store-data';

const methodOptions = ['Для фильтра', 'Эспрессо', 'Для турки'];
const tasteOptions = ['Шоколад', 'Ягоды', 'Цитрусы', 'Орехи', 'Цветы'];

export function CatalogClient({ products }: { products: CoffeeProduct[] }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [methods, setMethods] = useState<string[]>([]);
  const [tastes, setTastes] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    if (!filtersOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFiltersOpen(false);
    };
    document.addEventListener('keydown', close);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', close);
      document.body.style.overflow = '';
    };
  }, [filtersOpen]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const methodMatch = !methods.length || methods.includes(product.method);
      const tasteMatch =
        !tastes.length ||
        product.notes.some((note) =>
          tastes.some((taste) =>
            note.toLowerCase().includes(taste.toLowerCase()),
          ),
        );
      return methodMatch && tasteMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [methods, products, sort, tastes]);

  const toggle = (
    value: string,
    selected: string[],
    setter: (value: string[]) => void,
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const filterProps = {
    methods,
    tastes,
    toggleMethod: (value: string) => toggle(value, methods, setMethods),
    toggleTaste: (value: string) => toggle(value, tastes, setTastes),
    reset: () => {
      setMethods([]);
      setTastes([]);
    },
  };

  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <Filters {...filterProps} />
      </aside>
      <div className="catalog-results">
        <div className="catalog-toolbar">
          <span>Найдено {filteredProducts.length} товаров</span>
          <button
            className="filter-trigger"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={18} /> Фильтры
          </button>
          <label className="sort-select">
            <span>Сортировка:</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </label>
        </div>
        {filteredProducts.length ? (
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Ничего не нашли</h2>
            <p>Попробуйте убрать часть фильтров.</p>
            <button className="button button--dark" onClick={filterProps.reset}>
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      <dialog
        open={filtersOpen}
        className={`filter-drawer ${filtersOpen ? 'is-open' : ''}`}
        aria-hidden={!filtersOpen}
        aria-label="Фильтры каталога"
      >
        <button
          className="filter-drawer__backdrop"
          aria-label="Закрыть фильтры"
          onClick={() => setFiltersOpen(false)}
        />
        <aside className="filter-drawer__panel">
          <div className="filter-drawer__header">
            <h2>Фильтры</h2>
            <button
              className="icon-button"
              aria-label="Закрыть фильтры"
              onClick={() => setFiltersOpen(false)}
            >
              <X size={23} />
            </button>
          </div>
          <Filters {...filterProps} />
          <button
            className="button button--dark filter-drawer__apply"
            onClick={() => setFiltersOpen(false)}
          >
            Показать {filteredProducts.length} товаров
          </button>
        </aside>
      </dialog>
    </div>
  );
}

function Filters({
  methods,
  tastes,
  toggleMethod,
  toggleTaste,
  reset,
}: {
  methods: string[];
  tastes: string[];
  toggleMethod: (value: string) => void;
  toggleTaste: (value: string) => void;
  reset: () => void;
}) {
  return (
    <div className="filters">
      <FilterGroup title="Обжарка">
        {['Светлая', 'Средняя', 'Тёмная'].map((value, index) => (
          <label key={value}>
            <input type="checkbox" defaultChecked={index === 1} />
            <span>{value}</span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Способ">
        {methodOptions.map((value) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={methods.includes(value)}
              onChange={() => toggleMethod(value)}
            />
            <span>{value}</span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Вкус">
        {tasteOptions.map((value) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={tastes.includes(value)}
              onChange={() => toggleTaste(value)}
            />
            <span>{value}</span>
          </label>
        ))}
      </FilterGroup>
      <FilterGroup title="Цена, ₽">
        <div className="price-range" aria-label="Цена от 500 до 2000 рублей">
          <div className="price-range__line">
            <i />
            <i />
          </div>
          <div className="price-range__labels">
            <span>от 500</span>
            <span>до 2 000</span>
          </div>
          <div className="price-range__inputs">
            <span>500</span>
            <span>2 000</span>
          </div>
        </div>
      </FilterGroup>
      <button className="filter-reset" onClick={reset}>
        Сбросить фильтры
      </button>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="filter-group">
      <h3>
        {title} <ChevronDown size={16} />
      </h3>
      <div>{children}</div>
    </section>
  );
}
