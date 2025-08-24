import React, {useState} from 'react';
import './Login.css'; // Reusing the same CSS
import { useNavigate } from 'react-router-dom';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();
  const handleSignup = async (e) => {
  e.preventDefault(); // prevent page reload

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/main'); // successful signup
    } else {
      setError(data.message || 'Signup failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  }
};


  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Create a Cinemate Account</h2>
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Choose an email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" value={password}
            onChange={(e) => setPassword(e.target.value)}required />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}required />
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="switch-auth-link">
          Already have an account? <a onClick={() => navigate('/login')}>Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
