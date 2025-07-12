import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecommendationPage.css';

function RecommendationPage() {
  const { uid, source } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const endpoint = source === 'watchlist'
          ? `http://localhost:5000/recommend/from-watchlist/${uid}`
          : `http://localhost:5000/recommend/${uid}`;
        
        const res = await fetch(endpoint);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error('Failed to fetch recommendation:', err);
      }
    };

    fetchRecommendation();
  }, [uid, source]);

  if (!movie) return <div>Loading recommendation...</div>;

  return (
    <div className="recommendation-page">
      <div className="movie-box">
        <div className="movie-title">🎯 Recommended for You: {movie.title}</div>
        <div className="movie-box-components">
          <div className="movie-box-left">
            <img src={movie.poster} alt="Movie Poster" className="movie-poster" />
          </div>
          <div className="movie-box-right">
            <p className="movie-plot">{movie.description}</p>
            <div className="movie-rating">⭐ IMDb Rating: {movie.rating}</div>
            <div className="movie-info">Director: {movie.director}</div>
            <div className="movie-info">Cast: {movie.cast}</div>
            <div className="movie-info">Genre: {movie.genre}</div>
            <div className="movie-info">📅 Release Date: {movie.release_date}</div>
            <div className="movie-info">🌐 Language: {movie.language}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendationPage;
