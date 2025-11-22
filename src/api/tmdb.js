const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies(page = 1) {
  if (!API_KEY) throw new Error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.');
  const res = await fetch(`${BASE}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB fetch failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function searchMovies(query, page = 1) {
  if (!query) return { results: [] };
  if (!API_KEY) throw new Error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.');
  const res = await fetch(`${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB search failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function posterUrl(path, size = 'w300') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export async function fetchMovieById(id) {
  if (!id) throw new Error('movie id is required');
  if (!API_KEY) throw new Error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.');
  const res = await fetch(`${BASE}/movie/${id}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB fetch movie failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchSimilarMovies(id, page = 1) {
  if (!id) throw new Error('movie id is required');
  if (!API_KEY) throw new Error('TMDB API key is missing. Set VITE_TMDB_API_KEY in your .env file.');
  const res = await fetch(`${BASE}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=${page}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB fetch similar failed: ${res.status} ${text}`);
  }
  return res.json();
}
