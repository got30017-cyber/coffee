'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import type { CoffeeProduct } from '@/lib/store-data';

const methodOptions = ['Для фильтра', 'Эспрессо', 'Для турки'];
const tasteOptions = ['Шоколад', 'Ягоды', 'Цитрусы', 'Орехи', 'Цветы'];
const roastOptions = ['Светлая', 'Средняя', 'Тёмная'];

export function CatalogClient({ products }: { products: CoffeeProduct[] }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [roasts, setRoasts] = useState<string[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [tastes, setTastes] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');
  const drawerRef = useRef<HTMLDialogElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      drawerRef.current?.close();
      document.body.style.overflow = '';
      filterTriggerRef.current?.focus();
    }, 180);
  }, []);

  const openFilters = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    const drawer = drawerRef.current;
    if (drawer && !drawer.open) drawer.showModal();
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      setFiltersOpen(true);
      window.requestAnimationFrame(() => drawerCloseRef.current?.focus());
    });
  };

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      document.body.style.overflow = '';
    },
    [],
  );

  useEffect(() => {
    if (filtersOpen) drawerCloseRef.current?.focus();
  }, [filtersOpen]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const roast =
        product.roast <= 2
          ? 'Светлая'
          : product.roast === 3
            ? 'Средняя'
            : 'Тёмная';
      const roastMatch = !roasts.length || roasts.includes(roast);
      const methodMatch = !methods.length || methods.includes(product.method);
      const tasteMatch =
        !tastes.length ||
        product.notes.some((note) =>
          tastes.some((taste) =>
            note.toLowerCase().includes(taste.toLowerCase()),
          ),
        );
      return roastMatch && methodMatch && tasteMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [methods, products, roasts, sort, tastes]);

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
    roasts,
    methods,
    tastes,
    toggleRoast: (value: string) => toggle(value, roasts, setRoasts),
    toggleMethod: (value: string) => toggle(value, methods, setMethods),
    toggleTaste: (value: string) => toggle(value, tastes, setTastes),
    reset: () => {
      setRoasts([]);
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
            ref={filterTriggerRef}
            className="filter-trigger"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
            onClick={openFilters}
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
        ref={drawerRef}
        id="catalog-filters"
        className={`filter-drawer ${filtersOpen ? 'is-open' : ''}`}
        aria-label="Фильтры каталога"
        onCancel={(event) => {
          event.preventDefault();
          closeFilters();
        }}
      >
        <button
          className="filter-drawer__backdrop"
          aria-label="Закрыть фильтры"
          onClick={closeFilters}
        />
        <aside className="filter-drawer__panel">
          <div className="filter-drawer__header">
            <h2>Фильтры</h2>
            <button
              ref={drawerCloseRef}
              className="icon-button"
              aria-label="Закрыть фильтры"
              onClick={closeFilters}
            >
              <X size={23} />
            </button>
          </div>
          <Filters {...filterProps} />
          <button
            className="button button--dark filter-drawer__apply"
            onClick={closeFilters}
          >
            Показать {filteredProducts.length} товаров
          </button>
        </aside>
      </dialog>
    </div>
  );
}

function Filters({
  roasts,
  methods,
  tastes,
  toggleRoast,
  toggleMethod,
  toggleTaste,
  reset,
}: {
  roasts: string[];
  methods: string[];
  tastes: string[];
  toggleRoast: (value: string) => void;
  toggleMethod: (value: string) => void;
  toggleTaste: (value: string) => void;
  reset: () => void;
}) {
  return (
    <div className="filters">
      <FilterGroup title="Обжарка">
        {roastOptions.map((value) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={roasts.includes(value)}
              onChange={() => toggleRoast(value)}
            />
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
