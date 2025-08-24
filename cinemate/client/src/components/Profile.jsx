import React, { useEffect, useState } from 'react';
import './Watchlist.css'; // reuse same grid styles
import { getAuth } from 'firebase/auth';


function Profile() {
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  // Remove handler for liked/disliked
  const handleRemove = async (tmdb_id, type) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${type}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid, tmdb_id })
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'liked') {
          setLiked(prev => prev.filter(movie => movie.tmdb_id !== tmdb_id));
        } else {
          setDisliked(prev => prev.filter(movie => movie.tmdb_id !== tmdb_id));
        }
      }
    } catch (err) {
      console.error(`Failed to remove from ${type}`, err);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const resLiked = await fetch(`${import.meta.env.VITE_API_URL}/user/liked?uid=${uid}`);
        const resDisliked = await fetch(`${import.meta.env.VITE_API_URL}/user/disliked?uid=${uid}`);
        const likedData = await resLiked.json();
        const dislikedData = await resDisliked.json();

        setLiked(likedData);
        setDisliked(dislikedData);
      } catch (err) {
        console.error('Failed to fetch profile movies', err);
      }
    };

    if (uid) fetchMovies();
  }, [uid]);

  return (
    <div className="page-container">
      <h1 className="page-title">My Profile</h1>
      <section className="profile-section">
        <h2>Liked Movies</h2>
        <div className="movie-grid">
          {liked.map((movie) => (
            <div key={movie.tmdb_id} className="movie-card-grid">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-overlay">
                <h3>{movie.title}</h3>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Cast:</strong> {movie.cast_list}</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <button className="remove-btn" onClick={() => handleRemove(movie.tmdb_id, 'liked')}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <h2>Disliked Movies</h2>
        <div className="movie-grid">
          {disliked.map((movie) => (
            <div key={movie.tmdb_id} className="movie-card-grid">
              <img src={movie.poster} alt={movie.title} />
              <div className="movie-overlay">
                <h3>{movie.title}</h3>
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Cast:</strong> {movie.cast_list}</p>
                <p><strong>Genre:</strong> {movie.genre}</p>
                <button className="remove-btn" onClick={() => handleRemove(movie.tmdb_id, 'disliked')}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Profile;
