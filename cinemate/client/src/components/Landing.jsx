import './Landing.css';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <header className='main-header'>
        <h1>CINEMATE</h1>
        <p>YOUR DAILY DOSE OF CINEMA</p>
        <button onClick={handleLoginClick}>Get Started</button>
      </header>

      <main className="features">
        <div className="feature-box">
          <h2 className="feature-title">Movie Recs</h2>
          <p className="feature-desc">Get personalized movie recommendations based on your taste!</p>
        </div>
        <div className="feature-box">
          <h2 className="feature-title">Curate Lists</h2>
          <p className="feature-desc">Create and share your own lists of favorite films.</p>
        </div>
        <div className="feature-box">
          <h2 className="feature-title">Track Films</h2>
          <p className="feature-desc">Keep a diary of the films you've watched and rated.</p>
        </div>
      </main>
    </div>
  );
}

export default Landing;
