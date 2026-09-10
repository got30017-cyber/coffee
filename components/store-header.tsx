'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [compact, setCompact] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const menuDialogRef = useRef<HTMLDialogElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const savedCount = Number.parseInt(
      window.localStorage.getItem('light-coffee:cart-count') ?? '',
      10,
    );
    if (Number.isFinite(savedCount) && savedCount >= 0) {
      window.requestAnimationFrame(() => setCartCount(savedCount));
    }

    const handleCart = (event: Event) => {
      const quantity =
        event instanceof CustomEvent &&
        typeof event.detail?.quantity === 'number'
          ? event.detail.quantity
          : 1;
      setCartCount((count) => {
        const nextCount = count + Math.max(1, quantity);
        window.localStorage.setItem(
          'light-coffee:cart-count',
          String(nextCount),
        );
        return nextCount;
      });
    };
    window.addEventListener('cart:add', handleCart);
    return () => window.removeEventListener('cart:add', handleCart);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        if (currentScrollY < 24 || delta < -5) setCompact(false);
        else if (currentScrollY > 96 && delta > 5) setCompact(true);

        lastScrollY = currentScrollY;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      menuDialogRef.current?.close();
      document.body.style.overflow = '';
      menuTriggerRef.current?.focus();
    }, 180);
  }, []);

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    const dialog = menuDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      setMenuOpen(true);
      window.requestAnimationFrame(() => menuCloseRef.current?.focus());
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
    if (menuOpen) menuCloseRef.current?.focus();
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
      <header className={`site-header ${compact ? 'is-compact' : ''}`}>
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
              <span aria-live="polite" aria-atomic="true">
                {cartCount}
              </span>
            </Link>
            <button
              ref={menuTriggerRef}
              className="icon-button mobile-menu-button"
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={openMenu}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={menuDialogRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-label="Мобильное меню"
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
      >
        <button
          className="mobile-menu__backdrop"
          aria-label="Закрыть меню"
          onClick={closeMenu}
        />
        <div className="mobile-menu__panel">
          <div className="mobile-menu__top">
            <Brand compact />
            <button
              ref={menuCloseRef}
              className="icon-button"
              aria-label="Закрыть меню"
              onClick={closeMenu}
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
              <Link href={href} key={label} onClick={closeMenu}>
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
