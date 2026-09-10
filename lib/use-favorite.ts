'use client';

import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'light-coffee:favorites';
const FAVORITES_EVENT = 'favorites:change';

function readFavorites() {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(FAVORITES_KEY) ?? '[]',
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useFavorite(slug: string) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const sync = () => setFavorite(readFavorites().includes(slug));
    sync();
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [slug]);

  const toggleFavorite = useCallback(() => {
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(slug)
      ? favorites.filter((item) => item !== slug)
      : [...favorites, slug];
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  }, [slug]);

  return { favorite, toggleFavorite };
}
