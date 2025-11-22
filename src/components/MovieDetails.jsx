import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { posterUrl, fetchMovieById, fetchSimilarMovies } from '../api/tmdb';
import MovieCard from './MovieCard';
import { useFavorites } from '../context/FavoritesContext';
import './MovieDetails.css';

export default function MovieDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const [movie, setMovie] = useState(() => (state && state.movie) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadById(id) {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieById(id);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // If router provided the movie in location.state and it matches the param, use it.
    if (state && state.movie && params?.id && String(state.movie.id) === String(params.id)) {
      setMovie(state.movie);
      setLoading(false);
      setError(null);
      return () => { cancelled = true; };
    }

    // If we don't have an id, nothing to do
    if (!params?.id) return () => { cancelled = true; };

    // If current movie already matches the param, do nothing
    if (movie && String(movie.id) === String(params.id)) return () => { cancelled = true; };

    // Otherwise fetch by id
    loadById(params.id);

    return () => {
      cancelled = true;
    };
  }, [params?.id, state && state.movie]);

  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = movie ? isFavorite(movie.id) : false;

  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadSimilar() {
      if (!movie || !movie.id) return;
      setSimilarLoading(true);
      setSimilarError(null);
      try {
        const data = await fetchSimilarMovies(movie.id);
        if (!cancelled) setSimilar(Array.isArray(data.results) ? data.results : []);
      } catch (err) {
        if (!cancelled) setSimilarError(err.message || String(err));
      } finally {
        if (!cancelled) setSimilarLoading(false);
      }
    }
    loadSimilar();
    return () => {
      cancelled = true;
    };
  }, [movie && movie.id]);

  // Teleport behavior: when movie changes (e.g. clicking a similar movie), scroll to top
  useEffect(() => {
    if (!movie || !movie.id) return;
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_e) {
      // ignore
    }
  }, [movie && movie.id]);

  if (loading) {
    return (
      <div className="movie-details" style={{ textAlign: 'center' }}>
        <p>Loading…</p>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details" style={{ textAlign: 'center' }}>
        <p>Error loading movie: {error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details" style={{ textAlign: 'center' }}>
        <p>Movie details not found.</p>
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  const poster = posterUrl(movie.poster_path, 'w500');

  return (
    <div className="movie-details">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <div className="details-layout">
        {poster && (
          <div className="poster-wrapper">
            <img src={poster} alt={movie.title} />
          </div>
        )}
        <div className="info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0 }}>{movie.title}</h1>
            <button
              onClick={() => toggleFavorite(movie)}
              style={{
                background: fav ? '#ff4d6d' : 'rgba(0,0,0,0.4)',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              {fav ? 'Remove Favorite' : 'Add Favorite'}
            </button>
          </div>
          <p className="meta">
            {movie.release_date && <span>Release: {movie.release_date}</span>}
            {movie.vote_average && <span>Rating: ⭐ {movie.vote_average}</span>}
            {movie.runtime && <span>Runtime: {movie.runtime} min</span>}
          </p>
          {movie.overview && <p className="overview">{movie.overview}</p>}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ margin: '8px 0' }}>Similar Movies</h3>
            {similarLoading && <div>Loading similar movies…</div>}
            {similarError && <div style={{ color: '#ff6b6b' }}>Error: {similarError}</div>}
            {!similarLoading && !similarError && similar && similar.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>No similar movies found.</div>
            )}
            {!similarLoading && similar && similar.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 8 }}>
                {similar.slice(0, 12).map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
