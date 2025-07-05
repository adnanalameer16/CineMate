import React,{useState,useEffect} from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const [movie,setMovie]=useState(null);
    const handleWatchClick= () =>{
      navigate('/watchlist');
    };
    useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch('http://localhost:5000/movie?title=Inception');
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error('Failed to fetch movie data', err);
      }
    };

    fetchMovie();
  }, []);
  if (!movie) return <div>Loading movie...</div>;
  return (
    <div className="main-page">
      <div className="top-buttons">
        <button className="recommend-btn">Want a Recommendation?</button>
        <button className="watchlist-btn" onClick={handleWatchClick}>
          ➕ Add to Watchlist
        </button>

      </div>

      <div className="movie-box">
        <div className="movie-title">🎬 {movie.Title}</div>
        <div className='movie-box-components'>
          <div className ="movie-box-left">
            
            <img src={movie.Poster} alt="Movie Poster" className="movie-poster" />

          </div>
          <div className="movie-box-right">
            <p className="movie-plot">{movie.Plot}</p>
            <div className="movie-rating">⭐ IMDb Rating: {movie.imdbRating}</div>
            <div className="movie-info">Director: {movie.Director}</div>
            <div className='movie-info'>Cast: {movie.Actors}</div>
            <div className='movie-info'>Genre: {movie.Genre}</div>
            <div className="action-buttons">
              <button className="like">❤️ Like</button>
              <button className="not-seen">❌ Haven’t Seen</button>
              <button className="dislike">💔 Dislike</button>
            </div>
          </div>
          
        </div>
        
      </div>
        
    
    </div>
  );
}

export default Main;
