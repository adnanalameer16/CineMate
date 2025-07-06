import React,{useState,useEffect} from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const [movie,setMovie]=useState(null);
  const [showDialog,setShowDialog]=useState(false);

  const handleWatchClick= () =>{
    navigate('/watchlist');
  };

  useEffect(() => {
    fetchRandomMovie();
  }, []);

  const fetchRandomMovie = async () => {
    try {
      const res = await fetch('http://localhost:5000/movie/next');
      const data = await res.json();
      setMovie(data);
    } catch (err) {
      console.error('Error fetching random movie', err);
    }
  };

  const handleLike = () => {
    fetchRandomMovie();
  };

  const handleDislike = () => {
    fetchRandomMovie();
  };

  const handleNotSeen = () => {
    setShowDialog(true);
  };


  if (!movie) return <div>Loading movie...</div>;
  return (
    <div className="main-page">
      <div className="top-buttons">
        <button className="recommend-btn">Want a Recommendation?</button>
        <button className="watchlist-btn" onClick={handleWatchClick}>Watchlist</button>
      </div>

      <div className="movie-box">
        <div className="movie-title">🎬 {movie.title}</div>
        <div className='movie-box-components'>
          <div className ="movie-box-left">
            
            <img src={movie.poster} alt="Movie Poster" className="movie-poster" />

          </div>
          <div className="movie-box-right">
            <p className="movie-plot">{movie.description}</p>
            <div className="movie-rating">⭐ IMDb Rating: {movie.rating}</div>
            <div className="movie-info">Director: {movie.director}</div>
            <div className='movie-info'>Cast: {movie.cast}</div>
            <div className='movie-info'>Genre: {movie.genre}</div>
            <div className="action-buttons">
              <button className="like" onClick={handleLike}>❤️ Like</button>
              <button className="not-seen" onClick={handleNotSeen}>❌ Haven’t Seen</button>
              <button className="dislike" onClick={handleDislike}>💔 Dislike</button>
            </div>
          </div>
          
        </div>
        
      </div>
          {showDialog && (
            <div className="dialog-backdrop">
              <div className="dialog-box">
                <p>Do you want to add this movie to your watchlist?</p>
                <div className="dialog-buttons">
                  <button onClick={() => {
                    console.log("Movie will be added to watchlist later...");
                    setShowDialog(false);
                    fetchRandomMovie();
                  }}>Yes</button>
                  <button onClick={() => {
                    setShowDialog(false);
                    fetchRandomMovie();
                  }}>No</button>
                </div>
              </div>
            </div>
          )}
    
    </div>

  );
}

export default Main;
