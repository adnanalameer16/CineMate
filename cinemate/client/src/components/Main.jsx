import React,{useState,useEffect} from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';


function Main() {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid;
  const navigate = useNavigate();
  const [movie,setMovie]=useState(null);
  const [showDialog,setShowDialog]=useState(false);
  const [showRecommendDialog, setShowRecommendDialog] = useState(false);


  const handleWatchClick= () =>{
    navigate('/watchlist');
  };
  const handleProfileClick= () =>{
    navigate('/profile');
  };
  const handleStatsClick= () =>{
    navigate('/stats');
  };
  const handleRecommendClick = () => {
    setShowRecommendDialog(true);
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
    sendMovieAction('liked');
    fetchRandomMovie();
  };

  const handleDislike = () => {
    sendMovieAction('disliked');
    fetchRandomMovie();
  };

  const handleNotSeen = () => {
    setShowDialog(true);

  };

  const sendMovieAction = async (actionType) => {
  if (!uid || !movie) return;

  const payload = {
    uid,
    tmdb_id: movie.id,
    title: movie.title,
    poster: movie.poster,
    cast_list: movie.cast,
    director: movie.director,
    genre: movie.genre,
    action: actionType,
    release_date: movie.release_date, // must be in TMDB result
    rating: movie.rating,             // from vote_average
    language: movie.language          // original_language
  };

  try {
    const res = await fetch('http://localhost:5000/user/add-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to send movie action');

    console.log('Action recorded:', actionType);
  } catch (err) {
    console.error('Error recording action:', err);
  }
};

  if (!movie) return <div>Loading movie...</div>;
  return (
    <div className="main-page">
      <div className="top-buttons">
        <button className="recommend-btn" onClick={handleRecommendClick}>Want a Recommendation?</button>
        <button className="watchlist-btn" onClick={handleWatchClick}>Watchlist</button>
        <button className="profile-btn" onClick={handleProfileClick}>Profile</button>
        <button className="stats-btn" onClick={handleStatsClick}>Stats</button>
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
                    sendMovieAction('watchlist');
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
          {showRecommendDialog && (
            <div className="dialog-backdrop">
              <div className="dialog-box">
                <p>Do you want a recommendation from your watchlist?</p>
                <div className="dialog-buttons">
                  <button onClick={() => {
                    navigate(`/recommend/${uid}/watchlist`);
                  }}>Yes</button>
                  <button onClick={() => {
                    navigate(`/recommend/${uid}/global`);
                  }}>No</button>
                </div>
              </div>
            </div>
          )}

    
    </div>

  );
}

export default Main;
