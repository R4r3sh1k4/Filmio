import React from 'react';
import { useNavigate } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';

function FavoriteButton({ movie }) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const fav = isFavorite(movie.id);

	return (
		<button
			onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
			aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
			title={fav ? 'Remove from favorites' : 'Add to favorites'}
			style={{
				position: 'absolute',
				right: 8,
				top: 8,
				background: fav ? '#ff4d6d' : 'rgba(0,0,0,0.4)',
				border: 'none',
				color: '#fff',
				padding: '6px 8px',
				borderRadius: 999,
				cursor: 'pointer'
			}}
		>
			{fav ? '♥' : '♡'}
		</button>
	);
}

export default function MovieCard({ movie }) {
	const navigate = useNavigate();
	const img = posterUrl(movie.poster_path);

	return (
		<div
			role="link"
			tabIndex={0}
			aria-label={`Open ${movie.title} details`}
			onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					navigate(`/movie/${movie.id}`, { state: { movie } });
				}
			}}
			style={{
				background: 'rgba(255,255,255,0.03)',
				border: '1px solid rgba(255,255,255,0.06)',
				borderRadius: 8,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				cursor: 'pointer'
			}}
		>
			<div style={{ width: '100%', height: 270, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
				{img ? (
					<img src={img} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
				) : (
					<div style={{ color: 'rgba(255,255,255,0.6)', padding: 12 }}>No Image</div>
				)}
				<FavoriteButton movie={movie} />
			</div>
			<div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
				<div style={{ fontWeight: 700, fontSize: 14 }}>{movie.title}</div>
				<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{movie.release_date}</div>
				<div style={{ marginTop: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
					{movie.vote_average ? `⭐ ${movie.vote_average}` : ''}
				</div>
				<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6, lineHeight: 1.2 }}>
					{movie.overview ? (movie.overview.length > 140 ? movie.overview.slice(0, 140) + '…' : movie.overview) : ''}
				</div>
			</div>
		</div>
	);
}
