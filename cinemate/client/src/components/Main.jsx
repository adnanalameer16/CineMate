import React from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
    const handleWatchClick= () =>{
      navigate('/watchlist');
    };
  return (
    <div className="main-page">
      <div className="top-buttons">
        <button className="recommend-btn">Want a Recommendation?</button>
        <button className="watchlist-btn" onClick={handleWatchClick}>
          ➕ Add to Watchlist
        </button>

      </div>

      <div className="movie-box">
        <div className="movie-title">🎬 Inception</div>

        <div className="action-buttons">
          <button className="like">❤️ Like</button>
          <button className="not-seen">❌ Haven’t Seen</button>
          <button className="dislike">💔 Dislike</button>
        </div>
      </div>
    </div>
  );
}

export default Main;
