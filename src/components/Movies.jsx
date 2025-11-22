import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { fetchPopularMovies, searchMovies } from '../api/tmdb';

export default function Movies({ query: propQuery, setQuery: propSetQuery }) {
  const [localQuery, setLocalQuery] = useState('');
  const query = propQuery !== undefined ? propQuery : localQuery;
  const setQuery = typeof propSetQuery === 'function' ? propSetQuery : setLocalQuery;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = query.trim() ? await searchMovies(query.trim()) : await fetchPopularMovies();
        if (!active) return;
        setMovies(data.results || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || String(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [query]);

  return (
    <div>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
      {error && <p style={{ textAlign: 'center', color: 'tomato' }}>Error loading movies: {String(error)}</p>}

      <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        padding: '0 1rem'
      }}>
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  );
}
