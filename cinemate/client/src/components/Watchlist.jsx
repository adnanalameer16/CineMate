import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import { getAuth } from 'firebase/auth';

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const handleRemove = async (tmdb_id) => {
  try {
    const res = await fetch('http://localhost:5000/user/watchlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid, tmdb_id })
    });

    const data = await res.json();
    if (data.success) {
      setMovies(prev => prev.filter(movie => movie.tmdb_id !== tmdb_id));
    }
  } catch (err) {
    console.error('Failed to remove from watchlist', err);
  }
};


  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user/watchlist?uid=${uid}`);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error('Failed to fetch watchlist', err);
      }
    };

    if (uid) fetchWatchlist();
  }, [uid]);

  return (
    <div className="watchlist-grid">
      {movies.map((movie) => (
      <div>
        <div key={movie.tmdb_id} className="movie-card">
          <img src={movie.poster} alt={movie.title} />
          <div className="movie-overlay">
            <h3>{movie.title}</h3>
            <p><b>Director:</b> {movie.director}</p>
            <p><b>Cast:</b> {movie.cast_list}</p>
            <p><b>Genre:</b> {movie.genre}</p>
          </div>
        </div>
      <button className="remove-btn" onClick={() => handleRemove(movie.tmdb_id)}>🗑 Remove</button>
      </div> 
      ))}
    </div>
  );
}

export default Watchlist;
