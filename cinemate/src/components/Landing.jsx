import './Landing.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <div className='main'>
        <div>CINEMATE</div>
        <div>YOUR DAILY DOSE OF CINEMA</div>
        <button onClick={handleLoginClick}>Login</button>
      </div>

      <div className="features">
        <div className="feature-box">
          <div className="feature-title">Movie Recs</div>
          <div className="feature-desc">Get personalized movie recommendations based on your taste!</div>
        </div>
        <div className="feature-box">
          <div className="feature-title">User Reviews</div>
          <div className="feature-desc">Read and write honest reviews about movies you've seen.</div>
        </div>
        <div className="feature-box">
          <div className="feature-title">Latest News</div>
          <div className="feature-desc">Stay updated with the latest buzz in the movie world.</div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
