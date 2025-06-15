import React from 'react';
import './Watchlist.css';

function Watchlist() {
  return (
    <div className="watchlist-container">
      <h1>Your Watchlist 🎥</h1>
      
      <div className="watchlist">
        <div className="watchlist-item">
          <h3>Movie Title</h3>
          <p><strong>Genre:</strong> Genre Name</p>
          <p><strong>IMDb Rating:</strong> Rating</p>
        </div>

        <div className="watchlist-item">
          <h3>Another Movie</h3>
          <p><strong>Genre:</strong> Genre Name</p>
          <p><strong>IMDb Rating:</strong> Rating</p>
        </div>
        
        {/* Add more <div className="watchlist-item"> as needed */}
      </div>
    </div>
  );
}

export default Watchlist;
