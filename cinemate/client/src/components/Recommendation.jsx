import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecommendationPage.css';
import './Main.css';

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

  if (!movie) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading recommendation...</p>
      </div>
    );
  }


  return (
    <div className="page-container recommendation-page">
      <h1 className="page-title">Recommended For You</h1>
      <div className="movie-card-main">
          <div className="movie-poster-container">
            <img src={movie.poster} alt="Movie Poster" className="movie-poster" />
          </div>
          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-plot">{movie.description}</p>
            <div className="movie-meta">
              <span><strong>Rating: </strong>{movie.rating}</span>
              <span><strong>Director: </strong>{movie.director}</span>
              <span><strong>Cast: </strong>{movie.genre}</span>
            </div>
             <div className="movie-cast"><strong>Cast:</strong> {movie.cast}</div>
             <div className="movie-info-extra">
                <span><strong>Release:</strong> {movie.release_date}</span>
                <span><strong>Language:</strong> {movie.language}</span>
             </div>
          </div>
        </div>
    </div>
  );
}

export default RecommendationPage;
