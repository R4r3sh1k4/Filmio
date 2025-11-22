import React from 'react';
import MovieCard from './MovieCard';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>You have no favorites yet. Click the heart on any movie to add it here.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
