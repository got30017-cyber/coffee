'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
  X,
} from 'lucide-react';

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    const handleCart = () => setCartCount((count) => count + 1);
    window.addEventListener('cart:add', handleCart);
    return () => window.removeEventListener('cart:add', handleCart);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="benefit-bar">
        <div className="container benefit-bar__inner">
          <span>
            <Truck size={15} /> Бесплатная доставка от 2 500 ₽
          </span>
          <span>✦ Свежая обжарка каждую неделю</span>
          <span>
            <Heart size={14} fill="currentColor" /> Помогаем делать жизнь ярче
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Основная навигация">
            <Link href="/catalog">
              Каталог <ChevronDown size={14} />
            </Link>
            <Link href="/catalog">
              Кофе <ChevronDown size={14} />
            </Link>
            <Link href="/catalog">Аксессуары</Link>
            <Link href="/articles">Статьи</Link>
          </nav>
          <div className="header-actions">
            <label className="search-field">
              <Search size={18} />
              <input
                aria-label="Поиск"
                placeholder="Поиск по товарам, вкусам, статьям…"
              />
            </label>
            <button className="icon-button desktop-only" aria-label="Профиль">
              <UserRound size={21} />
            </button>
            <Link
              className="icon-button cart-button"
              href="/checkout"
              aria-label={`Корзина, товаров: ${cartCount}`}
            >
              <ShoppingBag size={22} />
              <span>{cartCount}</span>
            </Link>
            <button
              className="icon-button mobile-menu-button"
              aria-label="Открыть меню"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        open={menuOpen}
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        aria-label="Мобильное меню"
      >
        <button
          className="mobile-menu__backdrop"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
        <div className="mobile-menu__panel">
          <div className="mobile-menu__top">
            <Brand compact />
            <button
              className="icon-button"
              aria-label="Закрыть меню"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <label className="search-field search-field--mobile">
            <Search size={18} />
            <input aria-label="Поиск" placeholder="Найти кофе" />
          </label>
          <nav aria-label="Мобильная навигация">
            {[
              ['Каталог', '/catalog'],
              ['Кофе', '/catalog'],
              ['Аксессуары', '/catalog'],
              ['Статьи', '/articles'],
            ].map(([label, href]) => (
              <Link href={href} key={label} onClick={() => setMenuOpen(false)}>
                {label} <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
          <div className="mobile-menu__meta">
            <span>Свежая обжарка</span>
            <span>Доставка по России</span>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="Светлый Кофе — на главную">
      <span className="brand__mark" aria-hidden="true">
        <i />
        <i />
      </span>
      <span>
        <strong>Светлый Кофе</strong>
        {!compact && <small>Больше, чем просто кофе</small>}
      </span>
    </Link>
  );
}
