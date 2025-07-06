import React, { useEffect, useState } from 'react';
import './Watchlist.css'; // reuse same grid styles
import { getAuth } from 'firebase/auth';

function Profile() {
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const resLiked = await fetch(`http://localhost:5000/user/liked?uid=${uid}`);
        const resDisliked = await fetch(`http://localhost:5000/user/disliked?uid=${uid}`);
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
    <div className="profile-page">
      <h2>❤️ Liked Movies</h2>
      <div className="watchlist-grid">
        {liked.map((movie) => (
          <div key={movie.tmdb_id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-overlay">
              <h3>{movie.title}</h3>
              <p><b>Director:</b> {movie.director}</p>
              <p><b>Cast:</b> {movie.cast_list}</p>
              <p><b>Genre:</b> {movie.genre}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>💔 Disliked Movies</h2>
      <div className="watchlist-grid">
        {disliked.map((movie) => (
          <div key={movie.tmdb_id} className="movie-card">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-overlay">
              <h3>{movie.title}</h3>
              <p><b>Director:</b> {movie.director}</p>
              <p><b>Cast:</b> {movie.cast_list}</p>
              <p><b>Genre:</b> {movie.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
