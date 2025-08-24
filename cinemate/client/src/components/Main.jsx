import React,{useState,useEffect} from 'react';
import './Main.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';


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

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/login');
    }).catch((error) => {
      // An error happened.
      console.error('Logout Error:', error);
    });
  };



  useEffect(() => {
    fetchRandomMovie();
  }, []);

  const fetchRandomMovie = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/movie/next`);
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/add-action`, {
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

  if (!movie) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  return (
    <div className="main-page">
      <nav className="main-nav">
        <div className="nav-logo">
          <img src="/src/assets/red_image2.jpg" alt="Cinemate Logo" style={{ height: '38px', verticalAlign: 'middle', borderRadius: '8px', marginRight: '10px' }} />
        </div>
        <div className="nav-center">
          <button className="nav-btn" onClick={handleRecommendClick}>Recommend</button>
          <button className="nav-btn" onClick={handleWatchClick}>Watchlist</button>
          <button className="nav-btn" onClick={handleProfileClick}>Profile</button>
          <button className="nav-btn" onClick={handleStatsClick}>Stats</button>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="movie-container">
        <div className="movie-card-main">
          <div className="movie-poster-container">
            <img src={movie.poster} alt="Movie Poster" className="movie-poster" />
          </div>
          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-plot">{movie.description}</p>
            <div className="movie-meta">
              <span><strong>Rating:</strong> {movie.rating}⭐</span>
              <span><strong>Director:</strong> {movie.director}</span>
              <span><strong>Genre:</strong> {movie.genre}</span>
            </div>
             <div className="movie-cast"><strong>Cast:</strong> {movie.cast}</div>
            <div className="action-buttons">
              <button className="action-btn like" onClick={handleLike}>Like ❤️</button>
              <button className="action-btn not-seen" onClick={handleNotSeen}>Not Seen 🙈</button>
              <button className="action-btn dislike" onClick={handleDislike}>Dislike 👎</button>
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog-box">
            <h3>Add to Watchlist?</h3>
            <p>Do you want to add this movie to your watchlist to watch later?</p>
            <div className="dialog-buttons">
              <button className="dialog-btn-yes" onClick={() => {
                sendMovieAction('watchlist');
                setShowDialog(false);
                fetchRandomMovie();
              }}>Yes, Add It</button>
              <button className="dialog-btn-no" onClick={() => {
                setShowDialog(false);
                fetchRandomMovie();
              }}>No, Thanks</button>
            </div>
          </div>
        </div>
      )}

      {showRecommendDialog && (
        <div className="dialog-backdrop">
          <div className="dialog-box">
            <button className="dialog-close-btn" onClick={() => setShowRecommendDialog(false)}>&times;</button>
            <h3>Get a Recommendation</h3>
            <p>Do you want a recommendation based on your watchlist or from all movies?</p>
            <div className="dialog-buttons">
              <button className="dialog-btn-yes" onClick={() => navigate(`/recommend/${uid}/watchlist`)}>From Watchlist</button>
              <button className="dialog-btn-no" onClick={() => navigate(`/recommend/${uid}/global`)}>From All Movies</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
