import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'favorites:movies';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (_e) {}
  }, [favorites]);

  function isFavorite(movieId) {
    return favorites.some((m) => String(m.id) === String(movieId));
  }

  function addFavorite(movie) {
    setFavorites((cur) => {
      if (!movie || isFavorite(movie.id)) return cur;
      return [movie, ...cur];
    });
  }

  function removeFavorite(movieId) {
    setFavorites((cur) => cur.filter((m) => String(m.id) !== String(movieId)));
  }

  function toggleFavorite(movie) {
    if (!movie) return;
    if (isFavorite(movie.id)) removeFavorite(movie.id);
    else addFavorite(movie);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}

export default FavoritesProvider;
